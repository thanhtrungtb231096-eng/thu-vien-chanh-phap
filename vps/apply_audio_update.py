"""Apply a verified code update on the existing VPS, preserving all user/corpus state."""
import argparse,hashlib,json,os,re,shutil,sqlite3,subprocess,sys,tarfile,tempfile,time,urllib.request
from pathlib import Path

APP=Path('/opt/thuvien')
PYTHON=APP/'.venv/bin/python'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def atomic_copy(source,target):
    target.parent.mkdir(parents=True,exist_ok=True)
    temporary=target.with_name('.'+target.name+'.audio-update')
    try:
        shutil.copyfile(source,temporary);os.chmod(temporary,0o644)
        os.replace(temporary,target)
    finally:temporary.unlink(missing_ok=True)

def state():
    result={}
    for name in ('search.sqlite3','personal.sqlite3'):
        path=APP/'.library-state'/name
        if path.exists():
            stat=path.stat();result[name]={'bytes':stat.st_size,'mtimeNs':stat.st_mtime_ns}
            if name=='personal.sqlite3':result[name]['sha256']=digest(path)
    return result

def wait_for_service(version):
    for _ in range(40):
        try:
            with urllib.request.urlopen('http://127.0.0.1:8090/api/library/status',timeout=2) as response:value=json.load(response)
            if value['indexReady'] and value['version']==version:return value
        except (OSError,ValueError):pass
        time.sleep(.25)
    raise RuntimeError('The updated service did not become ready')

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive',type=Path);parser.add_argument('--release',required=True)
    parser.add_argument('--sha256',required=True)
    parser.add_argument('--refresh-audio-defaults',action='store_true',help='Migrate legacy transport defaults, preserving other settings')
    args=parser.parse_args()
    if os.geteuid()!=0:parser.error('Run with sudo')
    if APP.resolve()!=APP or not PYTHON.is_file():parser.error('Unexpected application directory')
    if not re.fullmatch(r'audio-[0-9-]+',args.release):parser.error('Invalid release identifier')
    if digest(args.archive)!=args.sha256:raise ValueError('Upload checksum mismatch')
    backup=Path('/opt/thuvien-backups')/args.release
    if backup.exists():raise ValueError('Release backup already exists')
    staging_root=Path('/opt/thuvien-updates');staging_root.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=args.release+'-',dir=staging_root) as temporary:
        stage=Path(temporary)
        with tarfile.open(args.archive) as archive:
            members=archive.getmembers()
            if len({m.name for m in members})!=len(members):raise ValueError('Duplicate update entries')
            for member in members:
                relative=Path(member.name)
                if not member.isfile() or relative.is_absolute() or '..' in relative.parts:raise ValueError('Unsafe update entry')
                if member.name!='update-manifest.json' and (not member.name.startswith('web-thuvien/') or member.name.endswith(('.sqlite3','.mp3'))):raise ValueError('Update includes non-code state')
                target=stage/relative;target.parent.mkdir(parents=True,exist_ok=True)
                with archive.extractfile(member) as source:target.write_bytes(source.read())
        manifest=json.loads((stage/'update-manifest.json').read_text(encoding='utf-8'))
        if manifest['format']!='chanh-phap-code-update':raise ValueError('Wrong update format')
        files=manifest['files']
        if {m.name for m in members}!={'update-manifest.json',*(entry['path'] for entry in files)}:raise ValueError('Manifest and payload disagree')
        for entry in files:
            source=stage/entry['path'];target=APP/entry['path']
            if not target.resolve().is_relative_to(APP) or source.stat().st_size!=entry['bytes'] or digest(source)!=entry['sha256']:raise ValueError('Invalid update file')
        tuned=[]
        if args.refresh_audio_defaults:
            relative='web-thuvien/audio.txt'
            original=APP/relative
            if not original.resolve().is_relative_to(APP):raise ValueError('Audio configuration outside the application')
            text=original.read_text(encoding='utf-8-sig') if original.exists() else ''
            updates = [
                ('transport_limit', '175', {'160', '220', '320'}),
                ('provider_first_audio_timeout', '35', {'8', '25'}),
                ('receive_timeout', '35', {'10', '15', '20', '25'}),
                ('workers', '1', {'2', '3', '4'}),
                ('background_workers', '1', {'2', '3', '4'}),
                ('prefetch_concurrency', '1', {'2', '3'}),
                ('startup_buffer_seconds', '6', {'12'}),
                ('startup_wait_ms', '1500', {'8000'}),
                ('cache_mb', '6144', {'512', '1024', '2048'}),
                ('offline_tts', 'true', set()),
                ('offline_fallback', 'true', set()),
                ('stream_long_foreground', 'true', {'false', '0'}),
            ]
            for key, target_val, legacy_vals in updates:
                pattern = rf'(?m)^\s*{re.escape(key)}\s*=\s*(\S+)\s*$'
                match = re.search(pattern, text)
                if not match:
                    text = text.rstrip() + f'\n{key}={target_val}\n'
                    tuned.append(key)
                elif match.group(1) in legacy_vals:
                    text = re.sub(pattern, f'{key}={target_val}', text)
                    tuned.append(key)
            source=stage/relative;source.parent.mkdir(parents=True,exist_ok=True);source.write_text(text,encoding='utf-8')
            files.append({'path':relative,'bytes':source.stat().st_size,'sha256':digest(source)})
        # Upgrade the installed provider before testing the incoming modules.
        installer=shutil.which('uv') or '/usr/local/bin/uv'
        subprocess.run([installer,'pip','uninstall','--python',str(PYTHON),'-q','edge-tts','sherpa-onnx','sherpa-onnx-bin'],check=False)
        subprocess.run([installer,'pip','install','--python',str(PYTHON),'-q','-r',str(stage/'web-thuvien/requirements-audio.txt'),'-r',str(stage/'web-thuvien/requirements-collections.txt')],check=True)
        subprocess.run([installer,'pip','install','--python',str(PYTHON),'-q','--no-deps','vieneu==3.8.4'],check=True)
        preview=stage/'preview';preview.mkdir()
        shutil.copytree(APP/'web-thuvien',preview/'web-thuvien',copy_function=os.link,ignore=shutil.ignore_patterns('__pycache__'))
        (preview/'.library-state').mkdir()
        os.link(APP/'.library-state/search.sqlite3',preview/'.library-state/search.sqlite3')
        for shared in ('.tts-models','.audio-packs'):
            if (APP/shared).is_dir():os.symlink(APP/shared,preview/shared)
        for entry in files:atomic_copy(stage/entry['path'],preview/entry['path'])
        probe='''import hashlib,importlib.metadata,json,sys
from pathlib import Path
sys.path.insert(0,str(Path.cwd()/'web-thuvien'))
import numpy,onnxruntime,sea_g2p,lameenc,vieneu,server,project_paths
assert not project_paths.ORGANIZED
assert server.offline_tts_available()
version=json.loads((project_paths.GENERATED/'library-version.json').read_text())
for name,expected in version['assetHashes'].items():
    assert hashlib.sha256((project_paths.WEB/name).read_bytes()).hexdigest()==expected,name
print(json.dumps({'version':version['version'],'vieneu':importlib.metadata.version('vieneu'),'onnxruntime':onnxruntime.__version__,'assetHashes':'passed','exportedImports':'passed','transportLimit':server.AUDIO_CONFIG.transport_limit,'cacheMb':server.AUDIO_CONFIG.cache_mb,'voices':list(server.VOICES),'offlineVoices':list(server.OFFLINE_VOICES)}))'''
        preflight=subprocess.check_output([str(PYTHON),'-B','-c',probe],cwd=preview,text=True)
        print(preflight,flush=True)
        changed=[entry for entry in files if not (APP/entry['path']).exists() or digest(APP/entry['path'])!=entry['sha256']]
        backup.mkdir(parents=True,mode=0o700)
        for entry in changed:
            original=APP/entry['path']
            if original.exists():
                saved=backup/entry['path'];saved.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(original,saved)
        (backup/'update-manifest.json').write_text(json.dumps(manifest,indent=2))
        subprocess.run(['systemctl','stop','thuvien'],check=True)
        try:
            before=state()
            (backup/'state-before.json').write_text(json.dumps(before,indent=2))
            for entry in changed:
                target=APP/entry['path'];atomic_copy(stage/entry['path'],target);shutil.chown(target,user='thuvien',group='thuvien')
            subprocess.run(['systemctl','start','thuvien'],check=True)
            status=wait_for_service(manifest['version'])
            after=state()
            if before!=after:raise RuntimeError('Unexpected database change')
            subprocess.run(['systemctl','is-active','--quiet','thuvien'],check=True)
        except BaseException:
            subprocess.run(['systemctl','stop','thuvien'],check=False)
            for entry in changed:
                saved=backup/entry['path'];target=APP/entry['path']
                if saved.exists():atomic_copy(saved,target);shutil.chown(target,user='thuvien',group='thuvien')
                else:target.unlink(missing_ok=True)
            subprocess.run(['systemctl','start','thuvien'],check=True)
            raise
        result={'result':'passed','release':args.release,'version':status['version'],'changedFiles':len(changed),'databasesUnchanged':before==after,'rollbackOutsideApplication':str(backup),'preflight':json.loads(preflight),'audioDefaultsUpdated':tuned}
        (backup/'result.json').write_text(json.dumps(result,indent=2)+'\n')
        print(json.dumps(result),flush=True)
if __name__=='__main__':main()

"""Run an isolated loopback-only audio preview; do not modify the live service or its cache."""
import argparse,hashlib,json,os,pwd,shutil,signal,subprocess,tarfile,tempfile,threading,time,urllib.request
from pathlib import Path
from apply_audio_update import APP,PYTHON,atomic_copy

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive',type=Path);parser.add_argument('--sha256',required=True)
    parser.add_argument('--port',type=int,default=8091);parser.add_argument('--seconds',type=int,default=1800)
    args=parser.parse_args()
    if os.geteuid()!=0:parser.error('Run with sudo')
    if not 8091<=args.port<=8099 or not 60<=args.seconds<=3600:parser.error('Invalid preview bounds')
    if hashlib.sha256(args.archive.read_bytes()).hexdigest()!=args.sha256:raise ValueError('Archive checksum mismatch')
    parent=Path('/opt/thuvien-updates');parent.mkdir(exist_ok=True)
    os.chmod(parent,parent.stat().st_mode|0o011)
    stop=threading.Event()
    for sig in (signal.SIGTERM,signal.SIGINT,signal.SIGHUP):signal.signal(sig,lambda *unused:stop.set())
    with tempfile.TemporaryDirectory(prefix='audio-preview-',dir=parent) as temporary:
        root=Path(temporary);payload=root/'payload';payload.mkdir()
        with tarfile.open(args.archive) as archive:
            entries=archive.getmembers()
            if len({m.name for m in entries})!=len(entries):raise ValueError('Duplicate archive path')
            for member in entries:
                relative=Path(member.name)
                if not member.isfile() or relative.is_absolute() or '..' in relative.parts:raise ValueError('Unsafe archive path')
                if member.name!='update-manifest.json' and not member.name.startswith('web-thuvien/'):raise ValueError('Unexpected archive entry')
                target=payload/relative;target.parent.mkdir(parents=True,exist_ok=True)
                with archive.extractfile(member) as source:target.write_bytes(source.read())
        manifest=json.loads((payload/'update-manifest.json').read_text())
        if manifest.get('format')!='chanh-phap-code-update':raise ValueError('Unexpected manifest')
        if {m.name for m in entries}!={'update-manifest.json',*(e['path'] for e in manifest['files'])}:raise ValueError('Incomplete manifest')
        preview=root/'library';preview.mkdir()
        for name in ('web-thuvien','Dai_thua','Dai_Tang_Kinh_Han','EbooksProject','chua phuc minh'):
            source=APP/name
            if source.is_dir():shutil.copytree(source,preview/name,copy_function=os.link,ignore=shutil.ignore_patterns('__pycache__'))
        for entry in manifest['files']:
            source=payload/entry['path'];target=preview/entry['path']
            if not target.resolve().is_relative_to(preview) or source.stat().st_size!=entry['bytes'] or hashlib.sha256(source.read_bytes()).hexdigest()!=entry['sha256']:raise ValueError('Invalid code file')
            atomic_copy(source,target)
        state=preview/'.library-state';state.mkdir()
        os.link(APP/'.library-state/search.sqlite3',state/'search.sqlite3')
        identity=pwd.getpwnam('thuvien');os.chmod(root,0o755)
        for folder in (preview,*[p for p in preview.rglob('*') if p.is_dir() and not p.is_symlink()]):os.chown(folder,identity.pw_uid,identity.pw_gid)
        for shared in ('.tts-models','.audio-packs'):
            if (APP/shared).is_dir():os.symlink(APP/shared,preview/shared)
        env={**os.environ,'NARRATION_PROVIDER_FIRST_AUDIO_TIMEOUT':'25','NARRATION_WARMUP':'false','NARRATION_PREFETCH_DEPTH':'0','NARRATION_STARTUP_BUFFER_SECONDS':'0'}
        def user():os.setgid(identity.pw_gid);os.setuid(identity.pw_uid)
        process=subprocess.Popen([str(PYTHON),'-B',str(preview/'web-thuvien/server.py'),'--host','127.0.0.1','--port',str(args.port)],cwd=preview,env=env,preexec_fn=user)
        try:
            ready=False
            for _ in range(60):
                if process.poll() is not None:raise RuntimeError('Preview process exited during startup')
                try:
                    with urllib.request.urlopen(f'http://127.0.0.1:{args.port}/api/voices',timeout=1) as response:
                        value=json.load(response)
                        ready=value['available'] and value.get('offlineAvailable') and {v['id'] for v in value.get('offlineVoices', [])}=={'vieneu-thien-tam-duc','vieneu-thuc-doan'}
                    if ready:break
                except (OSError,ValueError):pass
                time.sleep(.25)
            if not ready:raise RuntimeError('Preview did not become ready')
            print(json.dumps({'preview':'ready','port':args.port,'version':manifest['version'],'coldCache':True,'productionUnchanged':True,'seconds':args.seconds}),flush=True)
            deadline=time.monotonic()+args.seconds
            while process.poll() is None and time.monotonic()<deadline and not stop.wait(1):pass
        finally:
            process.terminate()
            try:process.wait(timeout=10)
            except subprocess.TimeoutExpired:process.kill();process.wait()
        print(json.dumps({'preview':'stopped','productionUnchanged':True}),flush=True)

if __name__=='__main__':main()

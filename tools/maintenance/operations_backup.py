"""Consistent SQLite backup and restore rehearsal into a new isolated directory."""
from pathlib import Path
from contextlib import closing
import argparse,hashlib,json,sqlite3,sys,tempfile,time,zipfile
BOOTSTRAP=next(p/folder for p in Path(__file__).resolve().parents for folder in ('app','web-thuvien') if (p/folder/'project_paths.py').is_file())
sys.path.insert(0,str(BOOTSTRAP))
from project_paths import ROOT,STATE,CONFIG

def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda:stream.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()

def backup(out,include_index=False):
    if out is None:raise ValueError('Pass --out with an archive path outside the project directory.')
    out=out.resolve()
    if out.is_relative_to(ROOT.resolve()):raise ValueError('Store backups outside the project directory.')
    out.parent.mkdir(parents=True,exist_ok=True)
    if out.exists():raise ValueError('Choose a new archive name; backups are never overwritten.')
    with tempfile.TemporaryDirectory(dir=out.parent) as temporary:
        stage=Path(temporary);files=[]
        for name in ['personal.sqlite3']+(['search.sqlite3'] if include_index else []):
            original=STATE/name
            if not original.exists():continue
            target=stage/name
            with closing(sqlite3.connect(original.as_uri()+'?mode=ro',uri=True)) as source,closing(sqlite3.connect(target)) as destination:source.backup(destination,pages=1024)
            with closing(sqlite3.connect(target)) as db:
                if list(db.execute('PRAGMA quick_check'))!=[('ok',)]:raise ValueError('Snapshot integrity failed.')
            files.append({'path':name,'bytes':target.stat().st_size,'sha256':sha(target)})
        manifest={'format':'chanh-phap-operations','createdAt':time.time(),'scope':'Server personal data; optional derived search index. Browser media/cache and original corpus are not included.','files':files}
        with zipfile.ZipFile(out,'x',zipfile.ZIP_DEFLATED) as archive:
            archive.writestr('manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2))
            for entry in files:archive.write(stage/entry['path'],entry['path'])
    return manifest

def restore(archive,target):
    target=target.resolve()
    if target.is_relative_to(ROOT.resolve()) or target.exists():raise ValueError('Rehearsal target must be a new directory outside the project.')
    with zipfile.ZipFile(archive) as source:
        manifest=json.loads(source.read('manifest.json'))
        if manifest.get('format')!='chanh-phap-operations':raise ValueError('Wrong backup format.')
        for entry in manifest['files']:
            if entry['path'] not in ('personal.sqlite3','search.sqlite3'):raise ValueError('Unexpected file.')
            value=source.read(entry['path'])
            if len(value)!=entry['bytes'] or hashlib.sha256(value).hexdigest()!=entry['sha256']:raise ValueError('Backup checksum failed.')
        target.mkdir(parents=True)
        for entry in manifest['files']:(target/entry['path']).write_bytes(source.read(entry['path']))
    for path in target.glob('*.sqlite3'):
        with closing(sqlite3.connect(path.as_uri()+'?mode=ro',uri=True)) as db:
            if list(db.execute('PRAGMA quick_check'))!=[('ok',)]:raise ValueError('Restored database integrity failed.')
    return {'restoredFiles':len(manifest['files']),'target':str(target)}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--out',type=Path);parser.add_argument('--include-index',action='store_true');parser.add_argument('--restore',type=Path);parser.add_argument('--into',type=Path);args=parser.parse_args()
    started=time.perf_counter()
    result=restore(args.restore,args.into) if args.restore and args.into else backup(args.out,args.include_index)
    print(json.dumps({'elapsedSeconds':round(time.perf_counter()-started,3),'files':len(result.get('files',[])),**({k:v for k,v in result.items() if k!='files'})},ensure_ascii=False))

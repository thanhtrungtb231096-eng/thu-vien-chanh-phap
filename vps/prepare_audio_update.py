"""Create a small code update; books and databases are never included."""
import argparse,hashlib,io,json,sys,tarfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'app'))
from project_paths import APP,WEB,GENERATED,BUILD,MAINTENANCE,CONFIG,DIST,release_relative

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out',type=Path,default=DIST/'audio-update.tar.gz')
    args=parser.parse_args();out=args.out.resolve()
    if out.is_relative_to(ROOT):parser.error('Export outside the project directory.')
    files=list(APP.glob('*.py'))
    files += [p for p in BUILD.iterdir() if p.is_file() and p.suffix in ('.py','.cjs')]
    files += [MAINTENANCE/name for name in ('operations_backup.py','health_probe.py')]
    files += [CONFIG/name for name in ('requirements-audio.txt','requirements-collections.txt','stylesheets.json') if (CONFIG/name).is_file()]
    files += [p for folder in ('js','css','design') if (WEB/folder).is_dir() for p in (WEB/folder).iterdir() if p.is_file()]
    files += [p for p in (WEB/'index.html',WEB/'sw.js',WEB/'manifest.webmanifest',GENERATED/'library-version.json',GENERATED/'offline-assets.json') if p.is_file()]
    version=json.loads((GENERATED/'library-version.json').read_text(encoding='utf-8'))['version']
    entries=[]
    out.parent.mkdir(parents=True,exist_ok=True)
    with tarfile.open(out,'w:gz') as archive:
        for source in sorted(set(files)):
            relative=release_relative(source)
            assert relative.startswith('web-thuvien/') and source.suffix not in ('.sqlite3','.mp3')
            value=source.read_bytes()
            entries.append({'path':relative,'bytes':len(value),'sha256':hashlib.sha256(value).hexdigest()})
            info=tarfile.TarInfo(relative);info.size=len(value);info.mode=0o644
            archive.addfile(info,io.BytesIO(value))
        manifest=json.dumps({'format':'chanh-phap-code-update','version':version,'files':entries},ensure_ascii=False,indent=2).encode()
        info=tarfile.TarInfo('update-manifest.json');info.size=len(manifest);info.mode=0o644
        archive.addfile(info,io.BytesIO(manifest))
    print(json.dumps({'archive':str(out),'bytes':out.stat().st_size,'files':len(entries),'version':version,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()},ensure_ascii=False))
if __name__=='__main__':main()

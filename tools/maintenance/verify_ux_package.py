"""Verify release hash and rehearse exported imports/build without source or personal files."""
from pathlib import Path
import argparse,hashlib,json,subprocess,sys,tempfile,time
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'tests/artifacts/ux-upgrade-20261010'

def digest(path):
    value=hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda:stream.read(1024*1024),b''):value.update(chunk)
    return value.hexdigest()

def main():
    p=argparse.ArgumentParser();p.add_argument('--package',type=Path,default=ROOT.with_name(ROOT.name+' - VPS'));args=p.parse_args()
    package=args.package.resolve();manifest=json.loads((package/'package-manifest.json').read_text(encoding='utf-8'))
    current=json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))
    checks=[];result={'version':current['version'],'checks':checks,'passed':False};start=time.perf_counter()
    try:
        assert digest(package/'thuvien.7z')==manifest['archiveSha256']==(package/'thuvien.7z.sha256').read_text().split()[0]
        files={x['path']:x for x in manifest['files']}
        assert not any('personal.sqlite3' in name or 'backups/' in name for name in files)
        for name in ['web-thuvien/stylesheets.json','web-thuvien/operations_backup.py','web-thuvien/health_probe.py','web-thuvien/library_share.py']:
            assert name in files,name
        assert files['web-thuvien/data/library-version.json']['sha256']==digest(ROOT/'data/generated/library-version.json')
        assert manifest['index']['documents']==current['documents'] and manifest['index']['passages']==current['passages']
        checks.append('Archive/sidecar/manifest SHA-256 agree; current version/corpus and required operation tools included; personal DB excluded')
        with tempfile.TemporaryDirectory(prefix='export-check-',dir=OUT) as temporary:
            target=Path(temporary).resolve();assert target.is_relative_to(ROOT) and target!=ROOT
            patterns=['web-thuvien/*.py','web-thuvien/*.json','web-thuvien/*.txt','web-thuvien/index.html','web-thuvien/sw.js','web-thuvien/js/*.js','web-thuvien/css/*.css','web-thuvien/fonts/*.woff2','web-thuvien/design/*.svg','web-thuvien/design/*.png','web-thuvien/data/library-version.json','web-thuvien/data/library-audit.json','web-thuvien/data/offline-assets.json','web-thuvien/data/dai-tang-kinh/catalog.json']
            subprocess.run([r'C:\Program Files\7-Zip\7z.exe','x',str(package/'thuvien.7z'),'-o'+str(target),'-y','-r-','-bsp0','-bb0',*patterns],check=True,capture_output=True)
            exported=target/'web-thuvien'
            code="""from pathlib import Path
import json,project_paths as paths
import server,library_share,operations_backup,health_probe
assert not paths.ORGANIZED and paths.ROOT==Path.cwd().parent
assert paths.CONFIG==Path.cwd() and paths.STATE==Path.cwd().parent/'.library-state'
assert not server.is_allowed_file(Path.cwd()/'operations_backup.py')
try:operations_backup.restore(Path('missing.zip'),paths.ROOT/'forbidden-rehearsal')
except ValueError:pass
else:raise AssertionError('Restore target inside the application was accepted')
from build_ux_release import build
value=build()
print(json.dumps({'version':value['version'],'documents':value['documents'],'passages':value['passages']}))
"""
            run=subprocess.run([sys.executable,'-X','utf8','-c',code],cwd=exported,check=True,capture_output=True,text=True,encoding='utf-8')
            rebuilt=json.loads(run.stdout.strip().splitlines()[-1]);assert rebuilt['version']==current['version'],rebuilt
            checks.append('Exported server/share/operation modules import; private code blocked; restore cannot escape installation root; release rebuild reproduces identical version')
        result['passed']=True;result['archiveBytes']=(package/'thuvien.7z').stat().st_size;result['manifestFiles']=len(files)
        print(json.dumps(result,ensure_ascii=False))
    except Exception as error:result['failure']=str(error);raise
    finally:
        result['seconds']=round(time.perf_counter()-start,2);(OUT/'package.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':main()

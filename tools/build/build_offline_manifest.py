"""Precache the initial app only; optional tools/fonts/provenance cache on use."""
from pathlib import Path
import sys,json,re
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'app'))
from project_paths import WEB,GENERATED
def build():
    html=(WEB/'index.html').read_text(encoding='utf-8')
    assets=['/web-thuvien/index.html','/web-thuvien/manifest.webmanifest','/web-thuvien/data/library-version.json']
    assets+=['/web-thuvien/'+url for url in re.findall(r'(?:src|href)="((?:js|css)/[^"]+)"',html)]
    assets+=['/web-thuvien/'+p.relative_to(WEB).as_posix() for p in sorted((WEB/'fonts').glob('*.woff2'))]
    assets+=['/web-thuvien/'+p.relative_to(WEB).as_posix() for p in sorted((WEB/'design').glob('*')) if p.suffix in ('.svg','.png')]
    (GENERATED/'offline-assets.json').write_text(json.dumps(sorted(set(assets)),ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'shellAssets':len(set(assets))}))
if __name__=='__main__':build()

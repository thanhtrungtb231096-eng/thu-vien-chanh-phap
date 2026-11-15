"""Keep release identity, asset URLs, offline shell and corpus counts consistent."""
from pathlib import Path
import sys,hashlib,json,re
from datetime import datetime,timezone
BOOTSTRAP=next(p/folder for p in Path(__file__).resolve().parents for folder in ('app','web-thuvien') if (p/folder/'project_paths.py').is_file())
sys.path.insert(0,str(BOOTSTRAP))
from project_paths import ROOT,APP,WEB,GENERATED
from build_catalog_summary import build as summary
from build_offline_manifest import build as offline
from build_css_bundle import build as styles

def build():
    summary()
    styles()
    files={p.relative_to(WEB).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for folder in ('js','css') for p in sorted((WEB/folder).glob('*')) if p.is_file()}
    audit=json.loads((GENERATED/'library-audit.json').read_text(encoding='utf-8'))
    html=(WEB/'index.html').read_text(encoding='utf-8')
    sw=(WEB/'sw.js').read_text(encoding='utf-8')
    backend={name:hashlib.sha256((APP/name).read_bytes()).hexdigest() for name in ('audio_config.py','audio_packs.py','launch.py','library_services.py','library_share.py','narration_engine.py','offline_tts.py','phuc_minh_pdf.py','project_paths.py','server.py','text_normalize.py')}
    identity={'assets':files,'backend':backend,'html':re.sub(r'\?v=[a-f0-9]+','',html),'worker':re.sub(r"const SHELL = '[^']+'", "const SHELL = 'release'",sw),'index':{k:audit[k] for k in ('documents','passages','generatedAt')}}
    version='ux-20261010-'+hashlib.sha256(json.dumps(identity,sort_keys=True).encode()).hexdigest()[:12]
    html=re.sub(r'((?:src|href)=")((?:js|css)/[^"?]+)(?:\?[^" ]*)?"',lambda m:m[1]+m[2]+'?v='+files[m[2]][:12]+'"',html)
    (WEB/'index.html').write_text(html,encoding='utf-8')
    sw=re.sub(r"const SHELL = '[^']+'", "const SHELL = 'cp-shell-"+version+"'",sw)
    (WEB/'sw.js').write_text(sw,encoding='utf-8')
    files.update({name:hashlib.sha256((WEB/name).read_bytes()).hexdigest() for name in ('index.html','sw.js')})
    data={'version':version,'generatedAt':datetime.now(timezone.utc).isoformat(),'documents':audit['documents'],'passages':audit['passages'],'indexGeneratedAt':audit['generatedAt'],'assetHashes':files}
    (GENERATED/'library-version.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    guide=ROOT/'docs/guides/NANG_CAP_THU_VIEN.md'
    if guide.is_file():
        text=guide.read_text(encoding='utf-8')
        number=lambda x:f'{x:,}'.replace(',','.')
        text=re.sub(r'Chỉ mục chứa \*\*[\d.]+ bản văn, [\d.]+ đoạn\*\*',f"Chỉ mục chứa **{number(audit['documents'])} bản văn, {number(audit['passages'])} đoạn**",text)
        guide.write_text(text,encoding='utf-8')
    offline()
    print(json.dumps({'version':version,'documents':audit['documents'],'passages':audit['passages']}))
    return data
if __name__=='__main__':build()

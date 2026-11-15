"""Recognize the two image-only couplet editions with local Vietnamese OCR.

Sources remain unchanged. Derived editions are marked automatic / unproofread.
Resume safely by rerunning this command; completed pages are kept by source hash.
"""

# Locate the shared path registry from either the workspace or an exported release.
from pathlib import Path as _BootstrapPath
import sys as _bootstrap_sys
_bootstrap_app = next(candidate for ancestor in _BootstrapPath(__file__).resolve().parents
                      for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
                      if (candidate / 'project_paths.py').is_file())
_bootstrap_sys.path.insert(0, str(_bootstrap_app))
from project_paths import ROOT, APP, WEB, BUILD, GENERATED, STATE, DEPENDENCIES, AUDIO_CACHE, WORK_CACHE, CONFIG, DIST, REPORTS, SOURCES, public_path, public_relative, release_relative
_bootstrap_sys.path.insert(0, str(BUILD))
_bootstrap_sys.path.insert(0, str(DEPENDENCIES))

from pathlib import Path
from urllib.parse import unquote
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone

sys.path.insert(0,str(DEPENDENCIES))
import pymupdf

def build():
    catalog_path=GENERATED / 'phuc-minh/catalog.json'
    catalog=json.loads(catalog_path.read_text(encoding='utf-8'))
    pending=[]
    for book in catalog['books']:
        if book['id'] not in ('cau-doi-phap-1','cau-doi-phap-2'):continue
        source=public_path(book['pdfFile'])
        sha=hashlib.sha256(source.read_bytes()).hexdigest()
        folder=WORK_CACHE / 'ocr-pages'/(sha[:16]+'-vie-best-v1')
        folder.mkdir(parents=True,exist_ok=True)
        with pymupdf.open(source) as pdf:
            for number,page in enumerate(pdf,1):
                output=folder/f'{number:04d}.json'
                images=[]
                # Couplet pages use two vertical text panels. Keep each panel's
                # top-to-bottom order before moving to the next one.
                crops=[page.rect] if number<=2 else [pymupdf.Rect(page.rect.width*.17,page.rect.height*.09,page.rect.width*.435,page.rect.height*.88),pymupdf.Rect(page.rect.width*.565,page.rect.height*.09,page.rect.width*.83,page.rect.height*.88)]
                for i,crop in enumerate(crops):
                    image=folder/f'{number:04d}-{i}.png'
                    if not output.exists() and not image.exists():page.get_pixmap(matrix=pymupdf.Matrix(3,3),clip=crop,colorspace=pymupdf.csGRAY,alpha=False).save(image)
                    images.append(str(image))
                pending.append({'id':book['id'],'page':number,'images':images,'output':str(output)})
    manifest=WORK_CACHE / 'ocr-pages/manifest.json'
    manifest.write_text(json.dumps(pending,ensure_ascii=False),encoding='utf-8')
    subprocess.run(['node','--require',str(BUILD / 'ocr_compat.cjs'),str(BUILD / 'ocr_documents.cjs'),str(manifest)],check=True)
    destination=GENERATED / 'phuc-minh/ocr';destination.mkdir(exist_ok=True)
    reports=[]
    for book in catalog['books']:
        if book['id'] not in ('cau-doi-phap-1','cau-doi-phap-2'):continue
        entries=[json.loads(Path(e['output']).read_text(encoding='utf-8')) for e in pending if e['id']==book['id']]
        body=[]
        for e in entries:
            # A new line per word is the printed vertical format, not an extra
            # sentence break. Preserve separation between the two couplet panels.
            parts=[' '.join(part.split()) for part in e['text'].split('\n\n') if part.strip()]
            body.append('## Trang '+str(e['page'])+'\n\n'+'\n\n'.join(parts))
        text='# '+book['title']+'\n\n> Bản OCR tự động, chưa hiệu đính. Chữ và thứ tự các vế cần đối chiếu với PDF gốc trước khi dùng để tụng đọc.\n\n'+'\n\n'.join(body)+'\n'
        (destination/(book['id']+'.md')).write_text(text,encoding='utf-8')
        reports.append({'id':book['id'],'title':book['title'],'file':'data/phuc-minh/ocr/'+book['id']+'.md','pages':len(entries),'sourceHash':book['sourceHash'],
                        'engine':'Tesseract.js 7 / Vietnamese / tessdata_best','proofread':False,'pageConfidence':[{'page':e['page'],'confidence':e['confidence']} for e in entries]})
    (destination/'editions.json').write_text(json.dumps({'generatedAt':datetime.now(timezone.utc).isoformat(),'editions':reports},ensure_ascii=False),encoding='utf-8')
    script='window.PHUC_MINH_OCR = '+json.dumps(reports,ensure_ascii=False)+';\n'
    script+='for (const info of window.PHUC_MINH_OCR) { const book = window.PHUC_MINH_DATA.find(b => b.id === info.id); if (book) { book.vietFile = info.file; book.ocrFile = info.file; book.sourceKind = "ocr"; book.textPages = info.pages; } }\n'
    (WEB/'js/phuc-minh-ocr.js').write_text(script,encoding='utf-8')
    print('Derived OCR editions published:',len(reports),flush=True)

if __name__=='__main__':build()

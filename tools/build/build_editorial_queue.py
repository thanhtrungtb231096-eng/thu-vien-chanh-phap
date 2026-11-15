"""Prioritize source review; flags do not constitute a proofreading verdict."""
from pathlib import Path
import json,csv,sys,re
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'app'))
from project_paths import GENERATED,REPORTS
def build():
    audit=json.loads((GENERATED/'library-audit.json').read_text(encoding='utf-8'))
    weights={'replacement-characters':10,'private-use-glyphs':8,'partial-source':7,'missing-source':9,'missing-body':9,'ocr-needs-review':6,'pdf-extraction-needs-review':5,'legacy-font-converted':3,'source-label-mismatch':3}
    queue=[]
    for edition in audit['editions']:
        score=sum(weights.get(flag,0) for flag in edition['flags'])
        if score:queue.append({'priority':score,'key':edition['key'],'mode':edition['mode'],'title':edition['title'],'flags':'; '.join(edition['flags']),'sha256':edition['sha256'],'source':edition['source'],'reviewer':'','status':'awaiting-source-review','usageRights':'unverified'})
    queue.sort(key=lambda x:(-x['priority'],x['key'],x['mode']))
    dest=REPORTS/'editorial';dest.mkdir(parents=True,exist_ok=True)
    with (dest/'review-queue.csv').open('w',encoding='utf-8-sig',newline='') as stream:
        writer=csv.DictWriter(stream,fieldnames=list(queue[0]));writer.writeheader();writer.writerows(queue)
    (dest/'summary.json').write_text(json.dumps({'indexGeneratedAt':audit['generatedAt'],'editions':audit['documents'],'passages':audit['passages'],'priorityEditions':len(queue),'policy':'Embedded objects alone do not indicate incorrect text; human source review and rights verification are required.'},ensure_ascii=False,indent=2),encoding='utf-8')
    from text_normalize import normalize
    catalog=json.loads((GENERATED/'dai-tang-kinh/catalog.json').read_text(encoding='utf-8'))
    metadata=[]
    for book in catalog['books']:
        title=normalize(book['title']).strip()
        if not book.get('metadataVerified') and (title in ('kinh','gioi thieu','loi noi dau','muc luc') or re.fullmatch(r'(ha noi|tp ho chi minh|sai gon)(\s*[-–]?\s*\d{4})?',title) or title.startswith(('vien cao dang','phat hoc vien'))):
            metadata.append({'key':'ebooks:'+book['id'],'title':book['title'],'source':book.get('sourceFile',''),'reason':'Generic heading or institution/date; verify against title page','reviewer':'','status':'awaiting-metadata-review','contentKind':'','edition':'','usageRights':'unverified'})
    with (dest/'metadata-review.csv').open('w',encoding='utf-8-sig',newline='') as stream:
        writer=csv.DictWriter(stream,fieldnames=['key','title','source','reason','reviewer','status','contentKind','edition','usageRights']);writer.writeheader();writer.writerows(metadata)
    print(json.dumps({'priorityEditions':len(queue),'metadataCandidates':len(metadata)}))
if __name__=='__main__':build()

"""Public edition previews for crawlers, with no access to personal data."""
from contextlib import closing
from html import escape
from urllib.parse import parse_qs,urlsplit,urlencode,quote
import ipaddress,json,re,sqlite3
from project_paths import STATE

def preview(request):
    query=parse_qs(urlsplit(request.path).query,max_num_fields=4)
    key=query.get('book',[''])[0];mode=query.get('mode',['viet'])[0];block=query.get('block',[''])[0]
    if len(key)>160 or not re.fullmatch(r'(daithua|daitang|ebooks|phucminh):[\w.-]+',key) or mode not in ('viet','han','note') or (block and not re.fullmatch(r'b-[a-z0-9]+-[a-z0-9]+',block)):
        raise ValueError('Invalid edition link')
    target=STATE/'search.sqlite3'
    if not target.is_file():raise FileNotFoundError('Index unavailable')
    with closing(sqlite3.connect(f'file:{target.as_posix()}?mode=ro',uri=True)) as db:
        row=db.execute('SELECT doc,meta FROM documents WHERE book_key=? AND mode=?',(key,mode)).fetchone()
        if not row:raise FileNotFoundError('Edition not found')
        meta=json.loads(row[1]);passage=db.execute('SELECT chapter,text FROM passages WHERE doc=? AND block=?',(row[0],block)).fetchone() if block else None
        if block and not passage:raise FileNotFoundError('Passage not found')
    scheme='https' if ipaddress.ip_address(request.client_address[0]).is_loopback and request.headers.get('X-Forwarded-Proto')=='https' else 'http'
    origin=scheme+'://'+request.headers.get('Host','localhost')
    canonical=origin+'/share?'+urlencode({'book':key,'mode':mode,**({'block':block} if block else {})})
    link='/web-thuvien/index.html#read/'+quote(key,safe='')+'/'+mode+('/'+block if block else '')
    title=meta['title'];language={'viet':'Bản Việt','han':'Hán văn','note':'Khảo chứng'}[mode]
    description=(passage[1][:240] if passage else title+' · '+language+' · Đọc và nghe tại Thư viện Chánh Pháp.')
    chapter=passage[0] if passage else ''
    html=f'''<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)} · Chánh Pháp</title><meta name="description" content="{escape(description,quote=True)}">
<meta property="og:type" content="article"><meta property="og:title" content="{escape(title,quote=True)}"><meta property="og:description" content="{escape(description,quote=True)}">
<meta property="og:url" content="{escape(canonical,quote=True)}"><meta property="og:image" content="{escape(origin,quote=True)}/web-thuvien/opengraph.png?v=2"><meta property="og:locale" content="vi_VN">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{escape(title,quote=True)}"><meta name="twitter:description" content="{escape(description,quote=True)}"><link rel="canonical" href="{escape(canonical,quote=True)}">
<style>body{{margin:0;background:#fbf8f0;color:#19392e;font:18px/1.8 system-ui,sans-serif}}main{{max-width:680px;margin:8vh auto;padding:24px}}h1{{font:700 30px/1.4 Georgia,serif}}a{{display:inline-block;padding:12px 20px;background:#285a46;color:white;border-radius:8px;min-height:24px}}blockquote{{margin:24px 0;border-left:3px solid #a5894e;padding-left:20px;overflow-wrap:anywhere}}</style>
</head><body><main><p>THƯ VIỆN CHÁNH PHÁP · {language}</p><h1>{escape(title)}</h1><p>{escape(chapter)}</p><blockquote>{escape(description)}</blockquote><p>Bản chữ cần đối chiếu với nguồn; trang chia sẻ hiển thị trích đoạn từ chỉ mục hiện tại.</p><a class="open-edition" href="{escape(link,quote=True)}">Mở {'đoạn kinh' if block else 'bản kinh'}</a></main></body></html>'''
    return html.encode('utf-8')

def handle(request):
    try:request.response(200,preview(request),'text/html; charset=utf-8')
    except ValueError:request.response(400,{'error':'Đường dẫn bản kinh không hợp lệ.'})
    except (FileNotFoundError,sqlite3.Error):request.response(404,{'error':'Chưa tìm thấy bản hoặc đoạn trong chỉ mục. Hãy mở thư viện để chọn bản hiện có.'})

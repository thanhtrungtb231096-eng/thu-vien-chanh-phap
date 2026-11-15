"""Private local services: passage search, edition audit and paired-device personal data."""

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
from urllib.parse import parse_qs, urlsplit
import hashlib
import json
import re
import secrets
import sqlite3
import threading
import time
import ipaddress
from contextlib import closing
from text_normalize import normalize

LOCK = threading.Lock()
ATTEMPTS = {}
CREATIONS = {}
RUNTIME_MANIFEST=json.loads((GENERATED/'library-version.json').read_text(encoding='utf-8')) if (GENERATED/'library-version.json').is_file() else {'version':10}

def connect_sync():
    STATE.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(STATE / 'personal.sqlite3', timeout=10)
    db.executescript('''
      CREATE TABLE IF NOT EXISTS profiles(id TEXT PRIMARY KEY, token_hash TEXT UNIQUE);
      CREATE TABLE IF NOT EXISTS pairs(code_hash TEXT PRIMARY KEY, profile TEXT, expires REAL);
      CREATE TABLE IF NOT EXISTS records(profile TEXT, key TEXT, id TEXT, value TEXT, stamp INTEGER, device TEXT, deleted INTEGER, PRIMARY KEY(profile,key,id));
      CREATE TABLE IF NOT EXISTS devices(token_hash TEXT PRIMARY KEY, profile TEXT);
      CREATE TABLE IF NOT EXISTS conflicts(profile TEXT, key TEXT, id TEXT, value TEXT, stamp INTEGER, device TEXT, saved REAL);
    ''')
    columns={row[1] for row in db.execute('PRAGMA table_info(devices)')}
    for name,definition in [('id','TEXT'),('name',"TEXT DEFAULT 'Thiết bị đã ghép'"),('created','REAL DEFAULT 0'),('seen','REAL DEFAULT 0')]:
        if name not in columns:db.execute(f'ALTER TABLE devices ADD COLUMN {name} {definition}')
    # Move legacy owner tokens into revocable device records exactly once.
    db.execute('INSERT OR IGNORE INTO devices(token_hash,profile) SELECT token_hash,id FROM profiles WHERE token_hash IS NOT NULL')
    db.execute('UPDATE devices SET id=substr(token_hash,1,24) WHERE id IS NULL')
    db.execute('UPDATE profiles SET token_hash=NULL WHERE token_hash IS NOT NULL')
    db.execute('CREATE UNIQUE INDEX IF NOT EXISTS conflict_identity ON conflicts(profile,key,id,stamp,device)')
    db.commit()
    return db

def digest(value): return hashlib.sha256(value.encode()).hexdigest()

def sync_peer(handler):
    peer=handler.client_address[0]
    if ipaddress.ip_address(peer).is_loopback:
        forwarded=handler.headers.get('X-Forwarded-For','').split(',')[-1].strip()
        try:
            if forwarded:return str(ipaddress.ip_address(forwarded))
        except ValueError:pass
    return peer

def search(query):
    raw = query.get('q', [''])[0].strip()[:160]
    phrase = raw.startswith('"') and raw.endswith('"')
    text = normalize(raw[1:-1] if phrase else raw)
    if len(text) < 2: return {'results': [], 'total': 0}
    target = STATE / 'search.sqlite3'
    if not target.exists(): raise ValueError('Chưa có chỉ mục. Chạy build_library_index.py.')
    tokens = re.findall(r'[^\W_]+', text, re.UNICODE)[:12]
    if not tokens: return {'results': [], 'total': 0}
    where, params = [], []
    mode, collection = query.get('mode', [''])[0], query.get('collection', [''])[0]
    if mode in ('viet','han','note'): where.append('d.mode=?'); params.append(mode)
    if collection in ('daithua','daitang','phucminh','ebooks'): where.append('d.book_key LIKE ?'); params.append(collection + ':%')
    original = query.get('q',[''])[0].strip()
    expression = '"'+' '.join(tokens)+'"' if original.startswith('"') and original.endswith('"') else ' AND '.join('"' + t + '"*' for t in tokens)
    # Han has no word separators; use substring matching for Han queries.
    chinese = bool(re.search(r'[\u3400-\u9fff]', text))
    with closing(sqlite3.connect(f'file:{target.as_posix()}?mode=ro', uri=True)) as db:
        base = 'FROM passages p JOIN documents d ON d.doc=p.doc '
        if chinese:
            where.insert(0, 'p.text LIKE ?'); params.insert(0, '%' + text.replace('%','').replace('_','') + '%')
            order = 'p.pid'
        else:
            base += 'JOIN fulltext f ON f.rowid=p.pid '
            where.insert(0, 'fulltext MATCH ?'); params.insert(0, expression)
            order = 'bm25(fulltext)'
        clause = ' WHERE ' + ' AND '.join(where)
        total = db.execute('SELECT COUNT(*) ' + base + clause, params).fetchone()[0]
        offset = min(10000, max(0, int(query.get('offset',['0'])[0])))
        rows = db.execute('SELECT d.meta,p.block,p.chapter,p.page,p.text ' + base + clause + ' ORDER BY ' + order + ' LIMIT 30 OFFSET ?', params + [offset]).fetchall()
    results = []
    for meta, block, chapter, page, content in rows:
        book = json.loads(meta)
        normalized = normalize(content)
        pos = max(0, normalized.find(tokens[0]))
        start = max(0, pos-100)
        excerpt = content[start:start+420]
        results.append({k:book.get(k) for k in ('key','type','id','title','mode','source','pdf','sourceKind')} | {'block':block,'chapter':chapter,'page':page,'excerpt':excerpt})
    return {'results': results, 'total':total, 'offset':offset}

def edition(query):
    target = STATE / 'search.sqlite3'
    if not target.exists(): raise ValueError('Chưa có chỉ mục nguồn.')
    with closing(sqlite3.connect(f'file:{target.as_posix()}?mode=ro', uri=True)) as db:
        row = db.execute('SELECT meta FROM documents WHERE book_key=? AND mode=?', (query.get('key',[''])[0],query.get('mode',['viet'])[0])).fetchone()
    return json.loads(row[0]) if row else {'error':'Bản này chỉ có PDF; chưa có văn bản để rà soát.'}

def services_get(handler):
    path = urlsplit(handler.path)
    if path.path=='/share':
        from library_share import handle
        handle(handler);return True
    if path.path not in ('/api/search','/api/edition','/api/library/status'): return False
    if path.path == '/api/library/status':
        version=RUNTIME_MANIFEST
        handler.response(200, {**{k:v for k,v in version.items() if k!='assetHashes'},'indexReady':(STATE/'search.sqlite3').is_file(),'features':['fulltext','editions','offline','pronunciation','recordings','sync','device-revocation','study','content-issues']})
        return True
    try:
        query = parse_qs(path.query, max_num_fields=8)
        handler.response(200, search(query) if path.path == '/api/search' else edition(query))
    except (ValueError, sqlite3.Error): handler.response(400, {'error':'Không thực hiện được truy vấn. Kiểm tra chỉ mục và từ khóa.'})
    return True

def services_post(handler):
    path = urlsplit(handler.path).path
    if not path.startswith('/api/sync/'): return False
    try:
        size = int(handler.headers.get('Content-Length','0'))
        if not 0 < size <= 5_000_000: raise ValueError('Dữ liệu đồng bộ quá lớn hoặc rỗng.')
        data = json.loads(handler.rfile.read(size))
        if not isinstance(data,dict): raise ValueError('Dữ liệu không hợp lệ.')
        now = time.time()
        with LOCK, closing(connect_sync()) as db, db:
            db.execute('DELETE FROM pairs WHERE expires < ?', (now,))
            if path == '/api/sync/create':
                peer=sync_peer(handler)
                recent=[t for t in CREATIONS.get(peer,[]) if t>now-3600]
                if len(recent)>=10:
                    handler.response(429,{'error':'Đã tạo quá nhiều hồ sơ. Thử lại sau một giờ.'});return True
                CREATIONS[peer]=recent+[now]
                token, profile = secrets.token_hex(32), secrets.token_hex(16)
                device_id=secrets.token_hex(12)
                db.execute('INSERT INTO profiles VALUES(?,NULL)', (profile,))
                db.execute('INSERT INTO devices VALUES(?,?,?,?,?,?)',(digest(token),profile,device_id,str(data.get('name','Thiết bị đầu tiên'))[:100],now,now))
                handler.response(200, {'token':token,'profile':profile,'deviceId':device_id}); return True
            if path == '/api/sync/pair':
                peer = sync_peer(handler)
                recent = [t for t in ATTEMPTS.get(peer,[]) if t > now-600]
                if len(recent) >= 10:
                    handler.response(429, {'error':'Đã thử quá nhiều mã. Vui lòng đợi 10 phút.'}); return True
                ATTEMPTS[peer] = recent + [now]
                code = str(data.get('code','')).replace(' ','').replace('-','')
                if not re.fullmatch(r'\d{8}',code): raise ValueError('Mã ghép nối gồm 8 chữ số.')
                pair = db.execute('SELECT profile FROM pairs WHERE code_hash=? AND expires>?', (digest(code),now)).fetchone()
                if not pair: raise ValueError('Mã hết hạn hoặc không đúng.')
                profile = pair[0]
                if db.execute('SELECT COUNT(*) FROM devices WHERE profile=?',(profile,)).fetchone()[0]>=20:raise ValueError('Đã đạt giới hạn thiết bị.')
                token = secrets.token_hex(32)
                device_id=secrets.token_hex(12)
                db.execute('INSERT INTO devices VALUES(?,?,?,?,?,?)',(digest(token),profile,device_id,str(data.get('name','Thiết bị mới'))[:100],now,now))
                db.execute('DELETE FROM pairs WHERE code_hash=?',(digest(code),))
                handler.response(200, {'token':token,'profile':profile,'deviceId':device_id}); return True
            token = handler.headers.get('Authorization','').removeprefix('Bearer ')
            if not re.fullmatch(r'[a-f0-9]{64}', token):
                handler.response(401, {'error':'Cần ghép nối thiết bị.'}); return True
            account = db.execute('SELECT profile,id FROM devices WHERE token_hash=?',(digest(token),)).fetchone()
            if not account:
                handler.response(401, {'error':'Phiên ghép nối không còn hợp lệ.'}); return True
            profile = account[0]
            device_id=account[1]
            db.execute('UPDATE devices SET seen=? WHERE token_hash=?',(now,digest(token)))
            if path == '/api/sync/devices':
                rows=db.execute('SELECT id,name,created,seen FROM devices WHERE profile=? ORDER BY created',(profile,)).fetchall()
                handler.response(200,{'devices':[{'id':i,'name':n,'createdAt':int(c*1000),'lastSeenAt':int(s*1000),'current':i==device_id} for i,n,c,s in rows]});return True
            if path == '/api/sync/rename':
                name=data.get('name')
                if not isinstance(name,str) or not 1<=len(name.strip())<=100:raise ValueError('Tên thiết bị không hợp lệ.')
                db.execute('UPDATE devices SET name=? WHERE profile=? AND id=?',(name.strip(),profile,device_id))
                handler.response(200,{'renamed':True});return True
            if path == '/api/sync/revoke':
                target=data.get('deviceId')
                if not isinstance(target,str):raise ValueError('Thiết bị không hợp lệ.')
                changed=db.execute('DELETE FROM devices WHERE profile=? AND id=?',(profile,target)).rowcount
                if not changed:raise ValueError('Thiết bị không thuộc hồ sơ.')
                # Pair codes created before revocation must not keep a lost device connected.
                db.execute('DELETE FROM pairs WHERE profile=?',(profile,))
                handler.response(200,{'revoked':True,'current':target==device_id});return True
            if path == '/api/sync/delete':
                if data.get('confirm')!='DELETE':raise ValueError('Cần xác nhận xóa hồ sơ.')
                for table in ('devices','pairs','records','conflicts'):db.execute(f'DELETE FROM {table} WHERE profile=?',(profile,))
                db.execute('DELETE FROM profiles WHERE id=?',(profile,))
                handler.response(200,{'deleted':True});return True
            if path == '/api/sync/conflicts':
                rows=db.execute('SELECT key,id,value,stamp,device,saved FROM conflicts WHERE profile=? ORDER BY saved DESC LIMIT 100',(profile,)).fetchall()
                handler.response(200,{'conflicts':[{'key':k,'id':i,'value':json.loads(v),'stamp':s,'device':d,'savedAt':int(t*1000)} for k,i,v,s,d,t in rows]});return True
            if path == '/api/sync/code':
                code = f'{secrets.randbelow(100_000_000):08d}'
                db.execute('DELETE FROM pairs WHERE profile=?',(profile,))
                db.execute('INSERT INTO pairs VALUES(?,?,?)',(digest(code),profile,now+600))
                handler.response(200, {'code':code,'expires':int((now+600)*1000)}); return True
            if path != '/api/sync/exchange':
                handler.response(404, {'error':'Không tìm thấy.'}); return True
            changes = data.get('records',[])
            if not isinstance(changes,list) or len(changes)>20000: raise ValueError('Dữ liệu không hợp lệ.')
            validated = []
            for r in changes:
                if not isinstance(r,dict): raise ValueError('Bản ghi không hợp lệ.')
                key, rid, device, stamp = r.get('key'),r.get('id'),r.get('device'),r.get('stamp')
                if not isinstance(key,str) or not re.match(r'^(cp3:|dhamma_|reader_)',key) or len(key)>250: raise ValueError('Khóa không hợp lệ.')
                if not isinstance(rid,str) or len(rid)>500 or not isinstance(device,str) or len(device)>100 or not isinstance(stamp,int) or not 0 <= stamp <= int(now*1000)+300000: raise ValueError('Bản ghi không hợp lệ.')
                value = json.dumps(r.get('value'),ensure_ascii=False)
                if len(value)>500000: raise ValueError('Bản ghi quá lớn.')
                validated.append((profile,key,rid,value,stamp,device,int(bool(r.get('deleted')))))
            for p,k,i,v,s,d,x in validated:
                if not re.search(r'note|marks|corrections',k,re.I):continue
                old=db.execute('SELECT value,stamp,device FROM records WHERE profile=? AND key=? AND id=?',(p,k,i)).fetchone()
                if old and old[0]!=v and old[2]!=d:
                    loser=old if (s,d)>(old[1],old[2]) else (v,s,d)
                    db.execute('INSERT OR IGNORE INTO conflicts VALUES(?,?,?,?,?,?,?)',(p,k,i,*loser,now))
            db.execute('DELETE FROM conflicts WHERE profile=? AND rowid NOT IN (SELECT rowid FROM conflicts WHERE profile=? ORDER BY saved DESC LIMIT 100)',(profile,profile))
            db.executemany('''INSERT INTO records VALUES(?,?,?,?,?,?,?) ON CONFLICT(profile,key,id) DO UPDATE SET
                value=excluded.value,stamp=excluded.stamp,device=excluded.device,deleted=excluded.deleted
                WHERE (excluded.stamp>records.stamp OR (excluded.stamp=records.stamp AND excluded.device>records.device))''',validated)
            rows = db.execute('SELECT key,id,value,stamp,device,deleted FROM records WHERE profile=?',(profile,)).fetchall()
            if len(rows)>20000: raise ValueError('Hồ sơ vượt giới hạn bản ghi.')
            total=db.execute('SELECT COALESCE(SUM(length(CAST(value AS BLOB))),0) FROM records WHERE profile=?',(profile,)).fetchone()[0]
            if total>10_000_000:raise ValueError('Hồ sơ vượt giới hạn dung lượng.')
            conflicts=db.execute('SELECT COUNT(*) FROM conflicts WHERE profile=?',(profile,)).fetchone()[0]
            handler.response(200, {'records':[{'key':k,'id':i,'value':json.loads(v),'stamp':s,'device':d,'deleted':bool(x)} for k,i,v,s,d,x in rows], 'updatedAt':int(now*1000),'conflictsCount':conflicts})
    except (ValueError, TypeError, json.JSONDecodeError): handler.response(400, {'error':'Dữ liệu hoặc mã ghép nối không hợp lệ.'})
    except sqlite3.Error: handler.response(503, {'error':'Kho đồng bộ đang bận. Hãy thử lại.'})
    return True

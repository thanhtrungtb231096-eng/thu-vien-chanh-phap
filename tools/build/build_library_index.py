"""Build full-text passages, source provenance and a non-destructive quality audit."""

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
import re
import sqlite3
import subprocess
import unicodedata
from datetime import datetime, timezone
from contextlib import closing


def load(name):
    source = (WEB / 'js' / name).read_text(encoding='utf-8')
    return json.JSONDecoder().raw_decode(source.split(' = ', 1)[1].lstrip())[0]

from text_normalize import normalize

def publish(target):
    with closing(sqlite3.connect(target)) as db:
        keys=('key','type','id','title','mode','length','flags','sha256','source','pdf','sourceKind')
        reports=[{k:e.get(k) for k in keys} for (meta,) in db.execute('SELECT meta FROM documents') for e in [json.loads(meta)]]
        count=db.execute('SELECT COUNT(*) FROM passages').fetchone()[0]
    if target.resolve() != (STATE / 'search.sqlite3').resolve():
        target.replace(STATE / 'search.sqlite3')
    (STATE / 'index-input.ndjson').unlink(missing_ok=True)
    fixes=GENERATED / 'catalog-source-fixes.json'
    report={'generatedAt':datetime.now(timezone.utc).isoformat(),'documents':len(reports),'passages':count,
            'method':'Automatic checks; source files remain unchanged. Human proofreading is not implied.','editions':reports,
            'catalogFixes':json.loads(fixes.read_text(encoding='utf-8')) if fixes.is_file() else []}
    (GENERATED / 'library-audit.json').write_text(json.dumps(report,ensure_ascii=False),encoding='utf-8')
    guide=ROOT/'docs/guides/NANG_CAP_THU_VIEN.md'
    if guide.is_file():
        number=lambda x:f'{x:,}'.replace(',','.')
        guide.write_text(re.sub(r'Chỉ mục chứa \*\*[\d.]+ bản văn, [\d.]+ đoạn\*\*',f"Chỉ mục chứa **{number(len(reports))} bản văn, {number(count)} đoạn**",guide.read_text(encoding='utf-8')),encoding='utf-8')
    print(json.dumps({'documents':len(reports),'passages':count,'indexBytes':(STATE/'search.sqlite3').stat().st_size}))

def catalog(collection=None):
    ocr_path = GENERATED / 'phuc-minh/ocr/editions.json'
    ocr = {x['id']:x for x in json.loads(ocr_path.read_text(encoding='utf-8'))['editions']} if ocr_path.is_file() else {}
    collections = [('daithua', load('dai-thua-data.js')), ('daitang', load('dai-tang-han-data.js')['texts']), ('phucminh', load('phuc-minh-data.js'))]
    if (WEB / 'js/dai-tang-kinh-data.js').is_file():
        collections.append(('ebooks', load('dai-tang-kinh-data.js')))
    for kind, books in collections:
        if collection and collection != kind: continue
        for book in books:
            files = book.get('files', {})
            modes = {'viet': files.get('vietMd') or book.get('vietFile') or ocr.get(book['id'],{}).get('file'), 'han': files.get('hanMd') or book.get('hanFile'), 'note': files.get('noteMd')}
            for mode, url in modes.items():
                if not url: continue
                path = public_path(url)
                if not path.is_relative_to(ROOT) or path.suffix.lower() not in ('.md', '.txt'):
                    raise ValueError(f'Invalid source: {url}')
                yield {'key': kind + ':' + book['id'], 'type': kind, 'id': book['id'], 'title': book.get('vietTitle') or book['title'],
                       'mode': mode, 'source': url, 'pdf': files.get(mode + 'Pdf') or (book.get('pdfFile') if mode == 'viet' else None),
                       'absolute': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None,
                       'missing': not path.is_file(),
                       'credits': book.get('credits', []), 'sourceFlags': book.get('flags', []),
                       'sourceKind': 'ocr' if kind == 'phucminh' and book['id'] in ocr else 'word' if kind == 'ebooks' else 'text'}

def build():
    STATE.mkdir(parents=True, exist_ok=True)
    target = STATE / 'search.next.sqlite3'
    if target.exists(): target.unlink()
    db = sqlite3.connect(target)
    db.executescript('''
      CREATE TABLE documents (doc INTEGER PRIMARY KEY, book_key TEXT, mode TEXT, meta TEXT);
      CREATE TABLE passages (pid INTEGER PRIMARY KEY, doc INTEGER, block TEXT, chapter TEXT, page INTEGER, text TEXT);
      CREATE VIRTUAL TABLE fulltext USING fts5(normalized, content='', tokenize='unicode61');
      CREATE INDEX passage_doc ON passages(doc);
      CREATE INDEX document_key ON documents(book_key,mode);
    ''')
    entries = list(catalog())
    # A temporary manifest file avoids pipe deadlock on large catalogs.
    manifest = STATE / 'index-input.ndjson'
    manifest.write_text('\n'.join(json.dumps(x, ensure_ascii=False) for x in entries), encoding='utf-8')
    reports = []
    with manifest.open('r', encoding='utf-8') as source:
        process = subprocess.Popen(['node', str(BUILD / 'index_documents.cjs')], stdin=source, stdout=subprocess.PIPE, text=True, encoding='utf-8')
        for number, line in enumerate(process.stdout, 1):
            entry = json.loads(line)
            blocks = entry.pop('blocks')
            headings = [{'block': b['id'], 'title': b['heading']['title'], 'level': b['heading']['level']} for b in blocks if b.get('heading')]
            flags = list(entry.get('sourceFlags', []))
            if entry.get('missing'): flags.append('missing-source')
            if entry['replacementCharacters']: flags.append('replacement-characters')
            if entry['suspiciousGlyphs']: flags.append('private-use-glyphs')
            if entry['length'] < 100: flags.append('short-text')
            if entry['type'] == 'phucminh': flags.append('pdf-extraction-needs-review')
            if entry.get('sourceKind') == 'ocr': flags.append('ocr-needs-review')
            if not headings: flags.append('no-structural-headings')
            entry.update({'headings': headings, 'flags': flags, 'audit': 'automatic', 'proofread': False})
            docid = db.execute('INSERT INTO documents(book_key,mode,meta) VALUES(?,?,?)', (entry['key'], entry['mode'], json.dumps(entry, ensure_ascii=False))).lastrowid
            chapter, page = '', None
            for block in blocks:
                if block.get('heading'):
                    chapter = block['heading']['title']
                    match = re.fullmatch(r'Trang (\d+)', chapter)
                    if match: page = int(match[1])
                text = block['text']
                for start in range(0, len(text), 1300):
                    part = text[start:start+1450]
                    pid = db.execute('INSERT INTO passages(doc,block,chapter,page,text) VALUES(?,?,?,?,?)', (docid, block['id'], chapter, page, part)).lastrowid
                    db.execute('INSERT INTO fulltext(rowid,normalized) VALUES(?,?)', (pid, normalize(part)))
            reports.append({k: entry[k] for k in ('key','type','id','title','mode','length','flags','sha256','source','pdf')})
            if number % 250 == 0: db.commit(); print(f'Indexed {number}/{len(entries)} editions', flush=True)
        if process.wait(): raise RuntimeError('Reader parser failed; index was not published')
    count = db.execute('SELECT COUNT(*) FROM passages').fetchone()[0]
    db.execute("INSERT INTO fulltext(fulltext) VALUES('optimize')")
    db.commit(); db.close()
    publish(target)

if __name__ == '__main__': build()

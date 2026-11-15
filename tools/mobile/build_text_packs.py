"""Build compact, zlib-compressed SQLite offline sutra packs (.pack.db) with embedded FTS5
accent-insensitive search indexes for iOS & Android."""
from __future__ import annotations

from contextlib import closing
from pathlib import Path
import argparse
import hashlib
import json
import sqlite3
import sys
import time
import zlib

BOOTSTRAP = next(
    candidate
    for ancestor in Path(__file__).resolve().parents
    for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
    if (candidate / 'project_paths.py').is_file()
)
sys.path.insert(0, str(BOOTSTRAP))
from project_paths import ROOT, STATE, GENERATED, MOBILE_DIST, public_path, public_relative
from text_normalize import normalize

CORE_SUTRA_KEYS = {
    'daithua:dt_10_1',
    'daitang:T08n0251',
    'daithua:dt_05_1',
    'daithua:dt_06_2',
    'daithua:dt_06_1',
    'daithua:dt_10_2',
    'daithua:dt_01_2',
    'daithua:dt_01_4',
    'daitang:T17n0779',
    'daithua:dt_01_5',
    'daithua:dt_01_6',
    'daithua:dt_01_7',
    'daithua:dt_01_1',
    'daithua:dt_10_9',
    'daithua:dt_03_2',
    'daithua:dt_10_21',
    'daitang:T04n0210',
    'ebooks:ep-e86ff84cd87b',
}

PACK_SPECS = (
    {
        'id': 'core-bundled',
        'filename': 'core-bundled.pack.db',
        'title': 'Gói Cốt Lõi Nhúng Sẵn (Tủ sách Phúc Minh & 18 Kinh Nhật Tụng)',
        'bundled': True,
    },
    {
        'id': 'daithua',
        'filename': 'daithua.pack.db',
        'title': 'Kho Kinh Điển Đại Thừa Toàn Tập',
        'collection': 'daithua',
        'bundled': False,
    },
    {
        'id': 'ebooks',
        'filename': 'namtong-ebooks.pack.db',
        'title': 'Kho Nam Tông Nikāya & Sách Giảng Giải',
        'collection': 'ebooks',
        'bundled': False,
    },
    {
        'id': 'daitang',
        'filename': 'daitanghan.pack.db',
        'title': 'Đại Tạng Kinh Hán Tạng Toàn Tập',
        'collection': 'daitang',
        'bundled': False,
    },
)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def normalize_public_url(url: str) -> str:
    u = (url or '').strip()
    if not u.startswith('/'):
        u = '/web-thuvien/' + u.lstrip('./')
    return u


def extract_markdown_passages(raw_text: str) -> list[tuple[str, str, int | None, str]]:
    """Fallback passage splitter when local/storage/state/search.sqlite3 is absent (e.g. clean CI runner)."""
    passages: list[tuple[str, str, int | None, str]] = []
    chapter = ''
    page: int | None = None
    block_idx = 0
    for para in raw_text.split('\n\n'):
        clean = ' '.join(para.strip().split())
        if not clean:
            continue
        block_idx += 1
        block_id = f'b-{block_idx}'
        if clean.startswith('#'):
            heading = clean.lstrip('#').strip()
            if heading.lower().startswith('trang ') and heading[6:].strip().isdigit():
                page = int(heading[6:].strip())
            else:
                chapter = heading[:140]
            continue
        passages.append((block_id, chapter, page, clean))
    return passages


def create_pack_db(dest_file: Path, doc_rows: list[tuple[int, str, str, str]], src_db: sqlite3.Connection | None) -> dict:
    tmp_file = dest_file.with_suffix('.tmp.db')
    tmp_file.unlink(missing_ok=True)
    dest_file.parent.mkdir(parents=True, exist_ok=True)

    doc_count = 0
    section_count = 0
    raw_bytes_total = 0

    with closing(sqlite3.connect(tmp_file)) as out_db:
        out_db.executescript('''
            PRAGMA page_size = 4096;
            PRAGMA journal_mode = OFF;
            PRAGMA synchronous = OFF;
            CREATE TABLE pack_info (key TEXT PRIMARY KEY, value TEXT);
            CREATE TABLE manuscripts (
                doc INTEGER PRIMARY KEY,
                url TEXT UNIQUE,
                book_key TEXT,
                mode TEXT,
                title TEXT,
                meta TEXT,
                raw_zlib BLOB,
                raw_bytes INTEGER
            );
            CREATE INDEX idx_manuscripts_key ON manuscripts(book_key, mode);
            CREATE TABLE sections (
                sid INTEGER PRIMARY KEY,
                doc INTEGER,
                block TEXT,
                chapter TEXT,
                page INTEGER,
                preview TEXT
            );
            CREATE INDEX idx_sections_doc ON sections(doc);
            CREATE VIRTUAL TABLE fulltext USING fts5(
                normalized,
                content='',
                detail='none',
                tokenize='unicode61'
            );
        ''')

        seen_urls: set[str] = set()
        for src_doc_id, book_key, mode, meta_raw in doc_rows:
            meta = json.loads(meta_raw)
            src_url = meta.get('source', '')
            if not src_url:
                continue
            try:
                md_path = public_path(src_url)
            except ValueError:
                continue
            if not md_path.is_file():
                continue

            norm_url = '/' + public_relative(md_path)
            if norm_url in seen_urls:
                continue
            seen_urls.add(norm_url)

            raw_bytes = md_path.read_bytes()
            raw_bytes_total += len(raw_bytes)
            compressed = zlib.compress(raw_bytes, level=9)

            compact_meta = {
                k: meta.get(k)
                for k in ('key', 'type', 'id', 'title', 'mode', 'source', 'pdf', 'sourceKind', 'sha256')
            }
            cur = out_db.execute(
                'INSERT INTO manuscripts(url, book_key, mode, title, meta, raw_zlib, raw_bytes) VALUES(?,?,?,?,?,?,?)',
                (
                    norm_url,
                    book_key,
                    mode,
                    compact_meta.get('title') or book_key,
                    json.dumps(compact_meta, ensure_ascii=False, separators=(',', ':')),
                    compressed,
                    len(raw_bytes),
                ),
            )
            local_doc_id = cur.lastrowid
            doc_count += 1

            # Group contiguous passages by chapter/page (~3500 chars) to keep FTS5 ultra-compact & fast
            if src_db is not None:
                p_rows = src_db.execute(
                    'SELECT block, chapter, page, text FROM passages WHERE doc=? ORDER BY pid',
                    (src_doc_id,),
                ).fetchall()
            else:
                p_rows = extract_markdown_passages(raw_bytes.decode('utf-8', errors='replace'))

            buf_texts: list[str] = []
            buf_len = 0
            anchor_block = ''
            anchor_chapter = ''
            anchor_page = None

            def flush_section():
                nonlocal section_count, buf_texts, buf_len
                if not buf_texts:
                    return
                joined = ' '.join(buf_texts)
                preview = joined[:320]
                sid = out_db.execute(
                    'INSERT INTO sections(doc, block, chapter, page, preview) VALUES(?,?,?,?,?)',
                    (local_doc_id, anchor_block, anchor_chapter, anchor_page, preview),
                ).lastrowid
                if mode != 'han':
                    out_db.execute(
                        'INSERT INTO fulltext(rowid, normalized) VALUES(?,?)',
                        (sid, normalize(joined)),
                    )
                section_count += 1
                buf_texts = []
                buf_len = 0

            for block, chapter, page, p_text in p_rows:
                if not buf_texts:
                    anchor_block = block
                    anchor_chapter = chapter or ''
                    anchor_page = page
                elif (chapter or '') != anchor_chapter or buf_len + len(p_text) > 3600:
                    flush_section()
                    anchor_block = block
                    anchor_chapter = chapter or ''
                    anchor_page = page
                buf_texts.append(p_text)
                buf_len += len(p_text)
            flush_section()

        out_db.execute("INSERT INTO fulltext(fulltext) VALUES('optimize')")
        out_db.commit()
        out_db.execute('VACUUM')
        out_db.commit()

    dest_file.unlink(missing_ok=True)
    tmp_file.replace(dest_file)
    size_bytes = dest_file.stat().st_size
    return {
        'documents': doc_count,
        'sections': section_count,
        'rawBytes': raw_bytes_total,
        'packBytes': size_bytes,
        'packMiB': round(size_bytes / (1024 ** 2), 2),
        'sha256': sha256_file(dest_file),
    }


def verify_pack_db(pack_file: Path) -> dict:
    with closing(sqlite3.connect(f'file:{pack_file.as_posix()}?mode=ro', uri=True)) as db:
        assert db.execute('PRAGMA quick_check').fetchone() == ('ok',), f'Corrupt DB: {pack_file}'
        sample = db.execute('SELECT url, raw_zlib, raw_bytes FROM manuscripts LIMIT 1').fetchone()
        assert sample is not None, f'Empty pack: {pack_file}'
        url, raw_zlib, raw_bytes = sample
        inflated = zlib.decompress(raw_zlib)
        assert len(inflated) == raw_bytes, 'Decompressed byte length mismatch'

        t0 = time.monotonic()
        hits = db.execute(
            '''
            SELECT m.book_key, m.title, s.block, s.chapter, s.preview
            FROM fulltext f
            JOIN sections s ON s.sid = f.rowid
            JOIN manuscripts m ON m.doc = s.doc
            WHERE fulltext MATCH '"phat"*'
            LIMIT 10
            '''
        ).fetchall()
        query_ms = round((time.monotonic() - t0) * 1000.0, 2)
        return {'sampleUrl': url, 'ftsHitsSample': len(hits), 'ftsQueryMs': query_ms}


def load_audit_doc_rows() -> list[tuple[int, str, str, str]]:
    audit_path = GENERATED / 'library-audit.json'
    if not audit_path.is_file():
        raise FileNotFoundError(f'Neither search.sqlite3 nor {audit_path} found.')
    audit = json.loads(audit_path.read_text(encoding='utf-8'))
    rows: list[tuple[int, str, str, str]] = []
    for idx, ed in enumerate(audit.get('editions', []), start=1):
        rows.append((idx, ed.get('key', ''), ed.get('mode', ''), json.dumps(ed, ensure_ascii=False)))
    return rows


def build_all_packs(out_dir: Path, only_id: str = '') -> dict:
    t0 = time.monotonic()
    search_db_path = STATE / 'search.sqlite3'
    packs_out = []
    specs = [s for s in PACK_SPECS if not only_id or s['id'] == only_id]

    def run_specs(all_docs: list[tuple[int, str, str, str]], src_db: sqlite3.Connection | None):
        for spec in specs:
            if spec['id'] == 'core-bundled':
                selected = [
                    r for r in all_docs
                    if r[1].startswith('phucminh:') or r[1] in CORE_SUTRA_KEYS
                ]
            else:
                prefix = spec['collection'] + ':'
                selected = [r for r in all_docs if r[1].startswith(prefix)]

            dest = out_dir / spec['filename']
            stats = create_pack_db(dest, selected, src_db)
            check = verify_pack_db(dest)
            packs_out.append({
                'id': spec['id'],
                'title': spec['title'],
                'filename': spec['filename'],
                'bundled': spec['bundled'],
                **stats,
                **check,
            })
            print(f"[built] {spec['filename']} -> {stats['packMiB']} MiB ({stats['documents']} docs, FTS {check['ftsQueryMs']} ms)", flush=True)

    if search_db_path.is_file():
        with closing(sqlite3.connect(f'file:{search_db_path.as_posix()}?mode=ro', uri=True)) as src_db:
            all_docs = src_db.execute('SELECT doc, book_key, mode, meta FROM documents ORDER BY doc').fetchall()
            run_specs(all_docs, src_db)
    else:
        all_docs = load_audit_doc_rows()
        run_specs(all_docs, None)

    manifest = {
        'format': 'chanh-phap-mobile-text-packs-v1',
        'version': '1.0.0',
        'packs': packs_out,
        'totalPackMiB': round(sum(p['packMiB'] for p in packs_out), 2),
        'elapsedSeconds': round(time.monotonic() - t0, 2),
    }
    if not only_id or not (out_dir / 'manifest.json').is_file():
        (out_dir / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--out',
        type=Path,
        default=MOBILE_DIST / 'cdn-upload' / 'text-packs',
        help='Output directory outside workspace',
    )
    parser.add_argument('--only', default='', help='Build only a single pack ID (e.g. core-bundled)')
    parser.add_argument('--allow-in-repo', action='store_true', help='Allow output path inside workspace on CI')
    args = parser.parse_args()
    out_dir = args.out.resolve()
    if not args.allow_in_repo and out_dir.is_relative_to(ROOT.resolve()):
        raise SystemExit('Output directory must reside outside the project workspace.')
    result = build_all_packs(out_dir, only_id=args.only)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

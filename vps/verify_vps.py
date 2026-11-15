"""Verify an extracted deployment or the live VPS without writing personal state."""
import argparse
from contextlib import closing
import hashlib
import importlib.metadata
import json
from pathlib import Path
import re
import sqlite3
import sys
import threading
import unicodedata
from urllib.error import HTTPError
from urllib.parse import quote, unquote, urlencode
from urllib.request import urlopen


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest()


def load_catalog(root, name):
    source = (root / 'web-thuvien/js' / name).read_text(encoding='utf-8')
    return json.JSONDecoder().raw_decode(source.split(' = ', 1)[1].lstrip())[0]


def verify(root, manifest, live_port=None):
    files = {entry['path']: entry for entry in manifest['files']}
    assert '.library-state/personal.sqlite3' not in files
    if live_port is None:
        for relative, entry in files.items():
            path = (root / relative).resolve()
            assert path.is_relative_to(root) and path.is_file(), relative
            assert path.stat().st_size == entry['bytes'] and digest(path) == entry['sha256'], relative
        assert not (root / '.library-state/personal.sqlite3').exists()
    samples = {}
    with closing(sqlite3.connect((root / '.library-state/search.sqlite3').as_uri() + '?mode=ro', uri=True)) as db:
        if live_port is None:
            assert list(db.execute('PRAGMA quick_check')) == [('ok',)]
        documents = db.execute('SELECT COUNT(*) FROM documents').fetchone()[0]
        passages = db.execute('SELECT COUNT(*) FROM passages').fetchone()[0]
        assert documents == manifest['index']['documents']
        assert passages == manifest['index']['passages']
        for kind in ('daithua', 'daitang', 'phucminh', 'ebooks'):
            meta, passage = db.execute("SELECT d.meta,p.text FROM documents d JOIN passages p ON d.doc=p.doc WHERE d.book_key LIKE ? AND d.mode='viet' AND length(p.text)>80 ORDER BY p.pid LIMIT 1", (kind + ':%',)).fetchone()
            meta = json.loads(meta)
            path = (root / 'web-thuvien' / unquote(meta['source'])).resolve()
            assert path.is_relative_to(root)
            normalized = ''.join(char for char in unicodedata.normalize('NFD', passage.lower().replace('đ', 'd')) if not unicodedata.combining(char))
            samples[kind] = {'key': meta['key'], 'source': path.relative_to(root).as_posix(), 'query': '"' + ' '.join(re.findall(r'[^\W_]+', normalized)[:3]) + '"'}
    catalog_sizes = {
        'daithua': len(load_catalog(root, 'dai-thua-data.js')),
        'daitang': len(load_catalog(root, 'dai-tang-han-data.js')['texts']),
        'phucminh': len(load_catalog(root, 'phuc-minh-data.js')),
        'ebooks': len(load_catalog(root, 'dai-tang-kinh-data.js')),
    }
    httpd = None
    if live_port is None:
        sys.path.insert(0, str(root / 'web-thuvien'))
        import server
        httpd = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        httpd.allowed_patterns = set()
        threading.Thread(target=httpd.serve_forever, daemon=True).start()
        live_port = httpd.server_address[1]
    base = f'http://127.0.0.1:{live_port}'

    def get_json(path):
        with urlopen(base + path, timeout=60) as response:
            return json.load(response)

    def check_file(relative):
        with urlopen(base + '/' + quote(relative, safe='/'), timeout=60) as response:
            assert hashlib.sha256(response.read()).hexdigest() == files[relative]['sha256'], relative

    try:
        assert get_json('/api/library/status')['indexReady']
        assert get_json('/api/voices')['available']
        for relative in ('web-thuvien/index.html', 'web-thuvien/js/dai-tang-kinh-data.js', 'web-thuvien/css/reader-fullscreen.css'):
            check_file(relative)
        search_totals = {}
        for kind, sample in samples.items():
            result = get_json('/api/search?' + urlencode({'q': sample['query'], 'collection': kind, 'mode': 'viet'}))
            assert result['total'] > 0 and result['results']
            assert all(entry['type'] == kind for entry in result['results'])
            search_totals[kind] = result['total']
            assert get_json('/api/edition?' + urlencode({'key': sample['key'], 'mode': 'viet'}))['key'] == sample['key']
            check_file(sample['source'])
        word = next(relative for relative in files if relative.startswith('EbooksProject/') and relative.endswith('.doc'))
        check_file(word)
        phuc = load_catalog(root, 'phuc-minh-data.js')[0]
        pdf = (root / 'web-thuvien' / unquote(phuc['pdfFile'])).resolve().relative_to(root).as_posix()
        check_file(pdf)
        with urlopen(base + '/api/phucminh/page?' + urlencode({'id': phuc['id'], 'page': 1}), timeout=60) as response:
            image = response.read()
            assert image.startswith(b'\x89PNG\r\n\x1a\n') and len(image) > 500
        for path in ('/.library-state/search.sqlite3', '/.library-state/personal.sqlite3', '/web-thuvien/server.py'):
            try:
                urlopen(base + path, timeout=10)
                raise AssertionError('Private file was served: ' + path)
            except HTTPError as error:
                assert error.code == 404
        return {'result': 'passed', 'mode': 'live' if httpd is None else 'preflight', 'catalogs': catalog_sizes,
                'documents': documents, 'passages': passages, 'searchTotals': search_totals,
                'packages': {name: importlib.metadata.version(name) for name in ('vieneu', 'onnxruntime', 'sea-g2p', 'lameenc', 'pymupdf')},
                'checks': ['hashes', 'home', 'four-collection-search', 'edition', 'texts', 'original-word', 'pdf', 'pdf-preview', 'voice-availability', 'private-files-blocked']}
    finally:
        if httpd:
            httpd.shutdown()
            httpd.server_close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('root', type=Path)
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--live-port', type=int)
    args = parser.parse_args()
    result = verify(args.root.resolve(), json.loads(args.manifest.read_text(encoding='utf-8')), args.live_port)
    print(json.dumps(result, ensure_ascii=False), flush=True)

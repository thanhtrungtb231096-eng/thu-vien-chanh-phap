"""Check stable public links, all four collections and privacy after a layout change."""
from pathlib import Path
import hashlib
import json
import sqlite3
import sys
import threading
from urllib.error import HTTPError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'app'))
from project_paths import WEB, STATE, DEPENDENCIES, REPORTS, public_path, public_relative
sys.path.insert(0, str(DEPENDENCIES))
import server


class QuietHandler(server.Handler):
    def log_message(self, *args): pass


def main():
    httpd = server.ThreadingHTTPServer(('127.0.0.1', 0), QuietHandler)
    httpd.allowed_patterns = set()
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    base = 'http://127.0.0.1:' + str(httpd.server_address[1])
    checks = []
    def read(path, method='GET', headers=None):
        with urlopen(Request(base + path, method=method, headers=headers or {}), timeout=60) as response:
            return response.read(), dict(response.headers)
    def get_json(path): return json.loads(read(path)[0])
    def check_file(url):
        path = public_path(url)
        legacy = '/' + quote(public_relative(path), safe='/')
        body, headers = read(legacy)
        assert hashlib.sha256(body).digest() == hashlib.sha256(path.read_bytes()).digest(), url
        assert int(read(legacy, 'HEAD')[1]['Content-Length']) == len(body), url
    try:
        assert get_json('/api/library/status')['indexReady']
        assert get_json('/api/voices')['available']
        assert read('/')[0].find(b'/web-thuvien/index.html') >= 0
        check_file('/web-thuvien/index.html')
        check_file('/web-thuvien/data/offline-assets.json')
        assert read('/web-thuvien/sw.js')[1]['Service-Worker-Allowed'] == '/'
        checks.append('frontend, generated data, voice dependency, HEAD and service worker')
        with sqlite3.connect((STATE / 'search.sqlite3').as_uri() + '?mode=ro', uri=True) as db:
            assert db.execute('PRAGMA quick_check').fetchone() == ('ok',)
            counts = {'documents': db.execute('SELECT COUNT(*) FROM documents').fetchone()[0],
                      'passages': db.execute('SELECT COUNT(*) FROM passages').fetchone()[0]}
            for kind in ('daithua', 'daitang', 'phucminh', 'ebooks'):
                (raw,) = db.execute("SELECT meta FROM documents WHERE book_key LIKE ? AND mode='viet' ORDER BY doc LIMIT 1", (kind + ':%',)).fetchone()
                book = json.loads(raw)
                check_file(book['source'])
                assert get_json('/api/search?' + urlencode({'q': 'phật', 'collection': kind}))['total'] > 0
                assert get_json('/api/edition?' + urlencode({'key': book['key'], 'mode': 'viet'}))['sha256'] == book['sha256']
                checks.append(kind + ': search, edition, source bytes and unchanged URL')
        ebooks = json.JSONDecoder().raw_decode((WEB / 'js/dai-tang-kinh-data.js').read_text(encoding='utf-8').split(' = ', 1)[1].lstrip())[0]
        check_file(next(book['sourceFile'] for book in ebooks if book['sourceFile'].endswith('.doc')))
        phuc = json.JSONDecoder().raw_decode((WEB / 'js/phuc-minh-data.js').read_text(encoding='utf-8').split(' = ', 1)[1].lstrip())[0][0]
        check_file(phuc['pdfFile'])
        assert read('/api/phucminh/page?' + urlencode({'id': phuc['id'], 'page': 1}))[0].startswith(b'\x89PNG\r\n\x1a\n')
        checks.append('Word download, PDF download and rendered PDF preview')
        private = ('/local/storage/state/search.sqlite3', '/local/storage/state/personal.sqlite3',
                   '/local/runtime/python/vieneu/__init__.py', '/local/open_library.ps1',
                   '/vps/prepare_vps.py', '/vps/output/package-manifest.json',
                   '/storage/state/search.sqlite3', '/storage/state/personal.sqlite3', '/config/allowed_hosts.txt',
                   '/runtime/python/vieneu/__init__.py', '/app/server.py', '/app/web/index.html',
                   '/data/sources/Dai_Tang_Kinh_Han/01_A_Ham/T01n0001_viet.md', '/docs/guides/CAU_TRUC_THU_MUC.md',
                   '/web-thuvien/server.py', '/.library-state/personal.sqlite3',
                   '/web-thuvien/data/%2e%2e/%2e%2e/storage/state/personal.sqlite3')
        for path in private:
            try:
                read(path)
                raise AssertionError('Private path was served: ' + path)
            except HTTPError as error: assert error.code == 404, path
        try:
            read('/web-thuvien/index.html', headers={'Host': 'untrusted.invalid'})
            raise AssertionError('Untrusted host accepted')
        except HTTPError as error: assert error.code == 403
        checks.append('physical paths, private state, traversal and untrusted hosts blocked')
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            errors, failed = [], []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('response', lambda response: failed.append(response.url) if response.status >= 400 and response.url.startswith(base) else None)
            page.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
            page.wait_for_selector('#reader-phuc-pdf', state='attached')
            assert not errors and not failed, (errors, failed)
            page.evaluate("LibraryUI.open('daitang','T11n0311','viet')")
            page.wait_for_function('window.Reader && Reader.state.ready')
            assert page.evaluate('Reader.state.doc.length > 50000')
            assert not errors and not failed, (errors, failed)
            browser.close()
        checks.append('Chromium opens the library and reads a Vietnamese book without asset errors')
        outcome = {'result': 'passed', **counts, 'checks': checks}
        destination = REPORTS / 'restructure'
        destination.mkdir(parents=True, exist_ok=True)
        (destination / 'verification.json').write_text(json.dumps(outcome, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(json.dumps(outcome, ensure_ascii=False), flush=True)
    finally:
        httpd.shutdown()
        httpd.server_close()
        thread.join()


if __name__ == '__main__': main()

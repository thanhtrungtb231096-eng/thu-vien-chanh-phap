"""End-to-end verification for Chánh Pháp iOS/Android Mobile System:
1. Quantized ONNX AI TTS & SQLite FTS5 pack artifacts outside workspace
2. /mobile-packs/ HTTP 200, HEAD, Range 206 resumable download, Capacitor CORS & traversal blocking
3. Playwright Native Mobile Bridge simulation backed by real core-bundled.pack.db (offline reading, offline FTS5 search, lock-screen queue delegation, paragraph sync & Vault UI)
4. Standard Desktop Web mode zero-regression check."""
from __future__ import annotations

from contextlib import closing
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
import hashlib
import json
import sqlite3
import sys
import threading
import zlib

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'app'))
from project_paths import DEPENDENCIES, MOBILE_DIST
from text_normalize import normalize
sys.path.insert(0, str(DEPENDENCIES))
import server


class QuietHandler(server.Handler):
    def log_message(self, *args):
        pass


def sha256_prefix(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def check_artifacts() -> dict:
    # Ensure zero generated mobile bloat inside main workspace
    for forbidden in ('node_modules', 'www', 'ios', 'android'):
        assert not (ROOT / 'mobile' / forbidden).exists(), f'Workspace bloat detected: mobile/{forbidden}'

    tts_dir = MOBILE_DIST / 'cdn-upload' / 'tts' / 'vieneu-nano-mobile-v1'
    tts_manifest = json.loads((tts_dir / 'manifest.json').read_text(encoding='utf-8'))
    for item in tts_manifest['files']:
        fpath = tts_dir / item['name']
        assert fpath.is_file(), f'Missing TTS file: {fpath}'
        assert fpath.stat().st_size == item['mobileBytes'], f'Size mismatch: {fpath}'
        assert sha256_prefix(fpath) == item['sha256'], f'SHA-256 mismatch: {fpath}'

    packs_dir = MOBILE_DIST / 'cdn-upload' / 'text-packs'
    packs_manifest = json.loads((packs_dir / 'manifest.json').read_text(encoding='utf-8'))
    assert len(packs_manifest['packs']) == 4
    for p in packs_manifest['packs']:
        db_file = packs_dir / p['filename']
        assert db_file.is_file(), f'Missing text pack: {db_file}'
        assert db_file.stat().st_size == p['packBytes'], f'Size mismatch: {db_file}'

    staged_www = MOBILE_DIST / 'app-staging' / 'www'
    assert (staged_www / 'index.html').is_file()
    assert (staged_www / 'js' / 'mobile-bridge.js').is_file()
    assert (staged_www / 'packs' / 'core-bundled.pack.db').is_file()
    return {
        'ttsBundleMiB': tts_manifest['totalMiB'],
        'textPacksTotalMiB': packs_manifest['totalPackMiB'],
    }


def query_real_core_pack_manuscript(core_db: Path, url: str) -> dict:
    with closing(sqlite3.connect(f'file:{core_db.as_posix()}?mode=ro', uri=True)) as db:
        row = db.execute('SELECT raw_zlib, raw_bytes FROM manuscripts WHERE url = ? LIMIT 1', (url,)).fetchone()
        if not row:
            return {'found': False}
        text = zlib.decompress(row[0]).decode('utf-8')
        assert len(row[0]) > 0 and len(text.encode('utf-8')) == row[1]
        return {'found': True, 'content': text, 'packId': 'core-bundled'}


def query_real_core_pack_fts(core_db: Path, q: str, collection: str = '', mode: str = '') -> dict:
    tokens = normalize(q.replace('"', '')).split()[:10]
    if not tokens:
        return {'results': [], 'total': 0}
    expr = ' AND '.join(f'"{t}"*' for t in tokens)
    sql = '''
        SELECT m.meta, s.block, s.chapter, s.page, s.preview
        FROM fulltext f
        JOIN sections s ON s.sid = f.rowid
        JOIN manuscripts m ON m.doc = s.doc
        WHERE fulltext MATCH ?
    '''
    params: list = [expr]
    if mode:
        sql += ' AND m.mode = ?'
        params.append(mode)
    if collection:
        sql += ' AND m.book_key LIKE ?'
        params.append(collection + ':%')
    sql += ' LIMIT 30'

    results = []
    with closing(sqlite3.connect(f'file:{core_db.as_posix()}?mode=ro', uri=True)) as db:
        for meta_raw, block, chapter, page, preview in db.execute(sql, params).fetchall():
            obj = json.loads(meta_raw)
            obj['block'] = block
            obj['chapter'] = chapter
            if page is not None:
                obj['page'] = page
            obj['excerpt'] = preview
            results.append(obj)
    return {'results': results, 'total': len(results)}


def main() -> None:
    checks: list[str] = []
    artifact_stats = check_artifacts()
    checks.append('Quantized ONNX TTS bundle, 4 SQLite .pack.db vaults and clean workspace verified')

    httpd = server.ThreadingHTTPServer(('127.0.0.1', 0), QuietHandler)
    httpd.allowed_patterns = set()
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{httpd.server_address[1]}'

    def req(path: str, method: str = 'GET', headers: dict | None = None):
        r = Request(base + path, method=method, headers=headers or {})
        return urlopen(r, timeout=30)

    try:
        # 1. Server /mobile-packs/ HTTP 200, HEAD, Range 206, CORS & Security tests
        with req('/mobile-packs/text-packs/manifest.json') as resp:
            assert resp.status == 200
            manifest = json.loads(resp.read())
            assert manifest['format'] == 'chanh-phap-mobile-text-packs-v1'

        with req('/mobile-packs/tts/vieneu-nano-mobile-v1/vector_estimator.onnx', method='HEAD') as resp:
            assert resp.status == 200
            assert resp.headers.get('Accept-Ranges') == 'bytes'
            assert int(resp.headers['Content-Length']) > 70_000_000

        with req('/mobile-packs/text-packs/core-bundled.pack.db', headers={'Range': 'bytes=0-1023'}) as resp:
            assert resp.status == 206
            chunk = resp.read()
            assert len(chunk) == 1024
            assert chunk.startswith(b'SQLite format 3\x00')
            assert resp.headers.get('Content-Range', '').startswith('bytes 0-1023/')

        # Capacitor iOS & Android WebView CORS check
        for cap_origin in ('capacitor://localhost', 'https://localhost'):
            with req('/api/library/status', method='OPTIONS', headers={'Origin': cap_origin}) as resp:
                assert resp.status == 204
                allow_origins = resp.headers.get_all('Access-Control-Allow-Origin') or []
                assert allow_origins == [cap_origin], f'Unexpected CORS headers: {allow_origins}'

        # Untrusted cross-origin & path traversal must be rejected
        try:
            req('/api/library/status', headers={'Origin': 'https://attacker.invalid'})
            raise AssertionError('Untrusted origin accepted')
        except HTTPError as err:
            assert err.code == 403

        for bad in (
            '/mobile-packs/../app/server.py',
            '/mobile-packs/text-packs/%2e%2e/secret.json',
            '/mobile-packs/private/test.json',
            '/mobile-packs/tts/vieneu-nano-mobile-v1/evil.py',
        ):
            try:
                req(bad)
                raise AssertionError(f'Bad mobile-pack path served: {bad}')
            except HTTPError as err:
                assert err.code == 404, (bad, err.code)

        checks.append('/mobile-packs/ HTTP 200, HEAD, Range 206, Capacitor CORS and traversal blocking passed')

        # 2. Playwright Native Mobile Bridge + Real SQLite Pack Vault Simulation
        core_db = MOBILE_DIST / 'app-staging' / 'www' / 'packs' / 'core-bundled.pack.db'
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)

            # Context A: Native Mobile App Mode
            mobile_ctx = browser.new_context(viewport={'width': 390, 'height': 844})
            mobile_page = mobile_ctx.new_page()
            page_errors: list[str] = []
            mobile_page.on('pageerror', lambda e: page_errors.append(str(e)))

            queue_calls: list[dict] = []
            reminder_calls: list[dict] = []

            mobile_page.expose_function(
                '__pyGetManuscript',
                lambda url: query_real_core_pack_manuscript(core_db, url),
            )
            mobile_page.expose_function(
                '__pySearchVault',
                lambda q, col, mode: query_real_core_pack_fts(core_db, q, col, mode),
            )
            mobile_page.expose_function(
                '__pyRecordQueue',
                lambda kind, payload: queue_calls.append({'kind': kind, 'payload': payload}),
            )
            mobile_page.expose_function(
                '__pyRecordReminder',
                lambda payload: reminder_calls.append(payload),
            )

            mobile_page.add_init_script('''
                (() => {
                  const listeners = { playbackState: [], downloadProgress: [] };
                  let lastQueue = null;
                  window.__CHANH_PHAP_MOBILE_SIM__ = {
                    async getVaultStatus() {
                      return { packs: ['core-bundled'], ttsInstalled: true, freeDiskMiB: 24576 };
                    },
                    async getManuscript({ url }) {
                      return await window.__pyGetManuscript(url);
                    },
                    async cacheManuscript() {},
                    async searchVault({ q, collection, mode }) {
                      return await window.__pySearchVault(q || '', collection || '', mode || '');
                    },
                    async startQueue(opts) {
                      lastQueue = opts;
                      await window.__pyRecordQueue('startQueue', {
                        bookKey: opts.bookKey,
                        bookTitle: opts.bookTitle,
                        voice: opts.voice,
                        rate: opts.rate,
                        segmentCount: opts.segments.length,
                        firstText: opts.segments[0]?.text || ''
                      });
                      const ev = {
                        bookKey: opts.bookKey,
                        status: 'playing',
                        index: opts.startIndex || 0,
                        currentTime: opts.startSeconds || 0,
                        duration: 9.5,
                        voice: opts.voice,
                        voiceLabel: 'Thiền Tâm Đức · AI Nội Bộ (Ngoại tuyến)',
                        packActive: false,
                        onDeviceAiActive: true,
                        message: 'Đang đọc trên chip điện thoại'
                      };
                      listeners.playbackState.forEach(fn => fn(ev));
                    },
                    async pauseQueue() {
                      await window.__pyRecordQueue('pauseQueue', {});
                      if (lastQueue) {
                        listeners.playbackState.forEach(fn => fn({
                          bookKey: lastQueue.bookKey,
                          status: 'paused',
                          index: 2,
                          currentTime: 4.2,
                          duration: 9.5,
                          voice: lastQueue.voice,
                          voiceLabel: 'Thiền Tâm Đức · AI Nội Bộ (Ngoại tuyến)',
                          packActive: false
                        }));
                      }
                    },
                    async stopQueue() {
                      await window.__pyRecordQueue('stopQueue', {});
                    },
                    async seekQueue(opts) {
                      await window.__pyRecordQueue('seekQueue', opts);
                    },
                    async updateQueueOptions(opts) {
                      await window.__pyRecordQueue('updateQueueOptions', opts);
                    },
                    async getQueueState() {
                      return {
                        bookKey: lastQueue?.bookKey || '',
                        status: 'playing',
                        index: 2,
                        currentTime: 4.2,
                        duration: 9.5,
                        voice: 'vieneu-thien-tam-duc',
                        voiceLabel: 'Thiền Tâm Đức · AI Nội Bộ'
                      };
                    },
                    async scheduleDailyPracticeReminder(opts) {
                      await window.__pyRecordReminder(opts);
                    },
                    addListener(name, fn) {
                      if (listeners[name]) listeners[name].push(fn);
                      return Promise.resolve({ remove: () => {} });
                    },
                    __emitLockScreenAdvance(index, seconds) {
                      if (!lastQueue) return;
                      listeners.playbackState.forEach(fn => fn({
                        bookKey: lastQueue.bookKey,
                        status: 'playing',
                        index,
                        currentTime: seconds,
                        duration: 11.0,
                        voice: lastQueue.voice,
                        voiceLabel: 'Thiền Tâm Đức · AI Nội Bộ (Ngoại tuyến)',
                        packActive: false,
                        onDeviceAiActive: true
                      }));
                    }
                  };
                })();
            ''')

            mobile_page.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
            mobile_page.wait_for_selector('#reader-phuc-pdf', state='attached')
            assert mobile_page.evaluate('window.MobileBridge?.isNative === true')
            assert mobile_page.evaluate('document.documentElement.dataset.nativeApp === "true"')

            # Test A: Offline Sutra Reading from real core-bundled.pack.db (block any server .md fetch!)
            server_md_hits: list[str] = []
            mobile_page.route('**/*.md', lambda route: (server_md_hits.append(route.request.url), route.abort()))
            mobile_page.evaluate("LibraryUI.open('daithua', 'dt_10_1', 'viet')")
            mobile_page.wait_for_function('window.Reader && Reader.state.ready && Reader.state.key === "daithua:dt_10_1"')
            doc_len = mobile_page.evaluate('Reader.state.doc.length')
            assert doc_len > 800, f'Unexpected Heart Sutra length: {doc_len}'
            assert not server_md_hits, f'Expected 100% local SQLite vault hit, got network requests: {server_md_hits}'
            checks.append('Offline reading from embedded core-bundled.pack.db verified (0 network .md fetches)')

            # Test B: Offline SQLite FTS5 Search (accent-insensitive) when server /api/search is unreachable
            mobile_page.route('**/api/search*', lambda route: route.abort())
            offline_search = mobile_page.evaluate('''async () => {
                const res = await fetch('/api/search?q=' + encodeURIComponent('yet de ba la yet de'));
                return await res.json();
            }''')
            assert offline_search['offline'] is True
            assert offline_search['total'] >= 1
            assert any(r['key'] == 'daithua:dt_10_1' for r in offline_search['results'])
            checks.append('Offline accent-insensitive FTS5 search across SQLite vault verified')

            # Test C: Lock-screen Native Audio Queue delegation & paragraph follow sync
            mobile_page.evaluate("DharmaPlayerStore.playItem({ type: 'daithua', id: 'dt_10_1' })")
            mobile_page.wait_for_function("Audiobook.state.status === 'playing'")
            assert any(c['kind'] == 'startQueue' and c['payload']['segmentCount'] >= 3 for c in queue_calls), queue_calls

            # Simulate iPhone lock-screen advancing to segment 2 while screen is off
            mobile_page.evaluate('window.__CHANH_PHAP_MOBILE_SIM__.__emitLockScreenAdvance(2, 3.8)')
            assert mobile_page.evaluate('Audiobook.state.index === 2')
            saved_pos = mobile_page.evaluate("LibraryStore.read('listen:daithua:dt_10_1')")
            assert saved_pos['index'] == 2

            # Toggle pause via PersistentPlayer -> must invoke native pauseQueue
            mobile_page.evaluate('DharmaPlayerStore.toggle()')
            mobile_page.wait_for_function("Audiobook.state.status === 'paused'")
            assert any(c['kind'] == 'pauseQueue' for c in queue_calls)
            checks.append('Native lock-screen queue start, segment advance, persistence and pause verified')

            # Test D: Mobile Offline Vault UI & Daily Practice Reminder inside #tab-offline
            mobile_page.wait_for_selector('#mobile-vault-root', state='attached')
            pack_cards = mobile_page.locator('#mobile-pack-list .mobile-pack-item').count()
            assert pack_cards == 5, f'Expected 5 pack cards, got {pack_cards}'
            mobile_page.evaluate("document.getElementById('mobile-reminder-save').click()")
            mobile_page.wait_for_function('document.getElementById("mobile-reminder-status").textContent.includes("05:30")')
            assert len(reminder_calls) == 1 and reminder_calls[0]['enabled'] is True
            assert not page_errors, f'Mobile page JS errors: {page_errors}'
            checks.append('Offline Vault UI (5 packs) & daily practice reminder verified')
            mobile_ctx.close()

            # Context B: Standard Desktop Web Mode Zero-Regression Check
            desktop_ctx = browser.new_context(viewport={'width': 1280, 'height': 800})
            desktop_page = desktop_ctx.new_page()
            desktop_errors: list[str] = []
            desktop_page.on('pageerror', lambda e: desktop_errors.append(str(e)))
            desktop_page.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
            assert desktop_page.evaluate('window.MobileBridge?.isNative === false')
            assert desktop_page.evaluate('document.documentElement.dataset.nativeApp === undefined')
            assert desktop_page.locator('#mobile-vault-root').count() == 0
            assert not desktop_errors, desktop_errors
            checks.append('Desktop Web mode remains 100% inert and unaffected')
            desktop_ctx.close()
            browser.close()

        result = {'result': 'passed', **artifact_stats, 'checks': checks}
        print(json.dumps(result, ensure_ascii=False, indent=2), flush=True)
    finally:
        httpd.shutdown()
        httpd.server_close()
        thread.join()


if __name__ == '__main__':
    main()

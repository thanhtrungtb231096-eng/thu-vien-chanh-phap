"""Acceptance checks against the real collection and page service.

Run server.py --port 8095 first, then python -X utf8 web-thuvien/tests/phuc_minh_check.py.
Audio requests use a generated local tone to exercise the player without relying on TTS availability.
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

import io
import json
import math
import os
import struct
import sys
import urllib.error
import urllib.request
import wave
from pathlib import Path

sys.path.insert(0, str(DEPENDENCIES))
sys.path.insert(0,str(APP))
from playwright.sync_api import sync_playwright
import server

BASE = os.environ.get('PHUC_MINH_TEST_URL', 'http://127.0.0.1:8095')
URL = BASE + '/web-thuvien/index.html'
OUT = Path(__file__).parent / 'artifacts'
OUT.mkdir(exist_ok=True)
catalog = json.loads((GENERATED / 'phuc-minh/catalog.json').read_text(encoding='utf-8'))['books']
assert len(catalog) == 26 and len({b['id'] for b in catalog}) == 26
assert sum(bool(b['vietFile']) for b in catalog) == 24
for book in catalog:
    assert server.is_allowed_file(SOURCES['chua phuc minh'] / book['filename'])
    if book['vietFile']:
        path = public_path(book['vietFile'])
        assert server.is_allowed_file(path)
        text = path.read_text(encoding='utf-8')
        assert text.count('\n## Trang ') == book['pages']
        with urllib.request.urlopen(BASE + '/web-thuvien/' + book['vietFile']) as response:
            assert response.status == 200
for suffix in ['id=../../server.py&page=1', 'id=kinh-nhat-tung&page=0', 'id=kinh-nhat-tung&page=65', 'id=kinh-nhat-tung&page=nan']:
    try:
        urllib.request.urlopen(BASE + '/api/phucminh/page?' + suffix)
        raise AssertionError('Invalid PDF query accepted')
    except urllib.error.HTTPError as error:
        assert error.code == 400
assert not server.is_allowed_file(WEB / 'build_phuc_minh.py')
assert not server.is_allowed_file(DEPENDENCIES / 'pymupdf/__init__.py')

tone = io.BytesIO()
with wave.open(tone, 'wb') as wav:
    wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(16000)
    wav.writeframes(b''.join(struct.pack('<h', int(800 * math.sin(i * .08))) for i in range(16000*4)))
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.route('**/api/tts', lambda route: route.fulfill(status=200, content_type='audio/wav', body=tone.getvalue()))
    page.goto(URL + '#phucminh', wait_until='networkidle')
    page.wait_for_selector('#tab-phucminh .pm-card')
    assert page.locator('#pm-books .pm-card').count() == 26
    assert page.locator('#tab-phucminh').is_visible()
    page.screenshot(path=str(OUT / 'phuc-minh-desktop.png'), full_page=True)
    page.locator('#pm-books [data-pm-action="details"][data-id="hoi-dap-can-ban"]').first.click()
    assert page.locator('#pm-detail-title').inner_text() == 'Hỏi đáp Phật pháp căn bản'
    page.locator('#pm-detail-queue').click()
    assert page.evaluate('DharmaPlayerStore.state.queue.at(-1).type') == 'phucminh'
    page.screenshot(path=str(OUT / 'phuc-minh-details.png'))
    page.locator('#pm-detail-close').click()
    page.locator('#pm-search').fill('hoi dap')
    assert page.locator('#pm-books .pm-card').count() == 2
    page.locator('#pm-search').fill('xyz-no-result')
    assert page.locator('#pm-empty').is_visible()
    page.locator('#pm-reset').click()
    page.locator('#pm-availability').select_option('audio')
    assert page.locator('#pm-books .pm-card').count() == 26
    page.locator('#pm-availability').select_option('all')
    page.locator('[data-pm-category="Thực hành thiền"]').click()
    assert page.locator('#pm-books .pm-card').count() == 5
    page.locator('[data-pm-category="all"]').click()
    page.locator('[data-pm-action="save"][data-id="kinh-nhat-tung"]').click()
    page.locator('#pm-saved').click()
    assert page.locator('#pm-books .pm-card').count() == 1
    page.locator('#pm-saved').click()
    page.locator('#pm-books [data-pm-action="read"][data-id="kinh-nhat-tung"]').click()
    page.wait_for_function('Reader.state.ready')
    assert page.evaluate('Reader.state.key') == 'phucminh:kinh-nhat-tung'
    assert page.locator('#reader-pdf-link').is_visible() is False  # PDF link lives in settings panel.
    page.evaluate('Reader.jumpSection(6)')
    page.locator('#reader-mark').click()
    page.locator('#reader-close').click()
    page.locator('#pm-books [data-pm-action="read"][data-id="kinh-nhat-tung"]').click()
    page.wait_for_function('Reader.state.ready')
    assert page.evaluate('Reader.state.section') == 6
    page.screenshot(path=str(OUT / 'phuc-minh-reader.png'))
    page.locator('#reader-close').click()
    # Jump between source PDF pages and the matching text without an audible false start.
    page.locator('[data-pm-action="pdf"][data-id="kinh-nhat-tung"]').click()
    page.locator('#pm-pdf-page').fill('9'); page.locator('#pm-pdf-page').press('Tab')
    page.wait_for_function('LibraryStore.read("pm-pdf:kinh-nhat-tung", {}).page === 9')
    page.locator('#pm-pdf-read').click()
    page.wait_for_function('Reader.state.ready')
    assert page.evaluate('Reader.state.sections[Reader.state.section].title') == 'Trang 9'
    assert not page.locator('.reader-mode-switch').is_visible()
    page.locator('#reader-phuc-pdf').click()
    assert page.locator('#pm-pdf-page').input_value() == '9'
    page.locator('#pm-pdf-listen').click()
    page.wait_for_function('Audiobook.state.status === "playing"')
    source = page.evaluate('''async () => {
      const doc = ReaderModel.parse(await (await fetch('data/phuc-minh/text/kinh-nhat-tung.md')).text());
      const marker = doc.blocks.findIndex(x => x.heading?.title === 'Trang 9');
      return doc.blocks.slice(marker + 1).find(x => !['metadata','note','contents','running'].includes(x.kind) && /[a-zA-ZÀ-ỹ]/u.test(x.text)).id;
    }''')
    assert page.evaluate('DharmaPlayerStore.state.chunks[Audiobook.state.index].blocks').count(source) > 0
    page.evaluate('Audiobook.pause()')
    page.locator('[data-pm-action="pdf"][data-id="cau-doi-phap-1"]').click()
    page.wait_for_function('document.getElementById("pm-pdf-image").naturalWidth > 0 && !document.getElementById("pm-pdf-image").hidden')
    page.locator('#pm-pdf-page').fill('5'); page.locator('#pm-pdf-page').press('Tab')
    page.wait_for_function('LibraryStore.read("pm-pdf:cau-doi-phap-1", {}).page === 5')
    page.screenshot(path=str(OUT / 'phuc-minh-pdf.png'))
    assert not page.locator('#pm-pdf-listen').is_disabled()
    page.locator('#pm-pdf-close').click()
    page.locator('[data-pm-action="pdf"][data-id="cau-doi-phap-1"]').click()
    assert page.locator('#pm-pdf-page').input_value() == '5'
    page.locator('#pm-pdf-close').click()
    page.locator('#pm-books [data-pm-action="listen"][data-id="kinh-nhat-tung"]').click()
    page.wait_for_function('DharmaPlayerStore.state.item?.key === "phucminh:kinh-nhat-tung" && Audiobook.state.status === "playing"', timeout=15000)
    assert page.evaluate('DharmaPlayerStore.state.chunks.every(x => !/^Trang \\d+$/.test(x.text))')
    page.evaluate('switchTab("home")')
    assert page.evaluate('Audiobook.state.status') == 'playing'
    page.locator('#global-search').fill('cau doi phap')
    page.locator('details:has(#home-collection) > summary').click()
    page.locator('#home-collection').select_option('phucminh')
    page.wait_for_function('document.querySelectorAll("#home-search-hits .search-result-row").length === 2')
    page.locator('#home-search-hits .global-result').first.click()
    page.wait_for_function('Reader.state.ready')
    assert page.evaluate("Reader.state.item.data.sourceKind") == 'ocr'
    assert 'OCR' in page.locator('#reader-book-subtitle').inner_text()
    page.locator('#reader-close').click()
    page.evaluate('Audiobook.pause(); switchTab("phucminh")')
    page.locator('#pm-search').fill('')
    page.reload(wait_until='networkidle')
    assert page.locator('[data-pm-action="save"][data-id="kinh-nhat-tung"]').get_attribute('aria-pressed') == 'true'
    for width in [320, 390, 768, 1024]:
        page.set_viewport_size({'width': width, 'height': 844})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow at {width}'
        page.screenshot(path=str(OUT / f'phuc-minh-{width}.png'), full_page=True)
        if width == 390:
            page.screenshot(path=str(OUT / 'phuc-minh-mobile-viewport.png'))
            page.locator('[data-pm-action="pdf"][data-id="cau-doi-phap-1"]').click()
            page.wait_for_function('document.getElementById("pm-pdf-image").complete && !document.getElementById("pm-pdf-image").hidden')
            assert page.evaluate('document.getElementById("pm-pdf").getBoundingClientRect().width <= innerWidth')
            page.screenshot(path=str(OUT / 'phuc-minh-mobile-pdf.png'))
            page.locator('#pm-pdf-close').click()
    page.locator('#pm-books [data-pm-action="read"][data-id="hoi-dap-can-ban"]').click()
    page.wait_for_function('Reader.state.ready')
    deep = page.url
    page.goto(deep, wait_until='networkidle')
    page.wait_for_function('Reader.state.ready')
    assert page.evaluate('Reader.state.key') == 'phucminh:hoi-dap-can-ban'
    page.locator('#reader-close').click()
    assert page.locator('#tab-phucminh').is_visible()
    assert not errors, errors
    browser.close()
print(json.dumps({'books': len(catalog), 'originalTextEditions': 24, 'ocrDraftEditions': 2, 'readableEditions': 26, 'checks': 'search, filters, saved books, reader resume, bookmarks, PDF pages, listening, continuity, deep links, responsive layout, API validation', 'browserErrors': errors}, ensure_ascii=False))

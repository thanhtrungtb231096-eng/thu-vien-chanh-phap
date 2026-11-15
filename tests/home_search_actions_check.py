"""Browser regression for bounded home search and visible reading/listening actions."""
import json
from pathlib import Path
import sys
import threading

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'tests'), str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
from read_listen_continuity_check import server, Quiet, NarrationEngine, unused, audio_fixture
from playwright.sync_api import sync_playwright

OUT = ROOT / 'tests/artifacts/home-search-actions-20261011'
DOCUMENT = '# Bản kiểm tra thao tác\n\n## Phẩm thứ nhất\n\nLời kinh để kiểm tra nút đọc và nghe.\n\nĐoạn tiếp theo của bản kiểm tra.'


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    memory = {}
    server.STREAM_ENGINE = NarrationEngine(memory.get, memory.__setitem__, unused, log_path=None)
    http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
    http.allowed_patterns = set()
    threading.Thread(target=http.serve_forever, daemon=True).start()
    checks, errors = [], []
    result = {'checks': checks, 'pageErrors': errors, 'passed': False,
              'audioFixture': 'Local WAV verifies playback dispatch; no live synthesis.'}
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
            context = browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block', reduced_motion='reduce')
            context.route('**/api/voices', lambda r: r.fulfill(json={'available': True, 'offlineAvailable': True, 'voices': [], 'offlineVoices': [{'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan'}], 'audioConfig': {'startupBufferSeconds': 0}}))
            wav = audio_fixture(40)
            context.route('**/api/tts', lambda r: r.fulfill(body=wav, content_type='audio/wav'))
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html', wait_until='networkidle')
            result['version'] = json.loads((ROOT / 'data/generated/library-version.json').read_text(encoding='utf-8'))['version']
            search = page.locator('#global-search')
            rows = page.locator('#home-search-hits .search-result-row')
            page.locator('.home-filter-options > summary').click()

            search.fill('kinh')
            page.wait_for_function("document.querySelectorAll('#home-search-hits .search-result-row').length===8")
            first = rows.first.get_attribute('data-book-key')
            page.locator('#home-search-next').click()
            assert rows.count() == 8 and rows.first.get_attribute('data-book-key') != first
            assert page.evaluate("document.activeElement.id==='home-search-heading'")
            page.locator('#home-search-previous').click()
            assert rows.first.get_attribute('data-book-key') == first
            assert page.locator('#home-search-previous').is_disabled()
            state = page.evaluate('LibraryUI.captureSearch()')
            state['page'] = 99999
            page.evaluate('(s)=>{LibraryUI.restoreSearch(s);LibraryUI.searchLibrary();}', state)
            assert page.locator('#home-search-next').is_disabled() and 0 < rows.count() <= 8
            page.locator('#home-collection').select_option('daithua')
            assert 'Trang 1 /' in page.locator('#home-search-page').inner_text()
            page.locator('#home-collection').select_option('all')
            checks.append('8 results per page; replace rather than append; first/last bounds, focus and filter reset')

            for width in [1440, 768, 390, 320]:
                page.set_viewport_size({'width': width, 'height': 1000 if width > 600 else 844})
                for theme in ['parchment', 'amber', 'night']:
                    page.evaluate('(name)=>setTheme(name)', theme)
                    for action in page.locator('#home-search-hits .search-read, #home-search-hits .search-listen').all():
                        assert action.is_visible()
                        assert action.bounding_box()['height'] >= 44
                        assert action.evaluate('(e)=>{const a=e.getBoundingClientRect(),b=e.closest("article").getBoundingClientRect();return a.left>=b.left&&a.right<=b.right+1;}')
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                    assert page.locator('#home-search-count').is_visible()
                    assert rows.first.evaluate('(e)=>e.getBoundingClientRect().top >= document.querySelector(".sanctuary-hero").getBoundingClientRect().bottom')
                    assert page.evaluate("document.querySelector('#tab-home').firstElementChild.classList.contains('sanctuary-hero')")
                    assert rows.first.bounding_box()['height'] < (110 if width > 600 else 175)
                page.locator('#home-search-results').screenshot(path=str(OUT / f'search-{width}.png'))
            checks.append('1440/768/390/320 px × three themes: both actions visible, 44 px targets, compact rows, no overflow')
            page.set_viewport_size({'width': 1440, 'height': 1000})
            page.evaluate("setTheme('parchment')")

            samples = page.evaluate("""[
                {type:'daithua', id:'dt_01_2'}, {type:'daitang', id:'T14n0475'},
                {type:'ebooks', id:DAI_TANG_KINH_DATA.find(x=>x.vietFile).id},
                {type:'phucminh', id:PHUC_MINH_DATA.find(x=>x.vietFile).id}
            ].map(ref=>({...ref,path:Reader.path(DharmaPlayerStore.resolve(ref),'viet')}))""")
            for sample in samples:
                context.route(page.evaluate('(path)=>new URL(path,location.href).href', sample['path']), lambda r: r.fulfill(body=DOCUMENT, content_type='text/plain; charset=utf-8'))
                search.fill(sample['id'])
                row = page.locator(f'[data-book-key="{sample["type"]}:{sample["id"]}"]')
                row.locator('.search-read').click()
                page.wait_for_function('(key)=>Reader.state.ready&&Reader.state.key===key', arg=f'{sample["type"]}:{sample["id"]}')
                assert page.evaluate("Reader.state.mode==='viet'")
                page.locator('#reader-close').click()
                row.locator('.search-listen').click()
                page.wait_for_function('(key)=>Audiobook.state.status==="playing"&&Audiobook.state.key===key', arg=f'{sample["type"]}:{sample["id"]}')
                page.evaluate('Audiobook.pause()')
            checks.append('Explicit read/listen buttons open and play the correct Vietnamese edition in all four collections')

            search.fill('T14n0492a')
            row = page.locator('[data-book-key="daitang:T14n0492a"]')
            row.wait_for()
            assert row.locator('.search-listen').is_disabled()
            assert row.locator('.book-listen-unavailable').inner_text() == 'Chưa có bản Việt để nghe'
            assert row.locator('.search-read').inner_text() == 'Đọc bản Hán'
            row.locator('.search-read').click()
            page.wait_for_function("Reader.state.ready&&Reader.state.key==='daitang:T14n0492a'&&Reader.state.mode==='han'")
            page.locator('#reader-close').click()
            missing = page.evaluate('DAI_TANG_KINH_DATA.find(x=>!x.vietFile)?.id')
            if missing:
                search.fill(missing)
                page.locator(f'[data-book-key="ebooks:{missing}"]').wait_for()
                assert rows.first.locator('.search-listen').is_disabled()
                assert rows.first.locator('.search-read').inner_text() == 'Xem tệp nguồn'
                rows.first.locator('.search-read').click()
                page.locator('#ep-detail').wait_for(state='visible')
                page.locator('#ep-detail-close').click()
            checks.append('Hán-only edition opens actual Hán text; missing text retains source access and explains unavailable listening')

            page.locator('#home-collection').select_option('daithua')
            page.locator('#home-language').select_option('viet')
            search.fill('kinh')
            page.wait_for_function("document.querySelector('#home-search-next')&&!document.querySelector('#home-search-next').disabled")
            page.locator('#home-search-next').click()
            state = page.evaluate('LibraryUI.captureSearch()')
            keys = rows.evaluate_all('(items)=>items.map(x=>x.dataset.bookKey)')
            ref = page.evaluate('(key)=>{const item=LibraryCatalog.get(key);return {path:Reader.path(item,"viet"),key};}', keys[0])
            context.route(page.evaluate('(path)=>new URL(path,location.href).href', ref['path']), lambda r: r.fulfill(body=DOCUMENT, content_type='text/plain; charset=utf-8'))
            rows.first.locator('.search-read').click()
            page.wait_for_function('Reader.state.ready')
            page.go_back()
            page.wait_for_function("!Reader.state.item&&appState.currentTab==='home'")
            assert page.evaluate('LibraryUI.captureSearch()') == state
            assert rows.evaluate_all('(items)=>items.map(x=>x.dataset.bookKey)') == keys
            assert search.input_value() == 'kinh'
            checks.append('Browser Back restores page 2, search query, collection/language filters and exact result rows')

            page.evaluate("switchTab('shelf')")
            assert page.locator('#recent-books .shelf-listen').count() > 0
            page.evaluate("ContentModules.go('tang-han',['kinh'])")
            assert page.evaluate("document.querySelector('#catalog-search-controls').parentElement.matches('main')")
            search.fill('T14n0492a')
            page.wait_for_selector('[data-content-read="daitang:T14n0492a"]')
            assert page.locator('[data-content-listen="daitang:T14n0492a"]').is_disabled()
            assert page.locator('#tab-tang-han .book-listen-unavailable').is_visible()
            page.evaluate("switchTab('home')")
            assert page.evaluate("document.querySelector('#catalog-search-controls').previousElementSibling.classList.contains('sanctuary-hero')")
            search.fill('zxqvnomatch20261011')
            page.wait_for_function("document.getElementById('home-search-count').textContent==='0 kết quả'")
            assert rows.count() == 0 and not page.locator('.home-search-pagination').is_visible()
            page.locator('.search-clear').click()
            page.wait_for_function("document.getElementById('home-search-results').hidden")
            checks.append('Recent books and catalog branches expose listening; empty/cleared searches hide pagination/results')
            assert not errors, errors
            browser.close()
        result['passed'] = True
        print(json.dumps(result, ensure_ascii=False), flush=True)
    except Exception as error:
        result['failure'] = str(error)
        raise
    finally:
        http.shutdown()
        (OUT / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')


if __name__ == '__main__':
    main()

"""Real-browser checks for reading, direct listening, recovery and responsive UI."""

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

import json
import sys
from pathlib import Path

sys.path.insert(0, str(DEPENDENCIES))
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / 'artifacts'
URL = 'http://127.0.0.1:8090/web-thuvien/index.html'
checks, errors = [], []

def passed(label):
    checks.append(label)
    print('PASS:', label, flush=True)

def no_overflow(page):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')

with sync_playwright() as p:
    chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
    browser = p.chromium.launch(executable_path=str(chrome), headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    page = context.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))
    try:
        page.goto(URL, wait_until='networkidle')
        assert page.locator('.featured-book').count() == 4
        assert page.locator('#global-search').bounding_box()['y'] < 500
        no_overflow(page)
        page.screenshot(path=str(OUT / 'v4-home-desktop.png'), full_page=True)
        page.locator('#global-search').fill('bat nha')
        page.wait_for_selector('.global-result')
        assert page.locator('.search-listen').count() > 0
        page.locator('.search-clear').click()
        page.wait_for_function("document.getElementById('home-search-results').hidden")
        passed('Immediate search, accent-insensitive results, clear search, four real book entries')

        page.locator('.featured-actions button').nth(1).click()
        page.wait_for_function("Audiobook.state.status === 'playing'", timeout=55000)
        page.wait_for_function('Audiobook.state.currentTime > 0.3', timeout=12000)
        assert page.evaluate('Audiobook.state.duration > 0')
        page.locator('#audio-play').click()
        assert page.evaluate('Audiobook.state.status') == 'paused'
        page.locator('#audio-play').click()
        page.wait_for_function("Audiobook.state.status === 'playing'", timeout=55000)
        page.locator('#audio-play').click()
        page.locator('#reader-close').click()
        assert page.evaluate('Audiobook.state.status') == 'idle'
        passed('One-click listening loads decodable audio, advances media time, pauses and resumes')

        page.locator('#nav-daithua').click()
        page.locator('#catalog-category').select_option('01')
        assert page.locator('.daithua-card').count() == 7
        assert page.locator('.daithua-card .book-editions').count() == 7
        page.locator('[data-layout="list"]').click()
        page.locator('.card-personal-tools button').first.click()
        page.locator('#nav-shelf').click()
        assert page.locator('#favorite-books .shelf-book').count() == 1
        page.locator('#nav-daitanghan').click()
        page.locator('#catalog-division').select_option('03')
        assert page.locator('.taisho-text-item').count() <= 40
        assert page.evaluate('appState.daiTangDivFilter') == '03'
        passed('Category and division selects, alternate editions, list view, favorites')

        page.evaluate("openTaishoReader('T01n0001','viet')")
        page.wait_for_function('Reader.state.ready')
        page.evaluate('Reader.jumpSection(3)')
        assert page.locator('.source-prose').count() > page.locator('.source-block').count()
        assert page.locator('.source-verse').count() > 0
        page.screenshot(path=str(OUT / 'v4-reader-desktop.png'))
        initial_font = page.evaluate('Reader.pref.font')
        page.locator('#reader-font-up').click()
        assert page.evaluate('Reader.pref.font') == initial_font + 1
        page.locator('#reader-font-down').click()
        page.locator('#reader-next').click()
        page.locator('#reader-prev').click()
        passed('Long source blocks display as separate paragraphs and verse; font and chapter controls work')

        page.locator('[data-panel="research"]').click()
        page.locator('#reader-search').fill('Hoa lâm')
        page.wait_for_selector('.search-hit')
        page.locator('.search-hit').first.click()
        page.locator('#reader-note-input').fill('Ghi chú nghiệm thu giao diện v4')
        page.locator('#reader-note-save').click()
        assert page.locator('.reader-mark-card').count() == 1
        page.locator('#inspector-close').click()
        passed('Full-text search and paragraph note saving')

        for width, height, name in [(1440, 1000, 'desktop'), (820, 1180, 'tablet'), (390, 844, 'mobile'), (320, 740, 'small-mobile')]:
            page.set_viewport_size({'width': width, 'height': height})
            for theme in ['parchment', 'amber', 'night']:
                page.evaluate(f"setTheme('{theme}')")
                page.wait_for_timeout(250)  # Let color transitions settle for reviewable screenshots.
                if theme == 'night':
                    assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--bg-app').trim()") == '#151D19'
                page.screenshot(path=str(OUT / f'v4-reader-{theme}-{name}.png'))
                no_overflow(page)
                assert page.locator('#reader-scroll').bounding_box()['height'] > 250
                assert page.evaluate("document.getElementById('reader-paper-content').scrollWidth <= document.getElementById('reader-paper-content').clientWidth + 1")
        passed('Reader: four viewport sizes × three themes, readable area and no horizontal overflow')

        page.set_viewport_size({'width': 390, 'height': 844})
        page.locator('#reader-toc-toggle').click()
        assert page.locator('#reader-sidebar').is_visible()
        page.locator('#reader-drawer-backdrop').click(position={'x': 375, 'y': 200})
        assert not page.locator('#reader-sidebar').is_visible()
        page.locator('[data-panel="settings"]').click()
        page.locator('[data-panel="research"]').click()
        page.locator('#reader-mark-secondary').click()
        assert page.locator('.reader-mark-card').count() == 2
        page.locator('#inspector-close').click()
        passed('Mobile drawer closes by tapping outside; bookmark is available in the notes panel')

        page.locator('#reader-close').click()
        page.evaluate("switchTab('home'); setTheme('parchment')")
        for width, height, name in [(390, 844, 'mobile'), (820, 1180, 'tablet')]:
            page.set_viewport_size({'width': width, 'height': height})
            no_overflow(page)
            page.screenshot(path=str(OUT / f'v4-home-{name}.png'), full_page=True)
        passed('Home: mobile and tablet layout')

        # New context forces a real foreground request, independent of prepared blobs.
        fail_context = browser.new_context(viewport={'width': 390, 'height': 844})
        failed_page = fail_context.new_page()
        failed_page.on('pageerror', lambda e: errors.append(str(e)))
        failed_page.route('**/api/tts', lambda route: route.fulfill(status=502, content_type='application/json', body=json.dumps({'error': 'Mất kết nối thử nghiệm. Chọn Kết nối lại.'})))
        failed_page.goto(URL, wait_until='networkidle')
        failed_page.locator('.featured-actions button').nth(1).click()
        failed_page.wait_for_function("Audiobook.state.status === 'error'")
        assert failed_page.locator('#audio-retry').is_visible()
        assert failed_page.locator('#audio-status').inner_text()
        failed_page.unroute('**/api/tts')
        failed_page.locator('#audio-retry').click()
        failed_page.wait_for_function("Audiobook.state.status === 'playing'", timeout=55000)
        failed_page.wait_for_function('Audiobook.state.currentTime > 0.2', timeout=12000)
        failed_page.screenshot(path=str(OUT / 'v4-audio-mobile.png'))
        assert failed_page.locator('#reader-scroll').bounding_box()['height'] > 150
        failed_page.locator('#reader-close').click()
        assert failed_page.evaluate('Audiobook.state.status') == 'idle'
        passed('Narration error is visible, reconnect recovers real playback, close stops audio')

        # A missing service can become available without reloading the reader.
        unavailable = browser.new_context()
        unavailable.add_init_script("Object.defineProperty(window, 'speechSynthesis', {value: {getVoices:()=>[], addEventListener:()=>{}, cancel:()=>{}}})")
        recovery = unavailable.new_page()
        recovery.on('pageerror', lambda e: errors.append(str(e)))
        recovery.route('**/api/voices', lambda route: route.fulfill(json={'available': False, 'voices': []}))
        recovery.goto(URL, wait_until='networkidle')
        recovery.locator('.featured-actions button').nth(1).click()
        recovery.wait_for_function('Reader.state.ready')
        assert recovery.locator('#audio-play').is_disabled()
        assert recovery.locator('#audio-retry').is_visible()
        recovery.unroute('**/api/voices')
        recovery.locator('#audio-retry').click()
        recovery.wait_for_function("Audiobook.state.status === 'playing'", timeout=55000)
        recovery.locator('#reader-close').click()
        passed('Missing service can reconnect and start narration without losing the open sutra')

        assert not errors, errors
        passed('No JavaScript exceptions')
    except Exception:
        page.screenshot(path=str(OUT / 'v4-failure.png'), full_page=True)
        raise
    finally:
        (OUT / 'v4-results.json').write_text(json.dumps({'checks': checks, 'errors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
        browser.close()

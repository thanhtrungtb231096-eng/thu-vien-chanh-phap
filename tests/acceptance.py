
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
from pathlib import Path
import sys
import traceback
sys.path.insert(0, str(DEPENDENCIES))
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / 'artifacts'
OUT.mkdir(exist_ok=True)
URL = 'http://127.0.0.1:8090/web-thuvien/index.html'
errors, checks = [], []
def passed(name):
    checks.append(name)
    print('PASS:', name, flush=True)

with sync_playwright() as p:
    chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
    browser = p.chromium.launch(executable_path=str(chrome), headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, device_scale_factor=1)
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(error.stack))
    try:
        page.goto(URL, wait_until='networkidle')
        page.wait_for_selector('#nav-home')
        assert page.locator('#tab-home').is_visible()
        page.locator('#global-search').fill('truong a ham')
        page.wait_for_selector('.global-result')
        assert page.locator('.global-result').count() > 0
        page.locator('.home-filter-options summary').click()
        page.locator('#home-language').select_option('viet')
        page.locator('#global-search').fill('T01n0001')
        page.wait_for_timeout(250)
        assert page.locator('.global-result').count() >= 1
        passed('Global accent-insensitive search and Vietnamese filter')
        page.locator('#nav-daithua').click()
        page.wait_for_selector('.daithua-card')
        page.locator('[data-layout="list"]').click()
        assert 'catalog-list-view' in page.locator('.daithua-grid').get_attribute('class')
        page.locator('.card-personal-tools button').first.click()
        page.locator('#nav-shelf').click()
        assert page.locator('#favorite-books .shelf-book').count() == 1
        passed('Catalog view switch and persistent favorites')
        page.evaluate("openTaishoReader('T01n0001','viet')")
        page.wait_for_function('Reader.state.ready')
        sections = page.evaluate('Reader.state.sections.length')
        assert sections > 100
        assert page.locator('[data-block]').count() < 100
        page.locator('.toc-entry[data-jump="2"]').click()
        assert page.evaluate('Reader.state.section') == 2
        page.locator('#reader-next').click()
        assert page.evaluate('Reader.state.section') == 3
        page.locator('#reader-prev').click()
        page.locator('#toc-search').fill('du hanh')
        assert page.locator('.toc-entry').count() > 0
        page.locator('#toc-search').fill('')
        passed('Long sutra sections, TOC search and previous/next navigation')
        # A late-book block must be searchable even while only an early section is rendered.
        target = page.evaluate("Reader.state.doc.blocks.filter(b => b.kind === 'text' && b.text.length > 150).at(-8)")
        phrase = ' '.join(target['text'].split()[:9])
        page.locator('[data-panel="research"]').click()
        page.locator('#reader-search').fill(phrase)
        page.wait_for_selector('#search-hits .search-hit')
        page.locator('#search-hits .search-hit').first.click()
        assert page.evaluate('Reader.state.section') > 20
        page.locator('#reader-note-input').fill('Ghi chú kiểm thử: giữ nguyên lời kinh.')
        page.locator('#reader-note-save').click()
        assert page.locator('#reader-marks .reader-mark-card').count() == 1
        page.locator('#reader-mark').click()
        assert page.locator('#reader-marks .reader-mark-card').count() == 2
        saved_block = page.evaluate('Reader.state.block')
        page.locator('#inspector-close').click()
        page.locator('#reader-close').click()
        page.evaluate("openTaishoReader('T01n0001','viet')")
        page.wait_for_function('Reader.state.ready')
        assert page.evaluate('Reader.state.section') > 20
        passed('Full-sutra search, paragraph notes, multiple bookmarks and resume')
        page.locator('[data-panel="settings"]').click()
        page.locator('#r-size').select_option('3000')
        assert page.evaluate('Reader.state.sections.length') > sections
        page.locator('#r-view').select_option('continuous')
        page.locator('#r-font').fill('28')
        page.locator('#r-font').dispatch_event('change')
        assert page.evaluate('Reader.pref.font') == 28
        assert page.locator('.reading-section').count() <= 5
        page.locator('#reader-edit-toggle').click()
        page.locator('#edit-title').fill('Mục kiểm thử cá nhân')
        page.locator('#edit-split').click()
        assert page.evaluate("Reader.state.sections.some(s=>s.title==='Mục kiểm thử cá nhân')")
        page.locator('#edit-apply').click()
        with page.expect_download() as download_info:
            page.locator('#edit-export').click()
        download = download_info.value
        export_path = OUT / 'outline-export.json'
        download.save_as(str(export_path))
        page.locator('#edit-reset').click()
        assert not page.evaluate("Reader.state.sections.some(s=>s.title==='Mục kiểm thử cá nhân')")
        page.locator('#edit-undo').click()
        assert page.evaluate("Reader.state.sections.some(s=>s.title==='Mục kiểm thử cá nhân')")
        page.locator('#edit-import').set_input_files(str(export_path))
        page.wait_for_function("document.getElementById('edit-status').textContent.includes('Đã nhập')")
        passed('Reading preferences and outline edit/preview/save/undo/export/import')
        page.locator('#inspector-close').click()
        page.locator('[data-reader-mode="dual"]').click()
        page.wait_for_function("Reader.state.ready && Reader.state.mode === 'dual'")
        assert page.locator('#han-content').inner_text().strip()
        page.locator('#han-section').select_option('2')
        assert page.evaluate('Reader.state.hanSection') == 2
        page.locator('[data-reader-mode="han"]').click()
        page.wait_for_function("Reader.state.ready && Reader.state.mode === 'han'")
        page.wait_for_function('Audiobook.state.count > 0')
        passed('Independent bilingual navigation and Vietnamese audio document in Hán mode')
        # Headless Chrome lacks installed vi voices: online voices must be available.
        page.locator('#reader-listen-toggle').click()
        assert page.locator('#audio-voice option').count() >= 2
        # Opening the listen control now starts playback directly.
        page.wait_for_function("Audiobook.state.status === 'playing'", timeout=50000)
        page.locator('#audio-play').click()
        assert page.evaluate('Audiobook.state.status') == 'paused'
        page.locator('#audio-next').click()
        assert page.evaluate('Audiobook.state.index') == 1
        page.locator('#audio-expand').click()
        page.locator('#audio-voice').select_option('offline:vieneu-thuc-doan')
        page.locator('#audio-rate').fill('0.85')
        page.locator('#audio-rate').dispatch_event('change')
        page.locator('#audio-sleep').select_option('15')
        page.locator('#audio-play').click()
        page.wait_for_function("Audiobook.state.status === 'playing'", timeout=50000)
        page.locator('#audio-play').click()
        page.locator('#reader-close').click()
        assert page.evaluate('Audiobook.state.status') == 'idle'
        page.evaluate("openTaishoReader('T01n0001','viet')")
        page.wait_for_function('Reader.state.ready && Audiobook.state.count > 0')
        assert page.evaluate('Audiobook.state.index') >= 1
        passed('Real online audio playback, pause, next, voice/rate selection and listening resume')
        assert page.locator('#audio-panel').is_hidden()
        page.evaluate('Reader.jumpSection(3)')
        for theme in ['parchment', 'amber', 'night']:
            page.evaluate('(theme) => setTheme(theme)', theme)
            page.screenshot(path=str(OUT / f'reader-{theme}-desktop.png'))
            colors = page.evaluate("({fg: getComputedStyle(document.querySelector('.reader-paper')).color, bg: getComputedStyle(document.querySelector('.reader-paper')).backgroundColor})")
            assert colors['fg'] != colors['bg']
        page.evaluate("setTheme('parchment')")
        page.locator('#reader-close').click()
        page.locator('#nav-shelf').click()
        with page.expect_download() as download_info:
            page.locator('#backup-library').click()
        backup_path = OUT / 'library-backup.json'
        download_info.value.save_as(str(backup_path))
        page.locator('#restore-library').set_input_files(str(backup_path))
        page.wait_for_function("document.getElementById('backup-status').textContent.includes('Đã nhập')")
        passed('Backup export and non-destructive import')
        for tab in ['appendix', 'roadmap', 'milinda', 'practical', 'glossary', 'timer', 'notes']:
            page.evaluate('(tab) => switchTab(tab)', tab)
            assert page.locator('#tab-' + tab).is_visible()
        page.evaluate("switchTab('daitanghan')")
        page.locator('#global-search').fill('bat nha')
        page.wait_for_timeout(250)
        assert page.locator('.taisho-text-item').count() <= 40
        page.screenshot(path=str(OUT / 'catalog-desktop.png'), full_page=True)
        passed('All legacy study sections and bounded Taishō catalog')
        for width, height, name in [(390,844,'mobile'), (768,1024,'tablet')]:
            page.set_viewport_size({'width': width, 'height': height})
            page.evaluate("switchTab('home')")
            page.locator('#global-search').fill('')
            page.wait_for_timeout(250)
            page.screenshot(path=str(OUT / f'home-{name}.png'), full_page=True)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
            page.evaluate("openTriReader('dt_01_2','viet')")
            page.wait_for_function('Reader.state.ready')
            page.evaluate('Reader.jumpSection(1)')
            assert page.locator('#reader-scroll').evaluate('(el)=>el.scrollWidth <= el.clientWidth + 1')
            page.locator('#reader-toc-toggle').click()
            assert page.locator('#reader-sidebar').is_visible()
            page.locator('#toc-close').click()
            page.locator('[data-panel="settings"]').click()
            assert page.locator('#reader-inspector').is_visible()
            page.locator('#inspector-close').click()
            for theme in ['parchment', 'amber', 'night']:
                page.evaluate('(theme)=>setTheme(theme)', theme)
                page.screenshot(path=str(OUT / f'reader-{theme}-{name}.png'))
            page.locator('#reader-listen-toggle').click()
            page.screenshot(path=str(OUT / f'audio-{name}.png'))
            assert page.locator('#audio-play').is_visible()
            page.locator('#reader-close').click()
            page.evaluate("setTheme('parchment')")
        passed('Mobile/tablet layout, side panels and audio controls in all three themes')
        # Deep links must work in a fresh context without prior storage.
        page.set_viewport_size({'width':1440, 'height':1000})
        page.evaluate("openTriReader('dt_01_2','viet')")
        page.wait_for_function('Reader.state.ready')
        page.evaluate('Reader.jumpSection(2)')
        deep = page.url
        fresh = browser.new_page()
        fresh.goto(deep, wait_until='networkidle')
        fresh.wait_for_function('Reader.state.ready')
        # A fresh device has the default section length, so the block, not the
        # section number, must be identical across devices/preferences.
        assert fresh.evaluate('Reader.state.block') == deep.rsplit('/', 1)[-1]
        fresh.close()
        assert not errors, errors
        passed('Fresh-context deep links and no JavaScript exceptions')
    except Exception:
        page.screenshot(path=str(OUT / 'acceptance-failure.png'), full_page=True)
        traceback.print_exc()
        raise
    finally:
        (OUT / 'acceptance-results.json').write_text(json.dumps({'checks': checks, 'errors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
        browser.close()

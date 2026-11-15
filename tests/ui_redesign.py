"""Regression coverage for clipped menus, reflow and reader/player occlusion."""

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

OUT = Path(__file__).parent / 'artifacts' / 'ui-redesign'
OUT.mkdir(exist_ok=True)
URL = 'http://127.0.0.1:8090/web-thuvien/index.html'
checks, errors, measurements = [], [], []

def passed(name):
    checks.append(name)
    print('PASS:', name, flush=True)

def assert_hit(locator):
    locator.scroll_into_view_if_needed()
    assert locator.evaluate('''e => { const r=e.getBoundingClientRect();
      return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)); }''')

def assert_reflow(page):
    bad = page.evaluate('''() => [...document.querySelectorAll('main *, .reader-view-container.active *')]
      .filter(e => {
        if (!e.checkVisibility() || e.closest('.comparison-table-wrapper, #reader-toc-list, .reader-content-pane, .reader-inspector, .collection-player')) return false;
        const r=e.getBoundingClientRect(); return r.width>0 && r.right>innerWidth+2;
      }).slice(0,6).map(e=>e.className)''')
    assert not bad, bad
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')

def menu(page, width):
    if width <= 800:
        page.locator('#library-menu-toggle').click()
    else:
        page.locator('.nav-more summary').click()

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=str(Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'), headless=True)
    page = browser.new_page()
    page.emulate_media(reduced_motion='reduce')
    page.on('pageerror', lambda e: errors.append(str(e)))
    # Layout/focus tests are deterministic without TTS; acceptance.py tests real audio.
    page.route('**/api/voices', lambda route: route.fulfill(json={'available': False, 'voices': []}))
    page.goto(URL, wait_until='networkidle')
    try:
        for width,height in [(1440,1000),(1024,900),(768,1024),(390,844),(320,740)]:
            page.set_viewport_size({'width':width,'height':height})
            page.evaluate("switchTab('home'); setTheme('parchment')")
            box = page.locator('#global-search').bounding_box()
            measurements.append({'width':width, 'search_top':box['y'], 'search_bottom':box['y']+box['height']})
            if width <= 390:
                assert box['y']+box['height'] <= 400
            for tab in ['roadmap','milinda','practical','glossary','timer','notes']:
                menu(page,width)
                target=page.locator('#nav-'+tab)
                assert_hit(target)
                target.click()
                assert page.locator('#tab-'+tab).is_visible()
                assert not page.locator('#library-menu').is_visible()
            menu(page,width)
            page.keyboard.press('Escape')
            if width <= 800:
                assert page.locator('#library-menu-toggle').evaluate('e=>document.activeElement===e')
            else:
                assert page.locator('.nav-more summary').evaluate('e=>document.activeElement===e')

            for theme in ['parchment','amber','night']:
                page.evaluate('(t)=>setTheme(t)',theme)
                for tab in ['home','daithua','daitanghan','appendix','shelf']:
                    page.evaluate('(t)=>switchTab(t)',tab)
                    assert_reflow(page)
                    page.screenshot(path=str(OUT/f'{tab}-{theme}-{width}.png'))
                page.evaluate("openTriReader('dt_01_2','viet')")
                page.wait_for_function('Reader.state.ready')
                page.evaluate('Reader.jumpSection(1)')
                assert_reflow(page)
                assert page.locator('#reader-scroll').bounding_box()['height'] > 250
                assert page.locator('.reader-paper').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
                page.screenshot(path=str(OUT/f'reader-{theme}-{width}.png'))
                page.locator('#reader-close').click()
        passed('Five widths × three themes: search priority, catalog, shelf, reader and all six menu targets')

        page.set_viewport_size({'width':390,'height':844})
        for tab in ['home','daithua','milinda','practical','glossary','timer','notes']:
            page.evaluate('(t)=>switchTab(t)',tab)
            page.evaluate("document.documentElement.style.fontSize='200%'")
            assert_reflow(page)
        page.evaluate("document.documentElement.style.fontSize=''; setTheme('parchment')")
        passed('Text enlarged to 200%: home, catalog and study tools reflow')

        page.evaluate("openTriReader('dt_01_2','viet')")
        page.wait_for_function('Reader.state.ready')
        page.locator('#reader-toc-toggle').click()
        assert page.locator('#toc-search').evaluate('e=>document.activeElement===e')
        page.keyboard.press('Escape')
        assert page.locator('#reader-toc-toggle').evaluate('e=>document.activeElement===e')
        page.locator('[data-panel=settings]').click()
        page.locator('#inspector-close').focus()
        page.keyboard.press('Shift+Tab')
        assert page.locator('#reader-inspector').evaluate('e=>e.contains(document.activeElement)')
        page.keyboard.press('Escape')
        assert page.locator('[data-panel=settings]').evaluate('e=>document.activeElement===e')
        passed('Mobile drawers receive, contain and restore keyboard focus')

        for mode in ['han','dual','viet']:
            page.locator('[data-panel=settings]').click()
            page.locator('[data-reader-mode='+mode+']').click()
            page.wait_for_function('(m)=>Reader.state.ready && Reader.state.mode===m',arg=mode)
            page.locator('#inspector-close').click()
            assert page.locator('.reader-paper').evaluate('e=>e.scrollWidth<=e.clientWidth+1')
        page.evaluate('Reader.toggleAudio(true)')
        assert_hit(page.locator('#audio-play'))
        page.locator('#audio-expand').click()
        assert page.locator('#audio-voice').is_visible()
        assert page.locator('#reader-scroll').bounding_box()['height'] > 200
        page.locator('#audio-expand').click()
        assert not page.locator('#audio-voice').is_visible()
        page.locator('#audio-close').click()
        passed('Mobile editions and independent audio panel expand/collapse without covering the page')

        page.evaluate("CollectionPlayer.start('Bộ kinh kiểm tra', [{type:'daitang',id:'T08n0251',title:'Bát Nhã Tâm Kinh'}])")
        page.wait_for_function("Reader.state.ready && Reader.state.item.data.id==='T08n0251'")
        assert page.locator('#collection-player').is_visible()
        assert page.locator('#reader-scroll').bounding_box()['height'] > 180
        assert_hit(page.locator('#reader-next'))
        page.locator('#cp-expand').click()
        assert page.locator('#cp-toggle-list').is_visible()
        page.locator('#cp-toggle-list').click()
        assert page.locator('#cp-playlist').is_visible()
        page.locator('#cp-expand').click()
        page.evaluate('Reader.toggleAudio(true)')
        assert not page.locator('#collection-player').is_visible()
        page.locator('#audio-expand').click()
        assert page.locator('#audio-voice').is_visible()
        page.locator('#audio-close').click()
        assert page.locator('#collection-player').is_visible()
        page.evaluate("window.dispatchEvent(new Event('sutra-finished'))")
        page.locator('#reader-close').click()
        page.wait_for_timeout(2200)
        assert page.evaluate('!CollectionPlayer.isActive && Audiobook.state.status === "idle"')
        assert not page.locator('#reader-view-container').is_visible()
        passed('Collection player reserves reading space, exposes voice options, stops when reader closes')
        assert not errors, errors
    except Exception:
        page.screenshot(path=str(OUT/'failure.png'),full_page=True)
        raise
    finally:
        (OUT/'results.json').write_text(json.dumps({'checks':checks,'errors':errors,'measurements':measurements},ensure_ascii=False,indent=2),encoding='utf-8')
        browser.close()

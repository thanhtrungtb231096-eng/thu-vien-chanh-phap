"""Responsive visual and interaction checks for the shared edition design."""

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
import os
import sys
from pathlib import Path

sys.path.insert(0, str(DEPENDENCIES))
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / 'artifacts' / 'library-design'
OUT.mkdir(parents=True, exist_ok=True)
URL = os.environ.get('DHARMA_TEST_URL', 'http://127.0.0.1:8090/web-thuvien/index.html')
TABS = ['home', 'phucminh', 'daithua', 'daitanghan', 'appendix', 'roadmap', 'milinda', 'practical', 'glossary', 'timer', 'notes', 'shelf']


def main():
    errors, checks = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH', r'C:\Program Files\Google\Chrome\Application\chrome.exe'), headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(URL, wait_until='networkidle')
        page.wait_for_selector('.featured-book .edition-cover')
        page.evaluate('document.fonts.ready')
        for width in ([1440, 390] if '--inspect' in sys.argv else [1920, 1440, 1200, 1024, 820, 768, 390, 320]):
            page.set_viewport_size({'width': width, 'height': 1000 if width > 600 else 844})
            for theme in (['parchment'] if '--inspect' in sys.argv else ['parchment', 'night', 'amber']):
                page.evaluate('(theme) => setTheme(theme)', theme)
                for tab in TABS:
                    page.evaluate('(tab) => switchTab(tab)', tab)
                    page.wait_for_timeout(60)
                    if '--inspect' in sys.argv and tab in ['home', 'phucminh', 'daithua', 'daitanghan', 'milinda', 'timer']:
                        page.screenshot(path=str(OUT / f'{tab}-{width}.png'), full_page=False)
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (width, theme, tab, page.evaluate('document.documentElement.scrollWidth'))
                    cover_errors = page.evaluate('''() => [...document.querySelectorAll('.edition-cover:not(.edition-mini)')].filter(c => c.checkVisibility()).flatMap(c => {
                      const t=c.querySelector('.edition-title'), a=c.querySelector('.edition-title-area');
                      const bad=[];
                      if(t.scrollHeight>a.clientHeight+2 || t.scrollWidth>a.clientWidth+2) bad.push({title:t.textContent, width:c.clientWidth, titleHeight:t.scrollHeight, areaHeight:a.clientHeight});
                      for(const n of c.querySelectorAll('.edition-credit b')) if(n.parentElement.scrollHeight>n.parentElement.clientHeight+2) bad.push({credit:n.textContent,width:c.clientWidth});
                      return bad;
                    })''')
                    assert not cover_errors, (width, theme, tab, cover_errors)
        checks.append('All 12 screens: no page overflow or clipped cover titles / credits at the requested sizes and themes')
        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.evaluate("setTheme('parchment'); switchTab('daithua')")
        assert page.locator('.catalog-jacket').count() >= 62
        page.locator('#daithua-grid-container .catalog-jacket').first.click()
        page.wait_for_selector('.album-track')
        assert page.locator('.album-hero .edition-cover').count() == 1
        assert 'Thiền Tâm' in page.locator('.album-hero').inner_text()
        page.locator('#album-save').click()
        page.evaluate("switchTab('shelf')")
        assert page.locator('#favorite-books .edition-cover').count() == 1
        page.locator('#favorite-books .shelf-jacket').click()
        page.wait_for_function('Reader.state.ready')
        page.locator('#reader-close').click()
        checks.append('Catalog cover opens details with source credits; saved cover opens the correct reader')
        page.evaluate("switchTab('phucminh')")
        assert page.locator('#pm-books .edition-cover').count() == 26
        page.locator('[data-pm-action="details"][data-id="phuc-hanh-tong"]').first.click()
        assert 'TK. Siêu Thành' in page.locator('#pm-detail').inner_text()
        page.screenshot(path=str(OUT / 'phuc-minh-detail-desktop.png'))
        page.locator('#pm-detail-close').click()
        page.locator('#dharma-tools-toggle').click()
        assert page.locator('#dharma-tools-dialog').is_visible()
        page.locator('#dharma-tools-close').click()
        page.evaluate("PersistentPlayer.showCompanion('context')")
        assert page.locator('#dharma-companion-dialog').is_visible()
        page.locator('#dc-dialog-close').click()
        checks.append('Phúc Minh retains verified compiler / translator; tools and companion remain available when the side panel is hidden')
        for width in [320, 1440]:
            page.set_viewport_size({'width': width, 'height': 900})
            page.evaluate("switchTab('daitanghan')")
            page.locator('#global-search').fill('T20n1067')
            page.locator('#taisho-texts-list [data-library-id="T20n1067"] .catalog-jacket').click()
            page.wait_for_selector('.album-hero .edition-cover')
            page.wait_for_timeout(100)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
            assert page.evaluate('''() => { const a=document.querySelector('.album-hero .edition-title-area'),t=a.querySelector('.edition-title');
              return t.textContent===DAI_TANG_HAN_DATA.texts.find(x=>x.id==='T20n1067').vietTitle && t.scrollHeight<=a.clientHeight+2;
            }''')
        checks.append('The longest Han title remains complete in details and readable beside its small catalog cover')
        page.evaluate('''() => {
          const proof=document.createElement('section'); proof.id='edition-proof'; proof.style.cssText='display:flex;flex-wrap:wrap;gap:20px';
          const refs=Object.keys(EDITION_CREDITS).map(k=>({type:k.split(':')[0],id:k.split(':')[1]}));
          refs.push(...PHUC_MINH_DATA.map(data=>({type:'phucminh',data})));
          for(const ref of refs){const slot=document.createElement('div');slot.style.width='165px';slot.innerHTML=LibraryDesign.jacket(ref);proof.append(slot);}
          document.querySelector('main').append(proof); LibraryDesign.refresh();
        }''')
        page.wait_for_timeout(100)
        assert page.evaluate('''() => [...document.querySelectorAll('#edition-proof .edition-cover')].every(c=>{
          const t=c.querySelector('.edition-title'),a=t.parentElement;
          return t.scrollHeight<=a.clientHeight+2 && [...c.querySelectorAll('.edition-credit')].every(n=>n.scrollHeight<=n.clientHeight+2);
        })''')
        count = page.locator('#edition-proof .edition-cover').count()
        page.evaluate("document.getElementById('edition-proof').remove(); LibraryDesign.refresh()")
        checks.append(f'{count} credited / Phúc Minh covers also fit at the 165 px listening companion size')
        assert not errors, errors
        report = {'checks': checks, 'pageErrors': errors}
        (OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(report, ensure_ascii=False, indent=2))
        browser.close()


if __name__ == '__main__':
    main()

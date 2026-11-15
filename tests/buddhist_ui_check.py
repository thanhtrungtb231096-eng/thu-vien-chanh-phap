"""Browser audit for the Buddhist presentation and its existing interactions."""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'local' / 'runtime' / 'python'))
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

OUT = ROOT / 'tests' / 'artifacts' / 'buddhist-ui'
OUT.mkdir(parents=True, exist_ok=True)
URL = os.environ.get('DHARMA_TEST_URL', 'http://127.0.0.1:8090/web-thuvien/index.html')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH', r'C:\Program Files\Google\Chrome\Application\chrome.exe'), headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    errors, checks = [], []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(URL, wait_until='networkidle')
    page.wait_for_selector('.sanctuary-mandala')
    page.evaluate('document.fonts.ready')
    if '--probe' in sys.argv:
        for width in [1440, 820, 390, 320]:
            page.set_viewport_size({'width': width, 'height': 1000})
            print(json.dumps(page.evaluate('''() => ({width:innerWidth, elements: Object.fromEntries(['.brand-text','.brand-text h1','.sanctuary-hero','.hero-copy p','.sanctuary-corners','.hero-art','.ds-heading','#dharma-sidebar'].map(s => {const e=document.querySelector(s),c=getComputedStyle(e),r=e.getBoundingClientRect();return [s,{display:c.display,font:c.font,width:r.width,height:r.height,color:c.color,opacity:c.opacity}]})), before: {width:getComputedStyle(document.querySelector('.sanctuary-hero'),'::before').width, background:getComputedStyle(document.querySelector('.sanctuary-hero'),'::before').background}})'''), ensure_ascii=False))
        browser.close()
        raise SystemExit(0)

    assert page.evaluate("document.documentElement.dataset.theme === 'parchment'"), 'Fresh visit uses ivory theme'
    module_ids = page.evaluate('ContentModules.model.modules.map(m => m.id)')
    tabs = ['home', *module_ids, 'phucminh', 'daithua', 'daitanghan', 'shelf', 'fulltext', 'timer']
    for width in [1920, 1440, 1280, 1024, 820, 768, 600, 390, 320]:
        page.set_viewport_size({'width': width, 'height': 1000 if width > 767 else 844})
        for theme in ['parchment', 'amber', 'night']:
            page.evaluate('(t) => setTheme(t)', theme)
            for tab in tabs:
                page.evaluate('(t) => switchTab(t)', tab)
                page.wait_for_timeout(70)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (width, theme, tab, 'horizontal overflow')
            page.evaluate("switchTab('home'); scrollTo(0,0)")
            page.screenshot(path=str(OUT / f'home-{theme}-{width}.png'))
            geometry = page.evaluate('''() => {
                const r = s => document.querySelector(s).getBoundingClientRect();
                const hero=r('.sanctuary-hero'), groups=r('#home-content-modules'), head=r('.noble-header'), primary=r('#hero-explore');
                const copy=document.querySelector('.hero-copy'), title=copy.querySelector('h2');
                return {heroFirst: hero.bottom <= groups.top, clearHeader:hero.top>=head.bottom,
                    primaryVisible:primary.bottom<=innerHeight-134, titleFits:title.scrollWidth<=copy.clientWidth+1,
                    target:primary.height>=44, paragraph:getComputedStyle(copy.querySelector('p')).display !== 'none'};
            }''')
            assert all(geometry.values()), (width, theme, geometry)
    checks.append('9 viewport widths × 3 themes: all collection, search, shelf and meditation screens fit; hero actions remain visible')

    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.evaluate("setTheme('parchment'); switchTab('home'); scrollTo(0,0)")
    assert not page.locator('.sanctuary-study-tools').get_attribute('open')
    page.locator('.sanctuary-study-tools > summary').click()
    page.locator('.sanctuary-study-tools button').filter(has_text='Tìm trong kinh văn').click()
    assert page.locator('#fulltext-form').is_visible()
    for module_id in module_ids:
        page.evaluate("switchTab('home'); scrollTo(0,0)")
        page.locator(f'#home-content-modules [data-content-group="{module_id}"]').click()
        assert page.locator(f'#tab-{module_id} .content-module-heading').is_visible()
    page.locator('.brand-wrapper').focus()
    page.keyboard.press('Enter')
    assert page.locator('#tab-home').is_visible()
    checks.append('Three tạng kinh cards open their own tree; study tools open search; keyboard brand navigation returns home')

    page.set_viewport_size({'width': 390, 'height': 844})
    page.locator('#library-menu-toggle').click()
    assert page.locator('#library-menu').is_visible()
    page.screenshot(path=str(OUT / 'mobile-menu.png'))
    page.keyboard.press('Escape')
    assert not page.locator('#library-menu').is_visible()
    page.evaluate("setTheme('night')")
    page.reload(wait_until='networkidle')
    assert page.evaluate("document.documentElement.dataset.theme === 'night'"), 'Saved theme survives reload'
    checks.append('Mobile menu opens and closes with Escape; stored theme remains selected after reload')

    for asset in ['css/buddhist-sanctuary.css?v=1', 'design/lotus-cloud-border.svg', 'design/lotus-corner.svg']:
        assert page.request.get(URL.rsplit('/', 1)[0] + '/' + asset).ok, asset
    assert not errors, errors
    report = {'checks': checks, 'pageErrors': errors, 'widths': 9, 'themes': 3, 'screens': len(tabs)}
    (OUT / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    browser.close()

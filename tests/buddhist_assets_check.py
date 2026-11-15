"""Verify backup integrity, palette contrast and the installed offline shell."""
import hashlib
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'local' / 'runtime' / 'python'))
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

BACKUP = Path(os.environ['DHARMA_BASELINE_DIR']).resolve() if os.environ.get('DHARMA_BASELINE_DIR') else None
OUT = ROOT / 'tests/artifacts/buddhist-ui'
URL = os.environ.get('DHARMA_TEST_URL', 'http://127.0.0.1:8090/web-thuvien/index.html')
checks = []
if BACKUP is not None:
    manifest = json.loads((BACKUP / 'manifest.json').read_text(encoding='utf-8-sig'))
    for item in manifest:
        source = BACKUP / item['path']
        assert source.is_file(), item['path']
        assert hashlib.sha256(source.read_bytes()).hexdigest().upper() == item['sha256'], item['path']
    checks.append(f"All {len(manifest)} historical UI files match the external backup SHA-256")

assets = json.loads((ROOT / 'data/generated/offline-assets.json').read_text(encoding='utf-8'))
assert all(isinstance(a, str) and a.startswith('/') for a in assets)
html = (ROOT / 'app/web/index.html').read_text(encoding='utf-8')
for ref in re.findall(r'(?:href|src)="((?:js|css)/[^" ]+)"', html):
    assert '/web-thuvien/' + ref in assets, ref
checks.append('Offline manifest is a flat URL list and includes every current JS/CSS version')

def contrast(a, b):
    def lum(c):
        channels = [int(v) / 255 for v in re.findall(r'\d+', c)[:3]]
        return sum(w * (v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4)
                   for v, w in zip(channels, [.2126, .7152, .0722]))
    lo, hi = sorted([lum(a), lum(b)])
    return (hi + .05) / (lo + .05)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH', r'C:\Program Files\Google\Chrome\Application\chrome.exe'), headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    page = context.new_page()
    page.goto(URL, wait_until='networkidle')
    page.wait_for_selector('.sanctuary-mandala')
    page.evaluate('document.fonts.ready')
    ratios = {}
    for theme in ['parchment', 'amber', 'night']:
        page.evaluate('(t) => setTheme(t)', theme)
        colors = page.evaluate('''() => {
          const root = getComputedStyle(document.documentElement);
          const color = v => { const e=document.createElement('span');e.style.color=root.getPropertyValue(v);document.body.append(e);const c=getComputedStyle(e).color;e.remove();return c; };
          return Object.fromEntries(['--text-primary','--text-secondary','--text-muted','--bg-surface','--bg-card','--accent','--on-accent'].map(v=>[v,color(v)]));
        }''')
        ratios[theme] = {}
        for ink, background in [('--text-primary','--bg-surface'), ('--text-secondary','--bg-surface'), ('--text-muted','--bg-surface'), ('--text-muted','--bg-card'), ('--on-accent','--accent')]:
            value = contrast(colors[ink], colors[background])
            assert value >= 4.5, (theme, ink, background, value)
            ratios[theme][ink + '/' + background] = round(value, 2)
    checks.append('Main, secondary, muted and button text meet 4.5:1 contrast in all three palettes')
    page.evaluate("setTheme('parchment'); switchTab('home'); scrollTo(0,0)")
    page.screenshot(path=str(OUT / 'home-desktop-full.png'), full_page=True)
    page.evaluate("openTaishoReader('T08n0251','viet')")
    page.wait_for_function('Reader.state.ready')
    page.screenshot(path=str(OUT / 'reader-desktop.png'))
    page.locator('#reader-close').click()

    page.wait_for_function("async () => {const r=await navigator.serviceWorker.getRegistration();return r?.active?.state==='activated';}")
    page.wait_for_function("async () => {const c=await caches.open('cp-shell-v26-buffered-audio');return !!await c.match('/web-thuvien/design/lotus-cloud-border.svg');}")
    for asset in ['css/buddhist-sanctuary.css?v=1','js/ornaments.js?v=buddhist-ui-1','js/dharma-shell.js?v=buddhist-ui-1','design/lotus-corner.svg']:
        assert page.evaluate("async a => !!await (await caches.open('cp-shell-v26-buffered-audio')).match('/web-thuvien/'+a)", asset), asset
    page.reload(wait_until='networkidle')
    assert page.evaluate('!!navigator.serviceWorker.controller')
    context.set_offline(True)
    page.reload(wait_until='domcontentloaded')
    page.wait_for_selector('.sanctuary-mandala')
    assert page.locator('#home-content-modules .content-module-card').count() == 3
    assert page.evaluate("getComputedStyle(document.querySelector('.sanctuary-hero')).borderRadius === '5px'")
    page.screenshot(path=str(OUT / 'offline-home.png'))
    context.set_offline(False)
    checks.append('New service worker precaches the ornament assets and renders the new interface after an offline reload')
    browser.close()

report = {'checks': checks, 'contrast': ratios, 'offlineAssets': len(assets)}
(OUT / 'asset-verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))

"""Render the restored library while sending validators from a newer cached UI."""

import json
from pathlib import Path
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'local/runtime/python'))
from playwright.sync_api import sync_playwright

OUT = ROOT / 'tests/artifacts/restore-cache'
OUT.mkdir(parents=True, exist_ok=True)
URL = 'http://127.0.0.1:8090/web-thuvien/index.html'
errors, failed_assets, shell_responses = [], [], []


def is_shell(url):
    path = urlsplit(url).path
    return path in {'/web-thuvien/index.html', '/web-thuvien/sw.js', '/web-thuvien/manifest.webmanifest'} or path.startswith(('/web-thuvien/css/', '/web-thuvien/js/'))


def newer_cache_request(route):
    headers = dict(route.request.headers)
    if is_shell(route.request.url):
        headers['if-modified-since'] = 'Tue, 01 Jan 2030 00:00:00 GMT'
    route.continue_(headers=headers)


def record_response(response):
    if is_shell(response.url):
        shell_responses.append({'url': response.url, 'status': response.status})
        if response.status != 200:
            failed_assets.append({'url': response.url, 'status': response.status})


with sync_playwright() as p:
    chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
    browser = p.chromium.launch(executable_path=str(chrome), headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    context.route('**/web-thuvien/**', newer_cache_request)
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('response', record_response)
    page.goto(URL, wait_until='networkidle')
    page.wait_for_function('!!window.Reader && !!window.switchTab')
    geometry = []
    for width, height in [(1440, 1000), (390, 844)]:
        page.set_viewport_size({'width': width, 'height': height})
        page.evaluate("switchTab('home'); scrollTo(0,0)")
        bounds = page.locator('.wheel-icon').first.bounding_box()
        assert bounds and 10 <= bounds['width'] <= 96, bounds
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
        assert page.evaluate('Array.from(document.querySelectorAll("link[rel=stylesheet]")).every(link => !!link.sheet)')
        geometry.append({'viewport': width, 'wheelWidth': bounds['width']})
        page.screenshot(path=str(OUT / f'home-{width}.png'))
    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.evaluate("openTaishoReader('T01n0001','viet')")
    page.wait_for_function('Reader.state.ready', timeout=30000)
    assert page.evaluate('Reader.state.doc.blocks.length > 0')
    page.reload(wait_until='networkidle')
    assert page.locator('.wheel-icon').first.bounding_box()['width'] <= 96
    page.wait_for_function('!!navigator.serviceWorker.controller', timeout=30000)
    offline_cache = page.evaluate("async () => (await caches.keys()).filter(key => key.startsWith('cp-shell-'))")
    assert offline_cache
    context.set_offline(True)
    page.reload(wait_until='domcontentloaded')
    page.wait_for_function('!!window.Reader')
    assert page.locator('.wheel-icon').first.bounding_box()['width'] <= 96
    context.set_offline(False)
    assert not failed_assets, failed_assets
    assert not errors, errors
    report = {'geometry': geometry, 'shellResponses': len(shell_responses),
              'failedAssets': failed_assets, 'pageErrors': errors,
              'readerReady': True, 'reloadPassed': True, 'offlinePassed': True}
    (OUT / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    browser.close()

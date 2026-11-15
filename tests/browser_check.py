"""Browser acceptance checks. Uses workspace-local Playwright when installed."""

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
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / 'artifacts'
OUT.mkdir(exist_ok=True)
URL = 'http://127.0.0.1:8090/web-thuvien/index.html'
errors = []

with sync_playwright() as p:
    chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
    browser = p.chromium.launch(executable_path=str(chrome), headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, device_scale_factor=1)
    page.on('pageerror', lambda error: errors.append(str(error)))
    try:
        page.goto(URL, wait_until='networkidle')
        page.screenshot(path=str(OUT / 'home-desktop.png'), full_page=True)
        print(json.dumps({'title': page.title(), 'errors': errors, 'readerReady': page.evaluate('!!window.Reader'), 'home': page.locator('#tab-home').count()}, ensure_ascii=False))
        page.evaluate("openTaishoReader('T01n0001','viet')")
        page.wait_for_function('Reader.state.ready', timeout=30000)
        page.evaluate('Reader.jumpSection(2)')
        page.screenshot(path=str(OUT / 'reader-desktop.png'))
        print(json.dumps(page.evaluate('({sections: Reader.state.sections.length, blocks: Reader.state.doc.blocks.length, visible: document.querySelectorAll("[data-block]").length, voices: [...document.querySelectorAll("#audio-voice option")].map(e=>e.textContent)})'), ensure_ascii=False))
    except Exception:
        page.screenshot(path=str(OUT / 'failure.png'), full_page=True)
        traceback.print_exc()
        raise
    finally:
        (OUT / 'browser-errors.json').write_text(json.dumps(errors, ensure_ascii=False, indent=2), encoding='utf-8')
        browser.close()

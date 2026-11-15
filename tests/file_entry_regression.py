"""Regression for the user's T11n0311 screenshot opened through file://."""

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
import subprocess
import sys
sys.path.insert(0, str(DEPENDENCIES))
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
OUT = Path(__file__).parent / 'artifacts'
OUT.mkdir(exist_ok=True)
errors, checks = [], []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=str(Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'), headless=True)
    page = browser.new_page(viewport={'width':1440,'height':1000})
    page.on('pageerror', lambda error: errors.append(error.stack))
    page.goto((WEB / 'index.html').as_uri() + '#daitanghan')
    page.wait_for_selector('#connection-notice')
    page.evaluate("openTaishoReader('T11n0311','viet')")
    page.wait_for_selector('#reader-recovery a')
    assert 'MO_THU_VIEN.cmd' in page.locator('#reader-paper-content').inner_text()
    assert page.locator('#reader-next').is_disabled()
    assert page.locator('#reader-mark').is_disabled()
    assert page.locator('#audio-sample').is_disabled()
    assert 'chưa có bản Việt' not in page.locator('#audio-status').inner_text()
    assert 'Failed to fetch' not in page.locator('#reader-message').inner_text()
    page.screenshot(path=str(OUT / 'file-entry-guidance.png'))
    checks.append('file:// shows the correct recovery action, no misleading missing-translation state')
    page.locator('#reader-recovery a').click()
    page.wait_for_function("window.Reader && Reader.state.ready",timeout=15000)
    assert page.evaluate("Reader.state.item.data.id === 'T11n0311'")
    assert page.evaluate("Reader.state.doc.length > 50000")
    page.wait_for_function("document.querySelectorAll('#audio-voice option').length >= 2")
    page.locator('#reader-listen-toggle').click()
    # The listen action starts playback without a second play click.
    page.wait_for_function("Audiobook.state.status === 'playing'",timeout=50000)
    page.locator('#audio-play').click()
    page.screenshot(path=str(OUT / 'T11n0311-recovered.png'))
    checks.append('Recovery opens exactly T11n0311 with Vietnamese text, TOC, voices and real playback')
    page.locator('#reader-close').click()
    page.route('**/T11n0311_viet.md',lambda route:route.abort())
    page.evaluate("openTaishoReader('T11n0311','viet')")
    page.wait_for_selector('#reader-retry')
    assert 'máy chủ' in page.locator('#reader-message').inner_text()
    assert 'chưa có bản Việt' not in page.locator('#audio-status').inner_text()
    page.unroute('**/T11n0311_viet.md')
    page.locator('#reader-retry').click()
    page.wait_for_function('Reader.state.ready')
    checks.append('Network failure distinguishes load errors and retry recovers')
    assert not errors, errors
    browser.close()
completed = subprocess.run([sys.executable,'-X','utf8',str(APP / 'launch.py'),'--no-browser'],cwd=str(ROOT.parent),capture_output=True,text=True,timeout=15)
assert completed.returncode == 0, completed.stderr
assert 'Library ready:' in completed.stdout
checks.append('Launcher reuses a working service from any current directory')
result={'checks':checks,'errors':errors}
(OUT/'file-entry-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))

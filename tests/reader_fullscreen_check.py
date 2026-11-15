"""Exercise actual browser fullscreen, fallback, reader state and narration continuity."""

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

import io
import json
import math
import os
from pathlib import Path
import struct
import sys
import wave

sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, str(DEPENDENCIES))
from playwright.sync_api import sync_playwright

BASE = os.environ.get('READER_TEST_URL', 'http://127.0.0.1:8090')
OUT = Path(__file__).parent / 'artifacts/reader-fullscreen'
OUT.mkdir(parents=True, exist_ok=True)
tone = io.BytesIO()
with wave.open(tone, 'wb') as audio:
    audio.setnchannels(1); audio.setsampwidth(2); audio.setframerate(16000)
    audio.writeframes(b''.join(struct.pack('<h', int(800 * math.sin(i * .08))) for i in range(16000 * 30)))
checks, errors = [], []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    page = context.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.route('**/api/tts', lambda route: route.fulfill(status=200, content_type='audio/wav', body=tone.getvalue()))
    page.goto(BASE + '/web-thuvien/index.html#daitang', wait_until='networkidle')
    page.evaluate('LibraryUI.open("ebooks","ep-21bbd16d10a2")')
    page.wait_for_function('Reader.state.ready')
    page.evaluate('Reader.jumpSection(Math.min(1,Reader.state.sections.length-1));document.getElementById("reader-scroll").scrollTop=220')
    page.wait_for_timeout(180)
    before = page.evaluate('Reader.capture()')
    original_height = page.locator('#reader-scroll').bounding_box()['height']
    page.locator('#reader-fullscreen').click()
    page.wait_for_function('document.fullscreenElement===document.documentElement && Reader.state.fullscreen')
    page.wait_for_timeout(180)
    after = page.evaluate('Reader.capture()')
    assert before['block'] == after['block'], (before, after)
    assert abs(before['fraction'] - after['fraction']) < .08, (before, after)
    assert page.locator('#reader-fullscreen').get_attribute('aria-pressed') == 'true'
    assert not page.locator('#dp-play').is_visible()
    assert page.evaluate('Math.abs(document.getElementById("reader-view-container").getBoundingClientRect().height-innerHeight)<2')
    assert page.locator('#reader-scroll').bounding_box()['height'] >= original_height
    page.locator('#reader-font-up').click()
    page.locator('[data-panel="settings"]').click()
    page.get_by_role('button', name='Hiệu đính đoạn', exact=True).click()
    assert page.locator('#correction-dialog').is_visible()
    page.locator('#correction-close').click()
    page.locator('#inspector-close').click()
    page.screenshot(path=str(OUT / 'desktop.png'))
    page.keyboard.press('Escape')
    page.wait_for_function('!document.fullscreenElement && !Reader.state.fullscreen')
    assert page.evaluate('Reader.state.ready') and page.locator('#reader-view-container').is_visible()
    assert not page.locator('#dp-play').is_visible()
    page.keyboard.press('Alt+Enter')
    page.wait_for_function('!!document.fullscreenElement && Reader.state.fullscreen')
    page.locator('#reader-fullscreen').click()
    page.wait_for_function('!document.fullscreenElement && !Reader.state.fullscreen')
    page.keyboard.press('Alt+Enter')
    page.wait_for_function('!!document.fullscreenElement')
    page.evaluate('document.exitFullscreen()')
    page.wait_for_function('!Reader.state.fullscreen')
    assert page.locator('#reader-fullscreen').get_attribute('aria-pressed') == 'false'
    checks.append('Native fullscreen, expanded reading area, exact reading position, font tools, source dialog, Escape, button, shortcut and browser exit')
    print(checks[-1], flush=True)

    page.evaluate('''() => {
      const root=document.documentElement, original=root.requestFullscreen.bind(root);
      root.requestFullscreen=function(){return original().then(()=>new Promise(resolve=>setTimeout(resolve,300)));};
    }''')
    page.locator('#reader-fullscreen').click()
    page.wait_for_function('!!document.fullscreenElement')
    page.locator('#reader-close').click()
    page.wait_for_function('!document.fullscreenElement')
    assert not page.evaluate('Reader.state.fullscreen')
    assert not page.evaluate('document.body.classList.contains("reader-fullscreen-active")')
    assert page.locator('#tab-daitang').is_visible()
    checks.append('Closing during a pending native request cleans up fullscreen without losing library navigation')

    page.reload(wait_until='networkidle')
    page.evaluate('''() => {
      const root=document.documentElement, original=root.requestFullscreen.bind(root);
      root.requestFullscreen=undefined;root.webkitRequestFullscreen=function(){original();};
    }''')
    page.evaluate('LibraryUI.open("ebooks","ep-21bbd16d10a2")')
    page.wait_for_function('Reader.state.ready')
    page.locator('#reader-fullscreen').click()
    page.wait_for_function('!!document.fullscreenElement && Reader.state.fullscreen')
    page.locator('#reader-fullscreen').click()
    page.wait_for_function('!document.fullscreenElement && !Reader.state.fullscreen')
    page.locator('#reader-close').click()
    checks.append('Prefixed fullscreen request without a Promise exits cleanly')

    page.reload(wait_until='networkidle')
    page.evaluate('LibraryUI.open("ebooks","ep-21bbd16d10a2")')
    page.wait_for_function('Reader.state.ready')
    page.evaluate('''() => {
      const button=document.createElement('button');button.id='test-existing-fullscreen';button.textContent='Existing fullscreen';
      button.onclick=()=>document.documentElement.requestFullscreen();document.querySelector('.reader-topbar').append(button);
    }''')
    page.locator('#test-existing-fullscreen').click();page.wait_for_function('!!document.fullscreenElement')
    page.locator('#reader-fullscreen').click()
    assert page.evaluate('Reader.state.fullscreen')
    page.locator('#reader-fullscreen').click()
    assert not page.evaluate('Reader.state.fullscreen') and page.evaluate('!!document.fullscreenElement')
    page.locator('#reader-close').click()
    assert page.evaluate('!!document.fullscreenElement')
    page.evaluate('document.exitFullscreen()');page.wait_for_function('!document.fullscreenElement')
    checks.append('Pre-existing browser fullscreen is preserved when leaving or closing the reader')

    for collection, expression in [
        ('ebooks', 'DAI_TANG_KINH_DATA.find(b=>b.id==="ep-21bbd16d10a2")'),
        ('phucminh', 'PHUC_MINH_DATA.find(b=>b.id==="kinh-nhat-tung")'),
        ('daithua', 'DAI_THUA_DATA.find(b=>b.files?.vietMd)'),
        ('daitang', 'DAI_TANG_HAN_DATA.texts.find(b=>b.hanFile)')
    ]:
        page.reload(wait_until='networkidle')
        page.evaluate('''() => { document.documentElement.requestFullscreen=()=>Promise.reject(new Error('Simulated denied request')); }''')
        page.evaluate('Reader.open({type:'+json.dumps(collection)+',data:'+expression+'},'+json.dumps('han' if collection=='daitang' else 'viet')+')')
        page.wait_for_function('Reader.state.ready')
        page.locator('#reader-fullscreen').click()
        page.wait_for_function('Reader.state.fullscreen && !document.getElementById("reader-fullscreen").disabled')
        assert not page.evaluate('!!document.fullscreenElement')
        assert page.evaluate('Math.abs(document.getElementById("reader-view-container").getBoundingClientRect().height-innerHeight)<2')
        page.locator('#reader-fullscreen').click()
        assert not page.evaluate('Reader.state.fullscreen')
        page.locator('#reader-close').click()
    checks.append('Denied browser API falls back correctly for Đại Tạng Kinh, Chùa Phúc Minh, Đại Thừa and Hán Tạng')
    print(checks[-1], flush=True)

    page.reload(wait_until='networkidle')
    page.evaluate('''() => { Object.defineProperty(document.documentElement,'requestFullscreen',{value:undefined,configurable:true});document.documentElement.webkitRequestFullscreen=undefined; }''')
    page.evaluate('LibraryUI.open("ebooks","ep-21bbd16d10a2")')
    page.wait_for_function('Reader.state.ready')
    page.locator('#reader-fullscreen').click()
    assert page.evaluate('Reader.state.fullscreen')
    page.evaluate('DharmaPlayerStore.playReader()')
    page.wait_for_function('Audiobook.state.status === "playing"')
    page.locator('#reader-fullscreen').click()
    assert page.evaluate('Audiobook.state.status') == 'playing'
    page.locator('#reader-fullscreen').click()
    assert page.evaluate('Audiobook.state.status') == 'playing'
    page.evaluate('Audiobook.pause(); Reader.toggleAudio(false)')
    page.evaluate('Reader.jumpSection(Math.min(1,Reader.state.sections.length-1))')
    for width in (320, 390, 768, 1024):
        page.set_viewport_size({'width': width, 'height': 844})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), width
        assert page.evaluate('Math.abs(document.getElementById("reader-view-container").getBoundingClientRect().height-innerHeight)<2')
        assert page.locator('#reader-fullscreen').is_visible()
        assert page.locator('#reader-fullscreen').bounding_box()['width'] >= 44
        assert page.locator('#reader-next').is_visible()
        page.screenshot(path=str(OUT / f'mobile-{width}.png'))
    page.keyboard.press('Escape')
    assert not page.evaluate('Reader.state.fullscreen')
    assert page.locator('#reader-view-container').is_visible()
    page.locator('#reader-close').click()
    assert not page.evaluate('document.body.classList.contains("reader-fullscreen-active")')
    assert page.locator('#persistent-player').is_visible()
    checks.append('Unsupported browser fallback, playback continuity, reachable exit and responsive layout at 320, 390, 768 and 1024 pixels')
    assert not errors, errors
    browser.close()

result = {'checks': checks, 'browserErrors': errors}
(OUT / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False))

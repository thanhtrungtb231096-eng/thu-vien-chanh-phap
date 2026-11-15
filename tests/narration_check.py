"""Reported Thất Phật passage: migration, complete utterances, audio and screenshots."""

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
from test_spotify_player import fixture_audio, sync_playwright, URL

OUT = Path(__file__).parent / 'artifacts' / 'narration'
OUT.mkdir(exist_ok=True)

with sync_playwright() as p:
    chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
    browser = p.chromium.launch(executable_path=str(chrome), headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
    context.add_init_script("const NativeAudio = window.Audio; window.Audio = function(...args) { const a = new NativeAudio(...args); window.testAudio = a; return a; }; window.Audio.prototype = NativeAudio.prototype")
    context.route('**/api/voices', lambda r: r.fulfill(json={'available': True, 'offlineAvailable': True, 'voices': [], 'offlineVoices': [{'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan'}]}))
    requests = []
    pending = []
    next_text = 'Phật hỏi các Bí sô: “Các Thầy muốn biết không?”'
    def tts(route):
        text = json.loads(route.request.post_data)['text']
        requests.append(text)
        if text == next_text and requests.count(next_text) == 1:
            pending.append(route)
            return
        route.fulfill(body=fixture_audio(), content_type='audio/wav')
    context.route('**/api/tts', tts)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(e.stack))
    try:
        page.goto(URL, wait_until='networkidle')
        # Real v6.0 positions, including the split sentence in the supplied screenshot.
        page.evaluate("""() => {
          LibraryStore.write('listen:daitang:T01n0002', {block:'b-1jf-1jjaz71', chunk:0, seconds:12});
          LibraryStore.write('audio-notes:daitang:T01n0002', [{id:'old-note', index:4, seconds:12, text:'Ghi chú từ bản trước', created:1}]);
          setTheme('parchment');
        }""")
        page.evaluate("DharmaPlayerStore.playItem({type:'daitang', id:'T01n0002'})")
        page.wait_for_function("Audiobook.state.status === 'playing'")
        text = page.evaluate('Audiobook.state.currentText')
        assert text.startswith('Bí-sô thưa:') and text.endswith('nhưng không ai biết được.”'), text
        assert page.evaluate('Audiobook.state.currentTime') < 12
        notes = page.evaluate('DharmaPlayerStore.notes()')
        assert notes[0]['text'] == 'Ghi chú từ bản trước'
        assert notes[0]['segmentation'] == 2 and notes[0]['seconds'] == 0
        assert notes[0]['legacyPosition'] == {'index': 4, 'seconds': 12}
        assert page.evaluate("LibraryStore.read('audio-notes-v1:daitang:T01n0002',[]).length") == 1
        assert page.evaluate("Audiobook.segments[DharmaPlayerStore.notes()[0].index].text") == text
        assert text in requests
        page.locator('#dp-lyrics').click()
        current = page.locator('.dp-verse.is-reading')
        assert current.inner_text() == text
        assert current.get_attribute('data-kind') == 'dialogue'
        page.screenshot(path=str(OUT / 'that-phat-desktop.png'))
        page.locator('#dp-now-close').click()
        # Natural advance uses the already prepared next utterance, rather than requesting it twice.
        page.wait_for_function('(text) => Audiobook.segments[Audiobook.state.index+1].text === text', arg=next_text)
        page.wait_for_timeout(200)
        page.evaluate('testAudio.currentTime = testAudio.duration - 0.03')
        page.wait_for_function('(text) => Audiobook.state.currentText === text && Audiobook.state.status === "loading"', arg=next_text)
        assert len(pending) == 1
        pending.pop().fulfill(body=fixture_audio(), content_type='audio/wav')
        page.wait_for_function('(text) => Audiobook.state.currentText === text && Audiobook.state.status === "playing"', arg=next_text)
        assert requests.count(next_text) == 1, requests
        page.set_viewport_size({'width': 390, 'height': 844})
        page.evaluate('Audiobook.seekChunk(DharmaPlayerStore.notes()[0].index)')
        page.wait_for_function("Audiobook.state.status === 'playing'")
        page.locator('#dp-cover').click()
        assert page.locator('.dp-verse.is-reading').inner_text() == text
        assert page.locator('#dp-verses').evaluate('e => e.scrollWidth <= e.clientWidth + 1')
        page.screenshot(path=str(OUT / 'that-phat-mobile.png'))
        assert not errors, errors
        report = {'checks': ['Complete dialogue across page footnotes', 'Legacy resume and note migration with backup', 'Displayed and spoken text match', 'No duplicate next-chunk TTS request', 'Desktop and mobile layout'], 'errors': errors}
        (OUT / 'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(report, ensure_ascii=False))
    finally:
        browser.close()

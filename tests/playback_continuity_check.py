"""Browser regressions for buffering, pause/resume and replay controls."""

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


def main():
    with sync_playwright() as p:
        chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
        browser = p.chromium.launch(executable_path=str(chrome), headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        context.add_init_script("""const NativeAudio = Audio;
            window.Audio = function() { return window.testAudio = new NativeAudio(); };
            window.Audio.prototype = NativeAudio.prototype;""")
        context.route('**/api/voices', lambda r: r.fulfill(json={'available': True, 'offlineAvailable': True, 'voices': [], 'offlineVoices': [
            {'id': 'vieneu-thien-tam-duc', 'name': 'Thiền Tâm Đức · Nam (Trầm tĩnh)'},
            {'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan · Nữ (Dịu dàng)'}]}))
        wav, requests, held, errors = fixture_audio(), [], [], []
        hold_text, fail_once = [None], [None]

        def tts(route):
            payload = json.loads(route.request.post_data)
            requests.append(payload)
            if payload['text'] == fail_once[0]:
                fail_once[0] = None
                route.fulfill(status=502, json={'error': 'Tạm thời mất kết nối giọng đọc.'})
            elif payload['text'] == hold_text[0]:
                held.append(route)
            else:
                route.fulfill(body=wav, content_type='audio/wav')

        context.route('**/api/tts', tts)
        page = context.new_page()
        page.on('pageerror', lambda e: errors.append(e.stack))
        try:
            page.goto(URL, wait_until='networkidle')
            page.evaluate("DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_2'})")
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.wait_for_timeout(500)
            upcoming = page.evaluate('Audiobook.segments.slice(1,4).map(q => q.text)')
            assert all(any(r['text'] == text for r in requests) for text in upcoming)

            # Pause retains the decoded audio source and resumes at the same second.
            page.evaluate('Audiobook.seekTime(12); Audiobook.pause()')
            source = page.evaluate('testAudio.src')
            assert source and page.evaluate('Audiobook.state.currentTime') >= 12
            page.locator('#dp-play').click()
            page.wait_for_function("Audiobook.state.status === 'playing'")
            assert page.evaluate('testAudio.src') == source
            assert page.evaluate('Audiobook.state.currentTime') >= 12

            # Natural completion saves zero for the NEXT passage, not the old duration.
            page.evaluate('testAudio.currentTime = testAudio.duration - .03')
            page.wait_for_function("Audiobook.state.index === 1 && Audiobook.state.status === 'playing'")
            assert page.evaluate("LibraryStore.read('listen:' + Audiobook.state.key).seconds") == 0
            assert sum(r['text'] == upcoming[0] for r in requests) == 1

            # Replay the whole book, clearing an existing A-B region.
            page.evaluate('Audiobook.toggleRepeat(); Audiobook.seekChunk(3)')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate('Audiobook.toggleRepeat(); Audiobook.seekTime(15)')
            page.locator('#dp-restart').click()
            page.wait_for_function("Audiobook.state.index === 0 && Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.currentTime') < 2
            assert page.evaluate('Audiobook.state.repeatA') == -1
            assert page.evaluate('Audiobook.state.repeatB') == -1

            # A paused source must be discarded when changing voice.
            page.evaluate('Audiobook.pause()')
            source = page.evaluate('testAudio.src')
            page.locator('#dp-settings').click()
            page.locator('#audio-voice').select_option('offline:vieneu-thuc-doan')
            page.locator('#dp-options-close').click()
            page.locator('#dp-play').click()
            page.wait_for_function("Audiobook.state.status === 'playing'")
            assert page.evaluate('testAudio.src') != source
            assert any(r['voice'] == 'vieneu-thuc-doan' for r in requests)

            # Replay only the current passage, preserving its index.
            page.evaluate('Audiobook.seekChunk(2)')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate('Audiobook.seekTime(15); Audiobook.pause()')
            page.locator('#dp-settings').click()
            page.locator('#dp-restart-chunk').click()
            page.wait_for_function("Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.index') == 2
            assert page.evaluate('Audiobook.state.currentTime') < 2

            # A transient service failure is retried without user intervention.
            fail_once[0] = page.evaluate('Audiobook.segments[16].text')
            page.evaluate('Audiobook.seekChunk(16)')
            page.wait_for_function("Audiobook.state.index === 16 && Audiobook.state.status === 'playing'")
            assert fail_once[0] is None
            text = page.evaluate('Audiobook.state.currentText')
            assert sum(r['text'] == text and r['voice'] == 'vieneu-thuc-doan' for r in requests) == 2

            # Hold the next prefetch across an ended event; no duplicate request.
            hold_text[0] = page.evaluate('Audiobook.segments[11].text')
            page.evaluate('Audiobook.seekChunk(10)')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.wait_for_timeout(200)
            assert held
            page.evaluate('testAudio.currentTime = testAudio.duration - .03')
            page.wait_for_function("Audiobook.state.index === 11 && Audiobook.state.status === 'loading'")
            assert page.evaluate('Audiobook.state.currentTime') == 0
            assert page.evaluate("LibraryStore.read('listen:' + Audiobook.state.key).seconds") == 0
            held.pop().fulfill(body=wav, content_type='audio/wav')
            hold_text[0] = None
            page.wait_for_function("Audiobook.state.index === 11 && Audiobook.state.status === 'playing'")
            text = page.evaluate('Audiobook.state.currentText')
            assert sum(r['text'] == text and r['voice'] == 'vieneu-thuc-doan' for r in requests) == 1

            # Restart while an old request is pending; its late response cannot take over.
            hold_text[0] = page.evaluate('Audiobook.segments[20].text')
            page.evaluate('Audiobook.seekChunk(20)')
            page.wait_for_timeout(200)
            assert held and page.evaluate('Audiobook.state.status') == 'loading'
            page.locator('#dp-restart').click()
            page.wait_for_function("Audiobook.state.index === 0 && Audiobook.state.status === 'playing'")
            held.pop().fulfill(body=wav, content_type='audio/wav')
            hold_text[0] = None
            page.wait_for_timeout(200)
            assert page.evaluate('Audiobook.state.index') == 0
            assert page.evaluate('Audiobook.state.status') == 'playing'

            for width in [1440, 1024, 820, 390, 320]:
                page.set_viewport_size({'width': width, 'height': 900})
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
                if width < 768:
                    page.locator('#dp-settings').click()
                    page.locator('#dp-expand').click()
                else:
                    page.locator('#dp-cover').click()
                assert page.locator('#dp-now-restart').is_visible()
                page.locator('#dp-now-restart').click()
                page.wait_for_function("Audiobook.state.index === 0 && Audiobook.state.status === 'playing'")
                page.locator('#dp-now-close').click()
            assert not errors, errors
            print('PASS: three-passage prefetch, retained pause/resume, saved transition position, voice change, whole-book/current-passage replay, transient service retry, delayed and cancelled requests, desktop/mobile controls')
        finally:
            browser.close()


if __name__ == '__main__':
    main()

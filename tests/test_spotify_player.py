"""Dharma shell regression: deterministic audio, real documents and browser layout."""

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
import struct
import sys
import wave
from pathlib import Path

sys.path.insert(0, str(DEPENDENCIES))
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / 'artifacts' / 'spotify'
OUT.mkdir(parents=True, exist_ok=True)
URL = os.environ.get('DHARMA_TEST_URL', 'http://127.0.0.1:8090/web-thuvien/index.html')


def fixture_audio():
    stream = io.BytesIO()
    with wave.open(stream, 'wb') as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(8000)
        audio.writeframes(b''.join(struct.pack('<h', int(50 * math.sin(i * 0.2))) for i in range(8000 * 40)))
    return stream.getvalue()


def main():
    errors, checks = [], []
    with sync_playwright() as p:
        chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
        if not chrome.is_file():
            chrome = Path(os.environ.get('CHROME_PATH', r'C:\Program Files\Google\Chrome\Application\chrome.exe'))
        browser = p.chromium.launch(executable_path=str(chrome), headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        context.add_init_script("""const OriginalAudio = window.Audio; window.Audio = function(...args) { const audio = new OriginalAudio(...args); window.__testAudio = audio; return audio; }; window.Audio.prototype = OriginalAudio.prototype;""")
        context.route('**/api/voices', lambda r: r.fulfill(json={'available': True, 'offlineAvailable': True, 'voices': [], 'offlineVoices': [{'id': 'vieneu-thien-tam-duc', 'name': 'Thiền Tâm Đức'}, {'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan'}]}))
        wav = fixture_audio()
        context.route('**/api/tts', lambda r: r.fulfill(body=wav, content_type='audio/wav'))
        page = context.new_page()
        page.on('pageerror', lambda e: errors.append(e.stack))
        page.goto(URL, wait_until='networkidle')
        if errors:
            print(json.dumps(errors, ensure_ascii=False), flush=True)
            page.screenshot(path=str(OUT / 'init-failure.png'))
            browser.close()
            raise RuntimeError('Initialization failed')
        page.wait_for_selector('#persistent-player',state='attached')
        if '--inspect' in sys.argv:
            for width, height in [(1440, 1000), (390, 844)]:
                page.set_viewport_size({'width': width, 'height': height})
                page.screenshot(path=str(OUT / f'home-{width}.png'), full_page=False)
            print(json.dumps({'errors': errors, 'bodyWidth': page.evaluate('document.documentElement.scrollWidth')}, ensure_ascii=False))
            browser.close()
            return
        try:
            for width, height in [(1920, 1080), (1440, 1000), (1200, 900), (1024, 900), (820, 1000), (768, 1024), (390, 844), (320, 740)]:
                page.set_viewport_size({'width': width, 'height': height})
                for theme in ['night', 'parchment', 'amber']:
                    page.evaluate('(theme) => setTheme(theme)', theme)
                    for tab in ['home', 'daithua', 'daitanghan', 'appendix', 'shelf', 'glossary', 'notes']:
                        page.evaluate('(tab) => switchTab(tab)', tab)
                        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (width, theme, tab, page.evaluate('document.documentElement.scrollWidth'))
                page.evaluate("setTheme('night'); switchTab('home')")
                page.screenshot(path=str(OUT / f'home-{width}.png'))
            checks.append('Eight viewport widths × three themes × seven screens: no horizontal page overflow')
            page.set_viewport_size({'width': 1440, 'height': 1000})
            page.locator('#global-search').fill('bat nha')
            page.wait_for_selector('.global-result')
            assert page.locator('.global-result').count() > 0
            page.locator('#global-search').fill('')
            page.locator('.featured-detail').first.click()
            page.wait_for_selector('.album-track')
            page.locator('#album-save').click()
            assert page.locator('#album-save').get_attribute('aria-pressed') == 'true'
            page.locator('#album-play').click()
            page.wait_for_function("Audiobook.state.status === 'playing'")
            key = page.evaluate('Audiobook.state.key')
            page.wait_for_timeout(350)
            start = page.evaluate('Audiobook.state.currentTime')
            for tab in ['home', 'daithua', 'daitanghan', 'glossary', 'shelf', 'appendix', 'roadmap', 'practical', 'milinda', 'notes']:
                page.evaluate('(tab) => switchTab(tab)', tab)
                assert page.evaluate('Audiobook.state.key') == key
                assert page.evaluate('Audiobook.state.status') == 'playing'
            page.evaluate("openTriReader('dt_01_2', 'viet')")
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Audiobook.state.key') == key
            page.locator('#reader-close').click()
            assert page.evaluate('Audiobook.state.status') == 'playing'
            assert page.evaluate('Audiobook.state.currentTime') > start
            checks.append('Playback survives ten library screens and opening/closing a different reader')
            page.locator('#dp-settings').click()
            page.locator('#audio-rate').fill('1.25')
            page.locator('#audio-rate').dispatch_event('change')
            page.locator('#audio-sleep').select_option('15')
            assert page.evaluate('Audiobook.state.rate') == 1.25
            assert page.evaluate('Audiobook.state.deadline > Date.now()')
            page.locator('#dp-options-close').click()
            page.evaluate('Audiobook.seekTime(12)')
            assert page.evaluate('Audiobook.state.currentTime') >= 12
            page.locator('#dp-settings').click()
            page.locator('#dp-ab').click()
            page.evaluate('Audiobook.seekChunk(2)')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.locator('#dp-ab').click()
            page.locator('#dp-options-close').click()
            assert page.evaluate('Audiobook.state.repeatA') == 0
            assert page.evaluate('Audiobook.state.repeatB') == 2
            page.locator('#dp-lyrics').click()
            assert page.locator('.dp-verse.is-reading').count() == 1
            page.locator('.dp-verse').nth(3).click()
            page.wait_for_function('Audiobook.state.index === 3')
            page.locator('#dp-now-close').click()
            page.evaluate("PersistentPlayer.showCompanion('notes')")
            page.locator('[data-companion="notes"]').click()
            page.locator('#dc-note').fill('Suy ngẫm <script>không thực thi</script>')
            page.locator('#dc-note-form button').click()
            assert page.locator('.dc-note p').inner_text() == 'Suy ngẫm <script>không thực thi</script>'
            assert len(page.evaluate('DharmaPlayerStore.notes()')) == 1
            checks.append('Real audio element seek/rate/timer, A–B markers, interactive lyrics and escaped timestamped notes')
            if page.locator('#dharma-companion-dialog').is_visible():
                page.locator('#dc-dialog-close').click()
            page.evaluate("DharmaShell.openAlbum({type:'daithua',id:'dt_01_2'})")
            page.wait_for_selector('.album-track')
            page.locator('#album-queue').click()
            assert page.locator('.dc-queue-item').count() == 1
            if page.locator('#dharma-companion-dialog').is_visible():
                page.locator('#dc-dialog-close').click()
            page.locator('#ds-create').click()
            page.locator('#ds-playlist-name').fill('Khóa tụng kiểm thử')
            page.evaluate("LibraryCatalog.setSelection(document.getElementById('ds-playlist-books'),['daithua:dt_01_1','daithua:dt_01_2'])")
            page.locator('#ds-create-form').evaluate('(form)=>form.requestSubmit()')
            assert page.locator('#ds-playlists .ds-playlist').count() == 1
            page.reload(wait_until='networkidle')
            assert page.locator('#ds-playlists .ds-playlist').count() == 1
            assert page.evaluate('DharmaPlayerStore.state.queue.length') == 1
            assert page.evaluate('LibraryStore.read("favorites", []).length') == 1
            checks.append('Favorites, custom playlists and listening queue persist after reload')
            page.set_viewport_size({'width': 390, 'height': 844})
            page.locator('[data-mobile-nav="daily"]').click()
            page.locator('#daily-play').click()
            page.wait_for_function("Audiobook.state.status === 'playing'")
            assert page.locator('#dharma-companion-dialog').is_visible()
            page.locator('#dc-dialog-close').click()
            page.locator('#dp-settings').click()
            page.locator('#dp-expand').click()
            page.screenshot(path=str(OUT / 'lyrics-mobile.png'))
            page.locator('#dp-now-close').click()
            page.locator('#dp-play').click()
            assert page.evaluate('Audiobook.state.status') == 'paused'
            checks.append('Mobile daily playlist, companion sheet, full lyrics and mini-player pause')
            page.locator('#dp-settings').click()
            page.locator('#dp-expand').click()
            page.locator('#dp-now-settings').click()
            page.locator('#audio-voice').select_option('offline:vieneu-thuc-doan')
            page.locator('#dp-options-volume').evaluate("e => { e.value = '0.5'; e.dispatchEvent(new Event('input')); }")
            assert page.evaluate('Audiobook.state.volume') == 0.5
            page.keyboard.press('Escape')
            assert not page.locator('#dp-options').is_visible()
            page.locator('#library-menu-toggle').click()
            page.locator('#nav-glossary').click()
            assert page.locator('#tab-glossary').is_visible()
            page.set_viewport_size({'width': 820, 'height': 1000})
            page.locator('#dharma-tools-toggle').click()
            page.locator('[data-tool-nav="notes"]').click()
            assert page.locator('#tab-notes').is_visible()
            page.locator('#global-search').fill('duoc su')
            page.wait_for_selector('.global-result')
            assert page.locator('#tab-home').is_visible()
            page.locator('#global-search').fill('')
            checks.append('Mobile voice/volume controls, Escape, menu; tablet tools and global search from notes')

            page.evaluate("CollectionPlayer.stop(); Audiobook.setRepeat('off'); DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_2'})")
            page.wait_for_function("Audiobook.state.status === 'playing' && Audiobook.state.key === 'daithua:dt_01_2'")
            page.evaluate('Audiobook.seekChunk(0)')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate('Audiobook.toggleRepeat(); Audiobook.seekChunk(1)')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate("Audiobook.toggleRepeat(); Audiobook.setRepeat('off', 3)")
            for count in range(1, 4):
                page.evaluate('Audiobook.seekChunk(1)')
                page.wait_for_function("Audiobook.state.status === 'playing'")
                page.evaluate('window.__testAudio.currentTime = window.__testAudio.duration - 0.03')
                page.wait_for_function('(count) => Audiobook.state.repeatCount === count', arg=count)
                if count < 3:
                    page.wait_for_function("Audiobook.state.index === 0 && Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.status') == 'paused'
            page.evaluate("Audiobook.toggleRepeat(); Audiobook.setRepeat('off'); DharmaPlayerStore.removeQueue(0); DharmaPlayerStore.enqueue({type:'daithua',id:'dt_01_1'}); Audiobook.seekChunk(Audiobook.state.count - 1)")
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate('window.__testAudio.currentTime = window.__testAudio.duration - 0.03')
            page.wait_for_function("Audiobook.state.key === 'daithua:dt_01_1' && Audiobook.state.status === 'playing'")
            assert page.evaluate('DharmaPlayerStore.state.queue.length') == 0
            checks.append('Natural audio ended events: A–B loops stop at three recitations, next queued sutra starts automatically')

            for width in [1440, 390, 320]:
                page.set_viewport_size({'width': width, 'height': 900})
                page.evaluate("openTriReader('dt_01_2', 'dual')")
                page.wait_for_function('Reader.state.ready')
                assert page.locator('#reader-scroll').bounding_box()['height'] > 200
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
                assert page.evaluate('document.getElementById("dharma-sidebar").inert')
                page.screenshot(path=str(OUT / f'reader-{width}.png'))
                page.locator('#reader-close').click()
                assert not page.evaluate('document.getElementById("dharma-sidebar").inert')
            checks.append('Bilingual reader remains usable above the persistent player at 1440, 390 and 320 px')
            page.evaluate("openTriReader('dt_01_2', 'viet')")
            page.wait_for_function('Reader.state.ready')
            page.locator('#reader-listen-toggle').click()
            page.locator('#dp-settings').click()
            page.locator('#reader-hear-visible').click()
            page.wait_for_function("Audiobook.state.key === 'daithua:dt_01_2' && Audiobook.state.status === 'playing'")
            page.locator('#reader-close').click()
            checks.append('Explicit Listen in a second reader switches audio to that book')
            page.route('**/api/tts', lambda r: r.fulfill(status=502, json={'error': 'Giọng đọc đang gián đoạn. Vui lòng thử lại.'}))
            page.evaluate("DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_2'}, {restart:true})")
            page.wait_for_function("Audiobook.state.status === 'error'")
            assert page.locator('#dharma-notice').is_visible()
            page.unroute('**/api/tts')
            page.locator('#dp-play').click()
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.clock.install()
            page.evaluate("document.getElementById('audio-sleep').value = '15'; document.getElementById('audio-sleep').dispatchEvent(new Event('change'))")
            page.clock.fast_forward(15 * 60 * 1000 + 1000)
            assert page.evaluate('Audiobook.state.status') == 'paused'
            assert page.evaluate('Audiobook.state.deadline') == 0
            checks.append('TTS service failure displays a recoverable error; the sleep deadline actually pauses playback')

            fresh_context = browser.new_context(viewport={'width': 390, 'height': 844})
            fresh_context.route('**/api/voices', lambda r: r.fulfill(json={'available': False, 'voices': []}))
            fresh_context.add_init_script("if ('speechSynthesis' in window) speechSynthesis.getVoices = () => []")
            fresh = fresh_context.new_page()
            fresh.on('pageerror', lambda e: errors.append(e.stack))
            fresh.goto(URL, wait_until='networkidle')
            fresh.wait_for_selector('#persistent-player',state='attached')
            fresh.locator('.featured-detail').first.click()
            fresh.wait_for_selector('#album-play')
            fresh.locator('#album-play').click()
            fresh.wait_for_function("Audiobook.state.status === 'error'")
            assert fresh.locator('#dharma-notice').is_visible()
            fresh_context.close()
            checks.append('Fresh mobile startup and unavailable-voice state remain usable without JavaScript errors')
            assert not errors, errors
            (OUT / 'results.json').write_text(json.dumps({'checks': checks, 'errors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
            print('\n'.join('PASS: ' + x for x in checks))
        except Exception:
            page.screenshot(path=str(OUT / 'failure.png'))
            print(json.dumps({'errors': errors, 'checks': checks}, ensure_ascii=False))
            raise
        finally:
            browser.close()


if __name__ == '__main__':
    main()

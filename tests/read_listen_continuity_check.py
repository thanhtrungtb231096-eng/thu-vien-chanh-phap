"""Reading/listening transitions in a real browser, with isolated local audio fixtures."""
import io
import json
from pathlib import Path
import sys
import threading
import wave

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
sys.stdout.reconfigure(encoding='utf-8')
import server
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright


async def unused(*args):
    raise AssertionError('All synthesis must use local browser fixtures')
    yield b''


class Quiet(server.Handler):
    def log_message(self, *args):
        pass


def audio_fixture(seconds):
    output = io.BytesIO()
    with wave.open(output, 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(8000)
        wav.writeframes(b'\0\0' * int(8000 * seconds))
    return output.getvalue()


DOCUMENT = '# Bản đọc thử\n\n## Phẩm thứ nhất\n\nCâu mở đầu của phẩm thứ nhất.\n\nCâu tiếp theo để kiểm tra nghe liền mạch.\n\n## Phẩm thứ hai\n\nLời kinh ở phẩm thứ hai.\n\nĐây là câu cuối của bản đọc thử.'
OUT = ROOT / 'tests/artifacts/read-listen-continuity'


def main():
    memory = {}
    server.STREAM_ENGINE = NarrationEngine(memory.get, memory.__setitem__, unused, log_path=None)
    http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
    http.allowed_patterns = set()
    thread = threading.Thread(target=http.serve_forever, daemon=True)
    thread.start()
    checks, errors = [], []
    long_audio, short_audio = audio_fixture(40), audio_fixture(.25)
    short = [False]
    try:
        with sync_playwright() as p:
            chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
            if not chrome.is_file():
                chrome = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
            browser = p.chromium.launch(executable_path=str(chrome), headless=True)
            context = browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block')
            context.add_init_script('''const NativeAudio = Audio;
                window.Audio = function() { return window.testAudio = new NativeAudio(); };
                Audio.prototype = NativeAudio.prototype;''')
            context.route('**/api/voices', lambda r: r.fulfill(json={'available': True, 'offlineAvailable': True, 'voices': [], 'offlineVoices': [
                {'id': 'vieneu-thien-tam-duc', 'name': 'Thiền Tâm Đức'},
                {'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan'}], 'audioConfig': {'startupBufferSeconds': 0}}))
            context.route('**/api/tts', lambda r: r.fulfill(body=short_audio if short[0] else long_audio, content_type='audio/wav'))
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html', wait_until='networkidle')
            paths = page.evaluate('''['dt_01_2', 'dt_01_1'].map(id =>
                new URL(Reader.path(DharmaPlayerStore.resolve({type:'daithua', id}), 'viet'), location.href).href)''')
            for path in paths:
                context.route(path, lambda r: r.fulfill(body=DOCUMENT, content_type='text/plain; charset=utf-8'))
            page.evaluate("void DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_2'}, {restart:true})")
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate("void Reader.open(DharmaPlayerStore.state.item, 'viet')")
            page.wait_for_function('Reader.state.ready')
            page.locator('#reader-listen-toggle').click()
            assert page.locator('#dp-play').is_visible()
            assert page.locator('#dp-play').get_attribute('aria-label') == 'Tạm dừng nghe kinh'
            assert page.locator('#dp-play').get_attribute('aria-pressed') == 'true'
            assert not page.locator('#reader-inspector').is_visible()
            assert not page.locator('#audio-chapter').is_visible()
            assert not page.locator('#audio-follow').is_visible()
            text_box = page.locator('#reader-scroll').bounding_box()
            dock_box = page.locator('#persistent-player').bounding_box()
            assert text_box['y'] + text_box['height'] <= dock_box['y'] + 1
            assert dock_box['height'] <= 64
            assert page.locator('.reader-bottombar #persistent-player').is_visible()

            # Moving through a playing book must keep playing; a paused book stays paused.
            page.locator('#dp-next').click()
            page.wait_for_function("Audiobook.state.index === 1 && Audiobook.state.status === 'playing'")
            page.locator('#dp-prev').click()
            page.wait_for_function("Audiobook.state.index === 0 && Audiobook.state.status === 'playing'")
            chapters = page.evaluate('Audiobook.segments.map((q,i)=>q.heading ? i : -1).filter(i=>i>=0)')
            page.locator('#dp-settings').click()
            assert page.locator('#audio-follow').is_visible()
            page.locator('.dp-chapters > summary',has_text='Phẩm & vị trí nghe').click()
            assert page.locator('#audio-chapter').is_visible()
            page.locator('#audio-chapter').select_option(str(chapters[-1]))
            page.wait_for_function('(i)=>Audiobook.state.index === i && Audiobook.state.status === "playing"', arg=chapters[-1])
            page.evaluate('Audiobook.pause()')
            page.locator('#audio-chapter').select_option(str(chapters[0]))
            assert page.evaluate("Audiobook.state.status === 'paused' && testAudio.paused")
            page.locator('#dp-options-close').click()
            page.locator('#dp-play').click()
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.locator('#dp-settings').click()
            page.locator('#audio-voice').select_option('offline:vieneu-thuc-doan')
            page.wait_for_function("Audiobook.state.status === 'playing' && Audiobook.state.voice === 'offline:vieneu-thuc-doan'")
            page.locator('#dp-options-close').click()
            checks.append('A small dock reserves reading space; advanced options open only on request; navigation preserves playing/paused state')
            print(checks[-1], flush=True)

            # A queued book cannot make Next skip the remaining passages of the current book.
            page.evaluate("Audiobook.seekChunk(0); DharmaPlayerStore.enqueue({type:'daithua',id:'dt_01_1'})")
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.locator('#dp-next').click()
            page.wait_for_function("Audiobook.state.index === 1 && Audiobook.state.status === 'playing'")
            assert page.evaluate("Audiobook.state.key === 'daithua:dt_01_2' && DharmaPlayerStore.state.queue.length === 1")
            checks.append('Next moves one passage before consuming the next queued book')
            print(checks[-1], flush=True)

            # End-event delivery can be missed by the browser; the media clock still reaches ended.
            page.evaluate('testAudio.onended=null;testAudio.currentTime=testAudio.duration-.03')
            page.wait_for_function("Audiobook.state.index === 2 && Audiobook.state.status === 'playing'", timeout=4000)
            checks.append('A missing ended event is detected and automatically advances once')
            print(checks[-1], flush=True)

            # Pausing while the final stream status is being checked must not lose completion.
            page.evaluate('''() => {
                window.originalCompletion = AudioService.completion;
                window.completionCalls = 0;
                AudioService.completion = () => { completionCalls++; return new Promise(resolve=>window.releaseCompletion=resolve); };
                testAudio.currentTime=testAudio.duration-.03;
            }''')
            page.wait_for_function('window.completionCalls === 1')
            page.evaluate('Audiobook.pause(); testAudio.dispatchEvent(new Event("ended"))')
            page.evaluate('releaseCompletion({done:true,complete:true})')
            page.wait_for_timeout(100)
            assert page.evaluate("Audiobook.state.index === 2 && Audiobook.state.status === 'paused'")
            page.evaluate('AudioService.completion=originalCompletion; void Audiobook.start()')
            page.wait_for_function("Audiobook.state.index === 3 && Audiobook.state.status === 'playing'")
            assert page.evaluate('completionCalls') == 1
            checks.append('Pause during asynchronous completion stays paused; resume starts the next passage without replaying the old one')
            print(checks[-1], flush=True)

            # Stale saved positions must not truncate a queued or collection book.
            page.evaluate('''() => {
                const q=Audiobook.segments[3];
                LibraryStore.write('listen:daithua:dt_01_1', {...q, index:3, seconds:19, segmentation:NarrationModel.VERSION});
                Audiobook.seekChunk(Audiobook.state.count-1);
            }''')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate('testAudio.currentTime=testAudio.duration-.03')
            page.wait_for_function("Audiobook.state.key === 'daithua:dt_01_1' && Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.index') == 0
            assert page.evaluate('Audiobook.state.currentTime') < 2
            assert page.evaluate('DharmaPlayerStore.state.queue.length') == 0
            page.evaluate("CollectionPlayer.start('Bộ thử', [{type:'daithua',id:'dt_01_2',title:'Kinh một'},{type:'daithua',id:'dt_01_1',title:'Kinh hai'}])")
            page.wait_for_function("Audiobook.state.key === 'daithua:dt_01_2' && Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.index') == 0
            page.evaluate('Audiobook.seekChunk(Audiobook.state.count-1)')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate('testAudio.currentTime=testAudio.duration-.03')
            page.wait_for_function("CollectionPlayer.state.current === 1 && Audiobook.state.key === 'daithua:dt_01_1' && Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.index') == 0
            checks.append('Queued and collection books advance automatically from their beginning, regardless of saved listening positions')
            print(checks[-1], flush=True)

            # Cancel during a heading pause; its delayed continuation must never start.
            page.evaluate('CollectionPlayer.stop(); Audiobook.seekChunk(0)')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate('testAudio.currentTime=testAudio.duration-.03')
            page.wait_for_function("Audiobook.state.index === 1 && Audiobook.state.status === 'loading'")
            page.evaluate('Audiobook.pause()')
            page.wait_for_timeout(900)
            assert page.evaluate("Audiobook.state.index === 1 && Audiobook.state.status === 'paused' && testAudio.paused")
            checks.append('Pausing in the gap before a chapter cancels its delayed playback')

            # Let short audio finish naturally across every heading and reading section.
            short[0] = True
            page.evaluate('''doc => {
                Audiobook.connect(ReaderModel.parse(doc), 'test:natural-sequence', 'unavailable', true);
                window.played=[];window.finished=0;
                testAudio.addEventListener('playing',()=>played.push(Audiobook.state.index));
                addEventListener('sutra-finished',e=>{if(e.detail.key==='test:natural-sequence')finished++;});
                void Audiobook.start();
            }''', DOCUMENT.replace('Câu', 'Một câu thử mới'))
            count = page.evaluate('Audiobook.state.count')
            page.wait_for_function('finished === 1', timeout=20000)
            assert page.evaluate('played') == list(range(count))
            page.wait_for_timeout(1200)
            assert page.evaluate('finished') == 1
            assert page.evaluate("Audiobook.state.status === 'idle'")
            checks.append(f'{count} passages and chapter boundaries finish in source order, with exactly one book-completion event')
            print(checks[-1], flush=True)

            # Reader page/part indicator opens the current outline; controls remain usable on phones.
            page.locator('#reader-page-indicator').click()
            assert page.locator('#reader-sidebar').is_visible()
            page.locator('#reader-toc-toggle').click()
            page.evaluate("void DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_2'}, {restart:true})")
            page.wait_for_function("Audiobook.state.key === 'daithua:dt_01_2' && Audiobook.state.status === 'playing'")
            page.evaluate('Audiobook.pause(); Reader.toggleAudio(true)')
            page.evaluate('Reader.jumpSection(1)')
            OUT.mkdir(parents=True, exist_ok=True)
            dimensions = []
            for width in (1920, 1440, 1024, 768, 390, 320):
                page.set_viewport_size({'width': width, 'height': 900})
                page.wait_for_timeout(160)
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
                for selector in ('#dp-play', '#dp-next', '#dp-prev', '#dp-settings'):
                    assert page.locator(selector).is_visible(), (width, selector)
                text_box = page.locator('#reader-scroll').bounding_box()
                dock_box = page.locator('#persistent-player').bounding_box()
                assert text_box['y'] + text_box['height'] <= dock_box['y'] + 1
                assert text_box['height'] > 500, (width, text_box)
                assert dock_box['height'] <= (64 if width > 767 else 108), (width, dock_box)
                assert page.locator('#dp-play').get_attribute('aria-label') == 'Nghe tiếp'
                assert page.locator('#dp-play').get_attribute('aria-pressed') == 'false'
                for selector in ('#dp-play', '#dp-prev', '#dp-next', '#dp-settings'):
                    box = page.locator(selector).bounding_box()
                    assert box['width'] >= 44 and box['height'] >= 44, (width, selector, box)
                dimensions.append({'width':width,'audioHeight':dock_box['height'],'readingHeight':text_box['height']})
                assert page.locator('#persistent-player').is_visible()
                page.locator('#dp-settings').click()
                assert page.locator('#audio-follow').is_visible()
                assert page.locator('#audio-voice').is_visible()
                assert page.locator('#audio-chapter').is_visible()
                page.locator('#dp-options-close').click()
                page.screenshot(path=str(OUT / f'reader-listen-{width}.png'))
                if width == 1920:
                    page.screenshot(path=str(OUT / 'minimal-controls-desktop.png'), clip={'x':0,'y':dock_box['y'],'width':width,'height':900-dock_box['y']})
            for theme in ('amber','night'):
                page.evaluate('(theme)=>setTheme(theme)', theme)
                page.screenshot(path=str(OUT / f'minimal-controls-{theme}.png'))
            page.evaluate("setTheme('parchment')")
            checks.append('Reading/listening dock fits 320–1920px: <=64px desktop / <=108px mobile, 44px controls and consistent play/pause state')
            page.locator('#reader-fullscreen').click()
            page.wait_for_function('Reader.state.fullscreen')
            assert page.locator('#dp-play').is_visible()
            assert page.evaluate("Audiobook.state.status === 'paused'")
            text_box = page.locator('#reader-scroll').bounding_box()
            dock_box = page.locator('#persistent-player').bounding_box()
            assert text_box['y'] + text_box['height'] <= dock_box['y'] + 1
            page.locator('#reader-fullscreen').click()
            page.wait_for_function('!Reader.state.fullscreen')
            checks.append('Fullscreen keeps the dock below the reading surface without changing paused playback')
            assert not errors, errors
            browser.close()
    finally:
        http.shutdown()
        http.server_close()
        thread.join()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'results.json').write_text(json.dumps({'checks': checks, 'dimensions':dimensions, 'pageErrors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
    print('PASS: ' + str(len(checks)) + ' reading/listening checks', flush=True)


if __name__ == '__main__':
    main()

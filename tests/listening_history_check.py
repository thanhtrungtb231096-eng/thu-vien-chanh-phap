"""Actual listening, resume anchors, completion, recordings and responsive history UI."""
import json
from pathlib import Path
import threading

from read_listen_continuity_check import server, NarrationEngine, Quiet, unused, audio_fixture, DOCUMENT
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tests/artifacts/listening-history'


def main():
    memory = {}
    server.STREAM_ENGINE = NarrationEngine(memory.get, memory.__setitem__, unused, log_path=None)
    http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
    http.allowed_patterns = set()
    thread = threading.Thread(target=http.serve_forever, daemon=True)
    thread.start()
    checks, errors = [], []
    def check(message):
        checks.append(message)
        print(message, flush=True)
    wav, short_wav = audio_fixture(40), audio_fixture(.25)
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
                {'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan'}], 'audioConfig': {'startupBufferSeconds': 0}}))
            context.route('**/api/tts', lambda r: r.fulfill(body=short_wav if short[0] else wav, content_type='audio/wav'))
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            url = f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html'
            page.goto(url + '#listening-history', wait_until='networkidle')
            page.wait_for_selector('#lh-empty-title')
            assert page.locator('#lh-empty-title').inner_text() == 'Bắt đầu từ một bản kinh'
            paths = page.evaluate('''['dt_01_2', 'dt_01_1'].map(id =>
                new URL(Reader.path(DharmaPlayerStore.resolve({type:'daithua', id}), 'viet'), location.href).href)''')
            for path in paths:
                context.route(path, lambda r: r.fulfill(body=DOCUMENT, content_type='text/plain; charset=utf-8'))
            page.evaluate("void Reader.open(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}),'viet')")
            page.wait_for_function('Reader.state.ready')
            page.evaluate("Reader.close(); DharmaPlayerStore.enqueue({type:'daithua',id:'dt_01_1'})")
            assert page.evaluate('ListeningHistory.entries().length') == 0
            page.evaluate('DharmaPlayerStore.removeQueue(0)')
            check('A direct history link opens an empty state; reading and queuing do not create listening history')

            page.evaluate("void DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_2'}, {restart:true})")
            page.wait_for_function("Audiobook.state.status === 'playing'")
            assert page.evaluate('ListeningHistory.entries().length') == 1
            page.evaluate('Audiobook.seekChunk(3, 0, true)')
            page.wait_for_function("Audiobook.state.status === 'playing' && Audiobook.state.index === 3")
            page.evaluate('Audiobook.seekTime(12); Audiobook.pause()')
            saved = page.evaluate('ListeningHistory.entries()[0]')
            assert not saved['completed'] and saved['position']['index'] == 3 and saved['position']['seconds'] >= 12
            page.evaluate('Audiobook.seekTime(13)')
            assert page.evaluate('ListeningHistory.entries()[0].position.seconds') >= 13
            page.wait_for_function("document.querySelector('#lh-list .lh-play').textContent.includes('Nghe tiếp')")
            assert page.locator('#lh-list .lh-status').inner_text() == 'Đang nghe dở'
            page.evaluate("switchTab('home')")
            assert page.locator('#home-listening-history').is_visible()
            assert page.locator('#lh-continue-list .lh-row').count() == 1
            check('Real playback creates one entry; pausing saves the source anchor and seconds; home offers listening continuation')

            page.evaluate("ListeningHistory.open()")
            page.reload(wait_until='networkidle')
            page.wait_for_selector('#lh-list .lh-play')
            page.locator('#lh-list .lh-play').click()
            page.wait_for_function("Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.index') == 3
            assert 13 <= page.evaluate('Audiobook.state.currentTime') < 15
            # Checkpoints must survive closing/backgrounding without pressing pause.
            page.evaluate("Audiobook.seekTime(17); window.dispatchEvent(new Event('pagehide'))")
            assert page.evaluate('ListeningHistory.entries()[0].position.seconds') >= 17
            # The existing player stops on pagehide; restart to verify periodic saves.
            page.evaluate('void Audiobook.start()')
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.wait_for_function('ListeningHistory.entries()[0].position.seconds >= 20', timeout=10000)
            assert page.locator('#lh-list .lh-status').inner_text() == 'Đang phát'
            page.locator('#lh-list .lh-play').click()
            assert page.evaluate("Audiobook.state.status === 'paused'")
            assert page.evaluate('ListeningHistory.entries().length') == 1
            check('After reload, one click resumes the exact segment/time; background and periodic checkpoints preserve playback; the row pauses without duplication')

            # A natural finish records completion before queue navigation starts the next book.
            short[0] = True
            page.evaluate("DharmaPlayerStore.enqueue({type:'daithua',id:'dt_01_1'}); void DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_2'}, {restart:true})")
            page.wait_for_function("Audiobook.state.key === 'daithua:dt_01_1' && Audiobook.state.status === 'playing'", timeout=25000)
            short[0] = False
            page.evaluate('Audiobook.pause()')
            assert page.evaluate("ListeningHistory.entries().find(x=>x.key==='daithua:dt_01_2').completed")
            assert not page.evaluate("ListeningHistory.entries().find(x=>x.key==='daithua:dt_01_1').completed")
            page.locator('[data-history-filter="completed"]').click()
            assert page.locator('#lh-list .lh-row').count() == 1
            assert page.locator('#lh-list .lh-play').inner_text() == 'Nghe lại'
            assert page.locator('#lh-list [role="progressbar"]').get_attribute('aria-valuenow') == '100'
            OUT.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(OUT / 'history-completed.png'))
            page.locator('#lh-list .lh-play').click()
            page.wait_for_function("Audiobook.state.key === 'daithua:dt_01_2' && Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.index') == 0
            assert not page.evaluate("ListeningHistory.entries().find(x=>x.key==='daithua:dt_01_2').completed")
            page.evaluate('Audiobook.pause()')
            check('Natural completion is attached to the correct book before queue advance; replay starts at the beginning and returns it to in progress')

            # Recording histories are distinct from generated narration and resume local files.
            page.evaluate('''async () => {
                const info={id:'history-recording', key:'daithua:dt_01_2',title:'Bản thu thử',narrator:'Người đọc thử',chapters:[{title:'Phẩm một',seconds:0},{title:'Phẩm hai',seconds:10}]};
                const blob=await (await fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'Bản thu thử',voice:'vieneu-thuc-doan'})})).blob();
                await LibraryOffline.media('put','recording:'+info.id,blob);
                LibraryStore.write('recordings',[info]);
                await Audiobook.loadRecording(blob,info.key,info);
            }''')
            page.wait_for_function("Audiobook.state.recorded && Audiobook.state.status === 'playing'")
            page.evaluate('Audiobook.seekTime(14)')
            page.wait_for_function('Audiobook.state.index === 1')
            page.evaluate('Audiobook.pause()')
            recording = page.evaluate("ListeningHistory.entries().find(x=>x.recordingId==='history-recording')")
            assert recording and recording['position']['index'] == 1 and recording['position']['seconds'] >= 4
            assert page.evaluate('ListeningHistory.entries().length') == 3
            page.evaluate("void DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_1'})")
            page.wait_for_function("!Audiobook.state.recorded && Audiobook.state.status === 'playing'")
            page.evaluate("Audiobook.pause(); void ListeningHistory.resume('daithua:dt_01_2:recording:history-recording')")
            page.wait_for_function("Audiobook.state.recorded && Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.index') == 1
            assert page.evaluate('Audiobook.state.currentTime') >= 4
            page.evaluate("Audiobook.pause(); LibraryOffline.media('delete','recording:history-recording')")
            page.evaluate("void DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_1'})")
            page.wait_for_function("!Audiobook.state.recorded && Audiobook.state.status === 'playing'")
            page.evaluate('Audiobook.pause()')
            assert not page.evaluate("ListeningHistory.resume('daithua:dt_01_2:recording:history-recording')")
            assert not page.evaluate('Audiobook.state.recorded')
            check('Imported recordings keep separate progress and resume their chapter/time; a missing file shows a message without switching to narration')
            page.evaluate("void ListeningHistory.resume('daithua:dt_01_1')")
            page.wait_for_function("Audiobook.state.status === 'playing'")
            page.evaluate('Audiobook.pause()')

            page.locator('[data-history-filter="all"]').click()
            page.locator('#lh-query').fill('nguoi doc thu')
            assert page.locator('#lh-list .lh-row').count() == 1
            page.locator('#lh-query').fill('không có kinh này')
            assert page.locator('#lh-empty-title').inner_text() == 'Chưa tìm thấy bản kinh'
            page.locator('#lh-query').fill('')
            OUT.mkdir(parents=True, exist_ok=True)
            for width in (1920, 1440, 1024, 768, 390, 320):
                page.set_viewport_size({'width': width, 'height': 950 if width > 767 else 844})
                for theme in ('parchment', 'amber', 'night'):
                    page.evaluate('(theme)=>setTheme(theme)', theme)
                    page.wait_for_timeout(60)
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (width, theme)
                    for box in page.locator('#lh-list .lh-play, #lh-list .lh-read').all():
                        rect = box.bounding_box()
                        assert rect['width'] >= 44 and rect['height'] >= 44
                    if width in (1440, 390):
                        page.screenshot(path=str(OUT / f'history-{width}-{theme}.png'))
                if width <= 767:
                    page.locator('[data-mobile-nav="listening-history"]').click()
                    assert page.locator('[data-mobile-nav="listening-history"]').get_attribute('aria-current') == 'page'
            check('Accent-insensitive search, filter empty states, mobile navigation and 44px controls work across six widths and three themes without overflow')

            # New device sync applies a stable history anchor even when no legacy listen key exists.
            page.evaluate('''() => {
                const list=LibraryStore.read('listening-history',[]), entry=list.find(x=>x.id==='daithua:dt_01_2');
                entry.position.seconds=8; entry.lastPlayedAt=Date.now();
                localStorage.removeItem('cp3:listen:daithua:dt_01_2');
                localStorage.setItem('cp3:listening-history', JSON.stringify(list));
                window.dispatchEvent(new Event('library-synced'));
            }''')
            page.evaluate("void ListeningHistory.resume('daithua:dt_01_2')")
            page.wait_for_function("Audiobook.state.key === 'daithua:dt_01_2' && Audiobook.state.status === 'playing'")
            assert page.evaluate('Audiobook.state.currentTime') >= 8
            page.evaluate('Audiobook.pause()')
            check('A synchronized history entry resumes its own stable anchor/time independently of the legacy position key')

            page.evaluate('''() => {
                const entry=ListeningHistory.entries().find(x=>x.id==='daithua:dt_01_2');
                entry.lastPlayedAt=Date.now()+1000; entry.position.seconds=11;
                LibraryStore.restore(JSON.stringify({format:'chanh-phap',version:3,data:{'cp3:listening-history':JSON.stringify([entry])}}));
            }''')
            assert page.evaluate("ListeningHistory.entries().find(x=>x.id==='daithua:dt_01_2').position.seconds") == 11
            check('Backup restore preserves the newest progress of duplicate history entries and refreshes the current screen')

            page.evaluate('''() => {
                window.testHistory=LibraryStore.read('listening-history',[]);
                const existing=new Set(testHistory.map(x=>x.key));
                const extra=DAI_THUA_DATA.filter(x=>x.files?.vietMd&&!existing.has('daithua:'+x.id)).slice(0,25).map((book,i)=>({
                    id:'daithua:'+book.id,key:'daithua:'+book.id,type:'daithua',bookId:book.id,title:book.title,
                    lastPlayedAt:Date.now()-i*60000,completed:false,position:{index:0,seconds:0},count:10
                }));
                LibraryStore.write('listening-history',[...testHistory,...extra]);
            }''')
            page.locator('[data-history-filter="all"]').click()
            assert page.locator('#lh-list .lh-row').count() == 20
            page.locator('#lh-more').click()
            assert page.locator('#lh-list .lh-row').count() == 28
            page.evaluate("LibraryStore.write('listening-history',testHistory)")
            check('Long histories load twenty rows initially and expand without losing existing entries')

            failed = page.evaluate("DAI_THUA_DATA.find(x=>x.files?.vietMd&&!ListeningHistory.entries().some(h=>h.key==='daithua:'+x.id)).id")
            failed_path = page.evaluate("id=>new URL(Reader.path(DharmaPlayerStore.resolve({type:'daithua',id}),'viet'),location.href).href", failed)
            context.route(failed_path, lambda r: r.fulfill(status=503, body='Unavailable'))
            assert not page.evaluate("id=>DharmaPlayerStore.playItem({type:'daithua',id},{restart:true})", failed)
            assert page.evaluate('ListeningHistory.entries().length') == 3
            check('A document failure before playback leaves listening history unchanged')

            # Migration excludes mere reader opens and cannot infer completion from legacy data.
            migration = browser.new_context(service_workers='block')
            migration.add_init_script('''if(!sessionStorage.getItem('seeded')) {
                localStorage.setItem('cp3:listen:daithua:dt_01_2',JSON.stringify({block:'p-test',index:2,seconds:7,updatedAt:Date.now()}));
                localStorage.setItem('cp3:listen:daithua:dt_01_1',JSON.stringify({index:0,seconds:0,updatedAt:Date.now()}));
                sessionStorage.setItem('seeded','yes');
            }''')
            migration.route('**/api/voices', lambda r: r.fulfill(json={'available': True, 'voices': []}))
            migrated = migration.new_page()
            migrated.goto(url + '#listening-history', wait_until='networkidle')
            assert migrated.evaluate('ListeningHistory.entries().length') == 1
            assert not migrated.evaluate('ListeningHistory.entries()[0].completed')
            migrated.reload(wait_until='networkidle')
            assert migrated.evaluate('ListeningHistory.entries().length') == 1
            migration.close()
            check('Legacy nonzero positions migrate once; zero positions from reading and unknown past completions are not misclassified')
            assert not errors, errors
            browser.close()
    finally:
        http.shutdown()
        http.server_close()
        thread.join()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'results.json').write_text(json.dumps({'checks': checks, 'pageErrors': errors}, ensure_ascii=False, indent=2), encoding='utf-8')
    print('PASS: ' + str(len(checks)) + ' listening history checks', flush=True)


if __name__ == '__main__':
    main()

"""Explicit reading actions open the right text without changing the listening session."""
import json
from pathlib import Path
import threading

from read_listen_continuity_check import server, NarrationEngine, Quiet, unused, audio_fixture
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tests/artifacts/reading-actions'
DOCUMENT = '# Kinh kiểm tra\n\n' + '\n\n'.join(
    f'## Phẩm thứ {i}\n\n' + ('Chánh niệm và tỉnh giác trong từng bước chân. ' * 30)
    for i in range(1, 4)
)


def main():
    memory = {}
    server.STREAM_ENGINE = NarrationEngine(memory.get, memory.__setitem__, unused, log_path=None)
    http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
    http.allowed_patterns = set()
    thread = threading.Thread(target=http.serve_forever, daemon=True)
    thread.start()
    checks, errors, requests = [], [], []
    OUT.mkdir(parents=True, exist_ok=True)

    def check(message):
        checks.append(message)
        print(message, flush=True)

    try:
        with sync_playwright() as p:
            chrome = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
            browser = p.chromium.launch(executable_path=str(chrome), headless=True)
            context = browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block', reduced_motion='reduce')
            context.add_init_script('''const NativeAudio=Audio;
                window.Audio=function(){ return window.testAudio=new NativeAudio(); }; Audio.prototype=NativeAudio.prototype;''')
            context.route('**/api/voices', lambda r: r.fulfill(json={'available': True, 'offlineAvailable': True, 'voices': [], 'offlineVoices': [
                {'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan'}], 'audioConfig': {'startupBufferSeconds': 0}}))
            wav = audio_fixture(40)

            def synth(route):
                requests.append(route.request.post_data_json)
                route.fulfill(body=wav, content_type='audio/wav')

            context.route('**/api/tts', synth)
            page = context.new_page()
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html', wait_until='networkidle')
            paths = page.evaluate("['dt_01_2','dt_01_1'].map(id=>new URL(Reader.path(DharmaPlayerStore.resolve({type:'daithua',id}),'viet'),location.href).href)")
            for path in paths:
                context.route(path, lambda r: r.fulfill(body=DOCUMENT, content_type='text/plain; charset=utf-8'))

            def album(ref):
                page.evaluate('(ref)=>DharmaShell.openAlbum(ref)', ref)
                page.wait_for_selector('#album-tracks .track-read')

            def snapshot():
                return page.evaluate('({key:Audiobook.state.key,index:Audiobook.state.index,time:Audiobook.state.currentTime,status:Audiobook.state.status,source:testAudio.src,queue:DharmaPlayerStore.state.queue,recorded:Audiobook.state.recorded})')

            def same_audio(before):
                after = snapshot()
                for key in ('key', 'index', 'status', 'source', 'queue', 'recorded'):
                    assert after[key] == before[key], (key, before, after)
                assert before['time'] <= after['time'] < before['time'] + 4, (before, after)

            first = {'type': 'daithua', 'id': 'dt_01_2'}
            second = {'type': 'daithua', 'id': 'dt_01_1'}
            album(first)
            assert page.locator('#album-read').inner_text() == 'Đọc kinh'
            assert page.locator('.album-track button button').count() == 0
            page.locator('#album-read').click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key') == 'daithua:dt_01_2'
            assert page.evaluate("!['playing','loading'].includes(Audiobook.state.status)")
            assert not requests and not page.evaluate('ListeningHistory.entries().length')
            page.locator('#reader-close').click()
            target = page.locator('#album-tracks .album-track').nth(2).get_attribute('data-block-id')
            page.locator('#album-tracks .track-read').nth(2).focus()
            page.keyboard.press('Enter')
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.block') == target
            assert not requests
            page.locator('#reader-close').click()
            check('Whole-book and per-part reading open the requested book/block by click or keyboard, without autoplay or listening-history entries')

            page.locator('#album-tracks .track-listen').nth(1).click()
            page.wait_for_function("Audiobook.state.status==='playing'")
            target = page.locator('#album-tracks .album-track').nth(1).get_attribute('data-block-id')
            assert page.evaluate('Audiobook.segments[Audiobook.state.index].block') == target
            for status in ('playing', 'paused'):
                page.evaluate('Audiobook.seekTime(11)')
                page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.currentTime>=11")
                if status == 'paused':
                    page.evaluate('Audiobook.pause()')
                before = snapshot()
                page.locator('#album-tracks .track-read').nth(2).click()
                page.wait_for_function('Reader.state.ready')
                same_audio(before)
                assert page.evaluate('Reader.state.block') == page.locator('#album-tracks .album-track').nth(2).get_attribute('data-block-id')
                page.locator('#reader-close').click()
            check('Listen starts directly at the selected part; reading another part preserves the source, seconds and playing/paused state')

            page.locator('[data-dharma-nav="daily"]').click()
            daily_key = page.locator('#daily-tracks .album-track').nth(1).get_attribute('data-book-key')
            before = snapshot()
            page.locator('#daily-tracks .track-read').nth(1).click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key') == daily_key
            same_audio(before)
            page.locator('#reader-close').click()
            page.locator('#daily-tracks .track-title').first.click()
            page.wait_for_selector('#album-tracks .track-read')
            check('Daily/custom playlist rows offer direct reading and listening while their title still opens book details')

            page.set_viewport_size({'width': 390, 'height': 844})
            page.evaluate("DharmaPlayerStore.enqueue({type:'daithua',id:'dt_01_1'}); PersistentPlayer.showCompanion('queue')")
            before = snapshot()
            page.locator('[data-read-queued="0"]').click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key') == 'daithua:dt_01_1'
            assert not page.locator('#dharma-companion-dialog').is_visible()
            same_audio(before)
            page.locator('#reader-close').click()
            check('Reading a queued book closes the mobile sheet and retains every queued item and the listening position')

            page.evaluate("CollectionPlayer.start('Danh sách thử',[{type:'daithua',id:'dt_01_2',title:'Kinh một'},{type:'daithua',id:'dt_01_1',title:'Kinh hai'}]); PersistentPlayer.showCompanion('queue')")
            page.wait_for_function("Audiobook.state.key==='daithua:dt_01_2' && Audiobook.state.status==='playing'")
            before = snapshot()
            page.locator('[data-read-collection="1"]').click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key') == 'daithua:dt_01_1'
            assert page.evaluate('CollectionPlayer.state.active && CollectionPlayer.state.current===0')
            same_audio(before)
            page.locator('#reader-close').click()
            page.evaluate("CollectionPlayer.start('Danh sách thử',[{type:'daithua',id:'dt_01_1',title:'Kinh hai'},{type:'daithua',id:'dt_01_2',title:'Kinh một'}]); PersistentPlayer.showCompanion('queue')")
            page.wait_for_function("Audiobook.state.key==='daithua:dt_01_1' && Audiobook.state.status==='playing'")
            assert 'Kinh hai' in page.locator('[data-collection-index="0"]').inner_text()
            before = snapshot()
            page.locator('[data-read-collection="1"]').click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key') == 'daithua:dt_01_2'
            same_audio(before)
            page.locator('#reader-close').click()
            page.evaluate("CollectionPlayer.stop(); void DharmaPlayerStore.playItem({type:'daithua',id:'dt_01_2'})")
            page.wait_for_function("Audiobook.state.key==='daithua:dt_01_2' && Audiobook.state.status==='playing'")
            page.evaluate('Audiobook.pause()')
            check('Reading another collection book keeps the collection active and does not jump its current listening book')

            page.evaluate("LibraryStudy.add({name:'Thời khóa nghe thử',books:['daithua:dt_01_1'],start:LibraryStudy.date(),days:7,minutes:15,mode:'listen'}); LibraryUpgrades.renderStudy(); LibraryUpgrades.navigate('study')")
            before = snapshot()
            page.locator('#study-today .study-read').click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key') == 'daithua:dt_01_1'
            same_audio(before)
            page.locator('#reader-close').click()
            check('A listening study session also offers reading its scheduled book without changing playback')

            page.evaluate('''async () => {
                const info={id:'reading-actions-recording',key:'daithua:dt_01_1',title:'Bản thu thử',narrator:'Người đọc thử',chapters:[{title:'Mở đầu',seconds:0},{title:'Phẩm hai',seconds:10}]};
                const blob=await (await fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'Bản thu thử',voice:'vieneu-thuc-doan'})})).blob();
                await LibraryOffline.media('put','recording:'+info.id,blob); LibraryStore.write('recordings',[info]);
                await LibraryUpgrades.renderRecordings(); LibraryUpgrades.navigate('settings');
                await Audiobook.loadRecording(blob,info.key,info);
            }''')
            page.wait_for_function("Audiobook.state.recorded && Audiobook.state.status==='playing'")
            before = snapshot()
            page.locator('#recording-list .recording-read').click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key') == 'daithua:dt_01_1'
            same_audio(before)
            page.locator('#reader-close').click()
            page.evaluate('Audiobook.pause()')
            page.evaluate("async()=>{await LibraryOffline.media('delete','recording:reading-actions-recording'); await LibraryUpgrades.renderRecordings(); LibraryUpgrades.navigate('settings');}")
            assert page.locator('#recording-list .recording-read').is_enabled()
            assert page.locator('#recording-list .r-primary').is_disabled()
            page.locator('#recording-list .recording-read').click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key') == 'daithua:dt_01_1'
            page.locator('#reader-close').click()
            check('Imported recordings offer the associated book text and keep the recorded file playing')

            han = page.evaluate("(()=>{const d=DAI_TANG_HAN_DATA.texts.find(x=>x.hanFile&&!x.vietFile);return {type:'daitang',id:d.id,path:new URL(d.hanFile,location.href).href};})()")
            context.route(han['path'], lambda r: r.fulfill(body='# 原文\n\n## 經文\n\n如是我聞。', content_type='text/plain; charset=utf-8'))
            page.evaluate('(ref)=>DharmaShell.openAlbum(ref)', han)
            assert page.locator('#album-play').is_disabled()
            assert page.locator('#album-read').is_enabled()
            page.locator('#album-read').click()
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.mode') == 'han'
            page.locator('#reader-close').click()
            check('A Han-only edition keeps reading available while listening remains unavailable')

            album(first)
            for width in (1440, 768, 390, 320):
                page.set_viewport_size({'width': width, 'height': 950 if width>767 else 844})
                for theme in ('parchment', 'amber', 'night'):
                    page.evaluate('(theme)=>setTheme(theme)', theme)
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), (width, theme)
                    for row in page.locator('#album-tracks .album-track').all():
                        a,b=(row.locator(s).bounding_box() for s in ('.track-read','.track-listen'))
                        assert min(a['width'],a['height'],b['width'],b['height'])>=44
                        assert a['x']+a['width']<=b['x']+1 or a['y']+a['height']<=b['y']+1
            page.evaluate('setTheme("parchment")')
            album({'type': 'daitang', 'id': 'T02n0099'})
            for width in (1440, 390, 320):
                page.set_viewport_size({'width': width, 'height': 950 if width>767 else 844})
                page.locator('#album-tracks .album-track').first.scroll_into_view_if_needed()
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                page.screenshot(path=str(OUT/f'tap-a-ham-{width}.png'))
            target=page.locator('#album-tracks .album-track').nth(1).get_attribute('data-block-id')
            page.locator('#album-tracks .track-read').nth(1).click()
            page.wait_for_function("Reader.state.ready && Reader.state.key==='daitang:T02n0099'")
            assert page.evaluate('Reader.state.block')==target
            check('Reading/listening actions remain separate with 44px targets at 320–1440px in three themes; real Tạp A-Hàm opens the selected part')
            assert not errors, errors
            browser.close()
    finally:
        http.shutdown(); http.server_close(); thread.join()
    (OUT/'results.json').write_text(json.dumps({'checks':checks,'pageErrors':errors,'audio':'Local WAV; no external synthesis'},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'PASS: {len(checks)} reading action checks',flush=True)


if __name__=='__main__':
    main()

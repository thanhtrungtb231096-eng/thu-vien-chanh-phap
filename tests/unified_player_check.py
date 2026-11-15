"""One shared playback surface, exact continuity, distinct reading actions and fullscreen."""
import json
from pathlib import Path
import threading

from read_listen_continuity_check import server, NarrationEngine, Quiet, unused, audio_fixture
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tests/artifacts/unified-player'
DOCUMENT = '# Bản đọc thử\n\n' + '\n\n'.join(
    f'Đoạn {i}. ' + ('Tâm an tịnh, chánh niệm trong từng bước chân. Hãy đọc chậm và lắng nghe lời kinh. ' * 65)
    for i in range(1, 4)
)


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
    try:
        with sync_playwright() as p:
            chrome = Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
            if not chrome.is_file():
                chrome = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
            browser = p.chromium.launch(executable_path=str(chrome), headless=True)
            context = browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block', reduced_motion='reduce')
            context.add_init_script('''const NativeAudio=Audio;
                window.Audio=function(){ return window.testAudio=new NativeAudio(); }; Audio.prototype=NativeAudio.prototype;''')
            context.route('**/api/voices', lambda r: r.fulfill(json={'available': True, 'offlineAvailable': True, 'voices': [], 'offlineVoices': [
                {'id': 'vieneu-thien-tam-duc', 'name': 'Thiền Tâm Đức'},
                {'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan'}], 'audioConfig': {'startupBufferSeconds': 0}}))
            wav = audio_fixture(40)
            context.route('**/api/tts', lambda r: r.fulfill(body=wav, content_type='audio/wav'))
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html', wait_until='networkidle')
            assert not errors, errors
            assert page.locator('#dp-read').is_disabled()
            assert page.locator('#dp-restart').is_disabled()
            paths = page.evaluate("['dt_01_2','dt_01_1'].map(id=>new URL(Reader.path(DharmaPlayerStore.resolve({type:'daithua',id}),'viet'),location.href).href)")
            for path in paths:
                context.route(path, lambda r: r.fulfill(body=DOCUMENT, content_type='text/plain; charset=utf-8'))
            page.evaluate("window.originalPlayer=document.getElementById('persistent-player'); window.originalPlay=document.getElementById('dp-play'); window.originalVoice=document.getElementById('audio-voice'); void Reader.open(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}),'viet')")
            page.wait_for_function('Reader.state.ready && Reader.pages.total > 2')
            assert page.locator('#reader-next').is_visible()
            assert not page.locator('#dp-play').is_visible()
            assert page.locator('#audio-panel,#audio-play,#audio-next').count() == 0
            page.locator('#reader-listen-toggle').click()
            page.wait_for_function("Audiobook.state.status==='playing'")
            assert page.evaluate("originalPlayer===document.querySelector('.reader-bottombar #persistent-player') && originalPlay===document.getElementById('dp-play')")
            assert page.locator('#persistent-player').count() == 1
            assert page.locator('#dp-play').is_visible()
            assert page.locator('#reader-next').is_visible()
            assert not page.locator('#dp-options').is_visible()
            check('A quiet reader becomes a single shared dock on first playback; original player and play-button nodes are reused')

            page.evaluate('Audiobook.seekChunk(2,0,true)')
            page.wait_for_function("Audiobook.state.status==='playing'&&Audiobook.state.index===2")
            page.evaluate('Audiobook.seekTime(11); Audiobook.pause()')
            before = page.evaluate('({index:Audiobook.state.index,time:Audiobook.state.currentTime})')
            reading_page = page.evaluate('Reader.pages.index')
            page.locator('#reader-next').click()
            assert page.evaluate('Reader.pages.index') == reading_page + 1
            assert page.evaluate('Audiobook.state.index') == before['index']
            assert page.evaluate('Audiobook.state.currentTime') >= before['time']
            page.locator('#dp-next').click()
            assert page.evaluate("Audiobook.state.index===3&&Audiobook.state.status==='paused'")
            reading_place=page.evaluate('Reader.capture()')
            page.locator('#dp-play').focus()
            page.keyboard.press('ArrowRight')
            assert page.evaluate('Reader.capture()')==reading_place
            page.keyboard.press('Space')
            page.wait_for_function("Audiobook.state.status==='playing'")
            page.locator('#reader-close').click()
            assert page.evaluate('originalPlayer===document.getElementById("persistent-player") && originalPlayer.parentElement===document.body')
            assert page.evaluate("Audiobook.state.status==='playing'")
            page.evaluate("void Reader.open(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_1'}),'viet')")
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate("Audiobook.state.key==='daithua:dt_01_2'&&Audiobook.state.status==='playing'")
            assert page.locator('#audio-follow').is_disabled()
            assert page.locator('#dp-reader-status').inner_text().startswith(page.evaluate('DharmaPlayerStore.state.item.title'))
            page.locator('#reader-hear-visible').click()
            page.wait_for_function("Audiobook.state.key===Reader.state.key&&Audiobook.state.status==='playing'")
            assert not page.locator('#audio-follow').is_disabled()
            check('Reading navigation does not seek audio; audio navigation respects pause; mount/unmount preserves playback; another book is explicitly named until Listen from here switches it')

            page.locator('#dp-settings').click()
            assert page.locator('#dp-options').is_visible()
            assert page.evaluate('originalVoice===document.getElementById("audio-voice")')
            assert page.locator('#dp-voice,#dp-rate,#dp-sleep').count() == 0
            page.locator('#audio-voice').select_option('offline:vieneu-thuc-doan')
            page.wait_for_function("Audiobook.state.voice==='offline:vieneu-thuc-doan'&&Audiobook.state.status==='playing'")
            page.locator('#audio-rate').fill('1.15')
            page.locator('#audio-rate').dispatch_event('change')
            assert page.evaluate('Audiobook.state.rate') == 1.15
            page.locator('#audio-sleep').select_option('15')
            assert page.evaluate('Audiobook.state.deadline>Date.now()')
            page.locator('#dp-options-volume').fill('0.55')
            page.locator('#dp-options-volume').dispatch_event('input')
            assert abs(page.evaluate('Audiobook.state.volume') - .55) < .01
            page.locator('#audio-follow').uncheck()
            assert not page.evaluate("LibraryStore.read('audio-settings',{}).follow")
            page.locator('#dp-options-close').click()
            check('The same voice/rate/timer form and follow toggle are reused; advanced settings retain active playback and volume')

            # Reopen the actual listening passage without restarting or pausing the source.
            for status in ('paused', 'playing'):
                page.evaluate('Audiobook.seekChunk(7,0,true)')
                page.wait_for_function("Audiobook.state.status==='playing'&&Audiobook.state.index===7")
                page.evaluate('Audiobook.seekTime(11)')
                if status=='paused':
                    page.evaluate('Audiobook.pause()')
                before=page.evaluate('({key:Audiobook.state.key,index:Audiobook.state.index,time:Audiobook.state.currentTime,source:testAudio.src,block:Audiobook.segments[7].block,offset:Audiobook.segments[7].sourceOffset})')
                page.locator('#reader-close').click()
                if status=='paused':
                    page.locator('#dp-read').focus()
                    page.keyboard.press('Enter')
                else:
                    page.locator('#dp-read').click()
                page.wait_for_function('Reader.state.ready && document.activeElement.id==="reader-scroll"')
                assert page.evaluate('Reader.state.key')==before['key']
                assert page.evaluate('Reader.state.block')==before['block']
                assert page.evaluate('Reader.pages.anchor.textOffset')==before['offset']
                assert page.evaluate('Audiobook.state.index')==before['index']
                assert page.evaluate('Audiobook.state.status')==status
                assert before['time']<=page.evaluate('Audiobook.state.currentTime')<before['time']+3
                assert page.evaluate('testAudio.src')==before['source']
                assert not page.locator('#dp-read').is_visible()
                assert page.evaluate('originalPlayer===document.querySelector(".reader-bottombar #persistent-player")')
            check('Return to reading opens the listening book and passage, preserving index, seconds, source and both paused/playing states')

            page.locator('#reader-close').click()
            page.evaluate('Audiobook.pause(); Audiobook.toggleRepeat(); Audiobook.seekChunk(9,0,false); Audiobook.toggleRepeat()')
            page.evaluate("DharmaPlayerStore.enqueue({type:'daithua',id:'dt_01_2'})")
            settings=page.evaluate('({voice:Audiobook.state.voice,rate:Audiobook.state.rate,volume:Audiobook.state.volume,deadline:Audiobook.state.deadline,queue:DharmaPlayerStore.state.queue})')
            page.locator('#dp-restart').click()
            page.wait_for_function("Audiobook.state.index===0 && Audiobook.state.status==='playing'")
            assert page.evaluate('Audiobook.state.currentTime')<2
            assert page.evaluate('Audiobook.state.repeatA===-1 && Audiobook.state.repeatB===-1')
            assert page.evaluate('({voice:Audiobook.state.voice,rate:Audiobook.state.rate,volume:Audiobook.state.volume,deadline:Audiobook.state.deadline,queue:DharmaPlayerStore.state.queue})')==settings
            page.locator('#dp-read').click()
            page.wait_for_function('Reader.state.ready && document.activeElement.id==="reader-scroll"')
            check('Direct whole-book replay starts at segment zero, clears A–B and preserves voice, rate, volume, sleep timer and the queued book')

            page.evaluate('Audiobook.pause()')
            dimensions = []
            OUT.mkdir(parents=True, exist_ok=True)
            for width in (1920,1440,1024,768,390,320):
                page.set_viewport_size({'width':width,'height':950 if width>767 else 844})
                for theme in ('parchment','amber','night'):
                    page.evaluate('(theme)=>setTheme(theme)',theme)
                    page.wait_for_timeout(130)
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), (width,theme)
                    assert page.locator('#persistent-player').is_visible()
                    reading = page.locator('#reader-scroll').bounding_box()
                    paper = page.locator('#reader-page-viewport').bounding_box()
                    dock = page.locator('#persistent-player').bounding_box()
                    assert page.evaluate('Reader.pages.total') > 1, (width,theme)
                    assert paper['y']+paper['height']<=reading['y']+reading['height']+1, (width,paper,reading)
                    assert reading['y']+reading['height']<=dock['y']+1, (width,reading,dock)
                    assert dock['height']==(64 if width>767 else 108), (width,dock)
                    assert reading['height']>400, (width,reading)
                    for selector in ('#reader-prev','#reader-next','#dp-prev','#dp-play','#dp-next','#dp-settings'):
                        loc=page.locator(selector)
                        assert loc.is_visible(), (width,selector)
                        box=loc.bounding_box()
                        assert box['height']>=44 and box['width']>=44,(width,selector,box)
                    assert not page.locator('#audio-follow').is_visible()
                    assert page.locator('#dp-reader-status').evaluate('el=>el.scrollWidth<=el.clientWidth+1'), width
                    controls=['#reader-prev','#reader-page-indicator','#reader-next','#dp-prev','#dp-play','#dp-next','#dp-settings','#dp-seek']
                    if width>767:
                        assert page.locator('#reader-hear-visible').is_visible()
                        controls.append('#reader-hear-visible')
                    else:
                        assert not page.locator('#reader-hear-visible').is_visible()
                    boxes=[page.locator(x).bounding_box() for x in controls]
                    for i,a in enumerate(boxes):
                        for b in boxes[i+1:]:
                            overlap_x=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x'])
                            overlap_y=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y'])
                            assert overlap_x<=1 or overlap_y<=1,(width,controls,boxes)
                    if theme=='parchment' or width==390:
                        page.screenshot(path=str(OUT/f'reader-{width}-{theme}.png'))
                page.locator('#dp-settings').click()
                assert page.locator('#audio-follow').is_visible()
                assert page.locator('.audio-follow-label').is_visible()
                for selector in ('#dp-restart','#dp-repeat','#dp-ab','#dp-save','#dp-mute','#dp-expand'):
                    assert page.locator(selector).is_visible(),(width,selector)
                if width<768:
                    assert page.locator('#reader-hear-visible').is_visible()
                    box=page.locator('#reader-hear-visible').bounding_box()
                    assert box['height']>=44 and box['width']>=44
                    if width==390:
                        page.screenshot(path=str(OUT/'options-390.png'))
                    page.locator('#reader-hear-visible').click()
                    page.wait_for_function("Audiobook.state.status==='playing'")
                    assert not page.locator('#dp-options').is_visible()
                    page.evaluate('Audiobook.pause()')
                else:
                    page.locator('#dp-options-close').click()
                dimensions.append({'width':width,'dockHeight':dock['height'],'readingHeight':reading['height']})
            check('The reading dock stays at 64px desktop / 108px mobile across three themes; 44px controls and the timeline do not overlap; mobile listening actions work from options')

            page.locator('#reader-fullscreen').click()
            page.wait_for_function('Reader.state.fullscreen')
            assert page.locator('#dp-play').is_visible()
            page.locator('#dp-settings').click()
            assert page.locator('#dp-options').is_visible()
            assert page.evaluate('document.getElementById("reader-view-container").contains(document.getElementById("dp-options"))')
            page.keyboard.press('Escape')
            assert not page.locator('#dp-options').is_visible()
            assert page.evaluate('Reader.state.fullscreen')
            page.locator('#dp-play').click()
            page.wait_for_function("Audiobook.state.status==='playing'")
            page.locator('#reader-fullscreen').click()
            page.wait_for_function('!Reader.state.fullscreen')
            assert page.evaluate("Audiobook.state.status==='playing'")
            check('Fullscreen includes the same controls and settings; closing a dialog keeps fullscreen, and leaving fullscreen keeps audio playing')

            page.evaluate('Audiobook.pause()')
            page.locator('#reader-close').click()
            page.evaluate('setTheme("parchment")')
            for width in (1920,1440,1200,1100,1024,820,768,390,320):
                page.set_viewport_size({'width':width,'height':844})
                page.wait_for_timeout(80)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), width
                dock=page.locator('#persistent-player').bounding_box()
                assert dock['height']==(84 if width>767 else 114 if width<375 else 88), (width,dock)
                controls=['#dp-restart','#dp-play','#dp-next','#dp-read','#dp-settings','#dp-title','#dp-seek']
                for selector in ('#dp-restart','#dp-play','#dp-next','#dp-read','#dp-settings'):
                    assert page.locator(selector).is_visible(),(width,selector)
                    box=page.locator(selector).bounding_box()
                    assert box['width']>=44 and box['height']>=44
                    if width < 768:
                        seek=page.locator('#dp-seek').bounding_box()
                        assert box['y']+box['height']<=seek['y']+1,(width,selector,box,seek)
                boxes=[page.locator(x).bounding_box() for x in controls]
                for i,a in enumerate(boxes):
                    assert a['x']>=dock['x'] and a['x']+a['width']<=dock['x']+dock['width']+1,(width,controls[i],a,dock)
                    for b in boxes[i+1:]:
                        overlap_x=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x'])
                        overlap_y=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y'])
                        assert overlap_x<=1 or overlap_y<=1,(width,controls,boxes)
                page.screenshot(path=str(OUT/f'library-{width}.png'))
                if width in (1440,390):
                    page.locator('#persistent-player').screenshot(path=str(OUT/f'player-{width}.png'))
            page.locator('#dp-settings').click()
            assert page.locator('#audio-voice').is_visible()
            assert page.locator('#audio-follow').is_visible()
            page.keyboard.press('Escape')
            assert page.evaluate('document.activeElement.id')=='dp-settings'
            check('Library dock is 84px desktop / 88px mobile (114px at 320px); return/replay controls fit 320–1920px without overlap; options restore keyboard focus')

            # Recorded chapters have no text block mapping; retain the saved reading location.
            saved=page.evaluate("LibraryStore.read('position:'+Audiobook.state.key+':viet')")
            page.evaluate('''async () => {
                const info={id:'return-reading-recording',title:'Bản thu thử',narrator:'Người đọc thử',chapters:[{title:'Một',seconds:0},{title:'Hai',seconds:10}]};
                const blob=await (await fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'Bản thu thử',voice:'vieneu-thuc-doan'})})).blob();
                await Audiobook.loadRecording(blob,Audiobook.state.key,info);
            }''')
            page.wait_for_function("Audiobook.state.recorded && Audiobook.state.status==='playing'")
            page.evaluate('Audiobook.seekTime(14)')
            page.wait_for_function('Audiobook.state.index===1')
            page.evaluate('Audiobook.pause()')
            before=page.evaluate('({key:Audiobook.state.key,time:Audiobook.state.currentTime,source:testAudio.src})')
            page.locator('#dp-read').click()
            page.wait_for_function('Reader.state.ready && document.activeElement.id==="reader-scroll"')
            assert page.evaluate('Reader.state.key')==before['key']
            assert page.evaluate('Reader.state.block')==saved['block']
            assert page.evaluate('Audiobook.state.recorded && Audiobook.state.index===1 && Audiobook.state.status==="paused"')
            assert page.evaluate('Audiobook.state.currentTime')==before['time']
            assert page.evaluate('testAudio.src')==before['source']
            page.locator('#reader-close').click()
            page.locator('#dp-restart').click()
            page.wait_for_function('Audiobook.state.recorded && Audiobook.state.index===0 && Audiobook.state.status==="playing"')
            assert page.evaluate('Audiobook.state.currentTime')<2
            check('Imported recording return keeps its chapter/time/source and saved text position; direct replay starts the recording from its beginning')

            # Exercise the supplied deep link and the book in the screenshot, not only fixtures.
            page.set_viewport_size({'width':1440,'height':950})
            page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html#read/ebooks%3Aep-ebda2b7dd811/viet/b-2j0-1vgicnk',wait_until='networkidle')
            page.wait_for_function("Reader.state.ready && Reader.state.key==='ebooks:ep-ebda2b7dd811'")
            assert page.locator('#reader-book-title').inner_text()=='Thanh Tịnh Đạo'
            page.evaluate('setTheme("night")')
            page.locator('#reader-listen-toggle').click()
            page.wait_for_function("Audiobook.state.status==='playing'&&Audiobook.state.key===Reader.state.key")
            assert page.evaluate('Audiobook.state.count') > 1000
            page.evaluate('Audiobook.pause()')
            for width in (1440,390):
                page.set_viewport_size({'width':width,'height':950 if width>767 else 844})
                page.wait_for_timeout(160)
                assert page.locator('#audio-panel').count()==0
                assert page.locator('#persistent-player').count()==1
                assert page.locator('#persistent-player').bounding_box()['height']==(64 if width>767 else 108)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                page.screenshot(path=str(OUT/f'thanh-tinh-dao-{width}-night.png'))
            page.set_viewport_size({'width':1440,'height':950})
            page.evaluate("void Reader.open(DharmaPlayerStore.resolve({type:'ebooks',id:'ep-2b3de2ffb41b'}),'viet')")
            page.wait_for_function("Reader.state.ready && Reader.state.key==='ebooks:ep-2b3de2ffb41b'")
            assert page.locator('#reader-book-title').inner_text()=='Kinh Trường Bộ'
            page.evaluate('Reader.jumpSection(36)')
            page.locator('#reader-hear-visible').click()
            page.wait_for_function("Audiobook.state.status==='playing'&&Audiobook.state.key===Reader.state.key")
            assert page.evaluate('Audiobook.state.index')>0
            page.evaluate('Audiobook.pause()')
            for width in (1440,390):
                page.set_viewport_size({'width':width,'height':950 if width>767 else 844})
                page.wait_for_timeout(160)
                assert page.locator('#persistent-player').count()==1
                assert page.locator('#persistent-player').bounding_box()['height']==(64 if width>767 else 108)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
                page.screenshot(path=str(OUT/f'truong-bo-{width}-night.png'))
            check('The provided Thanh Tịnh Đạo deep link and real Trường Bộ text open and play locally with one compact dock on desktop and phone')
            assert not errors, errors
            browser.close()
    finally:
        http.shutdown(); http.server_close(); thread.join()
    (OUT/'results.json').write_text(json.dumps({'checks':checks,'dimensions':dimensions,'pageErrors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'PASS: {len(checks)} unified player checks',flush=True)


if __name__=='__main__':
    main()

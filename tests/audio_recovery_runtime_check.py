"""Real browser recovery from a failed local stream, including pause and stale work."""
import asyncio
import io
import json
import os
from pathlib import Path
import sys
import threading
import wave

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright

data = io.BytesIO()
with wave.open(data, 'wb') as wav:
    wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(8000)
    wav.writeframes(b'\0\0' * 8000 * 40)
fixture = data.getvalue()
memory, calls, held = {}, {}, {'count': 0}
mode = {'fail':True, 'hold':False}
async def provider(text, voice, rate):
    calls[text] = calls.get(text, 0) + 1
    if mode['hold']:
        held['count'] += 1
        await asyncio.sleep(20)
    if text.startswith('Part two'):
        if mode['fail'] and calls[text] == 1:
            await asyncio.sleep(1.5)
            raise ConnectionError('injected mid-clip disconnect')
        yield fixture[44 + 16000 * 14:]
        return
    yield fixture[:44 + 16000 * 14] if text.startswith('Part one') else fixture

server.STREAM_ENGINE = NarrationEngine(memory.get, memory.__setitem__, provider,
    config=AudioConfig(retries=0, warmup=False, transport_limit=80), log_path=None)
class Quiet(server.Handler):
    def log_message(self, *args): pass
http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
http.allowed_patterns = set()
thread = threading.Thread(target=http.serve_forever, daemon=True); thread.start()
base = f'http://127.0.0.1:{http.server_port}'
errors, checks = [], []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
        context = browser.new_context(service_workers='block')
        if os.environ.get('AUDIO_CANDIDATE_JS'):
            candidate=(ROOT/os.environ['AUDIO_CANDIDATE_JS']).resolve()
            assert candidate.is_relative_to(ROOT)
            context.route('**/js/audiobook.js*',lambda route:route.fulfill(body=candidate.read_text(encoding='utf-8'),content_type='application/javascript'))
        context.add_init_script("""const NativeAudio=Audio;window.Audio=function(){return window.testAudio=new NativeAudio();};window.Audio.prototype=NativeAudio.prototype;""")
        page = context.new_page(); page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
        def connect(key, sentence):
            page.evaluate('({key,sentence})=>{AudioService.configure({buffered:false,prefetchDepth:0,stallTimeoutMs:15000});Audiobook.connect(ReaderModel.parse("# Local probe\\n\\n"+sentence),key,"unavailable",true);window.messages=[];window.addEventListener("dharma-audio",e=>messages.push(e.detail.message));Audiobook.seekChunk(1,7,false);void Audiobook.start();}', {'key':key,'sentence':sentence})

        connect('test:stream-recovery', 'Part one streams local audio for interruption probe. Part two drops on the first attempt.')
        page.wait_for_function('Audiobook.state.status==="playing" && Audiobook.state.currentTime>=7', timeout=10000)
        page.wait_for_timeout(1600)
        page.evaluate('window.expectedOffset=Audiobook.state.currentTime;testAudio.dispatchEvent(new Event("ended"));')
        page.wait_for_function('testAudio.src.startsWith("blob:") && Audiobook.state.status==="playing" && messages.some(x=>x.includes("Đã nghe tiếp"))', timeout=15000)
        drift = page.evaluate('Math.abs(Audiobook.state.currentTime-expectedOffset)')
        assert drift < 1.5, drift
        assert page.evaluate('Audiobook.state.index') == 1
        saved=page.evaluate('LibraryStore.read("listen:test:stream-recovery")')
        assert saved['seconds'] >= 7, {'saved':saved,'state':page.evaluate('Audiobook.state'),'expected':page.evaluate('expectedOffset')}
        assert not page.locator('#dp-notice-retry').is_visible()
        checks.append('A genuinely truncated local stream recovers as a complete blob at the same passage and second')

        mode['fail'] = False
        page.evaluate('AudioService.configure({stallTimeoutMs:1000});window.stalledOffset=Audiobook.state.currentTime;testAudio.pause();testAudio.dispatchEvent(new Event("stalled"));')
        page.wait_for_function('Audiobook.state.status==="error"', timeout=5000)
        assert 'Failed to' not in page.locator('#dharma-notice').inner_text()
        assert page.evaluate('Audiobook.state.currentTime>=stalledOffset')
        page.evaluate('window.failedIndex=Audiobook.state.index;window.failedPosition=Audiobook.state.currentTime;testAudio.dispatchEvent(new Event("ended"));')
        page.wait_for_timeout(200)
        assert page.evaluate('Audiobook.state.status==="error" && Audiobook.state.index===failedIndex && Audiobook.state.currentTime>=failedPosition'), 'A late ended event advanced the failed source'
        checks.append('Repeated media failure is bounded and retains the listening position with Vietnamese controls')

        mode['fail'] = True
        cancel_text = 'Part one starts local playback for cancel probe. Part two blocks cleanly on recovery attempt.'
        connect('test:cancel-recovery', cancel_text)
        page.wait_for_function('Audiobook.state.status==="playing"', timeout=10000)
        mode['hold'] = True
        page.evaluate('Audiobook.seekTime(7);testAudio.dispatchEvent(new Event("error"));')
        page.wait_for_function('Audiobook.state.message.includes("Đang tải lại")', timeout=5000)
        for unused in range(40):
            if held['count']>=1:break
            page.wait_for_timeout(100)
        assert held['count']>=1, 'Recovery did not reach the deliberately held full download'
        page.evaluate('Audiobook.pause()')
        page.wait_for_timeout(1400)
        assert page.evaluate('Audiobook.state.status==="paused" && Audiobook.state.currentTime>=7')
        assert page.evaluate('testAudio.paused')
        checks.append('Pause cancels full recovery and prevents late playback')
        mode['hold'] = False; mode['fail'] = False
        connect('test:after-recovery', 'A new locally authored sentence after the cancelled download.')
        page.wait_for_function('Audiobook.state.key==="test:after-recovery" && Audiobook.state.status==="playing"', timeout=10000)
        page.wait_for_timeout(500)
        assert page.evaluate('Audiobook.state.key')=='test:after-recovery'
        checks.append('A cancelled recovery cannot replace a newly selected document')
        mode['hold'] = True
        connect('test:pause-before-metadata', 'A locally authored sentence held before the first audio byte.')
        page.wait_for_function('Audiobook.state.status==="loading" && testAudio.getAttribute("src") && testAudio.readyState===0', timeout=5000)
        page.evaluate('Audiobook.pause()')
        assert page.evaluate('Audiobook.state.currentTime') == 7, 'Pausing before metadata lost the saved position'
        assert page.evaluate('LibraryStore.read("listen:test:pause-before-metadata").seconds') == 7
        checks.append('Pausing before the first audio byte preserves the saved listening position')
        assert not errors, errors
        browser.close()
finally:
    http.shutdown(); http.server_close(); thread.join()
out = ROOT / 'tests/artifacts/audio-recovery/runtime-stability.json'
out.parent.mkdir(parents=True,exist_ok=True)
result = {'checks':checks,'positionDriftSeconds':round(drift,3),'browserErrors':errors,'provider':'local WAV, fault injection'}
out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False))

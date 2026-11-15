"""Slow/failing local synthesis must finish buffering before audible playback."""
import asyncio
import io
import json
import sys
import threading
import time
import wave
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
sys.stdout.reconfigure(encoding='utf-8')
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright

file=io.BytesIO()
with wave.open(file,'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(8000);wav.writeframes(b'\0\0'*12000)
fixture=file.getvalue()
memory,calls={},{}
active=0;peak=0
async def provider(text,*args):
    global active,peak
    active+=1;peak=max(peak,active);calls[text]=calls.get(text,0)+1
    try:
        yield fixture[:16044]
        await asyncio.sleep(.65)
        if 'thứ 3' in text and calls[text]==1:raise ConnectionError('injected partial stream')
        yield fixture[16044:]
    finally:active-=1
server.AUDIO_CONFIG=AudioConfig(warmup=False,buffered=True,buffer_seconds=45,startup_buffer_seconds=12,startup_wait_ms=3000,transport_limit=1800,retries=0)
server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,provider,config=server.AUDIO_CONFIG,log_path=None)
class Quiet(server.Handler):
    def log_message(self,*args):pass
http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
base=f'http://127.0.0.1:{http.server_port}'
OUT=ROOT/'tests/artifacts/audio-continuity';OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
        context=browser.new_context(service_workers='block')
        context.add_init_script('const NativeAudio=Audio;window.Audio=function(){return window.testAudio=new NativeAudio();};Audio.prototype=NativeAudio.prototype;')
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(base+'/web-thuvien/index.html',wait_until='networkidle')
        doc='# Tự tạo để kiểm tra\n\n'+'\n\n'.join(f'Đây là câu văn tự tạo thứ {i}. Mỗi câu được chuẩn bị để kiểm tra âm thanh.' for i in range(1,9))
        page.evaluate('''doc=>{
          Audiobook.connect(ReaderModel.parse(doc),'test:buffered-continuity','unavailable',true);
          Audiobook.seekChunk(1,0,false);window.events=[];window.done=false;
          for(const event of ['playing','ended'])testAudio.addEventListener(event,()=>events.push({event,at:performance.now(),index:Audiobook.state.index,src:testAudio.src}));
          addEventListener('sutra-finished',()=>done=true);Audiobook.setVolume(0);void Audiobook.start();
        }''',doc)
        page.wait_for_function("Audiobook.state.status==='playing'")
        assert page.evaluate('Audiobook.state.bufferedSeconds')>=12
        assert peak>=3,peak
        page.wait_for_function('window.done',timeout=30000)
        events=page.evaluate('events')
        plays=[e for e in events if e['event']=='playing']
        assert len(plays)==8,(len(plays),events)
        assert all(e['src'].startswith('blob:') for e in plays),'A partial network stream was played'
        assert list(dict.fromkeys(e['index'] for e in plays))==list(range(1,9))
        gaps=[];last=None
        for event in events:
            if event['event']=='ended':last=event['at']
            elif last is not None:gaps.append((event['at']-last)/1000);last=None
        assert max(gaps)<.35,gaps
        assert not any('Không tải lại' in e.get('message','') for e in events)
        failed=[(text,n) for text,n in calls.items() if 'thứ 3' in text]
        assert len(failed)==1 and failed[0][1]==2,failed
        checks.append('8 ordered passages use full blobs; interrupted prefetch recovers before playback; maximum transition gap <350 ms')
        checks.append('Two background syntheses overlap and foreground capacity remains available; initial speech buffer >=12 estimated seconds')

        # A short remaining buffer must not wait out the startup deadline due to rounding.
        page.evaluate('''() => {Audiobook.connect(ReaderModel.parse('# Tail buffer\\n\\nCâu mở đầu.\\n\\nCâu thử cuối cùng.'),'test:short-tail','unavailable',true);Audiobook.seekChunk(1,0,false);void Audiobook.start();}''')
        page.wait_for_function("Audiobook.state.status==='playing'",timeout=2000)
        page.evaluate('Audiobook.stop()')
        checks.append('A fully buffered short final passage starts without waiting out the startup deadline')

        # Cancel while preparing the initial buffer; no late response can start audio.
        page.evaluate('''() => {Audiobook.connect(ReaderModel.parse('# Cancel\\n\\nA new local sentence awaiting complete audio.'),'test:cancel-buffer','unavailable',true);Audiobook.seekChunk(1,0,false);void Audiobook.start();}''')
        page.wait_for_timeout(100);page.evaluate('Audiobook.pause()')
        page.wait_for_timeout(1200)
        assert page.evaluate("Audiobook.state.status==='paused' && testAudio.paused")
        checks.append('Pause cancels preparation and delayed audio cannot resume on its own')
        assert not errors,errors
        browser.close()
finally:http.shutdown();http.server_close();thread.join()
report={'checks':checks,'maxTransitionGapSeconds':round(max(gaps),4),'peakProviderConcurrency':peak,'pageErrors':errors}
(OUT/'buffered-runtime.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))

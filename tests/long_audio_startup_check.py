"""Buffered playback waits for the whole paragraph, including its unpublished tail."""
import asyncio,json,sys,threading,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright

source=ROOT/'tests/artifacts/audio-milinda-20261112/probe-11-vi-VN-NamMinhNeural.mp3'
fixture=source.read_bytes()[:86400]  # 600 complete 48-kbit/s, 24-kHz MP3 frames.
assert fixture[:2]==b'\xff\xf3' and len(fixture)==86400
gate=threading.Event();calls=[];memory={}
async def provider(text,*args):
    calls.append(text)
    if len(calls)>1:
        while not gate.is_set():await asyncio.sleep(.01)
    yield fixture
config=AudioConfig(warmup=False,transport_limit=160,prefetch_depth=0,startup_buffer_seconds=12)
server.AUDIO_CONFIG=config;engine=NarrationEngine(memory.get,memory.__setitem__,provider,config=config,log_path=None);server.STREAM_ENGINE=engine
class Quiet(server.Handler):
    def log_message(self,*args):pass
http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
report={}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True);context=browser.new_context(service_workers='block')
        context.add_init_script('const NativeAudio=Audio;window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};Audio.prototype=NativeAudio.prototype;')
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_selector('#audio-voice',state='attached');page.wait_for_function("Audiobook.state.voice.startsWith('online:')")
        sentence='This locally authored sentence checks that a validated audio buffer plays before synthesis finishes. '
        started=time.monotonic()
        paragraph=' '.join(f'Case number {number}: '+sentence for number in range(1,3))
        assert 160<len(paragraph)<=320
        page.evaluate('''doc=>{Audiobook.connect(ReaderModel.parse(doc),'test:long-prefix','unavailable',true);Audiobook.seekChunk(1,0,false);void Audiobook.start();}''','# Authored startup check\n\n'+paragraph)
        page.wait_for_function("Audiobook.state.status==='loading'")
        page.wait_for_timeout(500)
        assert any(job.started and not job.done and job.bytes for job in engine.jobs.values())
        assert page.evaluate("testAudio.paused && !testAudio.getAttribute('src')"),'An incomplete paragraph started playing'
        gate.set()
        page.wait_for_function("Audiobook.state.status==='playing'&&testAudio.currentTime>.15",timeout=5000)
        elapsed=time.monotonic()-started
        assert all(job.done and not job.error for job in engine.jobs.values())
        assert page.evaluate("!testAudio.paused && !testAudio.error && testAudio.src.startsWith('blob:')")
        page.evaluate('Audiobook.pause()');seconds=page.evaluate('Audiobook.state.currentTime');page.wait_for_timeout(100)
        assert abs(page.evaluate('Audiobook.state.currentTime')-seconds)<.1
        page.evaluate('void Audiobook.start()');page.wait_for_function('s=>Audiobook.state.currentTime>s+.1',arg=seconds)
        gate.set()
        page.wait_for_function("Audiobook.state.status==='playing'")
        assert not errors,errors
        report={'passed':True,'startSeconds':round(elapsed,3),'waitedForCompleteParagraph':True,'pauseResumePreserved':True,'pageErrors':errors}
        page.evaluate('Audiobook.stop()');browser.close()
finally:
    gate.set();http.shutdown();http.server_close();thread.join()
    (ROOT/'tests/artifacts/audio-root-20261112/long-buffered.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report))

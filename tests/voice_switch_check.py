"""Voice changes, saved preferences and expanded pronunciation in a real browser."""
import asyncio, io, json, sys, threading, wave
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright

output=io.BytesIO()
with wave.open(output,'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(8000);wav.writeframes(b'\0\0'*32000)
fixture=output.getvalue();memory={};calls=[]
async def provider(text,voice,rate):
    calls.append({'text':text,'voice':voice})
    await asyncio.sleep(.15)
    yield fixture
server.AUDIO_CONFIG=AudioConfig(warmup=False,startup_buffer_seconds=0,transport_limit=1800)
server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,provider,config=server.AUDIO_CONFIG,log_path=None)
class Quiet(server.Handler):
    def log_message(self,*args):pass
http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
base=f'http://127.0.0.1:{http.server_port}'
report={'checks':[],'errors':[]}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        context=browser.new_context(service_workers='block')
        context.add_init_script('''localStorage.setItem('cp3:audio-settings',JSON.stringify({voice:'offline:vieneu-thien-tam-duc',rate:.95}));
const NativeAudio=Audio;window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};Audio.prototype=NativeAudio.prototype;''')
        page=context.new_page();page.on('pageerror',lambda error:report['errors'].append(str(error)))
        page.goto(base+'/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_selector('#audio-voice',state='attached')
        page.wait_for_function("[...document.getElementById('audio-voice').options].some(v=>v.value==='offline:vieneu-thien-tam-duc')")
        assert page.evaluate('Audiobook.state.voice')=='offline:vieneu-thien-tam-duc','Saved male voice was silently replaced'
        report['checks'].append('Saved male voice survives initial discovery')
        page.evaluate('''() => {Audiobook.connect(ReaderModel.parse('# Voice test\\n\\nA locally authored sentence for voice changes.\\n\\nA second locally authored sentence.'),'test:voice-switch','unavailable',true);Audiobook.seekChunk(1,0,false);void Audiobook.start();}''')
        page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.currentTime>.1")
        for voice in ['thuc-doan','thien-tam-duc','thuc-doan','thien-tam-duc']:
            page.locator('#audio-voice').select_option('offline:vieneu-'+voice,force=True)
            page.wait_for_function("voice=>Audiobook.state.voice===voice && Audiobook.state.status==='playing' && !testAudio.paused",arg='offline:vieneu-'+voice)
        report['checks'].append('Four voice changes during playback resume the selected voice')
        page.evaluate('''() => {Audiobook.stop();Audiobook.seekChunk(2,0,false);void Audiobook.start();}''')
        page.locator('#audio-voice').select_option('offline:vieneu-thuc-doan',force=True)
        page.locator('#audio-voice').select_option('offline:vieneu-thien-tam-duc',force=True)
        page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.voice==='offline:vieneu-thien-tam-duc'")
        page.wait_for_timeout(250)
        assert page.evaluate("Audiobook.state.index===2 && !testAudio.paused")
        report['checks'].append('Rapid voice changes while preparing cannot revive stale audio')
        page.evaluate('Audiobook.stop()')
        seen=[]
        def deny(route):
            route.fulfill(status=502,json={'error':'temporary upstream failure','retryable':False})
        context.route('**/api/tts',deny)
        page.evaluate('''() => {Audiobook.connect(ReaderModel.parse('# Error\\n\\nA unique local sentence for voice recovery.'),'test:voice-error','unavailable',true);Audiobook.seekChunk(1,0,false);void Audiobook.start();}''')
        page.wait_for_function("Audiobook.state.status==='error'")
        context.unroute('**/api/tts',deny)
        page.locator('#audio-voice').select_option('offline:vieneu-thuc-doan',force=True)
        page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.voice==='offline:vieneu-thuc-doan'",timeout=8000)
        report['checks'].append('Choosing another voice recovers an errored passage')
        page.evaluate('Audiobook.stop()')
        def capture(request):
            if request.url.endswith('/api/tts'):seen.append(json.loads(request.post_data))
        page.on('request',capture)
        value=page.evaluate('''async () => {const text='A long pronunciation expansion, '.repeat(100);const descriptor=await AudioService.prepare(text,'offline:vieneu-thien-tam-duc');const blob=descriptor.blob||await AudioService.download(descriptor);return {size:blob.size,type:blob.type};}''')
        assert value['size']>0 and len(seen)>=2 and all(len(item['text'])<=1800 for item in seen),(value,seen)
        report['checks'].append('Expanded pronunciation remains playable through bounded synthesis requests')
        assert not report['errors'],report['errors']
        browser.close()
finally:
    http.shutdown();http.server_close();thread.join()
    out=ROOT/'tests/artifacts/audio-fix-20261111';out.mkdir(parents=True,exist_ok=True)
    (out/'voice-switch.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))

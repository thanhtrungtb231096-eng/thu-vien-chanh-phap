"""Play every actual Milinda segment with a deterministic local audio provider."""
import argparse,asyncio,io,json,sys,threading,time,wave
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--book',default='ebooks:ep-c2f5222bc69d')
parser.add_argument('--fast',action='store_true',help='Skip editorial pauses; still decode every audio passage')
args=parser.parse_args();book_type,book_id=args.book.split(':',1)
expected=3159 if args.book=='phucminh:mi-tien-van-dap' else 1154

output=io.BytesIO()
with wave.open(output,'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(8000);wav.writeframes(b'\0\0'*400)
fixture=output.getvalue();memory={};calls={}
async def provider(text,voice,rate):
    key=(text,voice,rate);calls[key]=calls.get(key,0)+1
    if len(text)>100 and sum(text.encode())%19==0 and calls[key]==1:
        yield fixture[:300];raise ConnectionError('injected local partial clip')
    yield fixture
config=AudioConfig(warmup=False,transport_limit=160,backoff_ms=(1,),startup_buffer_seconds=0,startup_wait_ms=0,first_byte_timeout=.04)
server.AUDIO_CONFIG=config
server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,provider,config=config,log_path=None)
class Quiet(server.Handler):
    def log_message(self,*args):pass
http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
report={'source':args.book,'editorialPausesSkipped':args.fast,'payload':'Actual book stays local; every synthesis uses a local deterministic fixture','runs':[],'pageErrors':[]}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        context=browser.new_context(service_workers='block')
        context.add_init_script('const NativeAudio=Audio;window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};Audio.prototype=NativeAudio.prototype;')
        page=context.new_page();page.on('pageerror',lambda e:report['pageErrors'].append(str(e)))
        page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_selector('#audio-voice',state='attached')
        page.wait_for_function("[...document.getElementById('audio-voice').options].some(x=>x.value==='online:vi-VN-NamMinhNeural')")
        if args.fast:page.evaluate('()=>{const originalBuild=NarrationModel.build;NarrationModel.build=(...args)=>originalBuild(...args).map(s=>({...s,pauseBefore:0}));}')
        for voice in ('vi-VN-NamMinhNeural','vi-VN-HoaiMyNeural'):
            started=time.monotonic()
            page.evaluate('''({voice,ref})=>{
              Audiobook.stop();window.seen=new Set();window.finished=0;window.lastFailure='';
              const select=document.getElementById('audio-voice');select.value='online:'+voice;select.dispatchEvent(new Event('change'));
              window.recordAudio=event=>{const s=event.detail;if(s.status==='playing')seen.add(s.index);if(s.status==='error')lastFailure=s.message;};
              addEventListener('dharma-audio',recordAudio);window.recordFinish=()=>finished++;addEventListener('sutra-finished',recordFinish);
              void DharmaPlayerStore.playItem(ref,{restart:true});
            }''',{'voice':voice,'ref':{'type':book_type,'id':book_id}})
            page.wait_for_function('count=>Audiobook.state.count===count',arg=expected)
            page.wait_for_function('finished===1 || !!lastFailure',timeout=max(600000,expected*800))
            result=page.evaluate('({count:Audiobook.state.count,seen:[...seen].sort((a,b)=>a-b),finished,error:lastFailure})')
            assert not result['error'],result
            assert result['finished']==1 and result['seen']==list(range(expected)),result
            result={'voice':voice,'segments':len(result['seen']),'finished':result['finished'],'seconds':round(time.monotonic()-started,2),'errors':[]}
            report['runs'].append(result);print(json.dumps(result),flush=True)
            page.evaluate("removeEventListener('dharma-audio',recordAudio);removeEventListener('sutra-finished',recordFinish);Audiobook.stop()")
        assert not report['pageErrors'],report['pageErrors']
        report['passed']=True;report['providerRetries']=server.STREAM_ENGINE.stats()['counters'].get('clip-retry',0)
        report['fallbackEvents']=server.STREAM_ENGINE.stats()['counters'].get('voice-fallback',0)
        browser.close()
finally:
    http.shutdown();http.server_close();thread.join()
    dest=ROOT/'tests/artifacts/audio-root-20261112';dest.mkdir(parents=True,exist_ok=True)
    (dest/('full-playback-'+book_type+'.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))

"""Force a direct-provider outage; decode all four voices through the owner's VPS."""
import json,sys,threading,time
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server,offline_tts
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright

async def unavailable(text,voice,rate='-5%'):
    raise ConnectionError('injected direct-provider outage')
    yield b''
config=AudioConfig(warmup=False,retries=3,relay_url='https://thuvienchanhphap.duckdns.org',startup_buffer_seconds=0)
memory={};server.AUDIO_CONFIG=config
server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,config=config,log_path=None)
class Quiet(server.Handler):
    def log_message(self,*args):pass
http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
report={'payload':'authored sentences only','voices':[]}
try:
    with patch.object(offline_tts,'vieneu_stream',unavailable),sync_playwright() as p:
        browser=p.chromium.launch(headless=True);context=browser.new_context(service_workers='block')
        page=context.new_page();page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_function('!!window.AudioService')
        probe=str(time.time_ns()%1000000)
        for voice in ('vieneu-thuc-doan','vieneu-thien-tam-duc','vieneu-thuc-doan:slow','vieneu-thien-tam-duc:slow'):
            started=time.monotonic()
            value=page.evaluate('''async ({voice,probe})=>{
              const text='Đây là câu tự viết để kiểm tra đường âm thanh dự phòng. Buổi sáng trời trong và có gió nhẹ. Mã phép thử '+probe+'.';
              const blob=await AudioService.request(text,'offline:'+voice);
              const url=URL.createObjectURL(blob),audio=new Audio(url);audio.volume=0;
              try{await audio.play();await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Decoder did not advance')),10000);audio.ontimeupdate=()=>{if(audio.currentTime>.15){clearTimeout(timer);resolve();}};});return {bytes:blob.size,decoded:!audio.error,currentTime:audio.currentTime};}
              finally{audio.pause();audio.removeAttribute('src');audio.load();URL.revokeObjectURL(url);}
            }''',{'voice':voice,'probe':probe})
            assert value['decoded'] and value['currentTime']>.15,value
            result={'voice':voice,**value,'seconds':round(time.monotonic()-started,3)}
            report['voices'].append(result);print(json.dumps(result),flush=True)
        stats=server.STREAM_ENGINE.stats()
        assert stats['counters'].get('clip-relay',0)>=4 and stats['counters'].get('job-complete',0)>=4,stats
        report.update(passed=True,relayRequests=stats['counters']['clip-relay'],upstreamJobErrors=stats['errors'])
        browser.close()
finally:
    http.shutdown();http.server_close();thread.join()
    report['serverStats']=server.STREAM_ENGINE.stats()
    out=ROOT/'tests/artifacts/audio-fix-20261111';out.mkdir(parents=True,exist_ok=True)
    (out/'live-relay.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))

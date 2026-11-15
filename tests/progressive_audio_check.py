"""Real browser/HTTP test with slow local MP3 packets; no manuscripts leave this machine."""

# Locate the shared path registry from either the workspace or an exported release.
from pathlib import Path as _BootstrapPath
import sys as _bootstrap_sys
_bootstrap_app = next(candidate for ancestor in _BootstrapPath(__file__).resolve().parents
                      for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
                      if (candidate / 'project_paths.py').is_file())
_bootstrap_sys.path.insert(0, str(_bootstrap_app))
from project_paths import ROOT, APP, WEB, BUILD, GENERATED, STATE, DEPENDENCIES, AUDIO_CACHE, WORK_CACHE, CONFIG, DIST, REPORTS, SOURCES, public_path, public_relative, release_relative
_bootstrap_sys.path.insert(0, str(BUILD))
_bootstrap_sys.path.insert(0, str(DEPENDENCIES))

import asyncio
import json
from pathlib import Path
import sys
import threading
import time

sys.path.insert(0,str(DEPENDENCIES));sys.path.insert(0,str(APP))
from playwright.sync_api import sync_playwright
import server
from narration_engine import NarrationEngine,transport_parts

fixture=next(path for path in (AUDIO_CACHE).glob('*.mp3') if 16000<path.stat().st_size<80000).read_bytes()
memory={};calls=[]
async def slow(text,voice,rate):
    calls.append({'characters':len(text),'voice':voice})
    yield fixture[:-144]
    await asyncio.sleep(3)
    yield fixture[-144:]
server.STREAM_ENGINE=NarrationEngine(memory.get,lambda key,value:memory.__setitem__(key,value),provider=slow)
class Quiet(server.Handler):
    def log_message(self,*args):pass
http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
base=f'http://127.0.0.1:{http.server_port}'
errors=[];checks=[]
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
        context=browser.new_context(service_workers='block')
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(base+'/web-thuvien/index.html',wait_until='networkidle')
        page.evaluate('AudioService.configure({buffered:false,prefetchDepth:3})')
        started=time.monotonic()
        page.evaluate('void DharmaPlayerStore.playItem({type:"daithua",id:DAI_THUA_DATA.find(x=>x.taishoId==="T08n0251"&&x.files.vietMd).id},{restart:true})')
        page.wait_for_function('Audiobook.state.status==="playing" && Audiobook.state.currentTime>.1',timeout=10000)
        elapsed=time.monotonic()-started
        active=[job for job in server.STREAM_ENGINE.jobs.values() if job.priority==0 and job.started]
        assert active and any(not job.done for job in active),'Playback waited for complete synthesis'
        assert elapsed<3,elapsed
        checks.append('Native MP3 playback starts while synthesis is still producing packets')
        page.evaluate('Audiobook.pause()')

        page.evaluate("Reader.open({type:'daithua',data:DAI_THUA_DATA.find(x=>x.id==='dt_01_2')},'viet')")
        page.wait_for_function('Reader.state.ready')
        page.evaluate('Audiobook.connect(Reader.state.doc,Reader.state.key,"unavailable",true);Audiobook.seekChunk(3,0,false);')
        text=page.evaluate('Audiobook.segments[3].text');assert len(text)>1500
        page.evaluate('window.__backgroundCancel=new AbortController();void (async()=>{const descriptor=await AudioService.prepare(Audiobook.segments[3].text,Audiobook.state.voice,{priority:"background"});window.__backgroundDescriptor=descriptor;try{await AudioService.download(descriptor,{signal:__backgroundCancel.signal});}catch{}})();')
        page.wait_for_function('!!window.__backgroundDescriptor')
        page.wait_for_timeout(200)
        started=time.monotonic();page.evaluate('void Audiobook.start()')
        page.wait_for_function('Audiobook.state.status==="playing" && Audiobook.state.currentTime>.1',timeout=10000)
        assert time.monotonic()-started<2.5
        assert page.evaluate('Audiobook.state.index')==3
        token=page.evaluate('__backgroundDescriptor.url.split("/").pop()')
        job=server.STREAM_ENGINE.jobs[token]
        assert job.listeners>=1 and not job.done
        assert all(call['characters']<=server.AUDIO_CONFIG.transport_limit for call in calls)
        assert ' '.join(transport_parts(text))==text
        checks.append('Foreground joins an unfinished prefetch immediately; long semantic text stays intact with short transport clips')
        page.evaluate('__backgroundCancel.abort();Audiobook.stop()')
        browser.close()
        deadline=time.monotonic()+3
        while time.monotonic()<deadline and not job.done:time.sleep(.05)
        assert job.cancelled.is_set() and job.done,'Abandoned job kept occupying a worker'
        checks.append('Closing playback cancels abandoned upstream work and releases priority capacity')
        assert not errors,errors
finally:
    http.shutdown();http.server_close();thread.join()
out=ROOT / 'tests/artifacts/audio-recovery';out.mkdir(parents=True,exist_ok=True)
result={'checks':checks,'firstPlaybackSeconds':round(elapsed,3),'browserErrors':errors,'provider':'slow local MP3 fixture'}
(out/'progressive-results.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))

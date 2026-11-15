"""Live playback of authored synthetic text only; no library manuscript is transmitted."""

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

import json
import os
from pathlib import Path
import sys
import time
import urllib.request

from playwright.sync_api import sync_playwright
BASE=os.environ.get('NARRATION_PROBE_URL','http://127.0.0.1:8090')
with urllib.request.urlopen(BASE+'/api/voices',timeout=3) as response:assert json.load(response)['audioVersion']>=4
sentence='Đây là văn bản thử nghiệm tự tạo để kiểm tra tốc độ phát âm thanh. Buổi sáng trời trong và có gió nhẹ, ánh nắng qua cửa sổ, hàng cây ngoài sân xanh tươi. Mỗi câu được đọc rõ ràng và có nhịp điệu tự nhiên. '
value=(sentence*12)[:1720];value=value[:value.rfind(' ')]+'.'
document='# Kiểm tra âm thanh liên tục\n\n“'+value+'”\n'
results=[];errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    sessions=[]
    for voice in ['online:vi-VN-HoaiMyNeural','online:vi-VN-NamMinhNeural']:
        context=browser.new_context(service_workers='block')
        context.add_init_script('const NativeAudio=Audio;window.Audio=function(...args){return window.__probeAudio=new NativeAudio(...args);};window.Audio.prototype=NativeAudio.prototype;')
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(BASE+'/web-thuvien/index.html',wait_until='networkidle')
        page.evaluate('({doc,voice})=>{const select=document.getElementById("audio-voice");select.value=voice;select.dispatchEvent(new Event("change"));Audiobook.connect(ReaderModel.parse(doc),"test:authored-streaming-probe","unavailable",true);Audiobook.setVolume(0);Audiobook.seekChunk(1,0,false);window.__liveDone=false;window.addEventListener("sutra-finished",()=>window.__liveDone=true);void Audiobook.start();}',{'doc':document,'voice':voice})
        sessions.append({'page':page,'voice':voice,'started':time.monotonic(),'first':None,'waiting':0,'done':False,'lastStatus':None})
    started=time.monotonic();heartbeat=0
    while time.monotonic()-started<260 and not all(s['done']for s in sessions):
        for s in sessions:
            if s['done']:continue
            state=s['page'].evaluate('({...Audiobook.state,complete:window.__liveDone})')
            assert state['status']!='error',state['message']
            if state['status']=='playing' and state['currentTime']>.1 and s['first'] is None:
                s['first']=round(time.monotonic()-s['started'],3)
                print(json.dumps({'voice':s['voice'],'firstPlaybackSeconds':s['first'],'characters':len(value)}),flush=True)
            if s['first'] is not None and state['status']=='loading':s['waiting']+=1
            if state['complete']:
                s['done']=True;s['elapsed']=round(time.monotonic()-s['started'],3)
                print(json.dumps({'voice':s['voice'],'completed':True,'elapsedSeconds':s['elapsed'],'waitingSamples':s['waiting']}),flush=True)
            s['lastStatus']={'status':state['status'],'position':round(state['currentTime'],1),'estimated':state.get('durationEstimated',False)}
        if time.monotonic()-heartbeat>=15:
            heartbeat=time.monotonic();print(json.dumps({'progress':[{'voice':s['voice'],**(s['lastStatus']or{})}for s in sessions]}),flush=True)
        time.sleep(1)
    assert all(s['done']and s['first']is not None for s in sessions),'Long synthetic narration did not complete'
    for s in sessions:
        page=s['page'];started=time.monotonic()
        page.evaluate('window.__nativeReplaySeconds=null;const started=performance.now();__probeAudio.addEventListener("playing",()=>window.__nativeReplaySeconds=(performance.now()-started)/1000,{once:true});void Audiobook.seekChunk(1,0,true)')
        page.wait_for_function('Audiobook.state.status==="playing" && Audiobook.state.currentTime>.1',timeout=5000)
        replay=round(time.monotonic()-started,3);native_replay=page.evaluate('__nativeReplaySeconds');page.evaluate('Audiobook.stop()')
        results.append({'voice':s['voice'],'firstPlaybackSeconds':s['first'],'completeSeconds':s['elapsed'],'waitingSamples':s['waiting'],'cachedReplaySeconds':replay,'nativeCachedStartSeconds':round(native_replay,4)})
    assert not errors,errors
    browser.close()
with urllib.request.urlopen(BASE+'/api/narration/stats',timeout=3) as response:stats=json.load(response)
firsts=sorted(result['firstPlaybackSeconds'] for result in results)
out=ROOT / 'tests/artifacts/audio-recovery/latency-after.json'
out.write_text(json.dumps({'networkPayload':'authored synthetic text only','characters':len(value),'results':results,'firstPlaybackSeconds':{'p50':firsts[0],'p95':firsts[-1],'samples':len(firsts)},'narrationStats':stats,'browserErrors':errors},indent=2),encoding='utf-8')
print(json.dumps({'results':results,'browserErrors':errors}),flush=True)

"""Verify deployed players; audio requests are intercepted inside this browser only."""
import io,json,sys,wave
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'local/runtime/python'))
from playwright.sync_api import sync_playwright
output=io.BytesIO()
with wave.open(output,'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(8000);wav.writeframes(b'\0\0'*8000*5)
report={'passed':False,'scope':'Actual deployed frontend and voices endpoint; browser-only audio fixture, no cloud-quality claim','hosts':[]}
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for label,base in [('local','http://127.0.0.1:8090'),('vps','https://thuvienchanhphap.duckdns.org')]:
        context=browser.new_context(service_workers='block');calls=[];errors=[]
        context.add_init_script('const NativeAudio=Audio;window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};Audio.prototype=NativeAudio.prototype;')
        def synthesize(route):
            calls.append(route.request.post_data_json['voice'])
            route.fulfill(body=output.getvalue(),content_type='audio/wav')
        context.route('**/api/tts',synthesize)
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(base+'/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_function("!!document.getElementById('audio-voice') && [...document.getElementById('audio-voice').options].some(o=>o.value==='offline:vieneu-thien-tam-duc')")
        page.evaluate("AudioService.configure({prefetchDepth:0,startupBufferSeconds:0});Audiobook.connect(ReaderModel.parse('# Deployed check\\n\\nAn authored local fixture checks the deployed player.'),'test:deployed','unavailable',true);Audiobook.seekChunk(1,0,false)")
        for voice in ('vieneu-thien-tam-duc','vieneu-thuc-doan','vieneu-thien-tam-duc'):
            page.locator('#audio-voice').select_option('offline:'+voice,force=True)
            page.evaluate('void Audiobook.start()')
            page.wait_for_function("voice=>Audiobook.state.voice==='offline:'+voice && Audiobook.state.status==='playing' && testAudio.currentTime>.15",arg=voice)
            assert page.evaluate("Audiobook.state.index===1 && !testAudio.error && testAudio.src.startsWith('blob:')")
            page.evaluate('Audiobook.pause()')
        assert not errors,errors
        assert set(calls)=={'vieneu-thuc-doan','vieneu-thien-tam-duc'},calls
        report['hosts'].append({'host':label,'maleFemaleMale':True,'sameParagraph':True,'completeBlobDecoded':True,'pageErrors':errors})
        context.close()
    browser.close();report['passed']=True
(ROOT/'tests/artifacts/audio-root-20261112/deployed-player-smoke.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report))

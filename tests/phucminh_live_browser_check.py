"""Play the actual 498-character passage from the new screenshot, without substituting its text."""
import argparse,hashlib,json,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'local/runtime/python')]
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base',required=True);parser.add_argument('--label',required=True)
args=parser.parse_args()
report={'passed':False,'base':args.base,'source':'phucminh:mi-tien-van-dap','checks':[],'pageErrors':[],'playerErrors':[],
        'payload':'Actual source excerpt explicitly authorized by user; no source substitution'}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True);context=browser.new_context(service_workers='block')
        context.add_init_script('const NativeAudio=Audio;window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};Audio.prototype=NativeAudio.prototype;')
        page=context.new_page();page.on('pageerror',lambda e:report['pageErrors'].append(str(e)))
        page.goto(args.base.rstrip('/')+'/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_selector('#audio-voice',state='attached')
        page.wait_for_function("[...document.getElementById('audio-voice').options].some(v=>v.value==='offline:vieneu-thien-tam-duc')")
        page.evaluate("AudioService.configure({prefetchDepth:0,startupBufferSeconds:0});window.playerErrors=[];addEventListener('dharma-audio',e=>{if(e.detail.status==='error')playerErrors.push(e.detail.message);})")
        selected=page.evaluate('''async()=>{
          const ref={type:'phucminh',id:'mi-tien-van-dap'},item=DharmaPlayerStore.resolve(ref);
          const doc=ReaderModel.parse(await(await fetch(Reader.path(item,'viet'))).text()),q=NarrationModel.build(doc),s=q[1];
          const select=document.getElementById('audio-voice');select.value='offline:vieneu-thien-tam-duc';select.dispatchEvent(new Event('change'));
          void DharmaPlayerStore.playItem(ref,{restart:true,block:s.block,sourceOffset:s.sourceOffset});
          return {count:q.length,characters:s.text.length,block:s.block};
        }''')
        assert selected['count']==3159 and selected['characters']==498,selected
        report['selection']=selected
        for number,voice in enumerate(('vieneu-thien-tam-duc','vieneu-thuc-doan','vieneu-thien-tam-duc')):
            started=time.monotonic()
            if number:page.locator('#audio-voice').select_option('offline:'+voice,force=True)
            page.wait_for_function("v=>Audiobook.state.voice==='offline:'+v && (Audiobook.state.status==='error'||Audiobook.state.status==='playing'&&testAudio.currentTime>.3)",arg=voice,timeout=180000)
            state=page.evaluate('Audiobook.state')
            assert state['status']=='playing' and state['index']==1,state
            allowed={voice}
            assert state['actualVoices'] and set(state['actualVoices'])<=allowed,state
            assert page.evaluate("!testAudio.error && testAudio.readyState>=2 && Number.isFinite(testAudio.duration) && testAudio.duration>1 && testAudio.src.startsWith('blob:')")
            page.evaluate('Audiobook.pause()');seconds=page.evaluate('Audiobook.state.currentTime');page.wait_for_timeout(150)
            assert abs(page.evaluate('Audiobook.state.currentTime')-seconds)<.1
            page.evaluate('void Audiobook.start()');page.wait_for_function('s=>Audiobook.state.status==="playing"&&Audiobook.state.currentTime>s+.1',arg=seconds,timeout=10000)
            row={'requestedVoice':voice,'actualVoices':state['actualVoices'],'voiceLabel':state['voiceLabel'],'segment':2,
                 'decoded':True,'pauseResumePreserved':True,'startSeconds':round(time.monotonic()-started,3)}
            report['checks'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
        page.evaluate('Audiobook.pause()');report['playerErrors']=page.evaluate('playerErrors')
        page.reload(wait_until='networkidle')
        page.wait_for_function("Audiobook.state.voice==='offline:vieneu-thien-tam-duc'")
        report['maleVoiceRetainedAfterReload']=True
        assert not report['pageErrors'] and not report['playerErrors'],report
        report['passed']=True;browser.close()
except Exception as error:report['failure']=str(error);raise
finally:
    (ROOT/'tests/artifacts/audio-root-20261112'/(args.label+'-phucminh-ui.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'passed':report['passed'],'checks':len(report['checks'])}))

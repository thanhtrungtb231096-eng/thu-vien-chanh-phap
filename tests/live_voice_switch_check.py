"""Check four collection flows with authored fixtures, or explicitly authorized source excerpts."""
import argparse,json,sys,time
from pathlib import Path
from urllib.parse import urljoin
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base',default='http://127.0.0.1:8090')
parser.add_argument('--label',default='local')
parser.add_argument('--actual-source',action='store_true',help='Use only with user authorization to synthesize source excerpts')
args=parser.parse_args();base=args.base.rstrip('/')
report={'base':base,'checks':[],'pageErrors':[],'passed':False,'speechPayload':'Actual necessary source excerpts, explicitly authorized by user' if args.actual_source else 'authored test sentences only; collection source responses are replaced in this isolated browser'}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        context=browser.new_context(service_workers='block')
        context.add_init_script('''const NativeAudio=Audio;window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};Audio.prototype=NativeAudio.prototype;''')
        page=context.new_page();page.on('pageerror',lambda error:report['pageErrors'].append(str(error)))
        page.goto(base+'/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_selector('#audio-voice',state='attached')
        page.wait_for_function("[...document.getElementById('audio-voice').options].some(v=>v.value==='offline:vieneu-thien-tam-duc')")
        page.evaluate('AudioService.configure({prefetchDepth:0,startupBufferSeconds:0})')
        allowed=set()
        def guard_speech(route):
            payload=json.loads(route.request.post_data)
            if payload.get('text') not in allowed:
                report['pageErrors'].append('Blocked TTS payload outside selected test excerpts')
                route.abort();return
            route.continue_()
        context.route('**/api/tts',guard_speech)
        refs=page.evaluate('''() => [
          {type:'daithua',id:DAI_THUA_DATA.find(x=>x.taishoId==='T08n0251'&&x.files.vietMd).id},
          {type:'daitang',id:DAI_TANG_HAN_DATA.texts.find(x=>x.taisho==='T08n0251'||x.id==='T08n0251').id},
          {type:'phucminh',id:PHUC_MINH_DATA.find(x=>x.vietFile).id},
          {type:'ebooks',id:DAI_TANG_KINH_DATA.find(x=>x.vietFile&&x.characters>1000&&x.characters<20000).id}
        ]''')
        probe=time.time_ns()%1000000
        for number,ref in enumerate(refs,1):
            document=f'# Câu thử giọng {number}\n\nĐây là câu tự viết để kiểm tra âm thanh lần {number}. Buổi sáng có ánh nắng nhẹ và gió qua cửa sổ. Mã phép thử {probe}.\n\nCâu tiếp theo dùng để kiểm tra giữ vị trí khi tạm dừng và nghe tiếp.'
            source=page.evaluate('ref=>Reader.path(DharmaPlayerStore.resolve(ref),"viet")',ref)
            if args.actual_source:
                document=page.evaluate('async source=>await(await fetch(source)).text()',source)
                selected_text=page.evaluate("text=>NarrationModel.build(ReaderModel.parse(text)).find(x=>x.kind!=='heading'&&x.text.length>=50&&x.text.length<=320)?.text",document)
                assert selected_text,ref
                allowed.add(selected_text)
            else:
                context.route(urljoin(page.url,source),lambda route,request=None,body=document:route.fulfill(body=body,content_type='text/markdown; charset=utf-8'))
                allowed.update(page.evaluate('text=>NarrationModel.build(ReaderModel.parse(text)).map(x=>x.text)',document))
            selected=page.evaluate('''async ref=>{
              Audiobook.stop();const item=DharmaPlayerStore.resolve(ref);
              const response=await fetch(Reader.path(item,'viet'));if(!response.ok)throw new Error('Missing source');
              const doc=ReaderModel.parse(await response.text());
              const segment=NarrationModel.build(doc).find(x=>x.kind!=='heading'&&x.text.length>=50&&x.text.length<=320);
              if(!segment)throw new Error('No bounded prose sample');
              const select=document.getElementById('audio-voice');select.value='offline:vieneu-thuc-doan';select.dispatchEvent(new Event('change'));
              void DharmaPlayerStore.playItem(ref,{restart:true,block:segment.block,sourceOffset:segment.sourceOffset});
              return {title:item.title,block:segment.block,characters:segment.text.length};
            }''',ref)
            started=time.monotonic()
            page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.currentTime>.2 && !testAudio.paused",timeout=120000)
            female=page.evaluate('Audiobook.state')
            assert female['voice']=='offline:vieneu-thuc-doan',female
            assert page.evaluate('!testAudio.error && testAudio.readyState>=2 && (testAudio.src.startsWith("blob:") || testAudio.src.includes("/api/audio/"))')
            female_wait=round(time.monotonic()-started,3)
            started=time.monotonic()
            page.locator('#audio-voice').select_option('offline:vieneu-thien-tam-duc',force=True)
            page.wait_for_function("Audiobook.state.voice==='offline:vieneu-thien-tam-duc' && Audiobook.state.status==='playing' && Audiobook.state.currentTime>.2 && !testAudio.paused",timeout=120000)
            male=page.evaluate('Audiobook.state')
            assert male['key']==female['key'] and male['index']==female['index'],(female,male)
            assert page.evaluate('!testAudio.error && testAudio.readyState>=2 && (testAudio.src.startsWith("blob:") || testAudio.src.includes("/api/audio/"))')
            check={**ref,**selected,'femaleStartSeconds':female_wait,'maleSwitchSeconds':round(time.monotonic()-started,3),'samePassage':True,'decodedBothVoices':True}
            report['checks'].append(check);print(json.dumps(check,ensure_ascii=False),flush=True)
            page.evaluate('Audiobook.pause()');position=page.evaluate('Audiobook.state.currentTime')
            page.wait_for_timeout(200)
            assert abs(page.evaluate('Audiobook.state.currentTime')-position)<.1
            page.evaluate('void Audiobook.start()')
            page.wait_for_function('seconds=>Audiobook.state.status==="playing"&&Audiobook.state.currentTime>seconds+.1',arg=position,timeout=10000)
            page.evaluate('Audiobook.stop()')
        assert not report['pageErrors'],report['pageErrors']
        report['passed']=True;browser.close()
finally:
    out=ROOT/('tests/artifacts/audio-milinda-20261112' if args.actual_source else 'tests/artifacts/audio-fix-20261111');out.mkdir(parents=True,exist_ok=True)
    (out/(args.label+'-live.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'passed':report['passed'],'collections':len(report['checks']),'pageErrors':report['pageErrors']}))

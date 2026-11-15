"""Verify restored local TTS and permission-error recovery through real player controls."""
import json
import os
from pathlib import Path
import sys
import urllib.request
from urllib.parse import urljoin

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from playwright.sync_api import sync_playwright

BASE=os.environ.get('AUDIO_NETWORK_URL','http://127.0.0.1:8090').rstrip('/')
OUT=ROOT/'tests/artifacts/audio-network-access'
OUT.mkdir(parents=True,exist_ok=True)
document='# Văn bản thử âm thanh\n\nĐây là câu tự tạo để kiểm tra giọng đọc. Âm thanh cần phát rõ ràng và tiếp tục từ vị trí đã lưu.\n\nBuổi sáng có gió nhẹ và ánh nắng qua cửa sổ.'
report={'url':BASE,'voices':[],'checks':[],'pageErrors':[]}

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    context=browser.new_context(service_workers='block',viewport={'width':1366,'height':900})
    context.add_init_script('const NativeAudio=Audio;window.Audio=function(){const audio=new NativeAudio();audio.volume=0;return window.testAudio=audio;};Audio.prototype=NativeAudio.prototype;')
    page=context.new_page()
    page.on('pageerror',lambda error:report['pageErrors'].append(str(error)))
    try:
        page.goto(BASE+'/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_function("[...document.getElementById('audio-voice').options].some(x=>x.value==='offline:vieneu-thien-tam-duc')")
        ref=page.evaluate("(()=>{const data=DAI_THUA_DATA.find(x=>x.taishoId==='T08n0251' && x.files.vietMd);return {type:'daithua',id:data.id,path:Reader.path({type:'daithua',data},'viet')};})()")
        context.route(urljoin(BASE+'/web-thuvien/index.html',ref['path']),lambda route:route.fulfill(body=document,content_type='text/markdown; charset=utf-8'))
        for voice in ['vieneu-thuc-doan','vieneu-thien-tam-duc']:
            page.evaluate('voice=>{Audiobook.stop();const select=document.getElementById("audio-voice");select.value="offline:"+voice;select.dispatchEvent(new Event("change"));}',voice)
            page.evaluate('''({ref,doc})=>{
                const block=ReaderModel.parse(doc).blocks.find(x=>x.text.startsWith('Đây là câu tự tạo'));
                void DharmaPlayerStore.playItem(ref,{restart:true,block:block.id});
            }''',{'ref':ref,'doc':document})
            page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.currentTime>.3",timeout=30000)
            state=page.evaluate('Audiobook.state')
            assert state['voice']=='offline:'+voice,state
            assert state['currentText'].startswith('Đây là câu tự tạo'),state
            assert page.evaluate("testAudio.src.startsWith('blob:') && !testAudio.paused && testAudio.readyState>=2")
            page.locator('#dp-play').click()
            page.wait_for_function("Audiobook.state.status==='paused' && testAudio.paused")
            paused=page.evaluate('Audiobook.state.currentTime')
            saved=page.evaluate("LibraryStore.read('listen:'+Audiobook.state.key)")
            assert abs(saved['seconds']-paused)<.1,(saved,paused)
            page.wait_for_timeout(300)
            assert abs(page.evaluate('Audiobook.state.currentTime')-paused)<.1
            page.locator('#dp-play').click()
            page.wait_for_function('seconds=>Audiobook.state.status==="playing" && Audiobook.state.currentTime>seconds+.2',arg=paused)
            assert page.locator('#dp-notice-actions').is_hidden()
            report['voices'].append({'voice':voice,'status':'playing','durationSeconds':state['duration'],'pauseResume':True})
            page.screenshot(path=str(OUT/(voice+'.png')))
            page.evaluate('Audiobook.stop()')
        report['checks'].append('Both VieNeu AI voices play complete audio through the shared player; pause/resume preserves listening position.')

        calls=[]
        def denied(route):
            calls.append(json.loads(route.request.post_data))
            route.fulfill(status=503,json={'code':'network-denied','retryable':False,'error':'private provider details'})
        context.route('**/api/tts',denied)
        page.evaluate('''() => {
            AudioService.configure({prefetchDepth:0});
            Audiobook.connect(ReaderModel.parse('# Kiểm tra quyền kết nối\\n\\nMột câu tự tạo dành riêng cho kiểm tra lỗi mạng.'),'test:network-permission','unavailable',true);
            Audiobook.seekChunk(1,1,false);void Audiobook.start();
        }''')
        page.wait_for_function("Audiobook.state.status==='error'")
        assert page.locator('#dp-notice-text').inner_text().find('MO_THU_VIEN.cmd')>=0
        assert 'private' not in page.locator('#dp-notice-text').inner_text()
        assert page.locator('#dp-notice-retry').is_visible()
        assert page.evaluate('Audiobook.state.index===1 && Audiobook.state.currentTime===1')
        page.wait_for_timeout(800)
        assert len(calls)==1,calls
        context.unroute('**/api/tts',denied)
        page.locator('#dp-notice-retry').click()
        page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.index===1 && Audiobook.state.currentTime>1",timeout=30000)
        assert page.locator('#dp-notice-actions').is_hidden()
        report['checks'].append('Denied network access is explained once; Retry resumes the same passage and saved second after access is restored.')
        page.evaluate('Audiobook.stop()')
        assert not report['pageErrors'],report['pageErrors']
        with urllib.request.urlopen(BASE+'/api/narration/stats',timeout=5) as response:report['serverStats']=json.load(response)
    finally:
        browser.close()
        (OUT/'runtime-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

print(json.dumps(report,ensure_ascii=False,indent=2))

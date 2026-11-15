"""Browser regression for interrupted narration, retained positions and inline recovery."""

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

from collections import Counter
from pathlib import Path
import io
import json
import os
import sys
import wave

sys.path.insert(0,str(DEPENDENCIES))
from playwright.sync_api import sync_playwright

BASE=os.environ.get('AUDIO_RECOVERY_URL','http://127.0.0.1:8097')
OUT=Path(__file__).parent/'artifacts/audio-recovery';OUT.mkdir(parents=True,exist_ok=True)
stream=io.BytesIO()
with wave.open(stream,'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(8000);wav.writeframes(b'\0\0'*8000*40)

checks=[];errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000},service_workers='block')
    context.route('**/api/voices',lambda route:route.fulfill(json={'available':True,'offlineAvailable':True,'voices':[],'offlineVoices':[{'id':'vieneu-thuc-doan','name':'Thục Đoan'}]}))
    mode={'fail':False,'temporary':0,'target':''};counts=Counter()
    def audio(route):
        text=route.request.post_data_json['text'];counts[text]+=1
        if text==mode['target'] and (mode['fail'] or mode['temporary']>0):
            mode['temporary']=max(0,mode['temporary']-1);route.abort('failed')
        else:route.fulfill(body=stream.getvalue(),content_type='audio/wav')
    context.route('**/api/tts',audio)
    page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(BASE+'/web-thuvien/index.html',wait_until='networkidle')
    page.evaluate("Reader.open({type:'daithua',data:DAI_THUA_DATA.find(x=>x.id==='dt_01_2')},'viet')")
    page.wait_for_function('Reader.state.ready')
    page.evaluate('window.__recoveryDoc=Reader.state.doc;window.__recoveryKey=Reader.state.key;window.__recoveryMessages=[];window.addEventListener("dharma-audio",e=>__recoveryMessages.push(e.detail.message));')
    page.locator('#reader-close').click()
    def reset(index,seconds=7):
        page.evaluate('({index,seconds})=>{Audiobook.connect(__recoveryDoc,__recoveryKey,"unavailable",true);Audiobook.seekChunk(index,seconds,false);}',{'index':index,'seconds':seconds})
        mode['target']=page.evaluate('LibraryPronunciation.prepare(Audiobook.segments[Audiobook.state.index].text)')
        counts.clear()

    reset(2);mode['temporary']=2
    page.evaluate('Audiobook.start()');page.wait_for_function('Audiobook.state.status==="playing"')
    assert counts[mode['target']]==3,counts
    assert page.evaluate('Audiobook.state.index')==2
    page.wait_for_function('Audiobook.state.currentTime>=7 && Audiobook.state.duration>0')
    assert page.evaluate('__recoveryMessages.some(x=>x.includes("Đang thử lại"))')
    checks.append('A dropped connection recovers automatically at the saved passage and second')

    reset(6);mode['fail']=True
    page.evaluate('Audiobook.start()');page.wait_for_function('Audiobook.state.status==="error"')
    assert counts[mode['target']]==3
    assert page.evaluate('Audiobook.state.index===6 && Audiobook.state.currentTime===7')
    assert 'Failed to fetch' not in page.locator('#dharma-notice').inner_text()
    assert page.locator('#dp-notice-retry').is_visible()
    for width,height in [(1440,1000),(390,844),(320,740)]:
        page.set_viewport_size({'width':width,'height':height})
        for theme in ['parchment','amber','night']:
            page.evaluate('(theme)=>setTheme(theme)',theme)
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            box=page.locator('#dharma-notice').bounding_box();assert box['x']>=0 and box['x']+box['width']<=width+1
            button=page.locator('#dp-notice-retry').bounding_box();assert button['y']>=0 and button['y']+button['height']<=height
        page.evaluate("setTheme('parchment')")
        page.screenshot(path=str(OUT/f'recovery-{width}.png'))
    mode['fail']=False;page.locator('#dp-notice-retry').click();page.wait_for_function('Audiobook.state.status==="playing"')
    assert page.evaluate('Audiobook.state.index')==6
    page.wait_for_function('Audiobook.state.currentTime>=7')
    assert not page.locator('#dharma-notice').is_visible()
    checks.append('An exhausted connection has localized recovery controls; retry keeps position at 320–1440 px in all themes')

    reset(9);mode['fail']=True
    page.evaluate('void Audiobook.start()')
    page.wait_for_function('Audiobook.state.message.includes("Đang thử lại")',timeout=5000)
    page.locator('#dp-play').click()
    assert page.evaluate('Audiobook.state.status')=='paused'
    page.wait_for_timeout(3200)
    assert counts[mode['target']]==1,counts
    assert page.evaluate('Audiobook.state.status==="paused" && Audiobook.state.index===9 && Audiobook.state.currentTime===7')
    checks.append('Pause cancels the retry immediately and never starts a later passage')

    mode['fail']=False
    item=page.evaluate("(()=>{const b=PHUC_MINH_DATA.find(x=>x.vietFile);return {type:'phucminh',id:b.id};})()")
    source={'fail':True}
    def book(route):
        if source['fail']:route.abort('failed')
        else:route.continue_()
    context.route('**/web-thuvien/data/phuc-minh/text/**',book)
    page.evaluate('(item)=>DharmaPlayerStore.playItem(item)',item)
    page.wait_for_function('!!DharmaPlayerStore.state.error')
    assert page.evaluate('DharmaPlayerStore.state.failedItem.key')==item['type']+':'+item['id']
    assert 'Failed to fetch' not in page.locator('#dharma-notice').inner_text()
    source['fail']=False;page.locator('#dp-notice-retry').click()
    page.wait_for_function('(key)=>Audiobook.state.key===key && Audiobook.state.status==="playing"',arg=item['type']+':'+item['id'])
    assert page.evaluate('DharmaPlayerStore.state.error')==''
    checks.append('A failed book download retries the requested book and clears stale errors')
    assert not errors,errors
    browser.close()
result={'checks':checks,'browserErrors':errors}
(OUT/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))

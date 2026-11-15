"""End-to-end checks for the six upgrades, using isolated browser profiles."""

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

from pathlib import Path
import hashlib
import io
import json
import math
import os
import struct
import sys
import urllib.error
import urllib.request
import wave

sys.path.insert(0,str(DEPENDENCIES))
from playwright.sync_api import sync_playwright

BASE=os.environ.get('UPGRADES_TEST_URL','http://127.0.0.1:8096')
URL=BASE+'/web-thuvien/index.html'
OUT=Path(__file__).parent/'artifacts/upgrades';OUT.mkdir(parents=True,exist_ok=True)

def request(path,data=None,headers=None):
    req=urllib.request.Request(BASE+path,data=json.dumps(data).encode() if data is not None else None,headers={'Content-Type':'application/json',**(headers or {})})
    try:
        with urllib.request.urlopen(req,timeout=30) as r:return r.status,r.read()
    except urllib.error.HTTPError as e:return e.code,e.read()

tone=io.BytesIO()
with wave.open(tone,'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(16000)
    wav.writeframes(b''.join(struct.pack('<h',int(600*math.sin(i*.08))) for i in range(16000*4)))

def main():
    assert request('/api/sync/exchange',{})[0]==401
    assert request('/api/sync/create',{}, {'Origin':'http://evil.example'})[0]==403
    assert request('/api/sync/create',{}, {'Origin':'http://127.0.0.1:1'})[0]==403
    for path in ['/.library-state/search.sqlite3','/.library-state/personal.sqlite3','/web-thuvien/library_services.py']:
        assert request(path)[0]==404,path
    result=json.loads(request('/api/search?q=chanh%20niem&collection=phucminh&mode=viet')[1]);assert result['total']>0 and result['results']
    assert request('/web-thuvien/manifest.webmanifest')[0]==200
    with urllib.request.urlopen(BASE+'/web-thuvien/sw.js') as r:assert r.headers['Service-Worker-Allowed']=='/'
    checks=['Authenticated sync, strict origin validation and private-file restrictions']
    errors=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
        first=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        second=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        for context in [first,second]:context.route('**/api/tts',lambda r:r.fulfill(status=200,content_type='audio/wav',body=tone.getvalue()))
        page=first.new_page();other=second.new_page()
        for tab in [page,other]:tab.on('pageerror',lambda e:errors.append(str(e)));tab.goto(URL,wait_until='networkidle')
        page.wait_for_function('!!navigator.serviceWorker.controller')
        page.evaluate("setTheme('parchment'); LibraryUpgrades.navigate('fulltext')")
        page.locator('#fulltext-query').fill('chanh niem');page.locator('#fulltext-collection').select_option('phucminh');page.locator('#fulltext-mode').select_option('viet')
        page.locator('#fulltext-form').evaluate('(e)=>e.requestSubmit()');page.wait_for_selector('.passage-result')
        page.locator('.passage-result .r-primary').first.click();page.wait_for_function('Reader.state.ready')
        assert page.evaluate("Reader.state.key.startsWith('phucminh:') && Reader.state.doc.blocks.some(x=>x.id===Reader.state.block)")
        page.locator('#reader-close').click();page.evaluate('LibraryUpgrades.navigate("fulltext")')
        page.locator('.passage-result .upgrade-actions button').nth(1).click();page.wait_for_function("Audiobook.state.status==='playing'")
        assert page.evaluate("Audiobook.segments[Audiobook.state.index].block===Reader.state.block")
        page.evaluate('Audiobook.pause()')
        checks.append('Full-text search opens and narrates the exact stable source block')
        item=page.evaluate("(()=>{const data=DAI_THUA_DATA.find(x=>x.taishoId==='T08n0251'&&x.files.vietMd);return {type:'daithua',id:data.id};})()")
        page.evaluate('(ref)=>Reader.open(DharmaPlayerStore.resolve(ref),"viet")',item);page.wait_for_function('Reader.state.ready')
        source=page.evaluate('Reader.path(Reader.state.item,"viet")')
        source_file=public_path(source);before=hashlib.sha256(source_file.read_bytes()).hexdigest()
        original=page.evaluate("(()=>{const b=Reader.state.doc.blocks.find(x=>x.kind==='text'&&x.text.length>20);Reader.jumpBlock(b.id);return b.raw;})()")
        page.evaluate('LibraryUpgrades.editCurrent()');page.locator('#correction-text').fill(original+'\nGhi chú hiệu đính kiểm tra.\n');page.locator('#correction-save').click()
        page.wait_for_function('Reader.state.ready && Reader.state.doc.blocks.some(b=>b.originalRaw!==undefined)')
        assert hashlib.sha256(source_file.read_bytes()).hexdigest()==before
        page.evaluate('LibraryUpgrades.editCurrent()');page.locator('#correction-remove').click();page.wait_for_function('Reader.state.ready')
        checks.append('Personal correction can be saved and reverted without altering the source')
        page.locator('#reader-close').click()
        key=item['type']+':'+item['id']
        page.evaluate('(key)=>{LibraryUpgrades.navigate("offline");const select=document.getElementById("offline-book");LibraryCatalog.setSelection(select,[key]);select.dispatchEvent(new Event("change"));}',key)
        page.locator('#offline-save').click()
        try:page.wait_for_function('LibraryOffline.packs().length===1')
        except Exception:
            print(json.dumps({'offlineStatus':page.locator('#offline-status').inner_text(),'pageErrors':errors},ensure_ascii=False),flush=True)
            raise
        page.locator('#offline-audio').click();page.wait_for_function('document.getElementById("offline-audio").disabled===false')
        assert page.evaluate('LibraryOffline.packs()[0].audio.length>0'),page.locator('#offline-audio-status').inner_text()
        first.set_offline(True);page.reload(wait_until='domcontentloaded');page.wait_for_selector('#tab-home .upgrade-links',state='attached')
        page.evaluate('(ref)=>Reader.open(DharmaPlayerStore.resolve(ref),"viet")',item);page.wait_for_function('Reader.state.ready')
        page.evaluate('(ref)=>DharmaPlayerStore.playItem(ref)',item)
        try:page.wait_for_function("Audiobook.state.status==='playing'")
        except Exception:
            print(json.dumps(page.evaluate('({voice:Audiobook.state.voice,status:Audiobook.state.status,message:Audiobook.state.message,index:Audiobook.state.index,count:Audiobook.state.count,packs:LibraryOffline.packs().map(x=>({key:x.key,audio:x.audio.length,chapters:x.chapters}))})'),ensure_ascii=False),flush=True)
            raise
        page.evaluate('Audiobook.pause()');page.locator('#reader-close').click()
        page.evaluate('LibraryUpgrades.navigate("fulltext")');page.locator('#fulltext-query').fill('sac');page.locator('#fulltext-form').evaluate('(e)=>e.requestSubmit()')
        page.wait_for_function('document.getElementById("fulltext-status").textContent.includes("sách đã tải")')
        first.set_offline(False)
        checks.append('Offline reload, selected-book reader, downloaded narration and local full-text search')
        page.evaluate('LibraryUpgrades.navigate("study")');page.locator('#study-name').fill('Thời khóa kiểm tra');page.evaluate('key=>LibraryCatalog.setSelection(document.getElementById("study-books"),[key])',key);page.locator('#study-form').evaluate('(e)=>e.requestSubmit()')
        page.wait_for_selector('#study-plans .study-day');page.locator('#study-plans .study-day input').first.check()
        assert page.evaluate('LibraryStore.read("study-completions",[]).length')==1
        checks.append('Study plan creates a dated calendar and persists daily completion')
        page.evaluate('LibraryUpgrades.navigate("settings")');page.locator('#pronunciation-enabled').check();page.locator('#pronunciation-terms').fill('Buddha = Phật\nDhamma = Pháp');page.locator('#pronunciation-save').click()
        assert page.evaluate('LibraryPronunciation.prepare("Buddha, Dhamma, Buddhaghosa")')=='Phật, Pháp, Buddhaghosa'
        page.evaluate('key=>LibraryCatalog.setSelection(document.getElementById("recording-book"),[key])',key);page.locator('#recording-narrator').fill('Người đọc kiểm tra');page.locator('#recording-title').fill('Âm thanh kiểm thử');page.locator('#recording-chapters').fill('00:00 | Mở đầu\n00:02 | Chương hai')
        page.locator('#recording-file').set_input_files({'name':'test-tone.wav','mimeType':'audio/wav','buffer':tone.getvalue()});page.locator('#recording-form').evaluate('(e)=>e.requestSubmit()');page.wait_for_selector('#recording-list button.r-primary')
        page.locator('#recording-list button.r-primary').click();page.wait_for_function('Audiobook.state.recorded && Audiobook.state.status==="playing"')
        page.locator('#dp-play').click();assert page.evaluate('Audiobook.state.status')=='paused'
        page.evaluate('Audiobook.seekChunk(1,0,false)');assert page.evaluate('Audiobook.state.index')==1
        page.evaluate('Audiobook.start()');page.wait_for_function('Audiobook.state.status==="playing" && Audiobook.state.duration>0');page.evaluate('Audiobook.pause()')
        checks.append('Editable pronunciation respects whole terms; imported audio uses shared player and chapter seeking')
        page.locator('#sync-create').click();page.wait_for_function('!!LibrarySync.auth()');page.locator('#sync-code').click();page.wait_for_function('document.getElementById("sync-pair-code").textContent.length>0')
        code=page.locator('#sync-pair-code').inner_text().replace(' ','')
        other.evaluate('LibraryUpgrades.navigate("settings")');other.locator('#sync-code-input').fill(code);other.locator('#sync-pair-form').evaluate('(e)=>e.requestSubmit()');other.wait_for_function('!!LibrarySync.auth()')
        page.evaluate('LibraryStore.write("favorites",[{key:"phucminh:kinh-nhat-tung",type:"phucminh",id:"kinh-nhat-tung",title:"Kinh nhật tụng"}])')
        other.evaluate('LibraryStore.write("audio-notes:phucminh:kinh-nhat-tung",[{id:"parallel-note",text:"Ghi chú trên điện thoại"}])')
        page.evaluate('LibrarySync.sync()');other.evaluate('LibrarySync.sync()');page.evaluate('LibrarySync.sync()');other.evaluate('LibrarySync.sync()')
        other.wait_for_function('LibraryStore.read("favorites",[]).length===1')
        page.wait_for_function('LibraryStore.read("audio-notes:phucminh:kinh-nhat-tung",[]).some(n=>n.id==="parallel-note")')
        assert other.evaluate('LibraryStore.read("study-plans",[]).length')==1
        assert other.evaluate('LibraryStore.read("offline-packs",[]).length')==0
        assert other.evaluate('localStorage.getItem("dhamma_theme")')=='parchment'
        first.set_offline(True);page.evaluate('LibraryStore.write("favorites",[])');other.evaluate('LibrarySync.sync()');first.set_offline(False);page.evaluate('LibrarySync.sync()');other.evaluate('LibrarySync.sync()');other.wait_for_function('LibraryStore.read("favorites",[]).length===0')
        assert request('/api/sync/pair',{'code':code})[0]==400
        checks.append('Two devices merge concurrent notes/favorites/study data; offline deletion stays deleted; pairing code is single use')
        for width in [1920,1440,1024,768,390,320]:
            page.set_viewport_size({'width':width,'height':1000})
            for theme in ['parchment','amber','night']:
                page.evaluate('(theme)=>setTheme(theme)',theme)
                for tab in ['fulltext','quality','offline','study','settings']:
                    page.evaluate('(id)=>LibraryUpgrades.navigate(id)',tab);page.wait_for_timeout(40)
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),(width,theme,tab)
        page.set_viewport_size({'width':390,'height':844});page.evaluate('LibraryUpgrades.navigate("study")');page.screenshot(path=str(OUT/'study-mobile.png'))
        page.set_viewport_size({'width':1440,'height':1000});page.evaluate('LibraryUpgrades.navigate("settings")');page.screenshot(path=str(OUT/'settings-desktop.png'))
        checks.append('Five new modules fit 320–1920 px in all three themes')
        assert not errors,errors
        browser.close()
    report={'checks':checks,'browserErrors':errors,'offlineAudio':'generated test tone; no human recording was added to the real catalog'}
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()

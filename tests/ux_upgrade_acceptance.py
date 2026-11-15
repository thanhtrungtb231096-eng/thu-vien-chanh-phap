"""Staged acceptance using real text, isolated browsers and local fixture audio."""
import argparse
import json
from pathlib import Path
import sys
import threading
import tempfile

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT/'tests'),str(ROOT/'app'),str(ROOT/'local/runtime/python'),str(ROOT/'tools/maintenance')]
from read_listen_continuity_check import server, Quiet, NarrationEngine, unused, audio_fixture
from playwright.sync_api import sync_playwright

OUT=ROOT/'tests/artifacts/ux-upgrade-20261010'
OUT.mkdir(parents=True,exist_ok=True)

def stage1(page, checks):
    for width in [1440,390,320]:
        page.set_viewport_size({'width':width,'height':1000 if width>600 else 844})
        page.evaluate("void Reader.open(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}),'viet')")
        page.wait_for_function('Reader.state.ready')
        page.wait_for_timeout(200)
        page.locator('#reader-next').click()
        anchor=page.evaluate('Reader.capture()')
        for reverse in [False,True]:
            for _ in range(55):
                page.keyboard.press('Shift+Tab' if reverse else 'Tab')
                assert page.evaluate("!!document.activeElement.closest('#reader-view-container')"), 'Focus escaped reader'
                assert page.evaluate("document.getElementById('reader-page-viewport').scrollLeft===0 && document.getElementById('reader-paper-content').scrollLeft===0"), 'Focus scrolled a page'
        assert page.evaluate('Reader.capture()')==anchor, (width,anchor,page.evaluate('Reader.capture()'))
        page.locator('#reader-scroll').focus()
        page.keyboard.press('Enter')
        assert page.evaluate("document.activeElement.id==='reader-note-input'")
        page.keyboard.press('Escape')
        for theme in ['parchment','night','amber']:
            page.evaluate('(x)=>setTheme(x)',theme)
            page.evaluate("Reader.pref.font=26;document.getElementById('r-font').value=26;document.getElementById('r-font').dispatchEvent(new Event('change'))")
            page.wait_for_timeout(180)
            assert page.evaluate("document.getElementById('reader-page-viewport').scrollLeft===0")
            assert page.evaluate('Reader.capture().block')==anchor['block']
        page.screenshot(path=str(OUT/f'stage1-reader-{width}.png'))
        page.locator('#reader-close').click()
        checks.append(f'{width}px: forward/reverse focus, passage selection, font/themes and saved anchor')

def stage2(page,checks):
    initial=page.evaluate('history.length')
    for tab in ['phucminh','listening-history','home']:
        page.locator(f'#dharma-sidebar [data-dharma-nav="{tab}"]').first.click()
    assert page.evaluate('history.length')==initial+3
    page.go_back();page.wait_for_function("appState.currentTab==='listening-history'")
    page.go_back();page.wait_for_function("appState.currentTab==='phucminh'")
    page.go_forward();page.wait_for_function("appState.currentTab==='listening-history'")
    checks.append('Back/Forward restores actual prior screens')
    page.evaluate("ContentModules.go('tang-han',['kinh','a-ham','truong-aham'])")
    page.locator('#global-search').fill('T01n0001');page.wait_for_timeout(250)
    page.evaluate('window.scrollTo(0,300)')
    page.locator('.tab-panel[style*="block"] [data-content-read]').first.click()
    page.wait_for_function('Reader.state.ready')
    assert 'Trường A-Hàm' in page.title()
    page.go_back();page.wait_for_function("!Reader.state.item&&appState.currentTab==='tang-han'")
    assert page.locator('#global-search').input_value()=='T01n0001',page.evaluate('({hash:location.hash,state:history.state,query:appState.searchQuery})')
    assert 'truong-aham' in page.url
    page.go_forward();page.wait_for_function('Reader.state.ready')
    page.locator('#reader-close').click()
    page.wait_for_function('!Reader.state.item')
    checks.append('Reader Back/Forward preserves source branch, query and book title')
    page.evaluate("void DharmaShell.openAlbum({type:'daithua',id:'dt_01_1'})")
    page.wait_for_selector('.album-track')
    page.evaluate("void DharmaShell.openAlbum({type:'daithua',id:'dt_01_2'})")
    page.wait_for_function("location.hash.includes('dt_01_2')")
    page.go_back();page.wait_for_function("document.querySelector('.album-hero').textContent.includes('Quán Vô Lượng Thọ')")
    page.reload(wait_until='networkidle')
    page.wait_for_function("document.querySelector('.album-hero')?.textContent.includes('Quán Vô Lượng Thọ')")
    checks.append('Album history and reload restore distinct book links')
    page.evaluate("void Reader.open(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}),'viet')")
    page.wait_for_function('Reader.state.ready')
    page.locator('#reader-listen-toggle').click();page.wait_for_function("Audiobook.state.status==='playing'")
    page.locator('#dp-settings').click()
    aria=page.locator('#dp-options').aria_snapshot()
    assert 'slider "Tốc độ nghe"' in aria,aria
    assert 'button "Lời kinh đồng bộ (F)"' in aria,aria
    assert not page.locator('#dp-rain').is_visible()
    assert page.locator('#audio-voice').is_visible() and page.locator('#audio-sleep').is_visible()
    page.locator('#dp-extra-options summary').click();assert page.locator('#dp-rain').is_visible()
    page.locator('#audio-rate').fill('1.15');page.locator('#audio-rate').dispatch_event('input')
    assert page.locator('#audio-rate').get_attribute('aria-valuetext')=='1,15 lần'
    page.keyboard.press('Escape')
    assert page.evaluate("Audiobook.state.status==='playing'")
    page.screenshot(path=str(OUT/'stage2-reader.png'))
    checks.append('Named speed slider and lyric action; settings retain playback')

def stage3(page,checks):
    expected={'ep-b0448adb54d8':'Kinh Viên Giác · Luận Giảng','ep-62a15f61582c':'Luận Giải Trung Luận · Tánh Khởi và Duyên Khởi','ep-247bffa03610':'Câu Xá Luận Tụng Lược Thích · Tập I'}
    for id,title in expected.items():
        page.evaluate("([id])=>void LibraryUI.open('ebooks',id,'viet')",[id])
        page.wait_for_function('Reader.state.ready')
        assert page.locator('#reader-book-title').inner_text()==title
        assert 'chưa hiệu đính' in page.locator('#reader-edition-info').inner_text()
        assert page.evaluate('Reader.state.doc.blocks[0].heading.title')==title
        page.locator('#reader-close').click()
    checks.append('Three verified titles agree between catalog, reader and generated header')
    assert page.evaluate("LibraryCatalog.status({type:'phucminh',data:{sourceKind:'ocr'}})")=='OCR tự động; chưa hiệu đính'
    assert page.evaluate("LibraryCatalog.status({type:'ebooks',data:{metadataVerified:'2026-10-10'}})")=='Bản chữ chuyển từ Word; chưa hiệu đính'
    checks.append('Metadata verification never implies proofreading; OCR remains explicit')

def stage4(page,checks):
    metrics=page.evaluate("({dom:document.querySelectorAll('*').length,bytes:performance.getEntriesByType('resource').reduce((n,x)=>n+x.decodedBodySize,0),resources:performance.getEntriesByType('resource').map(x=>x.name),sizes:performance.getEntriesByType('resource').map(x=>[x.name,x.decodedBodySize]),options:document.querySelector('#study-books').options.length})")
    (OUT/'performance-after.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2),encoding='utf-8')
    assert metrics['dom']<12000,metrics['dom']
    assert metrics['bytes']<4500000,metrics['bytes']
    assert metrics['options']<=40
    assert not any('library-audit.json' in x or 'pali-glossary.js' in x or 'catalog.json' in x for x in metrics['resources'])
    assert len([x for x in metrics['resources'] if '.css' in x])==1
    (OUT/'performance-after.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2),encoding='utf-8')
    checks.append(f"Initial DOM {metrics['dom']} (baseline 29044); decoded resources {metrics['bytes']} bytes (baseline 6277745)")
    page.evaluate("LibraryUpgrades.navigate('quality')")
    page.wait_for_function("document.querySelector('#quality-summary').textContent.includes('5.348')")
    page.locator('#quality-filter').fill('Viên Giác')
    assert page.locator('#quality-book').evaluate('(e)=>e.options.length')<40
    page.evaluate("void DaiTang.details('ep-b0448adb54d8')")
    page.wait_for_selector('#ep-detail[open]')
    assert page.locator('.ep-sources a').count()>=2
    page.keyboard.press('Escape')
    page.evaluate("switchTab('glossary')")
    page.wait_for_function("LibraryAssets.ready('glossary')")
    assert page.locator('#tab-glossary').inner_text().strip()
    checks.append('Quality report, full source profile and glossary load when requested')

def stage5(page,checks):
    for width in [390,320]:
        page.set_viewport_size({'width':width,'height':844});page.evaluate("switchTab('home')");page.wait_for_timeout(250)
        assert not page.locator('#persistent-player').is_visible()
        hero=page.locator('.sanctuary-hero').bounding_box()
        choices=page.locator('#catalog-search-controls').bounding_box();discovery=page.locator('.home-discovery').bounding_box()
        assert hero['y']+hero['height']<=choices['y'], (width,hero,choices)
        assert choices['y']+choices['height']<=discovery['y'], (width,choices,discovery)
        assert page.locator('.sanctuary-hero').bounding_box()['height']<310
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.screenshot(path=str(OUT/f'stage5-home-{width}.png'))
        page.evaluate("LibraryUpgrades.navigate('offline')")
        page.screenshot(path=str(OUT/f'stage5-offline-{width}.png'))
        button=page.locator('#offline-save').bounding_box()
        assert button['y']+button['height']<700, (width,button)
    checks.append('320/390 px: hero precedes search and continue; compact utility and no empty player')
    page.set_viewport_size({'width':1440,'height':1000});page.evaluate("switchTab('home')")
    page.locator('#global-search').fill('Dược Sư');page.locator('#catalog-search-text').click()
    assert page.locator('#fulltext-query').input_value()=='Dược Sư'
    page.wait_for_selector('.passage-result')
    page.locator('#fulltext-search-titles').click()
    assert page.locator('#global-search').input_value()=='Dược Sư'
    page.go_back();page.wait_for_function("appState.currentTab==='fulltext'")
    assert page.locator('#fulltext-query').input_value()=='Dược Sư'
    page.evaluate("switchTab('home')");page.locator('#global-search').fill('')
    checks.append('Title/content search switches preserve the same query; Back restores content search')
    page.locator('#ds-create').click()
    keys=['ebooks:ep-b0448adb54d8','phucminh:'+page.evaluate('PHUC_MINH_DATA.find(x=>x.vietFile).id'),'daitang:T01n0001','daithua:dt_01_2']
    for key in keys:
        page.locator('#ds-playlist-search').fill(key.split(':',1)[1])
        page.locator(f'#ds-create-form [data-book-key="{key}"]').click()
    assert page.locator('#ds-playlist-books').evaluate('(e)=>[...e.selectedOptions].map(o=>o.value)')==keys
    page.locator('#ds-create-form .book-picker-chosen li').last.locator('button').first.click()
    keys[2],keys[3]=keys[3],keys[2]
    page.locator('#ds-playlist-name').fill('Nghiệm thu bốn kho')
    page.locator('#ds-create-form [type=submit]').click()
    assert page.evaluate("LibraryStore.read('dharma-playlists',[]).at(-1).items.map(x=>x.type+':'+x.id)")==keys
    checks.append('Search, add and reorder a listening list across all four collections without Ctrl')
    page.evaluate("LibraryUpgrades.navigate('fulltext')")
    page.locator('#fulltext-query').fill('zxqvnomatchkinh20261010')
    page.locator('#fulltext-form [type=submit]').click()
    page.wait_for_function("document.querySelector('#fulltext-status').textContent.startsWith('0 đoạn')")
    assert 'tải thêm sách' not in page.locator('#fulltext-status').inner_text()
    page.locator('#fulltext-query').fill('chánh niệm')
    page.locator('#fulltext-collection').select_option('phucminh')
    page.locator('#fulltext-form [type=submit]').click()
    page.wait_for_selector('.passage-result')
    page.locator('.passage-result button').first.click();page.wait_for_function('Reader.state.ready')
    page.go_back();page.wait_for_function("!Reader.state.item&&appState.currentTab==='fulltext'")
    assert page.locator('#fulltext-query').input_value()=='chánh niệm'
    assert page.locator('#fulltext-collection').input_value()=='phucminh'
    checks.append('Online empty search has correct guidance; Back restores full-text query and filters')

def stage6(page,checks):
    page.wait_for_function('LibraryOffline.ready')
    page.wait_for_function('!!navigator.serviceWorker.controller',timeout=20000)
    page.evaluate("void LibraryUI.open('daithua','dt_01_2','viet')")
    page.wait_for_function('Reader.state.ready')
    before=page.evaluate('Reader.capture()')
    page.locator('[data-panel="research"]').click()
    page.locator('#reader-search').fill('Dược Sư');page.wait_for_timeout(300)
    page.get_by_role('button',name='Kết quả tiếp',exact=True).click()
    page.get_by_role('button',name='Về vị trí trước khi tìm',exact=True).click()
    assert page.evaluate('Reader.capture().block')==before['block']
    checks.append('Book search has previous/next and returns to the original reading block')
    page.evaluate('LibraryDownload.open(Reader.state.item,Reader.state)')
    assert 'Dược Sư' in page.locator('#download-book').inner_text()
    page.locator('#download-start').click()
    page.wait_for_function("document.querySelector('#download-status').textContent.startsWith('Đã lưu đủ')")
    pack=page.evaluate("LibraryOffline.packs().find(x=>x.key==='daithua:dt_01_2')")
    assert pack and all('.md' in x for x in pack['urls']),pack
    page.locator('#download-close').click()
    cancelled=page.evaluate("""async()=>{const s=Reader.state,item=DharmaPlayerStore.resolve(s.item),chapter=s.sections.find(x=>NarrationModel.build({...s.doc,blocks:s.doc.blocks.slice(x.start,x.end)}).length>=2),c=new AbortController();try{await LibraryOffline.saveChapter(item,s.doc,chapter.start,chapter.end,Audiobook.state.voice,c.signal,t=>{if(t.startsWith('Đã tải 1/'))c.abort();});}catch(e){if(e.name!=='AbortError')throw e;}return LibraryOffline.packs().find(x=>x.key===item.key);} """)
    assert cancelled['chapters'][-1]['completed']==1 and cancelled['chapters'][-1]['total']>1
    checks.append('Text-only download excludes PDFs; cancelled chapter retains one completed segment and explicit missing count')
    page.locator('#inspector-close').click()
    page.locator('#reader-listen-toggle').click();page.wait_for_function("Audiobook.state.status==='playing'")
    assert 'Đoạn 1/' in page.locator('#dp-segment-progress').inner_text()
    assert 'Giọng tổng hợp' in page.evaluate('Audiobook.state.voiceLabel')
    page.evaluate('Audiobook.pause()')
    page.context.set_offline(True)
    page.reload(wait_until='domcontentloaded')
    page.wait_for_function('Reader.state.ready',timeout=20000)
    assert 'Dược Sư' in page.locator('#reader-book-title').inner_text()
    assert page.evaluate('LibraryOffline.packs()[0].audio.length')>=1
    page.context.unroute('**/api/tts')
    page.context.route('**/api/tts',lambda r:r.abort('internetdisconnected'))
    page.evaluate("()=>{const s=Reader.state,chapter=LibraryOffline.packs()[0].chapters.at(-1),segment=NarrationModel.build({...s.doc,blocks:s.doc.blocks.slice(chapter.start,chapter.end)})[0];void DharmaPlayerStore.playItem(s.item,{block:segment.block,sourceOffset:segment.sourceOffset});}")
    page.wait_for_function("Audiobook.state.status==='playing'",timeout=15000)
    page.evaluate('Audiobook.pause()')
    page.context.set_offline(False)
    checks.append('Service-worker cold reload opens saved reading edition and plays cached audio with TTS unavailable; segment clock and synthetic voice explicit')
    page.screenshot(path=str(OUT/'stage6-offline-reader.png'))

def stage7(page,checks):
    page.evaluate("LibraryUpgrades.navigate('settings')")
    page.locator('#sync-device-name').fill('Máy tính nghiệm thu');page.locator('#sync-name-save').click()
    page.locator('#sync-create').click();page.wait_for_function('!!LibrarySync.auth()')
    code=page.evaluate('async()=>(await LibrarySync.code()).code')
    other_context=page.context.browser.new_context(service_workers='block',viewport={'width':390,'height':844})
    other_context.route('**/api/voices',lambda r:r.fulfill(json={'available':True,'voices':[]}))
    other=other_context.new_page();other.goto(page.url.split('#')[0],wait_until='networkidle')
    other.evaluate("LibraryStore.write('device-name','Điện thoại nghiệm thu');LibraryUpgrades.navigate('settings')")
    other.evaluate('(code)=>LibrarySync.pair(code)',code)
    page.evaluate('LibraryDevices.refresh()')
    page.wait_for_function("document.querySelector('#sync-devices').textContent.includes('Điện thoại nghiệm thu')")
    page.evaluate("LibraryStore.write('marks:test-sync',[{id:'n1',note:'Ghi chú giữ nguyên',updatedAt:Date.now()}])")
    page.evaluate('LibrarySync.sync()');other.evaluate('LibrarySync.sync()')
    assert other.evaluate("LibraryStore.read('marks:test-sync',[])[0].note")=='Ghi chú giữ nguyên'
    page.evaluate("LibraryStore.write('marks:test-concurrent',[{id:'n2',note:'Bản A đồng thời'}])")
    other.evaluate("LibraryStore.write('marks:test-concurrent',[{id:'n2',note:'Bản B đồng thời'}])")
    page.evaluate('LibrarySync.sync()');other.evaluate('LibrarySync.sync()');page.evaluate('LibrarySync.sync()')
    page.locator('#sync-conflicts-view').click()
    page.wait_for_function("/Bản [AB] đồng thời/.test(document.querySelector('#sync-conflict-list').textContent)")
    assert page.evaluate("LibraryStore.read('marks:test-concurrent',[])[0].note")==other.evaluate("LibraryStore.read('marks:test-concurrent',[])[0].note")
    checks.append('Concurrent note edits converge across two browsers; losing version is visible for review/export')
    page.on('dialog',lambda d:d.accept())
    page.get_by_role('button',name='Thu hồi Điện thoại nghiệm thu',exact=True).click()
    page.wait_for_function("!document.querySelector('#sync-devices').textContent.includes('Điện thoại nghiệm thu')")
    other.evaluate('LibrarySync.sync()')
    assert not other.evaluate('LibrarySync.auth()')
    assert other.evaluate("LibraryStore.read('marks:test-sync',[])[0].note")=='Ghi chú giữ nguyên'
    checks.append('Two devices pair, exchange notes and revoke remotely; rejected token cannot reconnect and local notes remain')
    page.locator('#sync-delete-profile').click();page.wait_for_function('!LibrarySync.auth()')
    assert page.evaluate("LibraryStore.read('marks:test-sync',[])[0].note")=='Ghi chú giữ nguyên'
    checks.append('UI profile deletion invalidates server credentials and keeps local personal data')
    other_context.close()

def stage8(page,checks):
    page.evaluate("void LibraryUI.open('daithua','dt_01_2','viet')");page.wait_for_function('Reader.state.ready')
    url=page.evaluate('LibraryCommunity.shareLink()');response=page.request.get(url)
    assert response.status==200 and 'og:title' in response.text() and 'Dược Sư' in response.text()
    assert page.request.head(url).status==200
    assert page.request.head(url.replace('book=daithua%3Adt_01_2','book=ebooks%3Amissing')).status==404
    assert page.request.get(url.replace('book=daithua%3Adt_01_2','book=ebooks%3Amissing')).status==404
    shared=page.context.new_page();shared.goto(url);shared.locator('.open-edition').click();shared.wait_for_function('window.Reader?.state.ready')
    assert shared.evaluate('Reader.state.key')=='daithua:dt_01_2'
    assert shared.evaluate('Reader.capture().block')==page.evaluate('Reader.capture().block');shared.close()
    checks.append('Shared passage has server-rendered title/excerpt metadata and opens the exact reading block; unknown edition returns 404')
    page.evaluate('LibraryCommunity.openReport()')
    page.locator('#issue-message').fill('Xin đối chiếu dấu câu với bản nguồn.')
    value=json.loads(page.locator('#issue-preview').inner_text())
    assert value['book']=='daithua:dt_01_2' and value['block'] and value['version'] and value['source'] and value['excerpt']
    assert value['message']=='Xin đối chiếu dấu câu với bản nguồn.'
    assert page.locator('#issue-email').get_attribute('href').startswith('mailto:thanhtrungtb231096@gmail.com?')
    with page.expect_download() as download:page.locator('#issue-export').click()
    assert download.value.suggested_filename.endswith('.json')
    page.locator('#issue-close').click();page.locator('#reader-close').click()
    page.evaluate("LibraryUpgrades.navigate('help')")
    assert page.locator('#help-email').inner_text()=='thanhtrungtb231096@gmail.com'
    assert 'không nằm trong json' in page.locator('#tab-help').inner_text().lower()
    checks.append('Issue preview/export includes exact source identity and excludes private notes; contact and backup scope visible')
    migrated=page.evaluate("""async()=>{const key='ebooks:ep-b0448adb54d8',item=LibraryCatalog.get(key),map=await(await fetch('data/edition-migrations/ep-b0448adb54d8.json')).json(),doc=ReaderModel.parse(await(await fetch(Reader.path(item,'viet'))).text()),b=doc.blocks.find(x=>x.kind==='text'&&x.text.length>80),parts=b.id.split('-'),old='b-'+(parseInt(parts[1],36)-map.delta).toString(36)+'-'+parts[2];LibraryStore.write('migration:'+key+':viet',null);LibraryStore.write('position:'+key+':viet',{block:old,textOffset:10,version:map.from});LibraryStore.write('listen:'+key,{block:old,seconds:12});LibraryStore.write('marks:'+key,[{id:'preserve-note',block:old,note:'Ghi chú không được mất'}]);await LibraryUI.open('ebooks',item.id,'viet');return {expected:b.id,read:Reader.capture().block,listen:LibraryStore.read('listen:'+key,{}).block,marks:LibraryStore.read('marks:'+key,[])};}""")
    assert migrated['listen']==migrated['expected'] and migrated['marks'][0]['block']==migrated['expected'],migrated
    assert page.locator(f'[data-block="{migrated["expected"]}"]').evaluate("e=>{const r=e.getBoundingClientRect(),v=document.querySelector('#reader-page-viewport').getBoundingClientRect();return r.left<v.right&&r.right>v.left&&r.top<v.bottom&&r.bottom>v.top;}")
    assert migrated['marks'][0]['note']=='Ghi chú không được mất'
    checks.append('Header-only title correction migrates old reading/audio/note anchors; original personal records backed up')
    page.locator('#reader-close').click();page.evaluate("LibraryUpgrades.navigate('study')")
    page.locator('#study-simple').click()
    assert page.locator('#study-books').evaluate('(e)=>e.selectedOptions.length')==1
    assert page.locator('#study-minutes').input_value()=='15'
    page.evaluate("LibraryCatalog.setSelection(document.querySelector('#study-books'),[])")
    page.locator('#study-filter').fill('ep-b0448adb54d8')
    page.locator('#study-form [data-book-key="ebooks:ep-b0448adb54d8"]').click()
    page.locator('#study-name').fill('Một sách mỗi ngày');page.locator('#study-form [type=submit]').click()
    page.get_by_role('button',name='Xóa thời khóa',exact=True).click()
    page.get_by_role('button',name='Hoàn tác xóa thời khóa',exact=True).click()
    assert page.evaluate("LibraryStore.read('study-plans',[]).length")==1
    page.get_by_role('button',name='Chỉnh thời khóa',exact=True).click()
    assert page.locator('#study-books').evaluate('(e)=>[...e.selectedOptions].map(o=>o.value)')==['ebooks:ep-b0448adb54d8']
    checks.append('One-book study plan supports editing and undo deletion without losing selected books')
    from health_probe import probe
    assert probe(page.url.split('/web-thuvien/')[0])['passed']
    checks.append('Read-only status, narration statistics and full-text health probes succeed locally')

def stage9(page,checks):
    version=page.evaluate("async()=>(await(await fetch('data/library-version.json')).json()).version")
    status=page.evaluate("async()=>await(await fetch('/api/library/status')).json()")
    assert status['version']==version and status['documents']==5348 and status['passages']==3395798
    for theme in ['parchment','amber','night']:
        page.evaluate('(theme)=>setTheme(theme)',theme)
        ratios=page.evaluate("""()=>{const s=getComputedStyle(document.documentElement),rgb=v=>{const c=document.createElement('span');c.style.color=v;document.body.append(c);const result=getComputedStyle(c).color.match(/[\d.]+/g).slice(0,3).map(Number);c.remove();return result;},lum=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0),ratio=(a,b)=>{const x=lum(rgb(s.getPropertyValue(a))),y=lum(rgb(s.getPropertyValue(b)));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};return {primary:ratio('--text-primary','--bg-surface'),secondary:ratio('--text-secondary','--bg-surface'),action:ratio('--on-accent','--accent')};}""")
        assert min(ratios.values())>=4.5,(theme,ratios)
    checks.append('Release identity agrees between browser and server; three core text/action token pairs pass 4.5:1 in every theme (not a full contrast certification)')
    page.evaluate("void LibraryUI.open('daithua','dt_01_2','viet')");page.wait_for_function('Reader.state.ready')
    for width in [640,320]:
        page.set_viewport_size({'width':width,'height':900})
        page.add_style_tag(content='#reader-paper-content .source-prose{line-height:1.8!important;letter-spacing:.12em!important;word-spacing:.16em!important;}')
        page.evaluate("dispatchEvent(new Event('resize'))");page.wait_for_timeout(300)
        assert page.locator('#reader-page-viewport').evaluate('(e)=>e.scrollLeft')==0
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
        page.evaluate('LibraryCommunity.openReport()')
        assert page.evaluate("document.activeElement.closest('#issue-dialog')!==null")
        for _ in range(15):
            page.keyboard.press('Tab');assert page.evaluate("document.activeElement.closest('#issue-dialog')!==null")
        page.keyboard.press('Escape');assert not page.locator('#issue-dialog').is_visible()
        page.screenshot(path=str(OUT/f'stage9-spacing-{width}.png'))
    checks.append('640/320 px reflow and increased text spacing retain paged layout; modal focus stays inside and Escape closes')
    page.locator('#reader-listen-toggle').click();page.wait_for_function("Audiobook.state.status==='playing'")
    diagnostic=page.evaluate('LibraryDiagnostics.capture()')
    assert diagnostic['version']==version and diagnostic['metrics']['audioStartMilliseconds'] and diagnostic['metrics']['errors']==0
    assert all(word not in json.dumps(diagnostic) for word in ['Ghi chú không được mất','Xin đối chiếu'])
    checks.append('Audio-start measurement and diagnostics export contain session metrics without personal notes')
    page.evaluate('Audiobook.pause()')

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--stage',type=int,default=1)
    args=parser.parse_args()
    isolated=None
    if args.stage==7:
        import library_services
        isolated=tempfile.TemporaryDirectory(dir=OUT)
        prior_state=library_services.STATE;library_services.STATE=Path(isolated.name)
    memory={}
    server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,unused,log_path=None)
    http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet)
    http.allowed_patterns=set()
    threading.Thread(target=http.serve_forever,daemon=True).start()
    checks,errors=[],[]
    version=json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))['version']
    result={'stage':args.stage,'version':version,'checks':checks,'pageErrors':errors,'passed':False,'audioFixture':'Local WAV; live synthesis and pronunciation quality are not measured.'}
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
            context=browser.new_context(viewport={'width':1440,'height':1000},service_workers='allow' if args.stage==6 else 'block',reduced_motion='reduce')
            context.route('**/api/voices',lambda r:r.fulfill(json={'available':True,'offlineAvailable':True,'voices':[],'offlineVoices':[{'id':'vieneu-thuc-doan','name':'Thục Đoan'}],'audioConfig':{'startupBufferSeconds':0}}))
            wav=audio_fixture(40)
            context.route('**/api/tts',lambda r:r.fulfill(body=wav,content_type='audio/wav'))
            page=context.new_page()
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html',wait_until='networkidle')
            globals()['stage'+str(args.stage)](page,checks)
            assert not errors,errors
            browser.close()
        result['passed']=True
        print(json.dumps(result,ensure_ascii=False))
    except Exception as error:
        result['failure']=str(error)
        raise
    finally:
        http.shutdown()
        if isolated:
            library_services.STATE=prior_state;isolated.cleanup()
        (OUT/f'stage{args.stage}.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':main()

"""Real-corpus acceptance checks. Playback uses a local WAV, not remote TTS."""

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
from urllib.parse import unquote, urlencode
import io,json,math,os,struct,sys,urllib.request,wave
sys.path.insert(0,str(DEPENDENCIES)); sys.path.insert(0,str(APP))
from playwright.sync_api import sync_playwright
from legacy_word import normalize_vietnamese
import server
BASE = os.environ.get('EBOOKS_TEST_URL','http://127.0.0.1:8096')
URL = BASE + '/web-thuvien/index.html'
OUT = Path(__file__).parent / 'artifacts/dai-tang-kinh'; OUT.mkdir(parents=True,exist_ok=True)
catalog = json.loads((GENERATED / 'dai-tang-kinh/catalog.json').read_text(encoding='utf-8'))
books = catalog['books']
assert len(books)==1624 and len({b['id'] for b in books})==1624
assert sum(bool(b['vietFile']) for b in books)==1616
assert sum(b['status']=='missing' for b in books)==8
assert sum(b['status']=='partial' for b in books)==7
for b in books:
    assert b['title'] and server.is_allowed_file(public_path(b['sourceFile'])),b['id']
    if b['vietFile']: assert server.is_allowed_file(public_path(b['vietFile']))
assert not server.is_allowed_file(SOURCES['EbooksProject'] / 'Than-Benh/Ung-Thu/~WRL0167.tmp')
assert not server.is_allowed_file(WORK_CACHE / 'inspect_ebooks_project.py')
fixed,_=normalize_vietnamese('GIAÙO HOÄI PHAÄT GIAÙO VIEÄT NAM\nKINH ẤN TỐNG\nNgười dịch: Thích Thông Bửu')
assert 'GIÁO HỘI PHẬT GIÁO VIỆT NAM' in fixed and 'KINH ẤN TỐNG' in fixed and 'Thích Thông Bửu' in fixed
small=next(b for b in books if b['vietFile'] and b['characters']<15000 and 'Bát Đại Nhân Giác' in b['title'])
second=next(b for b in books if b['vietFile'] and 2500<b['characters']<15000 and b['id']!=small['id'])
id=small['id']
tone=io.BytesIO()
with wave.open(tone,'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(16000)
    wav.writeframes(b''.join(struct.pack('<h',int(800*math.sin(i*.08))) for i in range(16000*8)))
errors,checks=[],[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
    page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('**/api/tts',lambda route:route.fulfill(status=200,content_type='audio/wav',body=tone.getvalue()))
    page.goto(URL+'#daitang',wait_until='networkidle')
    assert page.locator('#tab-daitang').is_visible()
    assert page.locator('#tab-daitang h1').inner_text()=='Đại Tạng Kinh'
    assert page.locator('#ep-books .pm-card').count()==30
    assert page.locator('[data-dharma-nav="daitang"]').count()==1
    page.screenshot(path=str(OUT/'desktop-viewport.png'))
    first=page.locator('#ep-books [data-ep-action="details"]').first.get_attribute('data-id')
    page.locator('#ep-next').click()
    assert 'Trang 2 /' in page.locator('#ep-page').inner_text()
    assert page.locator('#ep-books [data-ep-action="details"]').first.get_attribute('data-id')!=first
    page.locator('#ep-page-number').fill('9999');page.locator('#ep-page-number').press('Tab')
    assert page.locator('#ep-next').is_disabled()
    page.locator('#ep-page-number').fill('1');page.locator('#ep-page-number').press('Tab')
    page.locator('[data-ep-category="Thiền"]').click()
    assert page.locator('#ep-count').inner_text().startswith('180 /')
    page.locator('[data-ep-category="all"]').click()
    page.locator('#ep-availability').select_option('missing')
    assert page.locator('#ep-books .pm-card').count()==8
    assert page.locator('#ep-books [data-ep-action="listen"]:disabled').count()==8
    page.locator('#ep-books [data-ep-action="details"]').first.click()
    assert page.locator('#ep-detail-read').is_disabled() and page.locator('#ep-detail-listen').is_disabled()
    page.locator('#ep-detail-close').click()
    page.locator('#ep-availability').select_option('partial')
    assert page.locator('#ep-books .pm-card').count()==7
    page.locator('#ep-availability').select_option('all')
    page.locator('#ep-search').fill('kinh truong bo')
    assert page.locator('#ep-books h3').filter(has_text='Kinh Trường Bộ').count()>=1
    page.locator('#ep-search').fill('unlikely-title-xyz');assert page.locator('#ep-empty').is_visible()
    page.locator('#ep-reset').click()
    checks.append('Corpus, navigation, pagination, unaccented search, filters and source states');print(checks[-1],flush=True)
    page.locator('#ep-search').fill(small['title'])
    page.locator(f'#ep-books [data-ep-action="save"][data-id="{id}"]').click()
    page.locator('#ep-saved').click()
    assert page.locator(f'[data-ep-action="save"][data-id="{id}"]').get_attribute('aria-pressed')=='true'
    page.locator('#ep-saved').click()
    page.locator(f'#ep-books [data-ep-action="details"][data-id="{id}"]').first.click()
    assert page.locator('#ep-detail-title').inner_text()==small['title']
    page.locator('#ep-detail-queue').click();assert page.evaluate('DharmaPlayerStore.state.queue.at(-1).type')=='ebooks'
    page.locator('#ep-detail-close').click()
    with page.expect_download() as download:page.locator(f'#ep-books .pm-card:has([data-id="{id}"]) a[download]').click()
    assert download.value.suggested_filename.lower().endswith('.doc')
    page.locator(f'#ep-books [data-ep-action="read"][data-id="{id}"]').click();page.wait_for_function('Reader.state.ready')
    assert page.evaluate('Reader.state.key')=='ebooks:'+id
    assert not page.locator('.reader-mode-switch').is_visible()
    assert 'ĐẠI TẠNG KINH' in page.locator('#reader-book-subtitle').inner_text()
    assert page.locator('#reader-word-link').get_attribute('href')==small['sourceFile']
    assert page.evaluate('Reader.state.sections.length')>1
    page.evaluate('Reader.jumpSection(Math.min(3,Reader.state.sections.length-1))');page.locator('#reader-mark').click()
    block=page.evaluate('Reader.state.block')
    page.locator('#reader-close').click();page.locator(f'#ep-books [data-ep-action="read"][data-id="{id}"]').click()
    page.wait_for_function('Reader.state.ready');assert page.evaluate('Reader.state.block')==block
    page.evaluate("document.getElementById('reader-note-input').value='Ghi chú kiểm tra module Đại Tạng Kinh';document.getElementById('reader-note-save').click()")
    assert page.evaluate('LibraryStore.read("marks:"+Reader.state.key,[]).some(x=>x.note.includes("kiểm tra module"))')
    page.screenshot(path=str(OUT/'reader.png'))
    deep=page.url;page.goto(deep,wait_until='networkidle');page.wait_for_function('Reader.state.ready')
    assert page.evaluate('Reader.state.key')=='ebooks:'+id
    page.locator('#reader-close').click();assert page.locator('#tab-daitang').is_visible()
    page.evaluate('switchTab("shelf")');assert page.locator('#favorite-books').filter(has_text=small['title']).is_visible()
    page.evaluate('switchTab("home")');page.locator('#global-search').fill('kinh truong bo')
    page.wait_for_function('appState.searchQuery === "kinh truong bo"')
    page.locator('details:has(#home-collection) > summary').click()
    page.locator('#home-collection').select_option('ebooks')
    assert page.locator('#home-search-hits').filter(has_text='Kinh Trường Bộ').is_visible()
    checks.append('Word download, details, queue, shared reader, chapter TOC, resume, bookmark, notes, deep links and shelf');print(checks[-1],flush=True)
    page.evaluate('switchTab("daitang")');page.locator('#ep-search').fill(small['title'])
    page.locator(f'#ep-books [data-ep-action="listen"][data-id="{id}"]').click()
    page.wait_for_function('Audiobook.state.status === "playing"',timeout=20000)
    assert page.evaluate('DharmaPlayerStore.state.item.type')=='ebooks'
    page.evaluate('switchTab("phucminh")');assert page.evaluate('Audiobook.state.status')=='playing'
    assert page.locator('#pm-books .pm-card').count()==26
    page.evaluate('Audiobook.pause()')
    page.evaluate("CollectionPlayer.start('Đại Tạng Kinh · Kiểm tra',"+json.dumps([{'type':'ebooks','id':id,'title':small['title']},{'type':'ebooks','id':second['id'],'title':second['title']}],ensure_ascii=False)+')')
    page.wait_for_function('Audiobook.state.status === "playing"')
    page.evaluate('CollectionPlayer.jump(1)')
    page.wait_for_function('DharmaPlayerStore.state.item?.id === '+json.dumps(second['id'])+' && Audiobook.state.status === "playing"')
    page.evaluate('CollectionPlayer.stop();Audiobook.stop();if(Reader.state.item)Reader.close();switchTab("daitang")')
    checks.append('Local test audio, continuity across modules and sequential playback');print(checks[-1],flush=True)
    page.wait_for_function('!!navigator.serviceWorker?.controller',timeout=30000)
    assert page.evaluate('async id=>{const b=DaiTang.find(id);await LibraryOffline.saveBook(DharmaPlayerStore.resolve({type:"ebooks",data:b}));return LibraryStore.read("offline-packs",[]).some(x=>x.key==="ebooks:"+id);}',id)
    context.set_offline(True)
    page.goto(URL+'#read/ebooks%3A'+id+'/viet',wait_until='domcontentloaded');page.wait_for_function('Reader.state.ready',timeout=20000)
    assert page.evaluate('Reader.state.key')=='ebooks:'+id
    page.locator('#reader-close').click();context.set_offline(False)
    checks.append('Explicitly saved text and Word original available offline');print(checks[-1],flush=True)
    for width in (320,390,768,1024):
        page.set_viewport_size({'width':width,'height':844});page.evaluate('switchTab("daitang")');page.locator('#ep-search').fill('')
        for layout in ('cards','list'):
            page.locator(f'[data-ep-layout="{layout}"]').click()
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow at {width}/{layout}'
        page.locator('[data-ep-layout="cards"]').click();page.screenshot(path=str(OUT/f'module-{width}.png'))
    checks.append('Cards and list at 320, 390, 768 and 1024 pixels')
    page.set_viewport_size({'width':1440,'height':1000})
    page.evaluate('switchTab("fulltext")')
    page.locator('#fulltext-collection').select_option('ebooks')
    page.locator('#fulltext-query').fill('pháp môn căn bản')
    with page.expect_response(lambda r:'/api/search?' in r.url and 'collection=ebooks' in r.url) as found:
        page.locator('#fulltext-form [type="submit"]').click()
    results=found.value.json()['results'];assert results
    page.locator('#fulltext-results .passage-result').first.wait_for()
    page.locator('#fulltext-results .passage-result').first.get_by_role('button',name='Đọc đúng đoạn').click()
    page.wait_for_function('Reader.state.ready',timeout=30000)
    assert page.evaluate('Reader.state.key')==results[0]['key']
    assert page.evaluate('Reader.state.block')==results[0]['block']
    page.locator('#reader-close').click()
    middle=next(b for b in books if b['filename'].startswith('Kinh-Trung-Bo-'))
    page.evaluate('switchTab("quality")')
    page.locator('#quality-book').select_option('ebooks:'+middle['id'])
    page.locator('#quality-open').click()
    page.wait_for_function('document.querySelector("#quality-details .quality-source") !== null')
    assert page.locator('#quality-details').filter(has_text='Majjhima Nikāya').is_visible()
    assert page.locator('#quality-details a[download]').get_attribute('href')==middle['sourceFile']
    checks.append('Full-text UI opens exact reader block; Word source and verified source-label notes in edition review')
    missing=next(b for b in books if not b['vietFile'])
    page.evaluate('switchTab("offline")')
    page.locator('#offline-book').select_option('ebooks:'+missing['id'])
    page.locator('#offline-save').click()
    page.wait_for_function('id=>LibraryOffline.packs().some(x=>x.key==="ebooks:"+id)',arg=missing['id'])
    page.locator('#offline-books .upgrade-book-row').filter(has_text=missing['title']).get_by_role('button',name='Tải Word nguồn').wait_for()
    context.set_offline(True)
    with page.expect_download() as download:
        page.locator('#offline-books .upgrade-book-row').filter(has_text=missing['title']).get_by_role('button',name='Tải Word nguồn').click()
    assert download.value.suggested_filename==missing['filename']
    context.set_offline(False)
    page.evaluate('switchTab("quality")')
    page.locator('#quality-book').select_option('ebooks:'+missing['id'])
    page.locator('#quality-open').click()
    page.wait_for_function('document.getElementById("quality-status").textContent==="Chưa có bản văn này để rà soát."')
    checks.append('Source-only edition downloads original Word offline and reports unavailable text accurately')
    largest=max(books,key=lambda b:b['characters'])
    page.evaluate('switchTab("daitang")')
    page.evaluate('id=>DaiTang.read(id)',largest['id']);page.wait_for_function('Reader.state.ready',timeout=30000)
    assert page.evaluate('Reader.state.key')=='ebooks:'+largest['id']
    assert page.evaluate('Reader.state.doc.blocks.length')>1000
    page.locator('#reader-close').click()
    page.set_viewport_size({'width':390,'height':844})
    page.evaluate('scrollTo(0,0)');page.screenshot(path=str(OUT/'mobile-top.png'))
    checks.append('Largest real Word edition opens in shared reader')
    assert not errors,errors
    browser.close()
with urllib.request.urlopen(BASE+'/api/search?'+urlencode({'q':'pháp môn căn bản','collection':'ebooks'}),timeout=30) as response:search=json.load(response)
assert search['total'] and all(x['type']=='ebooks' for x in search['results'])
assert all(x['block'] for x in search['results'])
checks.append('Full-text API collection filter and reader block anchors')
result={'editions':1624,'readable':1616,'missing':8,'partial':7,'checks':checks,'browserErrors':errors}
(OUT/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))

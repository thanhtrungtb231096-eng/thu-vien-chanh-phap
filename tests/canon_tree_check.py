"""Verify three canon trees, edition links and the original Phuc Minh collection."""
from pathlib import Path
import hashlib
import json
import os
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'app'))
from project_paths import DEPENDENCIES
sys.path.insert(0, str(DEPENDENCIES))
from playwright.sync_api import sync_playwright
from test_spotify_player import fixture_audio

sys.stdout.reconfigure(encoding='utf-8')
URL = os.environ.get('DHARMA_TEST_URL', 'http://127.0.0.1:8090/web-thuvien/index.html')
OUT = ROOT / 'tests/artifacts/canon-tree'
OUT.mkdir(parents=True, exist_ok=True)


def main():
    checks, errors = [], []
    baseline=OUT/'preserved-files.json'
    preserved=list(json.loads(baseline.read_text(encoding='utf-8'))) if baseline.is_file() else []
    # The historical snapshot predates subsequent authorized reader/audio releases.
    # Verify that this run preserves the current inputs, while retaining the old evidence.
    fingerprints={f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in preserved}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH', r'C:\Program Files\Google\Chrome\Application\chrome.exe'), headless=True)
        context = browser.new_context(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
        context.route('**/api/voices', lambda r: r.fulfill(json={'available':True,'offlineAvailable':True,'voices':[],'offlineVoices':[{'id':'vieneu-thuc-doan','name':'Thục Đoan'}]}))
        wav = fixture_audio()
        context.route('**/api/tts', lambda r: r.fulfill(body=wav, content_type='audio/wav'))
        page = context.new_page()
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(URL, wait_until='networkidle')
        page.wait_for_selector('#home-content-modules')
        coverage = page.evaluate('''() => {
          const m=ContentModules.model;
          const expected=[...DAI_TANG_HAN_DATA.texts.map(d=>'daitang:'+d.id),...DAI_THUA_DATA.map(d=>'daithua:'+d.id),...DAI_TANG_KINH_DATA.map(d=>'ebooks:'+d.id),...PHUC_MINH_DATA.map(d=>'phucminh:'+d.id)];
          const primary=[...m.byPath.values()].flatMap(n=>n.entries.filter(e=>e.path.join('/')===n.path.join('/')));
          const divisions=[...m.byPath.values()].filter(n=>n.path[0]==='tang-han'&&n.division);
          return {indexed:expected.length,classified:m.entries.length,unique:m.byKey.size,
            primaryPlacements:primary.length,missing:expected.filter(k=>!m.byKey.has(k)),
            sourceHan:DAI_TANG_HAN_DATA.texts.every(d=>m.byKey.get('daitang:'+d.id).path[0]==='tang-han'),
            hanDivisions:divisions.length,divisionsMatch:divisions.every(n=>n.all.filter(e=>e.type==='daitang').length===DAI_TANG_HAN_DATA.texts.filter(d=>d.division===n.division).length),
            modules:m.modules.map(n=>({id:n.id,primary:n.ownCount,linked:n.linkedCount,available:n.count})),
            shared:m.shared.count,phucminh:m.separate.count,
            pmIsolated:m.modules.every(n=>n.all.every(e=>e.type!=='phucminh')),
            unchanged:m.entries.every(e=>DharmaPlayerStore.resolve(e)?.data===e.data),
            duplicateNodes:[...m.byPath.values()].some(n=>n.all.length!==new Set(n.all.map(e=>e.key)).size)};
        }''')
        assert coverage['indexed']==coverage['classified']==coverage['unique']==coverage['primaryPlacements']==4183, coverage
        assert not coverage['missing'] and not coverage['duplicateNodes']
        assert coverage['hanDivisions']==25 and coverage['sourceHan'] and coverage['divisionsMatch']
        assert coverage['pmIsolated'] and coverage['phucminh']==26 and coverage['unchanged']
        assert sum(m['primary'] for m in coverage['modules'])+coverage['shared']+coverage['phucminh']==4183
        assert page.locator('#home-content-modules [data-content-group]').count()==3
        assert page.locator('[data-dharma-nav="kinh-pali"], [data-dharma-nav="luat"], #tab-kinh-dai-thua').count()==0
        checks.append('4,183 editions covered once by primary classification; 25 Hán divisions retained; Phuc Minh isolated')

        boundaries = page.evaluate('''() => {
          const T=ContentTaxonomy, classify=(title,subcategory,category='Kinh & luận',filename='')=>T.classifyBook({title,subcategory,category,filename}).path.join('/');
          return {dn:classify('Kinh Trường Bộ','Kinh Pāli / Nam tông'),dhammapada:classify('Kinh Pháp Cú','Kinh Pāli / Nam tông'),
            commentary:classify('Tích Truyện Pháp Cú','Kinh Pāli / Nam tông'),karma:classify('Luật nhân quả','Phật giáo & doanh nhân','Phật học & thuyết pháp'),
            sarvastivada:classify('A Tỳ Đàm trong truyền thống Hữu Bộ','Luận & A-tỳ-đàm'),visuddhi:classify('Thanh Tịnh Đạo','Luận & A-tỳ-đàm'),
            handbook:classify('Thắng Pháp Tập Yếu Luận','Luận & A-tỳ-đàm'),agamaThesis:T.classifyHan({id:'T25n1505',division:'01'}).path.join('/'),
            tantra:ContentModules.model.byKey.get('daitang:T18n0865').path.join('/')};
        }''')
        assert boundaries == {
            'dn':'tang-nam-tong/kinh/truong-bo','dhammapada':'tang-nam-tong/kinh/tieu-bo',
            'commentary':'tang-nam-tong/chu-giai/phap-cu','karma':'tu-lieu-chung/doi-song',
            'sarvastivada':'tang-han/luan/ty-dam','visuddhi':'tang-nam-tong/chu-giai/thanh-tinh-dao',
            'handbook':'tang-nam-tong/a-ty-dam/hoc-luan','agamaThesis':'tang-han/kinh/a-ham/luan-giai',
            'tantra':'tang-han/kinh/mat-giao'
        }, boundaries
        checks.append('Pāli, Hữu Bộ, Thanh Tịnh Đạo, commentary and general-book classification boundaries checked')

        page.locator('#home-content-modules [data-content-group="tang-han"]').click()
        assert page.locator('#tab-tang-han .content-book').count()==0
        for group in ['kinh','a-ham','truong-aham']:
            page.locator('#tab-tang-han .content-group-grid [data-content-group="'+group+'"]').click()
        assert page.url.endswith('#tang-han/kinh/a-ham/truong-aham')
        assert page.locator('[data-tree-path="tang-han/kinh/a-ham/truong-aham"]').get_attribute('aria-current')=='page'
        page.locator('#tab-tang-han .content-related button').filter(has_text='Nikāya').click()
        assert page.url.endswith('#tang-nam-tong/kinh/truong-bo')
        page.go_back(wait_until='networkidle')
        assert page.url.endswith('#tang-han/kinh/a-ham/truong-aham')
        checks.append('Tree hierarchy, active branch, A-Hàm–Nikāya group link and browser Back work')

        page.evaluate('ContentModules.go("tang-dai-thua",["kinh","bat-nha"])')
        assert page.locator('#tab-tang-dai-thua .content-book').count()==24
        works=page.locator('#tab-tang-dai-thua .content-book').evaluate_all('(cards)=>cards.map(c=>c.dataset.workKey)')
        assert len(works)==len(set(works))
        page.locator('#global-search').fill('T08n0251');page.wait_for_timeout(260)
        assert page.locator('#tab-tang-dai-thua .content-book').count()==1
        edition_keys=page.locator('#tab-tang-dai-thua [data-edition-key]').evaluate_all('(rows)=>rows.map(r=>r.dataset.editionKey)')
        assert set(edition_keys)=={'daithua:dt_10_1','daitang:T08n0251'}
        page.locator('#tab-tang-dai-thua .content-editions > summary').click()
        page.locator('[data-edition-key="daitang:T08n0251"] button').first.click()
        page.wait_for_function('Reader.state.ready')
        assert page.evaluate('Reader.state.key')=='daitang:T08n0251'
        page.locator('#reader-close').click()
        assert page.url.endswith('#tang-dai-thua/kinh/bat-nha')
        page.locator('#global-search').fill('');page.wait_for_timeout(250)
        first=page.locator('#tab-tang-dai-thua .content-book').first.get_attribute('data-work-key')
        page.locator('#tab-tang-dai-thua .content-pagination button').last.click()
        assert page.locator('#tab-tang-dai-thua .content-book').first.get_attribute('data-work-key')!=first
        page.locator('#global-search').fill('tam kinh');page.wait_for_timeout(250)
        assert page.evaluate('appState.currentTab')=='tang-dai-thua'
        assert page.locator('#tab-tang-dai-thua .content-book').count()>0
        page.locator('#global-search').fill('<script>');page.wait_for_timeout(250)
        assert page.locator('#tab-tang-dai-thua .content-empty').is_visible()
        page.locator('#global-search').fill('');page.wait_for_timeout(250)
        page.reload(wait_until='networkidle')
        assert page.url.endswith('#tang-dai-thua/kinh/bat-nha')
        page.locator('#tab-tang-dai-thua .content-related button').filter(has_text='Giảng giải').click()
        assert page.url.endswith('#tang-dai-thua/chu-giai/bat-nha')
        checks.append('Same-code editions grouped and selectable; commentary links, scoped search, pagination and reload work')

        page.evaluate('ContentModules.go("tang-nam-tong",["kinh","truong-bo"])')
        page.locator('#tab-tang-nam-tong [data-content-read]').first.click()
        page.wait_for_function('Reader.state.ready')
        assert page.locator('#reader-listen-toggle').is_visible()
        assert page.evaluate('typeof ReadingWorkspace')=='undefined'
        assert page.locator('.reader-experience-bar, #reading-audio-dock').count()==0
        page.screenshot(path=str(OUT/'reader-unchanged.png'))
        page.locator('#reader-close').click()
        assert page.url.endswith('#tang-nam-tong/kinh/truong-bo')
        page.evaluate('ContentModules.go("tang-han",["kinh","mat-giao"])')
        page.select_option('#tab-tang-han .content-toolbar select','han')
        # The 11/10 search-actions release keeps unavailable listening visible with a reason.
        assert page.locator('#tab-tang-han [data-content-listen]').count()>0
        assert page.locator('#tab-tang-han [data-content-listen]:not(:disabled)').count()==0
        page.locator('#tab-tang-han [data-content-read]').first.click()
        page.wait_for_function('Reader.state.ready')
        assert page.evaluate('Reader.state.mode')=='han'
        page.locator('#reader-close').click()
        checks.append('Original reader, group return and Hán-only opening preserved')

        for old,new in [('kinh-pali/truong-bo','tang-nam-tong/kinh/truong-bo'),('kinh-dai-thua/bat-nha/kinh','tang-dai-thua/kinh/bat-nha'),('kinh-aham/trung-aham','tang-han/kinh/a-ham/trung-aham')]:
            page.goto(URL+'#'+old,wait_until='networkidle')
            page.wait_for_url('**#'+new)
            assert page.url.endswith('#'+new),(old,page.url)
        page.evaluate('ContentModules.go("tang-dai-thua",["kinh","bat-nha"])')
        playing_key=page.locator('#tab-tang-dai-thua [data-content-listen]').first.get_attribute('data-content-listen')
        page.locator('#tab-tang-dai-thua [data-content-listen]').first.click()
        page.wait_for_function('Audiobook.state.status === "playing"')
        for module in ['tang-han','tang-nam-tong','tang-dai-thua']:
            page.evaluate('(id)=>ContentModules.go(id,[])',module)
            assert page.evaluate('Audiobook.state.key')==playing_key
            assert page.evaluate('Audiobook.state.status')=='playing'
        page.evaluate('Audiobook.pause()')
        checks.append('Old module URLs redirect and playback survives all three trees')

        page.evaluate('switchTab("phucminh")')
        assert page.locator('#pm-books .pm-card').count()==26
        pm_titles=page.locator('#pm-books h3').all_text_contents();assert len(pm_titles)==26
        assert page.locator('#tab-phucminh .content-tree-shell').count()==0
        for module in ['tang-han','tang-dai-thua','tang-nam-tong']:
            page.evaluate('(id)=>ContentModules.go(id,["tu-lieu-chung","doi-song"])',module)
            assert page.locator('#tab-'+module+' .content-book').count()>0
        page.evaluate('switchTab("phucminh")');assert page.locator('#pm-books h3').all_text_contents()==pm_titles
        checks.append('Shared resources accessible from all trees; original 26-book Phuc Minh module unchanged')

        for width in [1440,1024,768,390,320]:
            page.set_viewport_size({'width':width,'height':900})
            for theme in ['parchment','amber','night']:
                page.evaluate('(t)=>setTheme(t)',theme)
                for module in ['home','tang-han','tang-dai-thua','tang-nam-tong','phucminh']:
                    page.evaluate('(id)=>id.startsWith("tang-")?ContentModules.go(id,[]):switchTab(id)',module)
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,theme,module)
                page.evaluate('ContentModules.go("tang-dai-thua",["kinh","bat-nha"])')
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,theme,'books')
            page.screenshot(path=str(OUT/f'books-{width}.png'))
        page.set_viewport_size({'width':390,'height':844})
        page.locator('#library-menu-toggle').click();page.locator('#library-menu #nav-tang-han').click()
        assert not page.locator('#library-menu').evaluate('(el)=>el.open')
        assert not page.locator('#tab-tang-han .content-tree-shell').evaluate('(el)=>el.open')
        page.locator('#tab-tang-han .content-tree-shell > summary').click()
        page.locator('#tab-tang-han [data-tree-path="tang-han/kinh"]').click()
        assert page.url.endswith('#tang-han/kinh')
        page.locator('#library-menu-toggle').click()
        page.locator('#library-menu .content-mobile-sources > summary').click()
        page.locator('#library-menu #nav-daitanghan').click()
        assert page.evaluate('appState.currentTab')=='daitanghan'
        checks.append('Five widths × three themes: no horizontal overflow; mobile tree, menus and source archive work')
        page.evaluate('setTheme("parchment");switchTab("home");document.querySelector(".content-source-nav").open=false');page.screenshot(path=str(OUT/'home-mobile.png'))
        page.set_viewport_size({'width':1440,'height':1000});page.evaluate('switchTab("home")');page.screenshot(path=str(OUT/'home-desktop.png'))
        assert not errors,errors
        browser.close()
    if fingerprints:
        assert all(hashlib.sha256((ROOT/f).read_bytes()).hexdigest()==digest for f,digest in fingerprints.items())
        checks.append('Current reader, audio and Phuc Minh source fingerprints unchanged during this test')
    report={'checks':checks,'coverage':coverage,'browserErrors':errors,'preservedSourceHashes':fingerprints}
    (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))


if __name__=='__main__':
    main()

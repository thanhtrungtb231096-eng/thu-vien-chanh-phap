"""End-to-end acceptance of module heroes and the source-aware learning workspace."""
from pathlib import Path
import json
import os
import sys
import threading

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'local/runtime/python'), str(ROOT / 'tests'), str(ROOT / 'app')]
from playwright.sync_api import sync_playwright
from test_spotify_player import fixture_audio
from read_listen_continuity_check import server, Quiet

sys.stdout.reconfigure(encoding='utf-8')
URL = os.environ.get('DHARMA_TEST_URL')
OUT = ROOT / 'tests/artifacts/module-study-20261011'


def main():
    global URL
    http=None
    if not URL:
        http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet)
        http.allowed_patterns=set()
        threading.Thread(target=http.serve_forever,daemon=True).start()
        URL=f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html'
    OUT.mkdir(parents=True, exist_ok=True)
    manifest=json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))
    result = {'version':manifest['version'],'checks':[], 'pageErrors':[], 'passed':False}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH',r'C:\Program Files\Google\Chrome\Application\chrome.exe'), headless=True)
        context = browser.new_context(viewport={'width':1440,'height':1000}, service_workers='block', reduced_motion='reduce')
        context.route('**/api/voices',lambda r:r.fulfill(json={'available':True,'offlineAvailable':True,'voices':[],'offlineVoices':[{'id':'vieneu-thuc-doan','name':'Thục Đoan'}]}))
        context.route('**/api/tts',lambda r:r.fulfill(body=fixture_audio(), content_type='audio/wav'))
        page=context.new_page()
        page.on('pageerror',lambda error:result['pageErrors'].append(str(error)))
        try:
            page.goto(URL,wait_until='networkidle')
            page.wait_for_selector('.cp-home-link')
            data=page.evaluate('''() => {
              const d=LearningPathData,lessons=d.tracks.flatMap(t=>t.lessons);
              return {tracks:d.tracks.length,lessons:lessons.length,sources:Object.keys(d.sources).length,
                missing:lessons.flatMap(l=>l.sources.filter(k=>!d.sources[k])),
                invalid:lessons.filter(l=>l.check||l.reflection||l.meaning.length<2||l.life.paragraphs.length<2||l.application.length<2||!l.takeaway||!l.reading).map(l=>l.id),
                unlinked:Object.values(d.sources).filter(s=>s.local&&!LibraryCatalog.get(s.local)).map(s=>s.local),
                missingTaisho:Object.values(d.sources).filter(s=>s.taisho&&!LearningPath.localEditions(s).length).map(s=>s.taisho)};
            }''')
            assert data['tracks']==7 and data['lessons']==41 and data['sources']==30, data
            assert not any(data[k] for k in ['missing','invalid','unlinked','missingTaisho']),data
            result['content']=data
            result['checks'].append('41 lessons in 7 tracks: complete learning fields, 30 source references and local edition IDs resolved')

            # Every static tool plus the dynamic catalogue trees gets an introduction.
            hero_ids=page.evaluate('Object.keys(ModulePresentation.definitions)')
            for module in hero_ids:
                if module=='daily':
                    page.locator('[data-dharma-nav="daily"]').click()
                elif module.startswith('tang-'):
                    page.evaluate('(id)=>ContentModules.go(id)',module)
                else:
                    page.evaluate('(id)=>switchTab(id)',module)
                page.wait_for_selector('#tab-'+module+' .cp-module-hero')
                assert page.locator('#tab-'+module+' .cp-module-hero').count()==1,module
                assert page.locator('#tab-'+module+' .cp-module-hero h1').inner_text().strip(),module
            assert page.locator('#daily-play').count()==1
            page.evaluate("switchTab('listening-history'); ListeningHistory.refresh()")
            assert page.locator('#lh-summary').inner_text()
            result['checks'].append('23 shared module heroes plus home; rebuilt tree views, daily playlists and listening history retain existing actions and IDs')

            page.evaluate('LearningPath.navigate()')
            assert page.locator('.lp-track-card').count()==7
            page.select_option('#lp-goal','nen-tang')
            page.select_option('#lp-budget','15')
            page.click('#lp-recommend')
            assert page.url.endswith('#paths/nen-tang/nguon-kinh')
            assert page.locator('#lp-lesson-title').inner_text()=='Nhận biết kinh sách trước khi đọc'
            assert page.locator('input[name="lp-answer"], [data-lp-completion], #lp-quiz-section').count()==0
            assert page.locator('#lp-life-section').is_visible()
            assert not page.locator('#lp-note').is_visible()
            page.locator('#lp-diary-section summary').click()
            note='Tôi đã đọc nguồn. <script>window.unwanted=1</script>\nTôi còn muốn tìm hiểu xuất xứ.'
            page.fill('#lp-note',note)
            page.click('#lp-save-note')
            page.click('#lp-complete')
            assert 'Đã ghi nhận' in page.locator('#lp-completion-status').inner_text()
            assert page.locator('.lp-progress-label').inner_text().startswith('1/8')
            page.reload(wait_until='networkidle')
            assert page.url.endswith('#paths/nen-tang/nguon-kinh')
            assert page.input_value('#lp-note')==note
            assert page.evaluate('window.unwanted') is None
            assert page.locator('#lp-complete').inner_text()=='✓ Đã đánh dấu đọc'
            page.click('#lp-complete')
            assert page.input_value('#lp-note')==note
            page.fill('#lp-note','Bản nháp chưa lưu')
            page.evaluate("LearningPath.navigate('nen-tang','gioi-hanh')")
            page.go_back()
            page.wait_for_function("LearningPath.selection.lesson==='nguon-kinh'")
            assert page.input_value('#lp-note')=='Bản nháp chưa lưu'
            page.go_forward()
            page.wait_for_function("LearningPath.selection.lesson==='gioi-hanh'")
            result['checks'].append('Narrative reading replaces quizzes/checklists; optional escaped notes, read markers, drafts and reload/Back/Forward persist')

            # Read the actual source edition, then return to the same lesson.
            page.evaluate("LearningPath.navigate('nen-tang','bon-su-that')")
            page.locator('.lp-editions summary').first.click()
            page.locator('.lp-edition-actions button').first.click()
            page.wait_for_selector('#reader-view-container.active')
            page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.state.key')=='ebooks:ep-3ed87cd4333e'
            page.evaluate('Reader.close()')
            page.wait_for_selector('#lp-lesson-title')
            assert page.locator('#lp-lesson-title').inner_text()=='Bốn sự thật và con đường thực hành'
            assert page.url.endswith('#paths/nen-tang/bon-su-that'),page.url
            page.evaluate("LearningPath.navigate('dai-thua','tam-kinh')")
            page.locator('.lp-editions summary').first.click()
            assert page.locator('.lp-edition-actions button').count()>=2
            page.locator('.lp-edition-actions button').first.click()
            page.wait_for_function("Reader.state.ready && Reader.state.item.data.taishoId==='T08n0251'")
            page.evaluate('Reader.close()')
            result['checks'].append('Source actions open the real Chuyển Pháp Luân and Tâm Kinh editions and return to the selected lesson')

            page.evaluate("LearningPath.navigate('nen-tang','giu-nhip')")
            page.get_by_role('button',name='Tạo thời khóa từ lộ trình',exact=True).click()
            page.wait_for_selector('#tab-study',state='visible')
            plan=page.evaluate("LibraryStore.read('study-plans',[]).find(p=>p.name==='Tu học · Nền tảng tu học')")
            assert plan and plan['minutes']==15 and plan['days']==56 and len(plan['books'])>=4,plan
            assert len(plan['books'])==len(set(plan['books']))
            page.evaluate("LearningPath.navigate('nen-tang','giu-nhip')")
            page.get_by_role('button',name='Tạo thời khóa từ lộ trình',exact=True).click()
            assert page.evaluate("LibraryStore.read('study-plans',[]).filter(p=>p.name==='Tu học · Nền tảng tu học').length")==1
            page.evaluate("LearningPath.navigate('nen-tang','nguon-kinh')")
            with page.expect_download() as event:
                page.get_by_role('button',name='Xuất nhật ký & tiến độ',exact=True).click()
            download=event.value;download.save_as(OUT/'journal.json')
            exported=json.loads((OUT/'journal.json').read_text(encoding='utf-8'))
            assert exported['format']=='chanh-phap-learning' and len(exported['notes'])==8
            assert exported['notes'][0]['text']=='Bản nháp chưa lưu'
            result['checks'].append('15-minute preference creates one reusable 56-day schedule with deduplicated real books; exported journal includes draft and progress')

            # Walk every lesson and all small/large viewports in all three themes.
            for track in page.evaluate('LearningPathData.tracks.map(t=>({id:t.id,lessons:t.lessons.map(l=>l.id)}))'):
                for lesson in track['lessons']:
                    page.evaluate('([t,l])=>LearningPath.navigate(t,l)',[track['id'],lesson])
                    assert page.locator('.lp-source-card').count()>=1
                    assert page.locator('input[name="lp-answer"], [data-lp-completion], #lp-quiz-section').count()==0
                    assert page.locator('#lp-life-section p').count()>=2
                    assert page.locator('#lp-practice-section p').count()==2
                    assert page.locator('.lp-takeaway').is_visible()
            layouts=[]
            for width in [320,390,768,1440,1920]:
                page.set_viewport_size({'width':width,'height':1000})
                for theme in ['parchment','amber','night']:
                    page.evaluate('(t)=>setTheme(t)',theme)
                    for route in ['overview','lesson','tree']:
                        if route=='overview':page.evaluate('LearningPath.navigate()')
                        elif route=='lesson':page.evaluate("LearningPath.navigate('nen-tang','nguon-kinh')")
                        else:page.evaluate("ContentModules.go('tang-han',['kinh','bat-nha'])")
                        page.wait_for_timeout(80)
                        overflow=page.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
                        assert not overflow,(width,theme,route)
                        headings=page.locator('.tab-panel:visible .cp-module-hero h1')
                        assert headings.count()==1
                        bounds=headings.bounding_box();assert bounds['x']>=0 and bounds['x']+bounds['width']<=width+1,(width,theme,route,bounds)
                        layouts.append([width,theme,route])
                page.evaluate("setTheme('parchment');LearningPath.navigate()")
                if width in [390,1440]:page.screenshot(path=str(OUT/f'paths-{width}.png'),full_page=True)
                page.evaluate("LearningPath.navigate('nen-tang','nguon-kinh')")
                if width in [390,1440]:page.screenshot(path=str(OUT/f'lesson-{width}.png'),full_page=True)
            result['layouts']=layouts
            result['checks'].append('All 41 lessons rendered; overview, lesson and catalogue hero fit 320/390/768/1440/1920 px in three themes (45 layouts)')

            hero_layouts=0
            for width in [320,390,768,1440,1920]:
                page.set_viewport_size({'width':width,'height':1000})
                for theme in ['parchment','amber','night']:
                    page.evaluate('(t)=>setTheme(t)',theme)
                    for module in hero_ids:
                        page.evaluate('(id)=>switchTab(id)',module)
                        bounds=page.locator('#tab-'+module+' .cp-module-hero').bounding_box()
                        assert bounds and bounds['x']>=0 and bounds['x']+bounds['width']<=width+1,(width,theme,module,bounds)
                        assert page.locator('#tab-'+module+' .cp-module-hero').evaluate('(el)=>el.scrollWidth <= el.clientWidth + 1'),(width,theme,module)
                        hero_layouts+=1
            result['heroLayouts']=hero_layouts
            result['checks'].append(f'All {len(hero_ids)} shared module heroes stay within viewport and contain their content at five widths in three themes ({hero_layouts} hero layouts)')

            page.set_viewport_size({'width':390,'height':1000})
            page.evaluate('LearningPath.navigate()')
            page.click('#library-menu-toggle')
            page.click('#nav-paths')
            assert not page.locator('#library-menu').evaluate('(d)=>d.open')
            assert page.url.endswith('#paths')
            assert page.locator('#nav-paths').get_attribute('aria-selected')=='true'
            page.goto(URL+'#paths/no-such-track/no-such-lesson',wait_until='networkidle')
            assert page.locator('.lp-track-card').count()==7
            page.goto(URL+'#paths/tinh-do/ba-kinh',wait_until='networkidle')
            assert 'ba kinh' in page.locator('#lp-lesson-title').inner_text()
            page.evaluate("location.hash='#paths/nen-tang/no-such-lesson'")
            page.wait_for_url('**#paths/nen-tang/nguon-kinh')
            assert page.locator('#lp-lesson-title').inner_text()=='Nhận biết kinh sách trước khi đọc'
            result['checks'].append('Mobile menu closes and selects learning page; malformed IDs fall back to overview; direct lesson URL reloads correctly')
            assert not result['pageErrors'],result['pageErrors']
            result['passed']=True
        finally:
            (OUT/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
            browser.close()
            if http:
                http.shutdown()
                http.server_close()
    print(json.dumps(result,ensure_ascii=False))


if __name__=='__main__':main()

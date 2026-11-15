"""Acceptance of deep scripture profiles, discovery, saved study state and reading controls."""
from pathlib import Path
import json,os,sys,threading

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'local/runtime/python'),str(ROOT/'tests'),str(ROOT/'app')]
from playwright.sync_api import sync_playwright
from read_listen_continuity_check import server,Quiet
OUT=ROOT/'tests/artifacts/learning-depth-20261011'


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
    threading.Thread(target=http.serve_forever,daemon=True).start()
    url=f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html'
    version=json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))['version']
    result={'version':version,'checks':[],'pageErrors':[],'passed':False}
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH',r'C:\Program Files\Google\Chrome\Application\chrome.exe'),headless=True)
        context=browser.new_context(viewport={'width':1440,'height':1050},service_workers='block')
        page=context.new_page();page.on('pageerror',lambda e:result['pageErrors'].append(str(e)))
        try:
            # Seed real v1 record IDs before opening the new curriculum.
            page.goto(url,wait_until='networkidle')
            page.evaluate('''() => {
              LibraryStore.write('learning-note:nen-tang:nguon-kinh',{id:'nen-tang:nguon-kinh',text:'Ghi chép từ lộ trình phiên bản đầu'});
              LibraryStore.write('learning-completions',[{id:'nen-tang:nguon-kinh',track:'nen-tang',lesson:'nguon-kinh',done:true,checks:[0,1,2]}]);
              LearningPath.navigate();
            }''')
            data=page.evaluate('''() => {
              const d=LearningPathData,lessons=d.tracks.flatMap(t=>t.lessons),profiles=Object.entries(d.sources).filter(([k,s])=>s.study);
              return {tracks:d.tracks.length,lessons:lessons.length,sources:Object.keys(d.sources).length,profiles:profiles.length,
                ids:profiles.map(([k])=>k),duplicateLessons:d.tracks.filter(t=>new Set(t.lessons.map(l=>l.id)).size!==t.lessons.length).map(t=>t.id),
                missing:lessons.filter(l=>!l.why||l.meaning.length<2||l.life.paragraphs.length<2||l.application.length<2||l.check||l.reflection||l.sources.some(k=>!d.sources[k])||(l.narrative&&!l.sources.includes(d.narratives[l.narrative].source))).map(l=>l.id),
                stories:Object.values(d.narratives).filter(s=>!d.sources[s.source]||!s.location||s.paragraphs.length!==2).map(s=>s.title),
                shallow:profiles.filter(([k,s])=>s.study.map.length<3||s.study.essentials.length<3||s.study.meaning.length<2||s.study.terms.length<3||s.study.mistakes.length<2||!s.study.application).map(([k])=>k)};
            }''')
            assert [data[k] for k in ['tracks','lessons','sources','profiles']]==[7,41,30,26],data
            assert not any(data[k] for k in ['duplicateLessons','missing','shallow','stories']),data
            result['content']=data
            assert page.locator('.lp-total-progress strong').inner_text().startswith('1')
            page.evaluate("LearningPath.navigate('nen-tang','nguon-kinh')")
            assert page.input_value('#lp-note')=='Ghi chép từ lộ trình phiên bản đầu'
            assert page.locator('#lp-complete').inner_text()=='✓ Đã đánh dấu đọc'
            result['checks'].append('7 tracks, 41 lessons, 30 sources and 26 complete profiles; v1 journals and completed IDs preserved')

            # Controls must not replace the live note field or erase its draft.
            page.fill('#lp-note','Bản nháp khi đổi cỡ chữ')
            before=page.locator('.lp-importance p').evaluate('(el)=>parseFloat(getComputedStyle(el).fontSize)')
            page.select_option('#lp-text-size','extra')
            assert page.locator('.lp-importance p').evaluate('(el)=>parseFloat(getComputedStyle(el).fontSize)')>before
            page.click('#lp-focus')
            assert not page.locator('.lp-outline').is_visible()
            assert page.input_value('#lp-note')=='Bản nháp khi đổi cỡ chữ'
            page.locator('.lp-lesson-actions .lp-save-button').click()
            assert page.locator('.lp-lesson-actions .lp-save-button').get_attribute('aria-pressed')=='true'
            page.click('#lp-save-note')
            page.reload(wait_until='networkidle')
            assert page.input_value('#lp-note')=='Bản nháp khi đổi cỡ chữ'
            assert page.input_value('#lp-text-size')=='extra'
            assert not page.locator('.lp-outline').is_visible()
            assert page.locator('.lp-lesson-actions .lp-save-button').get_attribute('aria-pressed')=='true'
            page.get_by_role('button',name='Ghi chép riêng',exact=True).click()
            assert page.evaluate('document.activeElement.id')=='lp-diary-section'
            bounds=page.locator('#lp-diary-section h3').bounding_box()
            toolbar=page.locator('.lp-view-toolbar').bounding_box()
            assert bounds['y']>=toolbar['y']+toolbar['height']-1,(bounds,toolbar)
            page.click('#lp-focus');page.select_option('#lp-text-size','standard')
            result['checks'].append('Reading font/focus/bookmark persist without losing drafts; quick navigation focuses an unobscured section')

            page.evaluate('LearningPath.navigate()')
            assert page.locator('#lp-resume').inner_text().find('Nhận biết kinh sách')>=0
            page.locator('#lp-resume button').click()
            assert page.url.endswith('#paths/nen-tang/nguon-kinh')
            page.evaluate('LearningPath.navigate()')
            assert page.locator('.lp-discovery-card').count()==8
            page.click('#lp-load-more');assert page.locator('.lp-discovery-card').count()==16
            page.fill('#lp-search','loi noi')
            assert page.locator('.lp-discovery-card').count()>=1
            page.fill('#lp-search','zz-no-such-topic')
            assert page.locator('.lp-empty').is_visible()
            assert not page.locator('#lp-load-more').is_visible()
            page.fill('#lp-search','');page.check('#lp-only-saved')
            assert page.locator('.lp-discovery-card').count()==1
            assert 'Nhận biết kinh sách' in page.locator('.lp-discovery-card h3').inner_text()
            page.uncheck('#lp-only-saved')
            page.click('#lp-scriptures-tab');page.fill('#lp-search','tam kinh')
            assert page.locator('.lp-discovery-card').count()==1
            assert page.locator('.lp-discovery-card h3').inner_text()=='Bát Nhã Tâm Kinh'
            page.locator('.lp-discovery-card .lp-save-button').click()
            page.locator('.lp-discovery-card .r-button').first.click()
            assert page.url.endswith('#paths/kinh/heart')
            assert page.locator('.lp-source-depth').evaluate('(el)=>el.open')
            assert page.locator('.lp-essentials .lp-meaning-block').count()==3
            page.get_by_role('button',name='Thuật ngữ trong văn cảnh',exact=True).click()
            assert page.evaluate('document.activeElement.id').startswith('lp-profile-section-')
            page.reload(wait_until='networkidle')
            assert page.locator('#lp-source-title').inner_text()=='Bát Nhã Tâm Kinh'
            assert page.locator('.lp-source-actions .lp-save-button').get_attribute('aria-pressed')=='true'
            result['checks'].append('Resume, pagination, accent-insensitive discovery, saved filter and direct scripture profile reload work')

            page.locator('.lp-editions summary').click();page.locator('.lp-edition-actions button').first.click()
            page.wait_for_function("Reader.state.ready && Reader.state.item.data.taishoId==='T08n0251'")
            page.evaluate('Reader.close()')
            assert page.url.endswith('#paths/kinh/heart')
            page.locator('.lp-related-links button').first.click()
            assert page.locator('#lp-lesson-title').is_visible()
            page.go_back();page.wait_for_selector('#lp-source-title')
            assert page.url.endswith('#paths/kinh/heart')
            page.go_forward();page.wait_for_selector('#lp-lesson-title')
            for key in data['ids']:
                page.evaluate('(key)=>LearningPath.navigateSource(key)',key)
                assert page.locator('.lp-terms dt').count()>=3
                assert page.locator('.lp-misconception').count()>=2
                assert page.locator('.lp-essentials').is_visible()
                assert page.locator('.lp-related-links button').count()>=1
            result['checks'].append('All 26 profiles render with related lessons; source opens real edition and returns; profile/lesson Back and Forward work')

            # Storage rejection must leave the bookmark false and report failure.
            page.evaluate("() => {LearningPath.navigateSource('thought');window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('quota');};}")
            page.locator('.lp-source-actions .lp-save-button').click()
            assert page.locator('.lp-source-actions .lp-save-button').get_attribute('aria-pressed')=='false'
            assert 'Chưa lưu' in page.locator('#lp-global-status').inner_text()
            page.evaluate('() => {Storage.prototype.setItem=window.originalSetItem;}')
            page.evaluate('LearningPath.navigate()');page.click('#lp-scriptures-tab')
            page.locator('#lp-scriptures-tab').focus();page.keyboard.press('ArrowLeft')
            assert page.locator('#lp-lessons-tab').get_attribute('aria-selected')=='true'
            assert page.evaluate('document.activeElement.id')=='lp-lessons-tab'
            result['checks'].append('Storage failures do not claim saved state; discovery tabs support keyboard navigation')

            layouts=[]
            for width in [320,390,768,1440,1920]:
                page.set_viewport_size({'width':width,'height':1050})
                for theme in ['parchment','amber','night']:
                    page.evaluate('(t)=>setTheme(t)',theme)
                    for route in ['overview','lesson','scripture']:
                        if route=='overview':page.evaluate('LearningPath.navigate()')
                        elif route=='lesson':page.evaluate("LearningPath.navigate('cu-si','chanh-ngu')")
                        else:page.evaluate("LearningPath.navigateSource('breathing')")
                        page.select_option('#lp-text-size','extra')
                        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),(width,theme,route)
                        assert not page.locator('.lp-workspace').evaluate('(el)=>el.scrollWidth>el.clientWidth+1'),(width,theme,route)
                        layouts.append([width,theme,route])
                page.evaluate("setTheme('parchment')");page.select_option('#lp-text-size','standard')
                if width in [390,1440]:
                    page.evaluate('LearningPath.navigate()');page.screenshot(path=str(OUT/f'overview-{width}.png'),full_page=True)
                    page.evaluate("LearningPath.navigate('cu-si','chanh-ngu')");page.screenshot(path=str(OUT/f'lesson-{width}.png'),full_page=True)
                    page.evaluate("LearningPath.navigateSource('heart')");page.screenshot(path=str(OUT/f'scripture-{width}.png'),full_page=True)
            result['layouts']=layouts
            result['checks'].append('45 layouts: overview, lesson and expanded profile at five widths, three themes and largest text fit the screen')
            assert not result['pageErrors'],result['pageErrors'];result['passed']=True
        finally:
            (OUT/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
            browser.close();http.shutdown();http.server_close()
    print(json.dumps(result,ensure_ascii=False))


if __name__=='__main__':main()

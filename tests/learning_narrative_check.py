"""Verify attribution, unrestricted reading and the revised Vietnamese reading interface."""
from pathlib import Path
import json, os, sys, threading

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT/'local/runtime/python'), str(ROOT/'tests'), str(ROOT/'app')]
from playwright.sync_api import sync_playwright
from read_listen_continuity_check import server, Quiet


def main():
    out = ROOT/'tests/artifacts/learning-narrative-20261011'
    out.mkdir(parents=True, exist_ok=True)
    http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
    http.allowed_patterns = set()
    threading.Thread(target=http.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html'
    version = json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))['version']
    result = {'version':version, 'checks':[], 'pageErrors':[], 'passed':False}
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH',r'C:\Program Files\Google\Chrome\Application\chrome.exe'),headless=True)
            context = browser.new_context(viewport={'width':1440,'height':1000},service_workers='block')
            page = context.new_page()
            page.on('pageerror',lambda e:result['pageErrors'].append(str(e)))
            page.goto(url+'#paths/cu-si/chanh-ngu',wait_until='networkidle')
            assert page.locator('#lp-context-section h3').inner_text() == 'Giải nghĩa và chiều sâu tu học'
            assert page.locator('#lp-life-section').inner_text().find('nhân vật hư cấu') >= 0
            assert page.locator('#lp-note').input_value() == ''
            assert not page.locator('#lp-note').is_visible()
            assert page.locator('input[type="radio"], [data-lp-completion], #lp-quiz-section').count() == 0
            page.click('#lp-complete')
            assert page.locator('#lp-complete').get_attribute('aria-pressed') == 'true'
            assert page.locator('#lp-note').input_value() == ''
            page.click('#lp-complete')
            assert page.locator('#lp-complete').get_attribute('aria-pressed') == 'false'
            assert page.locator('#lp-context-section').is_visible()
            result['checks'].append('Vietnamese text is intact; essays open freely; empty optional notes and read marks require no assessment')

            pairs = page.evaluate('''() => LearningPathData.tracks.flatMap(t=>t.lessons.filter(l=>l.narrative).map(l=>({track:t.id,lesson:l.id,key:l.narrative})))''')
            checked = set()
            for row in pairs:
                if row['key'] in checked: continue
                page.evaluate('r=>LearningPath.navigate(r.track,r.lesson)',row)
                story = page.evaluate('k=>LearningPathData.narratives[k]',row['key'])
                assert story['location'] in page.locator('#lp-canonical-section footer').inner_text()
                page.locator('.lp-story-source button').click()
                assert page.url.endswith('#paths/kinh/'+story['source'])
                assert story['title'] in page.locator('.lp-profile-stories').inner_text()
                page.go_back()
                page.wait_for_selector('#lp-canonical-section')
                assert page.url.endswith('#paths/'+row['track']+'/'+row['lesson'])
                checked.add(row['key'])
            assert len(checked) == 8
            result['canonicalStories'] = sorted(checked)
            result['checks'].append('All eight canonical retellings identify a passage and open the matching scripture profile; Back restores the essay')

            page.evaluate("LearningPath.navigate('nen-tang','nguon-kinh')")
            page.get_by_role('button',name='Ghi chép riêng',exact=True).click()
            page.fill('#lp-note','Bản nháp được giữ khi đánh dấu đọc')
            page.click('#lp-complete')
            assert page.input_value('#lp-note') == 'Bản nháp được giữ khi đánh dấu đọc'
            result['checks'].append('Read marking preserves an unsaved private draft')

            jumps=[]
            for width in [320,390,768,1440]:
                page.set_viewport_size({'width':width,'height':1000})
                for size in ['standard','extra']:
                    page.evaluate("LearningPath.navigate('cu-si','chanh-ngu')")
                    page.select_option('#lp-text-size',size)
                    # A saved-state message can increase the sticky toolbar height.
                    page.locator('.lp-lesson-actions .lp-save-button').click()
                    for label in ['Giải nghĩa','Chuyện trong kinh','Câu chuyện đời sống','Ứng dụng','Nguồn đọc','Ghi chép riêng']:
                        page.get_by_role('button',name=label,exact=True).click()
                        bounds=page.evaluate('''() => ({section:document.activeElement.getBoundingClientRect().top,toolbar:document.querySelector('.lp-view-toolbar').getBoundingClientRect().bottom})''')
                        assert bounds['section'] >= bounds['toolbar']+15,(width,size,label,bounds)
                        jumps.append([width,size,label])
                    page.evaluate("LearningPath.navigateSource('heart')")
                    assert page.locator('.lp-source-card h5, .lp-source-card h6').count()==0
                    for label in ['Giải nghĩa trọng yếu','Thuật ngữ trong văn cảnh','Từ kinh đến đời sống']:
                        page.get_by_role('button',name=label,exact=True).click()
                        bounds=page.evaluate('''() => ({section:document.activeElement.getBoundingClientRect().top,toolbar:document.querySelector('.lp-view-toolbar').getBoundingClientRect().bottom})''')
                        assert bounds['section'] >= bounds['toolbar']+15,(width,size,label,bounds)
                        jumps.append([width,size,label])
            result['jumps']=jumps
            result['checks'].append('72 section jumps keep all content below the sticky toolbar at four widths and two text sizes; scripture headings use h2/h3/h4')

            for width in [390,1440]:
                page.set_viewport_size({'width':width,'height':1000})
                page.evaluate("setTheme('parchment');LearningPath.navigate('cu-si','chanh-ngu')")
                page.select_option('#lp-text-size','standard')
                page.evaluate('scrollTo(0,0)')
                if width == 390:
                    assert not page.locator('.lp-outline-wrap').evaluate('(el)=>el.open')
                    assert page.locator('#lp-lesson-title').bounding_box()['y'] < 1000
                    page.locator('.lp-outline-wrap summary').click()
                    assert page.locator('.lp-outline-item').first.is_visible()
                    page.locator('.lp-outline-wrap summary').click()
                page.screenshot(path=str(out/f'lesson-{width}.png'))
                page.get_by_role('button',name='Câu chuyện đời sống',exact=True).click()
                assert page.evaluate('document.activeElement.id') == 'lp-life-section'
                page.screenshot(path=str(out/f'story-{width}.png'))
                assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
            assert not result['pageErrors'],result['pageErrors']
            result['passed'] = True
            browser.close()
    finally:
        (out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
        http.shutdown()
        http.server_close()
    print(json.dumps(result,ensure_ascii=False))


if __name__ == '__main__': main()

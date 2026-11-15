"""Install the real shell, then cold-load expanded learning content without a network."""
from pathlib import Path
import json,os,sys,threading
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'local/runtime/python'),str(ROOT/'tests'),str(ROOT/'app')]
from playwright.sync_api import sync_playwright
from read_listen_continuity_check import server,Quiet


def main():
    http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
    threading.Thread(target=http.serve_forever,daemon=True).start()
    url=f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html'
    version=json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))['version']
    result={'version':version,'pageErrors':[],'passed':False}
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH',r'C:\Program Files\Google\Chrome\Application\chrome.exe'),headless=True)
            context=browser.new_context(service_workers='allow')
            page=context.new_page();page.on('pageerror',lambda e:result['pageErrors'].append(str(e)))
            page.goto(url+'#paths/cu-si/chanh-ngu',wait_until='networkidle')
            page.wait_for_function('(v)=>caches.has("cp-shell-"+v)',arg=version,timeout=45000)
            page.wait_for_function('!!navigator.serviceWorker.controller')
            page.locator('#lp-diary-section summary').click()
            page.fill('#lp-note','Nhật ký lộ trình mở rộng khi ngoại tuyến')
            page.click('#lp-save-note');page.select_option('#lp-text-size','large')
            page.locator('.lp-lesson-actions .lp-save-button').click()
            context.set_offline(True);page.reload(wait_until='networkidle')
            assert page.input_value('#lp-note')=='Nhật ký lộ trình mở rộng khi ngoại tuyến'
            assert page.input_value('#lp-text-size')=='large'
            assert page.locator('#lp-life-section p').count()>=2
            assert page.locator('input[name="lp-answer"], [data-lp-completion]').count()==0
            assert page.locator('.lp-lesson-actions .lp-save-button').get_attribute('aria-pressed')=='true'
            page.goto(url+'#paths/kinh/breathing',wait_until='networkidle')
            assert page.locator('#lp-source-title').inner_text()=='Kinh Niệm hơi thở'
            assert page.locator('.lp-essentials .lp-meaning-block').count()==4
            page.evaluate('LearningPath.navigate()');page.click('#lp-scriptures-tab');page.fill('#lp-search','MN 118')
            assert page.locator('.lp-discovery-card').count()==1
            page.evaluate("LearningPath.navigate('doc-tung','thoi-khoa-co-nghia')")
            assert page.locator('#lp-lesson-title').inner_text().startswith('Một thời khóa:')
            assert not result['pageErrors'],result['pageErrors']
            result.update(passed=True,checks=['Expanded lesson cold-loads with saved journal, bookmark and text preference','Direct scripture profile and all four breathing groups load offline','Discovery by scripture code and new reading/chanting track work offline'])
            browser.close()
    finally:
        folder=ROOT/'tests/artifacts/learning-depth-20261011';folder.mkdir(parents=True,exist_ok=True)
        (folder/'offline.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
        http.shutdown();http.server_close()
    print(json.dumps(result,ensure_ascii=False))


if __name__=='__main__':main()

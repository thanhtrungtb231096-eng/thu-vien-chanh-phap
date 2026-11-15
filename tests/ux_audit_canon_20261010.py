"""Inspect the three primary catalog trees and focused UX edge cases."""
import json
import threading
from ux_audit_20261010 import server, Quiet, NarrationEngine, unused, sync_playwright, OUT, OBSERVE


def main():
    memory = {}
    server.STREAM_ENGINE= NarrationEngine(memory.get,memory.__setitem__,unused,log_path=None)
    http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet)
    http.allowed_patterns=set()
    threading.Thread(target=http.serve_forever,daemon=True).start()
    result={'screens':{},'checks':{},'errors':[]}
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
            context=browser.new_context(viewport={'width':1440,'height':1000},service_workers='block',reduced_motion='reduce')
            context.route('**/api/voices',lambda r:r.fulfill(json={'available':False,'voices':[]}))
            page=context.new_page()
            page.on('pageerror',lambda e:result['errors'].append(str(e)))
            page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html',wait_until='networkidle')
            def shot(name):
                page.wait_for_timeout(500)
                page.screenshot(path=str(OUT/(name+'.png')))
                result['screens'][name]=page.evaluate(OBSERVE)
                print('Observed '+name,flush=True)
            for width in [1440,390]:
                page.set_viewport_size({'width':width,'height':1000 if width>600 else 844})
                for module in ['tang-han','tang-dai-thua','tang-nam-tong']:
                    page.evaluate('(id)=>ContentModules.go(id,[])',module)
                    shot(f'{module}-{width}')
            page.evaluate("ContentModules.go('tang-han',['kinh','a-ham','truong-aham'])")
            shot('canon-drill-390')
            page.locator('#global-search').fill('T01n0001')
            shot('canon-code-search-390')
            result['checks']['code-search']=page.locator('.tab-panel[style*="block"] .content-results-count').inner_text()
            page.locator('.tab-panel[style*="block"] [data-content-read]').first.click()
            page.wait_for_function('Reader.state.ready')
            shot('canon-real-reader-390')
            page.locator('#reader-close').click()
            # Disabled-speech state does not produce a fake online voice claim.
            page.set_viewport_size({'width':1440,'height':1000})
            page.evaluate("switchTab('fulltext')")
            result['checks']['global-placeholder']=page.locator('#global-search').get_attribute('placeholder')
            page.evaluate("switchTab('study')")
            result['checks']['study-option-count']=page.locator('#study-books option').count()
            page.evaluate("switchTab('shelf')")
            page.locator('#shelf-create-playlist').click()
            result['checks']['playlist-option-count']=page.locator('#ds-playlist-books option').count()
            result['checks']['playlist-has-other-collections']=page.evaluate("[...document.querySelectorAll('#ds-playlist-books option')].some(o=>!DAI_THUA_DATA.some(b=>b.id===o.value))")
            shot('playlist-1440')
            page.keyboard.press('Escape')
            page.evaluate("switchTab('settings')")
            # ARIA snapshot covers the actual accessible names of range controls.
            page.evaluate("document.getElementById('dp-settings').click()")
            result['checks']['options-aria']=page.locator('#dp-options').aria_snapshot()
            page.keyboard.press('Escape')
            browser.close()
    finally:
        http.shutdown()
        (OUT/'canon-observations.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'screens':len(result['screens']),'errors':result['errors'],'checks':result['checks']},ensure_ascii=False),flush=True)


if __name__=='__main__':main()

"""Read-only UX exploration of real library content; audio uses a local fixture.

Outputs observations and screenshots, not a WCAG conformance certification.
Run: python -X utf8 tests/ux_audit_20261010.py
"""
import json
import time
from pathlib import Path
import sys
import threading

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'tests'), str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
from read_listen_continuity_check import server, Quiet, NarrationEngine, unused, audio_fixture
from playwright.sync_api import sync_playwright

OUT = ROOT / 'tests/artifacts/ux-audit-20261010'
OUT.mkdir(parents=True, exist_ok=True)
OBSERVE = r"""() => {
  const visible = e => e.checkVisibility() && e.getBoundingClientRect().width > 0;
  const label = e => e.getAttribute('aria-label') ||
    (e.getAttribute('aria-labelledby') || '').split(' ').map(id => document.getElementById(id)?.textContent || '').join('') ||
    [...(e.labels || [])].map(x => x.textContent).join('') || e.textContent.trim() || e.title || '';
  const controls = [...document.querySelectorAll('button,a[href],input,select,textarea,[role=button]')].filter(visible).map(e => {
    const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return {id:e.id,tag:e.tagName,label:label(e).trim().slice(0,110),w:Math.round(r.width),h:Math.round(r.height),font:s.fontSize,x:Math.round(r.x),y:Math.round(r.y),disabled:!!e.disabled};
  });
  return {hash:location.hash,title:document.title,history:history.length,scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
    height:innerHeight,domNodes:document.querySelectorAll('*').length,bodyHeight:document.body.scrollHeight,
    visibleText:document.body.innerText.slice(0,18000),controls,
    unlabeled:controls.filter(x=>!x.label),small24:controls.filter(x=>!x.disabled&&(x.w<24||x.h<24)),
    small44:controls.filter(x=>!x.disabled&&(x.w<44||x.h<44)),
    invalidPanelLabels:[...document.querySelectorAll('[role=tabpanel]')].filter(visible).map(e=>({id:e.id,labelledby:e.getAttribute('aria-labelledby')})),
    dialog:document.querySelector('dialog[open]')?.id,
    focus:document.activeElement.id || document.activeElement.tagName,
    reader:window.Reader?.state.ready?{key:Reader.state.key,mode:Reader.state.mode,pages:Reader.pages.total,blocks:Reader.state.doc.blocks.length,font:Reader.pref.font}:null};
}"""


def main():
    memory = {}
    server.STREAM_ENGINE = NarrationEngine(memory.get, memory.__setitem__, unused, log_path=None)
    http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
    http.allowed_patterns = set()
    threading.Thread(target=http.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html'
    results = {'date':'2026-10-10','scope':'Local Chrome/Windows; real text; fixture audio; no user study or production load test','screens':{},'errors':[],'checks':{}}
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
            context = browser.new_context(viewport={'width':1440,'height':1000}, service_workers='block', reduced_motion='reduce')
            context.route('**/api/voices', lambda r:r.fulfill(json={'available':True,'voices':[{'id':'vi-VN-HoaiMyNeural','name':'Hoài My'},{'id':'vi-VN-NamMinhNeural','name':'Nam Minh'}],'audioConfig':{'startupBufferSeconds':0}}))
            context.route('**/api/tts', lambda r:r.fulfill(body=audio_fixture(40),content_type='audio/wav'))
            page = context.new_page()
            page.on('pageerror', lambda e:results['errors'].append(str(e)))
            page.goto(url,wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            results['resources'] = page.evaluate("performance.getEntriesByType('resource').map(e=>({name:e.name.split('/web-thuvien/')[1]||e.name,duration:e.duration,transfer:e.transferSize,decoded:e.decodedBodySize}))")
            def shot(name):
                page.wait_for_timeout(450)
                page.screenshot(path=str(OUT / (name+'.png')))
                results['screens'][name]=page.evaluate(OBSERVE)
                print('Observed '+name,flush=True)
            shot('home-1440')
            for tab in ['daithua','daitanghan','daitang','phucminh','fulltext','offline','settings','study','shelf','listening-history']:
                page.evaluate('(id)=>switchTab(id)',tab)
                page.wait_for_timeout(100)
                shot(tab+'-1440')
            # The catalog search and the full-text search are separate paths.
            for tab in ['home','daithua','daitanghan']:
                page.evaluate('(id)=>switchTab(id)',tab)
                page.locator('#global-search').fill('tâm kinh')
                page.wait_for_timeout(300)
                shot('title-search-'+tab)
                page.locator('#global-search').fill('')
            page.evaluate("switchTab('fulltext')")
            for i,q in enumerate(['chánh niệm','chanh niem','"chánh niệm"','zzxxqqkhongcotrongkinh']):
                page.locator('#fulltext-query').fill(q)
                started=time.perf_counter()
                page.locator('#fulltext-form button[type=submit]').click()
                page.wait_for_function("!document.getElementById('fulltext-status').textContent.startsWith('Đang tìm')",timeout=30000)
                results['checks']['fulltext-'+str(i)]={'query':q,'elapsed':round(time.perf_counter()-started,3),'status':page.locator('#fulltext-status').inner_text(),'results':page.locator('#fulltext-results > article').count()}
            shot('fulltext-empty-1440')
            # Open a real book, inspect reading, audio dock and settings.
            page.evaluate("switchTab('daithua')")
            page.locator('#daithua-grid-container .catalog-jacket').first.click()
            page.wait_for_selector('.album-track')
            shot('album-1440')
            page.evaluate("void Reader.open(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}),'viet')")
            page.wait_for_function('Reader.state.ready')
            shot('reader-1440')
            page.locator('#reader-next').click()
            before=page.evaluate('Reader.capture()')
            page.locator('#reader-close').click()
            page.evaluate("void Reader.open(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}),'viet')")
            page.wait_for_function('Reader.state.ready')
            results['checks']['reading-position']={'before':before,'after':page.evaluate('Reader.capture()')}
            # Tab containment and Escape of the reading view.
            def pagination_metrics():
                return page.evaluate("""() => ({index:Reader.pages.index,stride:Reader.pages.stride,total:Reader.pages.total,containers:['reader-page-viewport','reader-page-flow','reader-paper-content','reader-scroll'].map(id=>({id,scrollLeft:document.getElementById(id)?.scrollLeft,transform:getComputedStyle(document.getElementById(id)).transform,width:document.getElementById(id).clientWidth}))})""")
            results['checks']['pagination-before-keyboard']=pagination_metrics()
            focus=[]
            for _ in range(35):
                page.keyboard.press('Tab')
                focus.append(page.evaluate("({id:document.activeElement.id,tag:document.activeElement.tagName,inReader:!!document.activeElement.closest('#reader-view-container')})"))
            results['checks']['reader-focus']=focus
            results['checks']['pagination-after-keyboard']=pagination_metrics()
            shot('reader-after-keyboard-1440')
            page.locator('#reader-listen-toggle').click()
            page.wait_for_function("Audiobook.state.status==='playing'")
            shot('reader-playing-1440')
            page.locator('#dp-settings').click()
            shot('audio-options-1440')
            page.locator('#dp-options-close').click()
            page.evaluate('Audiobook.pause()')
            for width in [390,320,768]:
                page.set_viewport_size({'width':width,'height':844 if width<700 else 1024})
                for theme in ['parchment','night','amber']:
                    page.evaluate('(x)=>setTheme(x)',theme)
                    shot(f'reader-{width}-{theme}')
            page.set_viewport_size({'width':390,'height':844})
            page.locator('#dp-settings').click()
            shot('audio-options-390')
            page.locator('#dp-options-close').click()
            page.locator('#reader-close').click()
            page.evaluate("setTheme('parchment')")
            for tab in ['home','daithua','daitang','phucminh','fulltext','offline','settings','study','shelf','listening-history']:
                page.evaluate('(id)=>switchTab(id)',tab)
                page.wait_for_timeout(80)
                shot(tab+'-390')
            page.evaluate("switchTab('home')")
            page.locator('#library-menu-toggle').click()
            shot('tools-390')
            page.keyboard.press('Escape')
            results['checks']['tools-escape']=page.locator('dialog[open]').count()==0
            page.set_viewport_size({'width':320,'height':844})
            page.evaluate("switchTab('home')")
            shot('home-320')
            # Native history: use actual sidebar controls on a fresh page.
            nav=context.new_page()
            nav.goto(url,wait_until='networkidle')
            route_steps=[]
            for tab in ['phucminh','listening-history','home']:
                nav.locator(f'#dharma-sidebar [data-dharma-nav={tab}]').first.click()
                route_steps.append(nav.evaluate('({hash:location.hash,length:history.length})'))
            nav.go_back()
            results['checks']['back-button']={'steps':route_steps,'afterBack':nav.url}
            # Fresh mobile reading, followed by keyboard traversal, to separate
            # a pagination/focus defect from the preceding desktop resize.
            fresh_context=browser.new_context(viewport={'width':390,'height':844},service_workers='block',reduced_motion='reduce')
            fresh_context.route('**/api/voices',lambda r:r.fulfill(json={'available':False,'voices':[]}))
            fresh=fresh_context.new_page()
            fresh.goto(url,wait_until='networkidle')
            fresh.evaluate("void Reader.open(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}),'viet')")
            fresh.wait_for_function('Reader.state.ready')
            fresh.wait_for_timeout(600)
            fresh.screenshot(path=str(OUT/'reader-fresh-390.png'))
            results['checks']['fresh-mobile-before']=fresh.evaluate("({index:Reader.pages.index,scrollLeft:document.getElementById('reader-page-viewport').scrollLeft})")
            for _ in range(35): fresh.keyboard.press('Tab')
            fresh.wait_for_timeout(600)
            fresh.screenshot(path=str(OUT/'reader-keyboard-390.png'))
            results['checks']['fresh-mobile-after']=fresh.evaluate("({index:Reader.pages.index,scrollLeft:document.getElementById('reader-page-viewport').scrollLeft,focus:document.activeElement.getAttribute('data-block')||document.activeElement.id})")
            fresh_context.close()
            # Measure computed contrast values for representative current UI text.
            page.set_viewport_size({'width':1440,'height':1000})
            page.evaluate("switchTab('home')")
            for theme in ['parchment','night','amber']:
                page.evaluate('(x)=>setTheme(x)',theme)
                results['checks']['styles-'+theme]=page.evaluate("""() => ['.sanctuary-hero h2','.sanctuary-hero p','.ds-heading','.featured-book','.edition-credit','.dw-presence','#dp-title','#dp-current-time'].flatMap(sel=>[...document.querySelectorAll(sel)].slice(0,2).map(e=>({sel,text:e.innerText.slice(0,160),font:getComputedStyle(e).fontSize,color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor,parents:[...function*(x){for(let i=0;x&&i<5;i++,x=x.parentElement)yield getComputedStyle(x).backgroundColor}(e.parentElement)]})))""")
            browser.close()
    finally:
        http.shutdown()
        (OUT/'observations.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'screens':len(results['screens']),'errors':results['errors'],'output':str(OUT/'observations.json')},ensure_ascii=False),flush=True)


if __name__ == '__main__':
    main()

"""Real service-worker lifecycle; bad assets rejected, user-triggered update survives offline."""
import json,re,sys,threading
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'tests'),str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from read_listen_continuity_check import server,Quiet,NarrationEngine,unused,audio_fixture
from playwright.sync_api import sync_playwright

OUT=ROOT/'tests/artifacts/ux-upgrade-20261010'
MANIFEST=json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))
WORKER=(ROOT/'app/web/sw.js').read_text(encoding='utf-8')
revision=[None];broken=[False]

class ReleaseFixture(Quiet):
    def do_GET(self):
        path=self.path.split('?')[0]
        body=None;kind=None
        if path in ('/','/index.html'):
            body=server.LANDING_HTML.replace(b'__LIBRARY_ENTRY_RELEASE__',json.dumps(revision[0] or MANIFEST['version']).encode());kind='text/html; charset=utf-8'
        elif path=='/web-thuvien/sw.js':
            source=WORKER if not revision[0] else re.sub(r"const SHELL = '[^']+'","const SHELL = 'cp-shell-"+revision[0]+"'",WORKER)
            body=source.encode();kind='application/javascript'
        elif path=='/web-thuvien/data/library-version.json':
            value={**MANIFEST,'version':revision[0] or MANIFEST['version']}
            body=json.dumps(value).encode();kind='application/json'
        elif broken[0] and path=='/web-thuvien/css/library.bundle.css':
            body=(ROOT/'app/web/css/library.bundle.css').read_bytes()+b'/* checksum mismatch fixture */';kind='text/css'
        if body is None:return super().do_GET()
        self.send_response(200);self.send_header('Content-Type',kind);self.send_header('Content-Length',str(len(body)))
        self.send_header('Cache-Control','no-store');self.send_header('Service-Worker-Allowed','/');self.end_headers();self.wfile.write(body)

def update(page):
    page.evaluate('''async()=>{const r=await navigator.serviceWorker.getRegistration();window.workerStates=[];r.addEventListener('updatefound',()=>{const w=r.installing;w.addEventListener('statechange',()=>workerStates.push(w.state));},{once:true});await r.update();}''')

def main():
    memory={};server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,unused,log_path=None)
    http=server.LibraryHTTPServer(('127.0.0.1',0),ReleaseFixture);http.allowed_patterns=set()
    threading.Thread(target=http.serve_forever,daemon=True).start()
    checks,errors=[],[];result={'version':MANIFEST['version'],'checks':checks,'pageErrors':errors,'passed':False,'fixture':'Same assets, synthetic worker revisions; fixture WAV, no live TTS.'}
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
            context=browser.new_context(service_workers='allow',viewport={'width':390,'height':844})
            context.route('**/api/voices',lambda r:r.fulfill(json={'available':True,'offlineAvailable':True,'voices':[],'offlineVoices':[{'id':'vieneu-thuc-doan','name':'Thục Đoan'}],'audioConfig':{'startupBufferSeconds':0}}))
            context.route('**/api/tts',lambda r:r.fulfill(body=audio_fixture(40),content_type='audio/wav'))
            page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html',wait_until='networkidle')
            page.wait_for_function('!!navigator.serviceWorker.controller',timeout=20000)
            page.evaluate("LibraryOffline.saveBook(DharmaPlayerStore.resolve({type:'daithua',id:'dt_01_2'}))")
            revision[0]='ux-test-broken';broken[0]=True;update(page)
            page.wait_for_function("workerStates.includes('redundant')",timeout=20000)
            assert page.evaluate("async()=>(await(await fetch('data/library-version.json')).json()).version")==MANIFEST['version']
            assert page.evaluate("LibraryOffline.packs()[0].key")=='daithua:dt_01_2'
            page.reload(wait_until='networkidle')
            page.wait_for_function("typeof LibraryOffline!=='undefined'&&LibraryOffline.ready")
            assert page.evaluate("async()=>(await(await fetch('data/library-version.json')).json()).version")==MANIFEST['version']
            checks.append('Checksum-mismatched update is rejected; current manifest and downloaded book remain')
            page.evaluate("void LibraryUI.open('daithua','dt_01_2','viet')");page.wait_for_function('Reader.state.ready')
            page.locator('#reader-listen-toggle').click();page.wait_for_function("Audiobook.state.status==='playing'")
            page.locator('#dp-settings').click();page.locator('#audio-follow').uncheck();page.keyboard.press('Escape')
            page.locator('#reader-next').click();anchor=page.evaluate('Reader.capture().block')
            revision[0]='ux-test-valid';broken[0]=False;update(page)
            page.wait_for_function("workerStates.includes('installed')&&!document.getElementById('library-update').hidden",timeout=20000)
            assert page.evaluate("Audiobook.state.status==='playing'")
            assert page.evaluate("async()=>(await(await fetch('data/library-version.json')).json()).version")==MANIFEST['version']
            checks.append('New worker waits; playback and old compatible shell continue until user accepts')
            page.locator('#reader-close').click();page.evaluate("LibraryUpgrades.navigate('help')")
            page.on('dialog',lambda d:d.accept())
            with page.expect_navigation(wait_until='networkidle'):page.locator('#library-update').click()
            page.wait_for_function("document.getElementById('help-version')?.textContent.includes('ux-test-valid')")
            assert page.evaluate("!['playing','loading'].includes(Audiobook.state.status)")
            assert page.evaluate("LibraryStore.read('position:daithua:dt_01_2:viet',{}).block")==anchor, (anchor,page.evaluate("LibraryStore.read('position:daithua:dt_01_2:viet',{})"))
            assert page.evaluate("LibraryOffline.packs()[0].key")=='daithua:dt_01_2'
            keys=page.evaluate('async()=>await caches.keys()');assert 'cp-shell-ux-test-valid' in keys and 'cp-shell-'+MANIFEST['version'] not in keys,keys
            page.evaluate("void LibraryUI.open('daithua','dt_01_2','viet')");page.wait_for_function('Reader.state.ready')
            context.set_offline(True);page.reload(wait_until='domcontentloaded');page.wait_for_function('Reader.state.ready')
            assert page.evaluate('Reader.capture().block')==anchor
            checks.append('Accepted update saves position, retains books and cold-reloads saved reading offline')
            page.screenshot(path=str(OUT/'stage9-update-offline.png'))
            context.set_offline(False);revision[0]='ux-test-refresh'
            page.reload(wait_until='networkidle')
            page.wait_for_function("typeof Reader!=='undefined'&&Reader.state.ready",timeout=30000)
            page.wait_for_function("async()=>(await(await fetch('data/library-version.json')).json()).version==='ux-test-refresh'",timeout=30000)
            assert page.evaluate('Reader.capture().block')==anchor
            assert page.evaluate("LibraryOffline.packs()[0].key")=='daithua:dt_01_2'
            checks.append('Refresh automatically accepts a verified new release, preserves the reading route and saved position, and keeps downloaded books')
            assert not errors,errors;browser.close()
        result['passed']=True;print(json.dumps(result,ensure_ascii=False))
    except Exception as e:result['failure']=str(e);raise
    finally:
        http.shutdown();(OUT/'stage9-update.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':main()

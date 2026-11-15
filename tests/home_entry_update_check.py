"""A cached old home updates through / without duplicating recent reading."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import threading

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'tests'), str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
from read_listen_continuity_check import server, Quiet
from playwright.sync_api import sync_playwright

OUT = ROOT / 'tests/artifacts/hero-header-20261012'
WEB = ROOT / 'app/web'
MANIFEST = json.loads((ROOT / 'data/generated/library-version.json').read_text(encoding='utf-8'))
OLD_VERSION = 'hero-header-old-fixture'
old_experience = (WEB / 'js/library-experience.js').read_text(encoding='utf-8').replace(
    "home.prepend(home.querySelector('.sanctuary-hero'),discovery);",
    "home.prepend(discovery);home.prepend($('recent-books').closest('.home-section'));",
).replace("    if(id==='home')$('tab-home').querySelector('.sanctuary-hero').after(controls);\n    else document.querySelector('main').prepend(controls);", '')
old_hash = hashlib.sha256(old_experience.encode()).hexdigest()
old_html = re.sub(r'js/library-experience.js\?v=[a-f0-9]+', 'js/library-experience.js?v=' + old_hash[:12], (WEB / 'index.html').read_text(encoding='utf-8'))
old_worker = re.sub(r"const SHELL = '[^']+'", "const SHELL = 'cp-shell-" + OLD_VERSION + "'", (WEB / 'sw.js').read_text(encoding='utf-8'))
old_worker = re.sub(r"    if\(request.mode==='navigate'.*?    if\(bootstrap\|\|versioned\)", '    if(bootstrap||versioned)', old_worker, flags=re.S)
old_manifest = {**MANIFEST, 'version': OLD_VERSION, 'assetHashes': {
    **MANIFEST['assetHashes'], 'js/library-experience.js': old_hash,
    'index.html': hashlib.sha256(old_html.encode()).hexdigest(),
    'sw.js': hashlib.sha256(old_worker.encode()).hexdigest(),
}}
old_assets = json.loads((ROOT / 'data/generated/offline-assets.json').read_text(encoding='utf-8'))
old_assets = [re.sub(r'js/library-experience.js\?v=[a-f0-9]+', 'js/library-experience.js?v=' + old_hash[:12], url) for url in old_assets]
old_responses = {
    '/web-thuvien/index.html': (old_html, 'text/html; charset=utf-8'),
    '/web-thuvien/sw.js': (old_worker, 'application/javascript'),
    '/web-thuvien/js/library-experience.js': (old_experience, 'application/javascript'),
    '/web-thuvien/data/library-version.json': (json.dumps(old_manifest), 'application/json'),
    '/web-thuvien/data/offline-assets.json': (json.dumps(old_assets), 'application/json'),
}
latest = [False]


class OldHomeFixture(Quiet):
    def do_GET(self):
        replacement = old_responses.get(self.path.split('?')[0]) if not latest[0] else None
        if not replacement:
            return super().do_GET()
        body, kind = replacement
        self.response(200, body.encode(), kind)


def seed_reading(page):
    page.evaluate("""() => {
        const refs = [{type:'daitang', id:'T14n0475'},
            {type:'daithua', id:DAI_THUA_DATA.find(x=>x.taishoId==='T08n0251').id},
            {type:'ebooks', id:DAI_TANG_KINH_DATA.find(x=>x.vietFile).id}];
        const recent = refs.map(ref => { const item=DharmaPlayerStore.resolve(ref);
            return {...ref,key:item.key,title:item.title,mode:'viet',updatedAt:Date.now()}; });
        LibraryStore.write('recent',[recent[0],{...recent[0],mode:'han'},...recent.slice(1)]);
        LibraryStore.write('hero-update-probe',{note:'Ghi chú phải được giữ'});
        LibraryUI.refreshShelf();
    }""")


def verify_home(page, label):
    page.wait_for_function("typeof appState!=='undefined'&&appState.currentTab==='home'&&!!document.querySelector('.cp-home-hero')")
    assert page.locator('#tab-home').count() == 1
    assert page.locator('#recent-books').count() == 1
    assert page.locator('#tab-home h2').filter(has_text=re.compile('^Trang kinh đang đọc$')).count() == 1
    assert page.locator('#recent-books .shelf-book').count() == 3
    assert page.evaluate("LibraryStore.read('recent',[]).length===4"), 'Display deduplication must keep saved history'
    assert page.evaluate("LibraryStore.read('hero-update-probe',{}).note==='Ghi chú phải được giữ'")
    for width in [1440, 768, 390, 320]:
        page.set_viewport_size({'width': width, 'height': 1000 if width > 600 else 844})
        for theme in ['parchment', 'amber', 'night']:
            page.evaluate('(theme)=>{setTheme(theme);switchTab("home");scrollTo(0,0);}', theme)
            geometry = page.evaluate("""() => {
                const home=document.getElementById('tab-home'),hero=home.querySelector('.sanctuary-hero'),
                    controls=document.getElementById('catalog-search-controls'),recent=document.getElementById('recent-books').closest('.home-section'),
                    r=hero.getBoundingClientRect(),head=document.querySelector('.noble-header').getBoundingClientRect();
                return {first:home.firstElementChild===hero,
                    firstMain:document.querySelector('main').firstElementChild===home,
                    visible:r.top>=head.bottom&&r.top<200,
                    searchAfter:r.bottom<=controls.getBoundingClientRect().top,
                    recentAfter:r.bottom<=recent.getBoundingClientRect().top,
                    fits:document.documentElement.scrollWidth<=innerWidth+1};
            }""")
            assert all(geometry.values()), (label, width, theme, geometry)
        if width in [1440, 390]:
            page.evaluate("setTheme('parchment')")
            page.screenshot(path=str(OUT / f'{label}-home-{width}.png'))
    page.evaluate("LibraryUI.init();switchTab('shelf');switchTab('home')")
    assert page.locator('#tab-home').count() == page.locator('#recent-books').count() == 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--live', action='store_true')
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    http = None
    url = 'http://127.0.0.1:8090'
    if not args.live:
        http = server.LibraryHTTPServer(('127.0.0.1', 0), OldHomeFixture)
        http.allowed_patterns = set()
        threading.Thread(target=http.serve_forever, daemon=True).start()
        url = f'http://127.0.0.1:{http.server_port}'
    errors = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
            context = browser.new_context(service_workers='allow', viewport={'width':1440,'height':1000}, reduced_motion='reduce')
            context.route('**/api/voices', lambda route: route.fulfill(json={'available':False,'voices':[]}))
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(url + '/web-thuvien/index.html', wait_until='networkidle')
            page.wait_for_function('!!navigator.serviceWorker.controller', timeout=30000)
            seed_reading(page)
            if not args.live:
                assert page.evaluate("document.querySelector('#tab-home').firstElementChild.contains(document.getElementById('recent-books'))")
                page.evaluate("async()=>{const cache=await caches.open('cp-offline-books-v1');await cache.put('/saved-book-fixture.txt',new Response('Saved book'));}")
                latest[0] = True
                page.reload(wait_until='networkidle')
                assert page.evaluate("document.querySelector('#tab-home').firstElementChild.contains(document.getElementById('recent-books'))"), 'Ordinary reload must reproduce the pinned old shell'
            page.goto(url + '/', wait_until='networkidle')
            page.wait_for_url(re.compile(r'/web-thuvien/index\.html(?:\?.*)?#home$'), wait_until='networkidle', timeout=30000)
            verify_home(page, 'live' if args.live else 'updated')
            version = page.evaluate("async()=>(await(await fetch('data/library-version.json')).json()).version")
            assert version == MANIFEST['version'], version
            if not args.live:
                assert page.evaluate("async()=>(await(await caches.open('cp-offline-books-v1')).match('/saved-book-fixture.txt')).text()") == 'Saved book'
                context.set_offline(True)
                page.reload(wait_until='domcontentloaded')
                verify_home(page, 'offline')
            assert not errors, errors
            browser.close()
        result = {'passed':True,'version':version,'url':url,'pageErrors':errors,
            'checks':['Old cached reading-first home reproduced before root entry' if not args.live else 'Actual local server root entry',
                'Hero first at 1440/768/390/320 px in three themes',
                'One recent-reading section and three distinct books; four saved history records preserved',
                'Reinitialization and return navigation do not duplicate home',
                'Verified new shell and saved book survive offline reload' if not args.live else 'Live server serves the current release']}
        (OUT / ('live.json' if args.live else 'update.json')).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        print(json.dumps(result, ensure_ascii=False))
    finally:
        if http:
            http.shutdown()


if __name__ == '__main__':
    main()

"""Real browser pagination, saved text positions and reading/listening handoff."""
import io
import json
import math
import struct
import sys
import wave
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'app'))
from project_paths import DEPENDENCIES
sys.path.insert(0, str(DEPENDENCIES))
from playwright.sync_api import sync_playwright

OUT = ROOT / 'tests/artifacts/pocketbook-reader'
OUT.mkdir(parents=True, exist_ok=True)
URL = 'http://127.0.0.1:8090/web-thuvien/index.html'
tone = io.BytesIO()
with wave.open(tone, 'wb') as audio:
    audio.setnchannels(1)
    audio.setsampwidth(2)
    audio.setframerate(16000)
    audio.writeframes(b''.join(struct.pack('<h', int(800 * math.sin(i * .08))) for i in range(16000 * 20)))

checks, errors = [], []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block')
    page = context.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.route('**/api/tts', lambda route: route.fulfill(status=200, content_type='audio/wav', body=tone.getvalue()))
    page.goto(URL, wait_until='networkidle')
    page.evaluate('Reader.open({type:"daitang", data:DAI_TANG_HAN_DATA.texts.find(x=>x.id==="T25n1505")})')
    page.wait_for_function('Reader.state.ready && Reader.pages.stride > 0')
    page.wait_for_timeout(200)
    assert page.evaluate('Reader.pref.view') == 'paged'
    assert not page.locator('#reader-sidebar').is_visible()
    assert not page.locator('#dp-play').is_visible()
    assert page.locator('#reader-scroll').bounding_box()['height'] > 760
    page.screenshot(path=str(OUT / 'desktop.png'))
    page.evaluate('Reader.toggleAudio(true)')
    page.screenshot(path=str(OUT / 'listen-desktop.png'))
    page.evaluate('Reader.toggleAudio(false)')
    page.locator('[data-panel="settings"]').click()
    page.screenshot(path=str(OUT / 'settings-desktop.png'))
    page.locator('#inspector-close').click()
    checks.append('Quiet reader opens in page mode with a collapsed outline and full reading height')
    print(checks[-1], flush=True)

    for theme in ('parchment', 'amber', 'night'):
        page.evaluate('(theme)=>setTheme(theme)', theme)
        for width in (320, 390, 768, 1024, 1440):
            page.set_viewport_size({'width': width, 'height': 900})
            page.wait_for_timeout(160)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width)
            assert page.locator('#reader-scroll').bounding_box()['height'] > 640, (theme, width)
            for selector in ('#reader-close', '#reader-listen-toggle', '#reader-fullscreen', '#reader-toc-toggle', '[data-panel="settings"]', '#reader-next'):
                box = page.locator(selector).bounding_box()
                assert box and box['width'] >= 44 and box['height'] >= 44, (selector, box, width)
            page.screenshot(path=str(OUT / f'{theme}-{width}.png'))
    checks.append('Three themes and five widths preserve readable text, reachable controls and 44px targets')
    print(checks[-1], flush=True)

    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.evaluate('setTheme("parchment")')
    source = page.evaluate('new URL(Reader.path(Reader.state.item,"viet"),location.href).href')
    fixture = '# Bài đọc thử nghiệm\n\n' + '\n\n'.join(
        f'Đoạn {i:02d}. ' + ('Tâm an tịnh, chánh niệm trong từng bước chân. Hãy đọc chậm và lắng nghe lời kinh. ' * 35)
        for i in range(1, 16)
    )
    page.route(source, lambda route: route.fulfill(status=200, content_type='text/plain; charset=utf-8', body=fixture))
    page.evaluate('Reader.close();LibraryStore.write("position:daitang:T25n1505:viet",null);Reader.open({type:"daitang",data:DAI_TANG_HAN_DATA.texts.find(x=>x.id==="T25n1505")})')
    page.wait_for_function('Reader.state.ready && Reader.pages.total > 2')
    page.wait_for_timeout(150)
    assert page.evaluate('Reader.state.doc.blocks[0].text').startswith('# Bài đọc thử nghiệm')
    initial = page.evaluate('Reader.capture()')
    page.locator('#reader-next').click()
    page.wait_for_timeout(100)
    second = page.evaluate('Reader.capture()')
    assert page.evaluate('Reader.pages.index') == 1
    assert second != initial, (initial, second)
    page.keyboard.press('PageDown')
    assert page.evaluate('Reader.pages.index') == 2
    saved = page.evaluate('Reader.capture()')
    page.locator('#reader-close').click()
    page.evaluate('Reader.open({type:"daitang",data:DAI_TANG_HAN_DATA.texts.find(x=>x.id==="T25n1505")})')
    page.wait_for_function('Reader.state.ready')
    page.wait_for_timeout(200)
    assert page.evaluate('Reader.pages.index') == 2
    assert page.evaluate('Reader.capture()') == saved
    checks.append('Buttons and PageDown turn actual pages; reopening restores a position inside a long paragraph')
    print(checks[-1], flush=True)

    def anchor_visible(anchor):
        return page.evaluate('''a => {
          const el=document.querySelector(`[data-block="${a.block}"]`);
          const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,left=a.textOffset||0;
          while(n=walk.nextNode()){if(left<n.length){const r=document.createRange();r.setStart(n,left);r.setEnd(n,left+1);
            const rect=r.getBoundingClientRect(),v=document.getElementById('reader-page-viewport').getBoundingClientRect();
            return rect.left>=v.left-1&&rect.right<=v.right+1&&rect.top>=v.top-1&&rect.bottom<=v.bottom+1;}left-=n.length;}
          return false;
        }''', anchor)

    page.locator('#reader-font-up').click()
    assert anchor_visible(saved)
    page.locator('#reader-toc-toggle').click()
    page.wait_for_timeout(180)
    assert anchor_visible(saved)
    page.locator('#toc-close').click()
    page.locator('[data-panel="settings"]').click()
    page.wait_for_timeout(180)
    assert anchor_visible(saved)
    page.locator('#inspector-close').click()
    page.set_viewport_size({'width': 390, 'height': 844})
    page.wait_for_timeout(180)
    if not anchor_visible(saved):
        page.screenshot(path=str(OUT / 'reflow-failure.png'))
        print(page.evaluate('({saved:LibraryStore.read("position:"+Reader.state.key+":"+Reader.state.mode,null),capture:Reader.capture(),pages:Reader.pages,viewport:document.getElementById("reader-page-viewport").getBoundingClientRect().toJSON()})'), flush=True)
    assert anchor_visible(saved), saved
    page.locator('#reader-fullscreen').click()
    page.wait_for_timeout(180)
    page.locator('[data-panel="settings"]').click()
    page.locator('#reader-focus').click()
    page.wait_for_timeout(180)
    assert not page.locator('.reader-toolstrip').is_visible()
    assert page.locator('#reader-focus-exit').is_visible()
    assert anchor_visible(saved)
    page.locator('#reader-focus-exit').click()
    page.wait_for_timeout(180)
    assert page.locator('.reader-toolstrip').is_visible()
    assert anchor_visible(saved)
    page.locator('#reader-fullscreen').click()
    page.wait_for_timeout(180)
    checks.append('Font changes, outline, settings, viewport and fullscreen reflow retain the saved text')
    print(checks[-1], flush=True)

    page.locator('[data-reading-view="parts"]').click()
    assert page.evaluate('Reader.pref.view') == 'parts'
    assert not page.locator('#reader-page-flow').count()
    page.evaluate('document.getElementById("reader-scroll").scrollTop += 250')
    page.wait_for_timeout(180)
    scroll_anchor = page.evaluate('Reader.capture()')
    page.locator('[data-reading-view="paged"]').click()
    assert page.evaluate('Reader.capture().block') == scroll_anchor['block']
    checks.append('Switching between pages and scrolling retains the reading passage')
    print(checks[-1], flush=True)

    page.evaluate('Reader.toggleAudio(true)')
    assert page.locator('#dp-play').is_visible()
    assert page.evaluate('Audiobook.state.status') != 'playing'
    reading = page.evaluate('Reader.capture()')
    page.locator('#dp-settings').click()
    page.locator('#reader-hear-visible').click()
    page.wait_for_function('Audiobook.state.status === "playing"', timeout=20000)
    expected = page.evaluate('''a => {
        const el=document.querySelector(`[data-block="${a.block}"]`);
        return NarrationModel.locate(Audiobook.segments,a.block,NarrationModel.plain(el.textContent.slice(0,a.textOffset||0)).length);
    }''', reading)
    assert page.evaluate('Audiobook.state.index') == expected, page.evaluate('''a => ({reading:a, expected:window.NarrationModel.locate(Audiobook.segments,a.block,window.NarrationModel.plain(document.querySelector(`[data-block="${a.block}"]`).textContent.slice(0,a.textOffset||0)).length), audio:Audiobook.state.index, segment:Audiobook.segments[Audiobook.state.index], captured:Reader.capture(), anchor:Reader.pages.anchor})''', reading)
    assert page.evaluate('Reader.pages.anchor.textOffset') == page.evaluate('Audiobook.segments[Audiobook.state.index].sourceOffset')
    assert page.locator('.reader-bottombar #persistent-player').is_visible()
    page.evaluate('Audiobook.seekTime(5); Audiobook.pause()')
    before = page.evaluate('Audiobook.state.currentTime')
    page.locator('#dp-play').click()
    page.wait_for_function('Audiobook.state.status === "playing"')
    assert page.evaluate('Audiobook.state.currentTime') >= before - .1
    page.locator('#dp-settings').click()
    page.locator('.dp-chapters > summary').click()
    page.locator('#reader-read-listening').click()
    assert page.evaluate('Audiobook.state.status') == 'paused'
    assert not page.locator('#dp-options').is_visible()
    assert page.locator('#persistent-player').is_visible()
    assert page.evaluate('Reader.state.block') == reading['block']
    checks.append('Listening starts from the visible passage, resumes at the saved second and returns to the same text')
    print(checks[-1], flush=True)

    listened = page.evaluate('({block:Audiobook.segments[Audiobook.state.index].block,seconds:Audiobook.state.currentTime})')
    reading_saved = page.evaluate('LibraryStore.read("position:"+Reader.state.key+":"+Reader.state.mode,null)')
    page.reload(wait_until='networkidle')
    page.wait_for_function('Reader.state.ready')
    assert page.evaluate('Reader.pages.anchor.block') == reading_saved['block']
    assert page.evaluate('Reader.pages.anchor.textOffset') == reading_saved.get('textOffset', 0)
    page.locator('#reader-listen-toggle').click()
    assert page.locator('#dp-play').is_visible()
    page.wait_for_function('Audiobook.state.status === "playing"', timeout=20000)
    assert page.evaluate('Audiobook.segments[Audiobook.state.index].block') == listened['block']
    assert page.evaluate('Audiobook.state.currentTime') >= listened['seconds'] - .2
    page.evaluate('Audiobook.pause()')
    checks.append('Reload restores independent reading and listening positions without autoplay')
    print(checks[-1], flush=True)

    old_key = page.evaluate('Audiobook.state.key')
    page.evaluate('LibraryUI.open("ebooks","ep-21bbd16d10a2")')
    page.wait_for_function('Reader.state.ready')
    assert page.evaluate('Audiobook.state.key') == old_key
    page.locator('#reader-listen-toggle').click()
    page.locator('#dp-settings').click()
    page.locator('#reader-hear-visible').click()
    page.wait_for_function('Audiobook.state.key === Reader.state.key && Audiobook.state.status === "playing"', timeout=20000)
    page.locator('#reader-close').click()
    assert page.evaluate('Audiobook.state.status') == 'playing'
    page.evaluate('Audiobook.pause()')
    checks.append('Browsing keeps the previous listening session; choosing Listen from here switches books and playback survives closing')
    print(checks[-1], flush=True)

    page.evaluate('Reader.open({type:"daitang",data:DAI_TANG_HAN_DATA.texts.find(x=>x.id==="T25n1505")},"han")')
    page.wait_for_function('Reader.state.ready && Reader.state.mode === "han"')
    assert page.locator('#reader-paper-content').get_attribute('lang') == 'zh-Hant'
    assert page.locator('#reader-page-flow').count()
    page.locator('[data-panel="settings"]').click()
    page.locator('[data-reader-mode="dual"]').click()
    page.wait_for_function('Reader.state.ready && Reader.state.mode === "dual"')
    assert page.locator('.dual-reader-column').count() == 2
    assert not page.locator('#reader-page-flow').count()
    assert page.locator('[data-reading-view="paged"]').is_disabled()
    page.locator('#inspector-close').click()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    checks.append('Chinese pages and Vietnamese/Chinese comparison remain available through reading settings')
    print(checks[-1], flush=True)

    offline_context = browser.new_context(viewport={'width': 1440, 'height': 900})
    offline_page = offline_context.new_page()
    offline_page.goto(URL, wait_until='networkidle')
    offline_page.evaluate('navigator.serviceWorker.ready')
    offline_page.wait_for_function('!!navigator.serviceWorker.controller')
    assert offline_page.evaluate('''async () => {
        const shell=(await caches.keys()).find(key=>key.startsWith('cp-shell-'));
        if (!shell) return false;
        const cache=await caches.open(shell);
        const assets=[...document.querySelectorAll('script[src],link[rel="stylesheet"]')]
          .map(el=>el.src || el.href).filter(url=>/\/(pocketbook-reader\.css|reader\.js|audiobook\.js|persistent-player\.js|unified-player\.css|listening-history\.(css|js))\?/.test(url));
        return assets.length===7 && (await Promise.all(assets.map(url=>cache.match(url)))).every(Boolean);
    }''')
    offline_context.set_offline(True)
    offline_page.reload(wait_until='load')
    offline_page.wait_for_function('!!window.Reader && !!window.Audiobook')
    assert offline_page.evaluate('Array.from(document.styleSheets).some(s=>s.href?.includes("pocketbook-reader.css"))')
    offline_page.evaluate('ListeningHistory.open()')
    assert offline_page.locator('#lh-title').is_visible()
    assert offline_page.locator('#lh-empty-title').is_visible()
    checks.append('Service worker caches reader, narration and listening history; the application shell and history screen work offline')
    print(checks[-1], flush=True)
    offline_context.close()
    assert not errors, errors
    browser.close()

result = {'checks': checks, 'browserErrors': errors, 'audio': 'Local WAV fixture; no external speech service'}
(OUT / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False))

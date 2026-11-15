
# Locate the shared path registry from either the workspace or an exported release.
from pathlib import Path as _BootstrapPath
import sys as _bootstrap_sys
_bootstrap_app = next(candidate for ancestor in _BootstrapPath(__file__).resolve().parents
                      for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
                      if (candidate / 'project_paths.py').is_file())
_bootstrap_sys.path.insert(0, str(_bootstrap_app))
from project_paths import ROOT, APP, WEB, BUILD, GENERATED, STATE, DEPENDENCIES, AUDIO_CACHE, WORK_CACHE, CONFIG, DIST, REPORTS, SOURCES, public_path, public_relative, release_relative
_bootstrap_sys.path.insert(0, str(BUILD))
_bootstrap_sys.path.insert(0, str(DEPENDENCIES))

import json
from pathlib import Path
import sys
sys.path.insert(0, str(DEPENDENCIES))
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
OUT = Path(__file__).parent / 'artifacts'
URL = 'http://127.0.0.1:8090/web-thuvien/index.html'
errors, checks = [], []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=str(Path.home() / 'AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'), headless=True)
    page = browser.new_page(viewport={'width':1440,'height':1000})
    page.on('pageerror',lambda e:errors.append(e.stack))
    page.goto(URL, wait_until='networkidle')
    page.wait_for_selector('#nav-home')
    page.evaluate("""async () => {
      await openTaishoReader('T01n0001','viet');
      document.getElementById('reader-scroll').scrollTop = 200;
      openTaishoReader('T01n0001','han');
      await openTriReader('dt_01_2','viet');
    }""")
    page.wait_for_timeout(350)
    assert page.evaluate("Reader.state.ready && Reader.state.item.data.id === 'dt_01_2' && Reader.state.mode === 'viet'")
    checks.append('Rapid open/mode switching does not render stale requests or crash scroll callbacks')
    page.evaluate("openTaishoReader('T01n0001','han')")
    page.wait_for_function('Reader.state.ready')
    assert 'Noto Serif TC' in page.locator('.reader-paper').evaluate('(el)=>getComputedStyle(el).fontFamily')
    page.locator('#reader-close').focus()
    page.keyboard.press('Shift+Tab')
    assert page.evaluate("document.getElementById('reader-view-container').contains(document.activeElement)")
    page.keyboard.press('Escape')
    assert not page.locator('#reader-view-container').is_visible()
    checks.append('Hán reader uses Noto Serif TC, keyboard focus stays inside dialog, Escape closes')
    contrasts={}
    for theme in ['parchment','amber','night']:
        contrasts[theme]=page.evaluate("""theme => {
          setTheme(theme);
          const s=getComputedStyle(document.documentElement);
          const luminance=hex => {
            const values=hex.trim().replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
            return values[0]*0.2126+values[1]*0.7152+values[2]*0.0722;
          };
          const fg=luminance(s.getPropertyValue('--text-primary')), bg=luminance(s.getPropertyValue('--bg-surface'));
          return (Math.max(fg,bg)+0.05)/(Math.min(fg,bg)+0.05);
        }""",theme)
        assert contrasts[theme] >= 7
    checks.append('Primary text contrast exceeds 7:1 in all three themes')
    page.evaluate("switchTab('appendix')")
    assert page.locator('.appendix-search-tools').count()==1
    page.locator('.appendix-search-tools input').fill('truong')
    assert page.locator('.comparison-table tbody tr:visible').count()==1
    assert page.locator('.comparison-table .r-button').count()>=1
    checks.append('Appendix filters and direct links to available sutras')
    # Invalid source content is displayed as text, not executed as HTML.
    safe=page.evaluate(r"""() => {
      const html=SutraFormatter.format('<img src=x onerror=alert(1)>\n\n## <script>bad()</script>',true,{preserveSource:true,kind:'text'});
      const el=document.createElement('div');el.innerHTML=html; return !el.querySelector('script,img');
    }""")
    assert safe
    checks.append('Source block renderer escapes executable markup')
    # A device without Vietnamese voices gets an honest unavailable state.
    empty=browser.new_page()
    empty.add_init_script("Object.defineProperty(window, 'speechSynthesis', {value: {getVoices:()=>[], addEventListener:()=>{}, cancel:()=>{}}})")
    empty.route('**/api/voices',lambda route:route.fulfill(json={'available':False,'voices':[]}))
    empty.goto(URL,wait_until='networkidle')
    empty.wait_for_selector('#nav-home')
    empty.evaluate("openTriReader('dt_01_2','viet')")
    empty.wait_for_function('Reader.state.ready')
    assert empty.locator('#audio-play').is_disabled()
    assert 'Chưa có giọng tiếng Việt' in empty.locator('#audio-voice').inner_text()
    empty.close()
    checks.append('Unavailable Vietnamese voices never fall back to a foreign-language voice')
    # Closing while an audio fetch is outstanding must not start playback later.
    page.evaluate("openTriReader('dt_01_2','viet')")
    page.wait_for_function('Reader.state.ready && Audiobook.state.count > 0')
    page.evaluate("""() => { Audiobook.play(); Reader.close(); }""")
    page.wait_for_timeout(750)
    assert page.evaluate("Audiobook.state.status === 'idle'")
    checks.append('Closing during audio load cancels playback')
    assert not errors, errors
    result={'checks':checks,'contrast':contrasts,'errors':errors}
    (OUT/'edge-case-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2))
    browser.close()

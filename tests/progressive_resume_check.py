"""Real browser seek/resume with slow local audio packets, without network TTS."""

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

import asyncio
import json
from pathlib import Path
import sys
import threading
import time

sys.path.insert(0, str(DEPENDENCIES))
sys.path.insert(0,str(APP))
from playwright.sync_api import sync_playwright
import server
from narration_engine import NarrationEngine

fixture = next(path for path in (AUDIO_CACHE).glob('*.mp3')
               if 200000 < path.stat().st_size < 300000).read_bytes()
cache = {}
async def slow(text, voice, rate):
    yield fixture[:10000]
    for start in range(10000, len(fixture), 50000):
        await asyncio.sleep(1)
        yield fixture[start:start + 50000]

server.STREAM_ENGINE = NarrationEngine(cache.get, lambda key, value: cache.__setitem__(key, value), slow)
class Quiet(server.Handler):
    def log_message(self, *args): pass

http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
http.allowed_patterns = set()
thread = threading.Thread(target=http.serve_forever, daemon=True)
thread.start()
base = f'http://127.0.0.1:{http.server_port}'
errors = []
checks = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
        page = browser.new_page(service_workers='block')
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
        page.evaluate('AudioService.configure({buffered:false})')
        page.evaluate('Audiobook.connect(ReaderModel.parse("# Local audio probe\\n\\nThis is authored text used only with a local audio fixture to check saved listening positions."),"test:local-resume","unavailable",true);Audiobook.setVolume(0);void Audiobook.seekChunk(1,7,true);')
        page.wait_for_function('Audiobook.state.status === "playing" && Audiobook.state.currentTime >= 7', timeout=12000)
        assert page.evaluate('Audiobook.state.currentTime') < 10
        checks.append('A saved position beyond the first buffered packet resumes at the requested second')
        page.evaluate('Audiobook.pause()')
        paused = page.evaluate('Audiobook.state.currentTime')
        page.wait_for_timeout(400)
        assert abs(page.evaluate('Audiobook.state.currentTime') - paused) < .05
        page.evaluate('void Audiobook.start()')
        page.wait_for_function('Audiobook.state.status === "playing" && Audiobook.state.currentTime > ' + str(paused + .2), timeout=5000)
        checks.append('Pause and continue preserve the audible position')
        page.evaluate('Audiobook.seekTime(3)')
        page.wait_for_function('Audiobook.state.currentTime >= 3 && Audiobook.state.currentTime < 4', timeout=5000)
        checks.append('Seek backward works during progressive playback')
        page.evaluate('Audiobook.pause();Audiobook.stop()')
        saved = page.evaluate('LibraryStore.read("listen:test:local-resume",null)')
        assert 3 <= saved['seconds'] < 4, saved
        assert not errors, errors
        browser.close()
finally:
    http.shutdown()
    http.server_close()
    thread.join()

result = {'checks': checks, 'browserErrors': errors, 'provider': 'slow local MP3 fixture'}
print(json.dumps(result))

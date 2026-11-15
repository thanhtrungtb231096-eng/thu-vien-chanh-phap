"""A failed prefix job reuses the full download's retry without showing a player error."""
import json
import sys
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright

fixture = (ROOT / 'tests/artifacts/audio-milinda-20261112/probe-11-vi-VN-NamMinhNeural.mp3').read_bytes()[:86400]
assert fixture[:2] == b'\xff\xf3' and len(fixture) == 86400
calls = []
memory = {}


async def provider(text, *args):
    calls.append(text)
    if len(calls) <= 2:
        # Both attempts of the first job fail, including an incomplete clip.
        yield fixture[:720]
        raise ConnectionError('injected local failure before a validated prefix')
    yield fixture


config = AudioConfig(warmup=False, transport_limit=160, prefetch_depth=0,
                     startup_buffer_seconds=12, retries=1, backoff_ms=(1,))
server.AUDIO_CONFIG = config
engine = NarrationEngine(memory.get, memory.__setitem__, provider, config=config, log_path=None)
server.STREAM_ENGINE = engine


class Quiet(server.Handler):
    def log_message(self, *args):
        pass


http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
http.allowed_patterns = set()
thread = threading.Thread(target=http.serve_forever, daemon=True)
thread.start()
report = {'passed': False, 'pageErrors': [], 'fixture': 'Local MP3 provider, no live TTS'}
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(service_workers='block')
        context.add_init_script('''
          const NativeAudio=Audio;
          window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};
          Audio.prototype=NativeAudio.prototype;
        ''')
        page = context.new_page()
        page.on('pageerror', lambda e: report['pageErrors'].append(str(e)))
        page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html', wait_until='networkidle')
        page.wait_for_selector('#audio-voice', state='attached')
        page.wait_for_function("Audiobook.state.voice.startsWith('online:')")
        paragraph = ' '.join(f'Case number {i}: This local sentence tests recovery before the first validated audio clip is available.' for i in range(1, 5))
        page.evaluate('''doc=>{
          window.playerErrors=[];
          addEventListener('dharma-audio',e=>{if(e.detail.status==='error')playerErrors.push(e.detail.message);});
          Audiobook.connect(ReaderModel.parse(doc),'test:long-retry','unavailable',true);
          Audiobook.seekChunk(1,0,false);void Audiobook.start();
        }''', '# Local retry check\n\n' + paragraph)
        page.wait_for_function("Audiobook.state.status==='playing' && testAudio.currentTime>.15", timeout=10000)
        errors = page.evaluate('playerErrors')
        assert not errors, errors
        assert page.evaluate("Audiobook.state.index===1 && !testAudio.error && testAudio.src.startsWith('blob:')")
        assert not report['pageErrors'], report['pageErrors']
        failed = [j for j in engine.jobs.values() if j.error == 'ConnectionError']
        complete = [j for j in engine.jobs.values() if j.done and not j.error]
        assert len(failed) == 1 and len(complete) == 1, [(j.error, j.done) for j in engine.jobs.values()]
        report.update(passed=True, firstJobFailed=True, retryJobComplete=True, sameParagraph=True,
                      playerErrors=errors, providerCalls=len(calls))
        page.evaluate('Audiobook.stop()')
        browser.close()
finally:
    http.shutdown()
    http.server_close()
    thread.join()
    (ROOT / 'tests/artifacts/audio-milinda-20261112/long-retry.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps(report))

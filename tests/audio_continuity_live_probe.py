"""Cold-cache browser continuity probe using authored text and the real provider."""
import argparse
import json
import os
import sys
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
sys.stdout.reconfigure(encoding='utf-8')
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--baseline', action='store_true')
parser.add_argument('--baseline-dir', type=Path, help='External historical JavaScript directory for --baseline')
parser.add_argument('--voice', default='vieneu-thuc-doan')
args = parser.parse_args()
if args.baseline and not args.baseline_dir:
    parser.error('--baseline requires --baseline-dir pointing to an external historical JavaScript directory')
OUT = ROOT / 'tests/artifacts/audio-continuity'
OUT.mkdir(parents=True, exist_ok=True)
config = AudioConfig(first_byte_timeout=15,background_workers=1,transport_limit=320,buffered=False) if args.baseline else server.AUDIO_CONFIG
memory = {}
server.STREAM_ENGINE = NarrationEngine(memory.get, memory.__setitem__, config=config, log_path=None)
server.AUDIO_CONFIG = config
class Quiet(server.Handler):
    def log_message(self, *args): pass
http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
http.allowed_patterns = set()
thread = threading.Thread(target=http.serve_forever, daemon=True)
thread.start()
base = f'http://127.0.0.1:{http.server_port}'
sentences = [
    'Buổi sáng trời trong và có gió nhẹ. Ánh nắng qua cửa sổ, hàng cây ngoài sân xanh tươi.',
    'Người đọc mở một trang sách rồi ngồi xuống. Những câu văn được đọc rõ ràng, thong thả.',
    'Trong khu vườn có một hồ nước nhỏ. Mặt nước yên và bóng những tán cây nghiêng xuống.',
    'Con đường dẫn qua một chiếc cầu gỗ. Có tiếng chim trong những bụi cây bên hàng rào.',
    'Buổi chiều có ánh nắng dịu hơn. Chúng ta khép sách và trở lại công việc thường ngày.',
    'Đây là câu cuối của văn bản tự tạo. Mỗi câu dùng để kiểm tra luồng âm thanh liên tục.'
]
document = '# Văn bản thử nghiệm tự tạo\n\n' + '\n\n'.join(sentences)
report = {'mode': 'baseline' if args.baseline else 'candidate', 'voice': args.voice, 'complete': False}
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
        context = browser.new_context(service_workers='block')
        if args.baseline:
            backup = args.baseline_dir.resolve()
            for name in ['audiobook.js', 'audio-service.js']:
                body = (backup / name).read_text(encoding='utf-8')
                context.route('**/js/' + name + '*', lambda r, request=None, body=body: r.fulfill(body=body, content_type='application/javascript'))
        context.add_init_script('const NativeAudio=Audio;window.Audio=function(){return window.probeAudio=new NativeAudio();};Audio.prototype=NativeAudio.prototype;')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
        page.evaluate('''({doc,voice}) => {
          const select=document.getElementById('audio-voice'); select.value='offline:'+voice;select.dispatchEvent(new Event('change'));
          Audiobook.connect(ReaderModel.parse(doc),'test:cold-continuity','unavailable',true);
          Audiobook.seekChunk(1,0,false); Audiobook.setVolume(0);
          window.probe={started:performance.now(),events:[],done:false};
          for(const event of ['playing','waiting','ended','error']) probeAudio.addEventListener(event,()=>probe.events.push({event,index:Audiobook.state.index,at:(performance.now()-probe.started)/1000,time:probeAudio.currentTime}));
          addEventListener('sutra-finished',()=>probe.done=true);void Audiobook.start();
        }''', {'doc': document, 'voice': args.voice})
        started = time.monotonic()
        heartbeat = 0
        while time.monotonic() - started < 210:
            data = page.evaluate('({state:Audiobook.state,probe})')
            if time.monotonic() - heartbeat > 15:
                heartbeat = time.monotonic()
                print(json.dumps({'mode': report['mode'], 'seconds': round(time.monotonic()-started), 'index': data['state']['index'], 'status': data['state']['status']}, ensure_ascii=False), flush=True)
            if data['state']['status'] == 'error' or data['probe']['done']:
                break
            page.wait_for_timeout(200)
        events = data['probe']['events']
        gaps = []
        last_end = None
        for event in events:
            if event['event'] == 'ended': last_end = event['at']
            if event['event'] == 'playing' and last_end is not None:
                gaps.append(round(max(0, event['at'] - last_end), 3)); last_end = None
        first = next((e['at'] for e in events if e['event'] == 'playing'), None)
        report.update(complete=data['probe']['done'], firstPlaybackSeconds=round(first,3) if first else None,
                      transitionGapsSeconds=gaps, maxTransitionGapSeconds=max(gaps, default=None),
                      waitingEvents=sum(e['event']=='waiting' for e in events), events=events,
                      finalStatus=data['state']['status'], message=data['state']['message'], pageErrors=errors,
                      elapsedSeconds=round(time.monotonic()-started,3), stats=server.STREAM_ENGINE.stats())
        page.evaluate('Audiobook.stop()')
        browser.close()
finally:
    http.shutdown();http.server_close();thread.join()
    (OUT / (report['mode'] + '-' + args.voice + '.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2), encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k not in ['events','stats']}, ensure_ascii=False, indent=2))


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
import urllib.request
import sys
sys.stdout.reconfigure(encoding='utf-8')
out = Path(__file__).parent / 'artifacts'
out.mkdir(exist_ok=True)
results = []
for voice in ['vieneu-thuc-doan', 'vieneu-thien-tam-duc']:
    data = json.dumps({'text': 'Nam mô Bổn Sư Thích Ca Mâu Ni Phật. Xin mời bạn lắng tâm, cùng mở một trang kinh.', 'voice': voice}).encode()
    request = urllib.request.Request('http://127.0.0.1:8090/api/tts', data, {'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=55) as response:
            audio = response.read()
            assert response.headers['Content-Type'] == 'audio/mpeg'
            assert len(audio) > 5000
            (out / (voice + '.mp3')).write_bytes(audio)
            results.append({'voice': voice, 'status': 'pass', 'bytes': len(audio)})
    except Exception as error:
        results.append({'voice': voice, 'status': 'failed', 'error': str(error)})
print(json.dumps(results, ensure_ascii=False))
(out / 'audio-results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
if any(r['status'] != 'pass' for r in results):
    sys.exit(1)

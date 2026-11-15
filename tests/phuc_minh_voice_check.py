"""Live audio smoke check, intentionally separate from deterministic UI acceptance tests."""

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
import os
import urllib.request
from pathlib import Path

BASE = os.environ.get('PHUC_MINH_TEST_URL', 'http://127.0.0.1:8090')
OUT = Path(__file__).parent / 'artifacts'
OUT.mkdir(exist_ok=True)
results = []
for voice in ['vieneu-thuc-doan', 'vieneu-thien-tam-duc']:
    payload = json.dumps({'text': 'Chào bạn đến với tủ sách Chùa Phúc Minh. Đọc, lắng nghe và nuôi dưỡng việc tu học mỗi ngày.', 'voice': voice}).encode()
    request = urllib.request.Request(BASE + '/api/tts', data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(request, timeout=55) as response:
        data = response.read()
        assert response.status == 200 and response.headers['Content-Type'].startswith('audio/')
        assert len(data) > 1000
        (OUT / f'phuc-minh-{voice}.mp3').write_bytes(data)
        results.append({'voice': voice, 'bytes': len(data), 'contentType': response.headers['Content-Type']})
print(json.dumps(results, ensure_ascii=False))

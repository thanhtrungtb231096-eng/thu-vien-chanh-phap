"""Automated security and functionality tests for sharing mode and file whitelist."""

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

import http.client
import json
from pathlib import Path
import subprocess
import sys
import time
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0,str(APP))
import server

def test_unit_logic():
    print("Testing unit logic...")
    # Test host matching
    assert server.is_trusted_host('127.0.0.1')
    assert server.is_trusted_host('localhost')
    assert server.is_trusted_host('::1')
    assert not server.is_trusted_host('evil.com')
    assert not server.is_trusted_host('')

    # Test trycloudflare wildcard
    patterns = {'*.trycloudflare.com'}
    assert server.is_trusted_host('random-words-123.trycloudflare.com', patterns)
    assert server.is_trusted_host('sub.domain.trycloudflare.com', patterns)
    assert not server.is_trusted_host('trycloudflare.com', patterns)
    assert not server.is_trusted_host('evil.trycloudflare.com.attacker.com', patterns)

    # Test file whitelist
    assert server.is_allowed_file(WEB / 'index.html')
    assert server.is_allowed_file(WEB / 'css' / 'main.css')
    assert server.is_allowed_file(WEB / 'js' / 'app.js')
    assert server.is_allowed_file(WEB / 'fonts' / 'font-0-vietnamese.woff2')
    assert server.is_allowed_file(WEB / 'design' / 'lotus-divider.svg')
    assert server.is_allowed_file(SOURCES['Dai_Tang_Kinh_Han'] / '01_A_Ham' / 'T01n0001_viet.md')
    assert server.is_allowed_file(SOURCES['Dai_thua'] / '01_Khe_Kinh' / '01_Quan_Vo_Luong_Tho' / 'Nguyen_van' / 'Quan_Vo_Luong_Tho_viet.md')

    # Test blocked files
    assert not server.is_allowed_file(ROOT / 'web-thuvien.zip')
    assert not server.is_allowed_file(APP / 'server.py')
    assert not server.is_allowed_file(APP / 'launch.py')
    assert not server.is_allowed_file(WEB / 'build_data.py')
    assert not server.is_allowed_file(WEB / 'DEVELOPMENT_HISTORY.md')
    assert not server.is_allowed_file(WEB / 'UI_REDESIGN_PLAN.md')
    assert not server.is_allowed_file(WEB / 'MO_THU_VIEN.cmd')
    assert not server.is_allowed_file(ROOT / 'tests' / 'acceptance.py')
    assert not server.is_allowed_file(ROOT / '.gitignore')
    assert not server.is_allowed_file(DEPENDENCIES)
    assert not server.is_allowed_file(AUDIO_CACHE)
    print("PASS: Unit logic tests")


def test_live_server():
    print("Starting test server on port 8098...")
    test_port = 8098
    proc = subprocess.Popen(
        [sys.executable, '-X', 'utf8', str(APP / 'server.py'), '--port', str(test_port), '--share'],
        cwd=str(ROOT), stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    for _ in range(30):
        try:
            conn = http.client.HTTPConnection('127.0.0.1', test_port, timeout=1)
            conn.request('GET', '/api/voices', headers={'Host': '127.0.0.1'})
            res = conn.getresponse()
            if res.status == 200:
                conn.close()
                break
            conn.close()
        except Exception:
            time.sleep(0.1)
    else:
        err = proc.stderr.read().decode('utf-8', errors='ignore')
        proc.terminate()
        raise RuntimeError(f"Server failed to start on port {test_port}: {err}")

    try:
        # Helper to make requests with custom Host / Origin
        def request(path, method='GET', host='127.0.0.1', origin=None, body=None, headers=None):
            conn = http.client.HTTPConnection('127.0.0.1', test_port, timeout=10)
            req_headers = {'Host': host}
            if origin:
                req_headers['Origin'] = origin
            if headers:
                req_headers.update(headers)
            conn.request(method, path, body=body, headers=req_headers)
            res = conn.getresponse()
            data = res.read()
            conn.close()
            return res.status, res.getheaders(), data

        # 1. Local access to index.html
        status, hdrs, body = request('/web-thuvien/index.html')
        assert status == 200, f"Expected 200, got {status}"
        assert b'<!DOCTYPE html>' in body
        print("PASS: Local access to index.html")

        # 2. Redirect / to /web-thuvien/index.html
        status, hdrs, body = request('/')
        assert status == 200
        assert b"new URL('/web-thuvien/index.html'" in body and b"window.location.replace(target.href)" in body
        print("PASS: Root redirect")

        # 3. Sutra content access
        status, hdrs, body = request('/Dai_Tang_Kinh_Han/01_A_Ham/T01n0001_viet.md')
        assert status == 200
        assert len(body) > 100
        print("PASS: Sutra content serving")

        # 4. Security: Block backup zip
        status, hdrs, body = request('/web-thuvien.zip')
        assert status == 404, f"web-thuvien.zip returned status {status}, expected 404"
        print("PASS: Backup zip blocked (404)")

        # 5. Security: Block server.py
        status, hdrs, body = request('/web-thuvien/server.py')
        assert status == 404, f"server.py returned status {status}, expected 404"
        print("PASS: Server script blocked (404)")

        # 6. Security: Block development docs
        status, hdrs, body = request('/web-thuvien/DEVELOPMENT_HISTORY.md')
        assert status == 404, f"DEVELOPMENT_HISTORY.md returned status {status}, expected 404"
        print("PASS: Dev history markdown blocked (404)")

        # 7. Security: Block tests directory
        status, hdrs, body = request('/web-thuvien/tests/acceptance.py')
        assert status == 404, f"tests/acceptance.py returned status {status}, expected 404"
        print("PASS: Tests directory blocked (404)")

        # 8. Tunnel Host: Cloudflare Quick Tunnel allowed
        tunnel_host = 'peaceful-dharma-lotus.trycloudflare.com'
        status, hdrs, body = request('/web-thuvien/index.html', host=tunnel_host)
        assert status == 200, f"Cloudflare host returned status {status}, expected 200"
        print("PASS: Cloudflare Tunnel host accepted (200)")

        # 9. Tunnel Host: API voices
        status, hdrs, body = request('/api/voices', host=tunnel_host)
        assert status == 200
        voices = json.loads(body.decode())
        assert 'voices' in voices
        print("PASS: /api/voices via Cloudflare host")

        # 10. Tunnel Host: POST /api/tts with matching Origin
        tts_payload = json.dumps({'text': 'Nam Mô Bổn Sư Thích Ca Mâu Ni Phật', 'voice': 'vieneu-thien-tam-duc'}).encode()
        status, hdrs, body = request(
            '/api/tts', method='POST', host=tunnel_host,
            origin=f'https://{tunnel_host}',
            body=tts_payload,
            headers={'Content-Type': 'application/json', 'Content-Length': str(len(tts_payload))}
        )
        if status != 200:
            print("ERROR RESPONSE BODY:", body.decode('utf-8', errors='ignore'))
            proc.terminate()
            stdout, stderr = proc.communicate(timeout=2)
            print("SERVER STDERR:", stderr.decode('utf-8', errors='ignore'))
        assert status == 200, f"/api/tts with matching origin returned {status}"
        assert len(body) > 1000  # valid MP3 data
        print("PASS: /api/tts via Cloudflare host with matching Origin (200, valid MP3)")

        # 11. Security: Block unauthorized host (evil.com)
        status, hdrs, body = request('/web-thuvien/index.html', host='evil-attacker.com')
        assert status == 403, f"evil-attacker.com returned {status}, expected 403"
        print("PASS: Unauthorized host blocked (403)")

        # 12. Security: Block CSRF with mismatched Origin
        status, hdrs, body = request(
            '/api/tts', method='POST', host=tunnel_host,
            origin='https://evil-attacker.com',
            body=tts_payload,
            headers={'Content-Type': 'application/json', 'Content-Length': str(len(tts_payload))}
        )
        assert status == 403, f"Mismatched origin returned {status}, expected 403"
        print("PASS: CSRF from external Origin blocked (403)")

        # 13. CORS preflight OPTIONS request
        status, hdrs, body = request(
            '/api/tts', method='OPTIONS', host=tunnel_host,
            origin=f'https://{tunnel_host}'
        )
        assert status == 204, f"OPTIONS returned {status}, expected 204"
        hdrs_dict = dict(hdrs)
        assert hdrs_dict.get('Access-Control-Allow-Origin') == f'https://{tunnel_host}'
        print("PASS: OPTIONS preflight handled cleanly (204)")

    finally:
        proc.terminate()
        proc.wait()
        print("Test server stopped.")


if __name__ == '__main__':
    test_unit_logic()
    test_live_server()
    print("\nALL SHARE SECURITY & COMPATIBILITY CHECKS PASSED!")

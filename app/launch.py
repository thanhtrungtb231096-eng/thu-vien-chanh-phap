"""Open the library with its required local service, independent of working directory."""

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

import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import urllib.request
import webbrowser
from urllib.parse import urlsplit

ADDRESS = 'http://127.0.0.1:8090'


def read_status():
    try:
        with urllib.request.urlopen(ADDRESS + '/api/library/status', timeout=1) as response:
            data = json.load(response)
            return data if isinstance(data,dict) and 'version' in data and 'indexReady' in data else None
    except (OSError, ValueError):
        return None


def ready(data=None):
    data=read_status() if data is None else data
    if not data or not data.get('indexReady'):return False
    manifest=GENERATED/'library-version.json'
    if manifest.is_file():
        expected=json.loads(manifest.read_text(encoding='utf-8'))['version']
        return data['version']==expected
    version=data['version']
    return isinstance(version,(int,float)) and version>=8


def stop_stale_server():
    if os.name != 'nt':
        raise RuntimeError('Máy chủ ở cổng 8090 đang chạy phiên bản cũ. Cần khởi động lại máy chủ thư viện.')
    port = urlsplit(ADDRESS).port
    target = str(APP / 'server.py').replace("'", "''")
    script = f"""$ErrorActionPreference = 'Stop'
$libraryListener = Get-NetTCPConnection -LocalPort {port} -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $libraryListener) {{ exit 0 }}
$libraryProcess = Get-CimInstance Win32_Process -Filter ('ProcessId = ' + $libraryListener.OwningProcess)
if (-not $libraryProcess -or -not $libraryProcess.CommandLine -or $libraryProcess.CommandLine.IndexOf('{target}', [StringComparison]::OrdinalIgnoreCase) -lt 0) {{ exit 3 }}
Stop-Process -Id $libraryProcess.ProcessId -Force
"""
    result = subprocess.run(['powershell.exe', '-NoProfile', '-NonInteractive', '-Command', script], capture_output=True, text=True, timeout=15)
    if result.returncode:
        raise RuntimeError('Cổng 8090 đang được chương trình khác sử dụng; không tự dừng chương trình đó.')
    for _ in range(30):
        if read_status() is None:
            return
        time.sleep(0.1)
    raise RuntimeError('Chưa dừng được máy chủ thư viện cũ. Hãy thử mở lại sau vài giây.')


def launch(open_browser=True):
    status=read_status()
    if status and not ready(status):
        if not status.get('indexReady'):
            raise RuntimeError('Máy chủ đang chạy nhưng chỉ mục chưa sẵn sàng. Kiểm tra hoặc dựng lại chỉ mục trước khi mở thư viện.')
        print('Đang khởi động lại máy chủ thư viện để cập nhật...')
        stop_stale_server()
        status = read_status()
    if not ready(status):
        log_folder = WORK_CACHE
        log_folder.mkdir(parents=True, exist_ok=True)
        with (log_folder / 'library-server.log').open('ab') as output:
            process = subprocess.Popen(
                [sys.executable, '-u', '-X', 'utf8', str(APP / 'server.py'), '--port', '8090'],
                cwd=str(ROOT), stdin=subprocess.DEVNULL, stdout=output, stderr=output,
                creationflags=(getattr(subprocess, 'DETACHED_PROCESS', 0) | getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0)),
            )
        for _ in range(40):
            if ready():
                break
            if process.poll() is not None:
                raise RuntimeError('Cannot start the library on port 8090. See local/storage/cache/work/library-server.log.')
            time.sleep(0.25)
        else:
            raise RuntimeError('Library startup timed out. See local/storage/cache/work/library-server.log.')
    url = ADDRESS + '/'
    print('Library ready: ' + url)
    if open_browser:
        webbrowser.open(url)
    return url


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    try:
        launch(not args.no_browser)
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)

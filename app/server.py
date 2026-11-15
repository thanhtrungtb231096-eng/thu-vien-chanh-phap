"""Local & Shared library + Vietnamese narration. Run: python app/server.py"""

# Locate the shared path registry from either the workspace or an exported release.
from pathlib import Path as _BootstrapPath
import sys as _bootstrap_sys
_bootstrap_app = next(candidate for ancestor in _BootstrapPath(__file__).resolve().parents
                      for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
                      if (candidate / 'project_paths.py').is_file())
_bootstrap_sys.path.insert(0, str(_bootstrap_app))
from project_paths import ROOT, APP, WEB, BUILD, GENERATED, STATE, DEPENDENCIES, AUDIO_CACHE, WORK_CACHE, CONFIG, DIST, MOBILE_DIST, REPORTS, SOURCES, public_path, public_relative, release_relative
_bootstrap_sys.path.insert(0, str(BUILD))
_bootstrap_sys.path.insert(0, str(DEPENDENCIES))

from pathlib import Path
import argparse
import asyncio
import hashlib
import importlib.util
import json
import mimetypes
import os
import re
import sys
import time
import threading
import socket
import sqlite3
import select
from collections import OrderedDict
from concurrent.futures import Future
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, unquote, parse_qs
from library_services import services_get, services_post
from narration_engine import NarrationEngine, network_access_denied, offline_stream, speech_text
from audio_config import load_audio_config
from offline_tts import LOW_MEMORY_HOST, OFFLINE_VOICES, extract_canonical_sutra_texts, get_offline_voices, is_supported_offline_voice, offline_tts_available, vieneu_stream
from audio_packs import discover_pack_voices, get_pack_manifest, serve_pack_file

mimetypes.add_type('text/html; charset=utf-8', '.html')
mimetypes.add_type('text/css; charset=utf-8', '.css')
mimetypes.add_type('application/javascript; charset=utf-8', '.js')
mimetypes.add_type('text/markdown; charset=utf-8', '.md')
mimetypes.add_type('text/plain; charset=utf-8', '.txt')

sys.path.insert(0, str(DEPENDENCIES))
CACHE = AUDIO_CACHE
VOICES = {}
LIMIT = threading.BoundedSemaphore(5)
JOBS = {}
JOBS_LOCK = threading.Lock()
CACHE_LOCK = threading.Lock()
_CACHE_INDEX = {}
_CACHE_TOTALS = {}
STREAM_ENGINE = None
STREAM_LOCK = threading.Lock()
AUDIO_CONFIG = load_audio_config()
NETWORK_ACCESS_ERROR = {'error':'Máy chủ thư viện bị chặn kết nối giọng đọc. Đóng máy chủ rồi mở lại MO_THU_VIEN.cmd để nghe tiếp.',
                        'code':'network-denied', 'retryable':False}


def stream_engine():
    global STREAM_ENGINE
    with STREAM_LOCK:
        if STREAM_ENGINE is None:STREAM_ENGINE=NarrationEngine(cached_audio,cache_audio,config=AUDIO_CONFIG,read_metadata=cached_audio_metadata,write_metadata=cache_audio_metadata)
        return STREAM_ENGINE


class NarrationBusy(Exception):
    pass


def _ensure_cache_lru(cache_dir: Path):
    key = str(cache_dir.resolve())
    if key not in _CACHE_INDEX:
        entries = []
        for path in cache_dir.glob('*.mp3'):
            try:
                stat = path.stat()
                entries.append((stat.st_mtime, path.name, stat.st_size))
            except OSError:
                continue
        lru = OrderedDict()
        total = 0
        for _, name, size in sorted(entries):
            lru[name] = size
            total += size
        _CACHE_INDEX[key] = lru
        _CACHE_TOTALS[key] = total
    return key, _CACHE_INDEX[key]


def cached_audio(digest):
    try:
        cache_dir = Path(CACHE)
        name = digest + '.mp3'
        value = (cache_dir / name).read_bytes()
        if len(value) < 256:
            return None
        with CACHE_LOCK:
            key = str(cache_dir.resolve())
            lru = _CACHE_INDEX.get(key)
            if lru is not None and name in lru:
                lru.move_to_end(name)
        return value
    except OSError:
        return None


def cached_audio_metadata(digest):
    try:return json.loads((CACHE/(digest+'.json')).read_text(encoding='utf-8'))
    except (OSError,ValueError):return None


def cache_audio_metadata(digest,value):
    temporary=CACHE/(digest+'.'+str(threading.get_ident())+'.json.tmp')
    try:
        with CACHE_LOCK:
            CACHE.mkdir(parents=True,exist_ok=True)
            temporary.write_text(json.dumps(value),encoding='utf-8')
            temporary.replace(CACHE/(digest+'.json'))
        return True
    except OSError:return False
    finally:
        try:temporary.unlink(missing_ok=True)
        except OSError:pass


def cache_audio(digest, value):
    # A full or unavailable cache must not prevent delivery of synthesized audio.
    cache_dir = Path(CACHE)
    name = digest + '.mp3'
    temporary = cache_dir / (digest + '.' + str(threading.get_ident()) + '.tmp')
    max_bytes = max(64, int(getattr(AUDIO_CONFIG, 'cache_mb', 4096))) * 1024 * 1024
    try:
        with CACHE_LOCK:
            cache_dir.mkdir(parents=True, exist_ok=True)
            key, lru = _ensure_cache_lru(cache_dir)
            total = _CACHE_TOTALS[key]
            if name in lru:
                total -= lru.pop(name)
            while lru and total + len(value) > max_bytes:
                old_name, old_size = lru.popitem(last=False)
                try:
                    (cache_dir / old_name).unlink(missing_ok=True)
                    (cache_dir / old_name).with_suffix('.json').unlink(missing_ok=True)
                except OSError:
                    pass
                total = max(0, total - old_size)
            temporary.write_bytes(value)
            temporary.replace(cache_dir / name)
            lru[name] = len(value)
            _CACHE_TOTALS[key] = total + len(value)
    except OSError as error:
        print('Narration cache unavailable:', type(error).__name__, file=sys.stderr)
    finally:
        try:
            temporary.unlink(missing_ok=True)
        except OSError:
            pass


def narration_audio(text, voice, rate, digest):
    engine=stream_engine()
    return completed_audio(engine,engine.create(text,voice,rate,digest))


def completed_audio(engine,job,priority=0):
    engine.attach(job,priority)
    try:
        until=time.monotonic()+min(300,max(120,len(job.text)/7+60))
        with job.condition:
            while not job.done:
                remaining=until-time.monotonic()
                if remaining<=0:raise TimeoutError('synthesis deadline')
                job.condition.wait(min(.25,remaining))
            if job.error=='NetworkAccessDenied':raise PermissionError(13,'speech network access denied')
            if job.error:raise RuntimeError(job.error)
            return b''.join(job.chunks)
    finally:engine.detach(job)

SAFE_FRONTEND_EXTS = {
    '.html', '.css', '.js', '.mjs', '.json',
    '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico',
    '.woff', '.woff2', '.ttf'
}
SAFE_SUTRA_EXTS = {'.md', '.txt', '.pdf'}


def is_trusted_host(host: str, extra_patterns: set = None) -> bool:
    """Check if host matches localhost, CLI patterns, ALLOWED_HOSTS env or allowed_hosts.txt."""
    if not host:
        return False
    host = host.lower().strip()
    if host in {'localhost', '127.0.0.1', '::1'}:
        return True

    patterns = set(extra_patterns or ())
    env_hosts = os.environ.get('ALLOWED_HOSTS', '')
    if env_hosts:
        patterns.update(h.strip() for h in env_hosts.split(',') if h.strip())

    config_file = CONFIG / 'allowed_hosts.txt'
    if config_file.is_file():
        try:
            for line in config_file.read_text(encoding='utf-8').splitlines():
                line = line.strip()
                if line and not line.startswith('#'):
                    patterns.add(line)
        except Exception:
            pass

    for pat in patterns:
        pat = pat.lower().strip()
        if not pat or pat.startswith('#'):
            continue
        if pat == '*' or pat == host:
            return True
        if pat.startswith('*.'):
            suffix = pat[1:]  # e.g. .trycloudflare.com
            if host.endswith(suffix) and len(host) > len(suffix):
                return True
        elif pat.startswith('.'):
            if host.endswith(pat) and len(host) > len(pat):
                return True
    return False


def is_allowed_file(path: Path) -> bool:
    """Strict whitelist: only serve web UI assets and sutra texts. Block dev/runtime/cache files."""
    try:
        resolved = path.resolve()
        if not resolved.is_file():
            return False
        if not resolved.is_relative_to(ROOT):
            return False
        rel = Path(public_relative(resolved))
        # Block hidden files or any directory with leading dots (.runtime, .audio-cache, etc.)
        if any(p.startswith('.') for p in rel.parts):
            return False

        if len(rel.parts) == 1 and rel.parts[0].lower() in ('opengraph.png', 'favicon.ico'):
            return True

        first = rel.parts[0]
        if first == 'web-thuvien':
            # Allow index.html or favicon.ico in web-thuvien root
            if len(rel.parts) == 2 and rel.parts[1].lower() in ('index.html', 'favicon.ico', 'manifest.webmanifest', 'sw.js', 'opengraph.png'):
                return True
            # Allow approved frontend asset folders
            if len(rel.parts) >= 3 and rel.parts[1] in {'css', 'js', 'fonts', 'design', 'data'}:
                if rel.parts[1:3] == ('data', 'phuc-minh') and resolved.suffix.lower() == '.md':
                    return True
                if rel.parts[1:3] == ('data', 'dai-tang-kinh'):
                    if resolved.suffix.lower() == '.md' and len(rel.parts) == 5 and rel.parts[3] == 'text': return True
                    if resolved.suffix.lower() == '.doc' and len(rel.parts) == 5 and rel.parts[3] == 'originals' and rel.name.startswith('ep-'): return True
                return resolved.suffix.lower() in SAFE_FRONTEND_EXTS
            return False

        if first in {'Dai_Tang_Kinh_Han', 'Dai_thua'}:
            return resolved.suffix.lower() in SAFE_SUTRA_EXTS

        if first == 'EbooksProject':
            return resolved.suffix.lower() in {'.doc', '.zip'} and not any(p.startswith('~') for p in rel.parts)

        if first == 'chua phuc minh':
            return resolved.suffix.lower() == '.pdf'

        return False
    except Exception:
        return False


CAPACITOR_NATIVE_ORIGINS = {
    'capacitor://localhost',
    'ionic://localhost',
    'https://localhost',
    'http://tauri.localhost',
    'https://tauri.localhost',
    'tauri://localhost',
}
SAFE_MOBILE_PACK_SEGMENT = re.compile(r'^[A-Za-z0-9._-]{1,120}$')
ALLOWED_MOBILE_PACK_EXTS = {'.json', '.db', '.onnx', '.gz'}


def mobile_packs_root() -> Path:
    custom = os.environ.get('THUVIEN_MOBILE_PACKS_DIR', '').strip()
    if custom:
        return Path(custom).resolve()
    return (MOBILE_DIST / 'cdn-upload').resolve()


def serve_mobile_pack_file(handler, raw_subpath: str, head_only: bool = False):
    parts = [unquote(p) for p in (raw_subpath or '').split('/') if p]
    if not (2 <= len(parts) <= 3) or parts[0] not in {'text-packs', 'tts'}:
        if head_only:
            handler.send_error(404, 'Mobile pack not found')
        else:
            handler.response(404, {'error': 'Không tìm thấy gói ngoại tuyến di động.'})
        return
    if any(p in {'.', '..'} or '..' in p or not SAFE_MOBILE_PACK_SEGMENT.fullmatch(p) for p in parts):
        if head_only:
            handler.send_error(404, 'Mobile pack not found')
        else:
            handler.response(404, {'error': 'Đường dẫn gói ngoại tuyến không hợp lệ.'})
        return
    filename = parts[-1]
    if not any(filename.endswith(ext) for ext in ALLOWED_MOBILE_PACK_EXTS):
        if head_only:
            handler.send_error(404, 'Mobile pack not found')
        else:
            handler.response(404, {'error': 'Định dạng gói ngoại tuyến không hỗ trợ.'})
        return

    cdn_redirect = os.environ.get('THUVIEN_MOBILE_PACK_CDN_URL', '').strip().rstrip('/')
    if cdn_redirect:
        target_url = f"{cdn_redirect}/mobile-packs/{'/'.join(parts)}"
        handler.send_response(302)
        handler.send_header('Location', target_url)
        handler.send_header('Content-Length', '0')
        handler.end_headers()
        return

    root = mobile_packs_root()
    target = root.joinpath(*parts).resolve()
    if not target.is_relative_to(root) or not target.is_file():
        if head_only:
            handler.send_error(404, 'Mobile pack not found')
        else:
            handler.response(404, {'error': 'Chưa có gói ngoại tuyến này trên máy chủ.'})
        return

    try:
        total_size = target.stat().st_size
    except OSError:
        if head_only:
            handler.send_error(404, 'Mobile pack unreadable')
        else:
            handler.response(404, {'error': 'Không đọc được gói ngoại tuyến.'})
        return

    is_json = filename.endswith('.json')
    mime = 'application/json; charset=utf-8' if is_json else 'application/octet-stream'
    cache_control = 'no-cache' if filename == 'manifest.json' else 'public, max-age=31536000, immutable'

    range_header = handler.headers.get('Range', '')
    start = 0
    end = max(0, total_size - 1)
    status = 200
    if range_header and total_size > 0:
        try:
            if not range_header.startswith('bytes=') or ',' in range_header:
                raise ValueError()
            raw_start, raw_end = range_header[6:].split('-', 1)
            if not raw_start:
                suffix = int(raw_end)
                if suffix <= 0:
                    raise ValueError()
                start = max(0, total_size - suffix)
                end = total_size - 1
            else:
                start = int(raw_start)
                end = min(total_size - 1, int(raw_end) if raw_end else total_size - 1)
            if not 0 <= start <= end < total_size:
                raise ValueError()
            status = 206
        except ValueError:
            handler.send_response(416)
            handler.send_header('Content-Range', f'bytes */{total_size}')
            handler.send_header('Content-Length', '0')
            handler.end_headers()
            return

    length = 0 if total_size == 0 else (end - start + 1)
    handler.send_response(status)
    handler.send_header('Content-Type', mime)
    handler.send_header('Accept-Ranges', 'bytes')
    handler.send_header('X-Accel-Buffering', 'no')
    if status == 206:
        handler.send_header('Content-Range', f'bytes {start}-{end}/{total_size}')
    handler.send_header('Content-Length', str(length))
    handler.send_header('Cache-Control', cache_control)
    handler.end_headers()
    if head_only or length == 0:
        return

    try:
        with target.open('rb') as handle:
            if start > 0:
                handle.seek(start)
            remaining = length
            while remaining > 0:
                chunk = handle.read(min(65536, remaining))
                if not chunk:
                    break
                handler.wfile.write(chunk)
                remaining -= len(chunk)
    except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, OSError):
        pass


async def _synthesize_attempt(text, voice, rate='-5%'):
    audio = bytearray()
    stream = vieneu_stream(text, voice, rate)
    async for chunk in stream:
        audio.extend(chunk)
    if not audio:
        raise RuntimeError('empty audio')
    return bytes(audio)


async def synthesize(text, voice, rate='-5%'):
    for attempt in range(AUDIO_CONFIG.retries+1):
        try:return await _synthesize_attempt(text, voice, rate)
        except Exception as error:
            if network_access_denied(error) or attempt>=AUDIO_CONFIG.retries:raise
            await asyncio.sleep(AUDIO_CONFIG.backoff_ms[min(attempt,len(AUDIO_CONFIG.backoff_ms)-1)]/1000)


class LibraryHTTPServer(ThreadingHTTPServer):
    # Windows SO_REUSEADDR can put two versions of the server on the same port.
    allow_reuse_address = (os.name != 'nt')
    request_queue_size = 64
    def server_bind(self):
        if os.name == 'nt':
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        else:
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()


LANDING_HTML = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đại Thư Viện Chánh Pháp - Universal Buddhist Digital Archive</title>
  <meta name="description" content="Thư viện Chánh Pháp: kinh Đại Thừa, Hán Tạng, A-Hàm & Nikāya cùng tủ sách Chùa Phúc Minh gồm 26 tài liệu. Đọc kinh, xem PDF, nghe tiếng Việt và lưu vị trí tu học.">
  <!-- OpenGraph / Facebook / Zalo -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://thuvienchanhphap.duckdns.org/">
  <meta property="og:title" content="Thư Viện Chánh Pháp - Kho Tàng Kinh Điển Phật Giáo">
  <meta property="og:description" content="Kho tàng kinh điển Phật giáo: Đại Thừa, Hán Tạng, A-Hàm, Nikāya. Đọc kinh, xem PDF, nghe pháp thoại tiếng Việt. Hoàn toàn miễn phí.">
  <meta property="og:image" content="https://thuvienchanhphap.duckdns.org/web-thuvien/opengraph.png?v=2">
  <meta property="og:image:secure_url" content="https://thuvienchanhphap.duckdns.org/web-thuvien/opengraph.png?v=2">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Đại Thư Viện Chánh Pháp">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:site_name" content="Thư Viện Chánh Pháp">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Thư Viện Chánh Pháp - Kho Tàng Kinh Điển Phật Giáo">
  <meta name="twitter:description" content="Kho tàng kinh điển Phật giáo: Đại Thừa, Hán Tạng, A-Hàm, Nikāya. Đọc kinh, xem PDF, nghe pháp thoại tiếng Việt.">
  <meta name="twitter:image" content="https://thuvienchanhphap.duckdns.org/web-thuvien/opengraph.png?v=2">
  <noscript><meta http-equiv="refresh" content="0; url=/web-thuvien/index.html#home"></noscript>
  <script>
    // Opening the library starts a fresh visit with the latest verified shell.
    // Updates inside an open reading/listening session still wait for its user.
    function waitForWorker(worker) {
      return new Promise(resolve => {
        const finish = () => { clearTimeout(timer); worker.removeEventListener('statechange', changed); resolve(); };
        const changed = () => { if (['installed', 'redundant'].includes(worker.state)) finish(); };
        const timer = setTimeout(finish, 20000);
        worker.addEventListener('statechange', changed); changed();
      });
    }
    (async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration('/');
          if (registration) {
            await registration.update();
            if (registration.installing) await waitForWorker(registration.installing);
            if (registration.waiting) {
              await new Promise(resolve => {
                const finish = () => { clearTimeout(timer); navigator.serviceWorker.removeEventListener('controllerchange', finish); resolve(); };
                const timer = setTimeout(finish, 5000);
                navigator.serviceWorker.addEventListener('controllerchange', finish);
                registration.waiting.postMessage({type: 'ACTIVATE_UPDATE'});
              });
            }
          }
        }
      } catch { /* A failed update keeps the last verified offline shell. */ }
      const target = new URL('/web-thuvien/index.html', window.location.origin);
      target.searchParams.set('release', __LIBRARY_ENTRY_RELEASE__);
      target.hash = window.location.hash || '#home';
      window.location.replace(target.href);
    })();
  </script>
</head>
<body style="margin:0;background:#0d1117;color:#e6edf3;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
  <p>Đang chuyển hướng đến <a href="/web-thuvien/index.html" style="color:#d4af37;">Đại Thư Viện Chánh Pháp</a>...</p>
</body>
</html>
""".encode('utf-8')


def landing_html():
    try:
        version = json.loads((GENERATED / 'library-version.json').read_text(encoding='utf-8'))['version']
    except (OSError, ValueError, KeyError):
        version = ''
    return LANDING_HTML.replace(b'__LIBRARY_ENTRY_RELEASE__', json.dumps(version).encode('utf-8'))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, url):
        # Only legacy public mounts are reachable; physical workspace paths stay private.
        raw = unquote(urlsplit(url).path)
        if any(part in {'.', '..'} for part in raw.split('/')):
            return str(ROOT / '.blocked-url')
        try:
            return str(public_path(url, base='/'))
        except ValueError:
            return str(ROOT / '.blocked-url')

    def trusted(self):
        host = urlsplit('http://' + self.headers.get('Host', '')).hostname
        server_patterns = getattr(self.server, 'allowed_patterns', set())
        if not is_trusted_host(host, server_patterns):
            return False
        origin = self.headers.get('Origin')
        if not origin:
            return True
        if origin.lower().strip() in CAPACITOR_NATIVE_ORIGINS:
            return True
        origin_host = urlsplit(origin).hostname
        return origin_host is not None and urlsplit(origin).netloc.lower() == self.headers.get('Host', '').lower()

    def is_shell_request(self):
        path = urlsplit(self.path).path
        return path in {'/web-thuvien/index.html', '/web-thuvien/sw.js', '/web-thuvien/manifest.webmanifest'} or path.startswith(('/web-thuvien/css/', '/web-thuvien/js/'))

    def send_head(self):
        if self.is_shell_request():
            # Restoring older file timestamps must replace a newer cached UI.
            for header in ('If-Modified-Since', 'If-None-Match'):
                if header in self.headers:
                    del self.headers[header]
        return super().send_head()

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        if self.is_shell_request():
            self.send_header('Cache-Control', 'no-store')
        if urlsplit(self.path).path == '/web-thuvien/sw.js':
            self.send_header('Service-Worker-Allowed', '/')
        origin = self.headers.get('Origin')
        if origin and self.trusted():
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Vary', 'Origin')
        super().end_headers()

    def response(self, status, data, mime='application/json; charset=utf-8',headers=None):
        payload = json.dumps(data, ensure_ascii=False).encode() if isinstance(data, dict) else data
        self.send_response(status)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(payload)))
        self.send_header('Cache-Control', 'no-store')
        for name,value in (headers or {}).items():self.send_header(name,value)
        self.end_headers()
        try:
            self.wfile.write(payload)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

    def do_OPTIONS(self):
        if not self.trusted():
            self.response(403, {'error': 'Nguồn yêu cầu không hợp lệ.'}); return
        self.send_response(204)
        origin = self.headers.get('Origin')
        if origin:
            self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_HEAD(self):
        if not self.trusted():
            self.response(403, {'error': 'Chỉ truy cập từ máy cục bộ hoặc tên miền được phép chia sẻ.'}); return
        clean_path = urlsplit(self.path).path
        if clean_path=='/share':
            from library_share import preview
            try:payload=preview(self)
            except (ValueError,FileNotFoundError,sqlite3.Error):
                self.send_error(404,'Edition not found');return
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(payload)));self.send_header('Cache-Control','no-store');self.end_headers();return
        if clean_path in ('/', '/index.html'):
            payload = landing_html()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            return
        if clean_path.startswith('/mobile-packs/'):
            serve_mobile_pack_file(self, clean_path.removeprefix('/mobile-packs/'), head_only=True)
            return
        if clean_path.startswith('/api/audio-pack/file/'):
            parts = [unquote(p) for p in clean_path.removeprefix('/api/audio-pack/file/').split('/') if p]
            if len(parts) != 2:
                self.send_error(404, 'Pack file not found')
                return
            serve_pack_file(self, parts[0], parts[1], head_only=True)
            return
        path = Path(self.translate_path(self.path)).resolve()
        if not is_allowed_file(path):
            self.send_error(404, 'File not found')
            return
        super().do_HEAD()

    def do_GET(self):
        if not self.trusted():
            self.response(403, {'error': 'Chỉ truy cập từ máy cục bộ hoặc tên miền được phép chia sẻ.'}); return
        clean_path = urlsplit(self.path).path
        if services_get(self): return
        if clean_path in ('/', '/index.html'):
            self.response(200, landing_html(), 'text/html; charset=utf-8')
            return
        if clean_path.startswith('/mobile-packs/'):
            serve_mobile_pack_file(self, clean_path.removeprefix('/mobile-packs/'), head_only=False)
            return
        if clean_path == '/opengraph.png':
            og_file = WEB / 'opengraph.png'
            if og_file.is_file():
                self.response(200, og_file.read_bytes(), 'image/png')
                return
        if clean_path == '/api/voices':
            offline_ready = bool(AUDIO_CONFIG.offline_tts and offline_tts_available())
            offline_map = get_offline_voices() if offline_ready else {}
            pack_voices = discover_pack_voices(OFFLINE_VOICES, cdn_url=AUDIO_CONFIG.pack_cdn_url)
            self.response(200, {
                'available': offline_ready or bool(pack_voices),
                'onlineAvailable': False,
                'offlineAvailable': offline_ready,
                'audioVersion': 11,
                'progressive': AUDIO_CONFIG.progressive,
                'audioConfig': AUDIO_CONFIG.public(),
                'voices': [],
                'offlineVoices': [{'id': k, 'name': v} for k, v in offline_map.items()] if offline_ready else [],
                'packVoices': pack_voices,
            }); return
        if clean_path == '/api/audio-pack/manifest':
            query = parse_qs(urlsplit(self.path).query, max_num_fields=6)
            book_key = query.get('key', [''])[0]
            voice = query.get('voice', [''])[0]
            doc_version = query.get('version', [''])[0]
            self.response(200, get_pack_manifest(book_key, voice=voice, doc_version=doc_version, cdn_url=AUDIO_CONFIG.pack_cdn_url)); return
        if clean_path.startswith('/api/audio-pack/file/'):
            parts = [unquote(p) for p in clean_path.removeprefix('/api/audio-pack/file/').split('/') if p]
            if len(parts) != 2:
                self.response(404, {'error': 'Không tìm thấy gói âm thanh.'}); return
            serve_pack_file(self, parts[0], parts[1], head_only=False); return
        if clean_path == '/api/narration/stats':
            self.response(200,stream_engine().stats());return
        if clean_path.startswith('/api/audio/'):
            token=clean_path.removeprefix('/api/audio/')
            if len(token)!=32 or any(c not in '0123456789abcdef' for c in token):
                self.response(404,{'error':'Không tìm thấy đoạn nghe.'});return
            job=stream_engine().find(token)
            if job is None or job.cancelled.is_set():
                self.response(404,{'error':'Đoạn nghe đã hết hạn. Nhấn Thử lại.'});return
            if parse_qs(urlsplit(self.path).query).get('status')==['1']:
                if not job.done:
                    stream_engine().prequeue(job,hold=3.0)
                with job.condition:
                    result={'done':job.done,'complete':job.done and not bool(job.error),'error':bool(job.error),'bytes':job.bytes,'retryable':bool(job.error) and job.error!='NetworkAccessDenied','actualVoices':job.actual_voices[:],'activeVoice':job.active_voice}
                    if job.error=='NetworkAccessDenied':result['code']='network-denied'
                self.response(200,result);return
            self.stream_audio(job);return
        if clean_path == '/api/phucminh/page':
            try:
                from phuc_minh_pdf import render_page
                query = parse_qs(urlsplit(self.path).query, max_num_fields=4)
                book_id = query.get('id', [''])[0]
                number = int(query.get('page', ['1'])[0])
                self.response(200, render_page(book_id, number), 'image/png')
            except (ValueError, IndexError):
                self.response(400, {'error': 'Tài liệu hoặc số trang không hợp lệ.'})
            except ImportError:
                self.response(503, {'error': 'Chưa có công cụ xem trang. Hãy mở bản PDF gốc.'})
            except Exception:
                self.response(500, {'error': 'Chưa tải được trang. Hãy thử lại hoặc mở PDF gốc.'})
            return
        path = Path(self.translate_path(self.path)).resolve()
        if not is_allowed_file(path):
            self.response(404, {'error': 'Không tìm thấy.'}); return
        super().do_GET()

    def do_POST(self):
        if not self.trusted():
            self.response(403, {'error': 'Nguồn yêu cầu không hợp lệ.'}); return
        if services_post(self): return
        if self.path == '/api/narration/events':
            try:
                size=int(self.headers.get('Content-Length',0))
                if not 0<size<=512:raise ValueError()
                value=json.loads(self.rfile.read(size))
                event=value.get('event')
                if event not in {'recovery-start','recovery-success','recovery-failed'}:raise ValueError()
            except (ValueError,TypeError,AttributeError):
                self.response(400,{'error':'Sự kiện không hợp lệ.'});return
            stream_engine().event(event)
            self.response(200,{'ok':True});return
        if self.path != '/api/tts':
            self.response(404, {'error': 'Không tìm thấy.'}); return
        try:
            size = int(self.headers.get('Content-Length', 0))
            if not 0 < size <= 16000:
                raise ValueError()
            data = json.loads(self.rfile.read(size))
            text, voice = data.get('text'), data.get('voice')
            if not isinstance(text, str) or not 1 <= len(text.strip()) <= 1800 or not is_supported_offline_voice(voice):
                raise ValueError()
            base_voice = voice.split(':')[0]
            rate = '-20%' if voice.endswith(':slow') else '-5%'
            progressive=data.get('stream',False)
            if not isinstance(progressive,bool):raise ValueError()
        except (ValueError, TypeError, AttributeError):
            self.response(400, {'error': 'Nội dung hoặc giọng tiếng Việt không hợp lệ.'}); return
        policy='v3-verified-primary'
        digest = hashlib.sha256((voice+'\0'+policy+'\0'+speech_text(text)).encode()).hexdigest()
        engine=stream_engine()
        using_custom_provider = engine.provider is not offline_stream
        if not using_custom_provider and not (AUDIO_CONFIG.offline_tts and offline_tts_available()):
            self.response(503, {'error': 'Mô hình giọng AI ngoại tuyến chưa sẵn sàng trên máy chủ.', 'code': 'offline-voice-unavailable', 'retryable': False}); return
        priority=1 if data.get('priority')=='background' else 0
        try:job=engine.create(text,base_voice,rate,digest,priority)
        except RuntimeError:
            self.response(429,{'error':'Bộ đọc đang bận. Hãy thử lại trong giây lát.','code':'busy','retryable':True});return
        if progressive and AUDIO_CONFIG.progressive:
            if priority==0 and not job.done:
                engine.prequeue(job,hold=3.0)
            self.response(200,{'stream':True,'url':'/api/audio/'+job.token,'cached':job.done and not bool(job.error),'statusCheck':True,'estimatedDuration':len(text.split())/(3.3 if rate=='-5%' else 2.8),'actualVoices':job.actual_voices,'activeVoice':job.active_voice})
            return
        try:
            audio = completed_audio(engine,job,priority)
            self.response(200,audio,'audio/mpeg',headers={'X-Narration-Voices':json.dumps(job.actual_voices)})
        except NarrationBusy:
            self.response(429, {'error':'Bộ đọc đang bận. Thư viện sẽ thử lại; bạn có thể tạm dừng nếu cần.', 'code':'busy', 'retryable':True})
        except TimeoutError:
            self.response(504, {'error':'Giọng đọc phản hồi quá lâu. Nhấn Thử lại hoặc đổi giọng; vị trí nghe vẫn được giữ.', 'code':'timeout', 'retryable':True})
        except Exception as error:
            print('Narration unavailable:', type(error).__name__, file=sys.stderr)
            if network_access_denied(error):
                self.response(503,NETWORK_ACCESS_ERROR);return
            self.response(502, {'error': 'Bộ giọng đọc đang tạm gián đoạn. Nhấn Thử lại trong giây lát.', 'code':'upstream', 'retryable':True})

    def stream_audio(self,job):
        engine=stream_engine()
        query=parse_qs(urlsplit(self.path).query)
        priority=1 if query.get('priority')==['background'] else 0
        buffered=query.get('buffered')==['1']
        try:engine.attach(job,priority)
        except RuntimeError:self.response(404,{'error':'Đoạn nghe đã hết hạn.'});return
        hold=0
        try:
            first_deadline=time.monotonic()+engine.config.first_byte_timeout
            with job.condition:
                while not job.done and (buffered or not job.chunks):
                    remaining=first_deadline-time.monotonic()
                    if remaining<=0:break
                    job.condition.wait(min(.25,remaining))
                    if select.select([self.connection],[],[],0)[0] and not self.connection.recv(1,socket.MSG_PEEK):return
            if not job.chunks or buffered and not job.done:
                if not job.done:
                    # The provider may still be completing a valid clip. Keep the
                    # same job alive while the client polls; do not restart its text.
                    hold=3
                    engine.event('first-byte-pending',job)
                    self.response(202,{'pending':True,'retryAfterMs':500});return
                engine.event('first-byte-failed',job,error=job.error or 'TimeoutError')
                if job.error=='NetworkAccessDenied':
                    self.response(503,NETWORK_ACCESS_ERROR);return
                self.response(502,{'error':'Giọng trực tuyến đang gián đoạn. Thư viện sẽ thử tải lại đoạn nghe.','code':'upstream','retryable':True});return
            if job.done:
                if job.error:
                    if job.error=='NetworkAccessDenied':
                        self.response(503,NETWORK_ACCESS_ERROR);return
                    self.response(502,{'error':'Chưa tạo được đoạn nghe. Hãy thử lại.','code':'upstream','retryable':True});return
                value=b''.join(job.chunks)
                range_header=self.headers.get('Range','')
                if range_header:
                    try:
                        if not range_header.startswith('bytes=') or ',' in range_header:raise ValueError()
                        start,end=range_header[6:].split('-',1)
                        if not start:
                            count=int(end)
                            if count<=0:raise ValueError()
                            start=max(0,len(value)-count);end=len(value)-1
                        else:start=int(start);end=min(len(value)-1,int(end)if end else len(value)-1)
                        if not 0<=start<=end<len(value):raise ValueError()
                    except ValueError:
                        self.send_response(416);self.send_header('Content-Range',f'bytes */{len(value)}');self.send_header('Content-Length','0');self.send_header('Cache-Control','no-store');self.end_headers();return
                    status=206
                else:start=0;end=len(value)-1;status=200
                self.send_response(status);self.send_header('Content-Type','audio/mpeg');self.send_header('Accept-Ranges','bytes');self.send_header('Cache-Control','no-store');self.send_header('X-Accel-Buffering','no')
                if status==206:self.send_header('Content-Range',f'bytes {start}-{end}/{len(value)}')
                self.send_header('Content-Length',str(end-start+1));self.end_headers();self.wfile.write(value[start:end+1]);return
            self.protocol_version='HTTP/1.1'
            self.send_response(200);self.send_header('Content-Type','audio/mpeg');self.send_header('Transfer-Encoding','chunked');self.send_header('Cache-Control','no-store');self.send_header('Connection','close');self.send_header('X-Accel-Buffering','no');self.end_headers()
            cursor=0
            while True:
                with job.condition:
                    if cursor==len(job.chunks) and not job.done:job.condition.wait(.25)
                    chunks=job.chunks[cursor:];cursor+=len(chunks);finished=job.done;error=job.error
                for value in chunks:
                    self.wfile.write(f'{len(value):X}\r\n'.encode()+value+b'\r\n');self.wfile.flush()
                if finished:
                    if error:engine.mark_truncated(job)
                    self.wfile.write(b'0\r\n\r\n');self.wfile.flush()
                    break
                if select.select([self.connection],[],[],0)[0] and not self.connection.recv(1,socket.MSG_PEEK):break
        except (OSError,ConnectionError):pass
        finally:
            self.close_connection=True;engine.detach(job,hold=hold)


def start_idle_auto_warmer():
    """Pre-warm uncached sutra segments during idle periods without depleting burstable VPS CPU credits."""
    if not AUDIO_CONFIG.warmup or os.environ.get('THUVIEN_IDLE_WARMER', '1').strip().lower() in {'0', 'false', 'no'}:
        return

    idle_quiet_seconds = 120.0

    def _iter_warm_targets():
        db_path = STATE / 'search.sqlite3'
        if not db_path.is_file():
            return
        rows = []
        try:
            conn = sqlite3.connect(db_path.as_uri() + '?mode=ro', uri=True)
            try:
                rows = conn.execute(
                    "SELECT book_key, meta FROM documents WHERE mode='viet' ORDER BY length(meta) ASC"
                ).fetchall()
            finally:
                conn.close()
        except sqlite3.Error:
            return
        # Prioritize accessible core collections first, then broader canon
        tier = {'daithua': 0, 'phucminh': 1, 'ebooks': 2, 'daitang': 3}
        ordered = sorted(rows, key=lambda r: (tier.get((r[0] or '').split(':', 1)[0], 9), r[0] or ''))
        for voice in ('vieneu-thien-tam-duc', 'vieneu-thuc-doan'):
            for book_key, meta_raw in ordered:
                try:
                    meta = json.loads(meta_raw)
                    md_path = public_path(meta.get('source', ''))
                    if not md_path.is_file() or md_path.suffix.lower() != '.md':
                        continue
                    pack_info = get_pack_manifest(book_key, voice=voice)
                    covered_until = -1
                    if pack_info.get('available') and pack_info.get('packs'):
                        covered_until = max(int(p.get('endIndex', -1)) for p in pack_info['packs'])
                    segments = extract_canonical_sutra_texts(md_path.read_text(encoding='utf-8'))
                except Exception:
                    continue
                for seg_idx, seg in enumerate(segments):
                    if seg_idx <= covered_until or not (1 <= len(seg) <= 1800):
                        continue
                    yield voice, seg

    def _warmer_loop():
        time.sleep(idle_quiet_seconds)
        while True:
            try:
                if not (AUDIO_CONFIG.offline_tts and offline_tts_available()):
                    time.sleep(300.0)
                    continue
                for voice, seg in _iter_warm_targets():
                    while True:
                        engine = stream_engine()
                        idle_for = time.monotonic() - engine.last_client_activity
                        st = engine.stats()
                        if idle_for < idle_quiet_seconds or st['active'] > 0 or st['queued'] > 0:
                            time.sleep(max(15.0, idle_quiet_seconds - idle_for))
                            continue
                        cache_dir = Path(CACHE)
                        with CACHE_LOCK:
                            cache_dir.mkdir(parents=True, exist_ok=True)
                            ckey, _ = _ensure_cache_lru(cache_dir)
                            used_bytes = _CACHE_TOTALS.get(ckey, 0)
                        max_warm_bytes = int(max(64, int(AUDIO_CONFIG.cache_mb)) * 1024 * 1024 * 0.85)
                        if used_bytes >= max_warm_bytes:
                            time.sleep(600.0)
                            continue
                        break

                    digest = hashlib.sha256((voice + '\0v3-verified-primary\0' + speech_text(seg)).encode()).hexdigest()
                    if (Path(CACHE) / f'{digest}.mp3').is_file() and (Path(CACHE) / f'{digest}.json').is_file():
                        continue

                    t0 = time.monotonic()
                    engine = stream_engine()
                    job = engine.create(seg, voice, '-5%', digest, priority=2)
                    if not job.done:
                        try:
                            engine.attach(job, priority=2)
                            try:
                                with job.condition:
                                    while not job.done:
                                        if time.monotonic() - engine.last_client_activity < idle_quiet_seconds:
                                            job.cancelled.set()
                                            break
                                        job.condition.wait(0.5)
                            finally:
                                engine.detach(job)
                        except RuntimeError:
                            pass
                        if job.done and not job.error:
                            engine.event('idle-warm-complete', job)
                    elapsed = max(0.5, time.monotonic() - t0)
                    # Keep average duty cycle <10% on 1/8-OCPU VPS so Oracle burst credits stay full.
                    rest = max(45.0, elapsed * 8.5) if LOW_MEMORY_HOST else max(8.0, elapsed * 2.0)
                    time.sleep(rest)
                time.sleep(600.0)
            except Exception:
                time.sleep(120.0)

    threading.Thread(target=_warmer_loop, name='narration-idle-warmer', daemon=True).start()


if __name__ == '__main__':
    for output in (sys.stdout,sys.stderr):
        if hasattr(output,'reconfigure'):output.reconfigure(line_buffering=True)
    parser = argparse.ArgumentParser(description='Đại Thư Viện Chánh Pháp - Máy Chủ Đọc & Nghe Kinh')
    parser.add_argument('--port', type=int, default=8090, help='Cổng máy chủ (mặc định: 8090)')
    parser.add_argument('--host', default='127.0.0.1', help='IP lắng nghe (mặc định: 127.0.0.1)')
    parser.add_argument('--share', action='store_true', help='Cho phép chia sẻ qua Cloudflare Quick Tunnel (*.trycloudflare.com)')
    parser.add_argument('--allow-host', action='append', default=[], help='Tên miền cụ thể được phép truy cập (vd: mytunnel.trycloudflare.com)')
    args = parser.parse_args()

    patterns = set(args.allow_host)
    if args.share:
        patterns.add('*.trycloudflare.com')

    server = LibraryHTTPServer((args.host, args.port), Handler)
    server.allowed_patterns = patterns

    print(f'Thư viện cục bộ: http://127.0.0.1:{args.port}/web-thuvien/index.html', flush=True)
    if patterns:
        print(f'Chế độ chia sẻ: Đang cho phép các tên miền: {", ".join(sorted(patterns))}', flush=True)
    print(f'Tệp cấu hình tên miền: {CONFIG / "allowed_hosts.txt"}', flush=True)
    if offline_tts_available() and not LOW_MEMORY_HOST:
        stream_engine().warmup()
    if offline_tts_available():
        start_idle_auto_warmer()
    server.serve_forever()

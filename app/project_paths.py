"""Workspace locations and stable public URLs; also supports the exported VPS layout."""
from pathlib import Path
import posixpath
from urllib.parse import unquote, urlsplit

APP = Path(__file__).resolve().parent
ROOT = APP.parent
ORGANIZED = APP.name == 'app'
WEB = APP / 'web' if ORGANIZED else APP
BUILD = ROOT / 'tools/build' if ORGANIZED else APP
MAINTENANCE = ROOT / 'tools/maintenance' if ORGANIZED else APP
GENERATED = ROOT / 'data/generated' if ORGANIZED else WEB / 'data'
LOCAL = ROOT / 'local'
STATE = LOCAL / 'storage/state' if ORGANIZED else ROOT / '.library-state'
DEPENDENCIES = LOCAL / 'runtime/python' if ORGANIZED else ROOT / '.runtime'
AUDIO_CACHE = LOCAL / 'storage/cache/audio' if ORGANIZED else ROOT / '.audio-cache'
AUDIO_PACKS = LOCAL / 'storage/audio-packs' if ORGANIZED else ROOT / '.audio-packs'
TTS_MODELS = LOCAL / 'storage/tts-models' if ORGANIZED else ROOT / '.tts-models'
WORK_CACHE = LOCAL / 'storage/cache/work' if ORGANIZED else ROOT / '.runtime-cache'
CONFIG = ROOT / 'config' if ORGANIZED else WEB
DIST = ROOT.with_name(ROOT.name + ' - VPS') if ORGANIZED else ROOT / 'deploy/goi-vps'
MOBILE_DIST = ROOT.with_name(ROOT.name + ' - Mobile') if ORGANIZED else ROOT / 'deploy/goi-mobile'
REPORTS = ROOT / 'docs/reports' if ORGANIZED else ROOT / 'reports'
SOURCES = {name: (ROOT / 'data/sources' / name if ORGANIZED else ROOT / name)
           for name in ('Dai_thua', 'Dai_Tang_Kinh_Han', 'EbooksProject', 'chua phuc minh')}

# More specific mounts must precede their parent mount.
PUBLIC_MOUNTS = [('web-thuvien/data', GENERATED), ('web-thuvien', WEB), *SOURCES.items()]


def public_path(url, base='/web-thuvien/'):
    """Resolve a catalog URL without changing its stored URL or document identifier."""
    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc or not parsed.path:
        raise ValueError('Expected a local library URL')
    raw = unquote(parsed.path)
    if '\\' in raw or '\x00' in raw:
        raise ValueError('Invalid library URL')
    value = posixpath.normpath(raw if raw.startswith('/') else posixpath.join(base, raw)).lstrip('/')
    if value in {'opengraph.png', 'favicon.ico'}:
        return WEB / value
    for prefix, folder in PUBLIC_MOUNTS:
        if value == prefix or value.startswith(prefix + '/'):
            path = (folder / value[len(prefix):].lstrip('/')).resolve()
            if not path.is_relative_to(folder.resolve()):
                raise ValueError('Library URL outside its collection')
            return path
    raise ValueError('Unknown public library URL: ' + value)


def public_relative(path):
    """Return the legacy public path corresponding to a physical source/asset file."""
    path = Path(path).resolve()
    if not path.is_relative_to(ROOT.resolve()):
        raise ValueError('File outside the workspace')
    for prefix, folder in PUBLIC_MOUNTS:
        folder = folder.resolve()
        if path.is_relative_to(folder):
            return prefix + '/' + path.relative_to(folder).as_posix()
    raise ValueError('File has no public mount')


def release_relative(path):
    """Export the compatible VPS layout independently of the Windows workspace layout."""
    path = Path(path).resolve()
    for folder in (CONFIG, BUILD, MAINTENANCE, APP):
        if path.parent == folder.resolve():
            return 'web-thuvien/' + path.name
    return public_relative(path)

"""Chapter-Sprite pre-rendered sutra audio packs with HTTP Range streaming and R2 CDN support."""
from pathlib import Path
import json
import re
import time
from urllib.parse import quote
import project_paths

SAFE_SEGMENT_RE = re.compile(r'^[A-Za-z0-9._-]{1,140}$')
_PACK_VOICES_CACHE = {'expires': 0.0, 'root': '', 'cdn': '', 'voices': []}


def invalidate_pack_voices_cache() -> None:
    _PACK_VOICES_CACHE['expires'] = 0.0


def discover_pack_voices(voice_labels: dict[str, str], cdn_url: str = '') -> list[dict]:
    """Return offline voice descriptors that have at least one valid Chapter-Sprite pack."""
    if not voice_labels:
        return []
    root = packs_root()
    cdn_clean = (cdn_url or '').strip().rstrip('/')
    now = time.monotonic()
    if (
        now < _PACK_VOICES_CACHE['expires']
        and _PACK_VOICES_CACHE['root'] == str(root)
        and _PACK_VOICES_CACHE['cdn'] == cdn_clean
    ):
        return list(_PACK_VOICES_CACHE['voices'])

    found_ids: set[str] = set()
    if root.is_dir():
        for manifest_path in root.glob('*/manifest.json'):
            try:
                manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
            except (OSError, ValueError):
                continue
            if manifest.get('format') != 'chanh-phap-audio-pack-v1':
                continue
            voices_map = manifest.get('voices')
            if not isinstance(voices_map, dict):
                continue
            pack_folder = manifest_path.parent
            for vid in voice_labels:
                if vid in found_ids:
                    continue
                entry = voices_map.get(vid)
                packs = entry.get('packs') if isinstance(entry, dict) else None
                if not isinstance(packs, list) or not packs:
                    continue
                first = packs[0] if isinstance(packs[0], dict) else {}
                audio_f = first.get('audioFile', '')
                cues_f = first.get('cuesFile', '')
                if cdn_clean or (
                    audio_f
                    and cues_f
                    and (pack_folder / audio_f).is_file()
                    and (pack_folder / cues_f).is_file()
                ):
                    found_ids.add(vid)
            if len(found_ids) == len(voice_labels):
                break

    result = [{'id': vid, 'name': label} for vid, label in voice_labels.items() if vid in found_ids]
    _PACK_VOICES_CACHE.update(expires=now + 10.0, root=str(root), cdn=cdn_clean, voices=result)
    return list(result)


def pack_dir_name(book_key: str) -> str:
    if not isinstance(book_key, str) or not 1 <= len(book_key) <= 160:
        raise ValueError('Invalid book key')
    cleaned = book_key.strip().replace(':', '__').replace('/', '_')
    if not SAFE_SEGMENT_RE.fullmatch(cleaned) or '..' in cleaned:
        raise ValueError('Unsafe book key')
    return cleaned


def packs_root() -> Path:
    return Path(project_paths.AUDIO_PACKS).resolve()


def resolve_pack_file(pack_dir: str, filename: str) -> Path:
    if not SAFE_SEGMENT_RE.fullmatch(pack_dir or '') or '..' in pack_dir:
        raise ValueError('Invalid pack directory')
    if not SAFE_SEGMENT_RE.fullmatch(filename or '') or '..' in filename:
        raise ValueError('Invalid pack filename')
    if not (filename.endswith('.mp3') or filename.endswith('.cues.json') or filename == 'manifest.json'):
        raise ValueError('Unsupported pack file type')
    root = packs_root()
    target = (root / pack_dir / filename).resolve()
    if not target.is_relative_to(root) or not target.is_file():
        raise FileNotFoundError(filename)
    return target


def get_pack_manifest(book_key: str, voice: str = '', doc_version: str = '', cdn_url: str = '') -> dict:
    try:
        folder_name = pack_dir_name(book_key)
    except ValueError:
        return {'available': False, 'packs': []}

    root = packs_root()
    manifest_path = (root / folder_name / 'manifest.json').resolve()
    if not manifest_path.is_relative_to(root) or not manifest_path.is_file():
        return {'available': False, 'packs': []}

    try:
        manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return {'available': False, 'packs': []}

    if manifest.get('format') != 'chanh-phap-audio-pack-v1' or manifest.get('key') != book_key:
        return {'available': False, 'packs': []}

    if doc_version and manifest.get('docVersion') and manifest.get('docVersion') != doc_version:
        return {
            'available': False,
            'reason': 'version-mismatch',
            'manifestDocVersion': manifest.get('docVersion'),
            'packs': [],
        }

    clean_voice = (voice or '').removeprefix('online:').removeprefix('offline:').strip()
    voices_map = manifest.get('voices') if isinstance(manifest.get('voices'), dict) else {}
    available_voices = sorted(voices_map.keys())
    if not clean_voice:
        return {
            'available': bool(available_voices),
            'key': book_key,
            'docVersion': manifest.get('docVersion', ''),
            'segmentation': manifest.get('segmentation', 2),
            'availableVoices': available_voices,
            'packs': [],
        }

    voice_entry = voices_map.get(clean_voice)
    if not isinstance(voice_entry, dict) or not isinstance(voice_entry.get('packs'), list):
        return {
            'available': False,
            'key': book_key,
            'docVersion': manifest.get('docVersion', ''),
            'availableVoices': available_voices,
            'packs': [],
        }

    cdn_base = (cdn_url or '').strip().rstrip('/')
    packs_out = []
    for item in voice_entry['packs']:
        if not isinstance(item, dict):
            continue
        audio_file = item.get('audioFile', '')
        cues_file = item.get('cuesFile', '')
        if not audio_file or not cues_file:
            continue
        # If local file check is used (no external CDN), verify both files exist on disk.
        local_audio = (root / folder_name / audio_file).resolve()
        local_cues = (root / folder_name / cues_file).resolve()
        has_local = (
            local_audio.is_relative_to(root)
            and local_cues.is_relative_to(root)
            and local_audio.is_file()
            and local_cues.is_file()
        )
        if not cdn_base and not has_local:
            continue

        rel_audio = f'{quote(folder_name)}/{quote(audio_file)}'
        rel_cues = f'{quote(folder_name)}/{quote(cues_file)}'
        local_audio_url = f'/api/audio-pack/file/{rel_audio}'
        local_cues_url = f'/api/audio-pack/file/{rel_cues}'
        packs_out.append({
            'id': item.get('id', ''),
            'title': item.get('title', ''),
            'startIndex': int(item.get('startIndex', 0)),
            'endIndex': int(item.get('endIndex', 0)),
            'startBlock': item.get('startBlock', ''),
            'endBlock': item.get('endBlock', ''),
            'duration': float(item.get('duration', 0)),
            'bytes': int(item.get('bytes', 0)),
            'sha256': item.get('sha256', ''),
            'audioUrl': f'{cdn_base}/{rel_audio}' if cdn_base else local_audio_url,
            'cuesUrl': f'{cdn_base}/{rel_cues}' if cdn_base else local_cues_url,
            'fallbackAudioUrl': local_audio_url if has_local else '',
            'fallbackCuesUrl': local_cues_url if has_local else '',
        })

    return {
        'available': bool(packs_out),
        'key': book_key,
        'voice': clean_voice,
        'docVersion': manifest.get('docVersion', ''),
        'segmentation': manifest.get('segmentation', 2),
        'totalSegments': manifest.get('totalSegments', 0),
        'availableVoices': available_voices,
        'packs': packs_out,
    }


def serve_pack_file(handler, pack_dir: str, filename: str, head_only: bool = False):
    try:
        path = resolve_pack_file(pack_dir, filename)
    except ValueError:
        handler.response(400, {'error': 'Tên gói âm thanh không hợp lệ.'})
        return
    except FileNotFoundError:
        if head_only:
            handler.send_error(404, 'Pack file not found')
        else:
            handler.response(404, {'error': 'Chưa có gói âm thanh dựng sẵn cho mục này.'})
        return

    try:
        total_size = path.stat().st_size
    except OSError:
        handler.response(404, {'error': 'Không đọc được gói âm thanh.'})
        return

    is_mp3 = filename.endswith('.mp3')
    mime = 'audio/mpeg' if is_mp3 else 'application/json; charset=utf-8'
    cache_control = 'public, max-age=31536000, immutable' if filename != 'manifest.json' else 'no-cache'

    range_header = handler.headers.get('Range', '') if is_mp3 else ''
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
    if is_mp3:
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
        with path.open('rb') as handle:
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


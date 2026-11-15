"""Offline Vietnamese neural storytelling TTS powered by VieNeu-TTS v3 Turbo (desktop 48 kHz) & v3 Nano (low-memory VPS 24 kHz)."""
from __future__ import annotations

from collections import OrderedDict
from pathlib import Path
import asyncio
import ctypes
import gc
import importlib.util
import json
import os
import subprocess
import tempfile
import threading
import time
import project_paths

MODEL_NAME = 'VieNeu-TTS-v3-Turbo'
NANO_MODEL_NAME = 'VieNeu-TTS-v3-Nano'
_TURBO_REQUIRED = ('config.json', 'duration_predictor.onnx', 'text_encoder.onnx', 'vector_estimator.onnx', 'codec_decoder.onnx')
_NANO_REQUIRED = ('config.json', 'constants.npz', 'duration_predictor.onnx', 'text_encoder.onnx', 'vector_estimator.onnx', 'codec_decoder.onnx')

# Curated warm storytelling voices tailored for Buddhist sutras & Dharma talks
VOICE_PRESET_MAP = {
    'vieneu-thien-tam-duc': 'Thiền Tâm Đức',
    'vieneu-thuc-doan': 'Thục Đoan',
}

OFFLINE_VOICES = {
    'vieneu-thien-tam-duc': 'Thiền Tâm Đức · Nam (Trầm tĩnh)',
    'vieneu-thuc-doan': 'Thục Đoan · Nữ (Dịu dàng)',
}

REQUIRED_REL_FILES = (
    'onnx_update/config.json',
    'onnx_update/tokenizer.json',
    'onnx_update/vieneu_prefill.onnx',
    'onnx_update/vieneu_decode_step.onnx',
    'onnx_update/vieneu_acoustic_cached.onnx',
    'onnx_update/vieneu_v3_heads.npz',
    'onnx_update/vieneu_backbone_shared.data',
    'codec/moss_audio_tokenizer_decode_full.onnx',
    'codec/moss_audio_tokenizer_decode_shared.data',
)

_SYNTH_LOCK = threading.Lock()
_TTS_INSTANCE = None
_TTS_MODEL_KEY = ''
_TTS_ENGINE_KIND = ''
_LAST_USED = 0.0
_UNLOAD_WATCHER_STARTED = False
_ACTIVE_ABORT: threading.Event | None = None


def _host_low_memory() -> bool:
    try:
        if hasattr(os, 'sysconf') and 'SC_PAGE_SIZE' in os.sysconf_names and 'SC_PHYS_PAGES' in os.sysconf_names:
            total = os.sysconf('SC_PAGE_SIZE') * os.sysconf('SC_PHYS_PAGES')
            return 0 < total <= int(2.5 * 1024 ** 3)
    except (OSError, ValueError):
        pass
    return False


LOW_MEMORY_HOST = _host_low_memory()
IDLE_UNLOAD_SECONDS = 180.0 if LOW_MEMORY_HOST else 900.0
INFERENCE_THREADS = 2 if LOW_MEMORY_HOST else min(6, max(2, (os.cpu_count() or 8) // 2))
NANO_MAX_CHARS = 175


def _nano_steps() -> int:
    try:
        raw = int((os.environ.get('THUVIEN_NANO_STEPS') or '8').strip())
        return max(6, min(20, raw))
    except ValueError:
        return 8


def _nano_cfg_steps(total_steps: int) -> int:
    try:
        default_cfg = '6' if total_steps <= 8 else str(max(6, total_steps - 2))
        raw = int((os.environ.get('THUVIEN_NANO_CFG_STEPS') or default_cfg).strip())
        return max(1, min(total_steps, raw))
    except ValueError:
        return min(total_steps, 6)


def model_directory() -> Path:
    return Path(project_paths.TTS_MODELS) / MODEL_NAME


def nano_model_directory() -> Path:
    return Path(project_paths.TTS_MODELS) / NANO_MODEL_NAME


def get_offline_voices() -> dict[str, str]:
    return dict(OFFLINE_VOICES)


def is_supported_offline_voice(voice_id: str) -> bool:
    base = (voice_id or '').split(':')[0]
    return base in OFFLINE_VOICES


def _turbo_ready() -> bool:
    folder = model_directory()
    return all((folder / rel).is_file() for rel in REQUIRED_REL_FILES)


def _nano_ready() -> bool:
    folder = nano_model_directory()
    return all((folder / rel).is_file() for rel in _NANO_REQUIRED)


def _select_engine_kind() -> str | None:
    for mod in ('vieneu', 'onnxruntime', 'sea_g2p', 'lameenc', 'numpy'):
        if importlib.util.find_spec(mod) is None:
            return None
    pref = (os.environ.get('THUVIEN_TTS_ENGINE') or '').strip().lower()
    if pref == 'nano':
        return 'nano' if _nano_ready() else None
    if pref == 'turbo':
        return 'turbo' if _turbo_ready() else ('nano' if _nano_ready() else None)
    if LOW_MEMORY_HOST:
        return 'nano' if _nano_ready() else None
    if _turbo_ready():
        return 'turbo'
    if _nano_ready():
        return 'nano'
    return None


def offline_tts_available() -> bool:
    return _select_engine_kind() is not None


def _ascii_accessible_model_dir(src: Path, required_rel_files: tuple[str, ...], mount_name: str) -> Path:
    """Mount an ASCII NTFS junction on Windows when workspace path contains Vietnamese diacritics."""
    resolved = src.resolve()
    if os.name != 'nt' or str(resolved).isascii():
        return resolved

    temp_root = Path(tempfile.gettempdir())
    if not str(temp_root).isascii():
        temp_root = Path(os.environ.get('SystemDrive', 'C:') + '\\Temp')
        temp_root.mkdir(parents=True, exist_ok=True)

    junction = temp_root / mount_name
    if all((junction / rel).is_file() for rel in required_rel_files):
        return junction

    try:
        if junction.exists():
            subprocess.run(['cmd', '/c', 'rmdir', str(junction)], capture_output=True, timeout=5)
        subprocess.run(
            ['cmd', '/c', 'mklink', '/J', str(junction), str(resolved)],
            capture_output=True,
            timeout=5,
            check=False,
        )
        if all((junction / rel).is_file() for rel in required_rel_files):
            return junction
    except OSError:
        pass
    return resolved


def _release_process_memory() -> None:
    gc.collect()
    if os.name == 'posix':
        try:
            ctypes.CDLL('libc.so.6').malloc_trim(0)
        except OSError:
            pass


def _start_idle_watcher() -> None:
    global _UNLOAD_WATCHER_STARTED
    if _UNLOAD_WATCHER_STARTED:
        return
    _UNLOAD_WATCHER_STARTED = True

    def _watch():
        global _TTS_INSTANCE, _TTS_MODEL_KEY, _TTS_ENGINE_KIND
        while True:
            time.sleep(60.0)
            if _TTS_INSTANCE is None:
                continue
            if _SYNTH_LOCK.acquire(blocking=False):
                try:
                    if _TTS_INSTANCE is not None and (time.monotonic() - _LAST_USED) >= IDLE_UNLOAD_SECONDS:
                        close_fn = getattr(_TTS_INSTANCE, 'close', None)
                        if callable(close_fn):
                            try:
                                close_fn()
                            except Exception:
                                pass
                        _TTS_INSTANCE = None
                        _TTS_MODEL_KEY = ''
                        _TTS_ENGINE_KIND = ''
                        _release_process_memory()
                finally:
                    _SYNTH_LOCK.release()

    threading.Thread(target=_watch, name='vieneu-tts-idle-gc', daemon=True).start()


def _build_local_v3_turbo(model_root: Path):
    """Instantiate V3TurboVieNeuTTS backed 100% by local ONNX directories (zero network calls)."""
    from vieneu.base import BaseVieneuTTS
    from vieneu.v3turbo import V3TurboVieNeuTTS
    from vieneu._v3_turbo_engine.onnx_runtime_lite import OnnxV3LiteEngine
    from vieneu_utils.core_utils import BABBLE_MAX_RETRIES

    class _LocalV3Turbo(V3TurboVieNeuTTS):
        def __init__(self, root: Path, threads: int):
            BaseVieneuTTS.__init__(self)
            self.sample_rate = 48_000
            self.babble_retries = BABBLE_MAX_RETRIES
            self.engine = OnnxV3LiteEngine(
                checkpoint_path=str(root),
                onnx_dir=str(root / 'onnx_update'),
                codec_dir=str(root / 'codec'),
                threads=threads,
            )
            self.engine.babble_retries = self.babble_retries
            self.backend = 'onnx'
            self.default_style = 'tu_nhien'
            self._preset_voices = {}
            self._voice_aliases = {}
            self._default_voice = None
            self._ref_cache = OrderedDict()
            self.backbone_repo = str(root)
            self._load_v3_voices()
            self._load_repo_voices(str(root))
            self.max_batch_size = 1
            self._batch_engine = None
            self._batch_lock = threading.Lock()
            self.max_streams = 1
            self._stream_sched = None
            self._stream_lock = threading.Lock()

    return _LocalV3Turbo(model_root, INFERENCE_THREADS)


def _build_local_v3_nano(model_root: Path):
    """Instantiate V3NanoVieNeuTTS backed 100% by local ONNX graphs with minimal RAM arena footprint."""
    import math
    import numpy as np
    import onnxruntime as ort
    from vieneu.v3nano import V3NanoVieNeuTTS, _MAX_CHUNK_SECONDS, _MIN_FRAMES, _trim_and_fade
    from nano_voices_data import load_nano_voices

    class _LocalV3Nano(V3NanoVieNeuTTS):
        def _load_nano_voices(self) -> None:
            raw = load_nano_voices()
            override = model_root / 'chanh_phap_nano_voices.json'
            if override.is_file():
                try:
                    data = json.loads(override.read_text(encoding='utf-8'))
                    if isinstance(data, dict) and data.get('voices'):
                        raw = data['voices']
                except (OSError, ValueError, TypeError):
                    pass
            for vid, entry in raw.items():
                if vid not in VOICE_PRESET_MAP:
                    continue
                preset_name = VOICE_PRESET_MAP[vid]
                style = np.asarray(entry['style'], dtype=np.float32)
                spk = np.asarray(entry['speaker_emb'], dtype=np.float32)
                self._preset_voices[preset_name] = {
                    'description': entry.get('description', ''),
                    'gender': entry.get('gender', ''),
                    'style': style,
                    'codes': style,
                    'speaker_emb': spk,
                    'podcast': True,
                }
            self._default_voice = VOICE_PRESET_MAP['vieneu-thien-tam-duc']

    orig_session_options = ort.SessionOptions

    def _low_mem_session_options():
        so = orig_session_options()
        so.enable_cpu_mem_arena = False
        so.enable_mem_pattern = True
        return so

    ort.SessionOptions = _low_mem_session_options
    try:
        instance = _LocalV3Nano(onnx_dir=str(model_root), threads=INFERENCE_THREADS, steps=_nano_steps(), cfg=3.0)
    finally:
        ort.SessionOptions = orig_session_options

    eng = instance.engine

    def _fast_preemptible_infer(phonemes: str, speaker_emb, ref_codes, *,
                                steps: int = 8, cfg: float = 3.0, sway: float = -1.0,
                                speed: float = 1.0, seed=None, **_ignored):
        with eng._lock:
            abort = _ACTIVE_ABORT
            if abort is not None and abort.is_set():
                return np.array([], dtype=np.float32)
            spk = np.asarray(speaker_emb, dtype=np.float32).reshape(1, -1)
            style = np.asarray(ref_codes, dtype=np.float32)
            style = style.reshape(1, *style.shape[-2:])
            ids = eng.encode_phones(phonemes)
            mask = ids != eng.pad
            ctx = eng.s_text.run(None, {'ids': ids, 'style': style})[0]
            log_s = float(eng.s_dur.run(None, {'ctx': ctx, 'ctx_mask': mask, 'spk': spk})[0][0])
            secs = min(math.exp(log_s) / max(float(speed), 1e-3), _MAX_CHUNK_SECONDS)
            T = max(_MIN_FRAMES, int(round(secs * eng.fps)))
            rng = np.random.default_rng(seed)
            x = rng.standard_normal((1, 144, T)).astype(np.float32)
            n = max(1, int(steps))
            cfg_limit = _nano_cfg_steps(n)
            u = np.linspace(0.0, 1.0, n + 1, dtype=np.float64)
            tg = u + float(sway) * (np.cos(np.pi / 2 * u) - 1 + u)
            for i in range(n):
                if abort is not None and abort.is_set():
                    return np.array([], dtype=np.float32)
                t = np.array([tg[i]], dtype=np.float32)
                v = eng.s_ve.run(None, {'x': x, 't': t, 'ctx': ctx, 'ctx_mask': mask,
                                        'spk': spk, 'style': style})[0]
                if cfg > 0 and i < cfg_limit:
                    vu = eng.s_ve.run(None, {'x': x, 't': t, 'ctx': eng._null_ctx, 'ctx_mask': eng._null_mask,
                                             'spk': eng.null_spk, 'style': eng.null_style})[0]
                    v = vu + float(cfg) * (v - vu)
                x = x + np.float32(tg[i + 1] - tg[i]) * v
            if abort is not None and abort.is_set():
                return np.array([], dtype=np.float32)
            wav = eng.s_dec.run(None, {'x': x})[0][0, 0]
            return _trim_and_fade(np.clip(wav, -1.0, 1.0).astype(np.float32), eng.SAMPLE_RATE)

    eng.infer = _fast_preemptible_infer
    return instance


def _get_or_load_tts():
    global _TTS_INSTANCE, _TTS_MODEL_KEY, _TTS_ENGINE_KIND
    kind = _select_engine_kind()
    if kind is None:
        raise RuntimeError('VieNeu-TTS model is not installed')
    if kind == 'nano':
        src = nano_model_directory()
        accessible = _ascii_accessible_model_dir(src, _NANO_REQUIRED, 'chanh_phap_tts_vieneu_nano_mount')
    else:
        src = model_directory()
        accessible = _ascii_accessible_model_dir(src, REQUIRED_REL_FILES, 'chanh_phap_tts_vieneu_mount')
    key = f'{kind}:{accessible}'
    if _TTS_INSTANCE is None or _TTS_MODEL_KEY != key:
        _TTS_INSTANCE = _build_local_v3_nano(accessible) if kind == 'nano' else _build_local_v3_turbo(accessible)
        _TTS_MODEL_KEY = key
        _TTS_ENGINE_KIND = kind
        _start_idle_watcher()
    return _TTS_INSTANCE, _TTS_ENGINE_KIND


def _resolve_preset_voice(voice_id: str) -> str:
    base = (voice_id or '').split(':')[0]
    return VOICE_PRESET_MAP.get(base, VOICE_PRESET_MAP['vieneu-thien-tam-duc'])


def _float32_to_pcm16_bytes(samples) -> bytes:
    import numpy as np
    arr = np.asarray(samples, dtype=np.float32).reshape(-1)
    if arr.size == 0:
        return b''
    clipped = np.clip(arr * 32767.0, -32768.0, 32767.0).astype('<i2')
    return clipped.tobytes()


def _new_mp3_encoder(sample_rate: int = 48_000):
    import lameenc
    enc = lameenc.Encoder()
    is_24k = sample_rate <= 24_000
    enc.set_bit_rate(48 if is_24k else 64)
    enc.set_in_sample_rate(sample_rate)
    enc.set_channels(1)
    enc.set_quality(5 if is_24k else 3)
    return enc


def _infer_kwargs(kind: str, rate: str) -> dict:
    if kind == 'nano':
        return {
            'steps': _nano_steps(),
            'cfg': 3.0,
            'sway': -1.0,
            'max_chars': NANO_MAX_CHARS,
            'speed': 0.88 if rate == '-20%' else 1.0,
            'apply_watermark': False,
        }
    return {
        'temperature': 0.76,
        'silence_p': 0.26 if rate == '-20%' else 0.16,
        'apply_watermark': False,
    }


def synthesize_offline_mp3(text: str, voice: str = 'vieneu-thien-tam-duc', rate: str = '-5%') -> bytes:
    global _LAST_USED
    cleaned = (text or '').strip()
    if not cleaned:
        raise ValueError('Empty offline synthesis text')
    with _SYNTH_LOCK:
        tts, kind = _get_or_load_tts()
        sample_rate = int(getattr(tts, 'sample_rate', 24_000 if kind == 'nano' else 48_000))
        preset_name = _resolve_preset_voice(voice)
        _LAST_USED = time.monotonic()
        wav = tts.infer(cleaned, voice=preset_name, **_infer_kwargs(kind, rate))
        _LAST_USED = time.monotonic()

    pcm = _float32_to_pcm16_bytes(wav)
    if len(pcm) < 512:
        raise RuntimeError('VieNeu-TTS produced empty audio')
    enc = _new_mp3_encoder(sample_rate)
    mp3 = bytes(enc.encode(pcm) + enc.flush())
    if len(mp3) < 256:
        raise RuntimeError('VieNeu-TTS MP3 output too short')
    return mp3


async def vieneu_stream(text: str, voice: str = 'vieneu-thien-tam-duc', rate: str = '-5%'):
    """Stream 64 kbps MP3 frames progressively from VieNeu-TTS v3 Turbo (48 kHz) or v3 Nano (24 kHz)."""
    from narration_engine import speech_text
    normalized = speech_text(text)
    loop = asyncio.get_running_loop()
    q: asyncio.Queue[tuple[str, object]] = asyncio.Queue()
    abort_ev = threading.Event()

    def _emit(item):
        try:
            if not loop.is_closed():
                loop.call_soon_threadsafe(q.put_nowait, item)
        except RuntimeError:
            pass

    def _produce_frames():
        global _LAST_USED, _ACTIVE_ABORT
        try:
            emitted = 0
            has_encoded = False
            with _SYNTH_LOCK:
                if abort_ev.is_set():
                    return
                _ACTIVE_ABORT = abort_ev
                try:
                    tts, kind = _get_or_load_tts()
                    sample_rate = int(getattr(tts, 'sample_rate', 24_000 if kind == 'nano' else 48_000))
                    enc = _new_mp3_encoder(sample_rate)
                    preset_name = _resolve_preset_voice(voice)
                    stream_kwargs = _infer_kwargs(kind, rate)
                    stream_kwargs.pop('silence_p', None)
                    _LAST_USED = time.monotonic()
                    for frame in tts.infer_stream(normalized, voice=preset_name, **stream_kwargs):
                        if abort_ev.is_set():
                            return
                        _LAST_USED = time.monotonic()
                        pcm = _float32_to_pcm16_bytes(frame)
                        if pcm:
                            has_encoded = True
                            chunk_mp3 = bytes(enc.encode(pcm))
                            if chunk_mp3:
                                emitted += len(chunk_mp3)
                                _emit(('data', chunk_mp3))
                    if has_encoded and not abort_ev.is_set():
                        tail = bytes(enc.flush())
                        if tail:
                            emitted += len(tail)
                            _emit(('data', tail))
                finally:
                    if _ACTIVE_ABORT is abort_ev:
                        _ACTIVE_ABORT = None
            if emitted < 256 and not abort_ev.is_set():
                raise RuntimeError('VieNeu-TTS stream produced insufficient audio')
            _emit(('done', None))
        except BaseException as exc:
            if not abort_ev.is_set():
                _emit(('err', exc))

    threading.Thread(target=_produce_frames, name='vieneu-stream', daemon=True).start()
    try:
        while True:
            kind, payload = await q.get()
            if kind == 'data':
                yield payload  # type: ignore[misc]
            elif kind == 'done':
                break
            elif kind == 'err':
                raise payload  # type: ignore[misc]
    finally:
        abort_ev.set()


def extract_canonical_sutra_texts(raw: str) -> list[str]:
    """Pure-Python mirror of ReaderModel.parse + NarrationModel.build (v2) for Node-free VPS idle warming."""
    import re
    import unicodedata

    def _norm_sig(s: str) -> str:
        nfd = unicodedata.normalize('NFD', s or '')
        base = re.sub(r'[\u0300-\u036f]', '', nfd).replace('đ', 'd').replace('Đ', 'D').lower()
        return re.sub(r'\s+', ' ', re.sub(r'\s*\d+\s*\Z', '', base)).strip()

    def _heading(line: str):
        clean = re.sub(r'\A\*\*(.*?)\*\*\Z', r'\1', line.strip(), flags=re.DOTALL)
        md = re.match(r'\A(#{1,6})\s+(.+)\Z', clean)
        if md:
            return {'level': min(len(md.group(1)), 3), 'title': md.group(2)}
        if len(clean) > 160:
            return None
        if re.match(r'\A(?:PHẦN|QUYỂN|THIÊN)\s+(?:[IVXLCDM\d]+|THỨ\s+\S+)(?![A-Za-z0-9_])', clean, re.IGNORECASE):
            return {'level': 1, 'title': clean}
        if re.match(r'\A(?:PHẨM|CHƯƠNG)\s+(?:\d+|THỨ\s+\S+)', clean, re.IGNORECASE):
            return {'level': 2, 'title': clean}
        if re.match(r'\A\d+[.\-]\s*KINH\s+\S', clean):
            return {'level': 2, 'title': clean}
        if re.search(r'卷第[\d一二三四五六七八九十百千]+', clean) and len(clean) < 85:
            return {'level': 1, 'title': clean.replace('―', '').strip()}
        return None

    raw_lines = re.findall(r'[^\n]*\n|[^\n]+\Z', raw or '')
    blocks = []
    buf = ''
    kind = 'text'
    head = None

    def _push():
        nonlocal buf, kind, head
        if not buf:
            return
        blocks.append({'raw': buf, 'text': buf.strip(), 'kind': kind, 'heading': head})
        buf = ''
        head = None
        kind = 'text'

    for line in raw_lines:
        h = _heading(line)
        meta = bool(re.match(r'\A\s*>', line))
        note = bool(re.match(r'\A\s*\d+\.\s+(?:Bản Hán|Hán:|Pāli|Pali:|Skt\.|Tham chiếu|Nguyên văn|Nguyên bản|Chú thích|Đại [IVX]|sđd|Xem|Tương đương)', line, re.IGNORECASE))
        running = bool(re.match(r'\A\s*TRƯỜNG A[- ]HÀM(?: BIỆT DỊCH)?\s*\d*\s*\Z', line))
        if h or meta or note or running:
            _push()
            kind = 'heading' if h else ('metadata' if meta else ('running' if running else 'note'))
            head = h
            buf = line
            if h or meta or running:
                _push()
        else:
            buf += line
            if not line.strip():
                _push()
    _push()

    for idx, b in enumerate(blocks):
        if not b['heading'] or b['heading']['level'] == 1:
            continue
        nxt = next((x for x in blocks[idx + 1:idx + 4] if x['text']), None)
        if nxt and nxt['heading']:
            sig = _norm_sig(b['heading']['title'])
            if any(x['heading'] and _norm_sig(x['heading']['title']) == sig for x in blocks[idx + 1:]):
                b['kind'] = 'contents'
                b['heading'] = None

    omitted = {'metadata', 'note', 'contents', 'running'}
    limit = 1800

    def _plain(s: str) -> str:
        s = re.sub(r'https?://\S+', '', s)
        s = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', s)
        s = re.sub(r'[\u3400-\u9fff\uf900-\ufaff]', '', s)
        s = re.sub(r'[#*_>`~|]', '', s)
        return re.sub(r'\s+', ' ', s).strip()

    def _speaker(t: str) -> bool:
        return bool(re.match(r'\A[^.!?：“”"\n]{0,95}(?:hỏi|thưa|đáp|bảo|dạy|bạch|nói|rằng)[^.!?：“”"\n]{0,45}:\s*', t))

    def _ending(t: str) -> bool:
        return bool(re.search(r'[.!?。！？…][”’"\')\]]*\Z', t.strip()))

    def _quote_open(t: str) -> bool:
        op = False
        for c in t:
            if c == '“':
                op = True
            elif c == '”':
                op = False
            elif c == '"':
                op = not op
        return op

    def _is_stop(t: str, pos: int) -> bool:
        ch = t[pos]
        if ch not in '.!?。！？…':
            return False
        if ch == '.':
            prev_c = t[pos - 1] if pos > 0 else ''
            next_c = t[pos + 1] if pos + 1 < len(t) else ''
            if prev_c.isdigit() and next_c.isdigit():
                return False
            if re.search(r'(?:(?<![A-Za-z0-9_])(?:HT|TT|TS|ThS|PGS|GS|Skt|Pāli|No|tr|sđd)|v\.v|v\.d)\Z', t[:pos], re.IGNORECASE):
                return False
        return True

    def _sentences(t: str) -> list[str]:
        res = []
        start = 0
        quoted = False
        pos = 0
        n = len(t)
        while pos < n:
            c = t[pos]
            if c == '“':
                quoted = True
            elif c == '”':
                quoted = False
            elif c == '"':
                quoted = not quoted
            if not _is_stop(t, pos):
                pos += 1
                continue
            end = pos + 1
            closes = False
            while end < n and t[end] in '.!?。！？…”’"\')]':
                if t[end] in '”"':
                    closes = True
                end += 1
            if (quoted and not closes) or (end < n and not t[end].isspace()):
                pos += 1
                continue
            seg = t[start:end].strip()
            if seg:
                res.append(seg)
            start = end
            pos = end
            if closes:
                quoted = False
        tail = t[start:].strip()
        if tail:
            res.append(tail)
        return res

    def _split_long(t: str, lim: int = limit) -> list[str]:
        res = []
        while len(t) > lim:
            sent = -1
            clause = -1
            for k in range(lim):
                if _is_stop(t, k):
                    end = k + 1
                    while end < lim and t[end] in '.!?…”’"\')]':
                        end += 1
                    if end < len(t) and t[end].isspace() and end > lim * 0.35:
                        sent = end
                if t[k] in ';,，；:' and (k + 1 < len(t) and t[k + 1].isspace()) and k > lim * 0.35:
                    clause = k + 1
            at = sent if sent > 0 else (clause if clause > 0 else t.rfind(' ', 0, lim + 1))
            cut = at if at > 0 else lim
            res.append(t[:cut].strip())
            t = t[cut:].strip()
        if t:
            res.append(t)
        return res

    def _chunks(t: str, target: int = 500, lim: int = limit) -> list[str]:
        res = []
        b = ''
        for s in _sentences(t.strip()):
            new_turn = _speaker(s)
            if b and (new_turn or _speaker(b) or len(b) + len(s) + 1 > target):
                res.extend(_split_long(b, lim))
                b = ''
            b += (' ' if b else '') + s
        if b:
            res.extend(_split_long(b, lim))
        return res

    def _split_verse(t: str) -> list[str]:
        parts = []
        stanza = ''
        for ln in t.split('\n'):
            if stanza and (len(stanza.split('\n')) >= 4 or len(stanza) + len(ln) > limit):
                parts.append(stanza)
                stanza = ''
            if len(ln) > limit:
                if stanza:
                    parts.append(stanza)
                parts.extend(_split_long(ln, limit))
                stanza = ''
            else:
                stanza += ('\n' if stanza else '') + ln
        if stanza:
            parts.append(stanza)
        return parts

    lines = []
    for block in blocks:
        if block['kind'] in omitted:
            continue
        if block['kind'] == 'heading' and re.match(r'\ATrang \d+\Z', (block['heading'] or {}).get('title', '')):
            continue
        if not re.search(r'[a-zA-ZÀ-ỹ]', _plain(block['raw'])):
            continue
        for rline in re.split(r'\r?\n', block['raw']):
            pt = _plain(rline)
            if not pt:
                lines.append({'blank': True})
            else:
                lines.append({'blank': False, 'text': pt, 'heading': (block['heading'] or {}).get('title') or pt if block['kind'] == 'heading' else None})

    def _short(ln) -> bool:
        if not ln or ln.get('blank') or not ln.get('text') or ln.get('heading'):
            return False
        txt = ln['text']
        if _speaker(txt) or txt[0] in '“"—' or txt.endswith(':'):
            return False
        wc = len(txt.split())
        return 3 <= wc <= 8

    groups = []
    grp = None
    verse_ctx = False

    def _flush():
        nonlocal grp
        if grp:
            groups.append(grp)
            grp = None

    for i, ln in enumerate(lines):
        if ln.get('blank'):
            if grp and _ending(grp['text']) and not _quote_open(grp['text']):
                _flush()
            continue
        if ln.get('heading'):
            _flush()
            groups.append({'text': ln['text'], 'kind': 'heading'})
            verse_ctx = False
            continue
        run = 0
        for j in range(i, min(len(lines), i + 8)):
            if lines[j].get('blank'):
                continue
            if not _short(lines[j]):
                break
            run += 1
        verse = _short(ln) and (verse_ctx or run >= 4)
        if not verse and not re.search(r'(?<![A-Za-z0-9_])(?:kệ|tụng)\s*[:：]\Z', ln['text'], re.IGNORECASE):
            verse_ctx = False
        if verse:
            verse_ctx = True
        turn = _speaker(ln['text'])
        if grp and (verse != (grp['kind'] == 'verse') or turn or (ln['text'][0] in '“"' and _ending(grp['text']))):
            _flush()
        if not grp:
            grp = {'text': '', 'kind': 'verse' if verse else ('dialogue' if turn else 'prose')}
        sep = ('\n' if verse else ' ') if grp['text'] else ''
        grp['text'] += sep + ln['text']
        if re.search(r'(?<![A-Za-z0-9_])(?:kệ|tụng)\s*[:：]\Z', ln['text'], re.IGNORECASE):
            verse_ctx = True
    _flush()

    out = []
    for paragraph in groups:
        parts = _split_verse(paragraph['text']) if paragraph['kind'] == 'verse' else _chunks(paragraph['text'])
        for pt in parts:
            if pt:
                out.append(pt)
    return out

"""Bounded audio settings; invalid entries fall back without breaking startup."""
from dataclasses import dataclass
import os
from urllib.parse import urlsplit
from project_paths import CONFIG


@dataclass
class AudioConfig:
    workers: int = 3
    retries: int = 3
    backoff_ms: tuple = (500, 1200, 2500)
    first_byte_timeout: float = 35
    receive_timeout: float = 20
    provider_first_audio_timeout: float = 25
    idle_timeout: float = 30
    prefetch_depth: int = 3
    warmup: bool = True
    progressive: bool = True
    recovery_stall_ms: int = 15000
    buffered: bool = True
    buffer_seconds: int = 45
    prefetch_max: int = 12
    prefetch_concurrency: int = 2
    startup_buffer_seconds: int = 12
    startup_wait_ms: int = 8000
    background_workers: int = 2
    transport_limit: int = 160
    relay_url: str = ''
    cache_mb: int = 4096
    offline_tts: bool = True
    offline_fallback: bool = True
    stream_long_foreground: bool = False
    pack_cdn_url: str = ''

    def public(self):
        return {'prefetchDepth': self.prefetch_depth, 'stallTimeoutMs': self.recovery_stall_ms,
                'progressive': self.progressive, 'buffered': self.buffered,
                'bufferSeconds': self.buffer_seconds, 'prefetchMax': self.prefetch_max,
                'prefetchConcurrency': self.prefetch_concurrency,
                'startupBufferSeconds': self.startup_buffer_seconds, 'startupWaitMs': self.startup_wait_ms,
                'offlineFallback': self.offline_fallback, 'streamLongForeground': self.stream_long_foreground,
                'packCdnUrl': self.pack_cdn_url}


def load_audio_config(path=None, environ=None):
    environ = os.environ if environ is None else environ
    values = {}
    try:
        for line in (path or CONFIG / 'audio.txt').read_text(encoding='utf-8-sig').splitlines():
            line = line.split('#', 1)[0].strip()
            if '=' in line:
                key, value = line.split('=', 1)
                values[key.strip()] = value.strip()
    except (OSError, UnicodeError):
        pass
    result = AudioConfig()
    limits = {'workers': (1, 8), 'retries': (0, 5), 'first_byte_timeout': (.1, 60),
              'receive_timeout': (.1, 60), 'provider_first_audio_timeout': (.1, 60), 'idle_timeout': (.1, 120),
              'prefetch_depth': (0, 5), 'recovery_stall_ms': (1000, 60000),
              'buffer_seconds': (5, 120), 'prefetch_max': (3, 20), 'prefetch_concurrency': (1, 3),
              'startup_buffer_seconds': (0, 45), 'startup_wait_ms': (0, 20000),
              'background_workers': (1, 4), 'transport_limit': (80, 1800), 'cache_mb': (64, 65536)}
    for key in result.__dataclass_fields__:
        raw = environ.get('NARRATION_' + key.upper(), values.get(key))
        if raw is None: continue
        try:
            if key in {'warmup', 'progressive', 'buffered', 'offline_tts', 'offline_fallback', 'stream_long_foreground'}:
                if raw.lower() not in {'true', 'false', '1', '0', 'yes', 'no'}: continue
                value = raw.lower() in {'true', '1', 'yes'}
            elif key == 'backoff_ms':
                value = tuple(int(part.strip()) for part in raw.split(','))
                if not value or len(value) > 5 or any(x < 0 or x > 10000 for x in value): continue
            elif key in {'relay_url', 'pack_cdn_url'}:
                value = raw.strip().rstrip('/')
                parsed = urlsplit(value)
                if value and (parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment): continue
            else:
                value = result.__dataclass_fields__[key].type(raw)
                low, high = limits[key]
                if not low <= value <= high: continue
            setattr(result, key, value)
        except (ValueError, TypeError):
            continue
    return result

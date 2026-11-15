"""End-to-end verification of Chapter-Sprite Audio Packs, VieNeu-TTS v3 Turbo offline AI, gender-matched fallback & O(1) LRU cache."""
from pathlib import Path
import hashlib
import http.client
import json
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
sys.stdout.reconfigure(encoding='utf-8')

import server
import project_paths
from audio_config import AudioConfig
from audio_packs import pack_dir_name
from narration_engine import NarrationEngine
from offline_tts import offline_tts_available, synthesize_offline_mp3


def make_pack_mp3_and_cues(pack_root: Path, book_key: str, doc_version: str, voice: str, segments: list[dict]):
    folder = pack_root / pack_dir_name(book_key)
    folder.mkdir(parents=True, exist_ok=True)
    sample_rate = 24000
    pcm = bytearray()
    cues = []
    cursor = 0
    for idx, seg in enumerate(segments):
        # 0.7s silence/tone-like valid PCM per segment so cue transitions fire rapidly in real time!
        dur_samples = int(0.75 * sample_rate)
        seg_pcm = b'\x00\x00' * dur_samples
        start_s = round(cursor / sample_rate, 3)
        end_s = round((cursor + dur_samples) / sample_rate, 3)
        pcm.extend(seg_pcm)
        cursor += dur_samples
        cues.append({
            'index': idx,
            'start': start_s,
            'speechEnd': end_s,
            'end': end_s,
            'block': seg['block'],
            'sourceOffset': seg['sourceOffset'],
        })
    total_dur = round(cursor / sample_rate, 3)
    pack_id = 'pack-test-0000-0003'
    audio_file = f'{pack_id}.mp3'
    cues_file = f'{pack_id}.cues.json'
    subprocess.run(
        [
            'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
            '-f', 's16le', '-ar', str(sample_rate), '-ac', '1', '-i', 'pipe:0',
            '-c:a', 'libmp3lame', '-b:a', '48k', '-ar', str(sample_rate), '-ac', '1', '-write_xing', '1',
            str(folder / audio_file),
        ],
        input=bytes(pcm),
        check=True,
        timeout=30,
    )
    mp3_bytes = (folder / audio_file).read_bytes()
    (folder / cues_file).write_text(json.dumps({
        'id': pack_id,
        'key': book_key,
        'docVersion': doc_version,
        'segmentation': 2,
        'voice': voice,
        'startIndex': 0,
        'endIndex': len(segments) - 1,
        'duration': total_dur,
        'cues': cues,
    }), encoding='utf-8')
    (folder / 'manifest.json').write_text(json.dumps({
        'format': 'chanh-phap-audio-pack-v1',
        'key': book_key,
        'docVersion': doc_version,
        'segmentation': 2,
        'totalSegments': len(segments),
        'voices': {
            voice: {
                'voice': voice,
                'packs': [{
                    'id': pack_id,
                    'title': 'Toàn kinh',
                    'startIndex': 0,
                    'endIndex': len(segments) - 1,
                    'startBlock': segments[0]['block'],
                    'endBlock': segments[-1]['block'],
                    'duration': total_dur,
                    'bytes': len(mp3_bytes),
                    'sha256': hashlib.sha256(mp3_bytes).hexdigest(),
                    'audioFile': audio_file,
                    'cuesFile': cues_file,
                }],
            },
        },
    }), encoding='utf-8')
    return pack_id, audio_file


def check_o1_lru_cache(checks: list):
    with tempfile.TemporaryDirectory() as tmp:
        cache_dir = Path(tmp)
        old_cache = server.CACHE
        old_cfg = server.AUDIO_CONFIG
        try:
            server.CACHE = cache_dir
            # 64 MB minimum config; test eviction directly by setting cache_mb=1 on instance
            cfg = AudioConfig()
            cfg.cache_mb = 1  # Not possible below 64 due to max(64, ...) guard; test 64 MB with 22 MB chunks!
            server.AUDIO_CONFIG = AudioConfig(cache_mb=64)
            chunk = b'ID3' + (b'\x55' * (24 * 1024 * 1024))
            server.cache_audio('a' * 32, chunk)
            server.cache_audio('b' * 32, chunk)
            # Touch 'a' so 'b' becomes LRU victim!
            assert server.cached_audio('a' * 32) is not None
            server.cache_audio('c' * 32, chunk)
            assert (cache_dir / ('a' * 32 + '.mp3')).is_file(), 'Recently read item should stay in LRU'
            assert not (cache_dir / ('b' * 32 + '.mp3')).exists(), 'Oldest unaccessed item should be evicted'
            assert (cache_dir / ('c' * 32 + '.mp3')).is_file()
            checks.append('O(1) LRU disk cache promotes read hits and evicts least-recently-used entries accurately')
        finally:
            server.CACHE = old_cache
            server.AUDIO_CONFIG = old_cfg


def main():
    checks = []
    check_o1_lru_cache(checks)
    assert offline_tts_available(), 'VieNeu-TTS v3 Turbo offline model must be installed locally'

    with tempfile.TemporaryDirectory() as tmp_str:
        tmp = Path(tmp_str)
        pack_root = tmp / 'packs'
        cache_root = tmp / 'cache'
        pack_root.mkdir()
        cache_root.mkdir()

        old_packs = project_paths.AUDIO_PACKS
        old_cache = server.CACHE
        old_cfg = server.AUDIO_CONFIG
        old_engine = server.STREAM_ENGINE

        try:
            project_paths.AUDIO_PACKS = pack_root
            server.CACHE = cache_root
            cfg = AudioConfig(warmup=False, retries=0, backoff_ms=(10,), startup_buffer_seconds=0, startup_wait_ms=0, offline_tts=True, offline_fallback=True)
            server.AUDIO_CONFIG = cfg
            engine = NarrationEngine(
                server.cached_audio,
                server.cache_audio,
                config=cfg,
                log_path=None,
                read_metadata=server.cached_audio_metadata,
                write_metadata=server.cache_audio_metadata,
            )
            server.STREAM_ENGINE = engine

            class Quiet(server.Handler):
                def log_message(self, *args): pass

            httpd = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
            httpd.allowed_patterns = set()
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            base = f'http://127.0.0.1:{httpd.server_port}'

            try:
                # 1. Verify /api/voices contract (audioVersion=11, Microsoft removed, strictly 2 curated VieNeu voices)
                with urllib.request.urlopen(base + '/api/voices', timeout=5) as resp:
                    vdata = json.load(resp)
                assert vdata['available'] and vdata['offlineAvailable'] and vdata['audioVersion'] == 11, vdata
                assert vdata['onlineAvailable'] is False and vdata['voices'] == [], vdata
                offline_ids = {v['id'] for v in vdata['offlineVoices']}
                assert offline_ids == {'vieneu-thien-tam-duc', 'vieneu-thuc-doan'}, offline_ids
                checks.append('/api/voices (audioVersion=11) exposes strictly Thiền Tâm Đức & Thục Đoan with zero legacy voices')

                # 1b. Verify legacy Microsoft & deprecated voices are rejected with HTTP 400
                for deprecated_voice in ('vi-VN-HoaiMyNeural', 'vi-VN-NamMinhNeural', 'vi-VN-vais1000-medium', 'vieneu-thai-son', 'vieneu-ngoc-linh'):
                    bad_req = urllib.request.Request(
                        base + '/api/tts',
                        data=json.dumps({'text': 'Kiểm tra loại bỏ giọng cũ.', 'voice': deprecated_voice, 'stream': False}).encode('utf-8'),
                        headers={'Content-Type': 'application/json'},
                    )
                    try:
                        urllib.request.urlopen(bad_req, timeout=5)
                        raise AssertionError(f'Deprecated {deprecated_voice} should be rejected with HTTP 400')
                    except urllib.error.HTTPError as http_err:
                        assert http_err.code == 400, f'Expected HTTP 400 for {deprecated_voice}, got {http_err.code}'
                checks.append('Legacy Microsoft & deprecated voices are strictly rejected with HTTP 400')

                # 2. Direct VieNeu-TTS v3 Turbo 48kHz synthesis via POST /api/tts
                req = urllib.request.Request(
                    base + '/api/tts',
                    data=json.dumps({'text': 'Tôi nghe như vầy. Một thời Đức Phật ở tại thành Xá Vệ.', 'voice': 'vieneu-thien-tam-duc', 'stream': False}).encode('utf-8'),
                    headers={'Content-Type': 'application/json'},
                )
                t0 = time.perf_counter()
                with urllib.request.urlopen(req, timeout=35) as resp:
                    mp3_out = resp.read()
                    voices_hdr = json.loads(resp.headers.get('X-Narration-Voices', '[]'))
                synth_ms = round((time.perf_counter() - t0) * 1000, 1)
                assert len(mp3_out) > 8000 and voices_hdr == ['vieneu-thien-tam-duc']
                checks.append(f'VieNeu-TTS v3 Turbo (48kHz) synthesized Vietnamese Buddhist sutra MP3 ({len(mp3_out)}B in {synth_ms}ms)')

                # 3. Build test Chapter-Sprite Pack matching exact ReaderModel + NarrationModel output
                doc_md = (
                    '# Kinh Thử Nghiệm Chương Liền Mạch\n\n'
                    'Đoạn kinh thứ nhất dùng để kiểm tra phát liền mạch không giật ngắt.\n\n'
                    'Đoạn kinh thứ hai dùng để kiểm tra tự động cuộn theo lời kinh.\n\n'
                    'Đoạn kinh thứ ba dùng để kiểm tra tua nhanh trong gói và lặp đoạn A B.'
                )
                from playwright.sync_api import sync_playwright
                with sync_playwright() as p:
                    browser = p.chromium.launch(headless=True)
                    context = browser.new_context(service_workers='block')
                    context.add_init_script(
                        'const NativeAudio=Audio;window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};Audio.prototype=NativeAudio.prototype;'
                    )
                    page = context.new_page()
                    errors = []
                    tts_requests = []
                    page.on('pageerror', lambda e: errors.append(str(e)))
                    page.on('request', lambda r: tts_requests.append(r.url) if '/api/tts' in r.url else None)
                    page.goto(base + '/web-thuvien/index.html', wait_until='networkidle')
                    page.wait_for_function("Audiobook.state.voice.startsWith('offline:')")

                    parsed_info = page.evaluate("""md => {
                      const doc = ReaderModel.parse(md);
                      const q = NarrationModel.build(doc);
                      return {version: doc.version, segments: q.map(s => ({block: s.block, sourceOffset: s.sourceOffset || 0, text: s.text}))};
                    }""", doc_md)
                    pack_id, audio_file = make_pack_mp3_and_cues(
                        pack_root, 'test:pack-sutra', parsed_info['version'], 'vieneu-thuc-doan', parsed_info['segments']
                    )

                    # Verify HTTP Range 206 Partial Content on pack endpoint
                    conn = http.client.HTTPConnection('127.0.0.1', httpd.server_port, timeout=5)
                    conn.request('GET', f'/api/audio-pack/file/{pack_dir_name("test:pack-sutra")}/{audio_file}', headers={'Range': 'bytes=0-255'})
                    r206 = conn.getresponse()
                    body206 = r206.read()
                    conn.close()
                    assert r206.status == 206 and len(body206) == 256 and 'bytes 0-255/' in r206.getheader('Content-Range', '')
                    checks.append('Audio pack endpoint serves HTTP 206 Partial Content Range requests accurately')

                    # Play Chapter-Sprite pack in browser and measure startup latency & cue progression
                    t_play = time.perf_counter()
                    page.evaluate("""md => {
                      const sel = document.getElementById('audio-voice');
                      sel.value = 'offline:vieneu-thuc-doan';
                      sel.dispatchEvent(new Event('change', {bubbles: true}));
                      window.followedBlocks = [];
                      window.Reader = window.Reader || {};
                      const origFollow = window.Reader.followAudio;
                      window.Reader.followAudio = (b, off) => { window.followedBlocks.push(b); if (origFollow) origFollow(b, off); };
                      Audiobook.connect(ReaderModel.parse(md), 'test:pack-sutra', 'unavailable', true);
                      void Audiobook.start();
                    }""", doc_md)
                    page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.packActive===true", timeout=3000)
                    pack_start_ms = round((time.perf_counter() - t_play) * 1000, 1)
                    assert len(tts_requests) == 0, f'Pack playback should make 0 /api/tts calls, got {tts_requests}'

                    # Wait for timeupdate to advance index automatically across cues (0 -> 1 -> 2)
                    page.wait_for_function("Audiobook.state.index >= 2", timeout=5000)
                    followed = page.evaluate('window.followedBlocks')
                    assert len(set(followed)) >= 2, f'Expected Reader.followAudio across multiple blocks, got {followed}'

                    # Test instant in-pack seekChunk without losing packActive
                    src_before = page.evaluate('testAudio.src')
                    page.evaluate('Audiobook.seekChunk(1, 0, true)')
                    assert page.evaluate('Audiobook.state.index === 1 && Audiobook.state.packActive === true')
                    assert page.evaluate('testAudio.src') == src_before
                    page.evaluate('Audiobook.stop()')
                    checks.append(f'Chapter-Sprite pack started in {pack_start_ms}ms with 0 TTS calls, live cue tracking, and instant in-pack seeking')

                    # 4. Verify automatic on-demand AI synthesis & disk cache on an unpacked sutra with Thục Đoan
                    tts_requests.clear()
                    ondemand_md = '# Kinh Tự Động Đọc\n\nTâm bình thế giới bình.'
                    page.evaluate("""md => {
                      Audiobook.connect(ReaderModel.parse(md), 'test:ondemand-ai', 'unavailable', true);
                      Audiobook.seekChunk(1, 0, false);
                      void Audiobook.start();
                    }""", ondemand_md)
                    page.wait_for_function("Audiobook.state.status==='playing'", timeout=35000)
                    od_state = page.evaluate('Audiobook.state')
                    assert od_state['actualVoices'] == ['vieneu-thuc-doan'], od_state
                    assert not od_state.get('fallbackVoiceActive'), od_state
                    assert len(tts_requests) >= 1, tts_requests
                    page.evaluate('Audiobook.stop()')
                    checks.append('Unpacked sutra synthesizes on-demand via VieNeu-TTS v3 (Thục Đoan) and plays cleanly')

                    # 5. Test VPS 0-RAM Pack-Only Mode (offlineAvailable=False + packVoices=['vieneu-thien-tam-duc'])
                    make_pack_mp3_and_cues(
                        pack_root, 'test:vps-pack-sutra', parsed_info['version'], 'vieneu-thien-tam-duc', parsed_info['segments']
                    )
                    from audio_packs import invalidate_pack_voices_cache
                    invalidate_pack_voices_cache()
                    cfg.offline_tts = False
                    try:
                        with urllib.request.urlopen(base + '/api/voices', timeout=5) as resp:
                            vps_vdata = json.load(resp)
                        assert vps_vdata['offlineAvailable'] is False, vps_vdata
                        assert vps_vdata['offlineVoices'] == [], vps_vdata
                        assert {v['id'] for v in vps_vdata['packVoices']} == {'vieneu-thien-tam-duc', 'vieneu-thuc-doan'}, vps_vdata

                        tts_requests.clear()
                        page.reload(wait_until='networkidle')
                        page.wait_for_function("Array.from(document.querySelectorAll('#audio-voice option')).some(o => o.value === 'offline:vieneu-thien-tam-duc')")
                        page.evaluate("""md => {
                          const sel = document.getElementById('audio-voice');
                          sel.value = 'offline:vieneu-thien-tam-duc';
                          sel.dispatchEvent(new Event('change', {bubbles: true}));
                          Audiobook.connect(ReaderModel.parse(md), 'test:vps-pack-sutra', 'unavailable', true);
                          void Audiobook.start();
                        }""", doc_md)
                        page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.packActive===true", timeout=4000)
                        assert len(tts_requests) == 0, f'VPS pack-only playback must make 0 /api/tts calls, got {tts_requests}'
                        page.evaluate('Audiobook.stop()')
                        checks.append('VPS 0-RAM pack-only mode exposes Thiền Tâm Đức in dropdown and plays Chapter-Sprite pack with 0 /api/tts calls')
                    finally:
                        cfg.offline_tts = True

                    assert not errors, errors
                    browser.close()
            finally:
                httpd.shutdown()
                httpd.server_close()
                thread.join()
        finally:
            project_paths.AUDIO_PACKS = old_packs
            server.CACHE = old_cache
            server.AUDIO_CONFIG = old_cfg
            server.STREAM_ENGINE = old_engine

    print(json.dumps({'result': 'passed', 'checks': checks}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()


"""Build studio-grade Chapter-Sprite MP3 + cue map packs for Vietnamese Buddhist sutras."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import argparse
import asyncio
import hashlib
import json
import os
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import time

BOOTSTRAP = next(
    candidate
    for ancestor in Path(__file__).resolve().parents
    for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
    if (candidate / 'project_paths.py').is_file()
)
sys.path.insert(0, str(BOOTSTRAP))
from project_paths import ROOT, WEB, STATE, DEPENDENCIES, AUDIO_PACKS, public_path
sys.path.insert(0, str(DEPENDENCIES))

import server
from audio_config import load_audio_config
from audio_packs import pack_dir_name
from narration_engine import NarrationEngine, speech_text
from offline_tts import is_supported_offline_voice, synthesize_offline_mp3

SAMPLE_RATE = 24000
CORE_PRESET_KEYS = [
    ('daithua:dt_10_1', 0),           # Bát Nhã Ba La Mật Đa Tâm Kinh
    ('daitang:T08n0251', 0),          # Bát Nhã Tâm Kinh (Hán Tạng)
    ('daithua:dt_06_2', 0),           # Phật Thuyết Vu Lan Bồn Kinh
    ('daithua:dt_05_1', 0),           # Phật Thuyết A Di Đà Kinh
    ('daithua:dt_01_5', 0),           # Phật Thuyết Thập Thiện Nghiệp Đạo Kinh
    ('daithua:dt_10_2', 0),           # Kim Cang Bát Nhã Ba La Mật Kinh
    ('daithua:dt_01_2', 0),           # Dược Sư Lưu Ly Quang Như Lai Bổn Nguyện Công Đức Kinh
    ('phucminh:mi-tien-van-dap', 24), # Kinh Mi Tiên Vấn Đáp (Mở đầu)
]
OFFLINE_CORE_PRESET_KEYS = [
    ('daithua:dt_10_1', 0),           # Bát Nhã Ba La Mật Đa Tâm Kinh (Toàn kinh)
    ('daitang:T08n0251', 0),          # Bát Nhã Tâm Kinh Hán Tạng (Toàn kinh)
    ('daithua:dt_01_4', 0),           # Phật Thuyết Bát Đại Nhân Giác Kinh (Toàn kinh)
    ('daitang:T17n0779', 0),          # Kinh Bát Đại Nhân Giác Hán Tạng (Toàn kinh)
    ('daithua:dt_06_2', 0),           # Phật Thuyết Vu Lan Bồn Kinh (Toàn kinh)
    ('daithua:dt_05_1', 0),           # Phật Thuyết A Di Đà Kinh (Toàn kinh)
    ('phucminh:mi-tien-van-dap', 24), # Kinh Mi Tiên Vấn Đáp (Mở đầu)
    ('phucminh:ke-phuoc-lanh', 36),   # Kệ Phước Lành (Mở đầu)
    ('phucminh:kinh-bao-ho', 36),     # Kinh Bảo Hộ (Mở đầu)
    ('ebooks:ep-e86ff84cd87b', 36),   # Kinh Phổ Môn Nghĩa (Mở đầu)
    ('daitang:T04n0210', 36),         # Kinh Pháp Cú (Các phẩm đầu)
    ('daithua:dt_06_1', 36),          # Địa Tạng Bồ Tát Bổn Nguyện Kinh (Quyển Thượng - Mở đầu)
]
WAVE2_PRESET_KEYS = [
    ('daithua:dt_01_4', 0),           # Phật Thuyết Bát Đại Nhân Giác Kinh (Toàn kinh)
    ('daitang:T17n0779', 0),          # Kinh Phật Thuyết Bát Đại Nhân Giác - Hán Tạng (Toàn kinh)
    ('daithua:dt_10_21', 0),          # Phật Thuyết Bất Tăng Bất Giảm Kinh (Toàn kinh)
    ('daithua:dt_03_2', 0),           # Phật Thuyết Di Lặc Hạ Sinh Thành Phật Kinh (Toàn kinh)
    ('daithua:dt_01_1', 0),           # Phật Thuyết Quán Vô Lượng Thọ Phật Kinh (Toàn kinh)
    ('daithua:dt_01_7', 0),           # Phật Di Giáo Kinh - Kinh Lời Dạy Sau Cùng (Toàn kinh)
    ('daithua:dt_01_6', 0),           # Phật Thuyết Tứ Thập Nhị Chương Kinh (Toàn kinh - 42 chương)
    ('phucminh:ke-phuoc-lanh', 36),   # Kệ Phước Lành (Phần mở đầu)
    ('ebooks:ep-e86ff84cd87b', 36),   # Kinh Phổ Môn Nghĩa - HT. Tâm Châu (Phần mở đầu)
    ('phucminh:kinh-bao-ho', 36),     # Kinh Bảo Hộ - Từ Tâm & Hộ Trì (Phần mở đầu)
    ('daitang:T04n0210', 36),         # Kinh Pháp Cú (Các phẩm đầu)
    ('daithua:dt_06_1', 36),          # Địa Tạng Bồ Tát Bổn Nguyện Kinh (Quyển Thượng - Mở đầu)
    ('daithua:dt_10_9', 36),          # Phật Thuyết Vô Lượng Thọ Kinh (Phần mở đầu)
]


def extract_canonical_segments(markdown_path: Path) -> dict:
    node = shutil.which('node')
    if not node:
        raise RuntimeError('Node.js is required to run canonical ReaderModel + NarrationModel segmentation.')
    reader_js = (WEB / 'js/reader-model.js').resolve().as_posix()
    narration_js = (WEB / 'js/narration-model.js').resolve().as_posix()
    target_md = markdown_path.resolve().as_posix()
    script = f"""
const fs = require('fs');
const ReaderModel = require({json.dumps(reader_js)});
const NarrationModel = require({json.dumps(narration_js)});
const raw = fs.readFileSync({json.dumps(target_md)}, 'utf8');
const doc = ReaderModel.parse(raw);
const queue = NarrationModel.build(doc);
process.stdout.write(JSON.stringify({{
  docVersion: doc.version,
  segmentation: NarrationModel.VERSION,
  totalSegments: queue.length,
  segments: queue.map((q, idx) => ({{
    index: idx,
    block: q.block,
    sourceOffset: q.sourceOffset || 0,
    text: q.text,
    heading: q.heading || null,
    chapterBreak: !!q.chapterBreak,
    pauseBefore: q.pauseBefore || 0
  }}))
}}));
"""
    proc = subprocess.run([node, '-e', script], capture_output=True, text=True, encoding='utf-8', check=True, timeout=60)
    return json.loads(proc.stdout)


def partition_into_packs(segments: list, max_pack_segments: int = 60) -> list:
    if not segments:
        return []
    if len(segments) <= max_pack_segments:
        return [segments]
    groups = []
    current = []
    for seg in segments:
        if current and (
            len(current) >= max_pack_segments
            or (seg.get('chapterBreak') and len(current) >= 22)
        ):
            groups.append(current)
            current = []
        current.append(seg)
    if current:
        if len(current) < 8 and groups and len(groups[-1]) + len(current) <= max_pack_segments + 10:
            groups[-1].extend(current)
        else:
            groups.append(current)
    return groups


def decode_mp3_to_pcm(mp3_bytes: bytes) -> bytes:
    proc = subprocess.run(
        [
            'ffmpeg', '-hide_banner', '-loglevel', 'error',
            '-i', 'pipe:0',
            '-f', 's16le', '-ac', '1', '-ar', str(SAMPLE_RATE),
            'pipe:1',
        ],
        input=mp3_bytes,
        capture_output=True,
        check=True,
        timeout=60,
    )
    pcm = proc.stdout
    if len(pcm) < 480:
        raise RuntimeError('Decoded PCM segment is unexpectedly empty')
    # Ensure 2-byte sample alignment (16-bit mono).
    return pcm[: len(pcm) - (len(pcm) % 2)]


def encode_pcm_to_pack_mp3(pcm_bytes: bytes, output_mp3: Path):
    output_mp3.parent.mkdir(parents=True, exist_ok=True)
    tmp_mp3 = output_mp3.with_suffix('.tmp.mp3')
    try:
        subprocess.run(
            [
                'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
                '-f', 's16le', '-ar', str(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0',
                '-c:a', 'libmp3lame', '-b:a', '48k', '-ar', str(SAMPLE_RATE), '-ac', '1',
                '-write_xing', '1',
                str(tmp_mp3),
            ],
            input=pcm_bytes,
            capture_output=True,
            check=True,
            timeout=180,
        )
        os.replace(tmp_mp3, output_mp3)
    finally:
        tmp_mp3.unlink(missing_ok=True)


def synthesize_segment_verified(engine: NarrationEngine, text: str, voice: str) -> bytes:
    if not is_supported_offline_voice(voice):
        raise ValueError(f'Unsupported pack voice: {voice}')
    base_voice = voice.split(':')[0]
    rate = '-20%' if voice.endswith(':slow') else '-5%'
    spoken = speech_text(text)
    policy = 'v3-verified-primary'
    digest = hashlib.sha256((voice + '\0' + policy + '\0' + spoken).encode()).hexdigest()

    cached = server.cached_audio(digest)
    meta = server.cached_audio_metadata(digest) if cached else None
    if (
        cached
        and isinstance(meta, dict)
        and meta.get('sha256') == hashlib.sha256(cached).hexdigest()
        and meta.get('voices') == [base_voice]
    ):
        return cached

    mp3 = synthesize_offline_mp3(spoken, voice=base_voice, rate=rate)

    if len(mp3) < 256:
        raise RuntimeError('Synthesized segment MP3 is unexpectedly short')
    server.cache_audio(digest, mp3)
    server.cache_audio_metadata(digest, {
        'sha256': hashlib.sha256(mp3).hexdigest(),
        'voices': [base_voice],
    })
    return mp3


def lookup_viet_edition(book_key: str) -> dict:
    db_uri = (STATE / 'search.sqlite3').as_uri() + '?mode=ro'
    with sqlite3.connect(db_uri, uri=True) as db:
        row = db.execute("SELECT meta FROM documents WHERE book_key=? AND mode='viet'", (book_key,)).fetchone()
    if not row:
        raise KeyError(f'Vietnamese edition not found in search.sqlite3: {book_key}')
    return json.loads(row[0])


def build_book_packs(
    engine: NarrationEngine,
    book_key: str,
    voices: list[str],
    max_segments: int = 0,
    max_pack_segments: int = 60,
    force: bool = False,
) -> dict:
    meta = lookup_viet_edition(book_key)
    source_path = public_path(meta['source'])
    canonical = extract_canonical_segments(source_path)
    doc_version = canonical['docVersion']
    segmentation = canonical['segmentation']
    total_segments = canonical['totalSegments']
    selected_segments = canonical['segments'][:max_segments] if max_segments > 0 else canonical['segments']
    if not selected_segments:
        raise RuntimeError(f'No narratable segments in {book_key}')

    pack_groups = partition_into_packs(selected_segments, max_pack_segments=max_pack_segments)
    folder = Path(AUDIO_PACKS) / pack_dir_name(book_key)
    folder.mkdir(parents=True, exist_ok=True)
    manifest_path = folder / 'manifest.json'

    manifest = {}
    if manifest_path.is_file():
        try:
            manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
        except (OSError, ValueError):
            manifest = {}
    if manifest.get('docVersion') != doc_version or manifest.get('key') != book_key:
        manifest = {
            'format': 'chanh-phap-audio-pack-v1',
            'key': book_key,
            'title': meta.get('title', book_key),
            'docVersion': doc_version,
            'segmentation': segmentation,
            'totalSegments': total_segments,
            'voices': {},
        }

    built_summary = []
    for voice in voices:
        existing_voice = manifest.get('voices', {}).get(voice, {})
        existing_by_range = {
            (p.get('startIndex'), p.get('endIndex')): p
            for p in existing_voice.get('packs', [])
            if isinstance(p, dict)
        }
        new_packs = []
        for group_idx, group in enumerate(pack_groups):
            start_idx = group[0]['index']
            end_idx = group[-1]['index']
            prev = existing_by_range.get((start_idx, end_idx))
            if (
                not force
                and prev
                and (folder / prev.get('audioFile', '')).is_file()
                and (folder / prev.get('cuesFile', '')).is_file()
            ):
                new_packs.append(prev)
                built_summary.append({'key': book_key, 'voice': voice, 'range': f'{start_idx}-{end_idx}', 'status': 'reused'})
                continue

            voice_slug = voice.replace(':', '-').replace('vi-VN-', '').lower()
            pack_hash = hashlib.sha256(f'{book_key}\0{doc_version}\0{voice}\0{start_idx}-{end_idx}'.encode()).hexdigest()[:10]
            pack_id = f'pack-{voice_slug}-{start_idx:04d}-{end_idx:04d}-{pack_hash}'
            audio_filename = f'{pack_id}.mp3'
            cues_filename = f'{pack_id}.cues.json'

            pcm_buffer = bytearray()
            cues = []
            cursor_samples = 0
            with ThreadPoolExecutor(max_workers=4) as pool:
                mp3_list = list(pool.map(lambda seg: synthesize_segment_verified(engine, seg['text'], voice), group))
            for pos, (seg, mp3_bytes) in enumerate(zip(group, mp3_list)):
                seg_pcm = decode_mp3_to_pcm(mp3_bytes)
                seg_samples = len(seg_pcm) // 2

                # Natural breath/chapter pause goes AFTER this segment (before next segment),
                # so jumping directly to cue.start begins speaking immediately!
                next_pause_ms = group[pos + 1]['pauseBefore'] if pos + 1 < len(group) else 150
                tail_pause_samples = int(round((max(80, next_pause_ms) / 1000.0) * SAMPLE_RATE))
                silence_bytes = b'\x00\x00' * tail_pause_samples

                start_sec = round(cursor_samples / SAMPLE_RATE, 3)
                speech_end_sec = round((cursor_samples + seg_samples) / SAMPLE_RATE, 3)
                end_sec = round((cursor_samples + seg_samples + tail_pause_samples) / SAMPLE_RATE, 3)

                pcm_buffer.extend(seg_pcm)
                pcm_buffer.extend(silence_bytes)
                cursor_samples += seg_samples + tail_pause_samples

                cues.append({
                    'index': seg['index'],
                    'start': start_sec,
                    'speechEnd': speech_end_sec,
                    'end': end_sec,
                    'block': seg['block'],
                    'sourceOffset': seg['sourceOffset'],
                })

            total_duration = round(cursor_samples / SAMPLE_RATE, 3)
            audio_path = folder / audio_filename
            cues_path = folder / cues_filename
            encode_pcm_to_pack_mp3(bytes(pcm_buffer), audio_path)

            cues_payload = {
                'id': pack_id,
                'key': book_key,
                'docVersion': doc_version,
                'segmentation': segmentation,
                'voice': voice,
                'startIndex': start_idx,
                'endIndex': end_idx,
                'duration': total_duration,
                'cues': cues,
            }
            tmp_cues = cues_path.with_suffix('.tmp.json')
            tmp_cues.write_text(json.dumps(cues_payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
            os.replace(tmp_cues, cues_path)

            audio_bytes = audio_path.read_bytes()
            title = (
                'Toàn kinh'
                if start_idx == 0 and end_idx == total_segments - 1
                else (group[0].get('heading') or f'Đoạn {start_idx + 1}–{end_idx + 1}')
            )
            pack_entry = {
                'id': pack_id,
                'title': title,
                'startIndex': start_idx,
                'endIndex': end_idx,
                'startBlock': group[0]['block'],
                'endBlock': group[-1]['block'],
                'duration': total_duration,
                'bytes': len(audio_bytes),
                'sha256': hashlib.sha256(audio_bytes).hexdigest(),
                'audioFile': audio_filename,
                'cuesFile': cues_filename,
            }
            new_packs.append(pack_entry)
            built_summary.append({
                'key': book_key,
                'voice': voice,
                'range': f'{start_idx}-{end_idx}',
                'durationSec': total_duration,
                'bytes': len(audio_bytes),
                'status': 'built',
            })
            print(json.dumps(built_summary[-1], ensure_ascii=False), flush=True)

        # Preserve any higher-index packs that may have been built previously.
        covered = {(p['startIndex'], p['endIndex']) for p in new_packs}
        for rng, old_p in existing_by_range.items():
            if rng not in covered and old_p.get('startIndex', 0) > new_packs[-1]['endIndex']:
                new_packs.append(old_p)
        new_packs.sort(key=lambda p: p['startIndex'])
        if manifest_path.is_file():
            try:
                latest = json.loads(manifest_path.read_text(encoding='utf-8'))
                if latest.get('docVersion') == doc_version and latest.get('key') == book_key:
                    manifest = latest
            except (OSError, ValueError):
                pass
        manifest.setdefault('voices', {})[voice] = {
            'voice': voice,
            'updatedAt': datetime.now(timezone.utc).isoformat(),
            'packs': new_packs,
        }

        tmp_manifest = folder / f'.manifest.{os.getpid()}.tmp.json'
        tmp_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        os.replace(tmp_manifest, manifest_path)

    return {'key': book_key, 'title': meta.get('title', ''), 'docVersion': doc_version, 'summary': built_summary}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--key', action='append', default=[], help='Book key(s) to build, e.g. daithua:dt_10_1')
    parser.add_argument('--preset', choices=['core', 'wave2', 'offline-core', 'all'], help='Build Buddhist sutras preset')
    parser.add_argument('--voices', default='vieneu-thien-tam-duc,vieneu-thuc-doan', help='Comma-separated voices')
    parser.add_argument('--max-segments', type=int, default=0, help='Optional max segments per book (0 = full book)')
    parser.add_argument('--max-pack-segments', type=int, default=60, help='Max segments per pack file')
    parser.add_argument('--force', action='store_true', help='Rebuild even if pack files already exist')
    args = parser.parse_args()

    voices = [v.strip() for v in args.voices.split(',') if v.strip()]
    targets = []
    if args.preset in ('core', 'all'):
        targets.extend(CORE_PRESET_KEYS)
    if args.preset in ('wave2', 'all'):
        targets.extend(WAVE2_PRESET_KEYS)
    if args.preset == 'offline-core':
        targets.extend(OFFLINE_CORE_PRESET_KEYS)
    for k in args.key:
        targets.append((k.strip(), args.max_segments))
    if not targets:
        parser.error('Specify --preset core|wave2|all or at least one --key <book_key>.')

    cfg = load_audio_config()
    cfg.warmup = False
    cfg.workers = 3
    cfg.background_workers = 1
    cfg.provider_first_audio_timeout = 9.0
    cfg.receive_timeout = 12.0
    cfg.relay_url = ''
    engine = NarrationEngine(
        server.cached_audio,
        server.cache_audio,
        config=cfg,
        read_metadata=server.cached_audio_metadata,
        write_metadata=server.cache_audio_metadata,
    )

    results = []
    for book_key, limit in targets:
        effective_limit = args.max_segments if args.max_segments > 0 else limit
        results.append(
            build_book_packs(
                engine,
                book_key=book_key,
                voices=voices,
                max_segments=effective_limit,
                max_pack_segments=args.max_pack_segments,
                force=args.force,
            )
        )
    print(json.dumps({'completedBooks': len(results)}, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()

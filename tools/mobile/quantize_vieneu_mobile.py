"""Build and verify the quantized VieNeu-TTS-v3-Nano Mobile ONNX bundle (~135 MB FP16)
with standalone zero-Python-G2P inference verification for iOS (CoreML/ORT) & Android (XNNPACK/ORT)."""
from __future__ import annotations

from pathlib import Path
import argparse
import gzip
import hashlib
import json
import math
import shutil
import sys
import time

BOOTSTRAP = next(
    candidate
    for ancestor in Path(__file__).resolve().parents
    for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
    if (candidate / 'project_paths.py').is_file()
)
sys.path.insert(0, str(BOOTSTRAP))
from project_paths import ROOT, TTS_MODELS, DEPENDENCIES, MOBILE_DIST
sys.path.insert(0, str(DEPENDENCIES))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np
import onnxruntime as ort
from nano_voices_data import load_nano_voices
from export_vi_lexicon import mobile_phonemize_vi


SAMPLE_SENTENCE = (
    'Quán Tự Tại Bồ Tát hành thâm Bát Nhã Ba La Mật Đa thời, '
    'chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.'
)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def trim_and_fade_pcm(wav: np.ndarray, sr: int = 24000) -> np.ndarray:
    """Mirror VieNeu's clean silence trim + 15ms cosine fade-in/out for click-free mobile playback."""
    wav = np.asarray(wav, dtype=np.float32).reshape(-1)
    if wav.size == 0:
        return wav
    peak = float(np.max(np.abs(wav)))
    if peak > 1e-4:
        thr = max(0.004, peak * 0.012)
        idx = np.flatnonzero(np.abs(wav) >= thr)
        if idx.size > 0:
            pad_head = int(0.025 * sr)
            pad_tail = int(0.080 * sr)
            lo = max(0, int(idx[0]) - pad_head)
            hi = min(wav.size, int(idx[-1]) + pad_tail)
            wav = wav[lo:hi].copy()
    fade = min(int(0.015 * sr), wav.size // 4)
    if fade > 1:
        ramp = (0.5 - 0.5 * np.cos(np.linspace(0.0, math.pi, fade, dtype=np.float32)))
        wav[:fade] *= ramp
        wav[-fade:] *= ramp[::-1]
    return np.clip(wav, -1.0, 1.0)


def export_voices_and_constants(nano_src: Path, out_dir: Path) -> Path:
    """Flatten constants.npz + curated voices into a single portable JSON.gz file for Swift & Kotlin."""
    cfg = json.loads((nano_src / 'config.json').read_text(encoding='utf-8'))
    consts = np.load(nano_src / 'constants.npz')
    null_spk = consts['null_spk'].astype(np.float32).reshape(-1).tolist()
    null_style_arr = consts['null_style'].astype(np.float32)
    null_style_shape = list(null_style_arr.shape)
    null_style = null_style_arr.reshape(-1).tolist()

    raw_voices = load_nano_voices()
    override = nano_src / 'chanh_phap_nano_voices.json'
    if override.is_file():
        try:
            ov = json.loads(override.read_text(encoding='utf-8'))
            if isinstance(ov, dict) and ov.get('voices'):
                raw_voices = ov['voices']
        except (OSError, ValueError):
            pass

    voices_out = {}
    for vid in ('vieneu-thien-tam-duc', 'vieneu-thuc-doan'):
        entry = raw_voices[vid]
        spk_arr = np.asarray(entry['speaker_emb'], dtype=np.float32)
        sty_arr = np.asarray(entry['style'], dtype=np.float32)
        voices_out[vid] = {
            'name': 'Thiền Tâm Đức · Nam (Trầm tĩnh)' if 'tam-duc' in vid else 'Thục Đoan · Nữ (Dịu dàng)',
            'gender': entry.get('gender', ''),
            'speakerEmb': [round(float(x), 6) for x in spk_arr.reshape(-1)],
            'styleShape': list(sty_arr.shape),
            'style': [round(float(x), 6) for x in sty_arr.reshape(-1)],
        }

    bundle = {
        'format': 'chanh-phap-nano-voices-v1',
        'sampleRate': 24000,
        'flowFps': float(cfg.get('flow_fps', 24000 / 256 / 6)),
        'bosId': int(cfg['bos_id']),
        'eosId': int(cfg['eos_id']),
        'padId': int(cfg['pad_id']),
        'nullSpk': [round(float(x), 6) for x in null_spk],
        'nullStyleShape': null_style_shape,
        'nullStyle': [round(float(x), 6) for x in null_style],
        'voices': voices_out,
    }
    raw_bytes = json.dumps(bundle, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    gz_path = out_dir / 'voices_constants.json.gz'
    gz_path.write_bytes(gzip.compress(raw_bytes, compresslevel=9))
    return gz_path


def convert_onnx_to_fp16(src_path: Path, dst_path: Path) -> None:
    """Compress large FP32 weight initializers to IEEE-754 FP16 + Cast(to=FLOAT).
    Preserves 100% of original ONNX operator types, causal masks (-3.4e38), and CoreML/ORT compatibility."""
    import onnx
    from onnx import TensorProto, helper, numpy_helper

    model = onnx.load(str(src_path))
    graph = model.graph
    existing_names = {init.name for init in graph.initializer}
    existing_names.update(vi.name for vi in graph.input)
    existing_names.update(vi.name for vi in graph.output)
    for node in graph.node:
        existing_names.update(node.input)
        existing_names.update(node.output)

    cast_nodes = []
    new_initializers = []
    rename_map: dict[str, str] = {}

    for init in graph.initializer:
        if init.data_type == TensorProto.FLOAT:
            arr = numpy_helper.to_array(init)
            # Compress weight tensors >= 512 floats whose dynamic range fits cleanly in FP16 (< 65000)
            if arr.size >= 512 and np.all(np.isfinite(arr)) and float(np.max(np.abs(arr))) < 65000.0:
                fp16_name = init.name + '__fp16_w'
                while fp16_name in existing_names:
                    fp16_name += '_'
                existing_names.add(fp16_name)

                arr_fp16 = arr.astype(np.float16)
                fp16_tensor = numpy_helper.from_array(arr_fp16, name=fp16_name)
                new_initializers.append(fp16_tensor)

                cast_out = init.name + '__fp32_val'
                while cast_out in existing_names:
                    cast_out += '_'
                existing_names.add(cast_out)

                cast_nodes.append(
                    helper.make_node(
                        'Cast',
                        inputs=[fp16_name],
                        outputs=[cast_out],
                        to=TensorProto.FLOAT,
                        name=f'Cast_fp16_{len(cast_nodes)}',
                    )
                )
                rename_map[init.name] = cast_out
                continue
        new_initializers.append(init)

    if rename_map:
        for node in graph.node:
            for idx, inp in enumerate(node.input):
                if inp in rename_map:
                    node.input[idx] = rename_map[inp]
        # Prepend Cast nodes so topological order is guaranteed valid
        all_nodes = cast_nodes + list(graph.node)
        del graph.node[:]
        graph.node.extend(all_nodes)
        del graph.initializer[:]
        graph.initializer.extend(new_initializers)

    onnx.save(model, str(dst_path))


class StandaloneMobileNanoEngine:
    """Exact reference mirror of the Swift/Kotlin mobile engine (zero vieneu / zero sea_g2p)."""

    def __init__(self, bundle_dir: Path):
        lex = json.loads(gzip.decompress((bundle_dir / 'vi_lexicon.json.gz').read_bytes()).decode('utf-8'))
        vc = json.loads(gzip.decompress((bundle_dir / 'voices_constants.json.gz').read_bytes()).decode('utf-8'))
        self.words: dict[str, str] = lex['words']
        self.char_fallback: dict[str, str] = lex['charFallback']
        self.vocab: dict[str, int] = lex['vocab']
        self.bos = int(vc['bosId'])
        self.eos = int(vc['eosId'])
        self.pad = int(vc['padId'])
        self.fps = float(vc['flowFps'])
        self.sample_rate = int(vc['sampleRate'])

        self.null_spk = np.asarray(vc['nullSpk'], dtype=np.float32).reshape(1, -1)
        ns_shape = vc['nullStyleShape']
        self.null_style = np.asarray(vc['nullStyle'], dtype=np.float32).reshape(1, *ns_shape)
        self.voices = vc['voices']

        so = ort.SessionOptions()
        so.enable_cpu_mem_arena = False
        so.enable_mem_pattern = True
        so.intra_op_num_threads = 2
        so.inter_op_num_threads = 1
        prov = ['CPUExecutionProvider']

        self.s_text = ort.InferenceSession(str(bundle_dir / 'text_encoder.onnx'), so, providers=prov)
        self.s_dur = ort.InferenceSession(str(bundle_dir / 'duration_predictor.onnx'), so, providers=prov)
        self.s_ve = ort.InferenceSession(str(bundle_dir / 'vector_estimator.onnx'), so, providers=prov)
        self.s_dec = ort.InferenceSession(str(bundle_dir / 'codec_decoder.onnx'), so, providers=prov)

        null_ids = np.array([[self.bos, self.eos]], dtype=np.int64)
        self.null_ctx = self.s_text.run(None, {'ids': null_ids, 'style': self.null_style})[0]
        self.null_mask = null_ids != self.pad

    def encode_phones(self, phonemes: str) -> np.ndarray:
        seq = [self.bos]
        for ch in phonemes:
            idx = self.vocab.get(ch)
            if idx is not None:
                seq.append(int(idx))
        seq.append(self.eos)
        return np.asarray([seq], dtype=np.int64)

    def synthesize(self, text: str, voice_id: str, steps: int = 8, cfg: float = 3.0, speed: float = 1.0, seed: int = 42) -> np.ndarray:
        v = self.voices[voice_id]
        spk = np.asarray(v['speakerEmb'], dtype=np.float32).reshape(1, -1)
        style = np.asarray(v['style'], dtype=np.float32).reshape(1, *v['styleShape'])

        phonemes = mobile_phonemize_vi(text, self.words, self.char_fallback)
        ids = self.encode_phones(phonemes)
        mask = ids != self.pad

        ctx = self.s_text.run(None, {'ids': ids, 'style': style})[0]
        log_s = float(self.s_dur.run(None, {'ctx': ctx, 'ctx_mask': mask, 'spk': spk})[0].reshape(-1)[0])
        secs = min(math.exp(log_s) / max(speed, 1e-3), 15.0)
        frames = max(2, int(round(secs * self.fps)))

        rng = np.random.default_rng(seed)
        x = rng.standard_normal((1, 144, frames)).astype(np.float32)
        u = np.linspace(0.0, 1.0, steps + 1, dtype=np.float64)
        sway = -1.0
        tg = u + sway * (np.cos(math.pi / 2.0 * u) - 1.0 + u)
        cfg_limit = 6 if steps <= 8 else max(6, steps - 2)

        for i in range(steps):
            t = np.array([tg[i]], dtype=np.float32)
            vel = self.s_ve.run(None, {'x': x, 't': t, 'ctx': ctx, 'ctx_mask': mask, 'spk': spk, 'style': style})[0]
            if cfg > 0 and i < cfg_limit:
                vel_u = self.s_ve.run(
                    None,
                    {'x': x, 't': t, 'ctx': self.null_ctx, 'ctx_mask': self.null_mask, 'spk': self.null_spk, 'style': self.null_style},
                )[0]
                vel = vel_u + np.float32(cfg) * (vel - vel_u)
            x = x + np.float32(tg[i + 1] - tg[i]) * vel

        wav = self.s_dec.run(None, {'x': x})[0][0, 0]
        return trim_and_fade_pcm(wav, self.sample_rate)


def build_mobile_tts_bundle(out_dir: Path, force: bool = False) -> dict:
    import lameenc

    t0 = time.monotonic()
    nano_src = TTS_MODELS / 'VieNeu-TTS-v3-Nano'
    if not nano_src.is_dir():
        raise FileNotFoundError(f'Missing source Nano directory: {nano_src}')

    out_dir.mkdir(parents=True, exist_ok=True)
    if not (out_dir / 'vi_lexicon.json.gz').is_file():
        raise FileNotFoundError('Run export_vi_lexicon.py first so vi_lexicon.json.gz is present.')

    voices_gz = export_voices_and_constants(nano_src, out_dir)

    graphs = (
        ('duration_predictor.onnx', False),  # 0.69 MB: keep FP32 for exact rhythm/duration stability
        ('text_encoder.onnx', True),
        ('vector_estimator.onnx', True),
        ('codec_decoder.onnx', True),
    )

    files_manifest = []
    for fname, to_fp16 in graphs:
        src = nano_src / fname
        dst = out_dir / fname
        if force or not dst.is_file():
            if to_fp16:
                convert_onnx_to_fp16(src, dst)
            else:
                shutil.copy2(src, dst)
        files_manifest.append({
            'name': fname,
            'precision': 'fp16' if to_fp16 else 'fp32',
            'sourceBytes': src.stat().st_size,
            'mobileBytes': dst.stat().st_size,
            'sha256': sha256_file(dst),
        })

    for extra_name in ('vi_lexicon.json.gz', 'voices_constants.json.gz'):
        p = out_dir / extra_name
        files_manifest.append({
            'name': extra_name,
            'precision': 'gzip',
            'sourceBytes': p.stat().st_size,
            'mobileBytes': p.stat().st_size,
            'sha256': sha256_file(p),
        })

    # Verify standalone mobile inference & compare against FP32 reference!
    mob_eng = StandaloneMobileNanoEngine(out_dir)

    # Also load FP32 graphs to measure exact waveform fidelity (SNR)
    fp32_tmp = out_dir / '_verify_samples'
    fp32_tmp.mkdir(parents=True, exist_ok=True)

    so = ort.SessionOptions()
    so.intra_op_num_threads = 2
    s_text_ref = ort.InferenceSession(str(nano_src / 'text_encoder.onnx'), so, providers=['CPUExecutionProvider'])
    s_dur_ref = ort.InferenceSession(str(nano_src / 'duration_predictor.onnx'), so, providers=['CPUExecutionProvider'])
    s_ve_ref = ort.InferenceSession(str(nano_src / 'vector_estimator.onnx'), so, providers=['CPUExecutionProvider'])
    s_dec_ref = ort.InferenceSession(str(nano_src / 'codec_decoder.onnx'), so, providers=['CPUExecutionProvider'])

    verification = {}
    for vid in ('vieneu-thien-tam-duc', 'vieneu-thuc-doan'):
        ts = time.monotonic()
        wav_mob = mob_eng.synthesize(SAMPLE_SENTENCE, vid, steps=8, seed=108)
        synth_sec = time.monotonic() - ts
        audio_sec = wav_mob.size / mob_eng.sample_rate
        rtf = synth_sec / max(audio_sec, 1e-3)

        # Reference FP32 with identical seed=108
        orig_sessions = (mob_eng.s_text, mob_eng.s_dur, mob_eng.s_ve, mob_eng.s_dec)
        null_ids = np.array([[mob_eng.bos, mob_eng.eos]], dtype=np.int64)
        orig_null_ctx = mob_eng.null_ctx
        try:
            mob_eng.s_text, mob_eng.s_dur, mob_eng.s_ve, mob_eng.s_dec = s_text_ref, s_dur_ref, s_ve_ref, s_dec_ref
            mob_eng.null_ctx = s_text_ref.run(None, {'ids': null_ids, 'style': mob_eng.null_style})[0]
            wav_ref = mob_eng.synthesize(SAMPLE_SENTENCE, vid, steps=8, seed=108)
        finally:
            mob_eng.s_text, mob_eng.s_dur, mob_eng.s_ve, mob_eng.s_dec = orig_sessions
            mob_eng.null_ctx = orig_null_ctx

        min_len = min(wav_mob.size, wav_ref.size)
        corr = float(np.corrcoef(wav_mob[:min_len], wav_ref[:min_len])[0, 1]) if min_len > 100 else 0.0
        noise_pow = float(np.mean((wav_mob[:min_len] - wav_ref[:min_len]) ** 2)) + 1e-12
        sig_pow = float(np.mean(wav_ref[:min_len] ** 2)) + 1e-12
        snr_db = 10.0 * math.log10(sig_pow / noise_pow)

        pcm16 = np.clip(wav_mob * 32767.0, -32768.0, 32767.0).astype('<i2').tobytes()
        enc = lameenc.Encoder()
        enc.set_bit_rate(48)
        enc.set_in_sample_rate(mob_eng.sample_rate)
        enc.set_channels(1)
        enc.set_quality(4)
        mp3_bytes = bytes(enc.encode(pcm16) + enc.flush())
        sample_mp3 = fp32_tmp / f'sample-{vid}.mp3'
        sample_mp3.write_bytes(mp3_bytes)

        assert audio_sec > 3.0, f'Generated audio too short for {vid}'
        assert float(np.sqrt(sig_pow)) > 0.02, f'Generated audio silent for {vid}'
        verification[vid] = {
            'durationSec': round(audio_sec, 2),
            'synthesisSec': round(synth_sec, 2),
            'realTimeFactor': round(rtf, 3),
            'correlationVsFp32': round(corr, 5),
            'snrDbVsFp32': round(snr_db, 2),
            'mp3Bytes': len(mp3_bytes),
            'sampleMp3': str(sample_mp3),
        }

    total_mobile_bytes = sum(item['mobileBytes'] for item in files_manifest)
    manifest = {
        'format': 'chanh-phap-mobile-tts-v1',
        'engine': 'VieNeu-TTS-v3-Nano-FP16',
        'version': '1.0.0',
        'sampleRate': 24000,
        'totalBytes': total_mobile_bytes,
        'totalMiB': round(total_mobile_bytes / (1024 ** 2), 2),
        'voices': [
            {'id': 'vieneu-thien-tam-duc', 'name': 'Thiền Tâm Đức · Nam (Trầm tĩnh)'},
            {'id': 'vieneu-thuc-doan', 'name': 'Thục Đoan · Nữ (Dịu dàng)'},
        ],
        'files': files_manifest,
        'verification': verification,
        'elapsedSeconds': round(time.monotonic() - t0, 2),
    }
    (out_dir / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--out',
        type=Path,
        default=MOBILE_DIST / 'cdn-upload' / 'tts' / 'vieneu-nano-mobile-v1',
        help='Target directory outside workspace',
    )
    parser.add_argument('--force', action='store_true', help='Rebuild quantized ONNX files')
    args = parser.parse_args()
    out_dir = args.out.resolve()
    if out_dir.is_relative_to(ROOT.resolve()):
        raise SystemExit('Output directory must reside outside the project workspace.')
    result = build_mobile_tts_bundle(out_dir, force=args.force)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

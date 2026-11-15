"""Install and verify the VieNeu-TTS v3 Turbo (48 kHz ONNX fp32) offline Vietnamese voice engine,
and cleanly purge legacy Piper/Vân Anh artifacts."""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request

BOOTSTRAP = next(
    (
        candidate
        for ancestor in [*Path(__file__).resolve().parents, Path('/opt/thuvien')]
        for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
        if (candidate / 'project_paths.py').is_file()
    ),
    None,
)
if BOOTSTRAP is not None:
    sys.path.insert(0, str(BOOTSTRAP))
    from project_paths import TTS_MODELS, DEPENDENCIES
    sys.path.insert(0, str(DEPENDENCIES))
else:
    TTS_MODELS = Path('/opt/thuvien/.tts-models')
    DEPENDENCIES = None

MODEL_DIR_NAME = 'VieNeu-TTS-v3-Turbo'
LEGACY_MODEL_NAMES = ('vits-piper-vi_VN-vais1000-medium',)

V3_REPO = 'pnnbao-ump/VieNeu-TTS-v3-Turbo'
CODEC_REPO = 'OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano-ONNX'

# (hf_repo, remote_rel_path, local_rel_path, min_bytes)
REQUIRED_ARTIFACTS = (
    (V3_REPO, 'config.json', 'config.json', 100),
    (V3_REPO, 'speaker_encoder.onnx', 'speaker_encoder.onnx', 10_000_000),
    (V3_REPO, 'denoiser.onnx', 'denoiser.onnx', 20_000_000),
    (V3_REPO, 'onnx_update/config.json', 'onnx_update/config.json', 100),
    (V3_REPO, 'onnx_update/tokenizer.json', 'onnx_update/tokenizer.json', 1_000),
    (V3_REPO, 'onnx_update/vieneu_prefill.onnx', 'onnx_update/vieneu_prefill.onnx', 100_000),
    (V3_REPO, 'onnx_update/vieneu_decode_step.onnx', 'onnx_update/vieneu_decode_step.onnx', 100_000),
    (V3_REPO, 'onnx_update/vieneu_acoustic_cached.onnx', 'onnx_update/vieneu_acoustic_cached.onnx', 1_000_000),
    (V3_REPO, 'onnx_update/vieneu_v3_heads.npz', 'onnx_update/vieneu_v3_heads.npz', 20_000_000),
    (V3_REPO, 'onnx_update/vieneu_backbone_shared.data', 'onnx_update/vieneu_backbone_shared.data', 350_000_000),
    (CODEC_REPO, 'codec_browser_onnx_meta.json', 'codec/codec_browser_onnx_meta.json', 100),
    (CODEC_REPO, 'moss_audio_tokenizer_decode_full.onnx', 'codec/moss_audio_tokenizer_decode_full.onnx', 200_000),
    (CODEC_REPO, 'moss_audio_tokenizer_decode_step.onnx', 'codec/moss_audio_tokenizer_decode_step.onnx', 100_000),
    (CODEC_REPO, 'moss_audio_tokenizer_decode_shared.data', 'codec/moss_audio_tokenizer_decode_shared.data', 35_000_000),
    (CODEC_REPO, 'moss_audio_tokenizer_encode.onnx', 'codec/moss_audio_tokenizer_encode.onnx', 200_000),
    (CODEC_REPO, 'moss_audio_tokenizer_encode.data', 'codec/moss_audio_tokenizer_encode.data', 35_000_000),
)

MINIMAL_RUNTIME_PACKAGES = (
    'sea-g2p>=0.9.1',
    'onnxruntime>=1.20.0',
    'numpy>=1.24',
    'soundfile>=0.12',
    'soxr>=0.5',
    'kaldi-native-fbank>=1.20',
    'tokenizers>=0.20',
    'huggingface-hub>=0.23',
    'PyYAML>=6.0',
    'lameenc>=1.7,<2',
)


def purge_legacy_models(dest_root: Path) -> list[str]:
    removed = []
    for name in LEGACY_MODEL_NAMES:
        target = dest_root / name
        if target.exists():
            shutil.rmtree(target, ignore_errors=True)
            removed.append(str(target))
    if os.name == 'nt':
        temp_root = Path(tempfile.gettempdir())
        for mount_name in ('chanh_phap_tts_vi_mount', 'chanh_phap_tts_vi_cache'):
            m = temp_root / mount_name
            if m.exists():
                subprocess.run(['cmd', '/c', 'rmdir', str(m)], capture_output=True, timeout=5)
                if m.exists():
                    shutil.rmtree(m, ignore_errors=True)
                removed.append(str(m))
    return removed


def install_python_runtime(target_dir: Path) -> None:
    uv = shutil.which('uv')
    if not uv:
        raise RuntimeError('uv package installer is required to install VieNeu-TTS runtime wheels.')
    target_dir.mkdir(parents=True, exist_ok=True)
    # Remove legacy sherpa_onnx folders if present
    for pat in ('sherpa_onnx*',):
        for item in target_dir.glob(pat):
            if item.is_dir():
                shutil.rmtree(item, ignore_errors=True)
            else:
                item.unlink(missing_ok=True)
    subprocess.run(
        [uv, 'pip', 'install', '--python', sys.executable, '--target', str(target_dir), *MINIMAL_RUNTIME_PACKAGES],
        check=True,
    )
    subprocess.run(
        [uv, 'pip', 'install', '--python', sys.executable, '--target', str(target_dir), '--no-deps', 'vieneu==3.8.4'],
        check=True,
    )


def is_model_ready(model_dir: Path) -> bool:
    for _, _, local_rel, min_bytes in REQUIRED_ARTIFACTS:
        f = model_dir / local_rel
        if not f.is_file() or f.stat().st_size < min_bytes:
            return False
    return True


def _download_one(repo: str, remote_rel: str, dest_file: Path, min_bytes: int) -> int:
    if dest_file.is_file() and dest_file.stat().st_size >= min_bytes:
        return 0
    dest_file.parent.mkdir(parents=True, exist_ok=True)
    url = f'https://huggingface.co/{repo}/resolve/main/{remote_rel}?download=true'
    tmp = dest_file.with_suffix(dest_file.suffix + '.part')
    req = urllib.request.Request(url, headers={'User-Agent': 'ChanhPhap-Library/2.0'})
    with urllib.request.urlopen(req, timeout=300) as resp, tmp.open('wb') as out:
        while True:
            chunk = resp.read(256 * 1024)
            if not chunk:
                break
            out.write(chunk)
    size = tmp.stat().st_size
    if size < min_bytes:
        tmp.unlink(missing_ok=True)
        raise RuntimeError(f'Incomplete download for {remote_rel}: {size} < {min_bytes}')
    tmp.replace(dest_file)
    return size


def install_model(dest_root: Path, force: bool = False) -> dict:
    removed = purge_legacy_models(dest_root)
    model_dir = dest_root / MODEL_DIR_NAME
    if force and model_dir.exists():
        shutil.rmtree(model_dir)

    downloaded_bytes = 0
    if not is_model_ready(model_dir):
        with ThreadPoolExecutor(max_workers=4) as pool:
            futures = {
                pool.submit(_download_one, repo, r_rel, model_dir / l_rel, min_b): l_rel
                for repo, r_rel, l_rel, min_b in REQUIRED_ARTIFACTS
            }
            for fut in as_completed(futures):
                rel_name = futures[fut]
                nbytes = fut.result()
                downloaded_bytes += nbytes
                if nbytes:
                    print(f'[downloaded] {rel_name} ({nbytes / 1024**2:.2f} MiB)', flush=True)

    total_bytes = sum((model_dir / l_rel).stat().st_size for _, _, l_rel, _ in REQUIRED_ARTIFACTS)
    return {
        'status': 'installed',
        'model': MODEL_DIR_NAME,
        'path': str(model_dir),
        'totalBytes': total_bytes,
        'downloadedBytes': downloaded_bytes,
        'purgedLegacy': removed,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dest', type=Path, default=TTS_MODELS, help='Target tts-models directory')
    parser.add_argument('--install-deps', action='store_true', help='Install torch-free VieNeu runtime wheels into local/runtime/python')
    parser.add_argument('--purge-only', action='store_true', help='Only remove legacy Piper/Vân Anh models')
    parser.add_argument('--force', action='store_true', help='Re-download all VieNeu-TTS v3 Turbo files')
    args = parser.parse_args()

    dest_root = args.dest.resolve()
    if args.purge_only:
        removed = purge_legacy_models(dest_root)
        if dest_root.exists() and not any(dest_root.iterdir()):
            dest_root.rmdir()
        print(json.dumps({'status': 'purged', 'removed': removed}, ensure_ascii=False))
        return

    if args.install_deps and DEPENDENCIES is not None:
        install_python_runtime(Path(DEPENDENCIES).resolve())

    result = install_model(dest_root, force=args.force)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()

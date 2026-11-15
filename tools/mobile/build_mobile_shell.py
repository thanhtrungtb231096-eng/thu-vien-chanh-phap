"""Assemble the self-contained Capacitor web bundle (www/ + embedded core-bundled.pack.db)
for iOS & Android without polluting the main workspace."""
from __future__ import annotations

from pathlib import Path
import argparse
import json
import shutil
import sys

BOOTSTRAP = next(
    candidate
    for ancestor in Path(__file__).resolve().parents
    for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
    if (candidate / 'project_paths.py').is_file()
)
sys.path.insert(0, str(BOOTSTRAP))
from project_paths import ROOT, WEB, GENERATED, MOBILE_DIST


def copy_file(src: Path, dst: Path) -> int:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    return dst.stat().st_size


def build_shell(out_www: Path, core_pack_path: Path | None = None, allow_in_repo: bool = False) -> dict:
    out_www = out_www.resolve()
    if not allow_in_repo and out_www.is_relative_to(ROOT.resolve()):
        raise ValueError('Default mobile shell output must reside outside the workspace (pass --allow-in-repo on CI).')

    if out_www.exists():
        shutil.rmtree(out_www)
    out_www.mkdir(parents=True, exist_ok=True)

    total_bytes = 0
    file_count = 0

    def add(src: Path, rel: str):
        nonlocal total_bytes, file_count
        if not src.is_file():
            return
        total_bytes += copy_file(src, out_www / rel)
        file_count += 1
        # Also mirror under /web-thuvien/<rel> or handle via index root cleanly
        if rel in ('index.html', 'manifest.webmanifest'):
            copy_file(src, out_www / 'web-thuvien' / rel)

    add(WEB / 'index.html', 'index.html')
    add(WEB / 'manifest.webmanifest', 'manifest.webmanifest')

    for folder in ('js', 'css', 'fonts', 'design'):
        src_dir = WEB / folder
        if not src_dir.is_dir():
            continue
        for f in sorted(src_dir.rglob('*')):
            if f.is_file():
                rel = f.relative_to(WEB).as_posix()
                add(f, rel)

    gen_files = [
        'library-version.json',
        'offline-assets.json',
        'library-audit.json',
        'dai-tang-kinh/catalog.json',
        'phuc-minh/ocr/editions.json',
    ]
    for gf in gen_files:
        p = GENERATED / gf
        if p.is_file():
            add(p, 'data/' + gf)

    mig_dir = GENERATED / 'edition-migrations'
    if mig_dir.is_dir():
        for mf in sorted(mig_dir.glob('*.json')):
            add(mf, 'data/edition-migrations/' + mf.name)

    resolved_core = core_pack_path or (MOBILE_DIST / 'cdn-upload' / 'text-packs' / 'core-bundled.pack.db')
    bundled_core_included = False
    if resolved_core.is_file():
        total_bytes += copy_file(resolved_core, out_www / 'packs' / 'core-bundled.pack.db')
        file_count += 1
        bundled_core_included = True

    summary = {
        'status': 'ok',
        'outDir': str(out_www),
        'files': file_count,
        'totalBytes': total_bytes,
        'totalMiB': round(total_bytes / (1024 ** 2), 2),
        'corePackEmbedded': bundled_core_included,
    }
    (out_www / 'mobile-shell-manifest.json').write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--out',
        type=Path,
        default=MOBILE_DIST / 'app-staging' / 'www',
        help='Target Capacitor webDir',
    )
    parser.add_argument('--core-pack', type=Path, default=None, help='Path to core-bundled.pack.db')
    parser.add_argument('--allow-in-repo', action='store_true', help='Allow writing into mobile/www on CI runners')
    args = parser.parse_args()
    res = build_shell(args.out, args.core_pack, args.allow_in_repo)
    print(json.dumps(res, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()


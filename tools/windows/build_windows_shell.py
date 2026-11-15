"""Assemble the self-contained Windows PC Store (Tauri v2 + MSIX) staging bundle:
1. Web shell (www/) + embedded core-bundled.pack.db
2. Multi-resolution Windows icon.ico + Tauri PNG icons
3. Official Microsoft Store MSIX Visual Assets (StoreLogo, Tiles, SplashScreen) + AppxManifest.xml
Outputs to E:\\Kinh điển phật giáo - Mobile\\windows-staging by default (zero binary bloat in workspace)."""
from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape as xml_escape
import argparse
import json
import shutil
import struct
import sys
import zlib

BOOTSTRAP = next(
    candidate
    for ancestor in Path(__file__).resolve().parents
    for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
    if (candidate / 'project_paths.py').is_file()
)
sys.path.insert(0, str(BOOTSTRAP))
from project_paths import ROOT, WEB, GENERATED, MOBILE_DIST

SANCTUARY_BG_RGBA = (247, 244, 236, 255)  # #F7F4EC warm Buddhist parchment


def copy_file(src: Path, dst: Path) -> int:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    return dst.stat().st_size


def _make_solid_png_fallback(width: int, height: int, rgba: tuple[int, int, int, int] = SANCTUARY_BG_RGBA) -> bytes:
    """Pure-Python valid RGBA PNG fallback if Pillow is unavailable."""
    raw_row = b'\x00' + bytes(rgba) * width
    raw = raw_row * height

    def chunk(tag: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', crc)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(raw, 6)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')


def _pack_png_ico(png_blobs: list[tuple[int, int, bytes]]) -> bytes:
    """Pack PNG-encoded icon frames into a valid Windows Vista/10/11 .ico file."""
    header = struct.pack('<HHH', 0, 1, len(png_blobs))
    entries = bytearray()
    payload = bytearray()
    offset = 6 + 16 * len(png_blobs)
    for w, h, blob in png_blobs:
        bw = 0 if w >= 256 else w
        bh = 0 if h >= 256 else h
        entries += struct.pack('<BBBBHHII', bw, bh, 0, 0, 1, 32, len(blob), offset)
        payload += blob
        offset += len(blob)
    return bytes(header) + bytes(entries) + bytes(payload)


def generate_windows_icons_and_msix_assets(src_icon: Path, icons_dir: Path, msix_assets_dir: Path) -> dict:
    icons_dir.mkdir(parents=True, exist_ok=True)
    msix_assets_dir.mkdir(parents=True, exist_ok=True)

    msix_specs = {
        'StoreLogo.png': (50, 50, False),
        'Square44x44Logo.png': (44, 44, False),
        'Square44x44Logo.targetsize-24_altform-unplated.png': (24, 24, False),
        'Square44x44Logo.targetsize-48_altform-unplated.png': (48, 48, False),
        'Square44x44Logo.targetsize-256_altform-unplated.png': (256, 256, False),
        'Square71x71Logo.png': (71, 71, False),
        'Square150x150Logo.png': (150, 150, False),
        'Wide310x150Logo.png': (310, 150, True),
        'Square310x310Logo.png': (310, 310, False),
        'SplashScreen.png': (620, 300, True),
    }

    tauri_png_specs = {
        '32x32.png': (32, 32),
        '128x128.png': (128, 128),
        '128x128@2x.png': (256, 256),
        'icon.png': (512, 512),
    }

    ico_sizes = [16, 24, 32, 48, 64, 128, 256]

    try:
        from PIL import Image
        import io

        with Image.open(src_icon) as raw_im:
            base = raw_im.convert('RGBA')

        for fname, (w, h) in tauri_png_specs.items():
            resized = base.resize((w, h), Image.Resampling.LANCZOS)
            resized.save(icons_dir / fname, format='PNG', optimize=True)

        ico_frames: list[tuple[int, int, bytes]] = []
        for s in ico_sizes:
            buf = io.BytesIO()
            base.resize((s, s), Image.Resampling.LANCZOS).save(buf, format='PNG', optimize=True)
            ico_frames.append((s, s, buf.getvalue()))
        (icons_dir / 'icon.ico').write_bytes(_pack_png_ico(ico_frames))

        for fname, (w, h, wide_canvas) in msix_specs.items():
            if not wide_canvas:
                tile = Image.new('RGBA', (w, h), SANCTUARY_BG_RGBA)
                pad = max(2, int(round(min(w, h) * 0.08)))
                inner_sz = max(8, min(w, h) - pad * 2)
                emblem = base.resize((inner_sz, inner_sz), Image.Resampling.LANCZOS)
                tile.alpha_composite(emblem, ((w - inner_sz) // 2, (h - inner_sz) // 2))
                tile.save(msix_assets_dir / fname, format='PNG', optimize=True)
            else:
                canvas = Image.new('RGBA', (w, h), SANCTUARY_BG_RGBA)
                emblem_sz = int(round(min(w, h) * 0.68))
                emblem = base.resize((emblem_sz, emblem_sz), Image.Resampling.LANCZOS)
                canvas.alpha_composite(emblem, ((w - emblem_sz) // 2, (h - emblem_sz) // 2))
                canvas.save(msix_assets_dir / fname, format='PNG', optimize=True)

        renderer = 'Pillow'
    except ImportError:
        for fname, (w, h) in tauri_png_specs.items():
            if w == 512 and h == 512 and src_icon.is_file():
                copy_file(src_icon, icons_dir / fname)
            else:
                (icons_dir / fname).write_bytes(_make_solid_png_fallback(w, h))
        ico_frames = [(s, s, _make_solid_png_fallback(s, s)) for s in ico_sizes]
        (icons_dir / 'icon.ico').write_bytes(_pack_png_ico(ico_frames))
        for fname, (w, h, _) in msix_specs.items():
            (msix_assets_dir / fname).write_bytes(_make_solid_png_fallback(w, h))
        renderer = 'pure-python-fallback'

    return {
        'renderer': renderer,
        'tauriIcons': sorted(p.name for p in icons_dir.iterdir() if p.is_file()),
        'msixAssets': sorted(p.name for p in msix_assets_dir.iterdir() if p.is_file()),
    }


def render_appx_manifest(
    identity_name: str,
    publisher: str,
    version_4part: str,
    display_name: str,
    publisher_display_name: str,
    executable: str,
) -> str:
    return f"""<?xml version="1.0" encoding="utf-8"?>
<Package
  xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
  xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
  xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities"
  IgnorableNamespaces="uap rescap">

  <Identity
    Name="{xml_escape(identity_name)}"
    Publisher="{xml_escape(publisher)}"
    Version="{xml_escape(version_4part)}"
    ProcessorArchitecture="x64" />

  <Properties>
    <DisplayName>{xml_escape(display_name)}</DisplayName>
    <PublisherDisplayName>{xml_escape(publisher_display_name)}</PublisherDisplayName>
    <Logo>Assets\\StoreLogo.png</Logo>
    <Description>Đại Thư Viện Kinh Điển Phật Giáo Chánh Pháp — đọc, tra cứu 5.348 bản kinh Việt – Hán – Pāḷi và nghe tụng đọc AI ngoại tuyến trên Windows 10/11.</Description>
  </Properties>

  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.26100.0" />
  </Dependencies>

  <Resources>
    <Resource Language="vi-VN" />
  </Resources>

  <Applications>
    <Application
      Id="ChanhPhapDesktop"
      Executable="{xml_escape(executable)}"
      EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements
        DisplayName="{xml_escape(display_name)}"
        Description="Đại Thư Viện Kinh Điển Phật Giáo Chánh Pháp"
        BackgroundColor="#F7F4EC"
        Square150x150Logo="Assets\\Square150x150Logo.png"
        Square44x44Logo="Assets\\Square44x44Logo.png">
        <uap:DefaultTile
          Wide310x150Logo="Assets\\Wide310x150Logo.png"
          Square71x71Logo="Assets\\Square71x71Logo.png"
          Square310x310Logo="Assets\\Square310x310Logo.png">
          <uap:ShowNameOnTiles>
            <uap:ShowOn Tile="square150x150Logo" />
            <uap:ShowOn Tile="wide310x150Logo" />
            <uap:ShowOn Tile="square310x310Logo" />
          </uap:ShowNameOnTiles>
        </uap:DefaultTile>
        <uap:SplashScreen Image="Assets\\SplashScreen.png" BackgroundColor="#F7F4EC" />
      </uap:VisualElements>
    </Application>
  </Applications>

  <Capabilities>
    <Capability Name="internetClient" />
    <rescap:Capability Name="runFullTrust" />
  </Capabilities>
</Package>
"""


def build_windows_staging(
    out_root: Path,
    core_pack_path: Path | None = None,
    allow_in_repo: bool = False,
    identity_name: str = 'ChanhPhap.DaiThuVienKinhDien',
    publisher: str = 'CN=ChanhPhap',
    version_4part: str = '1.0.0.0',
    display_name: str = 'Chánh Pháp - Đại Thư Viện Kinh Điển',
    publisher_display_name: str = 'Thư Viện Chánh Pháp',
    executable: str = 'chanh-phap.exe',
) -> dict:
    out_root = out_root.resolve()
    if not allow_in_repo and out_root.is_relative_to(ROOT.resolve()):
        raise ValueError(
            'Default Windows staging output must reside outside the workspace (pass --allow-in-repo on CI).'
        )

    out_www = out_root / 'www'
    icons_dir = out_root / 'icons'
    msix_dir = out_root / 'msix-template'
    msix_assets_dir = msix_dir / 'Assets'

    for d in (out_www, icons_dir, msix_dir):
        if d.exists():
            shutil.rmtree(d)
        d.mkdir(parents=True, exist_ok=True)

    total_bytes = 0
    file_count = 0

    def add(src: Path, rel: str) -> None:
        nonlocal total_bytes, file_count
        if not src.is_file():
            return
        total_bytes += copy_file(src, out_www / rel)
        file_count += 1
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

    visual_meta = generate_windows_icons_and_msix_assets(
        WEB / 'design' / 'library-icon-512.png',
        icons_dir,
        msix_assets_dir,
    )

    manifest_xml = render_appx_manifest(
        identity_name=identity_name,
        publisher=publisher,
        version_4part=version_4part,
        display_name=display_name,
        publisher_display_name=publisher_display_name,
        executable=executable,
    )
    (msix_dir / 'AppxManifest.xml').write_text(manifest_xml, encoding='utf-8')

    summary = {
        'status': 'ok',
        'outRoot': str(out_root),
        'wwwDir': str(out_www),
        'iconsDir': str(icons_dir),
        'msixTemplateDir': str(msix_dir),
        'files': file_count,
        'totalBytes': total_bytes,
        'totalMiB': round(total_bytes / (1024 ** 2), 2),
        'corePackEmbedded': bundled_core_included,
        'identityName': identity_name,
        'version': version_4part,
        **visual_meta,
    }
    (out_root / 'windows-staging-manifest.json').write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + '\n',
        encoding='utf-8',
    )
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--out',
        type=Path,
        default=MOBILE_DIST / 'windows-staging',
        help='Target Windows staging root (contains www/, icons/, msix-template/)',
    )
    parser.add_argument('--core-pack', type=Path, default=None, help='Path to core-bundled.pack.db')
    parser.add_argument('--allow-in-repo', action='store_true', help='Allow staging inside repo on CI runners')
    parser.add_argument('--identity-name', default='ChanhPhap.DaiThuVienKinhDien')
    parser.add_argument('--publisher', default='CN=ChanhPhap')
    parser.add_argument('--version', default='1.0.0.0')
    parser.add_argument('--display-name', default='Chánh Pháp - Đại Thư Viện Kinh Điển')
    parser.add_argument('--publisher-display-name', default='Thư Viện Chánh Pháp')
    parser.add_argument('--executable', default='chanh-phap.exe')
    args = parser.parse_args()

    res = build_windows_staging(
        out_root=args.out,
        core_pack_path=args.core_pack,
        allow_in_repo=args.allow_in_repo,
        identity_name=args.identity_name,
        publisher=args.publisher,
        version_4part=args.version,
        display_name=args.display_name,
        publisher_display_name=args.publisher_display_name,
        executable=args.executable,
    )
    print(json.dumps(res, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()


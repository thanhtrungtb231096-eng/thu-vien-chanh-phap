"""Audit local storage and create a complete, verified VPS archive without deleting sources."""
from __future__ import annotations

# Locate the shared path registry from either the workspace or an exported release.
from pathlib import Path as _BootstrapPath
import sys as _bootstrap_sys
_bootstrap_app = next(candidate for ancestor in _BootstrapPath(__file__).resolve().parents
                      for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
                      if (candidate / 'project_paths.py').is_file())
_bootstrap_sys.path.insert(0, str(_bootstrap_app))
from project_paths import ROOT, APP, WEB, BUILD, MAINTENANCE, GENERATED, STATE, DEPENDENCIES, AUDIO_CACHE, WORK_CACHE, CONFIG, DIST, REPORTS, SOURCES, public_path, public_relative, release_relative
_bootstrap_sys.path.insert(0, str(BUILD))
_bootstrap_sys.path.insert(0, str(DEPENDENCIES))


import argparse
from collections import defaultdict
from contextlib import closing
from datetime import datetime, timezone, timedelta
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import tempfile
from urllib.parse import unquote, urlsplit

from server import is_allowed_file
REPORTS = REPORTS / 'dung-luong'

MIB = 1024 ** 2
HASHES = {}
SIGNATURES = {}


def sha256(path):
    path = path.resolve()
    if path not in HASHES:
        before = path.stat()
        digest = hashlib.sha256()
        with path.open('rb') as stream:
            for chunk in iter(lambda: stream.read(MIB), b''):
                digest.update(chunk)
        after = path.stat()
        if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
            raise RuntimeError(f'Tệp thay đổi trong lúc đọc: {path}')
        HASHES[path] = digest.hexdigest()
        SIGNATURES[path] = (after.st_size, after.st_mtime_ns)
    return HASHES[path]


def relative(path):
    return path.relative_to(ROOT).as_posix()


def public_files(files):
    selected = []
    for path in files:
        maintenance = (path.parent in {APP, BUILD} and
                       (path.suffix == '.py' or (path.suffix == '.cjs' and not path.name.endswith('.test.cjs'))))
        maintenance |= path.parent == CONFIG and path.name in {'allowed_hosts.txt', 'audio.txt', 'requirements-audio.txt', 'requirements-collections.txt','edition_metadata.json','stylesheets.json'}
        maintenance |= path.parent == MAINTENANCE and path.name in {'operations_backup.py','health_probe.py'}
        if maintenance or is_allowed_file(path):
            selected.append(path)
    selected = sorted(selected, key=release_relative)
    names = [release_relative(path) for path in selected]
    if len(names) != len(set(names)):
        raise RuntimeError('Duplicate paths in the exported release')
    return selected


def local_reference(url, base=WEB):
    parsed = urlsplit(url)
    if parsed.scheme or parsed.netloc or not parsed.path or parsed.path.startswith('/api/'):
        return None
    return public_path(url)


def catalog_references():
    for name in ('dai-thua-data.js', 'dai-tang-han-data.js', 'phuc-minh-data.js', 'dai-tang-kinh-data.js'):
        source = (WEB / 'js' / name).read_text(encoding='utf-8')
        data = json.JSONDecoder().raw_decode(source.split(' = ', 1)[1].lstrip())[0]
        books = data['texts'] if isinstance(data, dict) else data
        for book in books:
            urls = list(book.get('files', {}).values())
            urls += [book.get(key) for key in ('vietFile', 'hanFile', 'pdfFile', 'sourceFile')]
            urls += [entry.get('file') for entry in book.get('sources', [])]
            for url in urls:
                if url:
                    yield url
    ocr = GENERATED / 'phuc-minh/ocr/editions.json'
    if ocr.is_file():
        for edition in json.loads(ocr.read_text(encoding='utf-8'))['editions']:
            yield edition['file']
    yield from json.loads((GENERATED / 'offline-assets.json').read_text(encoding='utf-8'))


class AssetLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script' and attrs.get('src'):
            self.urls.append(attrs['src'])
        if tag == 'link' and attrs.get('href') and attrs.get('rel') in {'stylesheet', 'icon', 'manifest', 'preload'}:
            self.urls.append(attrs['href'])


def verify_references(selected):
    allowed = set(selected)
    parser = AssetLinks()
    parser.feed((WEB / 'index.html').read_text(encoding='utf-8'))
    references = {path for url in list(catalog_references()) + parser.urls if (path := local_reference(url)) is not None}
    missing = sorted(relative(path) for path in references if path not in allowed)
    if missing:
        raise RuntimeError('Gói triển khai thiếu tệp được liên kết: ' + json.dumps(missing, ensure_ascii=False))
    return len(references)


def open_index(path):
    return sqlite3.connect(path.resolve().as_uri() + '?mode=ro', uri=True, timeout=60)


def index_stats(path, verify_sources=False):
    with closing(open_index(path)) as db:
        stats = {name: db.execute('PRAGMA ' + name).fetchone()[0] for name in ('page_size', 'page_count', 'freelist_count')}
        stats['bytes'] = path.stat().st_size
        stats['documents'] = db.execute('SELECT COUNT(*) FROM documents').fetchone()[0]
        stats['passages'] = db.execute('SELECT COUNT(*) FROM passages').fetchone()[0]
        stats['collections'] = dict(db.execute("SELECT substr(book_key,1,instr(book_key,':')-1),COUNT(*) FROM documents GROUP BY 1"))
        if verify_sources:
            stale = []
            for (value,) in db.execute('SELECT meta FROM documents'):
                meta = json.loads(value)
                path = local_reference(meta['source'])
                if path is None or not path.is_file() or sha256(path) != meta.get('sha256'):
                    stale.append(meta['source'])
            if stale:
                raise RuntimeError('Chỉ mục không khớp bản chữ hiện tại. Dựng lại chỉ mục trước khi đóng gói: ' + json.dumps(stale, ensure_ascii=False))
    return stats


def scan(out):
    files = []
    for path in ROOT.rglob('*'):
        if path.is_symlink():
            raise RuntimeError(f'Cần kiểm tra liên kết trước khi đóng gói: {path}')
        if path.is_file() and not path.is_relative_to(out) and not path.is_relative_to(REPORTS):
            files.append(path)
    groups = defaultdict(lambda: {'bytes': 0, 'files': 0})
    for path in files:
        group = groups[path.relative_to(ROOT).parts[0]]
        group['bytes'] += path.stat().st_size
        group['files'] += 1
    selected = public_files(files)
    references = verify_references(selected)
    index = index_stats(STATE / 'search.sqlite3', verify_sources=True)
    # Only hash equal-size source/asset candidates; caches and runtime copies are not candidates for removal.
    sizes = defaultdict(list)
    for path in selected:
        if path.stat().st_size:
            sizes[path.stat().st_size].append(path)
    duplicates = []
    for size, candidates in sizes.items():
        if len(candidates) < 2:
            continue
        content = defaultdict(list)
        for path in candidates:
            content[sha256(path)].append(relative(path))
        for paths in content.values():
            if len(paths) > 1:
                duplicates.append({'bytes_each': size, 'paths': paths, 'redundant_bytes': size * (len(paths) - 1)})
    report = {
        'generatedAt': datetime.now(timezone(timedelta(hours=7))).isoformat(),
        'scope': 'Workspace before packaging; output directory and this report directory excluded.',
        'files': len(files), 'totalBytes': sum(group['bytes'] for group in groups.values()),
        'directories': dict(sorted(groups.items(), key=lambda item: item[1]['bytes'], reverse=True)),
        'index': index, 'verifiedReferences': references,
        'deployFiles': len(selected) + 1,
        'deployBytes': sum(path.stat().st_size for path in selected) + index['bytes'],
        'largestFiles': [{'path': relative(path), 'bytes': path.stat().st_size} for path in sorted(files, key=lambda path: path.stat().st_size, reverse=True)[:30]],
        'duplicates': sorted(duplicates, key=lambda item: item['redundant_bytes'], reverse=True),
        'duplicateBytes': sum(item['redundant_bytes'] for item in duplicates),
        'deletedFiles': 0,
    }
    write_report(report)
    return selected, report


def write_report(report):
    REPORTS.mkdir(parents=True, exist_ok=True)
    (REPORTS / 'audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    index = report['index']
    lines = [
        '# Rà soát dung lượng và gói VPS', '',
        f"Ngày kiểm tra: {report['generatedAt'][:10]}. Dung lượng dùng đơn vị MiB/GiB (1024).",
        f"Thư mục trước khi đóng gói: **{report['totalBytes'] / MIB / 1024:.2f} GiB**, {report['files']:,} tệp. Không tính thư mục gói xuất và báo cáo này.", '',
        '| Mục | Dung lượng MiB | Số tệp |', '| --- | ---: | ---: |',
    ]
    lines += [f"| `{name}` | {value['bytes'] / MIB:.2f} | {value['files']:,} |" for name, value in report['directories'].items()]
    lines += [
        '', '## Kết luận', '',
        f"- Chỉ mục tìm kiếm có {index['documents']:,} bản chữ, {index['passages']:,} đoạn. Tệp chỉ mục: {index['bytes'] / MIB:.2f} MiB; vùng trống chỉ {index['freelist_count'] * index['page_size'] / MIB:.2f} MiB. VACUUM không giúp giảm đáng kể.",
        f"- Đã đối chiếu SHA-256 các bản chữ với chỉ mục và kiểm tra {report['verifiedReferences']:,} liên kết nguồn/tài nguyên. Gói bao gồm Word gốc của `EbooksProject`, bản chữ chuyển đổi, PDF, font, giao diện và chỉ mục.",
        '- Script đóng gói trước đây bỏ sót `EbooksProject`; liên kết tải Word và lưu ngoại tuyến có thể bị thiếu khi cập nhật VPS.',
        '- Gói mới bỏ runtime Windows, cache, bộ kiểm thử, tệp ZIP cũ và tài liệu phát triển; giữ nguyên tệp nguồn trên máy.',
        '- `personal.sqlite3` chứa ghép nối thiết bị và dữ liệu cá nhân: không xóa và không đưa lên VPS để ghi đè dữ liệu người dùng.',
        '- `local/runtime/python/` dùng để chạy ứng dụng/giọng đọc/xử lý PDF trên Windows; VPS cài phụ thuộc Linux riêng.',
        '- `local/storage/cache/audio/` có thể tạo lại khi nghe (cần Internet). `local/storage/cache/work/` chứa mô hình/trang OCR và log. Các cache này không được đưa vào gói VPS.',
        f"- Phát hiện {len(report['duplicates']):,} nhóm tệp triển khai có nội dung trùng, tương đương {report['duplicateBytes'] / MIB:.2f} MiB. Nhiều đường dẫn còn được danh mục sử dụng; không xóa chỉ vì nội dung trùng. Danh sách trong `audit.json`.",
        f"- Gói chưa nén: {report['deployBytes'] / MIB / 1024:.2f} GiB, {report['deployFiles']:,} tệp. Dùng LZMA2 mức 5, tạo bản chụp SQLite nhất quán và kiểm tra 7-Zip trước khi xuất.",
        '- Công cụ rà soát và đóng gói giữ nguyên tệp nguồn/cache trên Windows.',
    ]
    if 'package' in report:
        package = report['package']
        lines += ['', '## Gói đã tạo', '',
                  f"- Tệp: `{package['path']}` ({package['bytes'] / MIB:.2f} MiB).",
                  f"- Nhỏ hơn tổng thư mục trước đóng gói: {100 * (1 - package['bytes'] / report['totalBytes']):.1f}% (gồm bỏ tệp không triển khai và nén).",
                  '- Đã kiểm tra CRC toàn bộ gói, danh sách tệp, tính toàn vẹn SQLite và truy vấn tìm kiếm trên bản chụp.',
                  '- Đi kèm `cai_dat_vps.sh`, `package-manifest.json` và `thuvien.7z.sha256`.']
    (REPORTS / 'RA_SOAT_DUNG_LUONG.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')


def sevenzip_run(sevenzip, args, cwd):
    command = [str(sevenzip)] + args
    result = subprocess.run(command, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, encoding='utf-8', errors='replace')
    if result.returncode:
        raise RuntimeError(f'7-Zip không hoàn tất (mã {result.returncode}):\n{result.stdout[-6000:]}')
    return result.stdout


def verify_snapshot(snapshot, original_stats):
    with closing(open_index(snapshot)) as db:
        result = list(db.execute('PRAGMA quick_check'))
        if result != [('ok',)]:
            raise RuntimeError(f'Bản chụp SQLite không hợp lệ: {result}')
        stats = index_stats(snapshot)
        for key in ('documents', 'passages', 'collections'):
            if stats[key] != original_stats[key]:
                raise RuntimeError('Chỉ mục thay đổi trong lúc đóng gói; hãy chạy lại khi hoàn tất dựng dữ liệu.')
        with closing(open_index(STATE / 'search.sqlite3')) as original:
            for query in ('"a di da"', '"tu bi"*', '"phat" AND "phap"'):
                sql = 'SELECT rowid FROM fulltext WHERE fulltext MATCH ? ORDER BY rowid LIMIT 30'
                if list(db.execute(sql, (query,))) != list(original.execute(sql, (query,))):
                    raise RuntimeError(f'Kết quả tìm kiếm khác trên bản chụp: {query}')


def stage_release_files(staging, selected):
    """Materialize the compatible release using hard links, with copying as a fallback."""
    staging = staging.resolve()
    for source in selected:
        target = staging / release_relative(source)
        if not target.resolve().is_relative_to(staging):
            raise ValueError('Release file outside staging directory')
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            os.link(source, target)
        except OSError:
            shutil.copyfile(source, target)


def create_package(out, sevenzip, selected, report):
    if not sevenzip.is_file():
        raise RuntimeError('Không thấy 7-Zip. Cài 7-Zip hoặc chỉ chạy --audit-only.')
    out.mkdir(parents=True, exist_ok=True)
    required_space = report['index']['bytes'] + report['deployBytes'] + 256 * MIB
    if shutil.disk_usage(out).free < required_space:
        raise RuntimeError(f'Cần ít nhất {required_space / MIB / 1024:.1f} GiB trống cho bản chụp và gói tạm.')
    with tempfile.TemporaryDirectory(prefix='.build-', dir=out) as temporary:
        staging = Path(temporary).resolve()
        if not staging.is_relative_to(out) or staging == out:
            raise RuntimeError('Thư mục tạm ngoài thư mục xuất; dừng thao tác.')
        snapshot = staging / '.library-state/search.sqlite3'
        snapshot.parent.mkdir()
        print('[2/5] Tạo bản chụp chỉ mục SQLite nhất quán...', flush=True)
        with closing(open_index(STATE / 'search.sqlite3')) as source, closing(sqlite3.connect(snapshot)) as target:
            source.backup(target, pages=8192)
        verify_snapshot(snapshot, report['index'])
        manifest = [{'path': release_relative(path), 'bytes': path.stat().st_size, 'sha256': sha256(path)} for path in selected]
        manifest.append({'path': '.library-state/search.sqlite3', 'bytes': snapshot.stat().st_size, 'sha256': sha256(snapshot)})
        listing = staging / 'include.txt'
        listing.write_text('\n'.join(release_relative(path) for path in selected) + '\n', encoding='utf-8')
        archive = staging / 'thuvien.7z'
        options = ['-t7z', '-mx=5', '-m0=LZMA2', '-md=32m', '-mmt=2', '-scsUTF-8', '-sccUTF-8', '-spd', '-bsp0', '-bb0']
        stage_release_files(staging, selected)
        print('[3/5] Nén giao diện và toàn bộ tài liệu nguồn...', flush=True)
        sevenzip_run(sevenzip, ['a', str(archive), '@' + str(listing)] + options, staging)
        print('[4/5] Nén chỉ mục tìm kiếm...', flush=True)
        sevenzip_run(sevenzip, ['a', str(archive), '.library-state/search.sqlite3'] + options, staging)
        for path in selected:
            stat = path.stat()
            if (stat.st_size, stat.st_mtime_ns) != SIGNATURES[path.resolve()]:
                raise RuntimeError(f'Tệp thay đổi trong lúc nén: {relative(path)}. Hãy đóng gói lại.')
        print('[5/5] Kiểm tra CRC và danh sách tệp trong gói...', flush=True)
        sevenzip_run(sevenzip, ['t', str(archive), '-sccUTF-8', '-bsp0'], ROOT)
        listing_text = sevenzip_run(sevenzip, ['l', '-slt', '-ba', '-sccUTF-8', str(archive)], ROOT)
        entries = [line.removeprefix('Path = ').replace('\\', '/') for line in listing_text.splitlines() if line.startswith('Path = ')]
        expected = {entry['path'] for entry in manifest}
        if set(entries) != expected or len(entries) != len(expected):
            raise RuntimeError('Danh sách tệp trong gói khác danh sách đã kiểm tra.')
        final = out / 'thuvien.7z'
        # A temporary directory may give the archive an owner-only Windows ACL.
        # Publish atomically and keep only the latest verified package.
        pending = out / '.thuvien-current.part'
        try:
            shutil.copyfile(archive, pending)
            os.replace(pending, final)
        finally:
            pending.unlink(missing_ok=True)
        installer = (Path(__file__).parent / 'cai_dat_vps.sh').read_text(encoding='utf-8').replace('\r\n', '\n')
        (out / 'cai_dat_vps.sh').write_text(installer, encoding='utf-8', newline='\n')
        for name in ('cap_nhat_vps.sh', 'verify_vps.py'):
            content = (Path(__file__).parent / name).read_text(encoding='utf-8').replace('\r\n', '\n')
            (out / name).write_text(content, encoding='utf-8', newline='\n')
        archive_hash = sha256(final)
        (out / 'thuvien.7z.sha256').write_text(f'{archive_hash}  thuvien.7z\n', encoding='ascii', newline='\n')
        package_manifest = {'generatedAt': report['generatedAt'], 'archiveSha256': archive_hash, 'index': report['index'], 'files': manifest}
        (out / 'package-manifest.json').write_text(json.dumps(package_manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        report['package'] = {'path': str(final), 'bytes': final.stat().st_size, 'sha256': archive_hash}
        write_report(report)
    print(f"[OK] {final} ({final.stat().st_size / MIB:.2f} MiB)", flush=True)
    print(f'[OK] Báo cáo: {REPORTS / "RA_SOAT_DUNG_LUONG.md"}', flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=DIST)
    parser.add_argument('--sevenzip', type=Path, default=Path('C:/Program Files/7-Zip/7z.exe'))
    parser.add_argument('--audit-only', action='store_true')
    args = parser.parse_args()
    out = args.out.resolve()
    if out.is_relative_to(ROOT) or ROOT.is_relative_to(out):
        parser.error('Thư mục xuất phải nằm ngoài dự án và không được chứa thư mục dự án.')
    print('[1/5] Rà soát dung lượng, nguồn và liên kết triển khai...', flush=True)
    selected, report = scan(out)
    print(f"[OK] {report['totalBytes'] / MIB / 1024:.2f} GiB; gói chưa nén {report['deployBytes'] / MIB / 1024:.2f} GiB; {report['verifiedReferences']:,} liên kết đầy đủ.", flush=True)
    if not args.audit_only:
        create_package(out, args.sevenzip, selected, report)


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, RuntimeError, sqlite3.Error) as error:
        print(f'[LỖI] {error}', file=sys.stderr, flush=True)
        sys.exit(1)

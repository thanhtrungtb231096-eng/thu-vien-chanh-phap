"""Build the independent Đại Tạng Kinh collection from EbooksProject.

Keep source Word files unchanged. IDs depend on source paths, not scan order.
Missing text is catalogued but never offered as a complete reading edition.
"""

# Locate the shared path registry from either the workspace or an exported release.
from pathlib import Path as _BootstrapPath
import sys as _bootstrap_sys
_bootstrap_app = next(candidate for ancestor in _BootstrapPath(__file__).resolve().parents
                      for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
                      if (candidate / 'project_paths.py').is_file())
_bootstrap_sys.path.insert(0, str(_bootstrap_app))
from project_paths import ROOT, APP, WEB, BUILD, GENERATED, STATE, DEPENDENCIES, AUDIO_CACHE, WORK_CACHE, CONFIG, DIST, REPORTS, SOURCES, public_path, public_relative, release_relative
_bootstrap_sys.path.insert(0, str(BUILD))
_bootstrap_sys.path.insert(0, str(DEPENDENCIES))

from pathlib import Path
from urllib.parse import quote
from collections import Counter
import hashlib
import json
import math
import re
import zipfile
from legacy_word import extract_word

SOURCE = SOURCES['EbooksProject']
DEST = GENERATED / 'dai-tang-kinh'
GROUPS = {
    'Dai-Tang-Kinh': 'Kinh & luận', 'Giang-Kinh': 'Giảng kinh',
    'Buoc-Dau-Hoc-Phat': 'Bước đầu học Phật', 'Thien-Tong': 'Thiền',
    'Tinh-Tong': 'Tịnh độ', 'Duy-Thuc-Tong': 'Duy thức', 'Mat-Tong': 'Mật tông',
    'Kinh-Tung-Sam-Van': 'Kinh tụng & sám văn', 'Thuyet-Phap': 'Phật học & thuyết pháp',
    'Sach-Noi': 'Sách Phật học & văn học', 'Khuyen-Tu': 'Khuyến tu',
    'Tam-Benh': 'Tâm & đời sống', 'Than-Benh': 'Sách sức khỏe'}
SUBGROUPS = {
    'Kinh-Bac-Tong': 'Kinh Bắc tông', 'Kinh-Nam-Tong': 'Kinh Pāli / Nam tông',
    'Luan-Bac-Tong': 'Luận Bắc tông', 'Luan-Nam-Tong': 'Luận & A-tỳ-đàm',
    'Hoc-Thien': 'Học Thiền', 'Thien-Nguyen-Thuy': 'Thiền nguyên thủy',
    'Hoc-Tinh': 'Học Tịnh độ', 'Hoc-Duy-Thuc': 'Học Duy thức', 'Hoc-Mat': 'Học Mật',
    'Truoc-Tac': 'Trước tác', 'Luan': 'Luận', 'Viet-Nam': 'Việt Nam', 'Quoc-Te': 'Quốc tế',
    'Sam-Van': 'Sám văn', 'Kinh-Tung': 'Kinh tụng', 'Niem-Phat': 'Niệm Phật',
    '12-Nhan-Duyen': 'Mười hai nhân duyên', 'Bat-Chanh-Dao': 'Bát chánh đạo',
    'Tu-Dieu-De': 'Tứ diệu đế', 'Phat-Hoc-Van-Dap': 'Phật học vấn đáp',
    'So-Do-Hoc-Phat': 'Nhập môn Phật học', 'Khai-Thi': 'Khai thị', 'Nhan-Thuc-PG': 'Nhận thức Phật giáo',
    'An-Chay': 'Ăn chay', 'Bo-Tat': 'Bồ-tát', 'Gioi-Luat': 'Giới luật', 'Danh-Tang': 'Danh Tăng',
    'Nghi-Thuc': 'Nghi thức', 'Nghiep': 'Nghiệp', 'Ho-Niem': 'Hộ niệm', 'Phat-Su': 'Lịch sử Phật giáo',
    'Sanh-Tu': 'Sinh tử', 'Tuyen-Tap': 'Tuyển tập', 'Dai-Thua': 'Đại thừa',
    'PG-Va-Tuoi-Tre': 'Phật giáo & tuổi trẻ', 'Phat-Giao-Va-Doanh-Nhan': 'Phật giáo & doanh nhân',
    'Phat-Giao-Va-Khoa-Hoc': 'Phật giáo & khoa học', 'Ban-Than': 'Chăm sóc tâm',
    'Con-Cai': 'Giáo dục & con cái', 'Vo-Chong': 'Gia đình', 'Ung-Thu': 'Tài liệu sức khỏe',
    'Chuyen-Doi-Tu-Ke': 'Chuyện tu tập', 'Chuyen-Vang-Sanh': 'Chuyện vãng sinh',
    'Bat-Dai-Nhan-Giac': 'Bát Đại Nhân Giác', 'Bat-Nha-Tam-Kinh': 'Bát Nhã Tâm Kinh',
    'Gioi-Thieu-Ve-Kinh-Dien': 'Giới thiệu kinh điển', 'Kinh-Pali-A-Ham': 'Pāli & A-hàm',
    'Kinh-42-Chuong': 'Kinh Bốn Mươi Hai Chương', 'Kinh-A-Di-Da': 'Kinh A Di Đà',
    'Kinh-Ba-La-Mat': 'Bát Nhã & Ba-la-mật', 'Kinh-Dai-Bao-Tich': 'Kinh Đại Bảo Tích',
    'Kinh-Dai-Bi': 'Kinh Đại Bi', 'Kinh-Di-Giao': 'Kinh Di Giáo', 'Kinh-Dia-Tang': 'Kinh Địa Tạng',
    'Kinh-Duoc-Su': 'Kinh Dược Sư', 'Kinh-Duy-Ma-Cat': 'Kinh Duy Ma Cật',
    'Kinh-Hoa-Nghiem': 'Kinh Hoa Nghiêm', 'Kinh-Khac': 'Các kinh khác',
    'Kinh-Kim-Cang': 'Kinh Kim Cang', 'Kinh-Lang-Gia': 'Kinh Lăng Già',
    'Kinh-Lang-Nghiem': 'Kinh Lăng Nghiêm', 'Kinh-Niet-Ban': 'Kinh Niết Bàn',
    'Kinh-Pham-Vong': 'Kinh Phạm Võng', 'Kinh-Phap-Bao-Dan': 'Kinh Pháp Bảo Đàn',
    'Kinh-Phap-Hoa': 'Kinh Pháp Hoa', 'Kinh-Pho-Mon': 'Kinh Phổ Môn',
    'Kinh-Quan-Vo-Luong-Tho': 'Kinh Quán Vô Lượng Thọ', 'Kinh-Thang-Man': 'Kinh Thắng Man',
    'Kinh-Vien-Giac': 'Kinh Viên Giác', 'Kinh-Vo-Luong-Tho': 'Kinh Vô Lượng Thọ'}


def norm(text):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', text.lower().replace('đ', 'd'))
                   if not unicodedata.combining(c))


def source_label_notes(filename):
    """Record verified label mistakes without rewriting the source text."""
    if filename.startswith('Kinh-Trung-Bo-'):
        return ['Đầu Word gốc ghi Dìgha Nikàya. Tên tương ứng với Kinh Trung Bộ là Majjhima Nikāya; nội dung nguồn được giữ để đối chiếu.']
    if filename.startswith('Kinh-Tang-Chi-Bo-'):
        return ['Đầu Word gốc ghi Samyutta Nikàya. Tên tương ứng với Kinh Tăng Chi Bộ là Aṅguttara Nikāya; nội dung nguồn được giữ để đối chiếu.']
    return []


def title_for(text, filename):
    curated = json.loads((CONFIG / 'edition_metadata.json').read_text(encoding='utf-8')) if (CONFIG / 'edition_metadata.json').is_file() else {}
    if filename in curated:
        return curated[filename]['title']
    overrides = {
        'Kinh-Truong-Bo-': 'Kinh Trường Bộ', 'Kinh-Trung-Bo-': 'Kinh Trung Bộ',
        'Kinh-Tuong-Ung-Bo-': 'Kinh Tương Ưng Bộ', 'Kinh-Tang-Chi-Bo-': 'Kinh Tăng Chi Bộ',
        'Thanh-Tinh-Dao-': 'Thanh Tịnh Đạo',
        'Duong-Xua-May-Trang-': 'Đường Xưa Mây Trắng',
        'Vi-Dieu-Phap-Toat-Yeu-': 'Vi Diệu Pháp Toát Yếu',
        'Thang-Phap-Yeu-Luan-': 'Thắng Pháp Tập Yếu Luận',
        'Kinh Phap Hoa Giang Luan 1': 'Kinh Pháp Hoa Giảng Luận · Tập 1'}
    for prefix, title in overrides.items():
        if filename.startswith(prefix): return title
    match = re.match(r'(Kinh-Tieu-Bo|Kinh-Hoa-Nghiem|Kinh-Dai-Bat-Nha-Ba-La-Mat-Da|Dai-Tri-Do-Luan|Kinh-Ma-Ha-Bat-Nha-Ba-La-Mat)-(\d+)-', filename)
    if match:
        names = {'Kinh-Tieu-Bo': 'Kinh Tiểu Bộ', 'Kinh-Hoa-Nghiem': 'Kinh Hoa Nghiêm',
                 'Kinh-Dai-Bat-Nha-Ba-La-Mat-Da': 'Kinh Đại Bát Nhã Ba La Mật Đa',
                 'Dai-Tri-Do-Luan': 'Đại Trí Độ Luận', 'Kinh-Ma-Ha-Bat-Nha-Ba-La-Mat': 'Kinh Ma Ha Bát Nhã Ba La Mật'}
        return names[match[1]] + ' · Tập ' + match[2]
    candidates = []
    for line in text.splitlines()[:35]:
        line = re.sub(r'\s+', ' ', line).strip(' .\t\u00a0')
        if not line or not re.search(r'[\wÀ-ỹ]', line): continue
        if norm(line) in ('muc luc', 'loi noi dau', 'loi tua'): break
        if re.search(r'^(?:đại tạng kinh việt nam|giáo hội|sa môn|sa-môn|nhà xuất bản|phật học viện|https?://|www\.|---)', line, re.I): continue
        if len(line) > 160: continue
        candidates.append(line)
        if len(candidates) == 3: break
    if candidates:
        title = candidates[0]
        if len(candidates) > 1 and (title.isupper() and candidates[1].isupper()) and not re.match(
                r'^(HT|TT|TK|ĐĐ|NS|GS|VIỆT DỊCH|HÁN DỊCH|NGUYÊN TÁC|TÁC GIẢ|DỊCH)', candidates[1]):
            title += ' · ' + candidates[1]
        if title.isupper(): title = title.title()
        return title
    return re.split(r'-(?:HT|TT|TK|DD|Ns|Gs|Bs)-', Path(filename).stem)[0].replace('-', ' ')


def credits_for(text, filename):
    curated = json.loads((CONFIG / 'edition_metadata.json').read_text(encoding='utf-8')) if (CONFIG / 'edition_metadata.json').is_file() else {}
    if filename in curated:
        return curated[filename]['credits']
    credits = []
    lines = text.splitlines()[:28]
    for line in lines:
        if norm(line.strip()) == 'muc luc': break
        match = re.match(r'\s*(Việt\s*[Dd]ịch|Hán\s*[Dd]ịch|Dịch [Gg]iả|Tác [Gg]iả|Nguyên [Tt]ác|Người dịch|Chuyển [Nn]gữ|Soạn [Dd]ịch)\s*:?\s+(.+)', line)
        if match:
            name = re.sub(r'\s*[-–]\s*(?:Phật [Ll]ịch|\d{4}).*', '', match[2]).strip()
            if len(name) < 140:
                credits.append({'role': 'Hán dịch' if match[1].startswith('Hán') else
                                'Tác giả' if match[1] in ('Tác Giả', 'Tác giả', 'Nguyên tác', 'Nguyên Tác') else 'Việt dịch',
                                'name': name, 'cover': True})
    if not credits:
        for line in lines:
            if norm(line.strip()) == 'muc luc': break
            if re.match(r'\s*(?:HT|TT|TK|ĐĐ|Ns|GS|Tỳ [Kk]heo|Hòa [Tt]hượng)[.\s]', line) and len(line) < 125:
                credits.append({'role': 'Việt dịch' if '-Dich' in filename else 'Tác giả / người giảng',
                                'name': line.strip(), 'cover': True})
                break
    # Canonical files have explicit, verifiable source headers.
    if filename.startswith(('Kinh-Truong-Bo-', 'Kinh-Trung-Bo-', 'Kinh-Tuong-Ung-Bo-', 'Kinh-Tang-Chi-Bo-')):
        credits = [{'role': 'Việt dịch', 'name': 'HT. Thích Minh Châu', 'cover': True}]
    if filename.startswith('Thanh-Tinh-Dao-'):
        credits = [{'role': 'Luận sư', 'name': 'Buddhaghosa (Phật Âm)', 'cover': True},
                   {'role': 'Việt dịch', 'name': 'Ns. Trí Hải', 'cover': True}]
    if filename.startswith('Vi-Dieu-Phap-Toat-Yeu-'):
        credits = [{'role': 'Tác giả', 'name': 'Nārada Mahā Thera', 'cover': True},
                   {'role': 'Việt dịch', 'name': 'Phạm Kim Khánh', 'cover': True}]
    unique = {}
    for credit in credits: unique[(credit['role'], norm(credit['name']))] = credit
    return list(unique.values())[:4]


def markdown(text, title, credits, notes):
    result = ['# ' + title, '']
    result += ['> ' + c['role'] + ': ' + c['name'] for c in credits]
    result += ['']
    lines = text.splitlines()
    # Source TOCs remain visible as metadata; the actual reader TOC is built
    # from chapter headings in the body, never from front-matter repetitions.
    toc = next((i for i, line in enumerate(lines[:160]) if norm(line.strip()) == 'muc luc'), None)
    toc_end = None
    if toc is not None:
        toc_end = next((i for i in range(toc + 1, min(len(lines), toc + 1200))
                        if re.fullmatch(r'[-–—\s]*[oO0]+[-–—\s]*', lines[i].strip())), None)
    for index, original in enumerate(lines):
        line = original.strip()
        if not line:
            result.append(''); continue
        if toc is not None and toc_end is not None and toc <= index <= toc_end:
            result.append('> ' + line); continue
        heading = len(line) <= 150 and (re.match(
            r'^(?:PHẨM|CHƯƠNG|QUYỂN|PHẦN|THIÊN|TẬP)\b|^\d+[.\-]\s*Kinh\b|^\[\d+\]\s*Chương', line, re.I)
            or (line.isupper() and len(line) > 5 and re.search(r'[A-ZÀ-Ỹ]', line)
                and not line.startswith(('HT.', 'TT.', 'TK.', 'ĐĐ.', 'VIỆT DỊCH', 'HÁN DỊCH')))
            or norm(line) in ('loi noi dau', 'loi tua', 'loi gioi thieu', 'loi nguoi dich', 'tong luan'))
        if heading:
            result.extend(['', ('## ' if re.match(r'^(?:PHẦN|QUYỂN|THIÊN|TẬP)\b', line, re.I) else '### ') + line, ''])
        else:
            result.append(original)
            # A Word paragraph is a semantic paragraph, including when it was
            # copied from HTML. Keep an empty separator for reader blocks.
            result.append('')
    for label, note in notes:
        result.extend(['', '## ' + label, '', note, ''])
    return '\n'.join(result).rstrip() + '\n'


def build():
    (DEST / 'text').mkdir(parents=True, exist_ok=True)
    (DEST / 'originals').mkdir(exist_ok=True)
    sources = []
    for path in sorted(SOURCE.rglob('*.doc')):
        if path.name.startswith('~$'): continue
        rel = path.relative_to(SOURCE).as_posix()
        sources.append((rel, path.name, path.read_bytes(), '../EbooksProject/' + quote(rel, safe='/'), rel))
    for archive_path in sorted(SOURCE.rglob('*.zip')):
        rel = archive_path.relative_to(SOURCE).as_posix()
        with zipfile.ZipFile(archive_path) as archive:
            for member in sorted(archive.namelist()):
                if not member.lower().endswith('.doc') or member.startswith('~$'): continue
                key = rel + '::' + member
                id = 'ep-' + hashlib.sha256(key.encode()).hexdigest()[:12]
                value = archive.read(member)
                # No member paths are used for extraction; traversal cannot escape.
                output = DEST / 'originals' / (id + '.doc')
                output.write_bytes(value)
                sources.append((key, member, value, 'data/dai-tang-kinh/originals/' + id + '.doc', rel))
    books, audit, dedup = [], [], {}
    for number, (source_key, filename, value, url, rel) in enumerate(sources, 1):
        id = 'ep-' + hashlib.sha256(source_key.encode()).hexdigest()[:12]
        parts = rel.split('/')
        group = GROUPS[parts[0]]
        subcategory = SUBGROUPS.get(parts[1], parts[1].replace('-', ' '))
        source = {'file': url, 'filename': filename, 'path': source_key,
                  'bytes': len(value), 'sha256': hashlib.sha256(value).hexdigest()}
        try:
            extracted = extract_word(value)
            text = extracted['text']
            if extracted['expectedMainCodeUnits'] != extracted['extractedMainCodeUnits']:
                raise ValueError('Word story length mismatch')
            title = title_for(text, filename)
            credits = credits_for(text, filename)
            missing = len(text) < 500
            flags, notices = [], []
            if missing:
                flags.append('missing-body'); notices.append('Tệp nguồn hiện chỉ có thông tin đầu sách. Chưa có bản chữ để đọc và nghe.')
            if re.search(r'(?:^|-)thieu-(?:q\d|quyen|cuon|file|chuong|\d)', filename.lower()):
                flags.append('partial-source'); notices.append('Tên tệp nguồn ghi thiếu một số quyển, trang hoặc chương. Nội dung hiện có được giữ để đối chiếu.')
            if 'chua-add' in filename.lower() and not missing:
                flags.append('source-needs-review'); notices.append('Nguồn có ghi chú đang bổ sung nội dung; cần đối chiếu Word gốc.')
            if extracted['convertedParagraphs']:
                flags.append('legacy-font-converted'); notices.append('Một số đoạn đã chuyển mã chữ Việt cũ sang Unicode; có thể đối chiếu trong Word gốc.')
            if extracted['embeddedObjects']:
                flags.append('embedded-objects'); notices.append('Hình ảnh và đối tượng nhúng được giữ trong Word gốc.')
            if '\ufffd' in text:
                flags.append('replacement-characters'); notices.append('Bản chữ có ký tự chưa nhận dạng được; cần đối chiếu Word gốc tại những chỗ này.')
            label_notes = source_label_notes(filename)
            if label_notes:
                flags.append('source-label-mismatch'); notices.extend(label_notes)
            body = markdown(text, title, credits, extracted['notes'])
            body_hash = hashlib.sha256((text + repr(extracted['notes'])).encode('utf-8')).hexdigest()
            prior = dedup.get(body_hash) if not missing and not extracted['embeddedObjects'] else None
            if prior:
                prior['sources'].append(source)
                prior['groups'] = sorted(set(prior['groups'] + [group]))
                prior['topics'] = sorted(set(prior['topics'] + [subcategory]))
                audit.append({'source': source_key, 'aliasOf': prior['id']})
                continue
            if not missing: (DEST / 'text' / (id + '.md')).write_text(body, encoding='utf-8')
            featured = filename.startswith(('Kinh-Truong-Bo-', 'Thanh-Tinh-Dao-', 'Duong-Xua-May-Trang-'))
            book = {'id': id, 'title': title, 'category': group, 'subcategory': subcategory,
                    'groups': [group], 'topics': [subcategory], 'credits': credits,
                    'description': group + ' · ' + subcategory + '.',
                    'filename': filename, 'sourceFile': url, 'sourceKind': 'word', 'sources': [source],
                    'vietFile': '' if missing else 'data/dai-tang-kinh/text/' + id + '.md',
                    'bytes': len(value), 'characters': len(text), 'words': len(text.split()),
                    'listenMinutes': max(1, math.ceil(len(text.split()) / 170)) if not missing else 0,
                    'featured': featured, 'status': 'missing' if missing else 'partial' if 'partial-source' in flags else 'readable',
                    'flags': flags, 'sourceNotes': notices, 'proofread': False}
            books.append(book)
            curated = json.loads((CONFIG / 'edition_metadata.json').read_text(encoding='utf-8')) if (CONFIG / 'edition_metadata.json').is_file() else {}
            if filename in curated:
                book.update({k:v for k,v in curated[filename].items() if k not in ('evidence','title','credits')})
            if not missing and not extracted['embeddedObjects']: dedup[body_hash] = book
            audit.append({'id': id, 'source': source_key, 'flags': flags,
                          'convertedParagraphs': extracted['convertedParagraphs'],
                          'embeddedObjects': extracted['embeddedObjects'], 'textCharacters': len(text)})
        except Exception as error:
            raise RuntimeError(f'{source_key}: {error}') from error
        if number % 200 == 0: print(f'Converted {number}/{len(sources)} source documents', flush=True)
    books.sort(key=lambda b: (not b['featured'], list(GROUPS.values()).index(b['category']), norm(b['title'])))
    groups = [{'id': label, 'name': label, 'count': sum(label in b['groups'] for b in books)} for label in GROUPS.values()]
    manifest = {'name': 'Đại Tạng Kinh', 'source': 'EbooksProject', 'version': 1,
                'groups': groups, 'sourceDocuments': len(sources), 'books': books,
                'readable': sum(bool(b['vietFile']) for b in books)}
    (DEST / 'catalog.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    (DEST / 'conversion-audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf-8')
    (WEB / 'js/dai-tang-kinh-data.js').write_text('/* Generated by build_ebooks.py. */\nwindow.DAI_TANG_KINH_DATA = '
        + json.dumps(books, ensure_ascii=False) + ';\nwindow.DAI_TANG_KINH_GROUPS = '
        + json.dumps(groups, ensure_ascii=False) + ';\n', encoding='utf-8')
    from build_catalog_summary import build as build_summary
    build_summary()
    print(json.dumps({'sourceDocuments': len(sources), 'editions': len(books), 'readable': manifest['readable'],
                      'states': dict(Counter(b['status'] for b in books)), 'aliases': sum('aliasOf' in x for x in audit)}, ensure_ascii=False))


if __name__ == '__main__':
    build()

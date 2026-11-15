"""Build the independent Phúc Minh collection from local PDFs.

Run: python -X utf8 tools/build/build_phuc_minh.py
Install the build/PDF preview dependency into local/runtime/python with config/requirements-collections.txt.
Source PDFs are never modified. IDs are stable across rebuilds.
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

import hashlib
import argparse
import json
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path
from urllib.parse import quote

sys.path.insert(0, str(DEPENDENCIES))
import pymupdf

# Titles and descriptions describe the supplied editions, not every work by an author.
BOOKS = [
    ('hoi-dap-can-ban', 'HỎI ĐÁP PHẬT PHÁP CĂN BẢN.pdf', 'Hỏi đáp Phật pháp căn bản', 'Giáo lý & vấn đáp', 'Tìm hiểu giáo pháp qua hình thức hỏi và đáp.', True),
    ('so-tay-thien-dinh', 'SỔ TAY THỰC HÀNH THIỀN ĐỊNH.pdf', 'Sổ tay thực hành thiền định', 'Thực hành thiền', 'Tài liệu tra cứu các đề mục và phương pháp thiền định.', True),
    ('kinh-nhat-tung', 'kinh nhat tung - a5.pdf', 'Kinh nhật tụng', 'Kinh tụng & bảo hộ', 'Các bài kinh dành cho thời khóa tụng đọc hằng ngày.', True),
    ('thien-hoi-tho', 'Phuong Phap Thuc hanh thien hoi tho.pdf', 'Phương pháp thực hành thiền hơi thở', 'Thực hành thiền', 'Bài giảng về thực hành thiền niệm hơi thở.', False),
    ('hanh-thien', 'Hành thiền A5 - đã sửa.pdf', 'Hành thiền', 'Thực hành thiền', 'Các chương hướng dẫn thực hành thiền.', False),
    ('phap-hanh-thien', 'PHÁP HÀNH THIỀN....pdf', 'Pháp hành thiền', 'Thực hành thiền', 'Các bài giảng về niệm ân đức Phật, tâm từ và hơi thở.', False),
    ('thuc-hanh-thien-dinh', 'PHƯƠNG PHÁP THỰC HÀNH THIỀN ĐỊNH.pdf', 'Phương pháp thực hành thiền định', 'Thực hành thiền', 'Tìm hiểu và thực hành các đề mục thiền định.', False),
    ('phap-duyen-sinh', 'PHÁP DUYÊN SINH.pdf', 'Pháp duyên sinh', 'Giáo lý & vấn đáp', 'Tìm hiểu pháp duyên khởi và các mối liên hệ trong luân hồi.', False),
    ('hoi-dap-phat-phap', 'HỎI ĐÁP PHẬT PHÁP (4-12-2023).pdf', 'Hỏi đáp Phật pháp', 'Giáo lý & vấn đáp', 'Tuyển tập hỏi đáp về giáo pháp và đời sống tu học.', False),
    ('phuc-hanh-tong', 'PhucHanhTong.pdf', 'Phúc hành tông', 'Giáo lý & vấn đáp', 'Tìm hiểu nền tảng của hành động phước thiện.', False),
    ('anh-sang-chan-tam', 'Anh sang chan tam.pdf', 'Ánh sáng chân tâm', 'Giáo lý & vấn đáp', 'Lời khuyên sống an bình và ra đi trong tỉnh thức.', False),
    ('kinh-bao-ho', '[ĐÃ SỬA CHỈNH TẢ] KINH BẢO HỘ MỚI.pdf', 'Kinh bảo hộ', 'Kinh tụng & bảo hộ', 'Tuyển tập kinh bảo hộ, thiền tâm từ và chia phước.', False),
    ('trung-bo-1', 'Kinh-Trung-Bo-Kinh-1 A5.pdf', 'Kinh Trung Bộ · Tập 1', 'Kinh điển', 'Bản PDF tập 1 Kinh Trung Bộ trong tủ sách.', False),
    ('mi-tien-van-dap', 'Kinh-Mi-Tien-Van-Dap-HT-Gioi-Nghiem.pdf', 'Kinh Mi Tiên vấn đáp', 'Kinh điển', 'Bản dịch của Hòa thượng Giới Nghiêm.', False),
    ('dai-bat-niet-ban', 'kinh-dai-bat-niet-ban-thich-tu-thong.pdf', 'Kinh Đại Bát Niết Bàn', 'Kinh điển', 'Bản của Thích Từ Thông trong tủ sách.', False),
    ('phat-ban-hanh-tap', '0190-kinh-phat-ban-hanh-tap.pdf', 'Kinh Phật Bản Hạnh Tập', 'Kinh điển', 'Bản Việt dịch Linh Sơn Pháp Bảo Đại Tạng Kinh.', False),
    ('kinh-nhap-phap', 'Microsoft Word - Kinh Nhap Phap - vuong.pdf', 'Kinh Nhập Pháp Giới Thể Tánh', 'Kinh điển', 'Bản Việt dịch trong tủ sách Chùa Phúc Minh.', False),
    ('bhikkhu-patimokkha', 'BHIKKHUPĀTIMOKKHA PĀḶI - VIỆT 12-1-2026.pdf', 'Bhikkhupātimokkha · Pāḷi – Việt', 'Giới luật', 'Tài liệu giới bổn Tỳ kheo, bản Pāḷi và tiếng Việt.', False),
    ('ke-tu-tam-1', 'Bản in kệ tu tâm 280721.pdf', 'Kệ tu tâm · Tập 1', 'Thi kệ & câu đối', 'Bản in Kệ tu tâm của Sư Thanh Minh.', False),
    ('ke-tu-tam-2', 'KỆ TU TÂM 2.pdf', 'Kệ tu tâm · Tập 2', 'Thi kệ & câu đối', 'Tập tiếp theo của Kệ tu tâm.', False),
    ('thi-ke-phat-da', 'THI KỆ PHẬT ĐÀ - 3-3-22.pdf', 'Thi kệ Phật Đà', 'Thi kệ & câu đối', 'Các bài thi kệ về Đức Phật và giáo pháp.', False),
    ('ke-phuoc-lanh', 'Kệ phước lành.pdf', 'Kệ phước lành', 'Thi kệ & câu đối', 'Tập kệ ngắn để đọc và suy ngẫm.', False),
    ('ke-phat-dan', 'Kệ Phật Đản - ok.pdf', 'Kệ Phật Đản', 'Thi kệ & câu đối', 'Các bài kệ trong tập Kệ Phật Đản.', False),
    ('ke-sinh-tu', 'Kệ sinh tử.pdf', 'Kệ sinh tử', 'Thi kệ & câu đối', 'Tập kệ về sinh tử và vô thường.', False),
    ('cau-doi-phap-1', 'CÂU ĐỐI PHÁP 1.pdf', 'Câu đối pháp · Tập 1', 'Thi kệ & câu đối', 'Xem các trang câu đối trong bản PDF gốc.', False),
    ('cau-doi-phap-2', 'bản in câu đối pháp 2 280721.pdf', 'Câu đối pháp · Tập 2', 'Thi kệ & câu đối', 'Xem các trang câu đối trong bản PDF gốc.', False),
]


def page_lines(page):
    """Restore spaces using glyph positions where PDF fonts omit space characters."""
    result = []
    for block in page.get_text('rawdict', sort=True)['blocks']:
        for line in block.get('lines', []):
            text, previous = '', None
            for span in line['spans']:
                for char in span['chars']:
                    value = char['c']
                    if previous and text and not text[-1].isspace() and not value.isspace():
                        gap = char['origin'][0] - previous['bbox'][2]
                        if gap > max(0.8, span['size'] * 0.12) and not unicodedata.combining(value):
                            text += ' '
                    text += value
                    previous = char
            text = unicodedata.normalize('NFC', text)
            text = ''.join(c for c in text if unicodedata.category(c) not in {'Co', 'Cc'}).strip()
            if text:
                result.append((text, line['bbox']))
    return result


def write_catalog(books, destination):
    credits = json.loads((destination / 'credits.json').read_text(encoding='utf-8'))
    unknown = set(credits) - {b['id'] for b in books}
    if unknown:
        raise ValueError(f'Unknown credit IDs: {unknown}')
    for book in books:
        book['credits'] = credits.get(book['id'], [])
        for credit in book['credits']:
            if not credit['role'] or not credit['name'] or not credit['sourcePages'] or any(not 1 <= p <= book['pages'] for p in credit['sourcePages']):
                raise ValueError(f'Invalid credit for {book["id"]}')
    catalog = {'version': 1, 'name': 'Tủ sách Chùa Phúc Minh', 'books': books}
    (destination / 'catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (WEB / 'js' / 'phuc-minh-data.js').write_text('/* Generated by build_phuc_minh.py. */\nwindow.PHUC_MINH_DATA = ' + json.dumps(books, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')


def build(credits_only=False):
    destination = GENERATED / 'phuc-minh'
    (destination / 'text').mkdir(parents=True, exist_ok=True)
    if credits_only:
        catalog = json.loads((destination / 'catalog.json').read_text(encoding='utf-8'))
        write_catalog(catalog['books'], destination)
        print('Updated verified credits; reading text and source PDFs preserved.')
        return
    books = []
    listed = {row[1] for row in BOOKS}
    actual = {p.name for p in (SOURCES['chua phuc minh']).glob('*.pdf')}
    if listed != actual:
        raise ValueError(f'Update BOOKS for changed files. Missing: {listed-actual}; new: {actual-listed}')
    for book_id, filename, title, category, description, featured in BOOKS:
        source = SOURCES['chua phuc minh'] / filename
        with pymupdf.open(source) as doc:
            pages = [page_lines(page) for page in doc]
            # Remove only recurring marginal labels and standalone page numbers.
            margins = Counter()
            for page, lines in zip(doc, pages):
                margins.update(set(t for t, box in lines if box[1] < page.rect.height * .12 or box[3] > page.rect.height * .9))
            text_pages = sum(sum(len(t) for t, _ in lines) > 40 for lines in pages)
            readable = text_pages / len(doc) > .7
            body, words = [], 0
            for number, (page, lines) in enumerate(zip(doc, pages), 1):
                cleaned = []
                for text, box in lines:
                    marginal = box[1] < page.rect.height * .12 or box[3] > page.rect.height * .9
                    if marginal and (re.fullmatch(r'[\d\s–—-]+', text) or margins[text] > max(5, len(doc)*.2)):
                        continue
                    cleaned.append(text)
                words += sum(len(t.split()) for t in cleaned)
                # Keep source line order, including verse and dialogue; never rewrite teachings.
                page_text = '\n'.join(cleaned)
                body.append(f'## Trang {number}\n\n' + (page_text if page_text else '> Trang ảnh hoặc trang trống. Xem bản PDF để đối chiếu.'))
            if readable:
                text = f'# {title}\n\n> Tủ sách Chùa Phúc Minh · Bản chữ trích xuất từ PDF. Số trang tương ứng với bản gốc; đối chiếu PDF khi cần.\n\n' + '\n\n'.join(body) + '\n'
                (destination / 'text' / f'{book_id}.md').write_text(text, encoding='utf-8')
            books.append({
                'id': book_id, 'title': title, 'category': category, 'description': description,
                'featured': featured, 'pages': len(doc), 'textPages': text_pages,
                'filename': filename, 'pdfFile': '../chua%20phuc%20minh/' + quote(filename),
                'vietFile': f'data/phuc-minh/text/{book_id}.md' if readable else None,
                'listenMinutes': max(1, round(words/170)) if readable else None,
                'bytes': source.stat().st_size, 'sourceHash': hashlib.sha256(source.read_bytes()).hexdigest(),
            })
            print(f'{book_id}: {len(doc)} pages; {"reading + listening" if readable else "PDF images"}', flush=True)
    write_catalog(books, destination)
    print(f'Built {len(books)} books, {sum(b["pages"] for b in books)} pages, {sum(bool(b["vietFile"]) for b in books)} listening editions.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--credits-only', action='store_true', help='Update verified credits without regenerating reading text.')
    build(parser.parse_args().credits_only)

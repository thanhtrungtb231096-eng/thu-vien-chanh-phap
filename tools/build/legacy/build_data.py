# -*- coding: utf-8 -*-
"""
Script trích xuất và kiến tạo cơ sở dữ liệu số cho Thư Viện Chánh Pháp Nguyên Thủy
- 244 câu hỏi Milinda Pañha
- 220 câu hỏi đáp thực hành Chánh niệm đời sống
- 10 việc tạo phước Phúc Hành Tông
- Chánh niệm & Không phóng dật (Sigālovāda Sutta)
- Thông tin tổng thể 9 đầu sách
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

import os
import sys
import re
import json
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = str(SOURCES['chua phuc minh'])
JS_DIR = str(WEB / 'js')

# 1. Trích xuất Milinda Pañha
def build_milinda():
    pdf_path = os.path.join(ROOT_DIR, 'Kinh-Mi-Tien-Van-Dap-HT-Gioi-Nghiem.pdf')
    reader = pypdf.PdfReader(pdf_path)
    toc_text = ''
    for i in range(0, 10):
        toc_text += reader.pages[i].extract_text() + '\n'

    pre_1_7 = [
        (1, 'Danh (Nāma) - Dụ Cỗ Xe & Thực Tướng Vô Ngã', 'Vô ngã & Khởi đầu', 'Vua hỏi ai là Na-tiên? Ngài Na-tiên chỉ ra thân thể, lục căn, ngũ uẩn không phải tự ngã bất biến; cũng như gọng, trục, bánh, căm xe ráp lại mới giả gọi là cỗ xe.'),
        (2, 'Con số hạ lạp của Tỳ-kheo', 'Giới luật & Tăng sự', 'Vấn đáp về số năm tu hành, sự tôn kính giữa người xuất gia và nếp sống tri túc của Tăng đoàn.'),
        (3, 'Đàm thoại như một Trí giả hay như một Vương giả?', 'Phương pháp luận', 'Trí giả đàm thoại cởi mở, tôn trọng chân lý, hoan hỷ khi được chỉ lỗi; Vương giả áp đặt quyền lực, ai trái ý sẽ bị trừng phạt.'),
        (4, 'Thỉnh mời vào Hoàng cung', 'Hạnh Sa-môn', 'Đức vua thỉnh ngài Na-tiên vào cung đàm đạo Chánh pháp cùng 500 vị Tỳ-kheo với tâm cung kính không vụ lợi.'),
        (5, 'Mục đích tối thượng của sự xuất gia', 'Cứu cánh giải thoát', 'Mục đích tối thượng: dập tắt hoàn toàn khổ đau cũ và ngăn chặn không cho mầm mống khổ đau mới sinh khởi, tiến đến giải thoát Niết-bàn.'),
        (6, 'Tái sanh và Không tái sanh', 'Nghiệp & Tái sinh', 'Kẻ còn tham sân si phiền não thì còn tái sanh; bậc đã dập tắt vô minh lậu hoặc thì chứng vô sanh, chấm dứt luân hồi.'),
        (7, 'Chú tâm và Trí tuệ', 'Tâm lý học Phật giáo', 'Sự phân biệt giữa tác ý chú tâm (Manasikāra - gom giữ tâm thức) và Trí tuệ (Paññā - soi sáng cắt đứt phiền não).')
    ]

    questions = {}
    lines = toc_text.split('\n')
    for line in lines:
        line = line.strip()
        m = re.match(r'^(\d{1,3})\.\s*(.*)', line)
        if m:
            num = int(m.group(1))
            title = m.group(2).strip()
            title = title.replace('ƣ', 'ư').replace('Ƣ', 'Ư').replace('  ', ' ')
            if 8 <= num <= 244:
                questions[num] = title

    def get_cat(n):
        if n <= 7: return 'Vô ngã & Khởi đầu'
        if n <= 41: return 'Tâm lý học & Các Pháp'
        if n <= 89: return 'Nghiệp, Tái sinh & Niết-bàn'
        if n <= 170: return 'Hoài Nghi Nút Thắt (Mendaka)'
        return 'Pháp Hành & Ẩn Dụ Tu Tập'

    final_list = []
    for n, t, c, s in pre_1_7:
        final_list.append({
            'id': n,
            'title': t,
            'category': c,
            'summary': s
        })

    for n in range(8, 245):
        title = questions.get(n, f'Vấn đề số {n}')
        cat = get_cat(n)
        final_list.append({
            'id': n,
            'title': title,
            'category': cat,
            'summary': f'Đức vua Mi-lan-đà đối thoại cật vấn Tỳ kheo Na-tiên về chủ đề: "{title}". Đại đức phân tích thấu triệt bằng các thí dụ sinh động trong đời sống cổ đại.'
        })

    out_file = os.path.join(JS_DIR, 'milinda-panha.js')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('/**\n * Thư Viện Chánh Pháp - 244 Câu Hỏi Đáp Kinh Mi Tiên Vấn Đáp (Milinda Pañha)\n */\n')
        f.write('const MILINDA_PANHA_QUESTIONS = ')
        f.write(json.dumps(final_list, ensure_ascii=False, indent=2))
        f.write(';\n\nif (typeof module !== "undefined" && module.exports) { module.exports = MILINDA_PANHA_QUESTIONS; }\n')
    print(f'Done Milinda: {len(final_list)} items.')

# 2. Trích xuất Hỏi đáp Phật pháp thực hành (220 câu)
def build_practical_qa():
    pdf_path = os.path.join(ROOT_DIR, 'Hoi dap Phat phap.pdf')
    reader = pypdf.PdfReader(pdf_path)
    full_text = ''
    for page in reader.pages:
        full_text += (page.extract_text() or '') + '\n'

    # Match questions and answers
    # Questions start with • Hỏi: or Hỏi:
    # Answers start with Đáp:
    items = []
    raw_blocks = re.split(r'(?:•?\s*Hỏi:)', full_text)
    
    cat_keywords = [
        ('Chánh niệm & Thiền quán', ['chánh niệm', 'thiền', 'hơi thở', 'tỉnh giác', 'oai nghi', 'quán', 'định']),
        ('Giới luật & Ăn uống', ['ăn chay', 'ăn mặn', 'thịt', 'giới', 'ngũ giới', 'bát quan trai', 'rượu', 'tịnh nhục']),
        ('Nghiệp báo & Phước đức', ['nghiệp', 'phước', 'bố thí', 'tái sinh', 'quả báo', 'nghèo', 'giàu', 'đầu thai']),
        ('Đời sống Gia đình & Cư sĩ', ['tại gia', 'vợ chồng', 'cha mẹ', 'ông bà', 'thờ cúng', 'ngoại cảm', 'thần linh']),
        ('Giáo lý Căn bản', ['phật', 'pháp', 'tăng', 'niết bàn', 'vô thường', 'khổ', 'vô ngã', 'duyên khởi', 'vũ trụ']),
        ('Xuất gia & Đời sống Tăng đoàn', ['xuất gia', 'tỳ kheo', 'sa di', 'chùa', 'hạ lạp'])
    ]

    for idx, block in enumerate(raw_blocks[1:], 1):
        if 'Đáp:' in block:
            parts = block.split('Đáp:', 1)
            q = parts[0].strip().replace('\n', ' ')
            ans = parts[1].strip()
            # Trim answer to reasonable display length
            ans_clean = ' '.join([line.strip() for line in ans.split('\n') if line.strip()][:10])
            
            # Categorize
            assigned_cat = 'Pháp Hành Đời Thường'
            for cat_name, kw_list in cat_keywords:
                if any(kw in q.lower() or kw in ans_clean[:100].lower() for kw in kw_list):
                    assigned_cat = cat_name
                    break

            items.append({
                'id': idx,
                'question': q,
                'category': assigned_cat,
                'answer': ans_clean[:500] + ('...' if len(ans_clean) > 500 else '')
            })

    print(f'Done Practical QA: {len(items)} items.')
    out_file = os.path.join(JS_DIR, 'practical-qa.js')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('/**\n * Thư Viện Chánh Pháp - 220 Vấn Đáp Thực Hành Chánh Niệm & Đời Sống\n */\n')
        f.write('const PRACTICAL_QA_DATA = ')
        f.write(json.dumps(items, ensure_ascii=False, indent=2))
        f.write(';\n\nif (typeof module !== "undefined" && module.exports) { module.exports = PRACTICAL_QA_DATA; }\n')

# 3. Trích xuất Master metadata 9 đầu sách
def build_master_books():
    books = [
        {
            'id': 'milinda-panha',
            'title': 'Kinh Mi Tiên Vấn Đáp',
            'originalTitle': 'Milinda Pañha',
            'author': 'Đại đức Nāgasena & Vua Menandros I',
            'translator': 'Hòa thượng Giới Nghiêm dịch, Tỳ kheo Giới Đức hiệu đính',
            'tradition': 'Theravāda (Nguyên Thủy)',
            'category': 'canonical-dialogue',
            'badge': 'Chánh Tạng Ngoại Thuyết Pāḷi',
            'pages': 581,
            'fileName': 'Kinh-Mi-Tien-Van-Dap-HT-Gioi-Nghiem.pdf',
            'coverColor': 'amber',
            'summary': 'Tác phẩm văn học kinh điển Pāḷi vô giá ghi lại cuộc đàm đạo đối thoại giữa bậc Thánh Tăng Na-tiên (Nāgasena) và vị vua thông thái gốc Hy Lạp Mi-lan-đà (Menandros I). Gồm 244 câu hỏi - đáp sắc bén gỡ bỏ mọi nút thắt triết học và tâm lý học Phật giáo.',
            'coreLessons': [
                'Vô ngã (Anattā): Không có tự ngã bất biến trong ngũ uẩn, tương tự cỗ xe được tạo thành bởi các linh kiện ráp nối.',
                'Nghiệp & Tái sinh: Tái sinh tiếp diễn theo dòng chảy tâm thức và nghiệp lực, không có linh hồn di chuyển từ thân này sang thân khác (ví như ngọn lửa truyền từ đèn này sang đèn khác).',
                'Bản chất Niết-bàn (Nibbāna): Là pháp vô vi (Asaṅkhata), dập tắt hoàn toàn tham sân si, tịch tịnh vắng bặt mọi phiền não và đau khổ luân hồi.',
                'Chánh tri kiến: Phương pháp vấn đáp như một "Trí giả" - cầu tìm sự thật thay vì áp đặt quyền uy "Vương giả".'
            ],
            'structure': [
                'Phần I: Ngoại thuyết & Tiền duyên kiếp trước của Đức vua và Tỳ-kheo Na-tiên',
                'Phần II: Nội dung 244 câu hỏi vấn đáp (Vô ngã, Nghiệp quả, Niết-bàn, Tri kiến, v.v.)',
                'Phần III: Phần kết cuộc & Đức vua đắc quả Thánh, xuất gia gia nhập Tăng đoàn'
            ]
        },
        {
            'id': 'phuc-hanh-tong',
            'title': 'Phúc Hành Tông',
            'originalTitle': 'Puññakiriyavatthu (Nền Tảng Của Hành Động Phước Thiện)',
            'author': 'Bhikkhu Saddhammajotika Dhammacariya',
            'translator': 'Bhikkhu Abhisiddhi (TK. Siêu Thành) dịch, Thầy Ngộ Đạo hiệu đính',
            'tradition': 'Theravāda (Nguyên Thủy)',
            'category': 'abhidhamma-manual',
            'badge': 'Thắng Pháp & Pháp Hành Phước Thiện',
            'pages': 360,
            'fileName': 'PhucHanhTong.pdf',
            'coverColor': 'gold',
            'summary': 'Cẩm nang tối hậu và toàn diện nhất về 10 hành động tạo phước thiện (Puññakiriyavatthu) theo Phật giáo Nguyên thủy và Vi Diệu Pháp (Abhidhamma). Hướng dẫn tường tận cách vun bồi thiện pháp từ bố thí, giữ giới cho đến thiền quán Minh sát Vipassanā.',
            'coreLessons': [
                '1. Bố thí (Dāna): Tâm xả tài vật, phân tích các trường hợp từ 2 pháp đến 14 pháp bố thí và phước báu vô lượng.',
                '2. Giữ giới (Sīla): Thọ trì Ngũ giới, Bát quan trai giới (Uposatha), Chánh mạng bát giới (Ājīvaṭṭhamakasīla).',
                '3. Tu tiến (Bhāvanā): Cốt tủy Thiền Minh Sát Vipassanā, Thọ niệm xứ, ghi nhận oai nghi, danh sắc thực tại.',
                '4 - 10. Cung kính (Apacāyana), Phục vụ (Veyyāvacca), Hồi hướng phước (Pattidāna), Tùy hỷ phước (Pattānumodāna), Thính pháp (Dhammasavana), Thuyết pháp (Dhammadesanā), Tri kiến chánh trực (Diṭṭhujukamma).'
            ],
            'structure': [
                'Phần 1: Cẩm nang tạo phước thiện Bố thí (Dāna)',
                'Phần 2: Cẩm nang tạo phước thiện Giữ giới (Sīla)',
                'Phần 3: Cẩm nang tạo phước thiện Tu tiến (Bhāvanā & Vipassanā)',
                'Phần 4: 7 Hành động phước thiện trong Chú giải (Cung kính, Phục vụ, Hồi hướng, Tùy hỷ, v.v.)'
            ]
        },
        {
            'id': 'buong-lung-phong-dat',
            'title': 'Buông Lung Phóng Dật - Người Tại Gia',
            'originalTitle': 'Pamāda & Appamāda Cư Sĩ Thực Hành',
            'author': 'Tổng hợp đối chiếu Kinh điển Nikāya & Hiện đại',
            'translator': 'Y cứ Sigālovāda Sutta (DN 31), Dhammapada, Aṅguttara Nikāya',
            'tradition': 'Theravāda (Nguyên Thủy)',
            'category': 'layperson-guide',
            'badge': 'Kinh Tạng Pāḷi Ứng Dụng',
            'pages': 30,
            'fileName': 'BUÔNG LUNG PHÓNG DẬT - NGƯOỜI TẠI GIA  .pdf',
            'coverColor': 'forest',
            'summary': 'Chuyên đề đặc sắc và sắc bén đối chiếu lời dạy của Đức Phật trong Kinh Giáo Giới Thi-ca-la-việt (Sigālovāda Sutta) với hành vi và cám dỗ của con người trong kỷ nguyên hiện đại. Hướng dẫn cư sĩ nhận diện và tận diệt thói phóng dật (Pamāda).',
            'coreLessons': [
                'Định nghĩa Pamāda: Trạng thái buông trôi tâm thức theo ngũ dục, thiếu chánh niệm liên tục, lười biếng thiện pháp.',
                '4 Nghiệp ô uế cần tránh: Sát sanh, Trộm cắp, Tà hạnh, Nói dối.',
                '4 Thiên vị (Ác hành): Hành động thiên lệch vì Tham, Sân, Si, Sợ hãi.',
                '6 Cửa ngõ phá tài bại sản thời hiện đại: Nghiện rượu chất say, rong chơi đêm, cờ bạc cá cược, đờn ca tiệc tùng, kết bạn xấu, lười nhác.',
                'Bổn phận 6 phương quan hệ xã hội: Cha mẹ - Con cái, Thầy - Trò, Vợ - Chồng, Bạn bè, Chủ - Thợ, Sa-môn - Tín thí.'
            ],
            'structure': [
                'Chương 1: Định nghĩa & Bản chất của Phóng Dật (Pamāda)',
                'Chương 2: Biểu hiện phóng dật qua Thân - Khẩu - Ý',
                'Chương 3: Hành vi người tại gia thời hiện đại và nguy cơ tha hóa',
                'Chương 4: Sáu cửa ngõ phá tán tài sản theo Kinh Thiện Sanh',
                'Chương 5: Phương pháp đối trị bằng Appamāda (Không phóng dật & Chánh niệm)'
            ]
        },
        {
            'id': 'hoi-dap-can-ban-thanh-minh',
            'title': 'Hỏi Đáp Phật Pháp Căn Bản',
            'originalTitle': 'Giáo Lý Theravāda & Anattalakkhaṇa Sutta',
            'author': 'Sư Thanh Minh',
            'translator': 'Chùa Phúc Minh',
            'tradition': 'Theravāda (Nguyên Thủy)',
            'category': 'basics-doctrine',
            'badge': 'Giáo Lý Căn Bản & Vô Ngã Tướng',
            'pages': 156,
            'fileName': 'Hoi dap Phat Phap Can Ban - Su Thanh Minh - Chua Phuc Minh .pdf',
            'coverColor': 'ochre',
            'summary': 'Tài liệu vấn đáp chuẩn mực của Phật giáo Nam tông giảng giải toàn diện về Tam Bảo (Phật - Pháp - Tăng), con đường tích lũy Ba-la-mật của Bồ Tát theo Theravāda, và bản dịch giải tường minh bài Kinh Vô Ngã Tướng giúp 5 anh em Kiều Trần Như đắc quả A-la-hán.',
            'coreLessons': [
                'Bồ Tát Đạo Theravāda: 8 điều kiện để được Đức Phật thọ ký và tiến trình tích lũy 10 Ba-la-mật viên mãn.',
                'Đức Phật & Thập Lực: Ý nghĩa danh hiệu và trí tuệ vô ngại của Bậc Toàn Giác.',
                'Đức Pháp: Tứ Thánh Đế, Bát Chánh Đạo, 12 Duyên Khởi, Tam Tướng.',
                'Đức Tăng: Bốn đôi tám vị Thánh Tăng cùng giới hạnh thanh tịnh.',
                'Kinh Vô Ngã Tướng: Quán sát sắc, thọ, tưởng, hành, thức - "Cái này không phải là tôi, không phải của tôi, không phải tự ngã của tôi".'
            ],
            'structure': [
                'Chương I: Đức Phật & Bồ Tát Đạo trong truyền thống Theravāda',
                'Chương II: Đức Pháp & Các định luật chân lý vũ trụ',
                'Chương III: Đức Tăng & Đời sống Tăng đoàn phạm hạnh',
                'Chương IV: Dịch & Giảng giải Kinh Vô Ngã Tướng (Anattalakkhaṇa Sutta)'
            ]
        },
        {
            'id': 'hoi-dap-phat-phap-220',
            'title': 'Hỏi Đáp Phật Pháp Thực Hành',
            'originalTitle': '220 Vấn Đáp Chánh Niệm & Ứng Dụng Hàng Ngày',
            'author': 'Chư Tăng Nam Tông & Hành giả thực nghiệm',
            'translator': 'Tổng hợp tài liệu Phật giáo Nguyên thủy',
            'tradition': 'Theravāda (Nguyên Thủy)',
            'category': 'practical-qa',
            'badge': '220 Vấn Đáp Chánh Niệm',
            'pages': 145,
            'fileName': 'Hoi dap Phat phap.pdf',
            'coverColor': 'teal',
            'summary': 'Tập hợp 220 câu hỏi đáp trực diện và thực tế nhất giải quyết những thắc mắc của người học Phật trong cuộc sống: từ cách giữ chánh niệm khi làm việc, ăn chay hay ăn mặn (Tam tịnh nhục), cúng bái tổ tiên, nguồn gốc loài người đến phương pháp xử lý phiền não.',
            'coreLessons': [
                'Chánh niệm trong đời sống: Ghi nhận 4 oai nghi, niệm hơi thở, không để tâm chạy theo tham ái và sân hận.',
                'Tam tịnh nhục: Quan điểm của Đức Phật về việc ăn thịt (không thấy, không nghe, không nghi con vật bị giết vì mình).',
                'Thiện tâm hợp trí (Ñāṇasampayutta): Làm việc thiện với sự hiểu biết lý nhân quả mang lại quả báu vô lượng.',
                'Vũ trụ quan Phật giáo: Sự hình thành của thế giới và con người theo Kinh Khởi Thế Nhân Duyên (Aggañña Sutta).'
            ],
            'structure': [
                'Phần 1: Chánh niệm tỉnh giác & Pháp hành thiền trong đời sống',
                'Phần 2: Ứng xử cư sĩ, ăn uống tam tịnh nhục, thờ phụng tổ tiên',
                'Phần 3: Nghiệp báo, luân hồi, tái sinh và cảnh giới siêu hình',
                'Phần 4: Tâm thiện, tâm bất thiện và lộ trình giải thoát'
            ]
        },
        {
            'id': 'dai-bat-niet-ban-tu-thong',
            'title': 'Đại Bát Niết Bàn Kinh Trực Chỉ Đề Cương',
            'originalTitle': 'Mahāparinirvāṇa Sūtra (Bắc Truyền)',
            'author': 'Thích Từ Thông',
            'translator': 'Trực chỉ đề cương từ Hán tạng',
            'tradition': 'Mahāyāna (Bắc Truyền)',
            'category': 'comparative-study',
            'badge': 'Tài Liệu Đối Chiếu Giáo Lý',
            'pages': 1167,
            'fileName': 'kinh-dai-bat-niet-ban-thich-tu-thong.pdf',
            'coverColor': 'crimson',
            'summary': 'Bộ kinh đồ sộ thuộc hệ tư tưởng Bắc truyền luận về Phật tánh thường trú và bốn đức tính "Thường - Lạc - Ngã - Tịnh". Được đưa vào thư viện ở mục đối chiếu học thuật nhằm giúp hành giả phân biệt rõ với Kinh Đại Bát Niết Bàn Pāḷi (DN 16) của Nguyên Thủy.',
            'coreLessons': [
                'Đối chiếu quan trọng: Phật giáo Nguyên thủy dạy Tam Tướng (Vô thường, Khổ, Vô ngã); Kinh Niết Bàn Bắc truyền đề cao Thường - Lạc - Ngã - Tịnh.',
                'Kinh DN 16 (Pāḷi) là ký sự lịch sử những tháng ngày cuối đời Đức Phật Gotama; Kinh Bắc truyền là bộ luận triết học triển khai về Phật tánh bản hữu.',
                'Giúp người nghiên cứu không bị mâu thuẫn nhận thức khi tiếp cận các nguồn tư liệu khác nhau.'
            ],
            'structure': [
                '29 Phẩm kinh: Tựa, Thuần Đà, Ai Thán, Trường Thọ, Kim Cang Thân, Tứ Tướng, Tứ Y, Tà Chánh, Tứ Thánh Đế, Như Lai Tánh...'
            ]
        },
        {
            'id': 'kinh-vien-giac-duy-luc',
            'title': 'Kinh Viên Giác',
            'originalTitle': 'Viên Giác Tu-đa-la Liễu Nghĩa Kinh',
            'author': 'Phật Đà Đa La dịch Hán; Hám Sơn trực giải',
            'translator': 'Hòa thượng Thích Duy Lực dịch Việt',
            'tradition': 'Mahāyāna (Thiền Tông / Bắc Truyền)',
            'category': 'comparative-study',
            'badge': 'Tài Liệu Tham Khảo Thiền Tông',
            'pages': 40,
            'fileName': 'Kinh-Vien-Giac-HT-Duy-Luc-Dich.pdf',
            'coverColor': 'purple',
            'summary': 'Bản kinh liễu nghĩa đốn giáo của Thiền tông Bắc truyền, vấn đáp giữa Đức Phật và 12 vị Đại Bồ Tát (Văn Thù, Phổ Hiền, Kim Cang Tạng, Di Lặc...) về bản thể Viên Giác thanh tịnh chiếu soi vạn pháp.',
            'coreLessons': [
                'Giáo lý Đốn ngộ: Mọi chúng sanh vốn tròn đầy tánh giác (Viên Giác), huyễn thân huyễn tâm vốn không thực có.',
                'Đối chiếu: Khác với lộ trình thứ lớp Văn - Tư - Tu và Đoạn trừ phiền não tiệm tiến của Phật giáo Nguyên thủy.',
                'Đọc để mở rộng góc nhìn văn hiến tư tưởng Đông độ.'
            ],
            'structure': [
                '12 Chương tương ứng với 12 câu hỏi của 12 vị Đại Bồ Tát về Huyễn pháp, Thiền định và Kiến tánh.'
            ]
        },
        {
            'id': 'kinh-nhap-phap-gioi-the-tanh',
            'title': 'Kinh Nhập Pháp Giới Thể Tánh',
            'originalTitle': 'Dharmadhātuprakṛty-asambheda-nirdeśa',
            'author': 'Đại thừa Kinh tạng',
            'translator': 'Bản dịch Việt ngữ lưu hành',
            'tradition': 'Mahāyāna (Bát Nhã / Bắc Truyền)',
            'category': 'comparative-study',
            'badge': 'Tài Liệu Tham Khảo Bát Nhã',
            'pages': 27,
            'fileName': 'Microsoft Word - Kinh Nhap Phap - vuong.pdf',
            'coverColor': 'indigo',
            'summary': 'Bản kinh ngắn ghi lại cuộc đối thoại giữa Bồ Tát Văn-thù-sư-lợi và Đức Thế Tôn về Thể tánh bình đẳng của Pháp giới, không sinh không diệt, rốt ráo vắng lặng.',
            'coreLessons': [
                'Thể tánh vô sai biệt của các pháp; tính bất khả đắc của ngã và pháp.',
                'Tài liệu tham khảo bổ trợ cho phân khu đối chiếu triết học Đại thừa.'
            ],
            'structure': [
                'Toàn văn bản kinh ngắn gọn 27 trang đàm đạo tại núi Kỳ-xà-quật.'
            ]
        },
        {
            'id': 'kinh-phat-ban-hanh-tap',
            'title': 'Kinh Phật Bản Hạnh Tập',
            'originalTitle': 'Abhiniṣkramaṇa Sūtra (Đại Chánh Tân Tu số 0190)',
            'author': 'Xà-na-quật-đa dịch đời Tùy (Ấn Độ sang Trung Hoa)',
            'translator': 'Linh-Sơn Pháp Bảo Đại Tạng Kinh dịch Việt',
            'tradition': 'Bộ Phái / Hán Tạng (Bản Duyên Bộ)',
            'category': 'comparative-study',
            'badge': 'Tài Liệu Lịch Sử & Bản Duyên',
            'pages': 749,
            'fileName': '0190-kinh-phat-ban-hanh-tap.pdf',
            'coverColor': 'slate',
            'summary': 'Tập sử thi đồ sộ 60 quyển ghi chép chi tiết các giai thoại, tiền thân và cuộc đời Đức Phật Thích Ca Mâu Ni từ khi giáng trần, xuất gia, hàng phục ma quân cho đến khi chuyển pháp luân theo quan điểm của các bộ phái sớm (chủ yếu Pháp Tạng bộ).',
            'coreLessons': [
                'Bức tranh văn hóa và nghệ thuật kể chuyện cổ điển Ấn Độ về cuộc đời Đức Từ Phụ.',
                'Giá trị văn học và truyền tích hỗ trợ cho việc hiểu bối cảnh lịch sử Phật giáo sơ kỳ.'
            ],
            'structure': [
                '60 Quyển với hàng trăm phẩm truyện từ Phát tâm cúng dường, Đản sanh, Xuất gia, Khổ hạnh đến Thành đạo và Hóa độ.'
            ]
        }
    ]

    out_file = os.path.join(JS_DIR, 'dhamma-data.js')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('/**\n * Thư Viện Chánh Pháp - Master Metadata 9 Đầu Sách & Kiến Trúc Giáo Lý\n */\n')
        f.write('const DHAMMA_BOOKS_DATA = ')
        f.write(json.dumps(books, ensure_ascii=False, indent=2))
        f.write(';\n\nif (typeof module !== "undefined" && module.exports) { module.exports = DHAMMA_BOOKS_DATA; }\n')
    print(f'Done Master Books: {len(books)} books.')

# 4. Trích xuất toàn văn Cẩm nang Buông lung phóng dật
def build_pamada():
    pdf_path = os.path.join(ROOT_DIR, 'BUÔNG LUNG PHÓNG DẬT - NGƯỜI TẠI GIA  .pdf')
    reader = pypdf.PdfReader(pdf_path)
    pages_data = []
    for i, p in enumerate(reader.pages):
        raw = p.extract_text() or ''
        # Clean double spaces or line break artifacts
        clean = re.sub(r' +', ' ', raw).strip()
        pages_data.append({'page': i + 1, 'content': clean})

    out_file = os.path.join(JS_DIR, 'pamada-guide.js')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('/** Cẩm nang Chánh niệm Đối trị Phóng dật dành cho Cư sĩ **/\n')
        f.write('const PAMADA_GUIDE_DATA = ')
        f.write(json.dumps(pages_data, ensure_ascii=False, indent=2))
        f.write(';\n\nif (typeof module !== "undefined" && module.exports) { module.exports = PAMADA_GUIDE_DATA; }\n')
    print(f'Done Pamada Guide: {len(pages_data)} pages.')

# 5. Trích xuất Kinh Vô Ngã Tướng (Chương IV Sư Thanh Minh)
def build_anatta_sutta():
    pdf_path = os.path.join(ROOT_DIR, 'Hoi dap Phat Phap Can Ban - Su Thanh Minh - Chua Phuc Minh .pdf')
    reader = pypdf.PdfReader(pdf_path)
    # Search for CHƯƠNG IV: KINH VÔ NGÃ TƯỚNG
    start_page = 0
    for idx, p in enumerate(reader.pages):
        txt = p.extract_text() or ''
        if 'KINH VÔ NGÃ TƯỚNG' in txt or 'CHƯƠNG IV' in txt:
            start_page = idx
            break

    sutta_text = ''
    if start_page > 0:
        for p in reader.pages[start_page:]:
            sutta_text += (p.extract_text() or '') + '\n'

    out_file = os.path.join(JS_DIR, 'anatta-sutta.js')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('/** Kinh Vô Ngã Tướng (Anattalakkhaṇa Sutta) - Bản dịch & giải Sư Thanh Minh **/\n')
        f.write('const ANATTA_SUTTA_DATA = ')
        f.write(json.dumps({'title': 'Kinh Vô Ngã Tướng (Anattalakkhaṇa Sutta)', 'content': sutta_text.strip()}, ensure_ascii=False, indent=2))
        f.write(';\n\nif (typeof module !== "undefined" && module.exports) { module.exports = ANATTA_SUTTA_DATA; }\n')
    print('Done Anatta Sutta.')

if __name__ == '__main__':
    print('Building Dhamma Library Data...')
    build_milinda()
    build_practical_qa()
    build_master_books()
    build_pamada()
    build_anatta_sutta()
    print('All data modules built successfully!')


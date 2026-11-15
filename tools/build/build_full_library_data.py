# -*- coding: utf-8 -*-
"""
Script xây dựng chỉ mục toàn diện cho Đại Thư Viện Chánh Pháp:
- 62 Bộ Kinh Tuyển Tập Đại Thừa (Thập Nhị Phân Giáo)
- 25 Bộ Đại Tạng Kinh Hán Tạng (2.471 Tác phẩm, 1.109 bản dịch Việt)
- Bản đồ đối chiếu A-Hàm & Nikāya Nguyên Thủy
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

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = str(ROOT)
DAI_THUA_DIR = str(SOURCES['Dai_thua'])
DAI_TANG_DIR = str(SOURCES['Dai_Tang_Kinh_Han'])
JS_DIR = str(WEB / 'js')

def build_dai_thua():
    print("Indexing Dai_thua (62 scriptures)...")
    catalog_path = os.path.join(DAI_THUA_DIR, '00_DANH_MUC_KINH.md')
    with open(catalog_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Map categories
    cat_dirs = sorted([d for d in os.listdir(DAI_THUA_DIR) if os.path.isdir(os.path.join(DAI_THUA_DIR, d)) and d.startswith(('01','02','03','04','05','06','07','08','09','10','11','12'))])

    cat_map = {}
    for cd in cat_dirs:
        prefix = cd.split('_')[0]
        cat_map[prefix] = cd

    # Parse sections
    # e.g. ### 01. Khế Kinh — 契經 (Sūtra) (7 bộ)
    parts = re.split(r'###\s+(\d{2})\.\s+([^\n]+)', content)
    
    books = []
    
    for i in range(1, len(parts), 3):
        code = parts[i]
        cat_title = parts[i+1].strip()
        body = parts[i+2]

        cat_folder = cat_map.get(code)
        if not cat_folder:
            continue

        cat_full_path = os.path.join(DAI_THUA_DIR, cat_folder)
        book_folders = sorted([bf for bf in os.listdir(cat_full_path) if os.path.isdir(os.path.join(cat_full_path, bf))])

        # Match lines like: 1. **Phật Thuyết Quán Vô Lượng Thọ Phật Kinh** — 佛說觀無量壽佛經 — `T12n0365` — gốc: —
        lines = [l.strip() for l in body.split('\n') if l.strip() and l.startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.', '13.', '14.', '15.', '16.', '17.', '18.', '19.', '20.', '21.', '22.', '23.', '24.', '25.', '26.', '27.', '28.'))]

        for idx, line in enumerate(lines):
            # Parse line
            m = re.match(r'^\d+\.\s+\*\*([^*]+)\*\*\s+—\s+([^—]+)\s+—\s+`([^`]+)`\s+—\s+gốc:\s*([^\n]*)', line)
            if not m:
                continue

            viet_title = m.group(1).strip()
            han_title = m.group(2).strip()
            taisho_id = m.group(3).strip()
            orig_lang = m.group(4).strip() or 'Chữ Hán'

            book_folder = book_folders[idx] if idx < len(book_folders) else None
            files_dict = {
                'vietMd': '',
                'vietPdf': '',
                'hanMd': '',
                'hanPdf': '',
                'noteMd': '',
                'notePdf': ''
            }
            excerpt = ''

            if book_folder:
                nv_dir = os.path.join(cat_full_path, book_folder, 'Nguyen_van')
                if os.path.exists(nv_dir):
                    rel_prefix = f'../Dai_thua/{cat_folder}/{book_folder}/Nguyen_van/'
                    for f in os.listdir(nv_dir):
                        if f.endswith('_viet.md'):
                            files_dict['vietMd'] = rel_prefix + f
                            # Read short excerpt
                            try:
                                with open(os.path.join(nv_dir, f), 'r', encoding='utf-8') as ef:
                                    excerpt = ef.read(600).strip()
                            except Exception:
                                pass
                        elif f.endswith('_viet.pdf'):
                            files_dict['vietPdf'] = rel_prefix + f
                        elif f.endswith('_han.md'):
                            files_dict['hanMd'] = rel_prefix + f
                        elif f.endswith('_han.pdf'):
                            files_dict['hanPdf'] = rel_prefix + f
                        elif f.endswith('_ghichu_nguyenban.md'):
                            files_dict['noteMd'] = rel_prefix + f
                            # If no excerpt yet, use note
                            if not excerpt:
                                try:
                                    with open(os.path.join(nv_dir, f), 'r', encoding='utf-8') as ef:
                                        excerpt = ef.read(600).strip()
                                except Exception:
                                    pass
                        elif f.endswith('_ghichu_nguyenban.pdf'):
                            files_dict['notePdf'] = rel_prefix + f

            books.append({
                'id': f'dt_{code}_{idx+1}',
                'categoryCode': code,
                'categoryName': cat_title,
                'title': viet_title,
                'hanTitle': han_title,
                'taishoId': taisho_id,
                'origLang': orig_lang,
                'files': files_dict,
                'excerpt': clean_excerpt(excerpt)
            })

    print(f"Total Dai_thua indexed: {len(books)}")
    out_file = os.path.join(JS_DIR, 'dai-thua-data.js')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('/**\n * Tuyển Tập 62 Bộ Kinh Đại Thừa (Thập Nhị Phân Giáo)\n */\n')
        f.write('const DAI_THUA_DATA = ')
        f.write(json.dumps(books, ensure_ascii=False, indent=2))
        f.write(';\n\nif (typeof module !== "undefined" && module.exports) { module.exports = DAI_THUA_DATA; }\n')

def clean_excerpt(text):
    if not text:
        return 'Bản kinh quý giá trong văn hiến Phật giáo Đại Thừa.'
    # Remove markdown headers or tags
    text = re.sub(r'#+\s*', '', text)
    text = re.sub(r'\*+', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:280] + ('...' if len(text) > 280 else '')

def build_dai_tang_han():
    print("Indexing Dai_Tang_Kinh_Han (25 Divisions & 2,471 texts)...")
    muc_luc_path = os.path.join(DAI_TANG_DIR, '00_MUC_LUC.md')
    with open(muc_luc_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 1. Parse 25 Divisions Overview Table
    divisions = []
    in_overview = False
    for line in lines:
        line_s = line.strip()
        if '## Tổng quan các Bộ' in line_s:
            in_overview = True
            continue
        if in_overview and line_s.startswith('---'):
            break
        if in_overview and line_s.startswith('|') and not line_s.startswith('| #') and not line_s.startswith('|--'):
            parts = [c.strip() for c in line_s.split('|')[1:-1]]
            if len(parts) >= 4 and parts[0].isdigit():
                code = parts[0]
                name_raw = parts[1]
                total = int(parts[2])
                has_viet = int(parts[3])

                # Split name and Han name
                m = re.match(r'^(.*?)\s+([\u4e00-\u9fff]+.*)$', name_raw)
                name = m.group(1).strip() if m else name_raw
                han_name = m.group(2).strip() if m else ''

                divisions.append({
                    'code': code,
                    'name': name,
                    'hanName': han_name,
                    'total': total,
                    'hasViet': has_viet,
                    'folderName': get_division_folder(code)
                })

    print(f"Total Divisions parsed: {len(divisions)}")

    # 2. Parse Detailed Texts Table
    texts = []
    current_division = '01'

    # Mapping for A-Ham Nikaya correlation
    nikaya_map = {
        'T01n0001': 'Trường A-Hàm Kinh (Dīgha Āgama) — Tương đương Trường Bộ Kinh (Dīgha Nikāya, DN 1 - 34)',
        'T01n0016': 'Thi-ca-la-việt Lục Phương Lễ Kinh — Tương đương Sigālovāda Sutta (Kinh Giáo Giới Thi-ca-la-việt, DN 31)',
        'T01n0017': 'Thiện Sanh Tử Kinh — Dị bản tương đương Sigālovāda Sutta (DN 31)',
        'T01n0026': 'Trung A-Hàm Kinh (Majjhima Āgama) — Tương đương Trung Bộ Kinh (Majjhima Nikāya, MN 1 - 152)',
        'T02n0099': 'Tạp A-Hàm Kinh (Saṃyukta Āgama) — Tương đương Tương Ưng Bộ Kinh (Saṃyutta Nikāya, SN)',
        'T02n0100': 'Biệt Dịch Tạp A-Hàm Kinh — Tương đương các thiên Tương Ưng Bộ Kinh',
        'T02n0125': 'Tăng Nhất A-Hàm Kinh (Ekottara Āgama) — Tương đương Tăng Chi Bộ Kinh (Aṅguttara Nikāya, AN)'
    }

    for line in lines:
        line_s = line.strip()
        # Check section header: ## 01. A Hàm bộ 阿含部
        m_sec = re.match(r'^##\s+(\d{2})\.\s+([^\n]+)', line_s)
        if m_sec:
            current_division = m_sec.group(1)
            continue

        # Check table row: | `T01n0001` | 長阿含經 | ✅ |
        if line_s.startswith('|') and '`' in line_s:
            parts = [c.strip() for c in line_s.split('|')[1:-1]]
            if len(parts) >= 3:
                t_code = parts[0].replace('`', '').strip()
                title = parts[1].strip()
                has_viet = ('✅' in parts[2])

                div_folder = get_division_folder(current_division)
                viet_file = f'../Dai_Tang_Kinh_Han/{div_folder}/{t_code}_viet.md' if has_viet else ''
                if viet_file and not public_path(viet_file).is_file():
                    has_viet = False
                    viet_file = ''
                han_file = f'../Dai_Tang_Kinh_Han/{div_folder}/{t_code}.md'

                item = {
                    'id': t_code,
                    'title': title,
                    'division': current_division,
                    'hasViet': has_viet,
                    'vietFile': viet_file,
                    'hanFile': han_file
                }

                if t_code in nikaya_map:
                    item['nikayaNote'] = nikaya_map[t_code]

                texts.append(item)

    print(f"Total Taisho texts parsed: {len(texts)}")
    for division in divisions:
        division['hasViet'] = sum(bool(text['hasViet']) for text in texts if text['division'] == division['code'])

    data_payload = {
        'divisions': divisions,
        'texts': texts
    }

    out_file = os.path.join(JS_DIR, 'dai-tang-han-data.js')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('/**\n * Đại Tạng Kinh Hán Tạng (25 Bộ - 2.471 Văn Bản · 1.109 Bản Dịch Việt)\n */\n')
        f.write('const DAI_TANG_HAN_DATA = ')
        f.write(json.dumps(data_payload, ensure_ascii=False, indent=2))
        f.write(';\n\nif (typeof module !== "undefined" && module.exports) { module.exports = DAI_TANG_HAN_DATA; }\n')

def get_division_folder(code):
    folder_map = {
        '01': '01_A_Ham',
        '02': '02_Ban_Duyen',
        '03': '03_Bat_Nha',
        '04': '04_Phap_Hoa',
        '05': '05_Hoa_Nghiem',
        '06': '06_Bao_Tich',
        '07': '07_Niet_Ban',
        '08': '08_Dai_Tap',
        '09': '09_Kinh_Tap',
        '10': '10_Mat_Giao',
        '11': '11_Luat',
        '12': '12_Thich_Kinh_Luan',
        '13': '13_Ty_Dam',
        '14': '14_Trung_Quan',
        '15': '15_Du_Gia',
        '16': '16_Luan_Tap',
        '17': '17_Kinh_So',
        '18': '18_Luat_So',
        '19': '19_Luan_So',
        '20': '20_Chu_Tong',
        '21': '21_Su_Truyen',
        '22': '22_Su_Vi',
        '23': '23_Ngoai_Giao',
        '24': '24_Muc_Luc',
        '25': '25_Co_Dat_Nghi_Toi',
        '99': '99_Khac'
    }
    return folder_map.get(code, f'{code}_Folder')

if __name__ == '__main__':
    print("Building Full Library Data...")
    build_dai_thua()
    build_dai_tang_han()
    print("All Comprehensive Library Data built successfully!")

"""Build display credits from explicit Vietnamese edition metadata, never guesses."""

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

import json
import re
from pathlib import Path



def catalog(name):
    source = (WEB / 'js' / name).read_text(encoding='utf-8-sig')
    return json.JSONDecoder().raw_decode(source.split(' = ', 1)[1].lstrip())[0]


def credits_from_file(filename):
    if not filename:
        return []
    path = public_path(filename)
    if not path.is_relative_to(ROOT) or not path.is_file():
        return []
    with path.open(encoding='utf-8-sig') as source:
        preamble = ''.join(source.readline() for _ in range(30))
    credits = []
    lines = preamble.splitlines()
    stop = r'(?:Hán dịch|Hán văn|Dịch Phạn[–-]Hán|Giải thích|Hiệu đính|Phụng chiếu dịch|Nguồn|Kết cấu|QUYỂN\s+\d|Mùa An cư|TỰA|LỜI TỰA)'
    for index, line in enumerate(lines):
        cleaned = re.sub(r'[*_]', '', line).strip().lstrip('> ').strip()
        match = re.match(r'^(Việt dịch|Dịch Việt|Dịch giả|Tác giả|Biên soạn)\s*:\s*(.+)', cleaned, re.I)
        if not match:
            continue
        role, name = match.groups()
        # OCR wraps some original-author credits over physical lines. Join only
        # metadata continuations and stop before the next credit or section.
        if not line.lstrip().startswith('>'):
            for continuation in lines[index + 1:index + 5]:
                if re.search(stop, name, re.I) or not continuation.strip() or continuation.lstrip().startswith(('#', '>')) or re.match(r'^(Mùa An cư|TỰA|LỜI|QUYỂN|PHẦN|Kính|Tôi|NAM MÔ|HỘI)\b', continuation.strip(), re.I):
                    break
                name += ' ' + continuation.strip()
        source_label = role + ': ' + name
        name = re.split(stop, name, maxsplit=1, flags=re.I)[0]
        name = re.split(r'\s+[—–]\s+|\s+https?://', name)[0].strip().rstrip('.')
        name = re.split(r'\s*\(|\s+dịch,', name, maxsplit=1)[0].strip().rstrip('.')
        name = re.sub(r'\s+', ' ', name).strip(' -.,')
        if not name or len(name) > 170 or name.lower().startswith('theo bản') or 'Pháp Bả' in name or name.endswith('Ưu'):
            continue
        credits.append({'role': 'Việt dịch' if role.lower() == 'dịch việt' else role[0].upper() + role[1:],
                        'name': name, 'sourceFile': filename, 'sourceLabel': source_label, 'cover': True})
    return credits[:2]


def main():
    result = {}
    for item in catalog('dai-thua-data.js'):
        credits = credits_from_file(item['files'].get('vietMd'))
        if credits:
            result['daithua:' + item['id']] = credits
    for item in catalog('dai-tang-han-data.js')['texts']:
        credits = credits_from_file(item.get('vietFile'))
        if credits:
            result['daitang:' + item['id']] = credits
    (WEB / 'js' / 'edition-credits.js').write_text(
        '/* Credits explicitly present in the supplied edition preambles. */\n'
        'window.EDITION_CREDITS = ' + json.dumps(result, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    print(f'Built explicit edition credits for {len(result)} works.')


if __name__ == '__main__':
    main()

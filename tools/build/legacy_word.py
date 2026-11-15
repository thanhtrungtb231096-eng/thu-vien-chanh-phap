"""Read Word 97+ compound documents without opening Office or executing macros.

Extracts main text and note stories. Source layout and embedded pictures remain
in the original Word file. Encoding tables are factual VNI/Unicode equivalents;
reference: github.com/duydev/vietnamese-conversion/blob/main/src/charsets.ts.
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

import struct
import re
import unicodedata

FREE = 0xFFFFFFFF
END = 0xFFFFFFFE


def u16(data, pos):
    return struct.unpack_from('<H', data, pos)[0]


def u32(data, pos):
    return struct.unpack_from('<I', data, pos)[0]


class CompoundFile:
    def __init__(self, data):
        if data[:8] != bytes.fromhex('d0cf11e0a1b11ae1'):
            raise ValueError('Not an OLE compound document')
        self.data = data
        self.sector_size = 1 << u16(data, 30)
        self.mini_size = 1 << u16(data, 32)
        self.cutoff = u32(data, 56)
        difat = list(struct.unpack_from('<109I', data, 76))
        sid = u32(data, 68)
        for _ in range(u32(data, 72)):
            sector = self.sector(sid)
            ids = struct.unpack('<' + 'I' * (self.sector_size // 4), sector)
            difat.extend(ids[:-1])
            sid = ids[-1]
        fat_bytes = b''.join(self.sector(s) for s in difat if s < END)
        self.fat = struct.unpack('<' + 'I' * (len(fat_bytes) // 4), fat_bytes)
        directory = self.chain(u32(data, 48), self.fat)
        self.entries = {}
        root = None
        directory_items = []
        for pos in range(0, len(directory), 128):
            entry = directory[pos:pos + 128]
            length = u16(entry, 64)
            if not length or entry[66] == 0:
                directory_items.append(None)
                continue
            name = entry[:length - 2].decode('utf-16-le')
            size = struct.unpack_from('<Q', entry, 120)[0]
            if u16(data, 26) == 3:
                size &= 0xFFFFFFFF
            item = {'name': name, 'type': entry[66], 'stream': (u32(entry, 116), size),
                    'left': u32(entry, 68), 'right': u32(entry, 72), 'child': u32(entry, 76)}
            directory_items.append(item)
            if entry[66] == 5:
                root = item
        # Embedded objects can have their own WordDocument/1Table streams.
        # Only the streams in the root storage belong to the main document.
        pending = [root['child']] if root else []
        visited = set()
        while pending:
            index = pending.pop()
            if index == FREE:
                continue
            if index in visited or index >= len(directory_items):
                raise ValueError('Invalid compound-file directory tree')
            visited.add(index)
            item = directory_items[index]
            if not item:
                raise ValueError('Missing compound-file directory entry')
            pending.extend((item['left'], item['right']))
            if item['type'] == 2:
                self.entries[item['name']] = item['stream']
        root_stream = root['stream'] if root else (END, 0)
        self.mini_stream = self.chain(root_stream[0], self.fat)[:root_stream[1]]
        mini_bytes = self.chain(u32(data, 60), self.fat)
        self.mini_fat = struct.unpack('<' + 'I' * (len(mini_bytes) // 4), mini_bytes)

    def sector(self, sid):
        start = (sid + 1) * self.sector_size
        result = self.data[start:start + self.sector_size]
        if len(result) != self.sector_size:
            raise ValueError('Invalid compound-file sector')
        return result

    def chain(self, sid, fat, mini=False):
        blocks = []
        seen = set()
        while sid < END:
            if sid in seen or sid >= len(fat):
                raise ValueError('Invalid compound-file chain')
            seen.add(sid)
            if mini:
                start = sid * self.mini_size
                blocks.append(self.mini_stream[start:start + self.mini_size])
            else:
                blocks.append(self.sector(sid))
            sid = fat[sid]
        return b''.join(blocks)

    def stream(self, name):
        start, size = self.entries[name]
        return self.chain(start, self.mini_fat if size < self.cutoff else self.fat,
                          mini=size < self.cutoff)[:size]


VNI = {'ñ': 'đ', 'ô': 'ơ', 'ö': 'ư', 'æ': 'ỉ', 'ò': 'ị', 'ó': 'ĩ', 'î': 'ỵ'}
for base, codes, letters in [
    ('a', 'øùûõïâàáåãäêèéúüë', 'àáảãạâầấẩẫậăằắẳẵặ'),
    ('e', 'øùûõïâàáåãä', 'èéẻẽẹêềếểễệ'),
    ('o', 'øùûõïâàáåãä', 'òóỏõọôồốổỗộ'),
    ('ô', 'øùûõï', 'ờớởỡợ'), ('u', 'øùûõï', 'ùúủũụ'),
    ('ö', 'øùûõï', 'ừứửữự'), ('y', 'øùûõï', 'ỳýỷỹỵ')]:
    VNI.update({base + code: letter for code, letter in zip(codes, letters)})
VNI.update({source.upper(): target.upper() for source, target in list(VNI.items())})
VNI_RE = re.compile('|'.join(re.escape(x) for x in sorted(VNI, key=len, reverse=True)))
VNI_SIGNAL = re.compile(r'[aeouAEOUôöÔÖ][øùûõïâàáåãäêèéúüëØÙÛÕÏÂÀÁÅÃÄÊÈÉÚÜË]|[ñÑöÖæÆ]')
UNICODE_VI = re.compile(r'[\u1ea0-\u1ef9ăĂđĐơƠưƯ]')


def normalize_vietnamese(text):
    """Convert legacy-looking paragraphs, leaving Unicode Vietnamese untouched."""
    changed = 0
    lines = text.split('\n')
    dominant = sum(bool(VNI_SIGNAL.search(line)) for line in lines) > max(12, len(lines) // 2)
    result = []
    for line in lines:
        # Ordinary Unicode prose can contain a quoted phrase in VNI. Converting
        # the whole paragraph would damage existing Vietnamese vowels.
        if not UNICODE_VI.search(line) and (VNI_SIGNAL.search(line) or dominant):
            fixed = VNI_RE.sub(lambda m: VNI[m.group()], line)
            changed += fixed != line
            line = fixed
        result.append(line)
    return unicodedata.normalize('NFC', '\n'.join(result).replace('Ð', 'Đ')), changed


def visible_text(raw):
    stack, pieces = [], []
    for segment in re.split(r'([\x13-\x15])', raw):
        if segment == '\x13': stack.append(False)
        elif segment == '\x14' and stack: stack[-1] = True
        elif segment == '\x15' and stack: stack.pop()
        elif all(stack): pieces.append(segment)
    text = ''.join(pieces).replace('\r', '\n').replace('\x0b', '\n').replace('\x07', '\t')
    # Reference markers have no displayed number in the binary story; do not
    # invent numbering. Actual note stories are retained separately below.
    text = text.replace('\x02', ' [chú thích] ')
    text = re.sub(r'[\x00-\x08\x0c\x0e-\x1f]', '', text)
    return re.sub(r'\n[ \t]*\n(?:[ \t]*\n)+', '\n\n', text).strip()


def extract_word(data):
    ole = CompoundFile(data)
    word = ole.stream('WordDocument')
    flags = u16(word, 10)
    if flags & 0x0100: raise ValueError('Encrypted Word document')
    table = ole.stream('1Table' if flags & 0x0200 else '0Table')
    pos = 32
    pos += 2 + u16(word, pos) * 2
    count = u16(word, pos)
    lengths = [u32(word, pos + 2 + i * 4) for i in range(3, min(count, 11))]
    pos += 2 + count * 4
    if u16(word, pos) <= 33: raise ValueError('Unsupported pre-Word97 document')
    pos += 2
    offset, length = struct.unpack_from('<II', word, pos + 33 * 8)
    clx = table[offset:offset + length]
    pos = 0
    while pos < len(clx) and clx[pos] == 1: pos += 3 + u16(clx, pos + 1)
    if pos >= len(clx) or clx[pos] != 2: raise ValueError('Missing Word piece table')
    size = u32(clx, pos + 1)
    plc = clx[pos + 5:pos + 5 + size]
    count = (size - 4) // 12
    cps = struct.unpack_from('<' + 'I' * (count + 1), plc)
    parts = []
    for i in range(count):
        chars = cps[i + 1] - cps[i]
        fc = u32(plc, 4 * (count + 1) + i * 8 + 2)
        compressed = bool(fc & 0x40000000)
        fc &= 0x3FFFFFFF
        if compressed:
            fc //= 2
            # Preserve undefined ANSI bytes as controls so that inspection can
            # flag them instead of silently replacing source text.
            value = word[fc:fc + chars].decode('cp1252', errors='replace')
        else: value = word[fc:fc + chars * 2].decode('utf-16-le', errors='replace')
        parts.append(value)
    raw = ''.join(parts)
    # Word positions count UTF-16 code units; split using bytes to preserve
    # story boundaries even when a manuscript includes supplementary glyphs.
    encoded = raw.encode('utf-16-le')
    stories, start = [], 0
    for size in lengths:
        stories.append(encoded[start * 2:(start + size) * 2].decode('utf-16-le', errors='replace'))
        start += size
    main, changed = normalize_vietnamese(visible_text(stories[0]))
    notes = []
    for index, title in ((1, 'Chú thích cuối trang'), (5, 'Chú thích cuối sách')):
        if index < len(stories) and stories[index].strip('\r\n\x02 '):
            note, fixes = normalize_vietnamese(visible_text(stories[index]))
            if note:
                notes.append((title, note)); changed += fixes
    return {'text': main, 'notes': notes, 'convertedParagraphs': changed,
            'embeddedObjects': stories[0].count('\x01') + stories[0].count('\x08'),
            'expectedMainCodeUnits': lengths[0],
            'extractedMainCodeUnits': len(stories[0].encode('utf-16-le')) // 2}



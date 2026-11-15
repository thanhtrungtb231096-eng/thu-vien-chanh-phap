"""Export a lightweight, zero-dependency Vietnamese + Buddhist Pāḷi phoneme lexicon
from sea_g2p for on-device iOS (Swift) & Android (Kotlin) VieNeu-TTS-v3-Nano inference."""
from __future__ import annotations

from pathlib import Path
import argparse
import gzip
import json
import random
import re
import sys
import time
import unicodedata

BOOTSTRAP = next(
    candidate
    for ancestor in Path(__file__).resolve().parents
    for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
    if (candidate / 'project_paths.py').is_file()
)
sys.path.insert(0, str(BOOTSTRAP))
from project_paths import ROOT, WEB, GENERATED, SOURCES, TTS_MODELS, DEPENDENCIES, MOBILE_DIST
sys.path.insert(0, str(DEPENDENCIES))

from narration_engine import speech_text

WORD_RE = re.compile(r"[^\W\d_]+", re.UNICODE)
TOKEN_SPLIT_RE = re.compile(r"([^\W\d_]+|\d+|[.,!?;:…])", re.UNICODE)

DIGITS_VI = ('không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín')


def number_to_vietnamese(n: int) -> str:
    """Convert non-negative integers (0..999,999,999) into standard spoken Vietnamese."""
    if n < 0:
        return 'âm ' + number_to_vietnamese(-n)
    if n < 10:
        return DIGITS_VI[n]

    def read_triple(val: int, full: bool) -> list[str]:
        h, rem = divmod(val, 100)
        t, u = divmod(rem, 10)
        out: list[str] = []
        if full or h > 0:
            out.extend([DIGITS_VI[h], 'trăm'])
            if t == 0 and u > 0:
                out.append('lẻ')
        if t == 1:
            out.append('mười')
            if u == 5:
                out.append('lăm')
            elif u > 0:
                out.append(DIGITS_VI[u])
        elif t > 1:
            out.extend([DIGITS_VI[t], 'mươi'])
            if u == 1:
                out.append('mốt')
            elif u == 4:
                out.append('tư')
            elif u == 5:
                out.append('lăm')
            elif u > 0:
                out.append(DIGITS_VI[u])
        elif u > 0:
            out.append(DIGITS_VI[u])
        return out

    if n >= 1_000_000_000:
        return ' '.join(DIGITS_VI[int(ch)] for ch in str(n))

    millions, rem = divmod(n, 1_000_000)
    thousands, units = divmod(rem, 1_000)
    parts: list[str] = []
    if millions > 0:
        parts.extend(read_triple(millions, False))
        parts.append('triệu')
    if thousands > 0:
        parts.extend(read_triple(thousands, millions > 0))
        parts.append('nghìn')
    if units > 0:
        parts.extend(read_triple(units, millions > 0 or thousands > 0))
    return ' '.join(parts)


def mobile_normalize_vi(raw: str) -> str:
    """Pure rule-based normalizer mirrored identically in Swift & Kotlin on mobile."""
    text = speech_text(raw)
    text = unicodedata.normalize('NFC', text)
    # Hyphens / slashes / dashes between letters become spaces (e.g. Tỷ-kheo -> tỷ kheo)
    text = re.sub(r'[-–—/]+', ' ', text)
    # Colons and semicolons act as clause pauses like commas in sea_g2p
    text = re.sub(r'[:;]+', ',', text)
    text = re.sub(r'[""\'\'«»„‟()\[\]{}*#_~`<>|]+', ' ', text)
    text = re.sub(r'\d+', lambda m: ' ' + number_to_vietnamese(int(m.group(0))) + ' ', text)
    text = re.sub(r'\s+([.,!?…])', r'\1', text)
    text = re.sub(r'([.,!?…])([^\s.,!?…])', r'\1 \2', text)
    text = ' '.join(text.lower().split())
    # sea_g2p punc_norm rule: < 5 words forces trailing ".", else ensures trailing punctuation
    words = WORD_RE.findall(text)
    text_stripped = text.rstrip(' .,!?…')
    if not text_stripped:
        return ''
    if len(words) < 5:
        return text_stripped + '.'
    if text[-1] not in '.,!?':
        return text_stripped + '.'
    return text


def mobile_phonemize_vi(raw: str, word_map: dict[str, str], char_fallback: dict[str, str]) -> str:
    """Convert Vietnamese sutra text to VieNeu phoneme stream using only the exported lexicon."""
    norm = mobile_normalize_vi(raw)
    if not norm:
        return ''
    out: list[str] = []
    tokens = re.findall(r"[^\W\d_]+|[.,!?]", norm, re.UNICODE)
    for tok in tokens:
        if tok in '.,!?':
            if out:
                out[-1] = out[-1] + tok
            continue
        ph = word_map.get(tok)
        if not ph:
            # Syllable/character fallback for unseen foreign/transliterated tokens
            ph = ''.join(char_fallback.get(ch, '') for ch in tok).strip() or tok
        out.append(ph)
    res = ' '.join(out).strip()
    if res and res[-1] not in '.,!?':
        res += '.'
    return res


def collect_corpus_words_and_samples(sample_target: int = 1000) -> tuple[set[str], list[str]]:
    words: set[str] = set()
    candidate_sentences: list[str] = []
    rng = random.Random(20261114)

    md_dirs = [
        SOURCES['Dai_thua'],
        SOURCES['Dai_Tang_Kinh_Han'],
        GENERATED / 'dai-tang-kinh',
        GENERATED / 'phuc-minh',
    ]
    md_files: list[Path] = []
    for folder in md_dirs:
        if folder.is_dir():
            md_files.extend(p for p in folder.rglob('*.md') if not p.name.endswith('_han.md'))

    for idx, md_path in enumerate(md_files):
        try:
            content = md_path.read_text(encoding='utf-8', errors='ignore')
        except OSError:
            continue
        # Strip CJK characters since TTS only speaks Vietnamese
        clean = re.sub(r'[\u3400-\u9fff\uf900-\ufaff]+', ' ', content)
        clean = unicodedata.normalize('NFC', clean.lower())
        for w in WORD_RE.findall(clean):
            if 1 <= len(w) <= 24:
                words.add(w)
        # Reservoir-sample clean Vietnamese sentences for verification
        if idx % 5 == 0:
            for line in clean.splitlines():
                line = line.strip()
                if 30 <= len(line) <= 170 and not line.startswith('#') and re.search(r'[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]', line):
                    if len(candidate_sentences) < sample_target * 4:
                        candidate_sentences.append(line)
                    else:
                        replace_at = rng.randint(0, len(candidate_sentences) - 1)
                        if replace_at < sample_target:
                            candidate_sentences[replace_at] = line

    # Include learning path & glossary JS vocabulary
    for js_file in (WEB / 'js').glob('*.js'):
        if any(k in js_file.name for k in ('learning-path', 'glossary', 'practical', 'milinda', 'dhamma')):
            try:
                raw_js = unicodedata.normalize('NFC', js_file.read_text(encoding='utf-8', errors='ignore').lower())
                for w in WORD_RE.findall(raw_js):
                    if 1 <= len(w) <= 24 and not w.isascii():
                        words.add(w)
            except OSError:
                pass

    # Add core Vietnamese numbers & common syllables
    for extra in (
        *DIGITS_VI, 'mười', 'mươi', 'mốt', 'tư', 'lăm', 'lẻ', 'linh', 'trăm', 'nghìn', 'ngàn', 'triệu', 'tỷ',
        'quyển', 'phẩm', 'chương', 'phần', 'tập', 'kinh', 'luật', 'luận', 'phật', 'pháp', 'tăng',
    ):
        words.add(extra)

    rng.shuffle(candidate_sentences)
    return words, candidate_sentences[:sample_target]


def build_lexicon(out_dir: Path, sample_count: int = 1000) -> dict:
    from sea_g2p import G2P, SEAPipeline

    t0 = time.monotonic()
    words, samples = collect_corpus_words_and_samples(sample_count)
    sorted_words = sorted(words)

    g2p = G2P('vi')
    pipe = SEAPipeline('vi')

    BATCH = 4096
    word_map: dict[str, str] = {}
    for start in range(0, len(sorted_words), BATCH):
        chunk = sorted_words[start:start + BATCH]
        converted = g2p.phonemize_batch(chunk, punc_norm=False)
        for w, ph in zip(chunk, converted):
            ph_clean = ph.strip().rstrip('.')
            if ph_clean:
                word_map[w] = ph_clean

    # Single-letter fallback map for rare Latin characters
    alphabet = list('abcdefghijklmnopqrstuvwxyzàáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ')
    char_fallback = {
        ch: g2p.convert(ch, punc_norm=False).strip().rstrip('.')
        for ch in alphabet
    }

    nano_cfg_path = TTS_MODELS / 'VieNeu-TTS-v3-Nano' / 'config.json'
    nano_cfg = json.loads(nano_cfg_path.read_text(encoding='utf-8'))

    payload = {
        'format': 'chanh-phap-vi-lexicon-v1',
        'wordCount': len(word_map),
        'vocab': nano_cfg['vocab'],
        'bosId': int(nano_cfg['bos_id']),
        'eosId': int(nano_cfg['eos_id']),
        'padId': int(nano_cfg['pad_id']),
        'flowFps': float(nano_cfg.get('flow_fps', 24000 / 256 / 6)),
        'sampleRate': 24000,
        'charFallback': char_fallback,
        'words': word_map,
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    json_bytes = json.dumps(payload, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    raw_path = out_dir / 'vi_lexicon.json'
    gz_path = out_dir / 'vi_lexicon.json.gz'
    raw_path.write_bytes(json_bytes)
    gz_path.write_bytes(gzip.compress(json_bytes, compresslevel=9))

    # Benchmark phoneme parity on real Buddhist sutra sentences
    exact_sentence_matches = 0
    total_tokens = 0
    matched_tokens = 0
    vocab_set = set(nano_cfg['vocab'].keys())
    valid_vocab_chars = 0
    total_vocab_chars = 0

    for sent in samples:
        norm_sent = speech_text(sent)
        ref = pipe.run(norm_sent, punc_norm=True)
        mob = mobile_phonemize_vi(sent, word_map, char_fallback)
        if ref == mob:
            exact_sentence_matches += 1
        ref_toks = ref.split()
        mob_toks = mob.split()
        total_tokens += max(len(ref_toks), 1)
        for rt, mt in zip(ref_toks, mob_toks):
            if rt == mt:
                matched_tokens += 1
        for ch in mob:
            total_vocab_chars += 1
            if ch in vocab_set:
                valid_vocab_chars += 1

    elapsed = round(time.monotonic() - t0, 2)
    return {
        'status': 'ok',
        'uniqueWords': len(word_map),
        'rawBytes': len(json_bytes),
        'gzipBytes': gz_path.stat().st_size,
        'gzipKB': round(gz_path.stat().st_size / 1024, 1),
        'samplesTested': len(samples),
        'exactSentenceRate': round(exact_sentence_matches / max(1, len(samples)), 4),
        'tokenParityRate': round(matched_tokens / max(1, total_tokens), 4),
        'vocabCoverageRate': round(valid_vocab_chars / max(1, total_vocab_chars), 4),
        'elapsedSeconds': elapsed,
        'outputPath': str(gz_path),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--out',
        type=Path,
        default=MOBILE_DIST / 'cdn-upload' / 'tts' / 'vieneu-nano-mobile-v1',
        help='Output directory outside the workspace',
    )
    parser.add_argument('--samples', type=int, default=1000, help='Number of sutra sentences to benchmark')
    args = parser.parse_args()
    out_dir = args.out.resolve()
    if out_dir.is_relative_to(ROOT.resolve()):
        raise SystemExit('Output directory must reside outside the project workspace.')
    summary = build_lexicon(out_dir, args.samples)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()


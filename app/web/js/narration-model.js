/* Semantic listening paragraphs; source manuscripts and block IDs are untouched. */
(function (root) {
  'use strict';
  const VERSION = 2, LIMIT = 1800;
  const omitted = new Set(['metadata', 'note', 'contents', 'running']);
  const plain = raw => raw.replace(/https?:\/\/\S+/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[\u3400-\u9fff\uf900-\ufaff]/g, '').replace(/[#*_>`~|]/g, '').replace(/\s+/g, ' ').trim();
  const speaker = text => /^[^.!?：“”"\n]{0,95}(?:hỏi|thưa|đáp|bảo|dạy|bạch|nói|rằng)[^.!?：“”"\n]{0,45}:\s*/u.test(text);
  const ending = text => /[.!?。！？…][”’"')\]]*$/u.test(text.trim());
  function quoteOpen(text) {
    let open = false;
    for (const c of text) { if (c === '“') open = true; else if (c === '”') open = false; else if (c === '"') open = !open; }
    return open;
  }
  function isStop(text, i) {
    if (!/[.!?。！？…]/u.test(text[i])) return false;
    if (text[i] === '.') {
      if (/\d/.test(text[i - 1] || '') && /\d/.test(text[i + 1] || '')) return false;
      if (/(?:\b(?:HT|TT|TS|ThS|PGS|GS|Skt|Pāli|No|tr|sđd)|v\.v|v\.d)$/iu.test(text.slice(0, i))) return false;
    }
    return true;
  }
  // Quoted answers remain a single unit, including their speaker and closing quote.
  function sentences(text) {
    const result = []; let start = 0, quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '“') quoted = true;
      else if (c === '”') quoted = false;
      else if (c === '"') quoted = !quoted;
      if (!isStop(text, i)) continue;
      let end = i + 1, closes = false;
      while (end < text.length && /[.!?。！？…”’"')\]]/u.test(text[end])) { if (/[”"]/u.test(text[end])) closes = true; end++; }
      if ((quoted && !closes) || (end < text.length && !/\s/u.test(text[end]))) continue;
      result.push(text.slice(start, end).trim()); start = end; i = end - 1;
      if (closes) quoted = false;
    }
    if (text.slice(start).trim()) result.push(text.slice(start).trim());
    return result;
  }
  function splitLong(text, limit = LIMIT) {
    const result = [];
    while (text.length > limit) {
      let sentence = -1, clause = -1;
      for (let i = 0; i < limit; i++) {
        if (isStop(text, i)) {
          let end = i + 1;
          while (end < limit && /[.!?…”’"')\]]/u.test(text[end])) end++;
          if (/\s/u.test(text[end] || '') && end > limit * .35) sentence = end;
        }
        if (/[;,，；:]/u.test(text[i]) && /\s/u.test(text[i + 1] || '') && i > limit * .35) clause = i + 1;
      }
      // Only exceptionally long, unpunctuated source text needs a word boundary.
      const at = sentence > 0 ? sentence : clause > 0 ? clause : text.lastIndexOf(' ', limit);
      const cut = at > 0 ? at : limit;
      result.push(text.slice(0, cut).trim()); text = text.slice(cut).trim();
    }
    if (text) result.push(text);
    return result;
  }
  function chunks(text, target = 500, limit = LIMIT) {
    const result = []; let buffer = '';
    const flush = () => { if (buffer) result.push(...splitLong(buffer, limit)); buffer = ''; };
    for (const sentence of sentences(text.trim())) {
      const newTurn = speaker(sentence);
      if (buffer && (newTurn || speaker(buffer) || buffer.length + sentence.length + 1 > target)) flush();
      buffer += (buffer ? ' ' : '') + sentence;
    }
    flush(); return result;
  }
  function build(doc) {
    const lines = [];
    for (const block of doc.blocks) {
      if (omitted.has(block.kind)) continue;
      // Page markers navigate PDF reading editions; do not speak them between paragraphs.
      if (block.kind === 'heading' && /^Trang \d+$/u.test(block.heading?.title || '')) continue;
      if (!/[a-zA-ZÀ-ỹ]/u.test(plain(block.raw))) continue;
      let offset = 0;
      for (const raw of block.raw.split(/\r?\n/)) {
        const text = plain(raw);
        if (!text) { lines.push({ blank: true }); continue; }
        lines.push({ text, block: block.id, offset, heading: block.kind === 'heading' ? block.heading?.title || text : null });
        offset += text.length + 1;
      }
    }
    const groups = []; let group = null, verseContext = false;
    const flush = () => { if (group) groups.push(group); group = null; };
    const short = line => line?.text && !line.heading && !speaker(line.text) && !/^[“"—]/u.test(line.text) && line.text.split(/\s+/).length >= 3 && line.text.split(/\s+/).length <= 8 && !/:$/.test(line.text);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.blank) { if (group && ending(group.text) && !quoteOpen(group.text)) flush(); continue; }
      if (line.heading) {
        flush(); groups.push({ text: line.text, kind: 'heading', heading: line.heading, sources: [{ ...line, start: 0, end: line.text.length }] }); verseContext = false; continue;
      }
      let run = 0;
      for (let j = i; j < lines.length && j < i + 8; j++) { if (lines[j].blank) continue; if (!short(lines[j])) break; run++; }
      const verse = short(line) && (verseContext || run >= 4);
      if (!verse && !/\b(?:kệ|tụng)\s*[:：]$/iu.test(line.text)) verseContext = false;
      if (verse) verseContext = true;
      const turn = speaker(line.text);
      if (group && (verse !== (group.kind === 'verse') || turn || (/^[“"]/u.test(line.text) && ending(group.text)))) flush();
      if (!group) group = { text: '', kind: verse ? 'verse' : turn ? 'dialogue' : 'prose', sources: [] };
      const separator = group.text ? (verse ? '\n' : ' ') : '';
      const start = group.text.length + separator.length;
      group.text += separator + line.text; group.sources.push({ ...line, start, end: group.text.length });
      if (/\b(?:kệ|tụng)\s*[:：]$/iu.test(line.text)) verseContext = true;
    }
    flush();
    const result = [], counts = new Map();
    for (const paragraph of groups) {
      const parts = paragraph.kind === 'verse' ? splitVerse(paragraph.text) : chunks(paragraph.text);
      let from = 0;
      for (const [partIndex, text] of parts.entries()) {
        const start = paragraph.text.indexOf(text, from), end = start + text.length; from = end;
        const sources = paragraph.sources.filter(s => s.end > start && s.start < end).map(s => ({ block: s.block, offset: s.offset + Math.max(0, start - s.start), end: s.offset + Math.min(s.text.length, end - s.start) }));
        const first = sources[0]; if (!first) continue;
        const chunk = counts.get(first.block) || 0; counts.set(first.block, chunk + 1);
        const kind = paragraph.kind === 'prose' && speaker(text) ? 'dialogue' : paragraph.kind;
        result.push({ block: first.block, blocks: [...new Set(sources.map(s => s.block))], sourceOffset: first.offset, sources, chunk, text, kind,
          heading: paragraph.heading || null, chapterBreak: paragraph.kind === 'heading', sectionBreak: partIndex === 0,
          pauseBefore: paragraph.kind === 'heading' ? 650 : result.at(-1)?.kind === 'heading' ? 400 : kind === 'dialogue' ? 180 : 0,
          segmentation: VERSION });
      }
    }
    annotateChapters(result);
    return result;
  }
  function baseSpeechSeconds(text, pauseBeforeMs = 0) {
    const clean = String(text || '').trim();
    if (!clean) return 0.5;
    const words = clean.split(/\s+/u).filter(Boolean).length;
    const commas = (clean.match(/[,;，；:：]/gu) || []).length;
    const stops = (clean.match(/[.!?。！？…]/gu) || []).length;
    const speech = words / 3.15 + commas * 0.20 + stops * 0.38 + 0.35;
    const pause = Math.max(0, Number(pauseBeforeMs) || 0) / 1000;
    return Math.round(Math.max(0.8, speech + pause) * 100) / 100;
  }
  function estimateSeconds(item, rate = 1) {
    const base = typeof item === 'object' && item !== null
      ? (Number.isFinite(item.baseSeconds) && item.baseSeconds > 0 ? item.baseSeconds : baseSpeechSeconds(item.text, item.pauseBefore))
      : baseSpeechSeconds(item, 0);
    return base / Math.max(0.5, Number(rate) || 1);
  }
  function cleanHeadingTitle(raw) {
    return String(raw || '').replace(/\s+/gu, ' ').replace(/(?<=[A-Za-zÀ-ỹ])\d+$/u, '').trim();
  }
  function isStructuralHeading(heading, index = 0) {
    const h = cleanHeadingTitle(heading);
    if (!h) return false;
    if (index === 0) return true;
    if (/^[a-zàáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/u.test(h)) return false;
    const structuralPrefix = /^(?:phẩm|quyển|chương|phần|tiết|bài|kinh|kệ|mục|thứ|hội|đệ|[ivxlcdm]+\b|\d+[\s.:)-])/iu.test(h);
    if (/[”"']$/u.test(h) && !structuralPrefix) return false;
    if (h.length > 120 && !structuralPrefix) return false;
    return true;
  }
  function mergeHeadingTitles(shortTitle, nextTitle) {
    const a = cleanHeadingTitle(shortTitle), b = cleanHeadingTitle(nextTitle);
    if (!a) return b;
    if (!b) return a;
    if (/^quyển\s+(?:[ivxlcdm]+|\d+|thượng|trung|hạ|[a-zà-ỹ]+)$/iu.test(a) && !/quyển/iu.test(b)) {
      const normalizedQuyen = a.toLowerCase().replace(/(?:^|\s)\S/gu, c => c.toUpperCase())
        .replace(/\b([ivxlcdm]+)\b/giu, m => m.toUpperCase());
      return `${normalizedQuyen} · ${b}`;
    }
    return b;
  }
  function buildChapters(segments, fallbackTitle = '') {
    if (!Array.isArray(segments) || !segments.length) return [];
    for (const seg of segments) {
      if (!Number.isFinite(seg.baseSeconds) || seg.baseSeconds <= 0) {
        seg.baseSeconds = baseSpeechSeconds(seg.text, seg.pauseBefore);
      }
    }
    const rawStarts = [];
    for (let i = 0; i < segments.length; i++) {
      if (segments[i]?.heading && isStructuralHeading(segments[i].heading, i)) {
        rawStarts.push({ startIndex: i, title: cleanHeadingTitle(segments[i].heading) });
      }
    }
    if (!rawStarts.length || rawStarts[0].startIndex > 0) {
      const firstHeading = rawStarts[0];
      if (firstHeading && firstHeading.startIndex <= 4) {
        firstHeading.startIndex = 0;
      } else {
        rawStarts.unshift({ startIndex: 0, title: cleanHeadingTitle(fallbackTitle) || 'Phần mở đầu' });
      }
    }
    let groups = rawStarts.map((entry, idx) => {
      const endIndex = idx + 1 < rawStarts.length ? rawStarts[idx + 1].startIndex - 1 : segments.length - 1;
      let baseDuration = 0;
      for (let k = entry.startIndex; k <= endIndex; k++) baseDuration += segments[k].baseSeconds;
      return { title: entry.title, startIndex: entry.startIndex, endIndex, baseDuration };
    });

    // Coalesce micro-headings (e.g., "QUYỂN 2" immediately followed by "Phẩm 3: Thí Dụ", or frontmatter headers)
    if (groups.length > 1) {
      const merged = [];
      for (let i = 0; i < groups.length; i++) {
        const cur = groups[i];
        const segSpan = cur.endIndex - cur.startIndex + 1;
        const isBareVolume = /^quyển\s+(?:[ivxlcdm]+|\d+|thượng|trung|hạ|[a-zà-ỹ]+)$/iu.test(cur.title) && segSpan <= 6;
        if (i + 1 < groups.length && (isBareVolume || segSpan <= 4 || cur.baseDuration < 22)) {
          groups[i + 1] = {
            title: mergeHeadingTitles(cur.title, groups[i + 1].title),
            startIndex: cur.startIndex,
            endIndex: groups[i + 1].endIndex,
            baseDuration: cur.baseDuration + groups[i + 1].baseDuration,
          };
          continue;
        }
        merged.push(cur);
      }
      if (merged.length > 1) {
        const tail = merged[merged.length - 1];
        if ((tail.endIndex - tail.startIndex + 1) <= 2 || tail.baseDuration < 15) {
          const prev = merged[merged.length - 2];
          prev.endIndex = tail.endIndex;
          prev.baseDuration += tail.baseDuration;
          merged.pop();
        }
      }
      groups = merged;
    }

    // If an un-headed book is very long (>160 segments, ~40+ minutes), split cleanly at natural paragraph boundaries
    if (groups.length === 1 && segments.length > 160) {
      const targetParts = Math.max(2, Math.ceil(segments.length / 100));
      const step = Math.ceil(segments.length / targetParts);
      const baseTitle = groups[0].title && groups[0].title !== 'Phần mở đầu' ? groups[0].title : cleanHeadingTitle(fallbackTitle);
      const splitGroups = [];
      let cursor = 0;
      for (let part = 0; part < targetParts && cursor < segments.length; part++) {
        let end = part === targetParts - 1 ? segments.length - 1 : Math.min(segments.length - 1, cursor + step - 1);
        if (end < segments.length - 1) {
          for (let probe = end; probe <= Math.min(segments.length - 2, end + 12); probe++) {
            if (segments[probe + 1]?.sectionBreak) { end = probe; break; }
          }
        }
        let dur = 0;
        for (let k = cursor; k <= end; k++) dur += segments[k].baseSeconds;
        splitGroups.push({
          title: baseTitle ? `${baseTitle} · Phần ${part + 1}` : `Phần ${part + 1}`,
          startIndex: cursor,
          endIndex: end,
          baseDuration: dur,
        });
        cursor = end + 1;
      }
      groups = splitGroups;
    }

    return groups.map((g, idx) => ({
      chapterIndex: idx,
      chapterCount: groups.length,
      title: g.title || (groups.length > 1 ? `Phần ${idx + 1}` : (cleanHeadingTitle(fallbackTitle) || 'Trọn bản kinh')),
      startIndex: g.startIndex,
      endIndex: g.endIndex,
      segmentCount: g.endIndex - g.startIndex + 1,
      baseDuration: Math.round(g.baseDuration * 100) / 100,
    }));
  }
  function annotateChapters(segments, fallbackTitle = '') {
    const chapters = buildChapters(segments, fallbackTitle);
    for (const ch of chapters) {
      for (let i = ch.startIndex; i <= ch.endIndex; i++) {
        if (!segments[i]) continue;
        segments[i].chapterIndex = ch.chapterIndex;
        segments[i].chapterCount = ch.chapterCount;
        segments[i].chapterTitle = ch.title;
      }
    }
    return chapters;
  }
  function segmentMediaDuration(segments, index, durationMap) {
    const seg = segments?.[index];
    if (!seg) return 1;
    const known = durationMap instanceof Map ? durationMap.get(index) : durationMap?.[index];
    if (Number.isFinite(known) && known > 0.05) return known;
    return Number.isFinite(seg.baseSeconds) && seg.baseSeconds > 0 ? seg.baseSeconds : baseSpeechSeconds(seg.text, seg.pauseBefore);
  }
  function chapterProgress(segments, chapters, currentIndex = 0, segmentSeconds = 0, durationMap = null) {
    if (!Array.isArray(segments) || !segments.length) {
      return { chapterIndex: 0, chapterCount: 0, chapterTitle: '', startIndex: 0, endIndex: 0, chapterTime: 0, chapterDuration: 0, chapterEstimated: false };
    }
    const list = Array.isArray(chapters) && chapters.length ? chapters : buildChapters(segments);
    const clampedIdx = Math.max(0, Math.min(segments.length - 1, Number(currentIndex) || 0));
    const ch = list.find(c => c.startIndex <= clampedIdx && clampedIdx <= c.endIndex) || list[0];
    let elapsedBefore = 0, total = 0, allExact = true;
    for (let i = ch.startIndex; i <= ch.endIndex; i++) {
      const known = durationMap instanceof Map ? durationMap.get(i) : durationMap?.[i];
      const hasExact = Number.isFinite(known) && known > 0.05;
      if (!hasExact) allExact = false;
      const dur = hasExact ? known : segmentMediaDuration(segments, i, null);
      if (i < clampedIdx) elapsedBefore += dur;
      total += dur;
    }
    const curSegDur = segmentMediaDuration(segments, clampedIdx, durationMap);
    const inSeg = Math.max(0, Math.min(curSegDur, Number(segmentSeconds) || 0));
    const chapterDuration = Math.max(0.5, Math.round(total * 100) / 100);
    const chapterTime = Math.min(chapterDuration, Math.max(0, Math.round((elapsedBefore + inSeg) * 100) / 100));
    return {
      chapterIndex: ch.chapterIndex,
      chapterCount: list.length,
      chapterTitle: ch.title,
      startIndex: ch.startIndex,
      endIndex: ch.endIndex,
      chapterTime,
      chapterDuration,
      chapterEstimated: !allExact,
    };
  }
  function locateInChapter(segments, chapters, chapterIndex, targetChapterSeconds, durationMap = null) {
    if (!Array.isArray(segments) || !segments.length) return { index: 0, seconds: 0 };
    const list = Array.isArray(chapters) && chapters.length ? chapters : buildChapters(segments);
    const ch = list[Math.max(0, Math.min(list.length - 1, Number(chapterIndex) || 0))] || list[0];
    let remaining = Math.max(0, Number(targetChapterSeconds) || 0);
    for (let i = ch.startIndex; i <= ch.endIndex; i++) {
      const dur = segmentMediaDuration(segments, i, durationMap);
      if (remaining < dur || i === ch.endIndex) {
        return { index: i, seconds: Math.max(0, Math.min(Math.max(0, dur - 0.04), remaining)) };
      }
      remaining -= dur;
    }
    return { index: ch.endIndex, seconds: 0 };
  }
  function locateByDelta(segments, currentIndex, currentSeconds, deltaSeconds, durationMap = null) {
    if (!Array.isArray(segments) || !segments.length) return { index: 0, seconds: 0 };
    let idx = Math.max(0, Math.min(segments.length - 1, Number(currentIndex) || 0));
    let pos = Math.max(0, Number(currentSeconds) || 0) + (Number(deltaSeconds) || 0);
    while (pos < 0 && idx > 0) {
      idx -= 1;
      pos += segmentMediaDuration(segments, idx, durationMap);
    }
    if (pos < 0) return { index: 0, seconds: 0 };
    while (idx < segments.length - 1) {
      const dur = segmentMediaDuration(segments, idx, durationMap);
      if (pos < dur) break;
      pos -= dur;
      idx += 1;
    }
    const finalDur = segmentMediaDuration(segments, idx, durationMap);
    return { index: idx, seconds: Math.max(0, Math.min(Math.max(0, finalDur - 0.04), pos)) };
  }
  function splitVerse(text) {
    const parts = []; let stanza = '';
    for (const line of text.split('\n')) {
      if (stanza && (stanza.split('\n').length >= 4 || stanza.length + line.length > LIMIT)) { parts.push(stanza); stanza = ''; }
      if (line.length > LIMIT) { if (stanza) parts.push(stanza); parts.push(...splitLong(line)); stanza = ''; }
      else stanza += (stanza ? '\n' : '') + line;
    }
    if (stanza) parts.push(stanza); return parts;
  }
  function locate(queue, block, offset = 0) {
    const exact = queue.findIndex(q => q.sources.some(s => s.block === block && offset >= s.offset && offset < s.end));
    return exact >= 0 ? exact : queue.findIndex(q => q.blocks.includes(block));
  }
  const api = {
    VERSION, LIMIT, plain, chunks, build, locate, sentences,
    estimateSeconds, buildChapters, annotateChapters, chapterProgress, locateInChapter, locateByDelta
  };
  if (typeof module !== 'undefined') module.exports = api;
  root.NarrationModel = api;
})(typeof window === 'undefined' ? globalThis : window);

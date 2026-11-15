/* Lossless source blocks: navigation changes never rewrite the source manuscripts. */
(function (root) {
  'use strict';
  const normalize = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return (h >>> 0).toString(36);
  }
  function heading(line) {
    const clean = line.trim().replace(/^\*\*(.*?)\*\*$/, '$1');
    const md = clean.match(/^(#{1,6})\s+(.+)/);
    if (md) return { level: Math.min(md[1].length, 3), title: md[2] };
    if (clean.length > 160) return null;
    if (/^(?:PHẦN|QUYỂN|THIÊN)\s+(?:[IVXLCDM\d]+|THỨ\s+\S+)\b/iu.test(clean)) return { level: 1, title: clean };
    if (/^(?:PHẨM|CHƯƠNG)\s+(?:\d+|THỨ\s+\S+)/iu.test(clean)) return { level: 2, title: clean };
    if (/^\d+[.\-]\s*KINH\s+\S/u.test(clean)) return { level: 2, title: clean };
    if (/卷第[\d一二三四五六七八九十百千]+/u.test(clean) && clean.length < 85) return { level: 1, title: clean.replace(/―/g, '').trim() };
    return null;
  }
  function parse(raw) {
    // Keep line endings and every character, including blank lines, in raw blocks.
    const lines = raw.match(/[^\n]*\n|[^\n]+$/g) || [];
    const blocks = []; let buffer = ''; let start = 0; let offset = 0; let kind = 'text'; let head = null;
    const push = () => {
      if (!buffer) return;
      const text = buffer.trim();
      blocks.push({ id: 'b-' + start.toString(36) + '-' + hash(buffer), start, end: start + buffer.length, raw: buffer, text, kind, heading: head });
      buffer = ''; head = null; kind = 'text';
    };
    for (const line of lines) {
      const h = heading(line);
      const meta = /^\s*>/.test(line);
      const note = /^\s*\d+\.\s+(?:Bản Hán|Hán:|Pāli|Pali:|Skt\.|Tham chiếu|Nguyên văn|Nguyên bản|Chú thích|Đại [IVX]|sđd|Xem|Tương đương)/i.test(line);
      const running = /^\s*TRƯỜNG A[- ]HÀM(?: BIỆT DỊCH)?\s*\d*\s*$/u.test(line);
      if (h || meta || note || running) {
        push(); start = offset; kind = h ? 'heading' : meta ? 'metadata' : running ? 'running' : 'note'; head = h;
        buffer = line;
        if (h || meta || running) push();
      } else {
        if (!buffer) start = offset;
        buffer += line;
        if (!line.trim()) push();
      }
      offset += line.length;
    }
    push();
    // Lists at the front often repeat titles before the real chapter. Do not promote those to TOC.
    const signature = s => normalize(s).replace(/\s*\d+\s*$/, '').replace(/\s+/g, ' ').trim();
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (!b.heading || b.heading.level === 1) continue;
      const next = blocks.slice(i + 1, i + 4).find(x => x.text);
      if (next?.heading && blocks.slice(i + 1).some(x => x.heading && signature(x.heading.title) === signature(b.heading.title))) {
        b.kind = 'contents'; b.heading = null;
      }
    }
    return { version: hash(raw), blocks, length: raw.length };
  }
  function sections(doc, size = 6500, overrides = {}) {
    const result = []; let current = null; let length = 0; let chapter = 'Mở đầu'; let part = 0;
    doc.blocks.forEach((b, index) => {
      const edit = overrides[b.id] || {};
      const structural = !!b.heading && !edit.suppress;
      if (!current || structural || edit.split || (length >= size && b.kind === 'text' && !edit.join)) {
        if (structural) { chapter = edit.title || b.heading.title; part = 0; }
        part++;
        current = { id: b.id, start: index, end: index + 1, title: edit.title || (structural ? chapter : `${chapter} · Phần đọc ${part}`), level: edit.level || b.heading?.level || 3, structural, chapter, length: 0 };
        result.push(current); length = 0;
      }
      current.end = index + 1; length += b.raw.length; current.length += b.raw.length;
    });
    return result;
  }
  const api = { parse, sections, normalize, hash };
  if (typeof module !== 'undefined') module.exports = api;
  root.ReaderModel = api;
})(typeof window === 'undefined' ? globalThis : window);

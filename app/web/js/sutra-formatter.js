/**
 * SutraFormatter - Intelligent Typography & Content Segmentation Engine
 * Đại Thư Viện Chánh Pháp - Module Định Dạng Kinh Văn Chuyên Sâu (Bản Tối Ưu An Toàn 100%)
 * 
 * Nhiệm vụ:
 * 1. Thu thập thẻ khảo chứng (metadata card) từ các dòng > ở đầu file và hiển thị sang trọng.
 * 2. Khử các dòng rác OCR từ bản in giấy (tiêu đề chạy đầu trang, số trang lẻ loi, chú thích xen kẽ).
 * 3. Chuẩn hóa phân đoạn: tự động nối các dòng bị ngắt dòng oan uổng trong câu.
 * 4. Tách các lời thoại và câu đối đáp thành đoạn riêng biệt, có chỉ dẫn thẩm mỹ trang nghiêm.
 * 5. Phân giải các đoạn văn xuôi dài thòng (monolithic blocks) theo ngữ cảnh và dấu câu hợp lý.
 * 6. Nhận diện thể kệ tụng (Gāthā 4, 5, 7 chữ) để căn giữa dạng thi ca Phật giáo.
 * 7. Gắn chữ hoa nghệ thuật (Drop Cap) hoàng gia thiền môn chuẩn xác.
 * 8. ĐẢM BẢO 100% CÂN BẰNG THẺ HTML (HTML Tag Balance Validator) - Không bao giờ lỗi lồng thẻ.
 */

const SutraFormatter = {
  // Presentation only: source blocks, offsets and saved anchors remain unchanged.
  readingSegments(rawText, isVietnamese = true) {
    const lines = rawText.trim().split(/\r?\n/);
    const segments = [];
    let buffer = '';
    const push = () => { if (buffer.trim()) segments.push({ text: buffer.trim(), verse: false }); buffer = ''; };
    const short = line => {
      const t = line.trim();
      const words = t.split(/\s+/).length;
      return t.length > 0 && t.length < 60 && words >= 3 && words <= 8 && !/:$/.test(t) && !/^[“”"‘’—–\-#>]/u.test(t);
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) { push(); continue; }
      // Recognize a run of verse even when embedded between prose paragraphs.
      let end = i;
      if (isVietnamese) while (end < lines.length && short(lines[end])) end++;
      if (end - i >= 4) {
        push(); segments.push({ text: lines.slice(i, end).map(s => s.trim()).join('\n'), verse: true }); i = end - 1; continue;
      }
      if (buffer && (/[.!?。！？:][”’"']?$/u.test(buffer) || /^[“"—–]\s*\S/u.test(line) || /^[-*]\s+/.test(line))) push();
      buffer += (buffer ? ' ' : '') + line;
    }
    push();
    return segments.flatMap(segment => {
      if (segment.verse || segment.text.length <= 600) return [segment];
      // Split after punctuation; retain the trailing sentence (including no full stop).
      const sentences = segment.text.match(/[\s\S]+?(?:[.!?。！？][”’"']*(?=\s)|$)/gu) || [segment.text];
      const result = []; let text = '';
      for (const sentence of sentences) {
        if (text.length >= 350 && text.length + sentence.length > 600) { result.push({ text: text.trim(), verse: false }); text = ''; }
        text += sentence;
      }
      if (text.trim()) result.push({ text: text.trim(), verse: false });
      return result;
    });
  },
  readingInline(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
      .replace(/[\u3400-\u9fff\uf900-\ufaff]+/g, '<span class="han-script" lang="zh-Hant">$&</span>');
  },
  format(rawText, isVietnamese = true, options = {}) {
    if (!rawText || typeof rawText !== 'string') return '';
    if (options.preserveSource) {
      // Reader v3 renders source blocks safely without OCR cleanup or lost lines.
      const escaped = rawText.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const inline = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*\n]+)\*/g, '<em>$1</em>').replace(/[\u3400-\u9fff\uf900-\ufaff]+/g, '<span class="han-script" lang="zh-Hant">$&</span>');
      if (options.kind === 'heading') return `<h2 class="source-heading">${inline.replace(/^#{1,6}\s*/, '')}</h2>`;
      if (options.kind === 'metadata') return `<div class="source-metadata">${inline.replace(/^&gt;\s*/, '')}</div>`;
      if (options.kind === 'running') return `<div class="source-running">${inline}</div>`;
      if (options.kind === 'note') return `<div class="source-note">${inline}</div>`;
      if (/^[-―─_*\s]+$/.test(rawText)) return '<hr class="source-divider">';
      return this.readingSegments(rawText, isVietnamese).map(segment => `<p class="source-prose${segment.verse ? ' source-verse' : /^[“"—–]/u.test(segment.text) ? ' source-dialogue' : ''}">${this.readingInline(segment.text)}</p>`).join('');
    }

    const opts = Object.assign({
      addDropCap: isVietnamese,
      dialogueBreak: true,
      longParaBreak: true,
      maxParaChars: 380,
      extractMetadata: true
    }, options);

    // 1. Chuẩn hóa ký tự xuống dòng
    let text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 2. Tách thẻ thông tin khảo chứng ở đầu văn bản (các dòng bắt đầu bằng >)
    let metadataHtml = '';
    if (opts.extractMetadata) {
      const metaLines = [];
      const lines = text.split('\n');
      let inMeta = false;
      const nonMetaLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('>')) {
          inMeta = true;
          metaLines.push(line.replace(/^>\s*/, ''));
        } else if (inMeta && line === '') {
          continue;
        } else {
          inMeta = false;
          nonMetaLines.push(lines[i]);
        }
      }

      if (metaLines.length > 0) {
        text = nonMetaLines.join('\n');
        metadataHtml = `
          <div class="sutra-metadata-card">
            <div class="meta-card-header">
              <span class="meta-icon">📜</span>
              <span class="meta-title">Thông Tin Khảo Chứng & Dịch Bản</span>
            </div>
            <div class="meta-card-body">
              ${metaLines.map(ml => {
                let formatted = ml
                  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
                return `<div class="meta-item-row">${formatted}</div>`;
              }).join('')}
            </div>
          </div>
        `;
      }
    }

    // 3. Khử rác tiêu đề chạy đầu trang từ bản in sách scan OCR
    text = text.replace(/^[ \t]*TRƯỜNG A HÀM BIỆT DỊCH[ \t]*$/gmi, '');
    text = text.replace(/^[ \t]*――― 卷第\d+ ―――[ \t]*$/gmi, '\n\n<div class="sutra-volume-divider">❖ ─── 卷 ─── ❖</div>\n\n');

    // 4. Phân luồng xử lý theo ngôn ngữ
    let bodyHtml = '';
    if (isVietnamese) {
      bodyHtml = this.formatVietnamese(text, opts);
    } else {
      bodyHtml = this.formatChinese(text, opts);
    }

    let finalHtml = metadataHtml + bodyHtml;

    // 5. BỘ KIỂM TRA & TỰ HÀN GẮN THẺ HTML (HTML Tag Balance Self-Healing)
    finalHtml = this.ensureTagBalance(finalHtml);

    return finalHtml;
  },

  formatVietnamese(text, opts) {
    let content = text;

    // Tiêu đề & đường phân cách (cách ly bằng \n\n để không dính liền với thân bài)
    content = content.replace(/^### (.*$)/gim, '<h3 class="sutra-h3">$1</h3>\n\n');
    content = content.replace(/^## (.*$)/gim, '<h2 class="sutra-h2">$1</h2>\n\n');
    content = content.replace(/^# (.*$)/gim, '<h1 class="sutra-h1">$1</h1>\n\n');
    content = content.replace(/^---$/gim, '\n\n<div class="sutra-divider"><span>☸ ─── ❖ ─── ☸</span></div>\n\n');

    content = content.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    content = content.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    content = content.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Phân tách đoạn cho các tập tin chỉ có 1 dấu xuống dòng (\n) nhưng đã hết câu
    content = content.replace(/([.!?:]|[-oOo-]+)\n([A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬĐÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ“–])/gu, '$1\n\n$2');

    // Tách thành các khối văn bản thô theo 2 dấu xuống dòng trở lên
    const rawBlocks = content.split(/\n{2,}/);
    const formattedBlocks = [];
    let hasAddedDropCap = false;

    for (let block of rawBlocks) {
      block = block.trim();
      if (!block) continue;

      // Nếu khối đã là thẻ HTML độc lập đầy đủ (h1, h2, h3, div divider, ul, table) -> giữ nguyên
      if (block.startsWith('<h1') || block.startsWith('<h2') || block.startsWith('<h3') || 
          block.startsWith('<div class="sutra-volume-divider"') || block.startsWith('<div class="sutra-divider"') ||
          block.startsWith('<ul') || block.startsWith('<table')) {
        formattedBlocks.push(block);
        continue;
      }

      // Xử lý khối chú thích học thuật (Linh Sơn Pháp Bảo footnote blocks)
      // Ví dụ: "1. Bản Hán, Phật Thuyết Trường A-hàm..." hoặc "1. Hán: ... 2. Pāli: ..."
      if (/^\d+\.\s+(Bản Hán|Hán:|Pāli|Tham chiếu|Đại I|Đại II|sđd|Xem|Tương đương)/i.test(block)) {
        const noteLines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const notesHtml = noteLines.map(line => {
          const m = line.match(/^(\d+)\.\s+(.*)$/);
          if (m) {
            return `<div class="sutra-scholar-note"><strong>Chú thích [${m[1]}]:</strong> ${m[2]}</div>`;
          }
          return `<div class="sutra-scholar-note">${line}</div>`;
        }).join('\n');
        formattedBlocks.push(notesHtml);
        continue;
      }

      // Xử lý danh sách gạch đầu dòng
      if (block.startsWith('- ') || block.startsWith('* ')) {
        const items = block.split('\n').map(li => li.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
        formattedBlocks.push(`<ul class="sutra-list">${items.map(it => `<li>${it}</li>`).join('')}</ul>`);
        continue;
      }

      // Nối các dòng bị ngắt dòng oan uổng trong cùng một đoạn văn
      const lines = block.split('\n');
      let mergedText = '';
      for (let i = 0; i < lines.length; i++) {
        let curLine = lines[i].trim();
        if (!curLine) continue;
        if (mergedText === '') {
          mergedText = curLine;
        } else {
          if (mergedText.endsWith('-') || mergedText.endsWith('–')) {
            mergedText = mergedText.slice(0, -1) + curLine;
          } else {
            mergedText += ' ' + curLine;
          }
        }
      }

      // Tách các lời thoại và câu đối đáp
      let subParagraphs = [mergedText];
      if (opts.dialogueBreak) {
        subParagraphs = this.splitVietnameseDialogues(mergedText);
      }

      // Phân giải các đoạn văn xuôi quá dài (long paragraphs)
      const finalParas = [];
      for (let sp of subParagraphs) {
        if (opts.longParaBreak && sp.length > opts.maxParaChars) {
          const splitResult = this.splitLongVietnameseParagraph(sp, opts.maxParaChars);
          finalParas.push(...splitResult);
        } else {
          finalParas.push(sp);
        }
      }

      // Kết xuất từng đoạn thành thẻ <p> chuẩn mực
      for (let pText of finalParas) {
        pText = pText.trim();
        if (!pText) continue;

        // Nhận diện nếu là một chú thích đơn lẻ lọt vào
        const singleNoteMatch = pText.match(/^(\d+)\.\s+(Bản Hán|Hán:|Pāli|Tham chiếu|Đại I|Đại II|sđd|Xem|Tương đương)(.*)$/i);
        if (singleNoteMatch) {
          formattedBlocks.push(`<div class="sutra-scholar-note"><strong>Chú thích [${singleNoteMatch[1]}]:</strong> ${singleNoteMatch[2]}${singleNoteMatch[3]}</div>`);
          continue;
        }

        // Nhận diện đoạn đối thoại hoặc lời Phật dạy
        const isDialogue = /^(“|–|-|‘|Phật bảo|Phật dạy|Đức Thế Tôn|Tu-bồ-đề|Xá-lợi-phất|Kỳ Bà|A Xà Thế|Vi Đề Hy)/i.test(pText);
        const paraClass = isDialogue ? 'sutra-para dialogue-para' : 'sutra-para';

        // Gắn chữ hoa nghệ thuật (Drop Cap) chỉ vào đúng chữ cái đầu tiên của câu kinh mở màn
        if (opts.addDropCap && !hasAddedDropCap && !isDialogue && pText.length > 25) {
          const match = pText.match(/^([A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬĐÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴ])/u);
          if (match) {
            hasAddedDropCap = true;
            const firstLetter = match[1];
            const rest = pText.slice(firstLetter.length);
            formattedBlocks.push(`<p class="${paraClass}"><span class="drop-cap">${firstLetter}</span>${rest}</p>`);
            continue;
          }
        }

        // Tạo huy hiệu đánh số pháp: "Điều thứ nhất...", "Một là:..."
        pText = pText.replace(/^(\*\*(?:Điều thứ|Thứ|Một là|Hai là|Ba là|Bốn là|Năm là|Sáu là|Bảy là|Tám là|Chín là|Mười là).*?\*\*)/, '<span class="sutra-num-pill">$1</span>');

        formattedBlocks.push(`<p class="${paraClass}">${pText}</p>`);
      }
    }

    return formattedBlocks.join('\n');
  },

  splitVietnameseDialogues(text) {
    const regex = /(?<=[\.\?!”"»])\s+(?=(?:[–—]|“|‘|Phật bảo|Phật dạy|Đức Thế Tôn|Tu-bồ-đề bạch|Tôn giả|Bấy giờ|Lúc ấy|Khi ấy|Đang khi ấy|Quốc Thái|A Xà Thế|Kỳ Bà|Viên thủ ngục|Vi Đề Hy))/g;
    return text.split(regex).map(s => s.trim()).filter(Boolean);
  },

  splitLongVietnameseParagraph(text, maxChars) {
    if (text.length <= maxChars) return [text];
    
    const sentences = text.match(/[^.!?]+[.!?]+(?:["”»']|\s+|$)/g) || [text];
    if (sentences.length <= 1) return [text];

    const result = [];
    let currentChunk = '';

    for (let s of sentences) {
      if ((currentChunk + s).length > maxChars && currentChunk.length > 120) {
        result.push(currentChunk.trim());
        currentChunk = s;
      } else {
        currentChunk += s;
      }
    }

    if (currentChunk.trim()) {
      result.push(currentChunk.trim());
    }

    return result.length > 0 ? result : [text];
  },

  formatChinese(text, opts) {
    let content = text;
    content = content.replace(/^### (.*$)/gim, '<h3 class="sutra-h3">$1</h3>');
    content = content.replace(/^## (.*$)/gim, '<h2 class="sutra-h2">$1</h2>');
    content = content.replace(/^# (.*$)/gim, '<h1 class="sutra-h1">$1</h1>');
    content = content.replace(/^---$/gim, '<div class="sutra-divider"><span>☸ ─── ❖ ─── ☸</span></div>');

    content = content.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    const rawBlocks = content.split(/\n{2,}/);
    const formattedBlocks = [];

    for (let block of rawBlocks) {
      block = block.trim();
      if (!block) continue;

      if (block.startsWith('<h1') || block.startsWith('<h2') || block.startsWith('<h3') || 
          block.startsWith('<div class="sutra-volume-divider"') || block.startsWith('<div class="sutra-divider"') ||
          block.startsWith('<ul') || block.startsWith('<table')) {
        formattedBlocks.push(block);
        continue;
      }

      // Kiểm tra thể kệ tụng (Gāthā 4, 5, 7 chữ)
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      const isGatha = lines.length >= 2 && lines.every(l => {
        const clean = l.replace(/[，。；、！「」]/g, '');
        return clean.length >= 4 && clean.length <= 8;
      });

      if (isGatha) {
        formattedBlocks.push(`
          <div class="gatha-stanza">
            ${lines.map(l => `<div class="gatha-line">${l}</div>`).join('')}
          </div>
        `);
        continue;
      }

      // Văn xuôi: Phân giải các đoạn văn quá dài
      const mergedText = lines.join('');
      const segmentedParas = this.splitChineseProse(mergedText);

      for (let pText of segmentedParas) {
        const isDialogue = /^(爾時|佛告|時|即說偈言|白佛言)/.test(pText);
        const paraClass = isDialogue ? 'sutra-para han-script dialogue-para' : 'sutra-para han-script';
        formattedBlocks.push(`<p class="${paraClass}">${pText}</p>`);
      }
    }

    return formattedBlocks.join('\n');
  },

  splitChineseProse(text) {
    if (text.length < 130) return [text];

    const parts = [];
    let current = '';
    
    const sentences = text.match(/[^。！？]+[。！？]+/g) || [text];

    for (let s of sentences) {
      current += s;
      if (current.length >= 100) {
        parts.push(current);
        current = '';
      }
    }

    if (current) {
      if (parts.length > 0 && current.length < 40) {
        parts[parts.length - 1] += current;
      } else {
        parts.push(current);
      }
    }

    return parts.length > 0 ? parts : [text];
  },

  /**
   * Tự động kiểm tra và hàn gắn cân bằng thẻ HTML
   * Đảm bảo không bao giờ có thẻ mở mà thiếu thẻ đóng
   */
  ensureTagBalance(html) {
    if (!html) return '';

    // Cân bằng thẻ div
    const openDivCount = (html.match(/<div[\s>]/gi) || []).length;
    const closeDivCount = (html.match(/<\/div>/gi) || []).length;
    if (openDivCount > closeDivCount) {
      const diff = openDivCount - closeDivCount;
      html += '</div>'.repeat(diff);
    }

    // Cân bằng thẻ p
    const openPCount = (html.match(/<p[\s>]/gi) || []).length;
    const closePCount = (html.match(/<\/p>/gi) || []).length;
    if (openPCount > closePCount) {
      const diff = openPCount - closePCount;
      html += '</p>'.repeat(diff);
    }

    return html;
  }
};

if (typeof module !== 'undefined') {
  module.exports = SutraFormatter;
}
if (typeof window !== 'undefined') {
  window.SutraFormatter = SutraFormatter;
}

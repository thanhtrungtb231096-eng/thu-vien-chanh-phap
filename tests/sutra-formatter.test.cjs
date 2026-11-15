const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const M = require('../app/web/js/reader-model.js');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../app/web/js/sutra-formatter.js'), 'utf8') + '\nglobalThis.formatter = SutraFormatter;', context);
const F = context.formatter;
const normalize = s => s.replace(/\s+/g, ' ').trim();
const prose = 'Tôi nghe như vầy:\nMột thời Phật ở vườn Kỳ-đà, cùng\nvới chúng Tỳ-kheo.\nBấy giờ, các Tỳ-kheo cùng nhau bàn luận.\n“Này các Hiền giả!”';
const paragraphs = F.readingSegments(prose);
assert.equal(paragraphs.length, 4);
assert.equal(normalize(paragraphs.map(p => p.text).join(' ')), normalize(prose));
assert.ok(paragraphs[1].text.includes('cùng với'));
const mixed = 'Bấy giờ Phật nói bài tụng:\nTỳ-kheo họp pháp đường\nGiảng luận pháp Hiền thánh.\nNhư Lai từ am vắng\nNghe rõ bằng thiên nhĩ.\nPhật lại bảo các Tỳ-kheo rằng: hãy lắng nghe lời kinh.';
const segments = F.readingSegments(mixed);
assert.equal(segments.filter(p => p.verse).length, 1);
assert.equal(segments.length, 3);
const long = 'Một câu kinh được giữ nguyên vẹn. '.repeat(70) + 'Câu cuối chưa có dấu chấm';
assert.ok(F.readingSegments(long).length > 2);
assert.equal(normalize(F.readingSegments(long).map(p => p.text).join(' ')), normalize(long));
const html = F.format('<script>alert("x")</script> & lời kinh.\n**Đoạn kế tiếp**.', true, { preserveSource: true, kind: 'text' });
assert.ok(!html.includes('<script>'));
assert.ok(html.includes('&lt;script&gt;'));
assert.ok(html.includes('<strong>Đoạn kế tiếp</strong>'));
assert.ok(html.includes('<p class="source-prose'));
let blocks = 0, displayParagraphs = 0;
const root = path.resolve(__dirname, '../data/sources');
for (const relative of [
  'Dai_Tang_Kinh_Han/01_A_Ham/T01n0001_viet.md',
  'Dai_Tang_Kinh_Han/01_A_Ham/T01n0001.md',
  'Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0251_viet.md',
  'Dai_thua/01_Khe_Kinh/02_Duoc_Su/Nguyen_van/Duoc_Su_viet.md'
]) {
  const raw = fs.readFileSync(path.join(root, relative), 'utf8');
  const doc = M.parse(raw);
  for (const b of doc.blocks.filter(b => b.kind === 'text')) {
    const parts = F.readingSegments(b.raw, relative.includes('_viet'));
    assert.equal(normalize(parts.map(p => p.text).join(' ')), normalize(b.raw), `No character loss in ${relative}:${b.start}`);
    displayParagraphs += parts.length;
    blocks++;
  }
  assert.equal(doc.blocks.map(b => b.raw).join(''), raw, 'Formatting leaves source anchors unchanged');
}
console.log(`PASS: safe HTML, OCR lines, dialogue, mixed verse, long prose, trailing sentence; ${blocks} source blocks → ${displayParagraphs} display paragraphs without character loss.`);

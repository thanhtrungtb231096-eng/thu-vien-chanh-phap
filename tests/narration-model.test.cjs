const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const M = require('../app/web/js/reader-model.js');
const N = require('../app/web/js/narration-model.js');
const root = path.resolve(__dirname, '../data/sources');
const normalized = text => text.replace(/\s+/g, ' ').trim();
const source = relative => M.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const seven = source('Dai_Tang_Kinh_Han/01_A_Ham/T01n0002_viet.md');
const queue = N.build(seven);
const reply = queue.find(q => q.text.startsWith('Bí-sô thưa: “Chúng con suy nghĩ:'));
assert.ok(reply, 'Find the actual dialogue from the reported screenshot');
assert.ok(reply.text.endsWith('nhưng không ai biết được.”'), reply.text);
assert.equal(reply.kind, 'dialogue');
assert.equal(reply.blocks.length, 2, 'Rejoin the two source blocks across a printed-page footnote');
assert.ok(!queue.some(q => q.text.startsWith('ai biết được.')), 'No dangling end of the answer');
assert.equal(queue[queue.indexOf(reply) + 1].text, 'Phật hỏi các Bí sô: “Các Thầy muốn biết không?”');
assert.equal(queue[queue.indexOf(reply) + 2].text, 'Các Bí sô thưa: “Nay đã đúng lúc, ngưỡng mong Thế Tôn dạy cho chúng con.”');
for (const s of reply.sources) assert.equal(N.locate(queue, s.block, s.offset), queue.indexOf(reply));
assert.ok(queue.some(q => q.kind === 'verse' && q.text.includes('\n')), 'Preserve real verse lines');

const longSentence = 'Phật dạy: “' + 'Hãy lắng nghe và suy ngẫm lời kinh này, '.repeat(20) + 'để hiểu rõ.”';
assert.ok(longSentence.length > 420 && longSentence.length < 1800);
assert.deepEqual(N.chunks(longSentence), [longSentence], 'Do not cut a complete answer at the old 420-character limit');
assert.deepEqual(N.chunks('Phật hỏi: “Có hiểu không?” Các vị thưa: “Chúng con đã hiểu.”'), ['Phật hỏi: “Có hiểu không?”', 'Các vị thưa: “Chúng con đã hiểu.”']);
assert.deepEqual(N.chunks('HT. Thích Minh Châu đọc ở tốc độ 1.25 lần.'), ['HT. Thích Minh Châu đọc ở tốc độ 1.25 lần.']);
const unpunctuated = 'lời kinh '.repeat(500).trim();
assert.ok(N.chunks(unpunctuated).every(x => x.length <= N.LIMIT));
assert.equal(normalized(N.chunks(unpunctuated).join(' ')), unpunctuated);
const clauses = ('Một câu rất dài gồm nhiều mệnh đề, '.repeat(100)) + 'và vẫn giữ đủ nội dung.';
assert.ok(N.chunks(clauses).slice(0, -1).every(x => x.endsWith(',')), 'Long sentences prefer clause boundaries to word cuts');

for (const relative of [
  'Dai_Tang_Kinh_Han/01_A_Ham/T01n0002_viet.md',
  'Dai_Tang_Kinh_Han/01_A_Ham/T01n0001_viet.md',
  'Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0251_viet.md',
  'Dai_thua/01_Khe_Kinh/02_Duoc_Su/Nguyen_van/Duoc_Su_viet.md'
]) {
  const doc = source(relative), original = JSON.stringify(doc), segments = N.build(doc);
  const retained = doc.blocks.filter(b => !['metadata', 'note', 'contents', 'running'].includes(b.kind)).map(b => N.plain(b.raw)).filter(t => /[a-zA-ZÀ-ỹ]/u.test(t)).join(' ');
  assert.equal(normalized(segments.map(s => s.text).join(' ')), normalized(retained), 'No omitted or duplicated narrated words: ' + relative);
  assert.equal(JSON.stringify(doc), original, 'Source blocks and anchors are not edited');
  assert.ok(segments.every(s => s.text.length <= N.LIMIT && s.sources.length && s.block));
  assert.ok(segments.filter(s => s.kind === 'prose').every(s => s.pauseBefore === 0 || s.pauseBefore === 400));
  console.log(`PASS: ${relative}: ${segments.length} semantic segments; lossless, mapped to source, within TTS limit`);
}
console.log('PASS: reported dialogue, inline turns, long answers, verse, abbreviations, decimal numbers and source anchors');

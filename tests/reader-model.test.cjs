const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const M = require('../app/web/js/reader-model.js');
const root = path.resolve(__dirname, '../data/sources');
const fixture = '# Kinh\r\n\r\nPHẦN I\r\n1. KINH ĐẠI BẢN\r\n2. KINH DU HÀNH\r\n\r\n1. KINH ĐẠI BẢN 1\r\nTôi nghe như vầy.\r\n\r\n1. Bản Hán: chú thích.\r\n\r\nLời kinh tiếp theo.\r\n';
function integrity(raw) {
  const doc = M.parse(raw);
  assert.equal(doc.blocks.map(b=>b.raw).join(''), raw, 'Source must round trip byte-for-byte as JS text');
  assert.equal(new Set(doc.blocks.map(b=>b.id)).size,doc.blocks.length);
  for (const size of [3000,6500,12000]) {
    const sections=M.sections(doc,size);
    assert.equal(sections.flatMap(s=>doc.blocks.slice(s.start,s.end)).map(b=>b.raw).join(''),raw);
  }
  return doc;
}
const fixtureDoc=integrity(fixture);
assert.equal(fixtureDoc.blocks.filter(b=>b.heading && b.heading.title.includes('ĐẠI BẢN')).length,1);
assert.equal(fixtureDoc.blocks.find(b=>b.text.startsWith('1. Bản Hán')).kind,'note');
const editId=fixtureDoc.blocks.find(b=>b.text==='Lời kinh tiếp theo.').id;
const edits={[editId]:{split:true,title:'Mục cá nhân',level:2}};
const custom=M.sections(fixtureDoc,6500,edits);
assert.ok(custom.some(s=>s.title==='Mục cá nhân'));
assert.equal(custom.flatMap(s=>fixtureDoc.blocks.slice(s.start,s.end)).map(b=>b.raw).join(''),fixture);
assert.equal(M.normalize('Đại BÁT NHÃ'),'dai bat nha');
for(const name of [
  'Dai_Tang_Kinh_Han/01_A_Ham/T01n0001_viet.md',
  'Dai_Tang_Kinh_Han/01_A_Ham/T01n0001.md',
  'Dai_Tang_Kinh_Han/03_Bat_Nha/T08n0251_viet.md',
  'Dai_thua/01_Khe_Kinh/02_Duoc_Su/Nguyen_van/Duoc_Su_viet.md'
]) {
  const file=path.join(root,name); if(!fs.existsSync(file)) continue;
  const raw=fs.readFileSync(file,'utf8');const started=performance.now();const doc=integrity(raw);
  console.log(JSON.stringify({file:name,chars:raw.length,blocks:doc.blocks.length,sections:M.sections(doc).length,ms:Math.round(performance.now()-started)}));
}
console.log('Reader model integrity checks passed.');

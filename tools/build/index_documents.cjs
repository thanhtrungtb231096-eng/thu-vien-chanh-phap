/* Reuse the reader's exact parser: search links must retain the same block IDs. */
const fs = require('node:fs');
const readline = require('node:readline');
const model = require(require('node:path').join(require('./project_paths.cjs').web, 'js/reader-model.js'));
const input = readline.createInterface({input: process.stdin, crlfDelay: Infinity});
input.on('line', line => {
  const entry = JSON.parse(line);
  try {
    if (entry.missing) {
      process.stdout.write(JSON.stringify({...entry, absolute: undefined, version: '', blocks: [], length: 0, replacementCharacters: 0, suspiciousGlyphs: 0})+'\n');
      return;
    }
    const raw = fs.readFileSync(entry.absolute, 'utf8');
    const doc = model.parse(raw);
    process.stdout.write(JSON.stringify({...entry, absolute: undefined, version: doc.version,
      blocks: doc.blocks.filter(b => b.text).map(b => ({id:b.id, text:b.text, kind:b.kind, heading:b.heading})),
      length: raw.length, replacementCharacters: (raw.match(/\ufffd/g)||[]).length,
      suspiciousGlyphs: (raw.match(/[\ue000-\uf8ff]/g)||[]).length}) + '\n');
  } catch (error) { process.stderr.write(entry.key + ': ' + error.message + '\n'); process.exitCode = 1; }
});

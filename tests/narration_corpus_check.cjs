/* Audit every indexed Vietnamese edition using the same parser as the player. */
const fs = require('node:fs'), path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const Reader = require('../app/web/js/reader-model.js');
const Narration = require('../app/web/js/narration-model.js');
const query = String.raw`import json,sqlite3,sys
from pathlib import Path
sys.path.insert(0,str(Path.cwd()/'app'))
from project_paths import STATE,public_path
with sqlite3.connect((STATE/'search.sqlite3').as_uri()+'?mode=ro',uri=True) as db:
    print(json.dumps([{'key':key,'path':str(public_path(json.loads(meta)['source']))} for key,meta in db.execute("SELECT book_key,meta FROM documents WHERE mode='viet'")]))`;
const input = spawnSync(process.env.PYTHON || 'python', ['-B', '-X', 'utf8', '-c', query], {cwd:root, encoding:'utf8',maxBuffer:8*1024*1024});
if (input.status !== 0) throw new Error(input.stderr);
const books = JSON.parse(input.stdout), errors = [], groups = {};
let passages = 0, maxLength = 0;
for (const [i,book] of books.entries()) {
  try {
    const doc = Reader.parse(fs.readFileSync(book.path, 'utf8')), queue = Narration.build(doc);
    if (!queue.length) errors.push({key:book.key,error:'no narratable passages'});
    for (const item of queue) {
      passages++; maxLength=Math.max(maxLength,item.text.length);
      if (!item.text.trim() || item.text.length>Narration.LIMIT || !item.sources.length || !item.block) {
        errors.push({key:book.key,error:'invalid passage',characters:item.text.length});break;
      }
    }
    const group=book.key.split(':')[0];groups[group]=(groups[group]||0)+1;
  } catch(error) {errors.push({key:book.key,error:error.message});}
  if ((i+1)%500===0) console.log(`Checked ${i+1}/${books.length} editions`);
}
const result={result:errors.length?'failed':'passed',editions:books.length,passages,maxLength,groups,errors};
const out=path.join(root,'tests/artifacts/audio-fix-20261111');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'corpus.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));process.exitCode=errors.length?1:0;

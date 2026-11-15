/* Local Tesseract worker; source images and text never leave this computer. */
const fs=require('node:fs'),path=require('node:path');
const {dependencies,cache}=require('./project_paths.cjs');
const {createWorker}=require(path.join(dependencies,'ocr/node_modules/tesseract.js'));
(async()=>{
  const manifest=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const workers=await Promise.all([0,1].map(()=>createWorker('vie-best',1,{langPath:path.join(cache,'ocr-models'),cachePath:path.join(cache,'ocr-models'),gzip:false, corePath:path.join(dependencies,'ocr/node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js')})));
  try{
    for(const entry of manifest){
      if(fs.existsSync(entry.output))continue;
      const results=await Promise.all(entry.images.map((file,i)=>workers[i%workers.length].recognize(file)));
      const value={id:entry.id,page:entry.page,text:results.map(r=>r.data.text.trim()).join('\n\n'),confidence:results.map(r=>r.data.confidence)};
      fs.writeFileSync(entry.output,JSON.stringify(value));
      process.stdout.write(`${entry.id}: ${entry.page}\n`);
    }
  }finally{await Promise.all(workers.map(w=>w.terminate()));}
})().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});

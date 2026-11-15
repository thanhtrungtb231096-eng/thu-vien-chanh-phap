/* Only bibliographic headers changed. Prove the remaining raw text is identical. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),model=require(path.join(root,'app/web/js/reader-model.js'));
const backupOption=process.argv.indexOf('--backup-dir');
if(backupOption<0 || !process.argv[backupOption+1])throw new Error('Pass --backup-dir with the external metadata backup directory. Published migrations are already in data/generated/edition-migrations.');
const backup=path.resolve(process.argv[backupOption+1]),relativeBackup=path.relative(root,backup);
if(!relativeBackup || (!relativeBackup.startsWith('..'+path.sep) && relativeBackup!=='..' && !path.isAbsolute(relativeBackup)))throw new Error('Metadata backups must be outside the project directory.');
const dest=path.join(root,'data/generated/edition-migrations');fs.mkdirSync(dest,{recursive:true});
for(const id of ['ep-b0448adb54d8','ep-62a15f61582c','ep-247bffa03610']){
  const old=model.parse(fs.readFileSync(path.join(backup,id+'.md'),'utf8'));
  const current=model.parse(fs.readFileSync(path.join(root,'data/generated/dai-tang-kinh/text',id+'.md'),'utf8'));
  if(old.blocks.slice(1).map(b=>b.raw).join('')!==current.blocks.slice(1).map(b=>b.raw).join(''))throw new Error('Source body changed: '+id);
  fs.writeFileSync(path.join(dest,id+'.json'),JSON.stringify({from:old.version,to:current.version,oldRoot:old.blocks[0].id,newRoot:current.blocks[0].id,delta:current.blocks[0].end-old.blocks[0].end}));
}
console.log('Verified body equality and published three header-only anchor migrations.');

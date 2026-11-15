(() => {
  'use strict';
  const files={milinda:'milinda-panha.js',practical:'practical-qa.js',glossary:'pali-glossary.js'};
  const pending=new Map(),loaded=new Set();
  let manifest;
  async function url(path){
    manifest ||= fetch('data/library-version.json').then(r=>{if(!r.ok)throw new Error('Chưa xác định được phiên bản công cụ. Kiểm tra kết nối rồi thử lại.');return r.json();}).catch(e=>{manifest=null;throw e;});
    const version=await manifest,hash=version.assetHashes[path];
    if(!hash)throw new Error('Công cụ chưa có trong phiên bản thư viện này.');
    return path+'?v='+hash.slice(0,12);
  }
  function ready(tab){return !files[tab]||loaded.has(tab);}
  function ensure(tab){
    if(ready(tab))return Promise.resolve();
    if(pending.has(tab))return pending.get(tab);
    const task=url('js/'+files[tab]).then(src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>{loaded.add(tab);resolve();};s.onerror=()=>{s.remove();reject(new Error('Chưa tải được công cụ. Kiểm tra kết nối rồi mở lại.'));};document.head.append(s);})).catch(e=>{pending.delete(tab);throw e;});
    pending.set(tab,task);return task;
  }
  function hanFont(){if(document.getElementById('han-reading-font'))return;const link=document.createElement('link');link.id='han-reading-font';link.rel='stylesheet';document.head.append(link);url('css/han-font.css').then(href=>{link.href=href;}).catch(()=>link.remove());}
  window.LibraryAssets={ready,ensure,hanFont};
})();

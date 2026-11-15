(() => {
  'use strict';
  const S=LibraryStore;
  const examples={'Pāḷi':'Pa li','Buddha':'Bút đa','Dhamma':'Đam ma','Saṅgha':'Xăng ga'};
  function prepare(text) {
    const prefs=S.read('pronunciation',{enabled:false,terms:examples});
    if(!prefs.enabled)return text;
    const terms=Object.entries(prefs.terms||{}).filter(([a,b])=>a&&typeof b==='string').sort((a,b)=>b[0].length-a[0].length);
    if(!terms.length)return text;
    const escape=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const map=new Map(terms.map(([a,b])=>[a.toLocaleLowerCase('vi'),b]));
    const pattern=new RegExp('(?<![\\p{L}\\p{N}])('+terms.map(([a])=>escape(a)).join('|')+')(?![\\p{L}\\p{N}])','giu');
    return text.replace(pattern,value=>map.get(value.toLocaleLowerCase('vi'))||value);
  }
  function apply(doc,key,mode) {
    if(!S.read('use-corrections',false))return doc;
    const saved=S.read('corrections:'+key+':'+mode,{});
    if(saved.version!==doc.version)return doc;
    return {...doc,blocks:doc.blocks.map(b=>saved.items?.[b.id]?{...b,originalRaw:b.raw,raw:saved.items[b.id].text,text:saved.items[b.id].text.trim()}:b)};
  }
  function save(doc,key,mode,block,text) {
    if(!text.trim()||text.length>200000)throw new Error('Nội dung hiệu đính rỗng hoặc quá dài.');
    const existing=S.read('corrections:'+key+':'+mode,{});
    if(existing.version&&existing.version!==doc.version)throw new Error('Bản nguồn đã đổi. Xuất hiệu đính cũ trước khi tạo bản mới.');
    const original=block.originalRaw??block.raw;
    const value={version:doc.version,items:{...existing.items,[block.id]:{text,original,updatedAt:Date.now()}},updatedAt:Date.now()};
    if(!S.write('corrections:'+key+':'+mode,value))throw new Error('Thiết bị không lưu được hiệu đính.');
    return value;
  }
  window.LibraryPronunciation={prepare,examples};
  async function migrate(doc,key,mode){
    const ids=['ep-b0448adb54d8','ep-62a15f61582c','ep-247bffa03610'];
    if(!ids.some(id=>key==='ebooks:'+id)||S.read('migration:'+key+':'+mode,'')===doc.version)return;
    let map;try{const r=await fetch('data/edition-migrations/'+key.split(':')[1]+'.json');if(!r.ok)return;map=await r.json();}catch{return;}
    if(doc.version!==map.to)return;
    const valid=new Set(doc.blocks.map(b=>b.id));
    const id=value=>{if(typeof value!=='string')return value;if(value===map.oldRoot)return map.newRoot;const m=value.match(/^b-([0-9a-z]+)-([0-9a-z]+)$/);if(!m||valid.has(value))return value;const next='b-'+(parseInt(m[1],36)+map.delta).toString(36)+'-'+m[2];return valid.has(next)?next:value;};
    const convert=value=>Array.isArray(value)?value.map(convert):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[id(k),k==='version'&&v===map.from?map.to:typeof v==='string'?id(v):convert(v)])):value;
    for(const name of ['position:'+key+':'+mode,'listen:'+key,'marks:'+key,'outline:'+key+':'+mode,'corrections:'+key+':'+mode]){const prior=S.read(name,null);if(prior){if(!S.read('before-header-migration:'+name,null)&&!S.write('before-header-migration:'+name,prior))return;if(!S.write(name,convert(prior)))return;}}
    S.write('migration:'+key+':'+mode,doc.version);
  }
  window.LibraryEditions={apply,save,migrate};
})();

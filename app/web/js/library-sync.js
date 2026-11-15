/* Item-level last-write-wins records, including deletion markers for merged lists. */
(() => {
  'use strict';
  const AUTH='chanhphap-sync-auth', META='chanhphap-sync-records', DEVICE='chanhphap-device';
  let device, busy=false, applying=false, timer, dirty=false;
  try{device=localStorage.getItem(DEVICE);}catch{}
  if(!device) { device=[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,'0')).join(''); try{localStorage.setItem(DEVICE,device);}catch{} }
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}};
  let records=read(META,{});
  const auth=()=>read(AUTH,null);
  const identity=x=>String(x?.id || x?.key || JSON.stringify(x));
  const allowed=k=>/^(cp3:|dhamma_|reader_)/.test(k) && !/^cp3:(offline-packs|query:|sync-last|device-name|sync-conflicts|before-header-migration:|migration:)/.test(k);
  const newer=(a,b)=>!b||a.stamp>b.stamp||(a.stamp===b.stamp&&a.device>b.device);
  function record(key,id,value,deleted=false) {
    const rid=JSON.stringify([key,id]), old=records[rid];
    if(old && old.deleted===deleted && JSON.stringify(old.value)===JSON.stringify(value)) return;
    records[rid]={key,id,value,deleted,stamp:Math.max(Date.now(),(old?.stamp||0)+1),device};
  }
  function capture() {
    const present=new Set();
    for(let n=0;n<localStorage.length;n++) {
      const key=localStorage.key(n); if(!allowed(key))continue;
      present.add(key);
      const raw=localStorage.getItem(key); let value,plain=false;
      try {value=JSON.parse(raw);}catch{value=raw;plain=true;}
      if(Array.isArray(value)) {
        record(key,'@kind','array'); const found=new Set();
        value.forEach((x,rank)=>{const id=identity(x);found.add(id);record(key,id,{item:x,rank});});
        for(const r of Object.values(records)) if(r.key===key&&r.id!=='@kind'&&!found.has(r.id)) record(key,r.id,r.value,true);
      } else {record(key,'@kind',plain?'raw':'scalar');record(key,'@value',value);}
    }
    for(const r of Object.values(records))if(!present.has(r.key))record(r.key,r.id,r.value,true);
    localStorage.setItem(META,JSON.stringify(records));
  }
  async function api(path,data={},token=auth()?.token) {
    if(!isSecureContext)throw new Error('Mở thư viện bằng HTTPS để đồng bộ trên điện thoại.');
    const response=await fetch('/api/sync/'+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});
    const value=await response.json();if(!response.ok){if(response.status===401&&auth())disconnect();throw new Error(value.error||'Chưa kết nối được đồng bộ.');}return value;
  }
  function apply() {
    applying=true;
    try {
      const keys=[...new Set(Object.values(records).map(x=>x.key))];
      for(const key of keys) {
        if(!allowed(key))continue;
        const all=Object.values(records).filter(x=>x.key===key), kind=all.find(x=>x.id==='@kind');
        if(!kind||kind.deleted) {localStorage.removeItem(key);continue;}
        const value=kind.value==='array'?all.filter(x=>x.id!=='@kind'&&!x.deleted&&x.value&&'item' in x.value).sort((a,b)=>(a.value.rank||0)-(b.value.rank||0)||b.stamp-a.stamp).map(x=>x.value.item):all.find(x=>x.id==='@value'&&!x.deleted)?.value;
        if(value!==undefined)localStorage.setItem(key,kind.value==='raw'?String(value):JSON.stringify(value));
      }
      localStorage.setItem(META,JSON.stringify(records));
    }finally{applying=false;}
    window.dispatchEvent(new Event('library-synced'));LibraryUI.refreshShelf();DharmaShell.refreshSidebar();LibraryUI.decorate();window.renderNotesAndBookmarks?.();
  }
  async function sync() {
    if(!auth()||busy)return;
    busy=true;
    try {
      capture();const sent=Object.values(records);const result=await api('exchange',{records:sent});
      // Capture edits made while the request was in flight before merging the response.
      capture();
      for(const r of result.records){if(!allowed(r.key))continue;const rid=JSON.stringify([r.key,r.id]);if(newer(r,records[rid]))records[rid]=r;}
      apply();dirty=false;LibraryStore.write('sync-last',Date.now());LibraryStore.write('sync-conflicts',result.conflictsCount||0);status('Đã đồng bộ lúc '+new Date().toLocaleTimeString('vi-VN')+(result.conflictsCount?' · Có bản ghi chú khác được giữ để bạn đối chiếu.':''));
    }catch(error){status(navigator.onLine?error.message:'Đang ngoại tuyến. Thay đổi sẽ được đồng bộ khi có kết nối.');}
    finally{busy=false;}
  }
  function status(text){window.dispatchEvent(new CustomEvent('library-sync-status',{detail:text}));}
  async function create(){const value=await api('create',{name:LibraryStore.read('device-name','Thiết bị của tôi')},null);localStorage.setItem(AUTH,JSON.stringify(value));await sync();return value;}
  async function pair(code){const value=await api('pair',{code,name:LibraryStore.read('device-name','Thiết bị của tôi')},null);localStorage.setItem(AUTH,JSON.stringify(value));await sync();return value;}
  function disconnect(){localStorage.removeItem(AUTH);localStorage.removeItem(META);records={};status('Đã ngắt đồng bộ trên thiết bị này.');}
  function init(){
    window.addEventListener('library-store-change',e=>{if(!applying&&auth()&&allowed(e.detail.key)){dirty=true;status('Có thay đổi chưa gửi. Sẽ đồng bộ khi có kết nối.');clearTimeout(timer);timer=setTimeout(sync,1800);}});
    window.addEventListener('online',sync);setInterval(()=>{if(auth()&&navigator.onLine)sync();},30000);
    if(auth())sync();
  }
  async function revoke(id){const result=await api('revoke',{deviceId:id});if(result.current)disconnect();return result;}
  async function deleteProfile(){await api('delete',{confirm:'DELETE'});disconnect();}
  window.LibrarySync={init,sync,create,pair,disconnect,auth,code:()=>api('code'),capture,devices:()=>api('devices'),rename:name=>api('rename',{name}),revoke,deleteProfile,conflicts:()=>api('conflicts'),get dirty(){return dirty;}};
})();

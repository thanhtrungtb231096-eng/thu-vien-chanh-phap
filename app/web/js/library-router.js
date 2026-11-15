/* Shared browser history. Reading progress replaces a route; screen changes add one. */
(() => {
  'use strict';
  let restoring = false, started = false, generation = 0;
  const titles = {home:'Khám phá',shelf:'Tủ sách',phucminh:'Chùa Phúc Minh',daithua:'Tuyển tập Đại thừa',daitanghan:'Hán tạng',daitang:'Tệp sách Việt ngữ',fulltext:'Tìm trong kinh văn',offline:'Ngoại tuyến',study:'Thời khóa',settings:'Thiết bị & giọng đọc','listening-history':'Lịch sử nghe'};
  function snapshot() {
    return {cp:true,query:document.getElementById('global-search')?.value || '',scroll:scrollY,filters:{daiThuaFilter:appState.daiThuaFilter,daiTangDivFilter:appState.daiTangDivFilter,daiTangOnlyViet:appState.daiTangOnlyViet,daiTangPage:appState.daiTangPage},homeSearch:window.LibraryUI?.captureSearch(),content:window.ContentModules?.capture(),tools:window.LibraryUpgrades?.capture(),album:window.DharmaShell?.albumRef(),reader:Reader.state.ready?Reader.capture():null};
  }
  function checkpoint() { if (started && !restoring) history.replaceState({...history.state,...snapshot()},'',location.href); }
  function move(hash, options = {}) {
    if (restoring || !started) return;
    if (location.hash === hash) return;
    checkpoint();
    history[options.replace?'replaceState':'pushState']({cp:true,...options.snapshot},'',hash);
  }
  function replace(hash, options = {}) { if (!restoring || options.canonical) history.replaceState({...history.state,cp:true},'',hash); }
  function title(text) { document.title=(text || titles[appState.currentTab] || document.querySelector('#tab-'+appState.currentTab+' h1,#tab-'+appState.currentTab+' h2')?.textContent || 'Thư viện')+' · Chánh Pháp'; }
  async function restore() {
    const token=++generation, hash=location.hash, saved=history.state?.cp?history.state:null;
    restoring=true;
    try {
      if (hash.startsWith('#read/')) {
        const [,encoded,mode,block]=hash.split('/'), key=decodeURIComponent(encoded), split=key.indexOf(':');
        if(split<0 || !['viet','han','dual','note'].includes(mode)) return;
        await LibraryUI.open(key.slice(0,split),key.slice(split+1),mode,saved?.reader || block);
      } else {
        if (Reader.state.item) Reader.close({route:false});
        if (!window.LearningPath?.route(hash) && !ContentModules.route(hash)) {
          const id=hash.slice(1) || 'home';
          if(id.startsWith('album/')) { const key=decodeURIComponent(id.slice(6)),split=key.indexOf(':'); if(split>=0) await DharmaShell.openAlbum({type:key.slice(0,split),id:key.slice(split+1)}); }
          else if(id==='album' && saved?.album) await DharmaShell.openAlbum(saved.album);
          else switchTab(document.getElementById('tab-'+id)?id:'home');
        }
        if(saved && token===generation) {
          Object.assign(appState,saved.filters || {});
          LibraryStore.write('query:'+appState.currentTab,saved.query || '');
          appState.searchQuery=saved.query || ''; document.getElementById('global-search').value=appState.searchQuery;
          LibraryUI.restoreSearch(saved.homeSearch);
          ContentModules.restore(saved.content);
          applyCurrentSearch();
          await window.LibraryUpgrades?.restore(saved.tools);
          window.scrollTo({top:saved.scroll || 0,behavior:'instant'});
        }
      }
      title(Reader.state.item?document.getElementById('reader-book-title').textContent:null);
    } finally { if(token===generation) restoring=false; }
  }
  function start() {
    if(started)return;started=true;history.scrollRestoration='manual';
    history.replaceState({...history.state,...snapshot()},'',location.href);
    window.addEventListener('hashchange',()=>restore().catch(()=>title()));
  }
  window.LibraryRouter={start,move,replace,checkpoint,title,restore,get restoring(){return restoring;}};
})();

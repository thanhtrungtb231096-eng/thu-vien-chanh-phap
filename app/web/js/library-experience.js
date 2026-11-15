(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  function init(){
    LibraryDownload.init();
    LibraryDevices.init();
    LibraryCommunity.init();
    LibraryDiagnostics.init();
    const home=$('tab-home'),discovery=home.querySelector('.home-discovery');
    home.prepend(home.querySelector('.sanctuary-hero'),discovery);discovery.after($('home-search-results'));
    const scope=document.createElement('p');scope.id='catalog-search-scope';scope.className='search-scope';scope.textContent='Tìm tên hoặc mã sách trong toàn thư viện';$('global-search').closest('.search-input-wrapper').after(scope);
    const modes=document.createElement('div');modes.id='catalog-search-modes';modes.className='catalog-search-modes';modes.setAttribute('role','group');modes.setAttribute('aria-label','Phạm vi tìm kiếm');
    modes.innerHTML='<button id="catalog-search-titles" class="r-button" aria-pressed="true">Tên sách</button><button id="catalog-search-text" class="r-button" aria-pressed="false">Trong kinh văn</button><button id="catalog-search-all" class="r-button">Toàn thư viện</button>';scope.after(modes);
    const choices=document.createElement('section');choices.id='catalog-search-controls';choices.setAttribute('aria-label','Phạm vi tra cứu');choices.append(scope,modes);document.querySelector('main').prepend(choices);
    $('catalog-search-titles').onclick=()=>$('global-search').focus();
    $('catalog-search-text').onclick=()=>{const query=$('global-search').value;LibraryUpgrades.navigate('fulltext');$('fulltext-query').value=query;$('fulltext-collection').value='';if(query.trim().length>=2)$('fulltext-form').requestSubmit();$('fulltext-query').focus();};
    $('catalog-search-all').onclick=()=>showTitles($('global-search').value);
    const titles=document.createElement('button');titles.id='fulltext-search-titles';titles.className='r-button';titles.textContent='Chuyển sang tìm tên sách';titles.onclick=()=>showTitles($('fulltext-query').value);$('fulltext-form').before(titles);
    const studyLabel=$('study-books').closest('label');if(studyLabel)studyLabel.firstChild.textContent='Sách trong thời khóa (thêm từng sách)';
    const hero=$('hero-explore');hero.textContent='Nghe Tâm Kinh';hero.onclick=()=>{const b=DAI_THUA_DATA.find(x=>x.taishoId==='T08n0251');if(b)DharmaPlayerStore.playItem({type:'daithua',id:b.id});};
    DharmaPlayerStore.subscribe(state=>{document.body.classList.toggle('player-empty',!state.item&&!Reader.state.item);hero.textContent=state.item?'Nghe tiếp: '+state.item.title:'Nghe Tâm Kinh';hero.onclick=()=>state.item?DharmaPlayerStore.toggle():DharmaPlayerStore.playItem({type:'daithua',id:DAI_THUA_DATA.find(x=>x.taishoId==='T08n0251').id});});
    window.addEventListener('library-reading-ready',()=>document.body.classList.remove('player-empty'));
    ['parchment','amber','night'].forEach((name,i)=>document.querySelectorAll('[data-theme="'+name+'"].theme-btn').forEach(b=>b.title=['Bạch Ngọc · Sáng','Hoàng Y · Ấm','Dạ Thiền · Tối'][i]));
    onTab(appState.currentTab);
  }
  function showTitles(query){switchTab('home');appState.searchQuery=query.trim().toLowerCase();$('global-search').value=query;LibraryStore.write('query:home',appState.searchQuery);applyCurrentSearch();$('global-search').focus();}
  function onTab(id){
    const scope=$('catalog-search-scope');if(!scope)return;
    const controls=$('catalog-search-controls');
    if(id==='home')$('tab-home').querySelector('.sanctuary-hero').after(controls);
    else document.querySelector('main').prepend(controls);
    const names={home:'toàn thư viện',daithua:'tuyển tập Đại Thừa',daitanghan:'Hán tạng',daitang:'tệp sách Việt ngữ',phucminh:'Chùa Phúc Minh'};
    const module=window.ContentModules?.isModule(id);
    const label=['glossary','milinda','practical'].includes(id)?'Tìm nội dung trong công cụ đang mở':'Tìm tên hoặc mã sách trong '+(names[id]||(module?'nhánh tạng đang xem':'toàn thư viện'));
    scope.textContent=label;$('global-search').setAttribute('aria-label',label);
    const catalog=!!names[id]||module;$('catalog-search-modes').hidden=!catalog;
    controls.hidden=!catalog&&!['glossary','milinda','practical'].includes(id);
    $('catalog-search-all').hidden=id==='home';
    const search=$('dharma-search');if(search)search.style.display=id==='fulltext'?'none':'';
    document.body.classList.toggle('player-empty',!DharmaPlayerStore.state.item&&!Reader.state.item);
  }
  window.LibraryExperience={init,onTab};
})();

/* Source-aware learning workspace; personal records use the shared backup/sync store. */
(() => {
  'use strict';
  const D = LearningPathData, S = LibraryStore, esc = value => PersistentPlayer.esc(value);
  const $ = id => document.getElementById(id), progressKey = 'learning-completions', drafts = new Map();
  let initialized = false, currentTrack = null, currentLesson = null, currentSource = null;
  const explorer = {mode:'lessons',query:'',track:'all',saved:false};
  const preferences = () => S.read('learning-view',{size:'standard',focus:false});
  const bookmarks = () => S.read('learning-bookmarks',[]);
  const isSaved = id => bookmarks().some(x=>x.id===id);
  const normalized = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
  const lessonTitle = () => currentSource ? D.sources[currentSource].title : currentTrack ? currentTrack.title+' · '+currentLesson.title : 'Lộ trình tu học';
  const button = (label, action, cls = 'r-button') => {const b = document.createElement('button');b.type='button';b.className=cls;b.textContent=label;b.onclick=action;return b;};
  function jumpSection(section) {
    if(section.tagName==='DETAILS')section.open=true;
    section.scrollIntoView({block:'start',behavior:'instant'});
    section.focus({preventScroll:true});
    const toolbar=$('tab-paths').querySelector('.lp-view-toolbar');
    const safeTop=toolbar.getBoundingClientRect().bottom+16,top=section.getBoundingClientRect().top;
    if(top<safeTop)window.scrollBy({top:top-safeTop,left:0,behavior:'instant'});
  }
  const budget = () => {const value = Number(S.read('learning-budget',25));return [15,25,40].includes(value)?value:25;};
  const records = () => S.read(progressKey,[]);
  const record = lesson => records().find(x => x.id === currentTrack.id + ':' + lesson.id) || {checks:[],done:false};
  const doneCount = track => track.lessons.filter(l => records().some(x => x.id === track.id+':'+l.id && x.done)).length;
  function savedButton(id,title,afterSave=null) {
    const b=button('',()=>{},'r-button lp-save-button');
    const refresh=()=>{const saved=isSaved(id);b.textContent=saved?'✓ Đã lưu':'＋ Lưu để học';b.setAttribute('aria-pressed',String(saved));b.setAttribute('aria-label',(saved?'Bỏ lưu ':'Lưu để học ')+title);};
    b.onclick=()=>{const saved=isSaved(id),next=bookmarks().filter(x=>x.id!==id);if(!saved)next.push({id,title,savedAt:Date.now()});const ok=S.write('learning-bookmarks',next);if(ok){refresh();afterSave?.();}$('lp-global-status').textContent=ok?(saved?'Đã bỏ lưu.':'Đã lưu. Tìm lại ở bộ lọc “Đã lưu”.'):'Chưa lưu được trên thiết bị.';};
    refresh();return b;
  }
  function renderToolbar(content) {
    const prefs=preferences(),toolbar=document.createElement('div');toolbar.className='lp-view-toolbar';
    toolbar.innerHTML='<span>KHÔNG GIAN ĐỌC & SUY NGẪM</span><label for="lp-text-size">Cỡ chữ<select id="lp-text-size"><option value="standard">Tiêu chuẩn</option><option value="large">Dễ đọc</option><option value="extra">Chữ lớn</option></select></label><button id="lp-focus" type="button" class="r-button">Đọc tập trung</button><p id="lp-global-status" role="status" aria-live="polite"></p>';
    content.append(toolbar);
    const apply=()=>{const p=preferences();content.dataset.textSize=['standard','large','extra'].includes(p.size)?p.size:'standard';content.classList.toggle('lp-focused',!!p.focus&&!!(currentTrack||currentSource));$('lp-focus').setAttribute('aria-pressed',String(!!p.focus));};
    $('lp-text-size').value=prefs.size;$('lp-text-size').onchange=e=>{if(!S.write('learning-view',{...preferences(),size:e.target.value}))$('lp-global-status').textContent='Chưa lưu được cỡ chữ.';apply();};
    $('lp-focus').onclick=()=>{if(!S.write('learning-view',{...preferences(),focus:!preferences().focus}))$('lp-global-status').textContent='Chưa lưu được chế độ đọc.';apply();};apply();
  }
  function writeRecord(lesson, update) {
    const id = currentTrack.id + ':' + lesson.id, next = {...record(lesson),...update,id,track:currentTrack.id,lesson:lesson.id,updatedAt:Date.now()};
    return S.write(progressKey,[...records().filter(x => x.id!==id),next]);
  }
  function localEditions(source) {
    if (source.taisho) return LibraryCatalog.all().filter(x => (x.data.taishoId || x.id) === source.taisho);
    return source.local ? [LibraryCatalog.get(source.local)].filter(Boolean) : [];
  }
  function navigate(trackId = null, lessonId = null, options = {}) {
    if (!initialized) return;
    currentSource=null;
    currentTrack = D.tracks.find(x => x.id === trackId) || null;
    currentLesson = currentTrack ? currentTrack.lessons.find(x => x.id === lessonId) || currentTrack.lessons[0] : null;
    const hash = '#paths' + (currentTrack ? '/' + currentTrack.id + '/' + currentLesson.id : '');
    switchTab('paths',{hash,replace:!!options.replace});
    LibraryRouter.title(lessonTitle());
    if(currentTrack)S.write('learning-last',{track:currentTrack.id,lesson:currentLesson.id,visitedAt:Date.now()});
    if (options.focus) $('lp-lesson-title')?.focus({preventScroll:true});
    return hash;
  }
  function navigateSource(id,options={}) {
    if(!initialized)return;
    if(!D.sources[id]?.study)return navigate();
    currentTrack=null;currentLesson=null;currentSource=id;
    const hash='#paths/kinh/'+id;switchTab('paths',{hash,replace:!!options.replace});LibraryRouter.title(lessonTitle());
    if(options.focus)$('lp-source-title')?.focus({preventScroll:true});return hash;
  }
  function route(hash = location.hash) {
    if (!initialized || !/^#paths(?:\/|$)/.test(hash)) return false;
    let parts; try {parts=decodeURIComponent(hash).split('/');}catch {parts=[];}
    const canonical=parts[1]==='kinh'?navigateSource(parts[2],{replace:true}):navigate(parts[1],parts[2],{replace:true});
    LibraryRouter.replace(canonical,{canonical:true});return true;
  }
  function onTab(id) { if (initialized && id === 'paths') render(); }
  function init() {
    if (initialized) return; initialized = true;
    const panel = document.createElement('section');panel.id='tab-paths';panel.className='tab-panel learning-panel';panel.style.display='none';panel.setAttribute('aria-label','Lộ trình tu học');document.querySelector('main').append(panel);
    const nav = document.createElement('button');nav.type='button';nav.id='nav-paths';nav.dataset.tab='paths';nav.className='nav-tab';nav.setAttribute('role','tab');nav.setAttribute('aria-controls','tab-paths');nav.setAttribute('aria-selected','false');nav.textContent='Lộ trình tu học';nav.onclick=()=>navigate();$('nav-home').after(nav);
    document.querySelectorAll('[data-dharma-nav="paths"]').forEach(b => b.onclick=()=>navigate());
    const home = $('reading-paths-section');
    if (home) {
      const link = button('Mở lộ trình tu học chi tiết →',()=>navigate(),'lp-entry-link');home.querySelector('.section-heading').after(link);
      const intro = document.createElement('p');intro.className='lp-home-intro';intro.textContent=D.tracks.length+' hướng học · '+D.tracks.reduce((n,t)=>n+t.lessons.length,0)+' bài có nguồn · '+Object.values(D.sources).filter(s=>s.study).length+' hồ sơ giải nghĩa kinh. Các danh sách đọc ngắn bên dưới dành cho lúc bạn muốn chọn nhanh một bản kinh.';link.after(intro);
    }
    const oldRoadmap = $('tab-roadmap').querySelector('.roadmap-container');
    if (oldRoadmap) {oldRoadmap.hidden=true;const intro=document.createElement('div');intro.className='lp-bridge';intro.innerHTML='<h2>Học trong mạch Giới · Định · Tuệ</h2><p>Đi từ nguồn kinh đến cách hiểu, rồi đến việc thực hành. Mở lộ trình mới để học từng bài với nguồn, bối cảnh và ghi chép cá nhân.</p>';D.tracks.slice(0,4).forEach(t=>intro.append(button(t.title+' →',()=>navigate(t.id))));oldRoadmap.before(intro);}
    ['library-restored','library-synced'].forEach(name=>window.addEventListener(name,()=>{if(appState.currentTab==='paths')render();}));
    window.addEventListener('storage', e=>{if(e.key?.startsWith('cp3:learning-') && appState.currentTab==='paths')render();});
  }
  function render() {
    const panel = $('tab-paths');if (!panel) return;
    panel.classList.toggle('lp-detail-view',!!(currentTrack||currentSource));
    const hero = panel.querySelector('.cp-module-hero');panel.replaceChildren();if(hero)panel.append(hero);
    const content = document.createElement('div');content.className='lp-workspace';panel.append(content);
    renderToolbar(content);
    if(currentSource)renderSourcePage(content);else if (currentTrack) renderTrack(content); else renderOverview(content);
    ModulePresentation.decorate('paths',panel);
    LibraryRouter.title(lessonTitle());
  }
  function renderOverview(content) {
    const total = D.tracks.reduce((n,t)=>n+t.lessons.length,0), completed = D.tracks.reduce((n,t)=>n+doneCount(t),0);
    content.insertAdjacentHTML('beforeend', `<div class="lp-overview-heading"><div><span class="eyebrow">HỌC TỪ GỐC · HIỂU TRỌN MẠCH</span><h2>Mỗi trang kinh, một hướng thực hành</h2><p>Đọc lời giải nghĩa, gặp những câu chuyện mở lòng và thấy cách mang giáo pháp vào đời sống. Mỗi bài nối nguồn kinh với những điều gần gũi: gia đình, công việc, mất mát và sự chăm sóc.</p></div><div class="lp-total-progress"><strong>${completed}<span> / ${total}</span></strong><small>bài đã đánh dấu đọc</small></div></div><div class="lp-curriculum-stats"><span><b>${D.tracks.length}</b> hướng học</span><span><b>${total}</b> bài có nguồn</span><span><b>${Object.values(D.sources).filter(s=>s.study).length}</b> hồ sơ giải nghĩa kinh</span><span>Văn · Tư · Tu</span></div><div id="lp-resume"></div><div class="lp-orientation"><label for="lp-goal">Điều bạn muốn học<select id="lp-goal">${D.tracks.map(t=>'<option value="'+t.id+'">'+esc(t.title)+'</option>').join('')}</select></label><label for="lp-budget">Thời gian mỗi buổi<select id="lp-budget"><option value="15">15 phút · Nhẹ nhàng</option><option value="25">25 phút · Đều đặn</option><option value="40">40 phút · Đọc sâu</option></select></label><button class="r-primary" id="lp-recommend">Bắt đầu hướng đã chọn →</button></div><div class="lp-section-heading"><span class="eyebrow">CHỌN HƯỚNG PHÙ HỢP</span><h2>Những lối vào tu học</h2><p>Các hướng học bổ trợ nhau. Thứ tự là gợi ý; bạn có thể đọc lại và chuyển hướng bất cứ lúc nào.</p></div><div class="lp-track-grid" id="curriculum-tracks"></div>`);
    const last=S.read('learning-last',{}),lastTrack=D.tracks.find(t=>t.id===last.track),lastLesson=lastTrack?.lessons.find(l=>l.id===last.lesson);
    if(lastLesson){const resume=$('lp-resume');resume.className='lp-resume';resume.innerHTML='<div><span class="eyebrow">TRỞ LẠI CHẶNG ĐANG HỌC</span><h3>'+esc(lastLesson.title)+'</h3><p>'+esc(lastTrack.title)+'</p></div>';resume.append(button('Tiếp tục bài này →',()=>navigate(lastTrack.id,lastLesson.id),'r-primary'));}
    $('lp-budget').value=String(budget());$('lp-budget').onchange=e=>S.write('learning-budget',Number(e.target.value));$('lp-recommend').onclick=()=>navigate($('lp-goal').value);
    D.tracks.forEach(track=>{
      const n=doneCount(track), next=track.lessons.find(l=>!records().some(x=>x.id===track.id+':'+l.id&&x.done)) || track.lessons[0];
      const card=document.createElement('article');card.className='lp-track-card';card.dataset.track=track.id;
      card.innerHTML=`<div class="lp-track-top"><span>${esc(track.eyebrow)}</span><i aria-hidden="true">${LibraryArt.svg(track.symbol)}</i></div><h3>${esc(track.title)}</h3><p>${esc(track.description)}</p><div class="lp-track-tags"><span>${esc(track.level)}</span><span>${track.lessons.length} bài học</span></div><small class="lp-duration">${esc(track.duration)}</small><progress value="${n}" max="${track.lessons.length}" aria-label="${esc(track.title)}: ${n} trên ${track.lessons.length} bài"></progress><div class="lp-track-bottom"><small>${n}/${track.lessons.length} bài đã đánh dấu đọc</small></div>`;
      card.querySelector('.lp-track-bottom').append(button(n?'Tiếp tục học →':'Xem lộ trình →',()=>navigate(track.id,next.id)));$('curriculum-tracks').append(card);
    });
    renderExplorer(content);
    const shortcuts=document.createElement('nav');shortcuts.className='lp-overview-shortcuts';shortcuts.setAttribute('aria-label','Lối vào nhanh của lộ trình');
    const jump=()=>{$('lp-explorer').scrollIntoView({block:'start'});$('lp-search').focus({preventScroll:true});};
    shortcuts.append(button('Tìm bài học & kinh →',jump),button('Khám phá 26 kinh trọng tâm →',()=>{$('lp-scriptures-tab').click();jump();}));
    $('lp-resume').before(shortcuts);
    const method=document.createElement('section');method.className='lp-method';method.innerHTML='<span class="eyebrow">ĐỌC CHẬM · HIỂU SÂU · THỰC HÀNH</span><h2>Một buổi học theo nhịp Văn · Tư · Tu</h2><div class="lp-method-grid"><div><b>01</b><h3>Văn — học từ nguồn</h3><p>Lắng nghe lời kinh, hiểu xuất xứ và theo trọn mạch nghĩa.</p></div><div><b>02</b><h3>Tư — suy xét nghĩa</h3><p>Tóm tắt bằng lời của mình, xem lại bối cảnh và đối chiếu cách hiểu.</p></div><div><b>03</b><h3>Tu — đưa vào đời sống</h3><p>Thử một việc cụ thể, ghi nhận tác động và điều chỉnh lần sau.</p></div></div>';content.append(method);
    appendReference(content);
  }
  function renderExplorer(content) {
    const section=document.createElement('section');section.id='lp-explorer';section.className='lp-explorer';
    section.innerHTML='<div class="lp-section-heading"><span class="eyebrow">TÌM ĐIỀU BẠN MUỐN HIỂU</span><h2>Khám phá bài học & kinh trọng tâm</h2><p>Tìm tên kinh, mã hoặc ý nghĩa. Có thể gõ không dấu, ví dụ “tam kinh”, “MN 58”, “loi noi”.</p></div><div class="lp-explorer-tabs" role="tablist" aria-label="Loại nội dung"><button id="lp-lessons-tab" type="button" role="tab" aria-controls="lp-explorer-results">Bài học</button><button id="lp-scriptures-tab" type="button" role="tab" aria-controls="lp-explorer-results">Kinh trọng tâm</button></div><div class="lp-explorer-filters"><label for="lp-search">Từ khóa<input id="lp-search" type="search" placeholder="Tên kinh, mã, nội dung muốn học…"></label><label for="lp-filter-track">Hướng học<select id="lp-filter-track"><option value="all">Tất cả hướng học</option>'+D.tracks.map(t=>'<option value="'+t.id+'">'+esc(t.title)+'</option>').join('')+'</select></label><label class="lp-saved-filter"><input id="lp-only-saved" type="checkbox">Đã lưu</label></div><p id="lp-explorer-count" role="status" aria-live="polite"></p><div id="lp-explorer-results" role="tabpanel"></div><button id="lp-load-more" class="r-button" type="button">Xem thêm kết quả</button>';
    content.append(section);let limit=8;
    const update=()=>{
      ['lessons','scriptures'].forEach(mode=>{const b=$('lp-'+mode+'-tab');b.setAttribute('aria-selected',String(explorer.mode===mode));b.tabIndex=explorer.mode===mode?0:-1;});
      $('lp-explorer-results').setAttribute('aria-labelledby','lp-'+explorer.mode+'-tab');
      const query=normalized(explorer.query.trim()),rows=[];
      if(explorer.mode==='lessons'){
        for(const t of D.tracks){if(explorer.track!=='all'&&explorer.track!==t.id)continue;
          for(const l of t.lessons){const id='lesson:'+t.id+':'+l.id;if(explorer.saved&&!isSaved(id))continue;
            const text=[l.title,l.why,...l.teaching,l.life.title,...l.life.paragraphs,...l.application,...l.sources.map(k=>D.sources[k].title+' '+D.sources[k].code)].join(' ');
            if(query&&!normalized(text).includes(query))continue;rows.push({id,title:l.title,tag:t.title,description:l.why,meta:l.sources.map(k=>D.sources[k].code).join(' · '),open:()=>navigate(t.id,l.id),done:records().some(x=>x.id===t.id+':'+l.id&&x.done)});
          }
        }
      }else{
        for(const [key,s] of Object.entries(D.sources)){if(!s.study)continue;const id='source:'+key;
          if(explorer.saved&&!isSaved(id))continue;
          if(explorer.track!=='all'&&!D.tracks.find(t=>t.id===explorer.track)?.lessons.some(l=>l.sources.includes(key)))continue;
          const text=[s.title,s.code,s.tradition,s.study.importance,...s.study.terms.flat()].join(' ');
          if(query&&!normalized(text).includes(query))continue;rows.push({id,title:s.title,tag:s.tradition,description:s.study.importance,meta:s.code+' · '+s.collection,open:()=>navigateSource(key),done:false});
        }
      }
      const results=$('lp-explorer-results');results.replaceChildren();
      $('lp-explorer-count').textContent=rows.length+' kết quả'+(rows.length>limit?' · đang hiển thị '+limit:'');
      for(const row of rows.slice(0,limit)){const card=document.createElement('article');card.className='lp-discovery-card';card.innerHTML='<span class="eyebrow">'+esc(row.tag)+(row.done?' · ĐÃ ĐỌC':'')+'</span><h3>'+esc(row.title)+'</h3><small>'+esc(row.meta)+'</small><p>'+esc(row.description)+'</p><div class="lp-discovery-actions"></div>';const actions=card.querySelector('.lp-discovery-actions');actions.append(button(explorer.mode==='lessons'?'Mở bài học →':'Đọc giải nghĩa →',row.open),savedButton(row.id,row.title,()=>{if(explorer.saved){update();$('lp-only-saved').focus();}}));results.append(card);}
      if(!rows.length){const empty=document.createElement('p');empty.className='lp-empty';empty.textContent=explorer.saved?'Chưa có nội dung đã lưu phù hợp. Bỏ chọn “Đã lưu” để tìm và lưu một bài hoặc kinh.':'Chưa tìm thấy. Thử tên ngắn hơn, mã kinh hoặc chọn tất cả hướng học.';results.append(empty);}
      $('lp-load-more').hidden=rows.length<=limit;
    };
    for(const mode of ['lessons','scriptures']){
      const tab=$('lp-'+mode+'-tab');tab.onclick=()=>{explorer.mode=mode;limit=8;update();};
      tab.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?'lessons':e.key==='End'?'scriptures':mode==='lessons'?'scriptures':'lessons';$('lp-'+next+'-tab').click();$('lp-'+next+'-tab').focus();};
    }
    $('lp-search').value=explorer.query;$('lp-search').oninput=e=>{explorer.query=e.target.value;limit=8;update();};
    $('lp-filter-track').value=explorer.track;$('lp-filter-track').onchange=e=>{explorer.track=e.target.value;limit=8;update();};
    $('lp-only-saved').checked=explorer.saved;$('lp-only-saved').onchange=e=>{explorer.saved=e.target.checked;limit=8;update();};
    $('lp-load-more').onclick=()=>{limit+=8;update();};update();
  }
  function appendReference(content) {
    const history=document.createElement('details');history.className='lp-reference';history.innerHTML='<summary>Nguồn gốc & hành trình truyền thừa kinh sách</summary><div class="lp-origin-steps"><div><b>01 / TRUYỀN KHẨU & KẾT TẬP</b><p>Kinh sớm được tổ chức cho việc tụng đọc và ghi nhớ. Khi nghiên cứu, phân biệt bối cảnh được kể trong kinh với chứng cứ lịch sử về sự hình thành văn bản.</p><a href="https://suttacentral.net/edition/dn/en/sujato/general_introduction" target="_blank" rel="noopener noreferrer">Giới thiệu Trường Bộ · Bhikkhu Sujato ↗</a></div><div><b>02 / NGÔN NGỮ & TRUYỀN THỐNG</b><p>Nikāya Pāli và các bộ A-Hàm Hán dịch là những bộ sưu tập có lịch sử truyền thừa riêng. Quan hệ song hành cần đối chiếu từng bài; không suy ra mọi bộ đều tương đương hoàn toàn.</p><a href="https://suttacentral.net/general-guide-sujato?lang=en" target="_blank" rel="noopener noreferrer">Hướng dẫn đọc kinh · SuttaCentral ↗</a></div><div><b>03 / BẢN DỊCH & TẠNG KINH</b><p>Đại Chánh tạng là một ấn bản sưu tập, không phải niên đại sáng tác của tất cả tác phẩm bên trong. CBETA cung cấp văn bản số và hệ thống danh mục để tra cứu, đối chiếu.</p><a href="https://www.cbeta.org/cbreader/help/cbeta_toc_en.htm" target="_blank" rel="noopener noreferrer">Cấu trúc danh mục · CBETA ↗</a></div><div><b>04 / CHÚ GIẢI & TỆP ĐANG ĐỌC</b><p>Giữ riêng kinh văn, lời chú giải, sách giảng và hướng dẫn học hiện đại. Một tệp OCR hoặc bản trích PDF còn cần đối chiếu; mỗi lần trích dẫn nên ghi đúng bản và vị trí.</p><p>Đừng tự điền một niên đại khi hồ sơ chưa có chứng cứ. Nguồn và mức độ chắc chắn giúp việc nghiên cứu có điểm tựa.</p></div></div>';content.append(history);
    const terms=document.createElement('details');terms.className='lp-reference';terms.innerHTML='<summary>Thuật ngữ & cách nhận biết nguồn</summary><dl>'+D.glossary.map(([term,meaning])=>'<dt>'+esc(term)+'</dt><dd>'+esc(meaning)+'</dd>').join('')+'</dl>';content.append(terms);
    const reference=document.createElement('details');reference.className='lp-reference';reference.innerHTML='<summary>Phương pháp biên soạn & danh mục nguồn ('+Object.keys(D.sources).length+')</summary><p>'+esc(D.editorial)+'</p><p>Ngày tra cứu và biên soạn: 11/10/2026. Thời lượng là gợi ý, không phải quy định của kinh. Liên kết ngoài cần có mạng; bản trong thư viện có thể chuẩn bị để đọc ngoại tuyến.</p><ol>'+Object.values(D.sources).map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+' · '+esc(s.code)+' ↗</a><small>'+esc(s.credit)+'</small></li>').join('')+'</ol>';content.append(reference);
  }
  function renderTrack(content) {
    const track=currentTrack,lesson=currentLesson,n=doneCount(track),index=track.lessons.indexOf(lesson),story=D.narratives[lesson.narrative];
    const prose=paragraphs=>paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('');
    const crumb=document.createElement('nav');crumb.className='lp-breadcrumb';crumb.setAttribute('aria-label','Vị trí trong lộ trình');crumb.append(button('← Các lộ trình',()=>navigate()),document.createTextNode(' / '+track.title));content.append(crumb);
    const intro=document.createElement('section');intro.className='lp-track-intro';intro.innerHTML=`<div><span class="eyebrow">${esc(track.eyebrow)}</span><h2>${esc(track.title)}</h2><p>${esc(track.description)}</p></div><span class="lp-progress-label">${n}/${track.lessons.length} bài đã đánh dấu đọc</span><progress value="${n}" max="${track.lessons.length}" aria-label="Bài đã đọc trong ${esc(track.title)}"></progress>`;content.append(intro);
    const layout=document.createElement('div');layout.className='lp-study-layout';content.append(layout);
    const outlineWrap=document.createElement('details');outlineWrap.className='lp-outline-wrap';outlineWrap.open=window.matchMedia('(min-width:1001px)').matches;outlineWrap.innerHTML='<summary>Các bài trong lộ trình · '+String(index+1).padStart(2,'0')+'/'+String(track.lessons.length).padStart(2,'0')+'</summary>';layout.append(outlineWrap);
    const outline=document.createElement('nav');outline.className='lp-outline';outline.setAttribute('aria-label','Các bài trong '+track.title);outline.innerHTML='<h3>Trong lộ trình này</h3>';outlineWrap.append(outline);
    track.lessons.forEach((l,i)=>{const done=records().some(x=>x.id===track.id+':'+l.id&&x.done),b=button('',()=>navigate(track.id,l.id,{focus:true}),'lp-outline-item');b.innerHTML='<span aria-hidden="true">'+(done?'✓':String(i+1).padStart(2,'0'))+'</span><span>'+esc(l.title)+(done?'<small>Đã đánh dấu đọc</small>':'')+'</span>';if(l===lesson)b.setAttribute('aria-current','step');outline.append(b);});
    const article=document.createElement('article');article.className='lp-lesson lp-essay';layout.append(article);
    article.innerHTML=`<header class="lp-lesson-heading"><span class="eyebrow">BÀI ${String(index+1).padStart(2,'0')} / ${esc(lesson.theme)}</span><h2 id="lp-lesson-title" tabindex="-1">${esc(lesson.title)}</h2><span>Giải nghĩa & câu chuyện · Khoảng ${lesson.readMinutes} phút đọc · Có thể đọc lại từng phần</span><div class="lp-lesson-actions"></div></header>
      <aside class="lp-importance"><span class="eyebrow">Ý NGHĨA CỦA BÀI</span><p>${esc(lesson.why)}</p></aside>
      <nav class="lp-inpage" aria-label="Mục lục nhanh của bài"></nav>
      <section id="lp-context-section" tabindex="-1" class="lp-lesson-section lp-essay-prose"><span class="eyebrow">HIỂU GIÁO PHÁP TRONG VĂN CẢNH</span><h3>Giải nghĩa và chiều sâu tu học</h3>${prose(lesson.meaning)}<small class="lp-editorial-label">Giải nghĩa do thư viện biên soạn · nguồn đọc được ghi cuối bài</small></section>
      ${story?'<section id="lp-canonical-section" tabindex="-1" class="lp-lesson-section lp-story lp-canonical"><span class="eyebrow">CHUYỆN VÀ THÍ DỤ TRONG KINH</span><h3>'+esc(story.title)+'</h3>'+prose(story.paragraphs)+'<footer><small>Kể lại và giải thích theo '+esc(story.location)+'</small><div class="lp-story-source"></div></footer></section>':''}
      <section id="lp-life-section" tabindex="-1" class="lp-lesson-section lp-story lp-life"><span class="eyebrow">TỪ GIÁO PHÁP ĐẾN ĐỜI SỐNG</span><h3>${esc(lesson.life.title)}</h3>${prose(lesson.life.paragraphs)}<small class="lp-editorial-label">Tình huống minh họa do thư viện biên soạn · nhân vật hư cấu</small></section>
      <section id="lp-practice-section" tabindex="-1" class="lp-lesson-section lp-essay-prose"><span class="eyebrow">ỨNG DỤNG CỤ THỂ</span><h3>Mang sự hiểu vào cách sống</h3>${prose(lesson.application)}</section>
      <aside class="lp-takeaway"><span class="eyebrow">ĐIỀU ĐỌNG LẠI</span><p>${esc(lesson.takeaway)}</p></aside>
      <section id="lp-sources-section" tabindex="-1" class="lp-lesson-section"><span class="eyebrow">TRỞ VỀ VỚI VĂN BẢN</span><h3>Kinh và nguồn để đọc sâu hơn</h3><p class="lp-reading-instruction">${esc(lesson.reading)}</p><div id="lp-sources"></div></section>`;
    article.querySelector('.lp-lesson-actions').append(savedButton('lesson:'+track.id+':'+lesson.id,lesson.title));
    if(story)article.querySelector('.lp-story-source').append(button('Đọc hồ sơ '+D.sources[story.source].title+' →',()=>navigateSource(story.source)));
    for(const [id,label] of [['lp-context-section','Giải nghĩa'],...(story?[['lp-canonical-section','Chuyện trong kinh']]:[]),['lp-life-section','Câu chuyện đời sống'],['lp-practice-section','Ứng dụng'],['lp-sources-section','Nguồn đọc'],['lp-diary-section','Ghi chép riêng']])article.querySelector('.lp-inpage').append(button(label,()=>jumpSection($(id)),'lp-jump'));
    lesson.sources.forEach(key=>renderSource($('lp-sources'),D.sources[key],key,{compact:true}));
    renderDiary(article,lesson);renderCompletion(article,lesson);
    const end=document.createElement('nav');end.className='lp-lesson-navigation';end.setAttribute('aria-label','Điều hướng bài học');
    if(index>0)end.append(button('← Bài trước',()=>navigate(track.id,track.lessons[index-1].id,{focus:true})));
    if(index<track.lessons.length-1)end.append(button('Bài tiếp theo →',()=>navigate(track.id,track.lessons[index+1].id,{focus:true})));else end.append(button('Chọn hướng học tiếp →',()=>navigate()));article.append(end);
    renderSchedule(content,track);appendReference(content);
  }
  function renderSourcePage(content) {
    const source=D.sources[currentSource];
    const crumb=document.createElement('nav');crumb.className='lp-breadcrumb';crumb.setAttribute('aria-label','Vị trí hồ sơ kinh');crumb.append(button('← Các lộ trình & kinh',()=>navigate()),document.createTextNode(' / '+source.code));content.append(crumb);
    const article=document.createElement('article');article.className='lp-scripture-page';article.innerHTML='<header class="lp-lesson-heading"><span class="eyebrow">HỒ SƠ ĐỌC HIỂU · '+esc(source.code)+'</span><h2 id="lp-source-title" tabindex="-1">'+esc(source.title)+'</h2><p>'+esc(source.tradition)+' · '+esc(source.collection)+'</p><small>Đọc từ xuất xứ đến mạch nghĩa, rồi trở lại toàn văn.</small></header><nav class="lp-inpage" aria-label="Mục lục hồ sơ kinh"></nav><div id="lp-source-profile"></div>';content.append(article);
    renderSource($('lp-source-profile'),source,currentSource,{expanded:true,standalone:true});
    article.querySelectorAll('.lp-depth-body>section').forEach((section,i)=>{section.id='lp-profile-section-'+i;section.tabIndex=-1;article.querySelector('.lp-inpage').append(button(section.querySelector('h3').textContent.split(' · ')[0],()=>{article.querySelector('.lp-source-depth').open=true;jumpSection(section);},'lp-jump'));});
    const related=document.createElement('section');related.className='lp-related';related.innerHTML='<span class="eyebrow">ĐƯA HIỂU BIẾT VÀO TỪNG CHẶNG</span><h3>Bài học cùng kinh này</h3><div class="lp-related-links"></div>';
    for(const t of D.tracks)for(const l of t.lessons)if(l.sources.includes(currentSource)){const b=button('',()=>navigate(t.id,l.id));b.innerHTML='<span>'+esc(l.title)+'</span><small>'+esc(t.title)+'</small>';related.querySelector('div').append(b);}article.append(related);
  }
  function renderProfile(card,study,expanded) {
    const importance=document.createElement('aside');importance.className='lp-scripture-importance';importance.innerHTML='<h5>Tầm quan trọng & ý nghĩa tu học</h5><p>'+esc(study.importance)+'</p>';card.append(importance);
    const details=document.createElement('details');details.className='lp-source-depth';details.open=expanded;
    details.innerHTML='<summary>Giải nghĩa kỹ · mạch kinh, thuật ngữ & ứng dụng</summary><div class="lp-depth-body"><section><h5>Bản đồ nội dung · đọc trọn mạch</h5><ol class="lp-scripture-map">'+study.map.map(([title,text],i)=>'<li><b aria-hidden="true">'+String(i+1).padStart(2,'0')+'</b><div><strong>'+esc(title)+'</strong><p>'+esc(text)+'</p></div></li>').join('')+'</ol></section><section><h5>Giải nghĩa trọng yếu</h5>'+study.meaning.map(([title,text])=>'<div class="lp-meaning-block"><h6>'+esc(title)+'</h6><p>'+esc(text)+'</p></div>').join('')+'</section><section><h5>Thuật ngữ trong văn cảnh</h5><dl class="lp-terms">'+study.terms.map(([term,text])=>'<div><dt>'+esc(term)+'</dt><dd>'+esc(text)+'</dd></div>').join('')+'</dl></section><section><h5>Điều dễ hiểu nhầm</h5>'+study.mistakes.map(([error,correction])=>'<div class="lp-misconception"><h6>'+esc(error)+'</h6><p>'+esc(correction)+'</p></div>').join('')+'</section><section class="lp-application"><h5>Từ kinh đến đời sống</h5><p>'+esc(study.application)+'</p></section><small class="lp-editorial-label">Bản đồ và giải nghĩa nhập môn do thư viện biên soạn. Đọc toàn văn ở bản nguồn; các nghĩa chuyên sâu tiếp tục học với nguồn giảng và người hướng dẫn phù hợp.</small></div>';
    const essentials=document.createElement('section');essentials.className='lp-essentials';essentials.innerHTML='<h5>Nội dung cốt lõi & ý nghĩa</h5>'+study.essentials.map(([title,text])=>'<div class="lp-meaning-block"><h6>'+esc(title)+'</h6><p>'+esc(text)+'</p></div>').join('');details.querySelector('.lp-depth-body>section').after(essentials);
    if(study.narratives?.length){const stories=document.createElement('section');stories.className='lp-profile-stories';stories.innerHTML='<h5>Chuyện và thí dụ trong kinh</h5>'+study.narratives.map(key=>{const story=D.narratives[key];return '<div class="lp-story lp-canonical"><h6>'+esc(story.title)+'</h6>'+story.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'<small class="lp-editorial-label">Kể lại và giải thích theo '+esc(story.location)+'</small></div>';}).join('');details.querySelector('.lp-essentials').after(stories);}
    card.append(details);
  }
  function renderSource(container,source,key=null,{expanded=false,standalone=false,compact=false}={}) {
    const card=document.createElement('article');card.className='lp-source-card';card.dataset.source=key||'';
    card.innerHTML=`<div class="lp-source-tags"><span>${esc(source.kind)}</span><span>${esc(source.tradition)}</span></div>${standalone?'':'<h4>'+esc(source.title)+'</h4>'}<div class="lp-source-code">${esc(source.code)} · ${esc(source.collection)}</div><p><strong>Xuất xứ & bối cảnh:</strong> ${esc(source.origin)}</p><p><strong>Điểm đọc:</strong> ${esc(source.focus)}</p>`;
    if(source.study&&!compact)renderProfile(card,source.study,expanded);
    if(standalone)card.querySelectorAll('h5,h6').forEach(heading=>{const replacement=document.createElement(heading.tagName==='H5'?'h3':'h4');replacement.className=heading.tagName==='H5'?'lp-profile-heading':'lp-profile-subheading';replacement.append(...heading.childNodes);heading.replaceWith(replacement);});
    const external=document.createElement('div');external.className='lp-source-external';external.innerHTML='<a href="'+esc(source.url)+'" target="_blank" rel="noopener noreferrer">Mở nguồn đối chiếu ↗</a><small>'+esc(source.credit)+'</small>';card.append(external);
    if(source.study&&key){const actions=document.createElement('div');actions.className='lp-source-actions';if(!standalone)actions.append(button('Hồ sơ kinh đầy đủ →',()=>navigateSource(key)));actions.append(savedButton('source:'+key,source.title));card.append(actions);}
    const editions=localEditions(source);
    if(editions.length) {
      const details=document.createElement('details');details.className='lp-editions';details.innerHTML='<summary>Bản trong thư viện ('+editions.length+')</summary><p class="lp-edition-scope">'+esc(source.scope || 'Chọn ấn bản và ngôn ngữ')+'</p>';
      editions.forEach(item=>{
        const row=document.createElement('div');row.className='lp-edition';const vietnamese=!!Reader.path(item,'viet'),han=!!Reader.path(item,'han');
        row.innerHTML='<strong>'+esc(item.title)+'</strong><small>'+esc(LibraryCatalog.description(item))+'</small>';
        const actions=document.createElement('div');actions.className='lp-edition-actions';
        const read=button(source.scope?.startsWith('Bản bộ')?'Mở bộ để tìm bài →':vietnamese?'Đọc bản Việt →':han?'Đọc bản Hán →':'Mở hồ sơ nguồn →',()=>LibraryUI.open(item.type,item.id,vietnamese?'viet':'han'));
        actions.append(read);
        if(vietnamese){const listen=button(source.scope?.startsWith('Bản bộ')?'Nghe bộ sách':'Nghe bản này',()=>LibraryUI.listen(item.type,item.id));actions.append(listen);}
        row.append(actions);details.append(row);
      });card.append(details);
    } else {const note=document.createElement('small');note.className='lp-no-local';note.textContent='Bài này dùng nguồn đối chiếu bên ngoài; chưa liên kết một bản đọc riêng trong thư viện.';card.append(note);}
    container.append(card);
  }
  function renderDiary(article,lesson) {
    const id=currentTrack.id+':'+lesson.id,key='learning-note:'+id,saved=S.read(key,{text:''});
    const section=document.createElement('details');section.className='lp-lesson-section lp-diary';section.id='lp-diary-section';section.tabIndex=-1;
    section.innerHTML='<summary>Ghi chép riêng · mở khi muốn lưu điều đọng lại</summary><div class="lp-diary-body"><h3>Một khoảng để ghi nhớ</h3><label for="lp-note">Ghi chép cá nhân</label><textarea id="lp-note" maxlength="12000" rows="5" placeholder="Một ý nghĩa muốn giữ lại hoặc một điều đã đưa vào đời sống…"></textarea><div class="lp-diary-actions"><button id="lp-save-note" type="button" class="r-button">Lưu ghi chép</button><small>Ghi chép được giữ trên thiết bị và trong bản sao lưu / đồng bộ đã thiết lập.</small></div><p id="lp-note-status" role="status"></p></div>';article.append(section);
    section.open=!!(drafts.get(id)??saved.text);
    $('lp-note').value=drafts.get(id)??saved.text??'';
    $('lp-note').oninput=e=>{drafts.set(id,e.target.value);$('lp-note-status').textContent='Có thay đổi chưa lưu.';};
    $('lp-save-note').onclick=()=>{const text=$('lp-note').value;const ok=S.write(key,{id,text,updatedAt:Date.now()});$('lp-note-status').textContent=ok?'Đã lưu ghi chép cho bài này.':'Chưa lưu được ghi chép. Hãy xuất nhật ký để giữ lại nội dung.';if(ok)drafts.delete(id);};
  }
  function renderCompletion(article,lesson) {
    const section=document.createElement('div');section.className='lp-read-marker';const saved=record(lesson);
    section.innerHTML='<button id="lp-complete" type="button" class="r-button" aria-pressed="'+String(!!saved.done)+'">'+(saved.done?'✓ Đã đánh dấu đọc':'Đánh dấu đã đọc')+'</button><p id="lp-completion-status" role="status">Dấu đọc giúp tìm lại bài; bạn có thể đọc lại bất cứ lúc nào.</p>';article.append(section);
    $('lp-complete').onclick=()=>{
      const done=record(lesson).done;
      if(writeRecord(lesson,{done:!done})){render();$('lp-complete').focus({preventScroll:true});$('lp-completion-status').textContent=done?'Đã bỏ dấu đọc; ghi chép vẫn được giữ.':'Đã ghi nhận dấu đọc cho bài này.';}else $('lp-completion-status').textContent='Chưa lưu được dấu đọc trên thiết bị.';
    };
  }
  function renderSchedule(content,track) {
    const minutes=budget(),parts=minutes===15?[6,4,5]:minutes===40?[18,10,12]:[10,7,8];
    const section=document.createElement('section');section.className='lp-schedule';section.innerHTML='<div><span class="eyebrow">NHỊP HỌC CỦA BẠN</span><h2>'+minutes+' phút cho một buổi tu học</h2><p>'+parts[0]+' phút đọc nguồn · '+parts[1]+' phút suy ngẫm · '+parts[2]+' phút thực hành / ghi chép.</p><small>Thời lượng do thư viện gợi ý; điều chỉnh theo hoàn cảnh và hướng dẫn của bạn.</small></div><div class="lp-schedule-actions"></div><p id="lp-schedule-status" role="status"></p>';content.append(section);
    const actions=section.querySelector('.lp-schedule-actions');
    actions.append(button('Tạo thời khóa từ lộ trình',()=>{
      const books=[...new Set(track.lessons.flatMap(l=>l.sources.flatMap(k=>localEditions(D.sources[k]).filter(x=>Reader.path(x,'viet')).slice(0,1).map(x=>x.key))))];
      if(!books.length){$('lp-schedule-status').textContent='Lộ trình chưa có bản Việt liên kết để tạo thời khóa tự động. Bạn vẫn có thể dùng nguồn đối chiếu và lập thời khóa riêng.';return;}
      const id=S.read('learning-plan:'+track.id,null);
      try {const plan=LibraryStudy.add({name:'Tu học · '+track.title,books,start:LibraryStudy.date(),days:Math.min(90,track.lessons.length*7),minutes,mode:'read'},id);if(!S.read('study-plans',[]).some(x=>x.id===plan.id))throw new Error('Chưa lưu được thời khóa trên thiết bị.');S.write('learning-plan:'+track.id,plan.id);LibraryUpgrades.navigate('study');$('study-status').textContent='Đã tạo thời khóa với các sách liên kết. Dùng số kinh và hướng dẫn bài đọc trong lộ trình để tìm phần cần học.';}catch(error){$('lp-schedule-status').textContent=error.message;}
    }));
    actions.append(button('Xuất nhật ký & tiến độ',()=>{
      const notes=track.lessons.map(l=>{const id=track.id+':'+l.id,saved=S.read('learning-note:'+id,{text:''});return {...saved,id,text:drafts.get(id)??saved.text??''};});
      S.download('tu-hoc-'+track.id+'.json',{format:'chanh-phap-learning',version:D.version,track:track.id,exportedAt:new Date().toISOString(),notes,progress:records().filter(x=>x.track===track.id)});
    }));
    actions.append(button('Mở chuông chánh niệm',()=>switchTab('timer')));
  }
  window.LearningPath={init,navigate,navigateSource,route,onTab,localEditions,get selection(){return {track:currentTrack?.id,lesson:currentLesson?.id,source:currentSource};}};
})();

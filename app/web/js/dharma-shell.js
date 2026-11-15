(() => {
  'use strict';
  const $ = id => document.getElementById(id), P = window.DharmaPlayerStore, UI = window.PersistentPlayer;
  const esc = UI.esc, icon = UI.icon;
  let initialized = false, album = null, albumRequest = null, shelfSignature = '';
  const navItems = [['home', 'Khám phá', 'home'], ['listening-history', 'Lịch sử nghe', 'clock'], ['phucminh', 'Chùa Phúc Minh', 'temple'], ['daitang', 'Đại Tạng Kinh', 'canon'], ['daithua', 'Kho kinh Đại Thừa', 'lotus'], ['daitanghan', 'Đại Tạng Kinh Hán', 'scroll'], ['paths', 'Lộ trình tu học', 'compass'], ['daily', 'Khóa tụng hằng ngày', 'lyrics'], ['offline', 'Kho ngoại tuyến', 'offline']];
  function navigate(id) {
    if ($('reader-view-container').classList.contains('active')) Reader.close({route:false});
    if (id === 'paths') window.LearningPath?.navigate();
    else if (id === 'daily') openDaily();
    else if (['offline', 'study', 'fulltext', 'quality', 'settings', 'help'].includes(id) && window.LibraryUpgrades?.navigate) window.LibraryUpgrades.navigate(id);
    else switchTab(id);
  }
  function init() {
    if (initialized) return; initialized = true;
    document.body.classList.add('dharma-app');
    document.querySelector('.noble-header').insertAdjacentHTML('afterend', `<aside id="dharma-sidebar" aria-label="Điều hướng thư viện"><div class="ds-heading">KHÔNG GIAN CHÁNH PHÁP</div><nav class="ds-nav" aria-label="Khám phá">${navItems.map(([id, text, name]) => `<button data-dharma-nav="${id}">${icon(name)}<span>${text}</span></button>`).join('')}</nav><div class="ds-divider"></div><div class="ds-library-heading"><button data-dharma-nav="shelf">${icon('shelf')}<span>Tủ sách của bạn</span></button><button id="ds-create" class="dp-icon" aria-label="Tạo danh sách tu học">+</button></div><div class="ds-pills"><button data-dharma-nav="shelf">Kinh đã lưu</button><button id="ds-recent">Gần đây</button></div><div id="ds-books"></div><div id="ds-playlists"></div><details class="ds-more"><summary>Tra cứu & công cụ</summary><nav>${[['appendix', 'Đối chiếu kinh điển'], ['glossary', 'Từ điển Pāḷi'], ['notes', 'Sổ tay tu học'], ['roadmap', 'Lộ trình pháp hành'], ['milinda', 'Vấn đáp Mi Tiên'], ['practical', 'Ứng dụng đời thường'], ['timer', 'Tọa thiền & chuông']].map(([id, text]) => `<button data-dharma-nav="${id}">${text}</button>`).join('')}</nav></details><div class="ds-bottom">${LibraryArt.svg('lotus')}<span>Gìn giữ lời kinh.<br>Nuôi dưỡng tuệ giác.</span></div></aside>`);
    const companion = document.createElement('aside'); companion.id = 'dharma-companion'; companion.setAttribute('aria-label', 'Công cụ tu học');
    companion.innerHTML = '<div id="dharma-companion-content">' + UI.companionMarkup() + '</div>'; document.body.append(companion);
    document.body.insertAdjacentHTML('beforeend', `<dialog id="dharma-companion-dialog" class="dharma-dialog dc-dialog" aria-label="Công cụ tu học"><button id="dc-dialog-close" class="dp-icon" aria-label="Đóng công cụ tu học">${icon('close')}</button></dialog><nav id="dharma-mobile-nav" aria-label="Điều hướng điện thoại">${[['home', 'Khám phá', 'home'], ['search', 'Tra cứu', 'search'], ['shelf', 'Tủ sách', 'shelf'], ['daily', 'Khóa tụng', 'lyrics']].map(([id, text, name]) => `<button data-mobile-nav="${id}">${icon(name)}<span>${text}</span></button>`).join('')}</nav><dialog id="ds-create-dialog" class="dharma-dialog" aria-labelledby="ds-create-title"><header><h2 id="ds-create-title">Danh sách tu học mới</h2><button id="ds-create-close" class="dp-icon" aria-label="Đóng">${icon('close')}</button></header><form id="ds-create-form"><label for="ds-playlist-name">Tên danh sách</label><input id="ds-playlist-name" placeholder="Ví dụ: Khóa tụng buổi sáng" required maxlength="80"><label for="ds-playlist-books">Chọn các bản kinh (giữ Ctrl hoặc ⌘ để chọn nhiều)</label><select id="ds-playlist-books" multiple size="8" required></select><button type="submit" class="r-primary">Tạo danh sách</button></form></dialog>`);
    $('dc-dialog-close').onclick = () => $('dharma-companion-dialog').close();
    $('dharma-companion-dialog').addEventListener('close', () => companion.append($('dharma-companion-content')));
    document.querySelectorAll('[data-dharma-nav]').forEach(b => { b.setAttribute('aria-label', b.textContent.trim()); b.onclick = () => navigate(b.dataset.dharmaNav); });
    document.querySelectorAll('[data-mobile-nav]').forEach(b => b.onclick = () => b.dataset.mobileNav === 'search' ? search() : navigate(b.dataset.mobileNav));
    const historyMobile = document.createElement('button'); historyMobile.dataset.mobileNav = 'listening-history';
    historyMobile.innerHTML = icon('clock') + '<span>Lịch sử</span>'; historyMobile.onclick = () => navigate('listening-history');
    document.querySelector('[data-mobile-nav="daily"]').before(historyMobile);
    $('ds-recent').onclick = () => { navigate('home'); const recent = $('recent-books').closest('.home-section'); if (!recent.hidden) recent.scrollIntoView({ behavior: 'smooth' }); };
    const brand = document.querySelector('.brand-text h1'); brand.textContent = 'CHÁNH PHÁP';
    document.querySelector('.pali-sub').textContent = 'THƯ VIỆN KINH ĐIỂN';
    const searchSection = document.querySelector('.search-filter-section'); searchSection.id = 'dharma-search';
    const hint = document.createElement('kbd'); hint.textContent = 'Ctrl K'; searchSection.querySelector('.search-input-wrapper').append(hint);
    $('global-search').placeholder = 'Bạn muốn tìm bản kinh nào?';
    document.querySelector('.header-container').insertBefore(searchSection, document.querySelector('.header-container > .header-actions'));
    const toolsButton = document.createElement('button'); toolsButton.id = 'dharma-tools-toggle'; toolsButton.className = 'r-button'; toolsButton.innerHTML = icon('settings'); toolsButton.setAttribute('aria-label', 'Mở công cụ tu học');
    document.querySelector('.header-container').append(toolsButton);
    document.body.insertAdjacentHTML('beforeend', `<dialog id="dharma-tools-dialog" class="dharma-dialog" aria-labelledby="dharma-tools-title"><header><h2 id="dharma-tools-title">Công cụ tu học</h2><button id="dharma-tools-close" class="dp-icon" aria-label="Đóng">${icon('close')}</button></header><div class="dharma-tools-links">${[['appendix', 'Đối chiếu kinh điển'], ['glossary', 'Từ điển Pāḷi'], ['notes', 'Sổ tay tu học'], ['roadmap', 'Lộ trình pháp hành'], ['milinda', 'Vấn đáp Mi Tiên'], ['practical', 'Ứng dụng đời thường'], ['timer', 'Tọa thiền & chuông']].map(([id, text]) => `<button data-tool-nav="${id}" class="r-button">${text}</button>`).join('')}</div></dialog>`);
    toolsButton.onclick = () => $('dharma-tools-dialog').showModal(); $('dharma-tools-close').onclick = () => $('dharma-tools-dialog').close();
    document.querySelectorAll('[data-tool-nav]').forEach(b => b.onclick = () => { $('dharma-tools-dialog').close(); navigate(b.dataset.toolNav); });
    $('global-search').addEventListener('input', e => { if (!window.ContentModules?.isModule(appState.currentTab) && !['home', 'phucminh', 'daitang', 'daithua', 'daitanghan', 'glossary', 'milinda', 'practical'].includes(appState.currentTab)) { const query = e.target.value; switchTab('home'); e.target.value = query; } }, true);
    document.querySelector('.brand-wrapper').onclick = () => navigate('home');
    const brandLink = document.querySelector('.brand-wrapper');
    brandLink.setAttribute('role', 'button'); brandLink.tabIndex = 0;
    brandLink.setAttribute('aria-label', 'Chánh Pháp — về trang chủ');
    brandLink.onkeydown = e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); navigate('home'); } };
    document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !$('reader-view-container').classList.contains('active') && !document.querySelector('dialog[open]')) { e.preventDefault(); e.stopImmediatePropagation(); search(); } }, true);
    designHome();
    const section = document.createElement('section'); section.id = 'tab-album'; section.className = 'tab-panel dharma-album'; section.style.display = 'none'; section.setAttribute('aria-label', 'Bộ kinh và danh sách phẩm'); document.querySelector('main').append(section);
    const playlistSection = document.createElement('section'); playlistSection.id = 'tab-daily'; playlistSection.className = 'tab-panel'; playlistSection.style.display = 'none'; document.querySelector('main').append(playlistSection);
    $('ds-create').onclick = () => { $('ds-create-dialog').showModal(); $('ds-playlist-name').focus(); };
    const shelfCreate = document.createElement('button'); shelfCreate.id = 'shelf-create-playlist'; shelfCreate.className = 'r-button'; shelfCreate.textContent = '+ Tạo danh sách tu học'; shelfCreate.onclick = $('ds-create').onclick;
    $('tab-shelf').querySelector('.section-heading').append(shelfCreate);
    const shelfPlaylists = document.createElement('div'); shelfPlaylists.id = 'shelf-playlists'; $('tab-shelf').append(shelfPlaylists);
    $('ds-create-close').onclick = () => $('ds-create-dialog').close();
    const pickerSearch=document.createElement('input');pickerSearch.id='ds-playlist-search';pickerSearch.type='search';pickerSearch.placeholder='Tìm tên hoặc mã sách trong toàn thư viện';pickerSearch.setAttribute('aria-label','Tìm sách thêm vào danh sách nghe');$('ds-playlist-books').before(pickerSearch);
    document.querySelector('label[for="ds-playlist-books"]').textContent='Tìm và thêm từng sách; dùng nút lên/xuống để xếp thứ tự.';
    const playlistBooks=()=>LibraryCatalog.all().filter(x=>Reader.path(x,'viet')&&ReaderModel.normalize(x.title+' '+x.id+' '+LibraryCatalog.names[x.type]).includes(ReaderModel.normalize(pickerSearch.value)));
    LibraryCatalog.renderSelect($('ds-playlist-books'),playlistBooks());pickerSearch.oninput=()=>LibraryCatalog.renderSelect($('ds-playlist-books'),playlistBooks());
    $('ds-create-form').onsubmit = e => {
      e.preventDefault(); const name = $('ds-playlist-name').value.trim(), items = [...$('ds-playlist-books').selectedOptions].map(o => {const item=LibraryCatalog.get(o.value);return {type:item.type,id:item.id,title:item.title};});
      if (!name || !items.length) return;
      const list = LibraryStore.read('dharma-playlists', []); list.push({ id: crypto.randomUUID(), name, items });
      if (LibraryStore.write('dharma-playlists', list)) { $('ds-create-dialog').close(); $('ds-create-form').reset();LibraryCatalog.setSelection($('ds-playlist-books'),[]); refreshSidebar(); }
    };
    UI.bindCompanion(); P.init(); UI.init(); window.ListeningHistory?.init();
    P.subscribe(() => { refreshSidebar(); updateAlbum(); });
    window.addEventListener('library-storage-error', () => P.message('Bộ nhớ thiết bị đã đầy hoặc bị chặn. Bạn vẫn có thể đọc và nghe; dữ liệu mới chưa được lưu.'));
    const observer = new MutationObserver(refreshSidebar); observer.observe($('favorite-books'), { childList: true });
    onTab(appState.currentTab);
  }
  function search() { navigate('home'); $('global-search').focus(); }
  function designHome() {
    const hero = document.querySelector('.sanctuary-hero'), copy = hero.querySelector('.hero-copy');
    copy.querySelector('.eyebrow').innerHTML = LibraryArt.svg('wheel') + '<span>VĂN · TƯ · TU</span>';
    copy.querySelector('h2').innerHTML = 'Gìn giữ lời kinh.<br><em>Nuôi dưỡng tuệ giác.</em>';
    copy.querySelector('p').textContent = 'Một không gian thanh tịnh để đọc, lắng nghe và tìm hiểu kinh điển. Mở một trang sách, dành một khoảng lặng cho tâm.';
    copy.querySelector('.hero-signature')?.remove();
    const artwork = copy.querySelector('.hero-art'); if (artwork) { hero.append(artwork); artwork.innerHTML = LibraryArt.svg('mandala', 'sanctuary-mandala') + '<span class="hero-art-caption">TỊNH TÂM · SÁNG TUỆ</span>'; }
    hero.insertAdjacentHTML('beforeend', '<div class="sanctuary-corners" aria-hidden="true">' + LibraryArt.svg('corner') + LibraryArt.svg('corner') + '</div><span class="hero-colophon" aria-hidden="true">CHÁNH PHÁP · TÀNG KINH CÁC</span>');
    const discovery = hero.querySelector('.home-discovery'); hero.after(discovery);
    discovery.querySelector('.section-heading')?.remove(); discovery.querySelector('.search-suggestions')?.remove();
    $('hero-explore').innerHTML = icon('play') + ' Bắt đầu lắng nghe'; $('hero-explore').onclick = () => P.toggle();
    $('hero-shelf').textContent = 'Khám phá kho kinh →'; $('hero-shelf').onclick = () => navigate('daithua');
    const welcome = document.createElement('div'); welcome.className = 'dharma-welcome';
    welcome.innerHTML = '<div><span class="eyebrow">THƯ VIỆN PHẬT GIÁO</span><h2>Tìm về bên trang kinh</h2></div><span class="dw-presence">' + LibraryArt.svg('lotus') + ' Một ngày an lành</span>'; hero.before(welcome);
    document.querySelector('.noble-footer .lotus-divider')?.classList.replace('lotus-divider', 'sanctuary-divider');
    const featured = document.querySelector('.featured-section');
    featured.querySelector('.section-heading h2').textContent = 'Lời kinh cho tâm an';
    featured.querySelector('.eyebrow').textContent = 'TUYỂN CHỌN CHO BẠN';
    featured.querySelector('.section-heading > span').textContent = 'Khám phá & lắng nghe';
    const codes = ['T08n0251', 'T12n0366', 'T14n0450', 'T09n0262'];
    featured.querySelectorAll('.featured-book').forEach((card, i) => {
      const data = DAI_THUA_DATA.find(x => x.taishoId === codes[i] && x.files.vietMd) || DAI_TANG_HAN_DATA.texts.find(x => x.id === codes[i] && x.vietFile);
      if (!data) return;
      const ref = { type: data.files ? 'daithua' : 'daitang', data };
      const cover = card.querySelector('.book-cover'); cover.tabIndex = 0; cover.setAttribute('role', 'button'); cover.setAttribute('aria-label', 'Xem bộ kinh ' + (data.vietTitle || data.title)); cover.onclick = () => openAlbum(ref);
      cover.onkeydown = e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); openAlbum(ref); } };
      const detail = document.createElement('button'); detail.className = 'featured-detail'; detail.innerHTML = 'Xem các phẩm <span>↗</span>'; detail.onclick = () => openAlbum(ref); card.append(detail);
    });
    document.querySelector('.listening-invitation').hidden = true;
  }
  function onTab(id) {
    if (!initialized) return;
    document.querySelector('.header-container').insertBefore($('dharma-search'), document.querySelector('.header-container > .header-actions'));
    $('dharma-search').hidden = false;
    document.querySelectorAll('[data-dharma-nav], [data-mobile-nav]').forEach(b => { const active = (b.dataset.dharmaNav || b.dataset.mobileNav) === id; b.classList.toggle('active', active); if (active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    document.querySelectorAll('.content-source-nav, .content-mobile-sources').forEach(d => { const active = !!d.querySelector('.active'); d.classList.toggle('has-active', active); if (active) d.open = true; });
    document.body.dataset.dharmaTab = id;
    if (id === 'listening-history' || id === 'home') window.ListeningHistory?.refresh();
    refreshSidebar();
    window.TouchUX?.onTab(id);
  }
  function refreshSidebar() {
    if (!$('ds-books')) return;
    const books = LibraryStore.read('favorites', []), recent = LibraryStore.read('recent', []), playlists = LibraryStore.read('dharma-playlists', []);
    const display = books.length ? books : recent.slice(0, 4), signature = JSON.stringify([display, playlists]);
    if (signature === shelfSignature) return; shelfSignature = signature;
    $('ds-books').innerHTML = display.slice(0, 6).map((x, i) => `<button class="ds-book" data-side-book="${i}"><span class="ds-book-cover cover-${i % 4}">${LibraryArt.svg('lotus')}</span><span><strong>${esc(x.title)}</strong><small>${books.length ? 'Kinh đã lưu' : 'Gần đây'} · Bản tiếng Việt</small></span></button>`).join('') || '<p class="ds-empty">Tủ sách bắt đầu từ một bản kinh bạn tâm đắc.<br><span>Chạm ♡ để lưu lại.</span></p>';
    $('ds-books').querySelectorAll('[data-side-book]').forEach(b => b.onclick = () => openAlbum(display[+b.dataset.sideBook]));
    $('ds-books').querySelectorAll('[data-side-book]').forEach(b => {
      b.querySelector('.ds-book-cover').innerHTML = LibraryDesign.jacket(display[+b.dataset.sideBook], { mini: true });
    });
    $('ds-playlists').innerHTML = playlists.map((x, i) => `<button class="ds-playlist" data-playlist="${i}">${icon('queue')}<span><strong>${esc(x.name)}</strong><small>${x.items.length} bản kinh</small></span></button>`).join('');
    $('ds-playlists').querySelectorAll('button').forEach(b => b.onclick = () => showPlaylist(playlists[+b.dataset.playlist]));
    $('shelf-playlists').innerHTML = playlists.length ? '<h2 class="shelf-playlists-title">Danh sách tu học của bạn</h2>' : '';
    playlists.forEach(playlist => { const b = document.createElement('button'); b.className = 'ds-playlist'; b.innerHTML = icon('queue') + `<span><strong>${esc(playlist.name)}</strong><small>${playlist.items.length} bản kinh</small></span>`; b.onclick = () => showPlaylist(playlist); $('shelf-playlists').append(b); });
  }
  async function openAlbum(ref) {
    const item = P.resolve(ref); if (!item) return;
    if (item.type === 'ebooks') { navigate('daitang'); DaiTang.details(item.id); return; }
    if (item.type === 'phucminh') { navigate('phucminh'); PhucMinh.details(item.id); return; }
    albumRequest?.abort(); albumRequest = new AbortController(); const request = albumRequest;
    album = item; switchTab('album', {hash:'#album/' + encodeURIComponent(item.key)});
    const ctx = SutraContext.getByItem(item), cover = ['T08n0251', 'T12n0366', 'T14n0450', 'T09n0262'].indexOf(item.data.taishoId || item.id);
    $('tab-album').style.setProperty('--album-tone', ['#64834d40', '#ac784e40', '#497c9440', '#976f9840'][Math.max(0, cover)]);
    $('tab-album').innerHTML = `<button class="album-back r-button" id="album-back">← Khám phá</button><div class="album-hero"><div class="book-cover cover-${Math.max(0, cover)}"><span>${esc(item.data.taishoId || item.id)}</span>${LibraryArt.svg('lotus', 'cover-wheel')}<h3>${esc(item.title)}</h3><small>TỦ SÁCH CHÁNH PHÁP</small></div><div><span class="eyebrow">${item.type === 'daithua' ? 'BỘ KINH ĐẠI THỪA' : 'ĐẠI TẠNG KINH HÁN'}</span><h1>${esc(item.title)}</h1><p>${esc(ctx?.translator || 'Thông tin dịch giả xem trong bản nguồn')}</p><span id="album-meta">Đang tải mục lục…</span></div></div><div class="album-actions"><button id="album-play" class="r-primary">${icon('play')} Nghe kinh</button><button id="album-save" class="r-button">♡ Lưu kinh</button><button id="album-queue" class="r-button">+ Thêm hàng đợi</button><button id="album-read" class="r-button">Đọc & đối chiếu ↗</button></div><p class="album-description">${esc(ctx?.significance || 'Mở bản Việt để đọc và lắng nghe. Chọn từng phẩm trong mục lục để bắt đầu từ phần bạn muốn học.')}</p><div class="album-track-heading"><span>#</span><span>PHẨM / PHẦN KINH</span><span>TRẠNG THÁI</span></div><div id="album-tracks" aria-live="polite"><p class="dp-help">Đang chuẩn bị các phần kinh…</p></div>`;
    LibraryDesign.fillCover($('tab-album').querySelector('.book-cover'), item);
    $('tab-album').querySelector('.album-hero > div:last-child > p').textContent = LibraryDesign.creditLine(item) || (Reader.path(item, 'viet') ? 'Bản tiếng Việt · Hán văn đối chiếu' : 'Nguyên tác Hán văn');
    LibraryDesign.refresh();
    $('album-back').onclick = () => navigate('home');
    $('album-play').onclick = () => P.playItem(item);
    $('album-save').onclick = () => { const list = LibraryStore.read('favorites', []); const found = list.some(x => x.key === item.key); LibraryStore.write('favorites', found ? list.filter(x => x.key !== item.key) : [{ type: item.type, id: item.id, key: item.key, title: item.title }, ...list]); LibraryUI.refreshShelf(); LibraryUI.decorate(); updateAlbum(); };
    $('album-queue').onclick = () => { P.enqueue(item); UI.showCompanion('queue'); };
    const read = $('album-read'); read.innerHTML = icon('book') + ' Đọc kinh';
    $('album-play').before(read);
    read.onclick = () => LibraryUI.open(item.type, item.id);
    read.disabled = !Reader.path(item, 'viet') && !Reader.path(item, 'han');
    $('tab-album').querySelector('.album-track-heading > span:last-child').textContent = 'ĐỌC / NGHE';
    const source = Reader.path(item, 'viet'); $('album-play').disabled = $('album-queue').disabled = !source;
    if (!source) { $('album-meta').textContent = 'Hán văn · Chưa có bản tiếng Việt'; $('album-tracks').textContent = 'Bản này hiện hỗ trợ đọc nguyên tác Hán văn.'; return; }
    try {
      const response = await fetch(source, { signal: request.signal }); if (!response.ok) throw new Error('Chưa tải được mục lục. Hãy thử mở lại bộ kinh.');
      const doc = ReaderModel.parse(await response.text()); if (request !== albumRequest) return;
      let chapters = doc.blocks.filter(x => x.kind === 'heading' && /[a-zA-ZÀ-ỹ]/.test(Audiobook.plain(x.raw)));
      if (!chapters.length) chapters = [doc.blocks.find(x => !['metadata', 'note', 'contents', 'running'].includes(x.kind) && /[a-zA-ZÀ-ỹ]/.test(Audiobook.plain(x.raw)))].filter(Boolean);
      $('album-meta').textContent = `${chapters.length} phần · Bản tiếng Việt${ctx?.readingMinutes ? ` · Khoảng ${SutraContext.estimateListening(ctx.readingMinutes)} phút nghe` : ''}`;
      $('album-tracks').replaceChildren();
      chapters.forEach((chapter, i) => {
        const title = chapter.heading?.title || chapter.text.slice(0, 100) || 'Toàn kinh';
        const row = document.createElement('article'); row.className = 'album-track'; row.dataset.blockId = chapter.id;
        row.innerHTML = `<span class="track-number">${String(i + 1).padStart(2, '0')}</span><div class="track-info"><strong>${esc(title)}</strong><small>Bản tiếng Việt</small></div><div class="track-actions"><button class="r-button track-read">${icon('book')}<span>Đọc</span></button><button class="r-button track-listen">${icon('play')}<span>Nghe</span></button></div>`;
        const read = row.querySelector('.track-read'), listen = row.querySelector('.track-listen');
        read.title = read.ariaLabel = 'Đọc phần này: ' + title;
        read.onclick = () => LibraryUI.open(item.type, item.id, 'viet', chapter.id);
        listen.title = listen.ariaLabel = 'Nghe từ phần này: ' + title;
        listen.onclick = () => P.playItem(item, { block: chapter.id });
        $('album-tracks').append(row);
      });
      updateAlbum();
    } catch (error) { if (error.name !== 'AbortError' && request === albumRequest) { $('album-meta').textContent = 'Chưa có mục lục'; $('album-tracks').textContent = error.message; } }
  }
  function updateAlbum() {
    if (!album || !$('album-save')) return;
    const saved = LibraryStore.read('favorites', []).some(x => x.key === album.key); $('album-save').textContent = saved ? '♥ Đã lưu' : '♡ Lưu kinh'; $('album-save').setAttribute('aria-pressed', String(saved));
    const s = P.state, currentBlock = s.item?.key === album.key ? s.chunks[s.playback.index]?.block : null;
    const currentIndex = s.chunks.findIndex(x => x.block === currentBlock);
    let currentTrack = null;
    $('album-tracks').querySelectorAll('[data-block-id]').forEach(b => { const at = s.chunks.findIndex(x => x.block === b.dataset.blockId); if (currentBlock && at >= 0 && at <= currentIndex) currentTrack = b; b.classList.remove('active'); });
    currentTrack?.classList.add('active');
  }
  function showPlaylist(playlist) {
    if ($('reader-view-container').classList.contains('active')) Reader.close({route:false});
    switchTab('daily');
    $('tab-daily').innerHTML = `<div class="playlist-hero"><span class="eyebrow">KHÓA TỤNG CỦA BẠN</span><h1>${esc(playlist.name)}</h1><p>${playlist.items.length} bản kinh · Lắng nghe theo thứ tự bạn chọn</p><button id="daily-play" class="r-primary">${icon('play')} Nghe trọn danh sách</button></div><div id="daily-tracks"></div>`;
    $('daily-play').onclick = () => { CollectionPlayer.start(playlist.name, playlist.items); UI.showCompanion('queue'); };
    const hero = $('tab-daily').querySelector('.playlist-hero');
    const body = document.createElement('div'); body.append(...hero.childNodes); hero.append(body);
    hero.insertAdjacentHTML('afterbegin', LibraryDesign.jacket(null, { title: playlist.name, collection: 'KHÓA TỤNG CHÁNH PHÁP', code: playlist.items.length + ' BẢN KINH', tone: 3 }));
    LibraryDesign.refresh();
    playlist.items.forEach((ref, i) => {
      const item = P.resolve(ref); if (!item) return;
      const row = document.createElement('article'); row.className = 'album-track'; row.dataset.bookKey = item.key;
      row.innerHTML = `<span class="track-number">${i + 1}</span><div class="track-info"><button class="track-title"><strong>${esc(item.title)}</strong></button><small>Xem bản kinh & các phẩm</small></div><div class="track-actions"><button class="r-button track-read">${icon('book')}<span>Đọc</span></button><button class="r-button track-listen">${icon('play')}<span>Nghe</span></button></div>`;
      row.querySelector('.track-title').onclick = () => openAlbum(item);
      const read = row.querySelector('.track-read'), listen = row.querySelector('.track-listen');
      read.title = read.ariaLabel = 'Đọc kinh: ' + item.title;
      read.disabled = !Reader.path(item, 'viet') && !Reader.path(item, 'han');
      read.onclick = () => LibraryUI.open(item.type, item.id);
      listen.title = listen.ariaLabel = 'Nghe kinh: ' + item.title;
      listen.disabled = !Reader.path(item, 'viet'); listen.onclick = () => P.playItem(item);
      $('daily-tracks').append(row);
    });
    window.ModulePresentation?.decorate('daily', $('tab-daily'), {title:playlist.name,description:playlist.items.length + ' bản kinh · Lắng nghe theo thứ tự bạn chọn.'});
  }
  function openDaily() {
    const codes = ['T08n0251', 'T12n0366', 'T14n0450'];
    const items = codes.map(code => { const data = DAI_THUA_DATA.find(x => x.taishoId === code && x.files?.vietMd) || DAI_TANG_HAN_DATA.texts.find(x => x.id === code && x.vietFile); return data ? { type: data.files ? 'daithua' : 'daitang', id: data.id, title: data.vietTitle || data.title } : null; }).filter(Boolean);
    showPlaylist({ name: 'Một thời kinh an lành', items });
  }
  window.DharmaShell = { init, onTab, navigate, openDaily, openAlbum, refreshSidebar, albumRef:()=>album?{type:album.type,id:album.id}:null };
})();

/* Đại Tạng Kinh: a separate collection using the shared reading and listening tools. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), S = window.LibraryStore;
  const esc = PersistentPlayer.esc, icon = PersistentPlayer.icon;
  const books = window.DAI_TANG_KINH_DATA, groups = window.DAI_TANG_KINH_GROUPS;
  const lookup = new Map(books.map(b => [b.id, b]));
  const ref = b => ({ type: 'ebooks', id: b.id, data: b });
  const key = b => 'ebooks:' + b.id;
  const pageSize = 30;
  let category = 'all', topic = 'all', savedOnly = false, availability = 'all', sort = 'featured', page = 1;
  let layout = S.read('ep-layout', 'cards'), filtered = [], query = '';
  const isSaved = b => S.read('favorites', []).some(x => x.key === key(b));
  const jacket = b => LibraryDesign.jacket(ref(b), { className: 'pm-cover', code: b.subcategory, colophon: 'BẢN VIỆT NGỮ' });
  const time = n => n >= 60 ? Math.floor(n / 60) + ' giờ' + (n % 60 ? ' ' + n % 60 + ' phút' : '') : n + ' phút';
  const statusLabel = b => b.status === 'missing' ? 'Chưa có bản chữ' : b.status === 'partial' ? 'Bản nguồn thiếu phần' : 'Đọc & nghe';
  function status(message) { $('ep-status').textContent = message; }
  function save(id) {
    const b = lookup.get(id); if (!b) return;
    const list = S.read('favorites', []), saved = isSaved(b);
    S.write('favorites', saved ? list.filter(x => x.key !== key(b)) : [{ type: 'ebooks', id, key: key(b), title: b.title }, ...list]);
    LibraryUI.refreshShelf(); render();
    if ($('ep-detail-save')) $('ep-detail-save').textContent = isSaved(b) ? '♥ Đã lưu' : '♡ Lưu sách';
    status(saved ? 'Đã bỏ lưu ' + b.title + '.' : 'Đã lưu ' + b.title + ' vào tủ sách.');
  }
  async function read(id) {
    const b = lookup.get(id); if (!b) return;
    if (!b.vietFile) return details(id);
    if ($('ep-detail').open) $('ep-detail').close();
    await Reader.open(ref(b), 'viet');
  }
  async function listen(id) {
    const b = lookup.get(id); if (!b?.vietFile) return;
    if ($('ep-detail').open) $('ep-detail').close();
    status('Đang chuẩn bị giọng đọc: ' + b.title + '…');
    const played = await DharmaPlayerStore.playItem(ref(b));
    status(played ? 'Đang nghe ' + b.title + '. Giọng đọc, tốc độ và hẹn giờ ở thanh nghe.' : DharmaPlayerStore.state.error || 'Chưa phát được. Hãy thử lại ở thanh nghe.');
    refreshContinue();
  }
  function enqueue(id) {
    const b = lookup.get(id); if (!b?.vietFile) return;
    DharmaPlayerStore.enqueue(ref(b)); status('Đã thêm ' + b.title + ' vào hàng đợi nghe.');
  }
  function refreshContinue() {
    if (!$('ep-continue')) return;
    const recent = S.read('recent', []).find(x => x.type === 'ebooks' && lookup.get(x.id)?.vietFile);
    const b = recent && lookup.get(recent.id);
    $('ep-continue').hidden = !b;
    if (!b) return;
    $('ep-continue').innerHTML = `<div><span class="eyebrow">TIẾP NỐI VIỆC TU HỌC</span><strong>${esc(b.title)}</strong><span>Tiếp tục từ vị trí đọc đã lưu</span></div><button class="r-button" data-ep-action="read" data-id="${b.id}">Đọc tiếp →</button><button class="r-button" data-ep-action="listen" data-id="${b.id}">${icon('play')} Nghe tiếp</button>`;
  }
  function topics() {
    const values = [...new Set(books.filter(b => category === 'all' || b.groups.includes(category)).flatMap(b => b.topics))].sort((a, b) => a.localeCompare(b, 'vi'));
    if (!values.includes(topic)) topic = 'all';
    $('ep-topic').innerHTML = '<option value="all">Tất cả chủ đề</option>' + values.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
    $('ep-topic').value = topic;
  }
  function render() {
    if (!$('ep-books')) return;
    const nextQuery = appState.currentTab === 'daitang' ? appState.searchQuery || '' : query;
    if (query !== nextQuery) { query = nextQuery; page = 1; }
    $('ep-search').value = query;
    const q = ReaderModel.normalize(query);
    filtered = books.filter(b => (category === 'all' || b.groups.includes(category)) &&
      (topic === 'all' || b.topics.includes(topic)) && (!savedOnly || isSaved(b)) &&
      (availability === 'all' || availability === 'audio' && b.vietFile || availability === 'partial' && b.status === 'partial' || availability === 'missing' && !b.vietFile) &&
      ReaderModel.normalize([b.title, ...b.groups, ...b.topics, ...b.credits.map(c => c.name), ...b.sources.map(s => s.filename)].join(' ')).includes(q));
    if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title, 'vi', { numeric: true }));
    if (sort === 'short') filtered.sort((a, b) => (a.listenMinutes || Infinity) - (b.listenMinutes || Infinity));
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize)); page = Math.min(page, pages);
    const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
    const active = document.activeElement, focusId = active?.dataset.id, focusAction = active?.dataset.epAction;
    $('ep-count').textContent = `${filtered.length.toLocaleString('vi')} / ${books.length.toLocaleString('vi')} tài liệu`;
    $('ep-books').classList.toggle('ep-list-view', layout === 'list');
    $('ep-books').innerHTML = visible.map(b => {
      const saved = isSaved(b), position = S.read('position:' + key(b) + ':viet', null);
      return `<article class="pm-card ep-card"><button class="pm-cover-button" data-ep-action="details" data-id="${b.id}" aria-label="Thông tin ${esc(b.title)}">${jacket(b)}</button><div class="pm-card-body"><small>${esc(b.category)} · ${esc(b.subcategory)}</small><h3><button data-ep-action="details" data-id="${b.id}">${esc(b.title)}</button></h3>${b.credits.length ? `<p class="pm-byline">${b.credits.slice(0, 2).map(c => `<span>${esc(c.role)}: <strong>${esc(c.name)}</strong></span>`).join('')}</p>` : ''}<p class="pm-card-meta">${b.vietFile ? 'Nghe khoảng ' + time(b.listenMinutes) + ' · ' : ''}<span class="ep-state ep-state-${b.status}">${statusLabel(b)}</span></p>${position ? '<span class="pm-progress-label">Có vị trí đọc đã lưu</span>' : ''}<div class="pm-card-actions"><button class="r-primary" data-ep-action="${b.vietFile ? 'read' : 'details'}" data-id="${b.id}">${b.vietFile ? position ? 'Đọc tiếp' : 'Đọc sách' : 'Thông tin nguồn'} →</button><button class="r-button" data-ep-action="listen" data-id="${b.id}" ${b.vietFile ? '' : 'disabled title="Nguồn chưa có văn bản để nghe"'}>${icon('play')} Nghe</button></div><div class="pm-card-secondary"><button class="r-button" data-ep-action="save" data-id="${b.id}" aria-pressed="${saved}" aria-label="${saved ? 'Bỏ lưu' : 'Lưu'} ${esc(b.title)}">${saved ? '♥ Đã lưu' : '♡ Lưu sách'}</button><a class="r-button" href="${esc(b.sourceFile)}" download="${esc(b.filename)}">Word gốc ↓</a></div></div></article>`;
    }).join('');
    $('ep-empty').hidden = !!filtered.length;
    $('ep-pagination').hidden = !filtered.length;
    $('ep-page').textContent = `Trang ${page} / ${pages}`;
    $('ep-previous').disabled = page === 1; $('ep-next').disabled = page === pages;
    $('ep-page-number').max = pages; $('ep-page-number').value = page;
    $('ep-listen-page').disabled = !visible.some(b => b.vietFile);
    document.querySelectorAll('[data-ep-category]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.epCategory === category)));
    document.querySelectorAll('[data-ep-layout]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.epLayout === layout)));
    $('ep-saved').setAttribute('aria-pressed', String(savedOnly));
    refreshContinue(); LibraryDesign.refresh();
    if (focusId && focusAction) $('ep-books').querySelector(`[data-ep-action="${focusAction}"][data-id="${focusId}"]`)?.focus({ preventScroll: true });
  }
  function reset() {
    category = topic = 'all'; savedOnly = false; availability = 'all'; sort = 'featured'; page = 1; query = '';
    appState.searchQuery = ''; $('global-search').value = ''; $('ep-availability').value = 'all'; $('ep-sort').value = 'featured';
    topics(); render(); $('ep-search').focus();
  }
  function goPage(number) {
    page = Math.max(1, Math.min(Math.ceil(filtered.length / pageSize) || 1, Number(number) || 1)); render();
    $('ep-catalog').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    $('ep-catalog-title').focus({ preventScroll: true });
  }
  async function offline(id) {
    const b = lookup.get(id); if (!b?.vietFile) return;
    const button = $('ep-detail-offline'); button.disabled = true;
    try { await LibraryOffline.saveBook(DharmaPlayerStore.resolve(ref(b)), message => $('ep-detail-status').textContent = message); $('ep-detail-status').textContent = 'Đã lưu bản chữ và Word gốc để đọc ngoại tuyến.'; }
    catch (error) { $('ep-detail-status').textContent = error.message; }
    finally { button.disabled = false; }
  }
  async function details(id) {
    const b = lookup.get(id); if (!b) return;
    try{await LibraryCatalog.hydrate(ref(b));}catch(e){status(e.message);return;}
    const credits = b.credits.map(c => `<div><dt>${esc(c.role)}</dt><dd>${esc(c.name)}</dd></div>`).join('');
    $('ep-detail-content').innerHTML = `<div class="pm-detail-layout">${jacket(b)}<div><span class="eyebrow">ĐẠI TẠNG KINH · ${esc(b.category)}</span><h2 id="ep-detail-title">${esc(b.title)}</h2><p>${esc(b.subcategory)}</p><dl>${credits}<div><dt>Bản đọc</dt><dd>${statusLabel(b)}</dd></div><div><dt>Nghe ước tính</dt><dd>${b.vietFile ? time(b.listenMinutes) : 'Chưa có văn bản'}</dd></div><div><dt>Word gốc</dt><dd>${(b.bytes / 1048576).toLocaleString('vi', { maximumFractionDigits: 1 })} MB</dd></div></dl></div></div>${b.sourceNotes.length ? `<div class="pm-detail-note">${b.sourceNotes.map(note => `<p>${esc(note)}</p>`).join('')}</div>` : ''}<div class="pm-detail-actions"><button id="ep-detail-read" class="r-primary" ${b.vietFile ? '' : 'disabled'}>Đọc sách →</button><button id="ep-detail-listen" class="r-button" ${b.vietFile ? '' : 'disabled'}>${icon('play')} Nghe</button><button id="ep-detail-queue" class="r-button" ${b.vietFile ? '' : 'disabled'}>+ Hàng đợi</button><button id="ep-detail-save" class="r-button">${isSaved(b) ? '♥ Đã lưu' : '♡ Lưu sách'}</button><button id="ep-detail-offline" class="r-button" ${b.vietFile ? '' : 'disabled'}>Lưu ngoại tuyến</button></div><details class="ep-sources"><summary>Bản nguồn & thông tin đối chiếu</summary><p>Bản chữ được chuyển từ Word và giữ để đối chiếu với tài liệu gốc. Giọng đọc tổng hợp tiếng Việt.</p>${b.sources.map(s => `<a class="r-button" href="${esc(s.file)}" download="${esc(s.filename)}">${esc(s.filename)} ↓</a>`).join('')}${b.vietFile ? `<a class="r-button" href="${esc(b.vietFile)}" download="${esc(b.title)}.md">Tải bản chữ ↓</a>` : ''}</details><p id="ep-detail-status" role="status" aria-live="polite"></p>`;
    $('ep-detail-read').onclick = () => read(id); $('ep-detail-listen').onclick = () => listen(id);
    $('ep-detail-queue').onclick = () => { enqueue(id); $('ep-detail-status').textContent = 'Đã thêm vào hàng đợi nghe.'; };
    $('ep-detail-save').onclick = () => save(id); $('ep-detail-offline').onclick = () => offline(id);
    if (!$('ep-detail').open) $('ep-detail').showModal(); LibraryDesign.refresh();
  }
  function decorateHome() {
    const entry = document.createElement('section'); entry.className = 'pm-home-entry ep-home-entry home-section';
    entry.innerHTML = `<div class="pm-home-symbol" aria-hidden="true">${LibraryArt.svg('book')}</div><div><span class="eyebrow">KINH SÁCH PHẬT GIÁO VIỆT NGỮ</span><h2>Đại Tạng Kinh</h2><p>${books.length.toLocaleString('vi')} tài liệu · Kinh, luận, giảng giải và sách tu học.<br>Mở trang kinh, lắng nghe và tiếp nối việc học mỗi ngày.</p></div><button class="r-primary" id="ep-home-open">Khám phá tàng kinh →</button>`;
    document.querySelector('.pm-home-entry')?.after(entry);
    if (!entry.isConnected) document.querySelector('.featured-section').before(entry);
    $('ep-home-open').onclick = () => switchTab('daitang');
  }
  function init() {
    const section = document.createElement('section'); section.id = 'tab-daitang'; section.className = 'tab-panel pm-module ep-module'; section.style.display = 'none'; section.setAttribute('role', 'tabpanel'); section.setAttribute('aria-labelledby', 'nav-daitang');
    section.innerHTML = `<div class="pm-hero ep-hero"><div><span class="eyebrow">KHO KINH SÁCH PHẬT GIÁO VIỆT NGỮ</span><h1>Đại Tạng Kinh</h1><p>Gìn giữ lời kinh. Nuôi dưỡng tuệ giác.<br>Kinh, luận và những trang sách đồng hành cùng việc tu học.</p><a href="#ep-catalog" class="r-primary">Chọn đọc · Chọn nghe ↓</a></div><div class="pm-hero-art" aria-hidden="true">${LibraryArt.svg('book')}<span>VĂN · TƯ · TU</span></div><div class="pm-hero-facts"><span><strong>${books.length.toLocaleString('vi')}</strong> tài liệu</span><span><strong>${books.filter(b => b.vietFile).length.toLocaleString('vi')}</strong> bản đọc & nghe</span><span><strong>${groups.length}</strong> nhóm tu học</span></div></div><section class="pm-continue" id="ep-continue" aria-label="Tiếp tục đọc" hidden></section><div class="pm-paths"><span>GỢI Ý BẮT ĐẦU</span>${books.filter(b => b.featured).slice(0, 3).map((b, i) => `<button data-ep-action="details" data-id="${b.id}"><small>0${i + 1} · ${esc(b.subcategory)}</small><strong>${esc(b.title)}</strong><span>Khám phá →</span></button>`).join('')}</div><section id="ep-catalog" class="pm-catalog" aria-labelledby="ep-catalog-title"><div class="pm-catalog-heading"><div><span class="eyebrow">CHỌN ĐỌC · CHỌN NGHE</span><h2 id="ep-catalog-title" tabindex="-1">Kinh sách trong tàng kinh</h2></div><span id="ep-count" role="status"></span></div><div class="pm-filter-bar ep-filter-bar"><label class="pm-search-label" for="ep-search">Tìm trong Đại Tạng Kinh<input id="ep-search" type="search" placeholder="Tên kinh, tác giả, người dịch… (có thể gõ không dấu)"></label><label for="ep-topic">Chủ đề<select id="ep-topic"></select></label><label for="ep-availability">Bản đọc<select id="ep-availability"><option value="all">Tất cả tài liệu</option><option value="audio">Có thể đọc & nghe</option><option value="partial">Nguồn ghi thiếu phần</option><option value="missing">Chưa có bản chữ</option></select></label><label for="ep-sort">Sắp xếp<select id="ep-sort"><option value="featured">Gợi ý của thư viện</option><option value="title">Tên sách A–Z</option><option value="short">Nghe ngắn trước</option></select></label></div><div class="pm-categories ep-categories" aria-label="Lọc nhóm kinh sách"><button data-ep-category="all" aria-pressed="true">Tất cả</button>${groups.map(g => `<button data-ep-category="${esc(g.name)}" aria-pressed="false">${esc(g.name)} <span>${g.count}</span></button>`).join('')}<button id="ep-saved" aria-pressed="false">♡ Đã lưu</button></div><div class="ep-catalog-tools"><div role="group" aria-label="Cách hiển thị"><button class="r-button" data-ep-layout="cards" aria-pressed="true">▦ Thẻ</button><button class="r-button" data-ep-layout="list" aria-pressed="false">☷ Danh sách</button></div><button id="ep-listen-page" class="r-button">${icon('play')} Nghe lần lượt trang này</button></div><p id="ep-status" class="pm-status" role="status" aria-live="polite"></p><div id="ep-books" class="pm-books"></div><div id="ep-empty" class="pm-empty" hidden><h3>Chưa tìm thấy sách phù hợp</h3><p>Thử tên kinh ngắn hơn hoặc chọn lại nhóm sách.</p><button id="ep-reset" class="r-button">Xóa bộ lọc</button></div><nav id="ep-pagination" class="ep-pagination" aria-label="Trang danh mục"><button id="ep-previous" class="r-button">← Trang trước</button><span id="ep-page" role="status"></span><label for="ep-page-number">Đến trang<input id="ep-page-number" type="number" min="1" value="1"></label><button id="ep-next" class="r-button">Trang tiếp →</button></nav></section>`;
    document.querySelector('main').append(section);
    const nav = document.createElement('button'); nav.id = 'nav-daitang'; nav.className = 'nav-tab'; nav.dataset.tab = 'daitang'; nav.setAttribute('role', 'tab'); nav.setAttribute('aria-selected', 'false'); nav.setAttribute('aria-controls', 'tab-daitang'); nav.textContent = 'Đại Tạng Kinh'; nav.onclick = () => switchTab('daitang'); $('nav-phucminh').after(nav);
    document.body.insertAdjacentHTML('beforeend', '<dialog id="ep-detail" class="dharma-dialog pm-detail ep-detail" aria-labelledby="ep-detail-title"><button id="ep-detail-close" class="pm-dialog-close r-button" aria-label="Đóng thông tin sách">×</button><div id="ep-detail-content"></div></dialog>');
    const original = $('reader-pdf-link').cloneNode(false); original.id = 'reader-word-link'; original.textContent = 'Tải Word gốc ↓'; original.hidden = true; $('reader-pdf-link').after(original);
    section.addEventListener('click', e => { const b = e.target.closest('[data-ep-action]'); if (b) ({ details, read, listen, save, enqueue })[b.dataset.epAction]?.(b.dataset.id); });
    $('ep-search').oninput = e => { appState.searchQuery = e.target.value; $('global-search').value = e.target.value; page = 1; render(); };
    section.querySelectorAll('[data-ep-category]').forEach(b => b.onclick = () => { category = b.dataset.epCategory; topic = 'all'; page = 1; topics(); render(); });
    $('ep-topic').onchange = e => { topic = e.target.value; page = 1; render(); };
    $('ep-availability').onchange = e => { availability = e.target.value; page = 1; render(); };
    $('ep-sort').onchange = e => { sort = e.target.value; page = 1; render(); };
    $('ep-saved').onclick = () => { savedOnly = !savedOnly; page = 1; render(); };
    section.querySelectorAll('[data-ep-layout]').forEach(b => b.onclick = () => { layout = b.dataset.epLayout; S.write('ep-layout', layout); render(); });
    $('ep-reset').onclick = reset; $('ep-previous').onclick = () => goPage(page - 1); $('ep-next').onclick = () => goPage(page + 1); $('ep-page-number').onchange = e => goPage(e.target.value);
    $('ep-listen-page').onclick = () => { const list = filtered.slice((page - 1) * pageSize, page * pageSize).filter(b => b.vietFile).map(b => ({ type: 'ebooks', id: b.id, title: b.title })); if (list.length) CollectionPlayer.start('Đại Tạng Kinh · ' + (category === 'all' ? 'Tuyển chọn' : category), list); };
    section.querySelector('a[href="#ep-catalog"]').onclick = e => { e.preventDefault(); $('ep-catalog').scrollIntoView({ behavior: 'smooth' }); $('ep-search').focus({ preventScroll: true }); };
    $('ep-detail-close').onclick = () => $('ep-detail').close(); $('reader-close').addEventListener('click', refreshContinue);
    window.addEventListener('library-store-change', e => { if (appState.currentTab === 'daitang' && e.detail.key === 'cp3:favorites') render(); });
    window.addEventListener('storage', () => { if (appState.currentTab === 'daitang') render(); });
    topics(); render();
  }
  window.DaiTang = { init, render, read, listen, details, refreshContinue, decorateHome, find: id => lookup.get(id) };
})();

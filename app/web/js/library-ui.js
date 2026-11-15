(function () {
  'use strict';
  const S = window.LibraryStore, M = window.ReaderModel;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const announce = msg => { if ($('audio-status')) $('audio-status').textContent = msg; };
  let layout = S.read('catalog-layout', matchMedia('(max-width: 640px)').matches ? 'list' : 'cards');
  const art = (name, cls) => window.LibraryArt.svg(name, cls);
  let closeNavigation = () => {};
  const SEARCH_PAGE_SIZE = 8;
  let searchState = { signature: '', page: 1 };
  function find(type, id) { return type === 'ebooks' ? DAI_TANG_KINH_DATA.find(x => x.id === id) : type === 'phucminh' ? PHUC_MINH_DATA.find(x => x.id === id) : type === 'daithua' ? DAI_THUA_DATA.find(x => x.id === id) : type === 'daitang' ? DAI_TANG_HAN_DATA.texts.find(x => x.id === id) : null; }
  function open(type, id, mode, block) { const data = find(type, id); if (type === 'ebooks' && data && !data.vietFile) return DaiTang.details(id); if (type === 'phucminh' && data && !data.vietFile) return PhucMinh.openPDF(id); if (data) return Reader.open({ type, data }, mode || (Reader.path({ type, data }, 'viet') ? 'viet' : 'han'), block); }
  async function listen(type, id) {
    if (window.DharmaPlayerStore) return window.DharmaPlayerStore.playItem({ type, id });
    const pending = open(type, id, 'viet'); Reader.toggleAudio(true);
    await pending;
    if (Reader.state.key === type + ':' + id && Reader.state.ready) await Audiobook.start();
  }
  function route() {
    if (!location.hash.startsWith('#read/')) return;
    try {
      const [, encoded, mode, block] = location.hash.split('/');
      const key = decodeURIComponent(encoded), split = key.indexOf(':');
      if (split < 0 || !['viet', 'han', 'dual', 'note'].includes(mode)) return;
      open(key.slice(0, split), key.slice(split + 1), mode, block);
    } catch { /* Ignore malformed deep links. */ }
  }
  function entry(type, data) { return { type, id: data.id, key: type + ':' + data.id, title: type === 'daithua' ? data.title : data.vietTitle || data.title }; }
  function favorite(item) {
    let favorites = S.read('favorites', []);
    if (favorites.some(x => x.key === item.key)) favorites = favorites.filter(x => x.key !== item.key); else favorites.unshift(item);
    S.write('favorites', favorites); refreshShelf(); decorate();
  }
  function button(text, action, className = 'r-button') { const b = document.createElement('button'); b.textContent = text; b.className = className; b.onclick = action; return b; }
  function readLabel(item) {
    return Reader.path(item, 'viet') ? 'Đọc kinh' : Reader.path(item, 'han') ? 'Đọc bản Hán' : item.type === 'phucminh' ? 'Xem PDF' : 'Xem tệp nguồn';
  }
  function appendListen(actions, item, className = 'r-button') {
    const available = !!Reader.path(item, 'viet'), id = item.id || item.data.id, title = item.title || item.data.vietTitle || item.data.title;
    const control = button('▶ Nghe kinh', () => listen(item.type, id), className);
    const reason = Reader.path(item, 'han') ? 'Chưa có bản Việt để nghe' : 'Chưa có bản chữ để nghe';
    control.disabled = !available;
    control.setAttribute('aria-label', 'Nghe kinh: ' + title + (available ? '' : '. ' + reason));
    control.title = available ? 'Nghe kinh: ' + title : reason;
    actions.append(control);
    if (!available) { const note = document.createElement('small'); note.className = 'book-listen-unavailable'; note.textContent = reason; actions.append(note); }
    return control;
  }
  function captureSearch() { return { ...searchState, collection: $('home-collection').value, language: $('home-language').value }; }
  function restoreSearch(saved) {
    if (!saved) return;
    for (const name of ['collection', 'language']) { const select = $('home-' + name); if ([...select.options].some(o => o.value === saved[name])) select.value = saved[name]; }
    searchState = { signature: String(saved.signature || ''), page: Number.isInteger(saved.page) && saved.page > 0 ? saved.page : 1 };
  }
  function decorate() {
    const favorites = S.read('favorites', []);
    document.querySelectorAll('[data-library-type]').forEach(card => {
      const type = card.dataset.libraryType, id = card.dataset.libraryId, data = find(type, id); if (!data) return;
      window.LibraryDesign?.decorateCatalog(card, { type, data });
      if(!card.querySelector('.edition-status')){const status=document.createElement('p');status.className='edition-status';status.textContent=LibraryCatalog.status({type,data});card.append(status);}
      let tools = card.querySelector('.card-personal-tools');
      if (!tools) { tools = document.createElement('div'); tools.className = 'card-personal-tools'; card.append(tools); }
      tools.replaceChildren();
      const selected = favorites.some(x => x.key === type + ':' + id);
      const heart = button(selected ? '♥ Đã lưu' : '♡ Lưu kinh', () => favorite(entry(type, data))); heart.setAttribute('aria-pressed', String(selected)); tools.append(heart);
      appendListen(tools, { type, data }, 'r-button book-listen');
      if (!card.querySelector('.book-editions')) {
        const actions = card.querySelector('.daithua-action-btns') || card.querySelector('.taisho-left + div');
        const secondary = actions ? [...actions.querySelectorAll('.btn-read-han, .btn-file-pdf')] : [];
        if (secondary.length && Reader.path({ type, data }, 'viet')) {
          const editions = document.createElement('details'); editions.className = 'book-editions';
          editions.innerHTML = '<summary>Bản khác & PDF</summary><div></div>';
          secondary.forEach(el => editions.lastElementChild.append(el)); actions.append(editions);
        }
        const read = card.querySelector('.btn-read-viet'); if (read) read.textContent = 'Đọc kinh →';
        const description = card.querySelector('.daithua-desc');
        if (description) description.textContent = 'Bản tiếng Việt · Hán văn đối chiếu' + (data.files?.noteMd ? ' · Có khảo chứng' : '');
      }
    });
    document.querySelectorAll('.daithua-grid, .taisho-texts-list').forEach(el => el.classList.toggle('catalog-list-view', layout === 'list'));
    $('taisho-texts-list')?.classList.toggle('catalog-card-view', layout === 'cards');
    if ($('catalog-category')) $('catalog-category').value = appState.daiThuaFilter;
    if ($('catalog-division')) $('catalog-division').value = appState.daiTangDivFilter;
    window.LibraryDesign?.refresh();
  }
  function refreshShelf() {
    const recentKeys = new Set();
    const recent = S.read('recent', []).filter(item => {
      const key = item.key || item.type + ':' + item.id;
      if (recentKeys.has(key)) return false;
      recentKeys.add(key); return true;
    }).slice(0, 4);
    for (const [id, items, empty] of [['recent-books', recent, 'Chọn một bản kinh để bắt đầu. Lần sau, bạn có thể đọc tiếp tại đây.'], ['favorite-books', S.read('favorites', []), 'Nhấn “Lưu kinh” để xây dựng tủ sách riêng của bạn.']]) {
      const container = $(id); if (!container) continue; container.replaceChildren();
      if (id === 'recent-books') container.closest('.home-section').hidden = !items.length;
      if (!items.length) { const p = document.createElement('p'); p.className = 'shelf-empty'; p.innerHTML = art('lotus') + esc(empty); container.append(p); }
      items.forEach(item => {
        const card = document.createElement('article'); card.className = 'shelf-book';
        const label = document.createElement('small'); label.textContent = item.type === 'ebooks' ? 'ĐẠI TẠNG KINH' : item.type === 'phucminh' ? 'CHÙA PHÚC MINH' : item.id.startsWith('T') ? item.id : 'KINH ĐẠI THỪA';
        const title = document.createElement('h3'); title.textContent = item.title;
        card.append(label, title, button(id === 'recent-books' ? 'Đọc tiếp ↗' : 'Mở kinh ↗', () => open(item.type, item.id, item.mode)));
        if (id === 'favorite-books') card.append(button('Bỏ lưu', () => favorite(item)));
        const data = find(item.type, item.id);
        if (data) {
          appendListen(card, { type: item.type, data }, 'r-button shelf-listen');
          const body = document.createElement('div'); body.className = 'shelf-book-body';
          body.append(...card.childNodes); card.append(body);
          const jacket = document.createElement('button'); jacket.className = 'shelf-jacket';
          jacket.setAttribute('aria-label', 'Mở ' + item.title);
          jacket.innerHTML = LibraryDesign.jacket({ type: item.type, data });
          jacket.onclick = () => open(item.type, item.id, item.mode); card.prepend(jacket);
        }
        container.append(card);
      });
    }
    window.LibraryDesign?.refresh();
  }
  function searchLibrary() {
    const q = M.normalize(appState.searchQuery); const results = $('home-search-results');
    if (!q) { searchState = { signature: '', page: 1 }; results.hidden = true; results.replaceChildren(); return; }
    results.hidden = false;
    const language = $('home-language').value, collection = $('home-collection').value;
    let books = [];
    if (['all', 'daithua'].includes(collection)) books.push(...DAI_THUA_DATA.map(data => ({ type: 'daithua', data })));
    if (['all', 'daitang'].includes(collection)) books.push(...DAI_TANG_HAN_DATA.texts.map(data => ({ type: 'daitang', data })));
    if (['all', 'ebooks'].includes(collection)) books.push(...DAI_TANG_KINH_DATA.map(data => ({ type: 'ebooks', data })));
    if (['all', 'phucminh'].includes(collection)) books.push(...PHUC_MINH_DATA.map(data => ({ type: 'phucminh', data })));
    books = books.filter(item => (language !== 'viet' || Reader.path(item, 'viet')) && M.normalize([item.data.title, item.data.vietTitle, item.data.hanTitle, item.data.id, item.data.taishoId, item.data.categoryName, item.data.category, item.data.subcategory, item.data.topics?.join(' '), item.data.nikayaNote, LibraryDesign.creditLine(item), item.type === 'ebooks' ? 'Đại Tạng Kinh' : item.type === 'phucminh' ? 'Chùa Phúc Minh' : ''].join(' ')).includes(q));
    const signature = JSON.stringify([q, collection, language]);
    if (signature !== searchState.signature) searchState = { signature, page: 1 };
    const pages = Math.max(1, Math.ceil(books.length / SEARCH_PAGE_SIZE));
    searchState.page = Math.min(searchState.page, pages);
    results.innerHTML = '<div class="section-heading"><h2 id="home-search-heading" tabindex="-1">Kết quả tra cứu</h2><span id="home-search-count" role="status" aria-live="polite"></span></div><div id="home-search-hits"></div><nav class="home-search-pagination" aria-label="Trang kết quả tra cứu"><button id="home-search-previous" class="r-button">← Trang trước</button><span id="home-search-page"></span><button id="home-search-next" class="r-button">Trang sau →</button></nav>';
    const renderPage = () => {
      const start = (searchState.page - 1) * SEARCH_PAGE_SIZE;
      $('home-search-hits').replaceChildren();
      $('home-search-count').textContent = books.length ? `${start + 1}–${Math.min(start + SEARCH_PAGE_SIZE, books.length)} / ${books.length.toLocaleString('vi-VN')} kết quả` : '0 kết quả';
      books.slice(start, start + SEARCH_PAGE_SIZE).forEach(item => {
        const row = document.createElement('article'); row.className = 'search-result-row'; row.dataset.bookKey = item.type + ':' + item.data.id;
        const b = button('', () => open(item.type, item.data.id), 'global-result');
        const label = readLabel(item), title = item.data.vietTitle || item.data.title;
        b.title = title;
        b.setAttribute('aria-label', label + ': ' + title);
        b.innerHTML = `<small>${esc(item.type === 'ebooks' ? 'Đại Tạng Kinh' : item.type === 'phucminh' ? 'Chùa Phúc Minh' : item.data.taishoId || item.data.id)} · ${item.type === 'ebooks' && !item.data.vietFile ? 'Chưa có bản chữ' : item.type === 'phucminh' && !item.data.vietFile ? 'PDF bản ảnh' : Reader.path(item, 'viet') ? 'Bản Việt' : 'Hán văn'}</small><strong>${esc(title)}</strong>`;
        b.insertAdjacentHTML('afterbegin', LibraryDesign.jacket(item, { mini: true }));
        const actions = document.createElement('div'); actions.className = 'search-result-actions';
        const read = button(label, () => open(item.type, item.data.id), 'r-button search-read'); read.setAttribute('aria-label', label + ': ' + title); actions.append(read);
        appendListen(actions, item, 'r-button search-listen'); row.append(b, actions);
        $('home-search-hits').append(row);
      });
      $('home-search-previous').disabled = searchState.page === 1;
      $('home-search-next').disabled = searchState.page === pages;
      $('home-search-page').textContent = `Trang ${searchState.page} / ${pages}`;
      results.querySelector('.home-search-pagination').hidden = pages === 1;
      if (!books.length) $('home-search-hits').textContent = 'Chưa tìm thấy tác phẩm. Hãy thử tên ngắn hơn hoặc mã kinh.';
      window.LibraryRouter?.checkpoint();
    };
    const changePage = delta => { searchState.page += delta; renderPage(); $('home-search-heading').focus({ preventScroll: true }); results.scrollIntoView({ block: 'start', behavior: prefMotion() }); };
    $('home-search-previous').onclick = () => changePage(-1);
    $('home-search-next').onclick = () => changePage(1);
    renderPage();
  }
  function init() {
    if ($('tab-home')) return;
    const main = document.querySelector('main');
    document.querySelector('.dhamma-hero')?.remove();
    const home = document.createElement('section'); home.id = 'tab-home'; home.className = 'tab-panel sanctuary-home'; home.setAttribute('role', 'tabpanel'); home.setAttribute('aria-labelledby', 'nav-home');
    home.innerHTML = `
      <section class="sanctuary-hero">
        <div class="hero-copy"><span class="eyebrow">VĂN · TƯ · TU</span><h2>Mở trang kinh.<br><em>Lắng lại tâm mình.</em></h2><p>Một không gian thanh tịnh để đọc, lắng nghe<br class="desktop-break"> và tìm hiểu kho tàng kinh điển Phật giáo.</p><div class="hero-actions"><button class="r-primary" id="hero-explore">Khám phá kinh điển <span>↗</span></button><button class="hero-secondary" id="hero-shelf">Tủ sách của tôi →</button></div><div class="hero-signature"><span class="signature-line"></span> ĐẠI THƯ VIỆN CHÁNH PHÁP</div></div>
        <div class="hero-art" aria-hidden="true">
          <svg class="lotus-art" viewBox="0 0 520 470" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="lotus-gold" x1="120" y1="80" x2="410" y2="410" gradientUnits="userSpaceOnUse"><stop stop-color="#E4C995"/><stop offset="1" stop-color="#967749"/></linearGradient></defs><circle cx="260" cy="222" r="168" stroke="currentColor" stroke-width=".6"/><circle cx="260" cy="222" r="155" stroke="currentColor" stroke-width=".6" stroke-dasharray="1 10"/><path d="M92 340H428M114 348H406M142 357H378" stroke="currentColor"/><g stroke="url(#lotus-gold)" stroke-width="1.7"><path d="M260 319C178 251 215 162 260 121C305 162 342 251 260 319Z"/><path d="M260 319C176 322 138 242 150 185C221 195 268 247 260 319Z"/><path d="M260 319C344 322 382 242 370 185C299 195 252 247 260 319Z"/><path d="M260 319C177 356 113 309 94 251C157 231 223 255 260 319Z"/><path d="M260 319C343 356 407 309 426 251C363 231 297 255 260 319Z"/><path d="M260 319C216 270 245 195 260 167C275 195 304 270 260 319Z"/><path d="M260 319L178 223M260 319L342 223M260 319L132 273M260 319L388 273" opacity=".45"/></g><circle cx="260" cy="84" r="4" fill="currentColor"/><path d="M260 52V66M248 59H272" stroke="currentColor"/><path d="M184 380H336M212 388H308" stroke="currentColor" opacity=".5"/></svg>
          <span class="art-caption">TÀNG KINH CÁC</span><span class="art-subcaption">Gìn giữ lời kinh · Nuôi dưỡng tuệ giác</span>
        </div>
      </section>
      <div class="archive-facts"><span><strong>${DAI_THUA_DATA.length}</strong> bộ kinh Đại Thừa</span><span><strong>${DAI_TANG_HAN_DATA.texts.length.toLocaleString('vi-VN')}</strong> tác phẩm Hán Tạng</span><span><strong>${DAI_TANG_HAN_DATA.texts.filter(t => t.hasViet).length.toLocaleString('vi-VN')}</strong> bản Việt trong Hán Tạng</span><span class="facts-last">Đọc kinh & nghe tiếng Việt</span></div>
      <section class="home-discovery"><div class="section-heading"><div><span class="eyebrow">TÌM MỘT TRANG KINH</span><h2>Tra cứu thư viện</h2></div><span>Tên kinh · Mã Taishō · Hán văn</span></div><div id="home-search-slot"></div><div class="home-search-filters"><label>Kho kinh<select id="home-collection"><option value="all">Tất cả kho kinh</option><option value="daithua">Kinh Đại Thừa</option><option value="daitang">Hán Tạng</option></select></label><label>Ngôn ngữ<select id="home-language"><option value="all">Tất cả bản hiện có</option><option value="viet">Có bản tiếng Việt</option></select></label></div><div id="home-search-results" hidden></div></section>
      <section class="home-section"><div class="section-heading"><div><span class="eyebrow">TIẾP NỐI VIỆC TU HỌC</span><h2>Trang kinh đang đọc</h2></div><button class="r-button" id="show-shelf">Xem tủ sách →</button></div><div id="recent-books" class="shelf-grid"></div></section>
      <section class="home-section"><div class="section-heading"><div><span class="eyebrow">KHO TÀNG CHÁNH PHÁP</span><h2>Những lối vào thư viện</h2></div><span>Khám phá theo truyền thống & nhu cầu</span></div><div class="collection-grid"><button data-collection-tab="daithua"><span class="collection-symbol">01 / 蓮</span><h3>Kinh điển Đại Thừa</h3><p>Tuyển tập theo Thập Nhị Phân Giáo, với các bản Việt, Hán và khảo chứng hiện có.</p><span>Khám phá tuyển tập ↗</span></button><button data-collection-tab="daitanghan"><span class="collection-symbol">02 / 藏</span><h3>Đại Tạng Kinh Hán</h3><p>Tra cứu 25 bộ Taishō theo mã kinh, tên Việt và nguyên tác Hán văn.</p><span>Bước vào tàng kinh ↗</span></button><button data-collection-tab="appendix"><span class="collection-symbol">03 / 慧</span><h3>Tra cứu & đối chiếu</h3><p>Cầu nối A-Hàm – Nikāya, danh số pháp học và các phụ lục nghiên cứu.</p><span>Mở các phụ lục ↗</span></button></div></section>
      <section class="listening-invitation"><div class="listening-seal" aria-hidden="true">◉</div><div><span class="eyebrow">MỘT CÁCH TIẾP CẬN KHÁC</span><h2>Lắng nghe từng lời kinh</h2><p>Mở bản kinh có tiếng Việt, chọn “Nghe kinh” và tìm nhịp đọc phù hợp với bạn.</p></div><button id="home-listen" class="r-button">Chọn kinh để nghe ↗</button></section>
      <section class="home-section" id="reading-paths-section"><div class="section-heading"><div><span class="eyebrow">BẮT ĐẦU TỪ ĐÂU?</span><h2>Lộ trình đọc kinh gợi ý</h2></div><span>Theo nhu cầu thực hành</span></div><div class="reading-paths" id="reading-paths"></div></section>`;
    main.prepend(home);
    if (window.SutraContext) {
      const pathsContainer = $('reading-paths');
      const pathPresentation = {
        beginner: { number: '01', label: 'Nhập môn', symbol: '芽' },
        deepening: { number: '02', label: 'Đào sâu', symbol: '慧' },
        scholar: { number: '03', label: 'Khảo cứu', symbol: '藏' }
      };
      window.SutraContext.getPaths().forEach(path => {
        const presentation = pathPresentation[path.id] || { number: '•', label: 'Lộ trình', symbol: '☸' };
        const pathName = path.name.replace(/^\S+\s+/, '');
        const availableSutras = path.sutras.map(s => ({
          ...s,
          data: DAI_THUA_DATA.find(x => x.taishoId === s.id) || DAI_TANG_HAN_DATA.texts.find(x => x.id === s.id)
        })).filter(s => s.data);
        const card = document.createElement('article'); card.className = 'path-card';
        card.innerHTML = `<header class="path-card-header">
          <div class="path-heading">
            <span class="path-seal" aria-hidden="true">${presentation.symbol}</span>
            <div><span class="path-kicker">Lộ trình ${presentation.number} · ${presentation.label}</span><h3>${esc(pathName)}</h3></div>
          </div>
          <p>${esc(path.description)}</p>
          <div class="path-actions"><span>${availableSutras.length} chặng đọc</span></div>
        </header><div class="path-steps" aria-label="Các chặng trong ${esc(pathName)}"></div>`;
        availableSutras.forEach((s, index) => {
          const data = s.data;
          const type = data.files ? 'daithua' : 'daitang';
          const step = document.createElement('div'); step.className = 'path-step';
          const title = data.vietTitle || data.title;
          step.innerHTML = `<div class="path-step-marker" aria-hidden="true"><span>${index + 1}</span></div><div class="path-step-info"><small>Chặng ${String(index + 1).padStart(2, '0')}</small><strong>${esc(title)}</strong><span>${esc(s.reason)}</span></div>`;
          const readButton = button('Đọc →', () => open(type, data.id, 'viet'), 'r-button path-read-button');
          readButton.setAttribute('aria-label', `Đọc ${title}`);
          step.append(readButton);
          card.lastElementChild.append(step);
        });
        const listenPath = button('Nghe lộ trình', () => {
          if (!window.CollectionPlayer) return;
          const { name, items } = window.CollectionPlayer.fromReadingPath(path.id);
          if (items.length) window.CollectionPlayer.start(name, items);
        }, 'path-listen-button');
        listenPath.setAttribute('aria-label', `Nghe toàn bộ ${pathName}`);
        listenPath.insertAdjacentHTML('afterbegin', '<span aria-hidden="true">▶</span>');
        card.querySelector('.path-actions').append(listenPath);
        pathsContainer.append(card);
      });
    }
    home.querySelector('.hero-copy h2').innerHTML = 'Một trang kinh.<br><em>Một khoảng bình yên.</em>';
    home.querySelector('.hero-copy p').textContent = 'Tìm kinh, đọc thong thả và lắng nghe từng lời. Việc tu học bắt đầu từ một trang sách.';
    home.querySelector('.sanctuary-hero').append(home.querySelector('.home-discovery'));
    const heroArt = home.querySelector('.hero-art');
    heroArt.innerHTML = art('lotus', 'lotus-art');
    home.querySelector('.hero-copy').append(heroArt);
    const homeFilters = document.createElement('details'); homeFilters.className = 'home-filter-options';
    homeFilters.innerHTML = '<summary>Bộ lọc kho kinh & ngôn ngữ</summary>';
    home.querySelector('.home-search-filters').before(homeFilters);
    homeFilters.append(home.querySelector('.home-search-filters'));
    const suggestions = document.createElement('div'); suggestions.className = 'search-suggestions';
    suggestions.innerHTML = '<span>Tìm nhanh</span>';
    ['Bát Nhã', 'Dược Sư', 'A Di Đà', 'Pháp Hoa'].forEach(q => suggestions.append(button(q, () => { $('global-search').value = q; $('global-search').dispatchEvent(new Event('input', { bubbles: true })); }, 'suggestion-chip')));
    homeFilters.after(suggestions);
    // Results use the full page width, independently of the compact search card.
    home.querySelector('.archive-facts').after(home.querySelector('#home-search-results'));
    const featured = document.createElement('section'); featured.className = 'home-section featured-section';
    featured.innerHTML = '<div class="section-heading"><div><span class="eyebrow">BẮT ĐẦU TỪ ĐÂY</span><h2>Chọn một bản kinh để đọc</h2></div><span>Đọc bản Việt hoặc nghe trực tiếp</span></div><div class="featured-books"></div>';
    const selections = [['T08n0251', 'Bát Nhã Tâm Kinh', 'Trí tuệ Bát Nhã'], ['T12n0366', 'Kinh A Di Đà', 'Kinh điển Tịnh Độ'], ['T14n0450', 'Kinh Dược Sư', 'Bổn nguyện & công đức'], ['T09n0262', 'Kinh Pháp Hoa', 'Diệu Pháp Liên Hoa']];
    selections.forEach(([code, name, subtitle], i) => {
      const data = DAI_THUA_DATA.find(b => b.taishoId === code && b.files.vietMd) || DAI_TANG_HAN_DATA.texts.find(b => b.id === code && b.vietFile);
      if (!data) return;
      const type = data.files ? 'daithua' : 'daitang';
      const card = document.createElement('article'); card.className = 'featured-book';
      card.innerHTML = `<div class="book-cover cover-${i}">${art('corner', 'cover-corner')}<span>${esc(code)}</span>${art('lotus', 'cover-wheel')}<h3>${name}</h3><small>${subtitle}</small></div><div class="featured-actions"></div>`;
      card.lastElementChild.append(button('Đọc kinh →', () => open(type, data.id, 'viet'), 'r-primary'), button('▶ Nghe', () => listen(type, data.id)));
      featured.lastElementChild.append(card);
    });
    home.querySelector('.archive-facts').after(featured);
    home.querySelector('.sanctuary-hero').after(home.querySelector('#home-search-results'));
    home.querySelector('.sanctuary-hero').after(home.querySelector('#home-search-results'), home.querySelector('#recent-books').closest('.home-section'), featured, home.querySelector('.collection-grid').closest('.home-section'), home.querySelector('.archive-facts'));
    home.querySelectorAll('.collection-symbol').forEach((el, i) => { el.innerHTML = art(['lotus', 'book', 'wheel'][i]); el.setAttribute('aria-hidden', 'true'); });
    home.querySelector('.listening-seal').innerHTML = art('headphones');
    document.querySelector('.noble-footer').insertAdjacentHTML('afterbegin', '<div class="lotus-divider" aria-hidden="true">' + art('lotus') + '</div>');
    const search = document.querySelector('.search-filter-section'); $('home-search-slot').append(search);
    const searchHome = document.createElement('div'); searchHome.id = 'catalog-search-slot'; main.insertBefore(searchHome, home.nextSibling);
    const shelf = document.createElement('section'); shelf.id = 'tab-shelf'; shelf.className = 'tab-panel'; shelf.style.display = 'none'; shelf.setAttribute('role', 'tabpanel'); shelf.setAttribute('aria-labelledby', 'nav-shelf');
    shelf.innerHTML = '<div class="section-heading"><div><span class="eyebrow">KHÔNG GIAN RIÊNG</span><h2>Tủ sách của tôi</h2></div><button class="r-button" id="backup-library">Xuất bản sao lưu</button></div><p class="muted">Kinh đã lưu, ghi chú và vị trí đọc được giữ trên trình duyệt này.</p><div id="favorite-books" class="shelf-grid"></div><div class="backup-row"><label class="file-label">Nhập bản sao lưu<input id="restore-library" type="file" accept="application/json,.json"></label><p id="backup-status" role="status"></p></div>';
    main.append(shelf);
    const nav = $('nav-tabs-container');
    const homeButton = document.createElement('button'); homeButton.id = 'nav-home'; homeButton.className = 'nav-tab'; homeButton.dataset.tab = 'home'; homeButton.setAttribute('role', 'tab'); homeButton.setAttribute('aria-controls', 'tab-home'); homeButton.textContent = 'Trang chủ'; homeButton.onclick = () => switchTab('home'); nav.prepend(homeButton);
    const shelfButton = homeButton.cloneNode(false); shelfButton.id = 'nav-shelf'; shelfButton.dataset.tab = 'shelf'; shelfButton.textContent = 'Tủ sách'; shelfButton.setAttribute('aria-controls', 'tab-shelf'); shelfButton.onclick = () => switchTab('shelf'); nav.append(shelfButton);
    const more = document.createElement('details'); more.className = 'nav-more'; more.innerHTML = '<summary>Tu học & công cụ</summary><div class="nav-more-menu"></div>'; nav.parentElement.append(more);
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.id ||= 'nav-' + tab.dataset.tab;
      $(tab.getAttribute('aria-controls'))?.setAttribute('aria-labelledby', tab.id);
      const span = tab.querySelector('span'); if (span) span.textContent = span.textContent.replace(/^[^\p{L}\p{N}]+/u, '');
      tab.querySelector('.tab-badge')?.remove();
      if (['roadmap', 'milinda', 'practical', 'glossary', 'timer', 'notes'].includes(tab.dataset.tab)) { more.querySelector('div').append(tab); tab.onclick = () => closeNavigation(); }
    });
    const controls = document.createElement('div'); controls.className = 'catalog-layout-controls'; controls.innerHTML = '<span>Cách hiển thị</span><button class="r-button" data-layout="cards">▦ Thẻ</button><button class="r-button" data-layout="list">☷ Danh sách</button>'; searchHome.append(controls);
    controls.querySelectorAll('button').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.layout === layout)); b.onclick = () => { layout = b.dataset.layout; S.write('catalog-layout', layout); controls.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); decorate(); }; });
    const brand = document.querySelector('.brand-wrapper'); brand.setAttribute('role', 'button'); brand.tabIndex = 0; brand.onclick = () => switchTab('home'); brand.onkeydown = e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); switchTab('home'); } };
    document.querySelector('.pali-sub').textContent = 'TÀNG KINH CÁC · VĂN — TƯ — TU';
    document.querySelectorAll('.theme-btn').forEach(b => { const names = { parchment: 'Bạch Ngọc', amber: 'Hoàng Y', night: 'Dạ Thiền' }; b.textContent = names[b.dataset.theme]; b.setAttribute('aria-label', names[b.dataset.theme]); });
    $('global-search').placeholder = 'Tên kinh hoặc mã Taishō…'; $('global-search').setAttribute('aria-label', 'Tìm kiếm thư viện');
    $('hero-explore').onclick = () => switchTab('daithua'); $('hero-shelf').onclick = $('show-shelf').onclick = () => switchTab('shelf');
    $('home-listen').onclick = () => { switchTab('home'); featured.scrollIntoView({ behavior: prefMotion() }); featured.querySelector('button')?.focus({ preventScroll: true }); };
    $('home-collection').onchange = $('home-language').onchange = searchLibrary;
    home.querySelectorAll('[data-collection-tab]').forEach(b => b.onclick = () => switchTab(b.dataset.collectionTab));
    $('backup-library').onclick = S.backup;
    $('restore-library').onchange = async e => { try { const file = e.target.files[0]; if (!file) return; if (file.size > 20000000) throw new Error('Tệp sao lưu quá lớn.'); S.restore(await file.text()); refreshShelf(); renderNotesAndBookmarks(); $('backup-status').textContent = 'Đã nhập và hợp nhất dữ liệu. Tải lại trang để áp dụng các tùy chọn giao diện.'; } catch (error) { $('backup-status').textContent = error.message; } e.target.value = ''; };
    window.LibraryRouter?.start();
    const initialHash = location.hash;
    simplifyCatalog();
    const labels = { home: 'Khám phá', daithua: 'Kinh Đại Thừa', daitanghan: 'Hán Tạng', appendix: 'Tra cứu', shelf: 'Tủ sách của tôi' };
    for (const [id, text] of Object.entries(labels)) $('nav-' + id).textContent = text;
    const clear = button('×', () => { $('global-search').value = ''; $('global-search').dispatchEvent(new Event('input', { bubbles: true })); $('global-search').focus(); }, 'search-clear'); clear.setAttribute('aria-label', 'Xóa từ khóa tìm kiếm'); $('global-search').after(clear);
    $('global-search').type = 'search';
    initNavigationPanel(nav, more);
    document.querySelector('.wheel-icon').outerHTML = art('wheel', 'wheel-icon');
    $('btn-listen-header').querySelector('.bell-icon').innerHTML = art('headphones');
    $('btn-listen-header').addEventListener('click', closeNavigation, { capture: true });
    document.querySelectorAll('.cl-pill-icon').forEach(el => el.innerHTML = art('lotus'));
    document.querySelectorAll('.cl-pill-card').forEach(el => {
      el.onkeydown = e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); el.click(); } };
    });
    document.addEventListener('click', e => { if (!$('library-menu').open && !more.contains(e.target)) more.open = false; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && more.open && !$('library-menu').open) { e.preventDefault(); more.open = false; more.querySelector('summary').focus(); } });
    $('home-collection').add(new Option('Chùa Phúc Minh', 'phucminh'));
    $('home-collection').add(new Option('Đại Tạng Kinh', 'ebooks'));
    window.PhucMinh?.decorateHome(); window.DaiTang?.decorateHome();
    refreshShelf(); decorate(); window.LibraryConnection?.init(); window.DharmaShell?.init(); window.LibraryDesign?.init(); window.LibraryUpgrades?.init(); window.ContentModules?.init();window.LibraryExperience?.init(); window.LearningPath?.init(); window.ModulePresentation?.init(); window.TouchUX?.init();
    if (window.LearningPath?.route(initialHash)) return;
    if (!initialHash.startsWith('#read/') && !initialHash.startsWith('#album/') && !window.ContentModules?.route(initialHash)) switchTab($( 'tab-' + initialHash.slice(1)) ? initialHash.slice(1) : 'home');
    if (initialHash.startsWith('#album/')) window.LibraryRouter?.restore(); else route();
  }
  function initNavigationPanel(nav, more) {
    const header = document.querySelector('.header-container'), bar = document.querySelector('.noble-nav-bar');
    const actions = document.querySelector('.header-actions');
    const toggle = button('', () => { dialog.showModal(); more.open = true; toggle.setAttribute('aria-expanded', 'true'); }, 'r-button mobile-menu-toggle');
    toggle.id = 'library-menu-toggle'; toggle.innerHTML = art('menu') + '<span>Menu</span>';
    toggle.setAttribute('aria-controls', 'library-menu'); toggle.setAttribute('aria-expanded', 'false'); header.append(toggle);
    const dialog = document.createElement('dialog'); dialog.id = 'library-menu'; dialog.className = 'library-menu';
    dialog.setAttribute('aria-labelledby', 'library-menu-title');
    dialog.innerHTML = '<div class="menu-heading"><h2 id="library-menu-title">Thư viện của bạn</h2><button class="r-button" id="library-menu-close" aria-label="Đóng menu">×</button></div><div class="mobile-navigation"></div><div class="mobile-settings"><h3>Không gian tu học</h3></div>';
    document.body.append(dialog);
    closeNavigation = () => { more.open = false; if (dialog.open) dialog.close(); };
    $('library-menu-close').onclick = closeNavigation;
    dialog.addEventListener('close', () => { toggle.setAttribute('aria-expanded', 'false'); toggle.focus({ preventScroll: true }); });
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeNavigation(); } });
    const responsive = () => {
      closeNavigation();
      if (innerWidth <= 800) { dialog.querySelector('.mobile-navigation').append(nav, more); dialog.querySelector('.mobile-settings').append(actions); more.open = true; }
      else { bar.prepend(nav); bar.append(more); header.insertBefore(actions, toggle); }
    };
    matchMedia('(max-width: 800px)').addEventListener('change', responsive); responsive();
    more.addEventListener('toggle', () => { if (innerWidth > 800) more.querySelector('summary').setAttribute('aria-expanded', String(more.open)); });
  }
  function simplifyCatalog() {
    const launcher = document.querySelector('.collection-launcher-card');
    const listening = document.createElement('details'); listening.className = 'collection-discovery';
    listening.innerHTML = '<summary>Khám phá các bộ kinh để nghe</summary>';
    launcher.before(listening); listening.append(launcher);
    const filters = document.querySelector('#tab-daithua .filter-tags-row');
    const category = document.createElement('label'); category.className = 'catalog-select'; category.innerHTML = 'Thể loại <select id="catalog-category"></select>';
    filters.querySelectorAll('button').forEach(b => category.lastElementChild.add(new Option(b.textContent, b.dataset.cat)));
    category.lastElementChild.onchange = e => {
      filters.querySelector(`[data-cat="${e.target.value}"]`).click();
      updateDtListenBtn();
    };
    // Nghe trọn bộ theo danh mục Đại Thừa
    const dtListenBtn = button('▶ Nghe trọn bộ danh mục này', () => {
      if (!window.CollectionPlayer) return;
      let cat = $('catalog-category')?.value || 'all';
      if (cat === 'all') {
        // Automatically switch to first category '01' and start
        const sel = $('catalog-category');
        if (sel) {
          sel.value = '01';
          sel.dispatchEvent(new Event('change'));
          cat = '01';
        }
      }
      const { name, items } = window.CollectionPlayer.fromDaiThuaCategory(cat);
      if (items.length) window.CollectionPlayer.start(name, items);
      else announce('Danh mục này chưa có bản Việt để nghe.');
    }, 'btn-listen-collection');
    function updateDtListenBtn() {
      const cat = $('catalog-category')?.value || 'all';
      if (cat === 'all') {
        dtListenBtn.textContent = '▶ Nghe trọn bộ Khế Kinh (7 kinh)';
        dtListenBtn.disabled = false;
        dtListenBtn.title = 'Bấm để phát trọn bộ Khế Kinh (7 kinh) hoặc chọn thể loại khác';
      } else {
        const count = DAI_THUA_DATA.filter(d => d.categoryCode === cat && d.files.vietMd).length;
        const catName = DAI_THUA_DATA.find(d => d.categoryCode === cat)?.categoryName?.split('—')[0]?.trim() || '';
        dtListenBtn.textContent = `▶ Nghe trọn bộ ${catName} (${count} kinh)`;
        dtListenBtn.disabled = count === 0;
      }
    }
    updateDtListenBtn();
    filters.before(category, dtListenBtn); filters.hidden = true;
    const divisions = $('daitang-divisions-container');
    const select = document.createElement('label'); select.className = 'catalog-select'; select.innerHTML = 'Chọn bộ kinh <select id="catalog-division"><option value="all">Tất cả 25 bộ kinh</option></select>';
    DAI_TANG_HAN_DATA.divisions.forEach(d => select.lastElementChild.add(new Option(`${d.code}. ${d.name} (${d.total})`, d.code)));
    select.lastElementChild.onchange = e => {
      appState.daiTangDivFilter = e.target.value; appState.daiTangPage = 1; updateActiveDivisionCard(); renderDaiTangTexts();
      updateHtListenBtn();
    };
    // Nghe trọn bộ theo bộ Hán Tạng
    const htListenBtn = button('▶ Nghe trọn bộ kinh này', () => {
      if (!window.CollectionPlayer) return;
      let div = $('catalog-division')?.value || 'all';
      if (div === 'all') {
        const sel = $('catalog-division');
        if (sel) {
          sel.value = '01';
          sel.dispatchEvent(new Event('change'));
          div = '01';
        }
      }
      const { name, items } = window.CollectionPlayer.fromHanTangDivision(div);
      if (items.length) window.CollectionPlayer.start(name, items);
      else announce('Bộ kinh này chưa có bản Việt để nghe.');
    }, 'btn-listen-collection');
    function updateHtListenBtn() {
      const div = $('catalog-division')?.value || 'all';
      if (div === 'all') {
        htListenBtn.textContent = '▶ Nghe trọn bộ A Hàm (155 kinh)';
        htListenBtn.disabled = false;
        htListenBtn.title = 'Bấm để nghe trọn bộ A Hàm hoặc chọn bộ kinh khác';
      } else {
        const divInfo = DAI_TANG_HAN_DATA.divisions.find(d => d.code === div);
        const count = DAI_TANG_HAN_DATA.texts.filter(t => t.division === div && t.hasViet && t.vietFile).length;
        htListenBtn.textContent = `▶ Nghe trọn bộ ${divInfo?.name || div} (${count} kinh)`;
        htListenBtn.disabled = count === 0;
      }
    }
    updateHtListenBtn();
    const browse = document.createElement('details'); browse.className = 'catalog-browse'; browse.innerHTML = '<summary>Xem tổng quan 25 bộ kinh</summary>';
    const wrapper = divisions.parentElement; wrapper.before(select, htListenBtn, browse); browse.append(wrapper);
    divisions.querySelectorAll('.division-card').forEach(card => { card.tabIndex = 0; card.setAttribute('role', 'button'); card.onkeydown = e => { if (['Enter', ' '].includes(e.key)) { e.preventDefault(); card.click(); } }; });
  }
  function prefMotion() { return document.documentElement.classList.contains('reduced-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }
  function onTab(id) {
    window.LibraryExperience?.onTab(id);
    closeNavigation();
    const search = document.querySelector('.search-filter-section');
    (id === 'home' ? $('home-search-slot') : $('catalog-search-slot'))?.prepend(search);
    if ($('catalog-search-slot')) {
      $('catalog-search-slot').hidden = ['home', 'phucminh', 'daitang', 'shelf', 'timer', 'notes', 'roadmap', 'appendix'].includes(id);
      const layoutControls = $('catalog-search-slot').querySelector('.catalog-layout-controls');
      if (layoutControls) layoutControls.hidden = !['daithua', 'daitanghan'].includes(id);
    }
    const placeholders = {
      home: 'Tên kinh hoặc mã Taishō…',
      phucminh: 'Tìm trong tủ sách Chùa Phúc Minh…',
      daitang: 'Tìm trong Đại Tạng Kinh…',
      daithua: 'Tìm kiếm tên kinh Đại Thừa (Việt / Hán), thể loại...',
      daitanghan: 'Tìm mã Taishō (T01n0001...), tên kinh Hán/Việt...',
      milinda: 'Tìm trong 244 câu vấn đáp Mi Tiên (vô ngã, nghiệp, tái sinh, Niết-bàn...)...',
      practical: 'Tìm trong 218 câu hỏi đáp thực hành đời thường...',
      glossary: 'Tìm thuật ngữ Pāḷi, Hán, Việt (Anatta, Dukkha, Sati, Jhāna...)...'
    };
    if ($('global-search') && placeholders[id]) {
      $('global-search').placeholder = placeholders[id];
    }
    else if ($('global-search')) $('global-search').placeholder = 'Tìm tên sách trong toàn thư viện…';
    const more = document.querySelector('.nav-more');
    if (more) {
      const isSubtab = ['roadmap', 'milinda', 'practical', 'glossary', 'timer', 'notes'].includes(id);
      more.classList.toggle('has-active', isSubtab);
      const summary = more.querySelector('summary');
      const subLabels = {
        roadmap: 'Lộ Trình Tu Học',
        milinda: 'Vấn Đáp Mi Tiên',
        practical: 'Ứng Dụng Đời Sống',
        glossary: 'Từ Điển Pāḷi',
        timer: 'Tọa Thiền & Chuông',
        notes: 'Sổ Tay Tu Học'
      };
      if (summary) {
        summary.textContent = isSubtab ? `Tu học: ${subLabels[id] || id}` : 'Tu học & công cụ';
      }
    }
    if (id === 'daitang') window.DaiTang?.render();
    if (id === 'shelf' || id === 'home') refreshShelf();
    if (id === 'appendix') {renderAppendices();enhanceAppendix();}
    decorate();
  }
  function enhanceAppendix() {
    const container = document.getElementById('appendix-content-container');
    if (!container || container.querySelector('.appendix-search-tools')) return;
    const controls = document.createElement('div'); controls.className = 'appendix-search-tools';
    const input = document.createElement('input'); input.type = 'search'; input.placeholder = 'Lọc nội dung phụ lục…'; input.setAttribute('aria-label', 'Lọc nội dung phụ lục');
    const status = document.createElement('span'); status.setAttribute('role', 'status'); status.className = 'muted';
    controls.append(input, status); container.prepend(controls);
    const rows = [...container.querySelectorAll('tbody tr,.genre-card,.tree-div-item')];
    if (!rows.length) container.querySelectorAll('.appendix-card-wrapper > div > div').forEach(el => rows.push(el));
    input.oninput = () => { const q = M.normalize(input.value); rows.forEach(row => row.hidden = !M.normalize(row.textContent).includes(q)); status.textContent = `${rows.filter(r => !r.hidden).length} / ${rows.length} mục`; };
    container.querySelectorAll('.taisho-badge').forEach(badge => {
      const id = badge.textContent.trim();
      const found = DAI_TANG_HAN_DATA.texts.find(t => t.id === id);
      if (found) { const go = button('Mở ' + id + ' ↗', () => open('daitang', id)); badge.replaceWith(go); }
    });
    container.querySelectorAll('.tree-div-item').forEach(row => {
      const code = row.querySelector('strong')?.textContent.match(/^\d+/)?.[0];
      if (code) row.append(button('Xem các kinh trong bộ ↗', () => { switchTab('daitanghan'); appState.daiTangDivFilter = code.padStart(2, '0'); appState.daiTangPage = 1; updateActiveDivisionCard(); renderDaiTangTexts(); }));
    });
  }
  window.LibraryUI = { init, decorate, refreshShelf, searchLibrary, captureSearch, restoreSearch, readLabel, appendListen, onTab, open, listen, enhanceAppendix };
})();

(() => {
  'use strict';
  const $ = id => document.getElementById(id), esc = window.PersistentPlayer.esc;
  const PAGE_SIZE = 24, locations = new Map(), filters = new Map();
  const kinds = { kinh: 'Bản kinh', luat: 'Bản luật', luan: 'Bản luận', giang: 'Giảng giải', 'chu-giai': 'Chú giải', 'tu-hoc': 'Tu học', 'tu-lieu': 'Tư liệu', 'nghi-le': 'Nghi lễ', 'tai-lieu': 'Tài liệu', 'van-dap': 'Vấn đáp', 'mat-giao': 'Kinh / nghi quỹ', 'hoc-luan': 'Sách học luận', 'nghien-cuu': 'Nghiên cứu' };
  let model = null;
  const isModule = id => !!model?.byPath.has(id) && model.modules.some(m => m.id === id);
  const readable = entry => !!Reader.path(entry, 'viet');
  function button(text, action, className = 'r-button') {
    const b = document.createElement('button'); b.type = 'button'; b.className = className; b.textContent = text; b.onclick = action; return b;
  }
  function getNode(id) { return model.byPath.get([id, ...(locations.get(id) || [])].join('/')) || model.byPath.get(id); }
  function init() {
    if (model) return;
    model = ContentTaxonomy.build({ han: DAI_TANG_HAN_DATA.texts, divisions: DAI_TANG_HAN_DATA.divisions, mahayana: DAI_THUA_DATA, ebooks: DAI_TANG_KINH_DATA, phucminh: PHUC_MINH_DATA });
    model.modules.forEach(m => {
      const saved = LibraryStore.read('content-location:' + m.id, []);
      locations.set(m.id, Array.isArray(saved) && model.byPath.has([m.id, ...saved].join('/')) ? saved : []);
      filters.set(m.id, { language: 'all', page: 1, signature: '' });
      const section = document.createElement('section'); section.id = 'tab-' + m.id; section.className = 'tab-panel content-module'; section.style.display = 'none'; section.setAttribute('role', 'tabpanel'); section.setAttribute('aria-labelledby', 'nav-' + m.id); document.querySelector('main').append(section);
    });
    installNavigation(); installHome();
    matchMedia('(max-width: 1000px)').addEventListener('change', e => document.querySelectorAll('.content-tree-shell').forEach(tree => tree.open = !e.matches));
  }
  function installNavigation() {
    const sidebar = document.querySelector('.ds-nav');
    const sourceDetails = document.createElement('details'); sourceDetails.className = 'ds-more content-source-nav';
    sourceDetails.innerHTML = '<summary>Kho nguồn & bộ sưu tập</summary><nav></nav>';
    sourceDetails.querySelector('summary').textContent = 'Danh mục nguồn gốc';
    const labels = { daitang: 'Tệp sách Việt ngữ', daithua: 'Tuyển tập 62 bộ', daitanghan: 'Danh mục Hán tạng gốc' };
    ['daitang', 'daithua', 'daitanghan'].forEach(id => { const b = sidebar.querySelector('[data-dharma-nav="' + id + '"]'); b.querySelector('span').textContent = labels[id]; sourceDetails.lastElementChild.append(b); });
    sidebar.after(sourceDetails);
    const homeNav = sidebar.querySelector('[data-dharma-nav="home"]');
    const label = document.createElement('div'); label.className = 'content-nav-label'; label.textContent = 'CÁC TẠNG KINH';
    (sidebar.querySelector('[data-dharma-nav="listening-history"]') || homeNav).after(label);
    let previous = label;
    const moduleIcons = { 'tang-han': 'scroll', 'tang-dai-thua': 'lotus', 'tang-nam-tong': 'canon' };
    model.modules.forEach(m => {
      const b = button(m.title, () => go(m.id, locations.get(m.id)));
      b.dataset.dharmaNav = m.id; b.innerHTML = PersistentPlayer.icon(moduleIcons[m.id] || 'shelf') + '<span>' + esc(m.title) + '</span>'; previous.after(b); previous = b;
    });
    const nav = $('nav-tabs-container');
    const mobileSources = document.createElement('details'); mobileSources.className = 'content-mobile-sources'; mobileSources.innerHTML = '<summary>Danh mục nguồn gốc</summary><div></div>';
    ['daitang', 'daithua', 'daitanghan'].forEach(id => { const b = document.querySelector('.nav-tab[data-tab="' + id + '"]'); if (b) { b.textContent = labels[id]; mobileSources.lastElementChild.append(b); } });
    nav.append(mobileSources);
    const navHome = $('nav-home'); previous = navHome;
    model.modules.forEach(m => {
      const b = button(m.title, () => go(m.id, locations.get(m.id)), 'nav-tab');
      b.id = 'nav-' + m.id; b.dataset.tab = m.id; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'tab-' + m.id); b.setAttribute('aria-selected', 'false'); previous.after(b); previous = b;
    });
  }
  function tile(n, action, root = false) {
    const b = button('', action, 'content-group-card' + (root ? ' content-module-card' : ''));
    b.dataset.contentGroup = n.id;
    const count = root ? n.ownCount.toLocaleString('vi-VN') + ' bản chính' + (n.linkedCount ? ' · ' + n.linkedCount.toLocaleString('vi-VN') + ' bản liên kết' : '') : n.count.toLocaleString('vi-VN') + ' bản / tài liệu';
    b.innerHTML = (root ? '<span class="content-card-icon" aria-hidden="true">' + LibraryArt.svg('book') + '</span>' : '') + '<span class="content-card-copy"><strong>' + esc(n.title) + '</strong><span>' + esc(n.description) + '</span><small>' + count + '</small>' + (n.shared && !root ? '<small>TƯ LIỆU DÙNG CHUNG</small>' : '') + '</span><span class="content-card-arrow" aria-hidden="true">→</span>';
    return b;
  }
  function installHome() {
    const section = document.createElement('section'); section.id = 'home-content-modules'; section.className = 'home-section canon-gallery'; section.setAttribute('aria-labelledby', 'canon-gallery-heading');
    section.innerHTML = '<div class="section-heading canon-gallery-heading"><div><span class="eyebrow">KHO TÀNG CHÁNH PHÁP</span><h2 id="canon-gallery-heading">Ba lối vào <em>tàng kinh</em></h2></div><span class="canon-heading-note">Gìn giữ lời kinh<br>Tiếp nối hành trình tu học</span></div><p class="content-intro">Chọn một tạng kinh, tìm đến từng bộ và mở trang đọc dành cho bạn.</p><div class="content-group-grid content-canon-grid"></div>';
    const presentation = {
      'tang-han': { title: 'Hán tạng', symbol: 'wheel', label: 'TAISHŌ · HÁN VIỆT', action: 'Khám phá Hán tạng' },
      'tang-dai-thua': { title: 'Đại thừa', symbol: 'lotus', label: 'KINH · LUẬT · LUẬN', action: 'Khám phá Đại thừa' },
      'tang-nam-tong': { title: 'Nam tông', symbol: 'book', label: 'PĀLI · NIKĀYA', action: 'Khám phá Nam tông' }
    };
    model.modules.forEach((m, i) => {
      const card = tile(m, () => go(m.id, []), true);
      const p = presentation[m.id];
      card.classList.add('canon-card'); card.dataset.canon = m.id;
      card.setAttribute('aria-label', 'Khám phá ' + m.title);
      card.innerHTML = `<span class="canon-card-visual" aria-hidden="true">
        <span class="canon-card-topline"><span>0${i + 1}</span><span>${p.label}</span></span>
        <span class="canon-card-motif">${LibraryArt.svg('mandala')}</span>
        <span class="canon-card-corner">${LibraryArt.svg('corner')}</span>
        <span class="canon-book-stack"><span class="canon-book-back"></span><span class="canon-book">
          <span class="canon-book-imprint">ĐẠI TẠNG KINH</span>
          <span class="canon-book-symbol">${LibraryArt.svg(p.symbol)}</span>
          <span class="canon-book-title">${p.title}</span><span class="canon-book-colophon">CHÁNH PHÁP</span>
        </span></span>
        <span class="canon-visual-caption">VĂN · TƯ · TU</span>
      </span><span class="content-card-copy canon-card-body">
        <span class="canon-card-family">ĐẠI TẠNG KINH</span><strong>${p.title}</strong>
        <span class="canon-card-description">${esc(m.description)}</span>
        <span class="canon-card-counts"><span><b>${m.ownCount.toLocaleString('vi-VN')}</b> bản chính</span>${m.linkedCount ? '<span><b>' + m.linkedCount.toLocaleString('vi-VN') + '</b> bản liên kết</span>' : ''}</span>
      </span><span class="canon-card-footer"><span>${p.action}</span><span class="content-card-arrow" aria-hidden="true">↗</span></span>`;
      section.querySelector('.content-canon-grid').append(card);
    });
    const note = document.createElement('div'); note.className = 'content-hint canon-collection-note';
    note.innerHTML = '<span>' + LibraryArt.svg('book') + '<span><b>' + model.entries.length.toLocaleString('vi-VN') + '</b> bản kinh & tài liệu trong thư viện</span></span><span>Khám phá · Đọc kinh · Đối chiếu</span>'; section.append(note);
    const home = $('tab-home'), hero = home.querySelector('.sanctuary-hero'); hero.after(section);
    const welcome = home.querySelector('.dharma-welcome');
    if (welcome) {
      welcome.classList.add('canon-invitation');
      welcome.innerHTML = '<span class="canon-invitation-seal" aria-hidden="true">' + LibraryArt.svg('lotus') + '</span><div class="canon-invitation-copy"><span class="eyebrow">TÌM VỀ BÊN TRANG KINH</span><p>Mở một trang kinh. <em>Lắng lại tâm mình.</em></p></div><span class="dw-presence">Một ngày an lành ' + LibraryArt.svg('lotus') + '</span>';
      section.prepend(welcome);
    }
    const tools = home.querySelector('.upgrade-links');
    if (tools) {
      const options = document.createElement('details'); options.className = 'sanctuary-study-tools';
      const summary = document.createElement('summary'); summary.textContent = 'Tra cứu chuyên sâu & công cụ tu học'; options.append(summary, tools); section.after(options);
    }
    const sources = home.querySelector('.collection-grid')?.closest('.home-section');
    if (sources) {
      const details = document.createElement('details'); details.className = 'content-source-collections'; details.innerHTML = '<summary>Danh mục nguồn gốc & tệp sách</summary>'; sources.before(details); details.append(sources);
      const ebookEntry = home.querySelector('.ep-home-entry'); if (ebookEntry) details.append(ebookEntry);
    }
    const explore = $('hero-shelf'); explore.textContent = 'Tìm theo nhóm bộ →'; explore.onclick = () => section.scrollIntoView({ behavior: 'smooth' });
  }
  function go(id, path = [], options = {}) {
    if (!isModule(id)) return;
    const valid = model.byPath.has([id, ...path].join('/')) ? path : [];
    const hash = '#' + [id, ...valid].join('/');
    window.LibraryRouter?.move(hash, {replace:!!options.replace});
    locations.set(id, valid); LibraryStore.write('content-location:' + id, valid);
    filters.get(id).page = 1; filters.get(id).language = 'all';
    LibraryStore.write('query:' + id, '');
    if (appState.currentTab === id) appState.searchQuery = '';
    switchTab(id, {hash,replace:!!options.replace});
    $('tab-' + id).querySelector('h1')?.focus({ preventScroll: true });
    return hash;
  }
  function route(hash = location.hash) {
    let parts;
    try { parts = decodeURIComponent(hash.slice(1)).split('/'); } catch { return false; }
    let [id, ...path] = parts;
    const legacy = {
      'kinh-pali': ['tang-nam-tong', 'kinh'], 'kinh-aham': ['tang-han', 'kinh', 'a-ham'],
      luat: ['tang-han', 'luat'], luan: ['tang-han', 'luan'], 'tu-hoc': ['tang-dai-thua', 'tu-lieu-chung']
    };
    if (id === 'kinh-dai-thua') { const group = path[0] === 'kinh-tap' ? 'kinh-khac' : path[0]; const section = path[1] === 'giang' ? 'chu-giai' : 'kinh'; id = 'tang-dai-thua'; path = group ? [section, group] : []; }
    else if (legacy[id]) { const target = legacy[id]; id = target[0]; path = [...target.slice(1), ...path]; }
    if (!isModule(id)) return false;
    // A bare module URL starts at its overview; reader return still restores the stored group.
    const canonical = go(id, path, { replace: true });
    window.LibraryRouter?.replace(canonical, {canonical:true});
    return true;
  }
  function render() {
    const id = appState.currentTab;
    if (!isModule(id)) return;
    const root = model.byPath.get(id), current = getNode(id), panel = $('tab-' + id), options = filters.get(id);
    const q = ContentTaxonomy.normalize(appState.searchQuery.trim());
    const signature = current.path.join('/') + ':' + q + ':' + options.language;
    if (options.signature !== signature) { options.page = 1; options.signature = signature; }
    if (!location.hash.startsWith('#read/')) window.LibraryRouter?.replace('#' + current.path.join('/'));
    $('global-search').placeholder = 'Tìm trong ' + current.title + '…';
    $('catalog-search-slot').hidden = true;
    document.querySelectorAll('.content-source-nav, .content-mobile-sources').forEach(d => d.classList.remove('has-active'));
    const breadcrumbs = current.path.map((_, i) => {
      const n = model.byPath.get(current.path.slice(0, i + 1).join('/'));
      return '<button data-content-crumb="' + i + '"' + (i === current.path.length - 1 ? ' aria-current="page" disabled' : '') + '>' + esc(n.title) + '</button>';
    }).join('<span aria-hidden="true">›</span>');
    const children = current.children.filter(n => n.count);
    const showBooks = !!q || options.language !== 'all' || !children.length;
    panel.innerHTML = '<nav class="content-breadcrumbs" aria-label="Vị trí trong thư viện"><button data-content-home>Thư viện</button><span aria-hidden="true">›</span>' + breadcrumbs + '</nav><header class="content-module-heading"><div><span class="eyebrow">' + (current === root ? 'TRA CỨU THEO CÂY DANH MỤC' : esc(root.title)) + '</span><h1 tabindex="-1">' + esc(current.title) + '</h1><p>' + esc(current.description) + '</p></div><span class="content-total">' + current.count.toLocaleString('vi-VN') + ' bản tra cứu' + (current === root ? '<br><small>Gồm bản chính, liên kết và tư liệu chung</small>' : '') + '</span></header><div class="content-layout"><details class="content-tree-shell"' + (innerWidth > 1000 ? ' open' : '') + '><summary>Cây danh mục</summary><nav class="content-tree" aria-label="Cây ' + esc(root.title) + '"></nav></details><div class="content-branch"></div></div>';
    window.ModulePresentation?.decorate(id, panel, {title:current.title, description:current === root ? undefined : current.description});
    panel.querySelector('[data-content-home]').onclick = () => switchTab('home');
    panel.querySelectorAll('[data-content-crumb]').forEach(b => b.onclick = () => go(id, current.path.slice(1, Number(b.dataset.contentCrumb) + 1)));
    renderTree(panel.querySelector('.content-tree'), root, current);
    const branch = panel.querySelector('.content-branch');
    if (children.length && !q && options.language === 'all') {
      const groups = document.createElement('div'); groups.className = 'content-group-grid';
      children.forEach(n => groups.append(tile(n, () => go(id, n.path.slice(1))))); branch.append(groups);
    }
    const toolbar = document.createElement('div'); toolbar.className = 'content-toolbar';
    const browse = button(showBooks ? '← Xem các nhóm' : 'Xem tất cả bản trong nhóm', () => { options.language = 'all'; appState.searchQuery = ''; $('global-search').value = ''; if (showBooks) go(id, current.children.length ? current.path.slice(1) : current.path.slice(1, -1)); else { options.language = 'browse'; render(); } });
    toolbar.append(browse);
    const language = document.createElement('label'); language.innerHTML = 'Bản đọc <select aria-label="Lọc theo bản đọc"><option value="all">Tất cả</option><option value="viet">Có bản Việt</option><option value="han">Chỉ có bản Hán</option></select>';
    language.lastElementChild.value = options.language === 'browse' ? 'all' : options.language;
    language.lastElementChild.onchange = e => { options.language = e.target.value; render(); }; toolbar.append(language); branch.append(toolbar);
    const relations = model.related.get(current.path.join('/')) || [];
    if (relations.length) {
      const links = document.createElement('nav'); links.className = 'content-related'; links.setAttribute('aria-label', 'Các nhánh liên quan');
      relations.filter(r => model.byPath.get(r.path.join('/'))?.count).forEach(r => links.append(button(r.label + ' ↗', () => go(r.path[0], r.path.slice(1))))); branch.append(links);
    }
    if (showBooks) renderBooks(branch, current, options, q);
    else {
      const hint = document.createElement('p'); hint.className = 'content-hint'; hint.textContent = current.shared ? 'Nhánh này dùng chung giữa ba kho. Tài liệu giữ nguyên nguồn; sách chưa rõ truyền thống được phân theo chủ đề.' : 'Chọn bộ trong cây để đi sâu. Cùng mã Taishō được gom thành một tác phẩm, với các bản đọc riêng bên trong.'; branch.append(hint);
    }
  }
  function renderTree(container, root, current) {
    const rootButton = button('Tổng quan tạng kinh', () => go(root.id, []), 'content-tree-link'); container.append(rootButton);
    const list = document.createElement('ul');
    function appendNodes(nodes, parent) {
      nodes.filter(n => n.count).forEach(n => {
        const li = document.createElement('li'), active = n.path.join('/') === current.path.join('/');
        const b = button(n.title, () => go(root.id, n.path.slice(1)), 'content-tree-link');
        b.dataset.treePath = n.path.join('/'); b.title = n.count.toLocaleString('vi-VN') + ' bản / tài liệu';
        if (active) b.setAttribute('aria-current', 'page');
        if (n.children.some(c => c.count)) {
          const details = document.createElement('details'); details.open = current.path.join('/').startsWith(n.path.join('/') + '/') || active;
          const summary = document.createElement('summary'); summary.append(b); details.append(summary);
          const children = document.createElement('ul'); appendNodes(n.children, children); details.append(children); li.append(details);
        } else li.append(b);
        parent.append(li);
      });
    }
    appendNodes(root.children, list); container.append(list);
  }
  function renderBooks(panel, current, options, q) {
    const matching = current.all.filter(entry => {
      const hasViet = readable(entry), hasHan = !!Reader.path(entry, 'han');
      if (options.language === 'viet' && !hasViet || options.language === 'han' && (hasViet || !hasHan)) return false;
      return !q || ContentTaxonomy.normalize([entry.title, entry.data.hanTitle, entry.id, entry.data.taishoId, entry.sourceLabel, entry.sourceGroup, LibraryDesign.creditLine(entry)].join(' ')).includes(q);
    });
    const works = new Map();
    matching.forEach(entry => { const editions = works.get(entry.workKey) || []; editions.push(entry); works.set(entry.workKey, editions); });
    const list = [...works.values()];
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE)); options.page = Math.min(options.page, pages);
    const count = document.createElement('p'); count.className = 'content-results-count'; count.setAttribute('role', 'status'); count.textContent = list.length.toLocaleString('vi-VN') + ' mục tác phẩm · ' + matching.length.toLocaleString('vi-VN') + ' bản / tài liệu' + (q ? ' phù hợp' : '') + ' · Trang ' + options.page + '/' + pages; panel.append(count);
    if (!list.length) {
      const empty = document.createElement('p'); empty.className = 'content-empty'; empty.textContent = 'Chưa tìm thấy bản phù hợp trong nhóm này. Bạn có thể xóa từ khóa hoặc quay lại nhóm lớn hơn.'; panel.append(empty); return;
    }
    const grid = document.createElement('div'); grid.className = 'content-books';
    const start = (options.page - 1) * PAGE_SIZE;
    list.slice(start, start + PAGE_SIZE).forEach(editionsInScope => {
      const entry = [...editionsInScope].sort((a, b) => Number(readable(b)) - Number(readable(a)) || Number(b.type === 'daithua') - Number(a.type === 'daithua'))[0];
      const editions = model.works.get(entry.workKey).filter(e => e.type !== 'phucminh');
      const card = document.createElement('article'); card.className = 'content-book'; card.dataset.contentKey = entry.key; card.dataset.workKey = entry.workKey;
      const hasViet = readable(entry), hasHan = !!Reader.path(entry, 'han');
      const readLabel = hasViet ? 'Đọc' : hasHan ? 'Đọc bản Hán' : entry.type === 'phucminh' ? 'Xem PDF' : 'Xem tệp nguồn';
      const cover = button('', () => LibraryUI.open(entry.type, entry.id), 'content-book-cover'); cover.setAttribute('aria-label', readLabel + ': ' + entry.title); cover.innerHTML = LibraryDesign.jacket(entry, { mini: true }); card.append(cover);
      const body = document.createElement('div'); body.className = 'content-book-body';
      body.innerHTML = '<div class="content-book-meta"><span>' + esc(kinds[entry.kind] || 'Tài liệu') + '</span><span>' + (hasViet ? 'Bản Việt' : hasHan ? 'Hán văn' : 'Tệp nguồn') + '</span>' + (entry.path[0] !== current.path[0] ? '<span>' + (entry.path[0] === 'tu-lieu-chung' ? 'Dùng chung' : 'Liên kết từ kho khác') + '</span>' : '') + '</div><h2>' + esc(entry.title) + '</h2><p class="content-book-credit">' + esc(LibraryDesign.creditLine(entry)) + '</p><p class="content-book-source">' + esc(entry.sourceLabel) + (entry.data.taishoId || entry.type === 'daitang' ? ' · ' + esc(entry.data.taishoId || entry.id) : '') + '</p>';
      const actions = document.createElement('div'); actions.className = 'content-book-actions';
      const read = button(readLabel + ' →', () => LibraryUI.open(entry.type, entry.id), 'r-primary'); read.dataset.contentRead = entry.key; actions.append(read);
      LibraryUI.appendListen(actions, entry).dataset.contentListen = entry.key;
      body.append(actions);
      if (editions.length > 1) {
        const choices = document.createElement('details'); choices.className = 'content-editions'; choices.innerHTML = '<summary>Chọn bản đọc · ' + editions.length + ' bản cùng mã Taishō</summary>';
        editions.forEach(e => {
          const row = document.createElement('div'); row.className = 'content-edition-row'; row.dataset.editionKey = e.key;
          const label = document.createElement('p'); label.textContent = e.sourceLabel + ' · ' + (LibraryDesign.creditLine(e) || (readable(e) ? 'Bản Việt' : 'Hán văn')); row.append(label);
          row.append(button(readable(e) ? 'Đọc bản Việt' : LibraryUI.readLabel(e), () => LibraryUI.open(e.type, e.id)));
          if (Reader.path(e, 'han') && readable(e)) row.append(button('Hán văn', () => LibraryUI.open(e.type, e.id, 'han')));
          LibraryUI.appendListen(row, e);
          choices.append(row);
        }); body.append(choices);
      }
      const details = document.createElement('details'); details.className = 'content-book-provenance'; details.innerHTML = '<summary>Nguồn & phân loại</summary><p>' + esc(entry.sourceGroup || entry.sourceLabel) + '</p><p>' + entry.path.map((_, i) => esc(model.byPath.get(entry.path.slice(0, i + 1).join('/')).title)).join(' › ') + '</p>'; body.append(details);
      const links = (model.placements.get(entry.key) || []).filter(p => p[0] !== current.path[0] && p[0] !== 'tu-lieu-chung');
      links.forEach(p => details.append(button('Mở trong ' + model.byPath.get(p[0]).title + ' ↗', () => go(p[0], p.slice(1)), 'content-path-link')));
      card.append(body); grid.append(card);
    }); panel.append(grid);
    if (pages > 1) {
      const pager = document.createElement('nav'); pager.className = 'content-pagination'; pager.setAttribute('aria-label', 'Trang tác phẩm');
      const previous = button('← Trang trước', () => changePage(options.page - 1)); previous.disabled = options.page === 1;
      const next = button('Trang sau →', () => changePage(options.page + 1)); next.disabled = options.page === pages;
      const info = document.createElement('span'); info.textContent = options.page + ' / ' + pages; pager.append(previous, info, next); panel.append(pager);
    }
    function changePage(n) { options.page = n; render(); panel.querySelector('.content-results-count')?.scrollIntoView({ block: 'start' }); }
  }
  function capture() { return [...filters].map(([id,f])=>[id,{...f}]); }
  function restore(saved) { for (const [id,f] of saved || []) if(filters.has(id)) Object.assign(filters.get(id),f); if(isModule(appState.currentTab)) render(); }
  window.ContentModules = { init, render, route, go, isModule, capture, restore, get model() { return model; } };
})();

/* An independent collection, sharing the library's reader, listening session and storage. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id), S = window.LibraryStore;
  const esc = window.PersistentPlayer.esc, icon = window.PersistentPlayer.icon;
  const books = window.PHUC_MINH_DATA;
  const categories = [...new Set(books.map(b => b.category))];
  let category = 'all', savedOnly = false, availability = 'all', sort = 'featured';
  let pdfBook = null, pdfPage = 1, pdfRequest = null, pdfURL = null, pdfGeneration = 0;
  const find = id => books.find(b => b.id === id);
  const ref = b => ({ type: 'phucminh', id: b.id, data: b });
  const key = b => 'phucminh:' + b.id;
  const favorites = () => S.read('favorites', []);
  const isSaved = b => favorites().some(x => x.key === key(b));
  const time = minutes => minutes >= 60 ? `${Math.floor(minutes / 60)} giờ${minutes % 60 ? ' ' + minutes % 60 + ' phút' : ''}` : `${minutes} phút`;
  const coverCredits = b => (b.credits || []).filter(c => c.cover);
  const cover = b => LibraryDesign.jacket(ref(b), { className: 'pm-cover' });
  function status(message) { $('pm-status').textContent = message; }
  function remember(b) {
    const recent = S.read('recent', []).filter(x => x.key !== key(b));
    recent.unshift({ type: 'phucminh', id: b.id, key: key(b), title: b.title, mode: 'viet', updatedAt: Date.now() });
    S.write('recent', recent.slice(0, 30)); window.LibraryUI?.refreshShelf();
  }
  function save(id) {
    const b = find(id); if (!b) return;
    const list = favorites(), selected = isSaved(b);
    S.write('favorites', selected ? list.filter(x => x.key !== key(b)) : [{ type: 'phucminh', id: b.id, key: key(b), title: b.title }, ...list]);
    LibraryUI.refreshShelf(); render();
    if ($('pm-detail-save')) $('pm-detail-save').textContent = isSaved(b) ? '♥ Đã lưu' : '♡ Lưu sách';
    status(selected ? 'Đã bỏ lưu ' + b.title + '.' : 'Đã lưu ' + b.title + ' vào tủ sách của bạn.');
  }
  async function read(id, page) {
    const b = find(id); if (!b) return;
    if (!b.vietFile) return openPDF(id, page);
    await Reader.open(ref(b), 'viet');
    if (page && Reader.state.ready && Reader.state.key === key(b)) {
      const block = Reader.state.doc.blocks.find(x => x.heading?.title === 'Trang ' + page);
      if (block) Reader.jumpBlock(block.id);
    }
  }
  async function listen(id, page) {
    const b = find(id); if (!b?.vietFile) return;
    status('Đang chuẩn bị giọng đọc cho ' + b.title + '…');
    const played = await DharmaPlayerStore.playItem(ref(b), page ? { page } : {});
    status(played ? 'Trình phát đang mở: ' + b.title + '. Điều chỉnh giọng đọc, tốc độ và hẹn giờ ở thanh nghe.' : DharmaPlayerStore.state.error || 'Chưa phát được. Hãy thử lại ở thanh nghe.');
    refreshContinue();
    window.LibraryDesign?.refresh();
  }
  function enqueue(id) {
    const b = find(id); if (!b?.vietFile) return;
    DharmaPlayerStore.enqueue(ref(b)); status('Đã thêm ' + b.title + ' vào hàng đợi nghe.');
  }
  function refreshContinue() {
    if (!$('pm-continue')) return;
    const recent = S.read('recent', []).find(x => x.type === 'phucminh' && find(x.id));
    const b = recent && find(recent.id);
    $('pm-continue').hidden = !b;
    if (!b) return;
    const pdf = S.read('pm-pdf:' + b.id, null), position = S.read('position:' + key(b) + ':viet', null);
    const usePDF = pdf && (!position || pdf.updatedAt > position.updatedAt);
    $('pm-continue').innerHTML = `<div><span class="eyebrow">TRỞ LẠI TRANG SÁCH</span><strong>${esc(b.title)}</strong><span>${usePDF ? 'PDF · Trang ' + pdf.page + ' / ' + b.pages : 'Bản chữ · Tiếp tục từ vị trí đã lưu'}</span></div><button class="r-button" id="pm-continue-read">Đọc tiếp →</button>${b.vietFile ? '<button class="r-button" id="pm-continue-listen">' + icon('play') + ' Nghe tiếp</button>' : ''}`;
    $('pm-continue-read').onclick = () => usePDF ? openPDF(b.id) : read(b.id);
    if ($('pm-continue-listen')) $('pm-continue-listen').onclick = () => listen(b.id);
  }
  function render() {
    if (!$('pm-books')) return;
    const active = document.activeElement, focusAction = active?.dataset.pmAction, focusId = active?.dataset.id;
    const q = ReaderModel.normalize(appState.searchQuery || '');
    $('pm-search').value = appState.searchQuery || '';
    let list = books.filter(b => (category === 'all' || b.category === category) && (!savedOnly || isSaved(b)) && (availability !== 'audio' || b.vietFile) && ReaderModel.normalize([b.title, b.category, b.description, b.filename, ...(b.credits || []).map(c => c.name)].join(' ')).includes(q));
    if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    if (sort === 'short') list.sort((a, b) => a.pages - b.pages);
    $('pm-count').textContent = `${list.length} / ${books.length} tài liệu`;
    $('pm-books').innerHTML = list.map(b => {
      const saved = isSaved(b), position = S.read('position:' + key(b) + ':viet', null), pdf = S.read('pm-pdf:' + b.id, null);
      return `<article class="pm-card"><button class="pm-cover-button" data-pm-action="details" data-id="${b.id}" aria-label="Xem thông tin ${esc(b.title)}">${cover(b)}</button><div class="pm-card-body"><small>${esc(b.category)}</small><h3><button data-pm-action="details" data-id="${b.id}">${esc(b.title)}</button></h3><p class="pm-card-meta">${b.pages.toLocaleString('vi')} trang · ${b.sourceKind === 'ocr' ? 'OCR tự động · Cần đối chiếu PDF' : b.vietFile ? 'Đọc & nghe' : 'PDF bản ảnh'}</p><p class="pm-description">${esc(b.description)}</p>${position || pdf ? '<span class="pm-progress-label">' + (pdf && (!position || pdf.updatedAt > position.updatedAt) ? 'Đã đọc đến trang ' + pdf.page : 'Có vị trí đọc đã lưu') + '</span>' : ''}<div class="pm-card-actions"><button class="r-primary" data-pm-action="read" data-id="${b.id}">${position || pdf ? 'Đọc tiếp' : 'Đọc sách'} →</button><button class="r-button" data-pm-action="listen" data-id="${b.id}" ${b.vietFile ? '' : 'disabled title="PDF bản ảnh chưa có văn bản để nghe"'}>${icon('play')} Nghe</button></div><div class="pm-card-secondary"><button class="r-button" data-pm-action="save" data-id="${b.id}" aria-pressed="${saved}" aria-label="${saved ? 'Bỏ lưu' : 'Lưu'} ${esc(b.title)}">${saved ? '♥ Đã lưu' : '♡ Lưu sách'}</button><button class="r-button" data-pm-action="pdf" data-id="${b.id}">Xem PDF ↗</button></div>${!b.vietFile ? '<small class="pm-image-note">Bản ảnh · Chưa có nội dung nghe</small>' : ''}</div></article>`;
    }).join('');
    $('pm-empty').hidden = !!list.length;
    $('pm-books').querySelectorAll('.pm-card').forEach(card => {
      const b = find(card.querySelector('[data-id]').dataset.id);
      if (!coverCredits(b).length) return;
      const byline = document.createElement('p'); byline.className = 'pm-byline';
      byline.innerHTML = coverCredits(b).map(c => `<span>${esc(c.role)}: <strong>${esc(c.name)}</strong></span>`).join('');
      card.querySelector('.pm-card-meta').before(byline);
    });
    document.querySelectorAll('[data-pm-category]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pmCategory === category)));
    $('pm-saved').setAttribute('aria-pressed', String(savedOnly));
    refreshContinue();
    window.LibraryDesign?.refresh();
    if (focusAction && focusId) ($('pm-books').querySelector(`[data-pm-action="${focusAction}"][data-id="${focusId}"]`) || $('pm-saved')).focus({ preventScroll: true });
  }
  function reset() {
    category = 'all'; savedOnly = false; availability = 'all'; sort = 'featured'; appState.searchQuery = '';
    $('global-search').value = ''; $('pm-availability').value = 'all'; $('pm-sort').value = 'featured'; render(); $('pm-search').focus();
  }
  function details(id) {
    const b = find(id); if (!b) return;
    $('pm-detail-content').innerHTML = `<div class="pm-detail-layout">${cover(b)}<div><span class="eyebrow">${esc(b.category)}</span><h2 id="pm-detail-title">${esc(b.title)}</h2><p>${esc(b.description)}</p><dl><div><dt>Độ dài</dt><dd>${b.pages.toLocaleString('vi')} trang PDF</dd></div><div><dt>Bản đọc</dt><dd>${b.vietFile ? 'Bản chữ và PDF gốc' : 'PDF bản ảnh'}</dd></div><div><dt>Thời lượng nghe</dt><dd>${b.vietFile ? 'Ước tính ' + time(b.listenMinutes) : 'Chưa có văn bản để tạo giọng đọc'}</dd></div><div><dt>Dung lượng PDF</dt><dd>${(b.bytes / 1048576).toLocaleString('vi', { maximumFractionDigits: 1 })} MB</dd></div></dl></div></div><p class="pm-detail-note">${b.vietFile ? 'Bản chữ được trích xuất từ PDF; có thể còn lỗi ký tự hoặc khoảng cách. Mở PDF để đối chiếu. Giọng đọc tổng hợp tiếng Việt có thể phát âm từ Pāḷi chưa chuẩn.' : 'Tài liệu chủ yếu là trang ảnh. Bạn có thể đọc, phóng to và lưu vị trí trong trình xem PDF.'}</p><div class="pm-detail-actions"><button id="pm-detail-read" class="r-primary">Đọc sách →</button><button id="pm-detail-listen" class="r-button" ${b.vietFile ? '' : 'disabled'}>${icon('play')} Nghe sách</button><button id="pm-detail-queue" class="r-button" ${b.vietFile ? '' : 'disabled'}>+ Hàng đợi</button><button id="pm-detail-save" class="r-button">${isSaved(b) ? '♥ Đã lưu' : '♡ Lưu sách'}</button><button id="pm-detail-pdf" class="r-button">Xem PDF</button></div><p id="pm-detail-status" role="status"></p>`;
    $('pm-detail-read').onclick = () => { $('pm-detail').close(); read(id); };
    if (b.credits?.length) $('pm-detail-content').querySelector('dl').insertAdjacentHTML('afterbegin', b.credits.map(c => `<div><dt>${esc(c.role)}</dt><dd>${esc(c.name)}</dd></div>`).join(''));
    $('pm-detail-listen').onclick = () => { $('pm-detail').close(); listen(id); };
    $('pm-detail-queue').onclick = () => { enqueue(id); $('pm-detail-status').textContent = 'Đã thêm vào hàng đợi nghe.'; };
    $('pm-detail-save').onclick = () => save(id);
    $('pm-detail-pdf').onclick = () => { $('pm-detail').close(); openPDF(id); };
    if (!$('pm-detail').open) $('pm-detail').showModal();
    window.LibraryDesign?.refresh();
  }
  async function loadPage(number) {
    if (!pdfBook) return;
    const next = Math.max(1, Math.min(pdfBook.pages, Number(number) || 1));
    pdfRequest?.abort(); pdfRequest = new AbortController(); const token = ++pdfGeneration;
    pdfPage = next; $('pm-pdf-page').value = next; $('pm-pdf-total').textContent = '/ ' + pdfBook.pages;
    $('pm-pdf-previous').disabled = next === 1; $('pm-pdf-next').disabled = next === pdfBook.pages;
    $('pm-pdf-progress').value = next; $('pm-pdf-status').textContent = `Đang tải trang ${next}…`;
    $('pm-pdf-stage').setAttribute('aria-busy', 'true'); $('pm-pdf-image').hidden = true; $('pm-pdf-retry').hidden = true;
    try {
      const response = await fetch(`/api/phucminh/page?id=${encodeURIComponent(pdfBook.id)}&page=${next}`, { signal: pdfRequest.signal });
      if (!response.ok) throw new Error('Chưa tải được trang. Thử lại hoặc mở PDF gốc.');
      const blob = await response.blob(); if (token !== pdfGeneration) return;
      if (pdfURL) URL.revokeObjectURL(pdfURL); pdfURL = URL.createObjectURL(blob);
      const img = $('pm-pdf-image'); img.src = pdfURL; img.alt = `${pdfBook.title} · Trang ${next}`; img.hidden = false;
      $('pm-pdf-stage').scrollTop = 0; $('pm-pdf-status').textContent = `Trang ${next} / ${pdfBook.pages} · Vị trí đã được lưu trên thiết bị này.`;
      S.write('pm-pdf:' + pdfBook.id, { page: next, updatedAt: Date.now() });
    } catch (error) {
      if (token !== pdfGeneration || error.name === 'AbortError') return;
      $('pm-pdf-status').textContent = error.message; $('pm-pdf-retry').hidden = false;
    } finally { if (token === pdfGeneration) $('pm-pdf-stage').setAttribute('aria-busy', 'false'); }
  }
  function openPDF(id, page) {
    const b = find(id); if (!b) return;
    if (Reader.state.item) Reader.close();
    pdfBook = b; remember(b);
    $('pm-pdf-title').textContent = b.title; $('pm-pdf-page').max = b.pages; $('pm-pdf-progress').max = b.pages;
    $('pm-pdf-source').href = $('pm-pdf-download').href = b.pdfFile; $('pm-pdf-download').download = b.filename;
    $('pm-pdf-read').disabled = $('pm-pdf-listen').disabled = !b.vietFile;
    $('pm-pdf-read').hidden = $('pm-pdf-listen').hidden = !b.vietFile;
    $('pm-pdf-zoom').value = '100'; $('pm-pdf-image').style.width = '100%';
    if (!$('pm-pdf').open) $('pm-pdf').showModal();
    loadPage(page || S.read('pm-pdf:' + id, {})?.page || 1);
  }
  function decorateHome() {
    const entry = document.createElement('section'); entry.className = 'pm-home-entry home-section';
    entry.innerHTML = `<div class="pm-home-symbol" aria-hidden="true">${LibraryArt.svg('lotus')}</div><div><span class="eyebrow">TỦ SÁCH MỚI TRONG THƯ VIỆN</span><h2>Chùa Phúc Minh</h2><p>${books.length} tài liệu · Kinh điển, thiền tập và thi kệ.<br>Đọc theo nhịp của bạn, lắng nghe lúc thảnh thơi.</p></div><button class="r-primary" id="pm-home-open">Khám phá tủ sách →</button>`;
    document.querySelector('.featured-section').before(entry);
    $('pm-home-open').onclick = () => switchTab('phucminh');
  }
  function init() {
    const section = document.createElement('section'); section.id = 'tab-phucminh'; section.className = 'tab-panel pm-module'; section.style.display = 'none'; section.setAttribute('role', 'tabpanel'); section.setAttribute('aria-labelledby', 'nav-phucminh');
    section.innerHTML = `<div class="pm-hero"><div><span class="eyebrow">TỦ SÁCH CHÙA PHÚC MINH</span><h1>Trang sách mở.<br><em>Tâm an nhiên.</em></h1><p>Gặp lời kinh trong từng trang sách.<br>Đọc, lắng nghe và nuôi dưỡng việc tu học mỗi ngày.</p><a href="#pm-catalog" class="r-primary">Chọn một cuốn sách ↓</a></div><div class="pm-hero-art" aria-hidden="true">${LibraryArt.svg('lotus')}<span>VĂN · TƯ · TU</span></div><div class="pm-hero-facts"><span><strong>${books.length}</strong> tài liệu</span><span><strong>${books.filter(b => b.vietFile).length}</strong> bản đọc & nghe</span><span><strong>${books.reduce((n, b) => n + b.pages, 0).toLocaleString('vi')}</strong> trang sách</span></div></div><section class="pm-continue" id="pm-continue" aria-label="Tiếp tục đọc" hidden></section><div class="pm-paths"><span>BẮT ĐẦU TỪ ĐÂY</span>${books.filter(b => b.featured).map((b, i) => `<button data-pm-action="details" data-id="${b.id}"><small>0${i + 1} · ${['TÌM HIỂU GIÁO PHÁP', 'ĐỒNG HÀNH THIỀN TẬP', 'THỜI KHÓA MỖI NGÀY'][i]}</small><strong>${esc(b.title)}</strong><span>Khám phá →</span></button>`).join('')}</div><section id="pm-catalog" class="pm-catalog" aria-labelledby="pm-catalog-title"><div class="pm-catalog-heading"><div><span class="eyebrow">CHỌN ĐỌC · CHỌN NGHE</span><h2 id="pm-catalog-title">Tất cả sách trong tủ</h2></div><span id="pm-count" role="status"></span></div><div class="pm-filter-bar"><label class="pm-search-label" for="pm-search">Tìm trong tủ sách<input id="pm-search" type="search" placeholder="Tên sách, chủ đề… (có thể gõ không dấu)"></label><label for="pm-availability">Hình thức<select id="pm-availability"><option value="all">Tất cả tài liệu</option><option value="audio">Có thể nghe</option></select></label><label for="pm-sort">Sắp xếp<select id="pm-sort"><option value="featured">Gợi ý của tủ sách</option><option value="title">Tên sách A–Z</option><option value="short">Ít trang trước</option></select></label></div><div class="pm-categories" aria-label="Lọc chủ đề"><button data-pm-category="all" aria-pressed="true">Tất cả</button>${categories.map(c => `<button data-pm-category="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}<button id="pm-saved" aria-pressed="false">♡ Đã lưu</button></div><p id="pm-status" class="pm-status" role="status" aria-live="polite"></p><div id="pm-books" class="pm-books"></div><div id="pm-empty" class="pm-empty" hidden><h3>Chưa tìm thấy sách phù hợp</h3><p>Thử tên sách ngắn hơn hoặc chọn lại chủ đề.</p><button id="pm-reset" class="r-button">Xóa bộ lọc</button></div><p class="pm-catalog-note">Giọng đọc tổng hợp tiếng Việt. Hai tập Câu đối pháp có bản OCR tự động, cần đối chiếu PDF trước khi dùng để tụng đọc.</p></section>`;
    document.querySelector('main').append(section);
    const nav = document.createElement('button'); nav.id = 'nav-phucminh'; nav.className = 'nav-tab'; nav.dataset.tab = 'phucminh'; nav.setAttribute('role', 'tab'); nav.setAttribute('aria-selected', 'false'); nav.setAttribute('aria-controls', 'tab-phucminh'); nav.textContent = 'Chùa Phúc Minh'; nav.onclick = () => switchTab('phucminh'); $('nav-tabs-container').prepend(nav);
    document.body.insertAdjacentHTML('beforeend', `<dialog id="pm-detail" class="dharma-dialog pm-detail" aria-labelledby="pm-detail-title"><button id="pm-detail-close" class="pm-dialog-close r-button" aria-label="Đóng thông tin sách">×</button><div id="pm-detail-content"></div></dialog><dialog id="pm-pdf" class="pm-pdf" aria-labelledby="pm-pdf-title"><header class="pm-pdf-header"><div><span class="eyebrow">CHÙA PHÚC MINH · BẢN PDF GỐC</span><h2 id="pm-pdf-title"></h2></div><button id="pm-pdf-close" class="r-button" aria-label="Đóng trình xem PDF">×</button></header><div class="pm-pdf-toolbar"><button id="pm-pdf-read" class="r-button">Đọc bản chữ</button><button id="pm-pdf-listen" class="r-button">${icon('play')} Nghe từ trang này</button><label>Phóng to<select id="pm-pdf-zoom"><option value="75">75%</option><option value="100" selected>Vừa chiều rộng</option><option value="125">125%</option><option value="150">150%</option><option value="200">200%</option></select></label><a id="pm-pdf-source" class="r-button" target="_blank" rel="noopener">PDF gốc ↗</a><a id="pm-pdf-download" class="r-button" download>Tải PDF ↓</a></div><p id="pm-pdf-status" class="pm-pdf-status" role="status"></p><div id="pm-pdf-stage" class="pm-pdf-stage" tabindex="0" aria-label="Trang PDF, dùng phím mũi tên để chuyển trang"><img id="pm-pdf-image" alt=""><button id="pm-pdf-retry" class="r-button" hidden>Thử tải lại trang</button></div><footer class="pm-pdf-footer"><div class="pm-pdf-pagination"><button id="pm-pdf-previous" class="r-button" aria-label="Trang trước">←</button><label for="pm-pdf-page">Trang</label><input id="pm-pdf-page" type="number" min="1" value="1"><span id="pm-pdf-total"></span><button id="pm-pdf-next" class="r-button" aria-label="Trang tiếp">→</button></div><input id="pm-pdf-progress" type="range" min="1" value="1" aria-label="Chuyển đến trang PDF"></footer></dialog>`);
    section.addEventListener('click', e => {
      const target = e.target.closest('[data-pm-action]'); if (!target) return;
      const actions = { details, read: id => { const b = find(id), pdf = S.read('pm-pdf:' + id, null), pos = S.read('position:' + key(b) + ':viet', null); return pdf && (!pos || pdf.updatedAt > pos.updatedAt) ? openPDF(id) : read(id); }, listen, save, pdf: openPDF };
      actions[target.dataset.pmAction]?.(target.dataset.id);
      if (target.dataset.pmAction === 'save') section.querySelector(`[data-pm-action="save"][data-id="${target.dataset.id}"]`)?.focus({ preventScroll: true });
    });
    $('pm-search').oninput = e => { appState.searchQuery = e.target.value; $('global-search').value = e.target.value; render(); };
    section.querySelectorAll('[data-pm-category]').forEach(b => b.onclick = () => { category = b.dataset.pmCategory; render(); });
    $('pm-availability').onchange = e => { availability = e.target.value; render(); };
    $('pm-sort').onchange = e => { sort = e.target.value; render(); };
    $('pm-saved').onclick = () => { savedOnly = !savedOnly; render(); };
    $('pm-reset').onclick = reset;
    section.querySelector('a[href="#pm-catalog"]').onclick = e => { e.preventDefault(); $('pm-catalog').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); $('pm-search').focus({ preventScroll: true }); };
    $('pm-detail-close').onclick = () => $('pm-detail').close();
    $('pm-pdf-close').onclick = () => $('pm-pdf').close();
    $('pm-pdf').addEventListener('close', () => { pdfRequest?.abort(); pdfGeneration++; if (pdfURL) URL.revokeObjectURL(pdfURL); pdfURL = null; pdfBook = null; render(); });
    $('pm-pdf-previous').onclick = () => loadPage(pdfPage - 1); $('pm-pdf-next').onclick = () => loadPage(pdfPage + 1);
    $('pm-pdf-page').onchange = e => loadPage(e.target.value); $('pm-pdf-progress').onchange = e => loadPage(e.target.value);
    $('pm-pdf-retry').onclick = () => loadPage(pdfPage);
    $('pm-pdf-zoom').onchange = e => { $('pm-pdf-image').style.width = e.target.value + '%'; };
    $('pm-pdf-read').onclick = () => { const id = pdfBook.id, page = pdfPage; $('pm-pdf').close(); read(id, page); };
    $('pm-pdf-listen').onclick = () => { const id = pdfBook.id, page = pdfPage; $('pm-pdf').close(); listen(id, page).catch(error => status(error.message)); };
    $('pm-pdf').addEventListener('keydown', e => { if (e.target.matches('input,select')) return; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); loadPage(pdfPage + (e.key === 'ArrowLeft' ? -1 : 1)); } });
    $('reader-close').addEventListener('click', refreshContinue);
    window.addEventListener('storage', render);
    render();
  }
  window.PhucMinh = { init, render, read, listen, details, openPDF, decorateHome, refreshContinue };
})();

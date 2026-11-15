(function () {
  'use strict';
  const $ = id => document.getElementById(id), M = window.ReaderModel, S = window.LibraryStore;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const state = { item: null, mode: 'viet', key: '', doc: null, han: null, sections: [], section: 0, block: '', edits: {}, undo: [], request: null, generation: 0, start: 0, end: 0, ready: false, previousFocus: null, previousHash: '', hanSection: 0, searchQuery: '', fullscreen: false };
  const defaults = { size: 6500, view: 'paged', font: 21, line: 1.85, spacing: 1, width: 820, sidebar: 280, align: 'left', serif: true, notes: true, reduced: false, focus: false, chant: false };
  const contextExpansion = new Map();
  const pref = { ...defaults, ...S.read('reader-preferences', {}) };
  let scrollTimer, autoFrame = null, autoSpeed = 0, searchTimer, resizeAnchor = null;
  let searchReturn=null;
  let compactViewport = innerWidth < 900;
  let fullscreenPending = false, fullscreenOwned = false, fullscreenAttempt = false, fullscreenGeneration = 0;
  const pages = { index: 0, total: 1, stride: 0, anchor: null };
  let pageLayoutFrame = 0, listenPending = false, touchStart = null;
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${{ back: 'M15 18l-6-6 6-6', next: 'M9 6l6 6-6 6', toc: 'M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01', bookmark: 'M6 3h12v18l-6-4-6 4z', headphones: 'M4 14v-3a8 8 0 0116 0v3M4 13h3v7H4a2 2 0 01-2-2v-3a2 2 0 012-2zm16 0h-3v7h3a2 2 0 002-2v-3a2 2 0 00-2-2z', focus: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5', search: 'M21 21l-5-5M18 10a8 8 0 11-16 0 8 8 0 0116 0', check: 'M5 12l4 4L19 6' }[name]}"/></svg>`;
  function isPaged() { return pref.view === 'paged' && state.mode !== 'dual'; }
  function notice(text) { $('reader-message').textContent = text; }
  function title(item) { return item.type === 'daithua' ? item.data.title : item.data.vietTitle || item.data.title; }
  function path(item, mode) { return item.type === 'daithua' ? item.data.files[{ viet: 'vietMd', han: 'hanMd', note: 'noteMd' }[mode]] : mode === 'viet' ? item.data.vietFile : mode === 'han' ? item.data.hanFile : null; }
  function key(item) { return item.type + ':' + item.data.id; }
  function init() {
    $('reader-view-container').innerHTML = `
      <header class="reader-topbar">
        <button class="r-button reader-icon-button" id="reader-close" aria-label="Về thư viện">${icon('back')}<span>Thư viện</span></button>
        <div class="reader-book-info"><small id="reader-book-subtitle"></small><h2 id="reader-book-title"></h2></div>
        <div class="reader-mode-switch" aria-label="Bản kinh">${[['viet', 'Bản Việt'], ['han', 'Hán văn'], ['dual', 'Đối chiếu'], ['note', 'Khảo chứng']].map(([m, label]) => `<button class="r-button" data-reader-mode="${m}">${label}</button>`).join('')}</div>
        <button class="r-button" id="reader-listen-toggle" aria-label="Nghe bản kinh đang đọc" aria-controls="persistent-player">${icon('headphones')}<span>Nghe kinh</span></button>
        <button class="r-button" id="reader-fullscreen" aria-pressed="false" aria-label="Đọc toàn màn hình" aria-keyshortcuts="Alt+Enter" title="Toàn màn hình (Alt + Enter)"></button>
        <button class="r-button" id="reader-focus-exit" hidden>Thoát tập trung</button>
      </header>
      <div class="reader-toolstrip">
        <button class="r-button" id="reader-toc-toggle" aria-expanded="false" aria-controls="reader-sidebar">${icon('toc')}<span>Mục lục</span></button>
        <span id="reader-breadcrumb" class="reader-breadcrumb"></span>
        <div class="reader-view-switch" role="group" aria-label="Cách đọc"><button class="r-button" data-reading-view="paged" aria-pressed="false">Lật trang</button><button class="r-button" data-reading-view="parts" aria-pressed="false">Cuộn</button></div>
        <button class="r-button reader-icon-button" id="reader-mark" aria-label="Đánh dấu đoạn đang đọc" title="Đánh dấu đoạn đang đọc">${icon('bookmark')}</button>
        <button class="r-button" id="reader-phuc-pdf" hidden>Bản PDF</button>
        <div class="reader-font-quick" aria-label="Cỡ chữ"><button class="r-button" id="reader-font-down" aria-label="Giảm cỡ chữ">A−</button><button class="r-button" id="reader-font-up" aria-label="Tăng cỡ chữ">A+</button></div>
        <button class="r-button reader-icon-button" id="reader-focus" aria-label="Chế độ đọc tập trung" aria-pressed="false" title="Đọc tập trung">${icon('focus')}</button>
        <button class="r-button" data-panel="settings">Aa <span>Kiểu đọc</span></button>
        <button class="r-button reader-icon-button" data-panel="research" aria-label="Tìm kiếm và ghi chú" title="Tìm kiếm và ghi chú">${icon('search')}</button>
      </div>
      <div class="reader-main-body">
        <button class="reader-drawer-backdrop" id="reader-drawer-backdrop" aria-label="Đóng bảng công cụ để tiếp tục đọc" tabindex="-1"></button>
        <aside class="reader-sidebar" id="reader-sidebar" aria-label="Mục lục kinh">
          <div class="sidebar-heading"><span class="eyebrow">MỤC LỤC KINH</span><button class="r-button" id="toc-close" aria-label="Đóng mục lục">×</button></div>
          <label class="sr-only" for="toc-search">Tìm mục lục</label><input id="toc-search" placeholder="Tìm quyển, phẩm, mục…" type="search">
          <div class="toc-options"><label><input id="toc-major" type="checkbox"> Chỉ mục lớn</label><button class="r-button" id="toc-collapse">Thu gọn</button></div>
          <nav id="reader-toc-list" aria-label="Các phần kinh"></nav>
          <div class="toc-width"><button class="r-button" id="toc-narrow" aria-label="Thu hẹp mục lục">−</button><span>Độ rộng mục lục</span><button class="r-button" id="toc-widen" aria-label="Mở rộng mục lục">+</button></div>
        </aside>
        <div id="reader-resizer" role="separator" aria-label="Độ rộng mục lục" aria-orientation="vertical" tabindex="0" aria-valuemin="220" aria-valuemax="420" aria-valuenow="280"></div>
        <section class="reader-content-pane" id="reader-scroll" tabindex="0" aria-label="Nội dung kinh" aria-describedby="reader-keyboard-help">
          <span id="reader-keyboard-help" class="sr-only">Dùng phím trái và phải để chuyển trang. Nhấn Enter để chọn đoạn đang đọc và ghi chú.</span>
          <article class="reader-paper" id="reader-paper-content"></article>
        </section>
        <aside class="reader-inspector" id="reader-inspector" hidden>
          <div class="inspector-heading"><strong id="inspector-title">Cài đặt đọc</strong><button class="r-button" id="inspector-close" aria-label="Đóng bảng công cụ">×</button></div>
          <div id="reader-settings">
            <div class="reader-settings-preview" aria-hidden="true"><span>Aa</span><p>Một trang kinh, một khoảng lặng.</p></div>
            <label for="r-font">Cỡ chữ <output id="font-output" for="r-font"></output><input id="r-font" type="range" min="16" max="36" step="1"></label>
            <label>Giãn dòng<input id="r-line" type="range" min="1.5" max="2.5" step="0.05"></label>
            <label>Khoảng cách đoạn<input id="r-spacing" type="range" min="0.5" max="2.5" step="0.1"></label>
            <label>Chiều rộng trang<input id="r-width" type="range" min="520" max="1000" step="20"></label>
            <label>Kiểu chữ<select id="r-serif"><option value="true">Chữ có chân · Sách kinh</option><option value="false">Chữ không chân · Rõ nét</option></select></label>
            <label>Căn chữ<select id="r-align"><option value="left">Căn trái</option><option value="justify">Căn đều</option></select></label>
            <label>Độ dài phần đọc<select id="r-size"><option value="3000">Ngắn</option><option value="6500">Vừa</option><option value="12000">Dài</option></select></label>
            <label>Cách đọc<select id="r-view"><option value="paged">Lật trang · Như sách điện tử</option><option value="parts">Cuộn từng phần</option><option value="continuous">Cuộn liên tục</option></select></label>
            <label><input id="r-notes" type="checkbox"> Hiện chú thích trong kinh</label>
            <label><input id="r-reduced" type="checkbox"> Giảm chuyển động</label>
            <label><input id="r-chant" type="checkbox"> Chế độ tụng · Chữ lớn</label>
            <label>Cuộn tự động<select id="r-auto"><option value="0">Tắt</option><option value="12">Chậm</option><option value="24">Vừa</option><option value="40">Nhanh</option></select></label>
            <div class="reader-themes"><button class="r-button" data-r-theme="parchment">Bạch Ngọc</button><button class="r-button" data-r-theme="amber">Hoàng Y</button><button class="r-button" data-r-theme="night">Dạ Thiền</button></div>
            <button class="r-button" id="reader-edit-toggle">Hiệu chỉnh mục lục</button>
            <a id="reader-source-link" target="_blank" rel="noopener">Mở văn bản nguồn ↗</a><a id="reader-pdf-link" target="_blank" rel="noopener" hidden>Mở bản PDF ↗</a>
          </div>
          <div id="reader-research" hidden>
            <label>Tìm trong toàn bài kinh<input id="reader-search" type="search" placeholder="Nhập câu kinh hoặc thuật ngữ…"></label><div id="reader-search-results"></div>
            <div class="research-divider"></div><p id="selected-label">Chọn một đoạn trong kinh để ghi chú.</p>
            <label>Ghi chú cho đoạn đã chọn<textarea id="reader-note-input" rows="4" placeholder="Điều bạn muốn ghi nhớ…"></textarea></label><button class="r-primary" id="reader-note-save">Lưu ghi chú</button>
            <h3>Dấu trang & ghi chú</h3><div id="reader-marks"></div>
            <button class="r-button" id="reader-mark-secondary">Đánh dấu đoạn đang chọn</button>
            <button class="r-button" id="reader-hear-from">Nghe từ đoạn đã chọn</button><button class="r-button" id="reader-copy-link">Sao chép liên kết đoạn</button><button class="r-button" id="reader-notes-export">Xuất ghi chú Markdown</button>
          </div>
          <div id="reader-editor" hidden>
            <p>Chọn đoạn kinh, đặt điểm chia rồi xem trước. Kinh văn gốc được giữ nguyên.</p>
            <label>Tên mục hiển thị<input id="edit-title" maxlength="180"></label>
            <label>Cấp mục<select id="edit-level"><option value="1">1 · Quyển / Phần</option><option value="2">2 · Phẩm / Bài kinh</option><option value="3">3 · Mục / Phần đọc</option></select></label>
            <button class="r-primary" id="edit-split">Xem trước điểm chia / tên mục</button><button class="r-button" id="edit-merge">Gộp phần này với phần trước</button>
            <button class="r-button" id="edit-apply">Lưu cấu trúc</button><button class="r-button" id="edit-undo">Hoàn tác</button><button class="r-button" id="edit-reset">Xem trước cấu trúc mặc định</button>
            <button class="r-button" id="edit-export">Xuất mục lục</button><label class="file-label">Nhập mục lục<input id="edit-import" type="file" accept="application/json,.json"></label>
            <p id="edit-status">Hiệu chỉnh chỉ áp dụng trên thiết bị này; có thể xuất để dùng chung.</p>
          </div>
          <div id="reader-audio-settings" hidden>
            <p id="reader-listening-hint">Vị trí đọc và nghe được tự động ghi nhớ.</p>
            <label>Giọng đọc tiếng Việt<select id="audio-voice"></select></label>
            <label>Chọn phẩm để nghe<select id="audio-chapter"></select></label>
            <label for="audio-rate">Tốc độ nghe <output id="audio-rate-value" for="audio-rate">0.95×</output><input id="audio-rate" aria-label="Tốc độ nghe" type="range" min="0.65" max="1.5" step="0.05"></label>
            <label>Hẹn dừng<select id="audio-sleep"><option value="0">Không hẹn</option><option value="15">15 phút</option><option value="30">30 phút</option><option value="45">45 phút</option><option value="60">60 phút</option></select></label>
            <label for="audio-progress">Chọn đoạn nghe</label><input id="audio-progress" type="range" min="0" max="0" value="0">
            <div class="reader-audio-actions"><button class="r-button" id="audio-sample">Nghe thử giọng</button><button class="r-button" id="reader-read-listening">Đọc từ đoạn nghe</button></div>
            <details class="audio-transcript"><summary>Đoạn kinh đang nghe</summary><p id="audio-current-text"></p></details>
            <p class="audio-continuity-hint">Tự nghe tiếp qua các đoạn và phẩm đến hết kinh.</p>
            <p id="audio-service-note"></p>
            <p id="audio-status" role="status"></p>
          </div>
        </aside>
      </div>
      <div id="reader-listening-tools" hidden><button class="r-button" id="reader-hear-visible" title="Bắt đầu nghe từ trang đang đọc">${icon('headphones')}<span>Nghe từ đây</span></button><label class="audio-follow-toggle" title="Tự chuyển trang theo đoạn đang nghe"><input id="audio-follow" type="checkbox" aria-label="Theo lời kinh" checked><span class="audio-follow-track" aria-hidden="true"></span><span class="audio-follow-label">Theo lời kinh</span></label></div>
      <footer class="reader-bottombar" aria-label="Điều khiển đọc và nghe"><div class="reader-footer-inner" role="group" aria-label="Điều hướng trang đọc"><span class="dp-reading-label">ĐỌC</span><button class="r-button" id="reader-prev" aria-label="Trang trước" title="Trang trước">${icon('back')}<span>Trang trước</span></button><div class="reader-progress-info"><button class="reader-page-button" id="reader-page-indicator" title="Mở mục lục để chọn phần đọc" aria-controls="reader-sidebar" aria-expanded="false" disabled></button><progress id="reader-progress" max="100" value="0" aria-label="Tiến độ đọc"></progress></div><div class="reader-page-actions"><span id="reader-saved-position" class="reader-saved-position" title="Tự lưu vị trí đọc">${icon('check')}<span class="reader-save-label">Tự lưu vị trí</span></span><button class="r-button" id="reader-next" aria-label="Trang tiếp" title="Trang tiếp"><span>Trang tiếp</span>${icon('next')}</button></div></div></footer>
      <div id="reader-message" class="reader-message" role="status"></div>`;
    const modes = document.querySelector('.reader-mode-switch');
    const strip = document.querySelector('.reader-toolstrip');
    const mobileTools = document.createElement('div'); mobileTools.className = 'reader-mobile-tools';
    $('reader-settings').prepend(mobileTools);
    const settingsButton = document.querySelector('[data-panel="settings"]');
    const researchButton = document.querySelector('[data-panel="research"]');
    const placeTools = () => {
      $('reader-settings').append(modes);
      if (innerWidth <= 800) {
        mobileTools.append($('reader-mark'), $('reader-focus'), researchButton);
        settingsButton.innerHTML = 'Aa <span>Kiểu đọc</span>';
      } else {
        strip.insertBefore($('reader-mark'), document.querySelector('.reader-font-quick'));
        strip.insertBefore($('reader-focus'), settingsButton); strip.append(researchButton);
        settingsButton.innerHTML = 'Aa <span>Kiểu đọc</span>';
      }
    };
    placeTools(); matchMedia('(max-width: 800px)').addEventListener('change', placeTools);
    $('reader-close').onclick = close;
    $('reader-fullscreen').onclick = toggleFullscreen;
    document.addEventListener('fullscreenchange', fullscreenChanged);
    document.addEventListener('webkitfullscreenchange', fullscreenChanged);
    updateFullscreenButton();
    document.querySelectorAll('[data-reader-mode]').forEach(b => b.onclick = () => open(state.item, b.dataset.readerMode));
    document.querySelectorAll('[data-panel]').forEach(b => b.onclick = () => panel(b.dataset.panel));
    $('inspector-close').onclick = () => panel(null);
    $('reader-drawer-backdrop').onclick = () => { toggleToc(false); panel(null); };
    $('reader-toc-toggle').onclick = () => toggleToc(); $('toc-close').onclick = () => toggleToc(false);
    $('toc-search').oninput = renderToc; $('toc-major').onchange = renderToc;
    $('toc-collapse').onclick = () => { const groups = [...$('reader-toc-list').querySelectorAll('details')]; const close = groups.some(d => d.open); groups.forEach(d => d.open = !close); $('toc-collapse').textContent = close ? 'Mở rộng' : 'Thu gọn'; };
    $('reader-prev').onclick = () => navigate(-1);
    $('reader-next').onclick = () => navigate(1);
    $('reader-page-indicator').onclick = () => { toggleToc(true); $('reader-toc-list').querySelector('[aria-current]')?.focus({ preventScroll: true }); };
    document.querySelectorAll('[data-reading-view]').forEach(button => button.onclick = () => {
      const anchor = capture(); pref.view = button.dataset.readingView; $('r-view').value = pref.view;
      applyPreferences(); rebuild(anchor.block); restoreAnchor(anchor); savePosition();
    });
    $('reader-scroll').addEventListener('scroll', onScroll, { passive: true });
    $('reader-scroll').addEventListener('touchstart', e => { touchStart = isPaged() && e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null; }, { passive: true });
    $('reader-scroll').addEventListener('touchend', e => {
      if (!touchStart || !isPaged() || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - touchStart.x, dy = e.changedTouches[0].clientY - touchStart.y; touchStart = null;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5 && !window.getSelection()?.toString()) navigate(dx < 0 ? 1 : -1);
    }, { passive: true });
    $('reader-scroll').addEventListener('wheel', () => setAuto(0), { passive: true });
    $('reader-paper-content').onclick = e => { const b = e.target.closest('[data-block]'); if (b) selectBlock(b.dataset.block); };
    $('reader-mark').onclick = () => addMark();
    $('reader-mark-secondary').onclick = () => addMark();
    $('reader-note-save').onclick = () => addMark($('reader-note-input').value.trim());
    $('reader-search').oninput = () => { clearTimeout(searchTimer); searchTimer = setTimeout(search, 200); };
    const toggleFocus = () => { const anchor = isPaged() ? pages.anchor || capture() : capture(); pref.focus = !pref.focus; if (pref.focus) { panel(null); toggleToc(false); } applyPreferences(); restoreAnchor(anchor); savePosition(); };
    $('reader-focus').onclick = toggleFocus; $('reader-focus-exit').onclick = toggleFocus;
    $('reader-listen-toggle').onclick = () => {
      const audio = window.Audiobook.state;
      if (audio.key === state.key && audio.count && ['playing', 'loading', 'paused', 'error'].includes(audio.status)) { toggleAudio(true); $('dp-play').focus({ preventScroll: true }); }
      else listenFrom(null, false);
    };
    $('reader-hear-visible').onclick = () => {
      const anchor = capture();
      if ($('dp-options')?.open) $('dp-options').close();
      listenFrom(anchor.block, true, anchor.textOffset || 0);
    };
    $('reader-read-listening').onclick = readFromListening;
    window.addEventListener('dharma-audio', updateListening);
    window.addEventListener('dharma-document', updateListening);
    for (const [id, step] of [['reader-font-down', -1], ['reader-font-up', 1]]) $(id).onclick = () => { const anchor = isPaged() ? pages.anchor || capture() : capture(); pref.font = Math.max(16, Math.min(36, pref.font + step)); $('r-font').value = pref.font; applyPreferences(); restoreAnchor(anchor); savePosition(); };
    $('reader-copy-link').onclick = async () => { try { await navigator.clipboard.writeText(location.href); notice('Đã sao chép liên kết đoạn kinh.'); } catch { notice('Bạn có thể sao chép đường dẫn từ thanh địa chỉ.'); } };
    $('reader-notes-export').onclick = exportNotes;
    $('reader-hear-from').onclick = () => listenFrom(state.block, true);
    $('reader-edit-toggle').onclick = () => panel('editor');
    $('edit-split').onclick = editSplit; $('edit-merge').onclick = editMerge;
    $('edit-apply').onclick = () => { if (!state.doc) return; S.write('outline:' + state.key + ':' + state.mode, { version: state.doc.version, edits: state.edits }); $('edit-status').textContent = 'Đã lưu cấu trúc mục lục.'; };
    $('edit-undo').onclick = () => { if (state.undo.length) { state.edits = state.undo.pop(); rebuild(state.block); $('edit-status').textContent = 'Đã hoàn tác. Nhấn Lưu cấu trúc để giữ thay đổi.'; } };
    $('edit-reset').onclick = () => { checkpoint(); state.edits = {}; rebuild(state.block); $('edit-status').textContent = 'Đang xem trước cấu trúc mặc định. Nhấn Lưu cấu trúc để áp dụng.'; };
    $('edit-export').onclick = () => { if (state.doc) S.download('muc-luc-' + state.item.data.id + '.json', { format: 'chanh-phap-outline', key: state.key, mode: state.mode, version: state.doc.version, edits: state.edits }); };
    $('edit-import').onchange = importOutline;
    document.querySelectorAll('[data-r-theme]').forEach(b => b.onclick = () => setTheme(b.dataset.rTheme));
    for (const [id, name, type] of [['font', 'font', 'number'], ['line', 'line', 'number'], ['spacing', 'spacing', 'number'], ['width', 'width', 'number'], ['size', 'size', 'number'], ['view', 'view', 'string'], ['align', 'align', 'string'], ['serif', 'serif', 'bool'], ['notes', 'notes', 'check'], ['reduced', 'reduced', 'check'], ['chant', 'chant', 'check']]) {
      const el = $('r-' + id); if (type === 'check') el.checked = pref[name]; else el.value = pref[name];
      el.onchange = () => { const anchor = isPaged() ? pages.anchor || capture() : capture(); pref[name] = type === 'check' ? el.checked : type === 'number' ? Number(el.value) : type === 'bool' ? el.value === 'true' : el.value; applyPreferences(); if (id === 'size' || id === 'view') rebuild(anchor.block); restoreAnchor(anchor); savePosition(); };
    }
    $('r-auto').onchange = e => setAuto(Number(e.target.value));
    $('toc-narrow').onclick = () => width(-20); $('toc-widen').onclick = () => width(20);
    $('reader-resizer').onkeydown = e => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); width(e.key === 'ArrowLeft' ? -20 : 20); } };
    $('reader-resizer').onpointerdown = e => { const start = e.clientX, original = pref.sidebar; e.target.setPointerCapture(e.pointerId); e.target.onpointermove = event => { pref.sidebar = Math.max(220, Math.min(420, original + event.clientX - start)); applyPreferences(); }; e.target.onpointerup = () => e.target.onpointermove = null; };
    window.addEventListener('resize', () => {
      const compact = innerWidth < 900;
      if (compact && !compactViewport) toggleToc(false);
      compactViewport = compact;
      if (state.ready) { const a = resizeAnchor || (isPaged() ? pages.anchor : capture()); clearTimeout(scrollTimer); scrollTimer = setTimeout(() => { restoreAnchor(a); updateProgress(); resizeAnchor = null; }, 120); resizeAnchor = a; }
    });
    window.addEventListener('pagehide', savePosition);
    document.addEventListener('visibilitychange', () => { if (document.hidden) savePosition(); });
    new ResizeObserver(() => {
      if (!state.ready || !isPaged()) return;
      cancelAnimationFrame(pageLayoutFrame);
      pageLayoutFrame = requestAnimationFrame(() => { layoutPages(); restoreAnchor(pages.anchor); updateProgress(); });
    }).observe($('reader-scroll'));
    document.fonts.ready.then(() => { if (state.ready && isPaged()) { layoutPages(); restoreAnchor(pages.anchor); updateProgress(); } });
    window.addEventListener('library-storage-error', () => notice('Bộ nhớ thiết bị đã đầy hoặc bị khóa. Hãy xuất bản sao lưu; phiên đọc hiện tại vẫn dùng được.'));
    applyPreferences(); window.Audiobook.initialize();
  }
  let panelReturnFocus = null;
  function panel(name) {
    const previous = !$('reader-inspector').hidden;
    if (name && !previous) panelReturnFocus = document.activeElement;
    $('reader-inspector').hidden = !name;
    for (const n of ['settings', 'research', 'editor']) $('reader-' + n).hidden = n !== name;
    $('inspector-title').textContent = { settings: 'Không gian đọc của bạn', research: 'Tra cứu & sổ tay', editor: 'Hiệu chỉnh mục lục', audio: 'Tùy chọn nghe kinh' }[name] || '';
    if (name && pref.focus) { pref.focus = false; applyPreferences(); }
    if (name && innerWidth < 900) toggleToc(false);
    if (name === 'research') renderMarks();
    if (name) $('inspector-close').focus({ preventScroll: true });
    else if (previous && panelReturnFocus?.isConnected) panelReturnFocus.focus({ preventScroll: true });
  }
  function toggleToc(show) {
    const root = $('reader-view-container'), wasOpen = !root.classList.contains('toc-hidden');
    const open = show ?? (!wasOpen || pref.focus);
    if (open && pref.focus) { pref.focus = false; applyPreferences(); }
    if (open && innerWidth < 900) panel(null);
    root.classList.toggle('toc-hidden', !open); $('reader-toc-toggle').setAttribute('aria-expanded', String(open));
    $('reader-page-indicator').setAttribute('aria-expanded', String(open));
    if (innerWidth < 900 && root.classList.contains('active')) {
      if (open) $('toc-search').focus({ preventScroll: true });
      else if (wasOpen && $('reader-sidebar').contains(document.activeElement)) $('reader-toc-toggle').focus({ preventScroll: true });
    }
  }
  function toggleAudio(show) {
    // The listening controls belong to the shared player, including in fullscreen.
    window.PersistentPlayer?.setReaderExpanded(show ?? true);
  }
  function listeningAnchor() {
    const audio = window.Audiobook?.state;
    if (audio?.key === state.key && !audio.recorded && audio.count) {
      const segment = window.Audiobook.segments[audio.index];
      return { block: segment?.block, sourceOffset: segment?.sourceOffset || 0, seconds: audio.currentTime };
    }
    return S.read('listen:' + state.key, null);
  }
  function updateListening() {
    const audio = window.Audiobook?.state;
    if (!state.item) return;
    const saved = listeningAnchor(), ownAudio = audio?.key === state.key && !audio.recorded;
    const available = state.ready && !!path(state.item, 'viet');
    $('reader-hear-visible').disabled = listenPending || !available || !['viet', 'dual'].includes(state.mode);
    $('reader-read-listening').hidden = !saved?.block;
    $('reader-read-listening').disabled = listenPending || !state.ready;
    const block = state.mode === 'viet' || state.mode === 'dual' ? state.doc?.blocks.find(b => b.id === saved?.block) : null;
    const text = block ? window.NarrationModel.plain(block.raw) : '';
    $('reader-listening-hint').textContent = !available ? 'Tác phẩm này chưa có bản Việt để nghe.' : block ? 'Vị trí nghe: ' + text.slice(0, 110) + (text.length > 110 ? '…' : '') : 'Nghe từ trang đang đọc. Vị trí đọc và nghe được tự động ghi nhớ.';
    $('reader-listen-toggle').classList.toggle('is-listening', ownAudio && ['playing', 'loading'].includes(audio.status));
    const label = ownAudio && ['playing', 'loading', 'paused', 'error'].includes(audio.status) ? 'Điều khiển nghe' : audio?.count && audio.key !== state.key ? 'Nghe kinh này' : 'Nghe kinh';
    $('reader-listen-toggle').querySelector('span').textContent = label;
    $('reader-listen-toggle').setAttribute('aria-label', label + ' bản kinh đang đọc');
  }
  async function listenFrom(block, fromReading, textOffset = 0) {
    if (listenPending || !state.ready || !path(state.item, 'viet')) return;
    if (fromReading && !['viet', 'dual'].includes(state.mode)) { notice('Chuyển sang bản Việt để chọn đoạn bắt đầu nghe.'); return; }
    const documentKey = state.key, item = state.item;
    const element = block && $('reader-paper-content').querySelector(`[data-block="${block}"]`);
    let sourceOffset = element && textOffset ? window.NarrationModel.plain(element.textContent.slice(0, textOffset)).length : 0;
    if (fromReading) {
      const index = state.doc.blocks.findIndex(b => b.id === block);
      const spokenBlocks = new Set(window.NarrationModel.build(state.doc).flatMap(chunk => chunk.blocks));
      const spoken = state.doc.blocks.slice(Math.max(0, index)).find(b => spokenBlocks.has(b.id));
      if (!spoken) { notice('Từ vị trí này không còn kinh văn để nghe. Hãy chọn đoạn trước đó.'); return; }
      if (block !== spoken.id) sourceOffset = 0;
      block = spoken.id;
    }
    savePosition(); listenPending = true; updateListening(); toggleAudio(true);
    try {
      const audio = window.Audiobook.state;
      if (audio.key !== documentKey || audio.recorded || !audio.count) {
        // Supply the target before starting so another book's saved position never plays first.
        await window.DharmaPlayerStore.playItem(item, fromReading ? { block, sourceOffset } : {});
      } else {
        if (fromReading && !window.Audiobook.seekBlock(block, sourceOffset)) { notice('Đoạn này chưa có nội dung để nghe.'); return; }
        await window.Audiobook.start();
      }
      if (state.key === documentKey) updateListening();
    } finally { listenPending = false; updateListening(); }
  }
  async function readFromListening() {
    const anchor = listeningAnchor();
    if (!state.ready || !anchor?.block) return;
    if ($('dp-options')?.open) $('dp-options').close();
    if (window.Audiobook.state.key === state.key) window.Audiobook.pause();
    const item = state.item;
    if (!['viet', 'dual'].includes(state.mode)) await open(item, 'viet', { block: anchor.block, textOffset: anchor.sourceOffset || 0 });
    else jumpBlock(anchor.block, { textOffset: anchor.sourceOffset || 0 });
    toggleAudio(false); $('reader-scroll').focus({ preventScroll: true });
    notice('Đã trở lại đoạn đang nghe. Vị trí nghe được giữ để tiếp tục sau.');
  }
  function layoutPages() {
    const viewport = $('reader-page-viewport'), flow = $('reader-page-flow');
    if (!isPaged() || !viewport || !flow) return;
    pages.stride = viewport.clientWidth + 64;
    pages.total = Math.max(1, Math.ceil((flow.scrollWidth + 64) / pages.stride));
    pages.index = Math.min(pages.index, pages.total - 1);
    flow.style.transform = `translateX(${-pages.index * pages.stride}px)`;
    // Pagination owns the horizontal position; native focus scrolling cannot.
    for (const element of [viewport, $('reader-paper-content'), $('reader-scroll')]) element.scrollLeft = 0;
    const bounds = viewport.getBoundingClientRect();
    flow.querySelectorAll('a[href],button,input,select,textarea,summary').forEach(element => {
      if (!element.hasAttribute('data-page-tabindex')) element.dataset.pageTabindex = element.getAttribute('tabindex') ?? '';
      const visible = element.checkVisibility() && [...element.getClientRects()].some(r =>
        r.width && r.height && r.right > bounds.left && r.left < bounds.right && r.bottom > bounds.top && r.top < bounds.bottom);
      if (!visible) element.tabIndex = -1;
      else if (element.dataset.pageTabindex === '') element.removeAttribute('tabindex');
      else element.setAttribute('tabindex', element.dataset.pageTabindex);
    });
  }
  function pageForRect(rect) {
    const viewport = $('reader-page-viewport').getBoundingClientRect();
    return Math.max(0, Math.floor((rect.left - viewport.left + pages.index * pages.stride + 1) / pages.stride));
  }
  function textPoint(element, offset) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node, remaining = Math.max(0, offset || 0), last;
    while ((node = walker.nextNode())) {
      last = node;
      if (remaining < node.length) { while (remaining < node.length - 1 && /\s/u.test(node.data[remaining])) remaining++; const range = document.createRange(); range.setStart(node, remaining); range.setEnd(node, Math.min(node.length, remaining + 1)); return range.getBoundingClientRect(); }
      remaining -= node.length;
    }
    if (last?.length) { const range = document.createRange(); range.setStart(last, last.length - 1); range.setEnd(last, last.length); return range.getBoundingClientRect(); }
    return element.getBoundingClientRect();
  }
  function capturePage() {
    const viewport = $('reader-page-viewport'); if (!viewport || !pages.stride) return { block: state.block, fraction: 0 };
    const bounds = viewport.getBoundingClientRect();
    const blocks = [...$('reader-paper-content').querySelectorAll('[data-block]')];
    const element = blocks.find(el => [...el.getClientRects()].some(r => r.width && r.height && r.right > bounds.left + 1 && r.left < bounds.right - 1 && r.bottom > bounds.top && r.top < bounds.bottom));
    if (!element) return pages.anchor || { block: state.block, fraction: 0 };
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node, offset = 0;
    while ((node = walker.nextNode())) {
      if (node.length) {
        const range = document.createRange(); range.selectNodeContents(node);
        if ([...range.getClientRects()].some(r => r.width && r.right > bounds.left + 1 && r.left < bounds.right - 1)) {
          let low = 0, high = node.length - 1;
          while (low < high) { const middle = Math.floor((low + high) / 2); let point = middle; while (point < node.length - 1 && /\s/u.test(node.data[point])) point++; range.setStart(node, point); range.setEnd(node, point + 1); if (pageForRect(range.getBoundingClientRect()) < pages.index) low = middle + 1; else high = middle; }
          while (low < node.length - 1 && /\s/u.test(node.data[low])) low++;
          return { block: element.dataset.block, fraction: 0, textOffset: offset + low };
        }
      }
      offset += node.length;
    }
    return { block: element.dataset.block, fraction: 0 };
  }
  function navigate(delta) {
    if (!state.ready) return;
    if (!isPaged()) { jumpSection(state.section + delta); return; }
    layoutPages();
    const next = pages.index + delta;
    if (next >= 0 && next < pages.total) {
      pages.index = next; layoutPages(); pages.anchor = capturePage(); state.block = pages.anchor.block;
      updateProgress(); savePosition();
    } else if (delta > 0 && state.section < state.sections.length - 1) jumpSection(state.section + 1);
    else if (delta < 0 && state.section > 0) {
      jumpSection(state.section - 1); pages.index = pages.total - 1; layoutPages(); pages.anchor = capturePage(); state.block = pages.anchor.block; updateProgress(); savePosition();
    }
  }
  function width(delta) { pref.sidebar = Math.max(220, Math.min(420, pref.sidebar + delta)); applyPreferences(); }
  function fullscreenElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function updateFullscreenButton() {
    const active = state.fullscreen, button = $('reader-fullscreen');
    const label = active ? 'Thoát toàn màn hình' : 'Đọc toàn màn hình';
    const shape = active ? 'M3 8h5V3m13 5h-5V3M3 16h5v5m13-5h-5v5' : 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5';
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${shape}"/></svg><span>${active ? 'Thu nhỏ' : 'Toàn màn hình'}</span>`;
    button.setAttribute('aria-pressed', String(active)); button.setAttribute('aria-label', label);
    button.title = label + (active ? ' (Esc hoặc Alt + Enter)' : ' (Alt + Enter)');
    button.disabled = fullscreenPending;
  }
  function setFullscreen(active) {
    if (state.fullscreen !== active) {
      const anchor = state.ready ? (isPaged() ? pages.anchor || capture() : capture()) : null, bookKey = state.key;
      state.fullscreen = active;
      $('reader-view-container').classList.toggle('reader-fullscreen', active);
      document.body.classList.toggle('reader-fullscreen-active', active);
      if (!active && $('reader-message').textContent === 'Đã bật chế độ đọc tràn màn hình.') notice('');
      if (anchor) {
        resizeAnchor = anchor;
        requestAnimationFrame(() => { if (state.ready && state.key === bookKey) restoreAnchor(anchor); });
      }
    }
    updateFullscreenButton();
  }
  async function exitFullscreen() {
    ++fullscreenGeneration;
    const owned = fullscreenOwned; fullscreenOwned = false;
    setFullscreen(false);
    if (owned && fullscreenElement() === document.documentElement) {
      try { await (document.exitFullscreen || document.webkitExitFullscreen)?.call(document); }
      catch { notice('Nhấn Esc để thoát toàn màn hình.'); }
    }
  }
  async function toggleFullscreen() {
    if (fullscreenPending || !state.item) return;
    if (state.fullscreen) { await exitFullscreen(); return; }
    const token = ++fullscreenGeneration, root = document.documentElement;
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    setFullscreen(true);
    // Fullscreen the document so source/correction dialogs remain accessible.
    // Do not take ownership of a fullscreen session started elsewhere.
    if (fullscreenElement()) return;
    if (!request || document.fullscreenEnabled === false) {
      notice('Đã bật chế độ đọc tràn màn hình.'); return;
    }
    fullscreenPending = true; fullscreenAttempt = true; updateFullscreenButton();
    try {
      await (root.requestFullscreen ? request.call(root, { navigationUI: 'hide' }) : request.call(root));
      const owned = fullscreenElement() === root;
      if (token !== fullscreenGeneration || !state.item) {
        if (owned) await (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      } else if (owned) fullscreenOwned = true;
    } catch {
      fullscreenAttempt = false;
      if (token === fullscreenGeneration && state.fullscreen) notice('Đã bật chế độ đọc tràn màn hình.');
    } finally { fullscreenPending = false; updateFullscreenButton(); }
  }
  function fullscreenChanged() {
    const element = fullscreenElement();
    if (element === document.documentElement && fullscreenAttempt) {
      if (state.fullscreen && state.item) fullscreenOwned = true;
      else {
        fullscreenAttempt = false;
        // A prefixed, non-Promise request can complete after the reader closes.
        Promise.resolve((document.exitFullscreen || document.webkitExitFullscreen)?.call(document)).catch(() => {});
      }
    } else if (!element) {
      fullscreenOwned = fullscreenAttempt = false;
      if (state.fullscreen) {
        ++fullscreenGeneration; setFullscreen(false);
        if (state.item) $('reader-fullscreen').focus({ preventScroll: true });
      }
    }
  }
  function applyPreferences() {
    const root = $('reader-view-container');
    root.style.setProperty('--reading-font-size', Math.max(pref.chant ? 28 : 16, Math.min(36, pref.font)) + 'px');
    root.style.setProperty('--reading-line', pref.line); root.style.setProperty('--reading-spacing', pref.spacing + 'em');
    root.style.setProperty('--reading-width', pref.width + 'px'); root.style.setProperty('--toc-width', pref.sidebar + 'px');
    root.style.setProperty('--reading-font', pref.serif ? 'var(--font-serif)' : 'var(--font-body)'); root.style.setProperty('--reading-align', pref.align);
    root.classList.toggle('focus-reading', pref.focus); root.classList.toggle('hide-source-notes', !pref.notes);
    $('reader-focus-exit').hidden = !pref.focus;
    root.classList.toggle('reader-paged', isPaged());
    document.querySelectorAll('[data-reading-view]').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.readingView === (isPaged() ? 'paged' : 'parts'))); b.disabled = b.dataset.readingView === 'paged' && state.mode === 'dual'; b.title = state.mode === 'dual' ? 'Đối chiếu dùng chế độ cuộn để xem hai bản song song' : ''; });
    document.documentElement.classList.toggle('reduced-motion', pref.reduced);
    $('reader-focus').setAttribute('aria-pressed', String(pref.focus)); $('font-output').textContent = pref.font + ' px'; $('reader-resizer').setAttribute('aria-valuenow', pref.sidebar);
    S.write('reader-preferences', pref);
    if (state.ready && isPaged()) layoutPages();
  }
  async function fetchDoc(url, signal) {
    if (location.protocol === 'file:') throw new Error('Trình duyệt không cho tải kinh khi mở trực tiếp file HTML. Nhấp đúp MO_THU_VIEN.cmd trong thư mục gốc, rồi mở thư viện từ máy chủ.');
    let response;
    try { response = await fetch(url, { signal }); }
    catch (error) { if (error.name === 'AbortError') throw error; throw new Error('Chưa tải được bản chữ. Kiểm tra mạng hoặc chọn sách đã lưu ngoại tuyến, rồi thử lại.'); }
    if (!response.ok) throw new Error(response.status === 404 ? 'Tệp bản chữ chưa có ở địa chỉ này. Chọn bản khác hoặc mở PDF/Word nguồn để đọc.' : `Máy chủ chưa tải được kinh (HTTP ${response.status}). Vui lòng thử lại.`);
    const raw = await response.text();
    return M.parse(raw);
  }
  async function open(item, mode = 'viet', anchor = null) {
    if (!item) return;
    const same = state.key === key(item);
    if (state.ready) savePosition();
    state.request?.abort(); clearTimeout(scrollTimer); resizeAnchor = null; setAuto(0);
    if (!state.item) { state.previousFocus = document.activeElement; state.previousHash = location.hash; }
    if (!same || state.mode !== mode || !state.item) window.LibraryRouter?.move('#read/' + encodeURIComponent(key(item)) + '/' + mode);
    state.item = item; state.mode = mode; state.key = key(item); state.ready = false; state.doc = null; state.han = null; state.undo = [];
    state.block = ''; state.sections = []; state.section = 0;
    state.request = new AbortController(); const token = ++state.generation;
    appState.activeReaderItem = item; appState.activeReaderViewMode = mode;
    const root = $('reader-view-container'); root.classList.add('active'); root.classList.toggle('reader-paged', isPaged()); root.classList.toggle('reader-phucminh', item.type === 'phucminh'); root.classList.toggle('reader-ebooks', item.type === 'ebooks'); document.body.style.overflow = 'hidden'; document.body.classList.add('reader-open');
    window.PersistentPlayer?.mountReader(true);
    pages.index = 0; pages.anchor = null;
    applyPreferences();
    $('reader-phuc-pdf').hidden = item.type !== 'phucminh';
    $('reader-phuc-pdf').onclick = () => {
      const page = Number(state.sections[state.section]?.title.match(/^Trang (\d+)$/)?.[1]) || 1;
      PhucMinh.openPDF(item.data.id, page);
    };
    document.querySelector('main').inert = true; document.querySelector('.noble-header').inert = true; document.querySelector('.noble-nav-bar').inert = true; document.querySelector('.noble-footer').inert = true;
    document.querySelectorAll('#dharma-sidebar,#dharma-companion,#dharma-mobile-nav').forEach(el => el.inert = true);
    if (!same) { toggleToc(false); panel(null); toggleAudio(false); }
    if(mode==='han'||mode==='dual')LibraryAssets.hanFont();
    $('reader-book-title').textContent = title(item);
    window.LibraryRouter?.title(title(item));
    $('reader-book-subtitle').textContent = item.type === 'phucminh' ? 'TỦ SÁCH CHÙA PHÚC MINH · BẢN CHỮ TỪ PDF' : `${item.data.taishoId || item.data.id} / TÀNG KINH CÁC`;
    if (item.type === 'ebooks') {
      $('reader-book-subtitle').textContent = 'ĐẠI TẠNG KINH · ' + item.data.subcategory + (item.data.status === 'partial' ? ' · NGUỒN THIẾU PHẦN' : '');
    }
    const wordLink = $('reader-word-link'); if (wordLink) { wordLink.hidden = item.type !== 'ebooks'; if (item.type === 'ebooks') { wordLink.href = item.data.sourceFile; wordLink.download = item.data.filename; } }
    if (item.type === 'phucminh' && item.data.sourceKind === 'ocr') $('reader-book-subtitle').textContent = 'CHÙA PHÚC MINH · OCR TỰ ĐỘNG, CẦN ĐỐI CHIẾU PDF';
    let editionInfo=$('reader-edition-info');
    if(!editionInfo){editionInfo=document.createElement('p');editionInfo.id='reader-edition-info';editionInfo.className='edition-status';$('reader-book-title').after(editionInfo);}
    editionInfo.textContent=LibraryCatalog.description(item);
    const contextHtml = window.SutraContext ? window.SutraContext.renderContextCard(item) : '';
    $('reader-paper-content').innerHTML = contextHtml + '<div class="reader-loading"><span class="lotus-small">☸</span><p>Đang mở trang kinh…</p></div>';
    searchReturn=null;
    $('reader-toc-list').replaceChildren(); notice(''); $('reader-search-results').replaceChildren(); $('reader-search').value = ''; $('toc-search').value = '';
    document.querySelectorAll('[data-reader-mode]').forEach(b => { b.disabled = b.dataset.readerMode === 'dual' ? !(path(item, 'viet') && path(item, 'han')) : !path(item, b.dataset.readerMode); b.setAttribute('aria-pressed', String(b.dataset.readerMode === mode)); });
    $('reader-listen-toggle').disabled = !path(item, 'viet');
    window.Audiobook.connect(null, state.key, path(item, 'viet') ? 'loading' : 'unavailable');
    $('reader-prev').disabled = true; $('reader-next').disabled = true; $('reader-mark').disabled = true; $('reader-note-save').disabled = true;
    $('reader-page-indicator').textContent = 'Đang tải…'; $('reader-page-indicator').disabled = true; $('reader-progress').value = 0; $('reader-breadcrumb').textContent = '';
    $('reader-close').focus();
    const source = path(item, mode === 'dual' ? 'viet' : mode);
    if (!source) { $('reader-paper-content').innerHTML = '<div class="reader-empty">Tác phẩm chưa có bản này. Hãy chọn bản hiện có ở thanh trên.</div>'; notice('Chưa có bản tương ứng.'); return; }
    $('reader-source-link').href = source;
    const pdf = item.type === 'phucminh' ? item.data.pdfFile : item.type === 'daithua' ? item.data.files[mode === 'han' ? 'hanPdf' : mode === 'note' ? 'notePdf' : 'vietPdf'] : null;
    $('reader-pdf-link').hidden = !pdf; if (pdf) $('reader-pdf-link').href = pdf;
    try {
      const original = await fetchDoc(source, state.request.signal);
      await window.LibraryEditions?.migrate(original,state.key,mode==='dual'?'viet':mode);
      const doc = window.LibraryEditions?.apply(original, state.key, mode === 'dual' ? 'viet' : mode) || original;
      if (token !== state.generation) return;
      state.doc = doc;
      if (mode === 'dual') { state.han = await fetchDoc(path(item, 'han'), state.request.signal); if (token !== state.generation) return; }
      const custom = S.read('outline:' + state.key + ':' + mode, {});
      state.edits = custom.version === doc.version && custom.edits && typeof custom.edits === 'object' ? custom.edits : {};
      if (custom.version && custom.version !== doc.version) notice('Văn bản nguồn đã đổi. Mục lục mặc định được dùng; bản hiệu chỉnh cũ vẫn được lưu.');
      state.ready = true;
    $('reader-mark').disabled = false; $('reader-note-save').disabled = false;
      const saved = S.read('position:' + state.key + ':' + mode, null);
      let initial = (typeof anchor === 'object' ? anchor?.block : anchor) || saved?.block || doc.blocks[0]?.id;
      if (!doc.blocks.some(b => b.id === initial)) { initial = doc.blocks[0]?.id; notice('Không tìm thấy đoạn đã lưu trong bản hiện tại. Đã mở đầu kinh.'); }
      rebuild(initial); if (typeof anchor === 'object' && anchor) restoreAnchor(anchor); else if (saved && (!anchor || anchor === saved.block)) restoreAnchor(saved);
      migrateBookmark(); renderMarks();
      if (mode === 'viet' || mode === 'dual') window.Audiobook.connect(doc, state.key);
      else if (path(item, 'viet')) {
        // Audio always has its own Vietnamese document, never the visible Hán text.
        fetchDoc(path(item, 'viet'), state.request.signal).then(viet => { if (token === state.generation) window.Audiobook.connect(viet, state.key); }).catch(() => { if (token === state.generation) { notice('Không tải được bản Việt để nghe.'); window.Audiobook.connect(null, state.key, 'error'); } });
      }
      rememberRecent(); savePosition(); updateListening();
      window.dispatchEvent(new CustomEvent('library-reading-ready', {detail:{key:state.key,mode:state.mode,doc:state.doc,item:state.item}}));
    } catch (error) {
      if (error.name === 'AbortError' || token !== state.generation) return;
      state.ready = false;
      const fileMode = location.protocol === 'file:';
      $('reader-page-indicator').textContent = 'Chưa tải được kinh';
      window.Audiobook.connect(null, state.key, path(item, 'viet') ? 'error' : 'unavailable');
      $('reader-paper-content').innerHTML = `<div class="reader-empty"><h2>${fileMode ? 'Hãy mở thư viện qua máy chủ' : 'Chưa mở được kinh văn'}</h2><p>${esc(error.message)}</p><div id="reader-recovery"></div><button class="r-button" id="reader-retry">Thử lại</button></div>`;
      const link = window.LibraryConnection?.recoveryLink(); if (link) $('reader-recovery').append(link);
      $('reader-retry').onclick = () => open(item, mode, anchor); notice(error.message);
    }
  }
  function rebuild(id) {
    if (!state.doc) return;
    state.sections = M.sections(state.doc, pref.size, state.edits);
    const index = state.doc.blocks.findIndex(b => b.id === id);
    state.section = Math.max(0, state.sections.findIndex(s => index >= s.start && index < s.end));
    state.block = id || state.doc.blocks[0]?.id; renderToc(); renderContent(); restoreAnchor({ block: state.block, fraction: 0 }); updateProgress();
  }
  function blockHTML(b) {
    if (!b.text) return `<div data-block="${b.id}" class="source-blank"></div>`;
    let html = window.SutraFormatter.format(b.raw, state.mode !== 'han', { preserveSource: true, kind: b.kind });
    if (state.item.type === 'phucminh' && ['Thi kệ & câu đối', 'Kinh tụng & bảo hộ'].includes(state.item.data.category) && b.kind === 'text') {
      html = `<p class="source-prose source-verse">${SutraFormatter.readingInline(b.raw.trim())}</p>`;
    }
    if (state.searchQuery) html = highlightText(html, state.searchQuery);
    return `<div data-block="${b.id}" class="source-block ${b.kind === 'note' ? 'is-source-note' : ''} ${b.kind === 'metadata' ? 'is-source-meta' : ''}" tabindex="-1">${b.originalRaw !== undefined ? '<small class="edition-correction-label">Bản hiệu đính cá nhân</small>' : ''}${html}</div>`;
  }
  function sectionHTML(s) {
    const blocks = state.doc.blocks.slice(s.start, s.end);
    let html = '', details = false;
    for (const block of blocks) {
      const auxiliary = ['metadata', 'contents'].includes(block.kind);
      if (auxiliary && !details) { html += '<details class="source-information"><summary>Thông tin bản kinh & nguồn văn bản</summary>'; details = true; }
      if (!auxiliary && details) { html += '</details>'; details = false; }
      html += blockHTML(block);
    }
    if (details) html += '</details>';
    const wordCount = blocks.map(b => b.text).join(' ').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 220));
    return `<section class="reading-section" data-section="${s.id}"><div class="section-caption"><span>${s.structural ? 'KINH VĂN' : 'PHẦN ĐỌC'}</span><span>Khoảng ${minutes} phút đọc</span></div>${html}</section>`;
  }
  function renderContent(start, end) {
    if (!state.ready || !state.sections.length) return;
    state.start = start ?? state.section;
    state.end = end ?? Math.min(state.sections.length, state.section + (pref.view === 'continuous' ? 3 : 1));
    const paper = $('reader-paper-content'); paper.classList.toggle('reader-dual', state.mode === 'dual'); paper.classList.toggle('is-han', state.mode === 'han'); paper.lang = state.mode === 'han' ? 'zh-Hant' : 'vi';
    const contextHtml = window.SutraContext ? window.SutraContext.renderContextCard(state.item) : '';
    const html = state.sections.slice(state.start, state.end).map(sectionHTML).join('');
    if (state.mode === 'dual') {
      const hanSections = M.sections(state.han, pref.size);
      state.hanSection = Math.min(state.hanSection, hanSections.length - 1);
      paper.innerHTML = contextHtml + `<div class="reader-dual-grid"><div class="dual-reader-column"><label class="dual-label">Bản Việt · Điều hướng theo mục lục</label>${html}</div><div class="dual-reader-column han-script" lang="zh-Hant"><label class="dual-label">Hán văn · Chọn phần đối chiếu<select id="han-section">${hanSections.map((s, i) => `<option value="${i}">${esc(s.title)}</option>`).join('')}</select></label><p class="dual-note">Hai bản có cấu trúc riêng; chọn mục Hán tương ứng để đối chiếu.</p><div id="han-content"></div></div></div>`;
      const drawHan = () => { const s = hanSections[state.hanSection]; $('han-content').innerHTML = state.han.blocks.slice(s.start, s.end).map(b => window.SutraFormatter.format(b.raw, false, { preserveSource: true, kind: b.kind })).join(''); };
      $('han-section').value = state.hanSection; $('han-section').onchange = e => { state.hanSection = Number(e.target.value); drawHan(); }; drawHan();
    } else paper.innerHTML = isPaged() ? `<div id="reader-page-viewport"><div id="reader-page-flow">${contextHtml + html}</div></div>` : contextHtml + html;
    const contextCard = paper.querySelector('.sutra-context-card');
    if (contextCard) {
      contextCard.open = contextExpansion.get(state.key) || false;
      const contextKey = state.key;
      contextCard.addEventListener('toggle', () => contextExpansion.set(contextKey, contextCard.open));
    }
    // Bind context card's related sutra buttons
    paper.querySelectorAll('.context-related-btn').forEach(btn => btn.onclick = () => {
      const relId = btn.dataset.relatedId;
      const dt = typeof DAI_THUA_DATA !== 'undefined' && DAI_THUA_DATA.find(x => x.taishoId === relId);
      const ht = !dt && typeof DAI_TANG_HAN_DATA !== 'undefined' && DAI_TANG_HAN_DATA.texts.find(x => x.id === relId);
      if (dt) open({ type: 'daithua', data: dt }); else if (ht) open({ type: 'daitang', data: ht });
    });
    $('reader-scroll').scrollTop = 0; pages.index = 0; pages.anchor = { block: state.block, fraction: 0 }; layoutPages(); selectBlock(state.block, false);
    // Expanding source details changes the number of pages without changing the text.
    if (isPaged()) paper.querySelectorAll('details').forEach(el => el.addEventListener('toggle', () => { layoutPages(); restoreAnchor(pages.anchor); updateProgress(); }));
  }
  function renderToc() {
    if (!state.doc) return;
    const query = M.normalize($('toc-search').value); const major = $('toc-major').checked;
    const fragments = []; let group = false;
    state.sections.forEach((s, i) => {
      if (query && !M.normalize(s.title).includes(query)) return;
      if (major && !s.structural) return;
      if (s.level === 1 && !query) { if (group) fragments.push('</div></details>'); fragments.push(`<details open><summary>${esc(s.title)}</summary><div>`); group = true; }
      fragments.push(`<button class="toc-entry level-${s.level}" data-jump="${i}" ${i === state.section ? 'aria-current="location"' : ''}><span class="toc-number">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.title)}</span></button>`);
    });
    if (group) fragments.push('</div></details>');
    $('reader-toc-list').innerHTML = fragments.join('') || '<p class="muted">Không có mục phù hợp.</p>';
    $('reader-toc-list').querySelectorAll('[data-jump]').forEach(b => b.onclick = () => { jumpSection(Number(b.dataset.jump)); if (innerWidth < 900) toggleToc(false); });
  }
  function jumpSection(index) {
    if (!state.ready || index < 0 || index >= state.sections.length) return;
    state.section = index; state.block = state.doc.blocks[state.sections[index].start].id;
    renderContent(); updateProgress(); selectBlock(state.block, false); savePosition();
  }
  function jumpBlock(id, anchor = {}) {
    if (!state.ready) return;
    const index = state.doc.blocks.findIndex(b => b.id === id); if (index < 0) return;
    const section = state.sections.findIndex(s => index >= s.start && index < s.end);
    if (section < state.start || section >= state.end) { state.section = section; renderContent(); }
    const target = $('reader-paper-content').querySelector(`[data-block="${id}"]`);
    if (target?.closest('.source-information')) target.closest('.source-information').open = true;
    state.section = section; selectBlock(id, false); restoreAnchor({ block: id, fraction: 0, ...anchor }); updateProgress(); savePosition();
  }
  function selectBlock(id, update = true) {
    state.block = id;
    $('reader-paper-content').querySelectorAll('.selected-block').forEach(e => e.classList.remove('selected-block'));
    const element = $('reader-paper-content').querySelector(`[data-block="${id}"]`); if (element) element.classList.add('selected-block');
    const b = state.doc?.blocks.find(b => b.id === id);
    if (b) { $('selected-label').textContent = 'Đoạn đã chọn: ' + b.text.slice(0, 100); $('edit-title').value = state.edits[id]?.title || b.heading?.title || ''; $('edit-level').value = state.edits[id]?.level || b.heading?.level || 3; }
    if (update) savePosition(false);
  }
  function capture() {
    if (!state.ready) return { block: state.block, fraction: 0 };
    if (isPaged()) return { ...(pages.anchor || capturePage()) };
    const pane = $('reader-scroll'), top = pane.getBoundingClientRect().top + 28;
    const blocks = [...$('reader-paper-content').querySelectorAll('[data-block]')].filter(e => e.offsetHeight > 0);
    const el = blocks.find(e => e.getBoundingClientRect().bottom > top) || blocks[blocks.length - 1];
    if (!el) return { block: state.block, fraction: 0 };
    const rect = el.getBoundingClientRect();
    return { block: el.dataset.block, fraction: Math.max(0, Math.min(1, (top - rect.top) / rect.height)) };
  }
  function restoreAnchor(anchor) {
    if (!anchor?.block) return;
    const el = $('reader-paper-content').querySelector(`[data-block="${anchor.block}"]`);
    if (el) {
      if (isPaged()) {
        layoutPages();
        const rect = textPoint(el, anchor.textOffset ?? Math.floor(el.textContent.length * (Number(anchor.fraction) || 0)));
        pages.index = Math.min(pages.total - 1, pageForRect(rect)); layoutPages(); pages.anchor = { ...anchor };
        updateProgress();
      } else {
        const pane = $('reader-scroll');
        const rect = anchor.textOffset !== undefined ? textPoint(el, anchor.textOffset) : el.getBoundingClientRect();
        pane.scrollTop += rect.top - pane.getBoundingClientRect().top - 28 + (anchor.textOffset === undefined ? el.offsetHeight * (Number(anchor.fraction) || 0) : 0);
      }
    }
  }
  function savePosition(fromScroll = true) {
    if (!state.ready) return;
    const anchor = fromScroll ? (isPaged() ? pages.anchor || capture() : capture()) : { block: state.block, fraction: 0 };
    const stored = S.write('position:' + state.key + ':' + state.mode, { ...anchor, version: state.doc.version, updatedAt: Date.now() });
    $('reader-saved-position').innerHTML = icon(stored ? 'check' : 'bookmark') + `<span class="reader-save-label">${stored ? 'Đã lưu vị trí' : 'Chưa lưu được'}</span>`;
    $('reader-saved-position').title = stored ? 'Đã lưu vị trí đọc' : 'Chưa lưu được vị trí đọc';
    if (isPaged()) pages.anchor = anchor;
    const hash = '#read/' + encodeURIComponent(state.key) + '/' + state.mode + '/' + anchor.block;
    if (window.LibraryRouter) LibraryRouter.replace(hash); else history.replaceState(null, '', hash);
  }
  function onScroll() {
    if (!state.ready || isPaged()) return;
    clearTimeout(scrollTimer); scrollTimer = setTimeout(() => {
      if (!state.ready || !state.doc) return;
      const anchor = capture(); state.block = anchor.block;
      const i = state.doc.blocks.findIndex(b => b.id === anchor.block);
      state.section = Math.max(0, state.sections.findIndex(s => i >= s.start && i < s.end));
      const pane = $('reader-scroll');
      if (pref.view === 'continuous' && state.mode !== 'dual') {
        if (pane.scrollHeight - pane.scrollTop - pane.clientHeight < 450 && state.end < state.sections.length) { const end = Math.min(state.sections.length, state.end + 1); renderContent(Math.max(0, end - 5), end); restoreAnchor(anchor); }
        else if (pane.scrollTop < 80 && state.start > 0) { const start = state.start - 1; renderContent(start, Math.min(state.sections.length, start + 5)); restoreAnchor(anchor); }
      }
      updateProgress(); savePosition();
    }, 140);
  }
  function updateProgress() {
    if (!state.ready) return;
    const s = state.sections[state.section]; if (!s) return;
    $('reader-breadcrumb').textContent = s.title;
    // Show total reading time estimate if available
    const ctx = window.SutraContext?.getByItem(state.item);
    const timeHint = ctx ? ` · ~${ctx.readingMinutes >= 60 ? Math.floor(ctx.readingMinutes / 60) + 'h' + (ctx.readingMinutes % 60 ? ctx.readingMinutes % 60 + '′' : '') : ctx.readingMinutes + '′'}` : '';
    $('reader-page-indicator').textContent = isPaged() ? `Trang ${pages.index + 1} / ${pages.total} · Phần ${state.section + 1} / ${state.sections.length}` : `Phần ${state.section + 1} / ${state.sections.length}${timeHint}`;
    $('reader-page-indicator').title=(state.sections[state.section]?.title||'')+' · Trang hiển thị thay đổi theo cỡ chữ và màn hình; đoạn đọc được lưu riêng.';
    $('reader-page-indicator').disabled = false;
    const b = state.doc.blocks.find(x => x.id === state.block);
    const element = b && $('reader-paper-content').querySelector(`[data-block="${b.id}"]`);
    const fraction = isPaged() ? Math.min(1, (pages.anchor?.textOffset || 0) / Math.max(1, element?.textContent.length || 0)) : capture().fraction;
    $('reader-progress').value = ((b ? b.start + (b.end - b.start) * fraction : 0) / Math.max(1, state.doc.length)) * 100;
    $('reader-prev').disabled = state.section === 0 && (!isPaged() || pages.index === 0); $('reader-next').disabled = state.section === state.sections.length - 1 && (!isPaged() || pages.index === pages.total - 1);
    $('reader-prev').setAttribute('aria-label', isPaged() ? 'Trang trước' : 'Phần trước'); $('reader-next').setAttribute('aria-label', isPaged() ? 'Trang tiếp' : 'Phần tiếp');
    $('reader-toc-list').querySelectorAll('[data-jump]').forEach(e => { if (Number(e.dataset.jump) === state.section) e.setAttribute('aria-current', 'location'); else e.removeAttribute('aria-current'); });
  }
  function search() {
    if (!state.doc) return;
    const rawQuery = $('reader-search').value.trim();
    const q = M.normalize(rawQuery);
    if (!q) { state.searchQuery = ''; $('reader-search-results').replaceChildren(); return; }
    if(!searchReturn)searchReturn=capture();
    state.searchQuery = rawQuery;
    const matches = state.doc.blocks.filter(b => M.normalize(b.text).includes(q));
    let count = 0;
    $('reader-search-results').innerHTML = `<p>${matches.length} đoạn phù hợp trong toàn bài kinh</p><div id="search-hits"></div><button class="r-button" id="search-more">Xem thêm kết quả</button>`;
    const more = () => {
      matches.slice(count, count + 50).forEach(b => {
        const button = document.createElement('button'); button.className = 'search-hit';
        const at = M.normalize(b.text).indexOf(q);
        const snippet = (at > 40 ? '…' : '') + b.text.slice(Math.max(0, at - 40), at + q.length + 100);
        // Highlight the search term in the snippet
        button.innerHTML = highlightText(esc(snippet), rawQuery);
        button.onclick = () => { jumpBlock(b.id); if (innerWidth < 900) panel(null); };
        $('search-hits').append(button);
      });
      count += 50; $('search-more').hidden = count >= matches.length;
    }; $('search-more').onclick = more; more();
    let at=-1;const controls=document.createElement('div');controls.className='upgrade-actions';
    const action=(text,fn)=>{const b=document.createElement('button');b.className='r-button';b.textContent=text;b.onclick=fn;controls.append(b);return b;};
    const status=document.createElement('span');status.setAttribute('role','status');
    const jump=delta=>{if(!matches.length)return;at=(at+delta+matches.length)%matches.length;jumpBlock(matches[at].id);status.textContent='Kết quả '+(at+1)+'/'+matches.length;};
    action('Kết quả trước',()=>jump(-1));action('Kết quả tiếp',()=>jump(1));action('Về vị trí trước khi tìm',()=>{const anchor=searchReturn;state.searchQuery='';$('reader-search').value='';$('reader-search-results').replaceChildren();renderContent();if(anchor)jumpBlock(anchor.block,anchor);searchReturn=null;});controls.append(status);$('reader-search-results').prepend(controls);
  }
  function marks() { const value = S.read('marks:' + state.key, []); return Array.isArray(value) ? value : []; }
  function addMark(note) {
    if (!state.ready || !state.block) return;
    if (note === '') { notice('Nhập ghi chú trước khi lưu.'); return; }
    const all = marks();
    all.unshift({ id: crypto.randomUUID(), block: state.block, mode: state.mode, text: state.doc.blocks.find(b => b.id === state.block)?.text.slice(0, 150) || '', note: note || '', savedAt: Date.now() });
    if (S.write('marks:' + state.key, all)) { notice(note ? 'Đã lưu ghi chú cho đoạn kinh.' : 'Đã đánh dấu đoạn kinh.'); $('reader-note-input').value = ''; renderMarks(); }
  }
  function renderMarks() {
    $('reader-marks').replaceChildren();
    const all = marks();
    if (!all.length) { $('reader-marks').textContent = 'Chưa có dấu trang trong kinh này.'; return; }
    for (const mark of all) {
      const card = document.createElement('div'); card.className = 'reader-mark-card';
      const go = document.createElement('button'); go.className = 'search-hit'; go.textContent = mark.text || 'Dấu trang';
      go.onclick = () => mark.mode === state.mode ? jumpBlock(mark.block) : open(state.item, mark.mode, mark.block);
      const note = document.createElement('p'); note.textContent = mark.note;
      const del = document.createElement('button'); del.className = 'r-button'; del.textContent = 'Xóa';
      del.onclick = () => { S.write('marks:' + state.key, marks().filter(x => x.id !== mark.id)); renderMarks(); notice('Đã xóa dấu trang.'); };
      card.append(go, note, del); $('reader-marks').append(card);
    }
  }
  function migrateBookmark() {
    const legacyKey = state.item.type === 'daithua' ? 'bm_' + state.item.data.id : 'bm_t_' + state.item.data.id;
    const old = appState.bookmarks[legacyKey];
    if (old && !S.read('migrated:' + state.key, false)) {
      // Pixel-based legacy positions cannot be mapped exactly after restructuring.
      const all = marks(); all.push({ id: 'legacy-' + legacyKey, block: state.doc.blocks[0]?.id, mode: state.mode, text: old.title || title(state.item), note: 'Dấu trang từ phiên bản trước. Vị trí pixel cũ vẫn được giữ trong bản sao lưu; hãy đánh dấu lại đoạn cần đọc.', savedAt: old.savedAt || Date.now() });
      S.write('marks:' + state.key, all); S.write('migrated:' + state.key, true);
    }
  }
  function exportNotes() {
    S.download('ghi-chu-' + state.item.data.id + '.md', '# ' + title(state.item) + '\n\n' + marks().map(m => `## ${new Date(m.savedAt).toLocaleDateString('vi-VN')}\n\n> ${m.text}\n\n${m.note}\n\n[Đến đoạn kinh](${location.origin + location.pathname}#read/${encodeURIComponent(state.key)}/${m.mode}/${m.block})`).join('\n\n'), 'text/markdown;charset=utf-8');
  }
  function checkpoint() { state.undo.push(JSON.parse(JSON.stringify(state.edits))); if (state.undo.length > 30) state.undo.shift(); }
  function editSplit() {
    if (!state.ready) return;
    checkpoint(); state.edits[state.block] = { split: true, title: $('edit-title').value.trim() || 'Mục đã hiệu chỉnh', level: Number($('edit-level').value) }; rebuild(state.block); $('edit-status').textContent = 'Đang xem trước. Nhấn Lưu cấu trúc để giữ thay đổi.';
  }
  function editMerge() {
    if (!state.ready || state.section === 0) return;
    checkpoint(); const s = state.sections[state.section];
    for (let i = s.start; i < s.end; i++) state.edits[state.doc.blocks[i].id] = { join: true, suppress: true };
    rebuild(state.block); $('edit-status').textContent = 'Đang xem trước phần đã gộp. Nhấn Lưu cấu trúc để giữ thay đổi.';
  }
  async function importOutline(e) {
    try {
      const file = e.target.files[0]; if (!file || !state.doc) return;
      if (file.size > 5000000) throw new Error('Tệp mục lục quá lớn.');
      const value = JSON.parse(await file.text());
      if (value.format !== 'chanh-phap-outline' || value.key !== state.key || value.mode !== state.mode || value.version !== state.doc.version || !value.edits || Array.isArray(value.edits)) throw new Error('Mục lục không khớp bản kinh hiện tại.');
      const valid = new Set(state.doc.blocks.map(b => b.id)); const edits = {};
      for (const [id, edit] of Object.entries(value.edits)) {
        if (!valid.has(id) || !edit || typeof edit !== 'object' || (edit.title && typeof edit.title !== 'string') || (edit.level && ![1, 2, 3].includes(edit.level))) throw new Error('Cấu trúc mục lục không hợp lệ.');
        edits[id] = { split: !!edit.split, join: !!edit.join, suppress: !!edit.suppress, title: String(edit.title || '').slice(0, 180), level: edit.level || 3 };
      }
      checkpoint(); state.edits = edits; rebuild(state.block); $('edit-status').textContent = 'Đã nhập để xem trước. Nhấn Lưu cấu trúc để áp dụng.';
    } catch (error) { notice(error.message); }
    e.target.value = '';
  }
  function rememberRecent() {
    const list = S.read('recent', []).filter(x => x.key !== state.key);
    list.unshift({ key: state.key, id: state.item.data.id, type: state.item.type, title: title(state.item), mode: state.mode, updatedAt: Date.now() });
    S.write('recent', list.slice(0, 24));
  }
  function setAuto(speed) {
    if (speed && isPaged()) { const anchor = pages.anchor || capture(); pref.view = 'continuous'; $('r-view').value = pref.view; applyPreferences(); rebuild(anchor.block); restoreAnchor(anchor); }
    autoSpeed = speed; if ($('r-auto')) $('r-auto').value = speed;
    if (autoFrame) cancelAnimationFrame(autoFrame); autoFrame = null;
    if (!speed) return;
    let last = performance.now();
    const tick = now => {
      const pane = $('reader-scroll'); pane.scrollTop += autoSpeed * Math.min(100, now - last) / 1000; last = now;
      if (pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 2) {
        if (state.section < state.sections.length - 1) jumpSection(state.section + 1); else { setAuto(0); return; }
      }
      autoFrame = requestAnimationFrame(tick);
    }; autoFrame = requestAnimationFrame(tick);
  }
  function close({route = true} = {}) {
    exitFullscreen();
    savePosition(); state.request?.abort(); state.generation++; setAuto(0); clearTimeout(scrollTimer); resizeAnchor = null;
    toggleAudio(false); panel(null);
    state.ready = false; state.item = null;
    $('reader-view-container').classList.remove('active'); document.body.style.overflow = '';
    window.PersistentPlayer?.mountReader(false);
    document.body.classList.remove('reader-open'); pages.anchor = null;
    for (const el of document.querySelectorAll('main,.noble-header,.noble-nav-bar,.noble-footer,#dharma-sidebar,#dharma-companion,#dharma-mobile-nav')) el.inert = false;
    const returnTab = state.key.startsWith('ebooks:') ? 'daitang' : state.key.startsWith('phucminh:') ? 'phucminh' : 'daithua';
    const returnToCollection = state.previousHash.startsWith('#read/');
    if (route && !window.LibraryRouter?.restoring) {
      const hash = returnToCollection ? '#' + returnTab : state.previousHash || '#home';
      window.LibraryRouter?.move(hash, {replace:returnToCollection});
      if (returnToCollection) switchTab(returnTab, {replace:true});
      window.LibraryRouter?.title();
    }
    const returnTarget = state.previousFocus?.checkVisibility() ? state.previousFocus : (document.getElementById('library-menu-toggle')?.checkVisibility() ? document.getElementById('library-menu-toggle') : document.querySelector('.brand-wrapper'));
    returnTarget?.focus({ preventScroll: true }); window.LibraryUI?.refreshShelf();
  }
  function handleKey(e) {
    if (!$('reader-view-container').classList.contains('active')) return false;
    if (e.key === 'Tab') {
      const drawer = innerWidth < 900 ? (!$('reader-inspector').hidden ? $('reader-inspector') : (!$('reader-view-container').classList.contains('toc-hidden') && !pref.focus ? $('reader-sidebar') : null)) : null;
      const scope = drawer || $('reader-view-container');
      const selector = 'button:not(:disabled),input,select,textarea,summary,a[href],[tabindex="0"]';
      const buttons = [...scope.querySelectorAll(selector)].filter(el => el.checkVisibility() && el.tabIndex >= 0 && !el.disabled && !el.closest('[inert]'));
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      return true;
    }
    if (e.key === 'Escape') { e.preventDefault(); if (state.fullscreen) exitFullscreen(); else if (!$('reader-inspector').hidden) panel(null); else if (innerWidth < 900 && !$('reader-view-container').classList.contains('toc-hidden') && !pref.focus) toggleToc(false); else close(); return true; }
    if (e.altKey && !e.ctrlKey && !e.metaKey && e.key === 'Enter') { e.preventDefault(); toggleFullscreen(); return true; }
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return true;
    if (e.key === 'Enter' && document.activeElement.id === 'reader-scroll') {
      e.preventDefault();
      selectBlock(capture().block, false);
      panel('research');
      $('reader-note-input').focus({ preventScroll: true });
      return true;
    }
    if (e.key === 'Enter' && document.activeElement.dataset.block) { selectBlock(document.activeElement.dataset.block); return true; }
    if (e.key === '/' || (e.ctrlKey && e.key === 'k')) { e.preventDefault(); panel('research'); $('reader-search').focus(); return true; }
    if (['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp'].includes(e.key)) {
      if (document.activeElement.id === 'reader-resizer' || document.activeElement.closest('#persistent-player') && !document.activeElement.closest('.dp-reading-nav')) return true;
      e.preventDefault(); navigate(['ArrowRight', 'PageDown'].includes(e.key) ? 1 : -1);
    }
    return true;
  }
  function highlightText(html, query) {
    if (!query || query.length < 2) return html;
    try {
      // Escape regex special chars but match accent-insensitively
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(' + escaped + ')', 'gi');
      // Only highlight in text nodes, not in HTML tags
      return html.replace(/>([^<]+)</g, (match, text) => '>' + text.replace(regex, '<mark class="search-hl">$1</mark>') + '<');
    } catch { return html; }
  }
  function followAudio(block, sourceOffset = 0) { if (state.ready && state.key === window.Audiobook.state.key && $('reader-view-container').classList.contains('active') && (state.mode === 'viet' || state.mode === 'dual')) { jumpBlock(block, { textOffset: sourceOffset }); $('reader-paper-content').querySelectorAll('.speaking-block').forEach(e => e.classList.remove('speaking-block')); $('reader-paper-content').querySelector(`[data-block="${block}"]`)?.classList.add('speaking-block'); } }
  window.Reader = { init, open, close, handleKey, jumpBlock, jumpSection, followAudio, toggleAudio, toggleFullscreen, state, capture, pref, rebuild, path, navigate, pages };
})();

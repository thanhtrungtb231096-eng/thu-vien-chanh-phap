function readLegacyValue(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
function readLegacyBookmarks() { try { return JSON.parse(localStorage.getItem('dhamma_bookmarks') || '{}') || {}; } catch { return {}; } }
/**
 * Đại Thư Viện Chánh Pháp - Main Application Controller (Bản Nâng Cấp Hoàng Gia)
 * Tích hợp: 62 Bộ Kinh Đại Thừa, 25 Bộ Hán Tạng, 4 Phụ Lục Minh Triết,
 * Trình Đọc Song Ngữ Side-by-Side (Hán - Việt), 244 Mi Tiên, 218 Vấn Đáp & Tọa Thiền.
 */

// Application State
const appState = {
  currentTab: 'home',
  currentAppendixSubtab: 'aham',
  theme: readLegacyValue('dhamma_theme', 'parchment'),
  searchQuery: '',
  daiThuaFilter: 'all',
  daiTangDivFilter: 'all',
  daiTangOnlyViet: false,
  daiTangPage: 1,
  daiTangPageSize: 40,
  activeReaderItem: null, // Current active book/text object
  activeReaderViewMode: 'viet', // 'viet' | 'han' | 'note' | 'dual'
  readerFontSize: parseInt(readLegacyValue('reader_font_size', '18')),
  readerFontFamily: readLegacyValue('reader_font_family', 'serif'),
  readerLineHeight: readLegacyValue('reader_line_height', 'normal'), // 'normal' | 'loose'
  readerAlign: readLegacyValue('reader_align', 'justify'), // 'justify' | 'left'
  bookmarks: readLegacyBookmarks()
};

/* ==========================================================================
   0. Vietnamese Accent-Insensitive Search Helper
   ========================================================================== */
function removeVietnameseAccents(str) {
  if (!str) return '';
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase();
}

function accentInsensitiveMatch(text, query) {
  if (!text || !query) return false;
  // Try exact match first (faster)
  if (text.toLowerCase().includes(query)) return true;
  // Fall back to accent-insensitive
  return removeVietnameseAccents(text).includes(removeVietnameseAccents(query));
}

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initNavScrollIndicators();
  initGlobalEvents();
  initKeyboardShortcuts();
  showSkeletonLoading();
  
  // Delayed render for perceived performance
  requestAnimationFrame(() => {
    renderDaiThuaGrid();
    renderDaiTangDivisions();
    renderDaiTangTexts();
    initMeditationTimer();
    renderNotesAndBookmarks();
    window.Reader.init();
    window.PhucMinh.init();
    window.DaiTang.init();
    window.LibraryUI.init();
  });

  // URL Hash routing
  const hash = window.location.hash.replace('#', '');
  if (hash && ['daitang', 'phucminh', 'daithua', 'daitanghan', 'appendix', 'roadmap', 'milinda', 'practical', 'glossary', 'timer', 'notes'].includes(hash)) {
    switchTab(hash);
  }
});

/* ==========================================================================
   1. Theme Management
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute('data-theme', appState.theme);
  updateThemeButtons();
}

function setTheme(themeName) {
  appState.theme = themeName;
  document.documentElement.setAttribute('data-theme', themeName);
  try { localStorage.setItem('dhamma_theme', themeName); } catch { /* Reading remains available without storage. */ }
  updateThemeButtons();
}

function updateThemeButtons() {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === appState.theme);
    btn.setAttribute('aria-pressed', String(btn.dataset.theme === appState.theme));
  });
  document.querySelectorAll('[data-r-theme]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.rTheme === appState.theme)));
}

/* ==========================================================================
   2. Navigation & Tabs
   ========================================================================== */
function initNavigation() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });
}

function switchTab(tabId, options = {}) {
  window.LibraryRouter?.move(options.hash || '#' + tabId, options);
  if (window.Reader?.state.item) Reader.close({route:false});
  if (window.LibraryUI && appState.currentTab) window.LibraryStore.write('query:' + appState.currentTab, appState.searchQuery);
  appState.currentTab = tabId;
  if (!window.LibraryRouter && window.location.hash !== '#' + tabId) history.replaceState(null, '', '#' + tabId);

  // Update tab buttons with ARIA
  document.querySelectorAll('.nav-tab').forEach(t => {
    const isActive = t.dataset.tab === tabId;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Show/hide panels with ARIA
  document.querySelectorAll('.tab-panel').forEach(panel => {
    const isVisible = panel.id === `tab-${tabId}`;
    panel.style.display = isVisible ? 'block' : 'none';
  });

  // Compact hero on non-primary tabs
  const hero = document.querySelector('.dhamma-hero');
  if (hero) {
    hero.classList.toggle('hero-compact', tabId !== 'daithua');
  }

  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    appState.searchQuery = window.LibraryStore?.read('query:' + tabId, '') || '';
    searchInput.value = appState.searchQuery;
  }

  // Scroll active tab into view in nav
  const activeTab = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
  if (activeTab) {
    activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  window.LibraryUI?.onTab(tabId);
  window.DharmaShell?.onTab(tabId);
  document.getElementById('tab-'+tabId)?.dispatchEvent(new Event('library-tab-open'));
  applyCurrentSearch();
  window.LearningPath?.onTab(tabId);
  window.ModulePresentation?.onTab(tabId);
  window.scrollTo({ top: 0, behavior: 'auto' });
  window.LibraryRouter?.title();
}

/* ==========================================================================
   3. Global Events & Search
   ========================================================================== */
function initGlobalEvents() {
  const bellHeaderBtn = document.getElementById('btn-bell-header');
  if (bellHeaderBtn) {
    bellHeaderBtn.addEventListener('click', () => {
      if (window.zenBell) window.zenBell.ring(432, 5.0);
    });
  }

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        appState.searchQuery = e.target.value.trim().toLowerCase();
        applyCurrentSearch();
      }, 180);
    });
  }

  // Dai Thua Category Filter Chips
  document.querySelectorAll('.daithua-filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.daithua-filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.daiThuaFilter = btn.dataset.cat;
      renderDaiThuaGrid();
    });
  });

  // Dai Tang Han Filter Buttons
  document.querySelectorAll('.daitang-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.daitang-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (filter === 'viet') {
        appState.daiTangOnlyViet = true;
        appState.daiTangDivFilter = 'all';
      } else if (filter === 'aham') {
        appState.daiTangOnlyViet = false;
        appState.daiTangDivFilter = '01';
      } else {
        appState.daiTangOnlyViet = false;
        appState.daiTangDivFilter = 'all';
      }
      appState.daiTangPage = 1;
      renderDaiTangTexts();
      updateActiveDivisionCard();
    });
  });
}

/* ==========================================================================
   3a. Nav Scroll Indicators
   ========================================================================== */
function initNavScrollIndicators() {
  const container = document.getElementById('nav-tabs-container');
  const btnLeft = document.getElementById('nav-scroll-left');
  const btnRight = document.getElementById('nav-scroll-right');
  const fadeLeft = document.getElementById('nav-fade-left');
  const fadeRight = document.getElementById('nav-fade-right');
  if (!container || !btnLeft || !btnRight) return;

  function updateNavScrollState() {
    const canScrollLeft = container.scrollLeft > 5;
    const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 5);
    btnLeft.style.display = canScrollLeft ? 'flex' : 'none';
    btnRight.style.display = canScrollRight ? 'flex' : 'none';
    if (fadeLeft) fadeLeft.style.display = canScrollLeft ? 'block' : 'none';
    if (fadeRight) fadeRight.style.display = canScrollRight ? 'block' : 'none';
  }

  container.addEventListener('scroll', updateNavScrollState);
  window.addEventListener('resize', updateNavScrollState);
  btnLeft.addEventListener('click', () => {
    container.scrollBy({ left: -200, behavior: 'smooth' });
  });
  btnRight.addEventListener('click', () => {
    container.scrollBy({ left: 200, behavior: 'smooth' });
  });

  // Initial check
  setTimeout(updateNavScrollState, 100);
}

/* ==========================================================================
   3b. Keyboard Shortcuts
   ========================================================================== */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (window.Reader?.handleKey(e)) return;
    // Don't intercept when typing in input/textarea
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

    // Esc: Close reader or modal
    if (e.key === 'Escape') {
      const modal = document.getElementById('noble-modal');
      if (modal && modal.classList.contains('open')) {
        closeModal();
        return;
      }
      const reader = document.getElementById('reader-view-container');
      if (reader && reader.classList.contains('active')) {
        closeReader();
        return;
      }
    }

    if (isTyping) return;

    // / or Ctrl+K: Focus search
    if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      const search = document.getElementById('global-search');
      if (search) search.focus();
      return;
    }

    // Arrow keys in reader: Switch mode
    const reader = document.getElementById('reader-view-container');
    if (reader && reader.classList.contains('active')) {
      const modes = ['viet', 'han', 'dual', 'note'];
      const idx = modes.indexOf(appState.activeReaderViewMode);
      if (e.key === 'ArrowRight' && idx < modes.length - 1) {
        switchReaderMode(modes[idx + 1]);
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        switchReaderMode(modes[idx - 1]);
      }
    }
  });
}

/* ==========================================================================
   3c. Skeleton Loading
   ========================================================================== */
function showSkeletonLoading() {
  const container = document.getElementById('daithua-grid-container');
  if (container && container.innerHTML.trim() === '') {
    const skeletons = Array.from({length: 6}, () => `
      <div class="skeleton-card">
        <div class="skeleton-line w50"></div>
        <div class="skeleton-line w75"></div>
        <div class="skeleton-line w90"></div>
        <div class="skeleton-line w50"></div>
      </div>
    `).join('');
    container.innerHTML = skeletons;
  }
}

function applyCurrentSearch() {
  if(!window.LibraryAssets?.ready(appState.currentTab)){const tab=appState.currentTab;LibraryAssets.ensure(tab).then(()=>{if(appState.currentTab===tab)applyCurrentSearch();}).catch(e=>{const p=document.getElementById('tab-'+tab);if(p){let status=p.querySelector('.asset-error');if(!status){status=document.createElement('p');status.className='asset-error';status.setAttribute('role','status');p.prepend(status);}status.textContent=e.message;}});return;}
  if (window.ContentModules?.isModule(appState.currentTab)) window.ContentModules.render();
  else if (appState.currentTab === 'home') window.LibraryUI?.searchLibrary();
  else if (appState.currentTab === 'daitang') window.DaiTang?.render();
  else if (appState.currentTab === 'phucminh') window.PhucMinh?.render();
  else if (appState.currentTab === 'daithua') renderDaiThuaGrid();
  else if (appState.currentTab === 'daitanghan') {
    appState.daiTangPage = 1;
    renderDaiTangTexts();
  }
  else if (appState.currentTab === 'milinda') renderMilindaQuestions();
  else if (appState.currentTab === 'practical') renderPracticalQA();
  else if (appState.currentTab === 'glossary') renderPaliGlossary();
}
/* ==========================================================================
   4. Tuyển Tập 62 Bộ Kinh Đại Thừa (Thập Nhị Phân Giáo)
   ========================================================================== */
function renderDaiThuaGrid() {
  const container = document.getElementById('daithua-grid-container');
  if (!container || typeof DAI_THUA_DATA === 'undefined') return;

  let list = DAI_THUA_DATA;

  if (appState.daiThuaFilter !== 'all') {
    list = list.filter(b => b.categoryCode === appState.daiThuaFilter);
  }

  if (appState.searchQuery) {
    const q = appState.searchQuery;
    list = list.filter(b => 
      accentInsensitiveMatch(b.title, q) ||
      accentInsensitiveMatch(b.hanTitle, q) ||
      accentInsensitiveMatch(b.taishoId, q) ||
      accentInsensitiveMatch(b.categoryName, q) ||
      accentInsensitiveMatch(b.origLang, q) ||
      accentInsensitiveMatch(b.excerpt, q) ||
      accentInsensitiveMatch(window.LibraryDesign?.creditLine({ type: 'daithua', data: b }), q)
    );
  }

  const badgeCount = document.getElementById('daithua-count-badge');
  if (badgeCount) badgeCount.innerText = `${list.length} / 62 Bộ`;

  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
      <p style="font-size: 1.1rem;">Không tìm thấy bản kinh nào phù hợp với từ khóa "${escapeHtml(appState.searchQuery)}".</p>
    </div>`;
    return;
  }

  container.innerHTML = list.map(b => {
    return `
      <article class="daithua-card" data-library-type="daithua" data-library-id="${b.id}">
        <div>
          <div class="card-top-row">
            <span class="taisho-badge">${b.taishoId}</span>
            <span class="cat-badge">${b.categoryName.split('—')[0].trim()}</span>
          </div>

          <h3 class="daithua-title">${b.title}</h3>
          <div class="daithua-han han-script">${b.hanTitle} <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-body);">(Gốc: ${b.origLang})</span></div>
          <p class="daithua-desc">${b.excerpt}</p>
        </div>

        <div class="daithua-action-btns">
          <button class="btn-read-viet" onclick="openTriReader('${b.id}', 'viet')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Bản Việt
          </button>
          <button class="btn-read-han" onclick="openTriReader('${b.id}', 'han')">
            Hán Văn
          </button>
          <button class="btn-read-han" onclick="openTriReader('${b.id}', 'dual')" title="Đối chiếu song song 2 cột Hán - Việt">
            Song Ngữ ☯
          </button>
          ${b.files.vietPdf ? `
            <a href="${b.files.vietPdf}" target="_blank" class="btn-file-pdf" title="Mở PDF Tiếng Việt">
              PDF
            </a>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');
  window.LibraryUI?.decorate();
}

/* ==========================================================================
   5. Đại Tạng Kinh Hán Tạng (25 Bộ · 2.471 Văn Bản)
   ========================================================================== */
function renderDaiTangDivisions() {
  const container = document.getElementById('daitang-divisions-container');
  if (!container || typeof DAI_TANG_HAN_DATA === 'undefined') return;

  const divs = DAI_TANG_HAN_DATA.divisions;
  container.innerHTML = divs.map(d => `
    <div class="division-card ${d.code === appState.daiTangDivFilter ? 'active' : ''}" data-div="${d.code}" onclick="selectDivision('${d.code}')">
      <span class="div-code-badge">Bộ ${d.code}</span>
      <div class="div-name">${d.name} <span class="han-script">${d.hanName}</span></div>
      <div class="div-stats">${d.total} văn bản • <strong style="color: var(--gold-dark);">${d.hasViet}</strong> bản Việt</div>
    </div>
  `).join('');
}

function selectDivision(code) {
  if (appState.daiTangDivFilter === code) {
    appState.daiTangDivFilter = 'all';
  } else {
    appState.daiTangDivFilter = code;
  }
  appState.daiTangPage = 1;
  updateActiveDivisionCard();
  renderDaiTangTexts();
}

function updateActiveDivisionCard() {
  document.querySelectorAll('.division-card').forEach(card => {
    card.classList.toggle('active', card.dataset.div === appState.daiTangDivFilter);
  });
}

function renderDaiTangTexts() {
  const container = document.getElementById('taisho-texts-list');
  if (!container || typeof DAI_TANG_HAN_DATA === 'undefined') return;

  let texts = DAI_TANG_HAN_DATA.texts;

  if (appState.daiTangDivFilter !== 'all') {
    texts = texts.filter(t => t.division === appState.daiTangDivFilter);
  }

  if (appState.daiTangOnlyViet) {
    texts = texts.filter(t => t.hasViet);
  }

  if (appState.searchQuery) {
    const q = appState.searchQuery.toLowerCase().trim();
    texts = texts.filter(t => 
      accentInsensitiveMatch(t.id, q) ||
      accentInsensitiveMatch(t.title, q) ||
      accentInsensitiveMatch(t.vietTitle, q) ||
      accentInsensitiveMatch(t.nikayaNote, q) ||
      accentInsensitiveMatch(window.LibraryDesign?.creditLine({ type: 'daitang', data: t }), q)
    );
  }

  const countBadge = document.getElementById('daitang-count-badge');
  if (countBadge) countBadge.innerText = `${texts.length} Văn Bản`;

  const total = texts.length;
  const start = (appState.daiTangPage - 1) * appState.daiTangPageSize;
  const pagedTexts = texts.slice(start, start + appState.daiTangPageSize);

  if (pagedTexts.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
      Không tìm thấy văn bản Taishō nào phù hợp.
    </div>`;
    renderPagination(0);
    return;
  }

  container.innerHTML = pagedTexts.map(t => {
    return `
      <div class="taisho-text-item" data-library-type="daitang" data-library-id="${t.id}">
        <div class="taisho-left">
          <span class="taisho-badge">${t.id}</span>
          <div class="taisho-title-container">
            <div class="taisho-viet-title">${t.vietTitle || t.title}</div>
            <div class="taisho-han-sub">
              <span class="han-script">${t.title}</span>
              ${t.nikayaNote ? `<span class="nikaya-badge">☸ ${t.nikayaNote}</span>` : ''}
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
          ${t.hasViet ? `
            <button class="btn-read-viet" style="flex: none; padding: 0.45rem 0.85rem;" onclick="openTaishoReader('${t.id}', 'viet')">
              Đọc Bản Việt
            </button>
          ` : `
            <span style="font-size: 0.78rem; color: var(--text-muted); padding: 4px 8px;">(Hán văn)</span>
          `}
          <button class="btn-read-han" onclick="openTaishoReader('${t.id}', 'han')">
            Chữ Hán
          </button>
        </div>
      </div>
    `;
  }).join('');

  renderPagination(total);
  window.LibraryUI?.decorate();
}

function renderPagination(total) {
  const container = document.getElementById('daitang-pagination');
  if (!container) return;

  const totalPages = Math.ceil(total / appState.daiTangPageSize);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <button class="preset-btn" ${appState.daiTangPage <= 1 ? 'disabled' : ''} onclick="changeDaiTangPage(-1)">← Trang Trước</button>
    <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-secondary);">Trang ${appState.daiTangPage} / ${totalPages} (${total} văn bản)</span>
    <button class="preset-btn" ${appState.daiTangPage >= totalPages ? 'disabled' : ''} onclick="changeDaiTangPage(1)">Trang Sau →</button>
  `;
}

function changeDaiTangPage(delta) {
  appState.daiTangPage += delta;
  renderDaiTangTexts();
  window.scrollTo({ top: document.getElementById('taisho-texts-list').offsetTop - 120, behavior: 'smooth' });
}

/* ==========================================================================
   6. Phụ Lục Minh Triết (Appendices System)
   ========================================================================== */
function renderAppendices(subtab = null) {
  if (subtab) appState.currentAppendixSubtab = subtab;
  const container = document.getElementById('appendix-content-container');
  if (!container || typeof DHAMMA_APPENDICES === 'undefined') return;

  // Update pills / tabs
  document.querySelectorAll('.appendix-subtab-btn, .appendix-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subtab === appState.currentAppendixSubtab);
  });

  const cur = appState.currentAppendixSubtab;

  if (cur === 'aham') {
    const data = DHAMMA_APPENDICES.ahamNikayaComparison;
    container.innerHTML = `
      <div class="appendix-card-wrapper">
        <h3 class="appendix-heading">${data.title}</h3>
        <p class="appendix-intro">${data.introduction}</p>

        <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--gold-dark); margin-bottom: 1rem;">1. Bảng Đối Chiếu 4 Bộ Kinh Căn Bản:</h4>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th style="width: 26%;">Kinh Điển Hán Tạng (A-Hàm)</th>
                <th style="width: 26%;">Kinh Điển Pāḷi (Nikāya)</th>
                <th style="width: 22%;">Quy Mô So Sánh</th>
                <th style="width: 26%;">Tông Phái Dịch & Đặc Điểm</th>
              </tr>
            </thead>
            <tbody>
              ${data.divisionsCorrelation.map(row => `
                <tr>
                  <td><strong>${row.hanName}</strong><br><span class="taisho-badge">${row.taishoId}</span></td>
                  <td><strong style="color: var(--saffron-700);">${row.paliName}</strong></td>
                  <td>Hán: ${row.countHan}<br>Pāḷi: ${row.countPali}</td>
                  <td><em>${row.school}</em><br><small style="color: var(--text-muted);">${row.nature}</small></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--gold-dark); margin: 1.5rem 0 1rem;">2. Các Bản Kinh Đối Ứng Cốt Tủy Nổi Tiếng:</h4>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${data.famousCorrelations.map(fc => `
            <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border-left: 3px solid var(--gold-pure);">
              <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">
                Hán: ${fc.sutraHan}
              </div>
              <div style="font-size: 0.95rem; font-weight: 600; color: var(--saffron-700); margin-bottom: 0.5rem;">
                Pāḷi: ${fc.sutraPali}
              </div>
              <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${fc.doctrine}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (cur === 'twelve') {
    const data = DHAMMA_APPENDICES.twelveDivisions;
    container.innerHTML = `
      <div class="appendix-card-wrapper">
        <h3 class="appendix-heading">${data.title}</h3>
        <p class="appendix-intro">${data.introduction}</p>

        <div class="twelve-genres-grid">
          ${data.genres.map(g => `
            <div class="genre-card">
              <span class="genre-code-badge">${g.code}</span>
              <h4 class="genre-title">${g.hanName}</h4>
              <div class="genre-pali">${g.paliSanskrit}</div>
              <p class="genre-def">${g.definition}</p>
              <div class="genre-examples"><strong>Kinh điển tiêu biểu:</strong> ${g.examples}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (cur === 'taisho') {
    const data = DHAMMA_APPENDICES.taishoStructure;
    container.innerHTML = `
      <div class="appendix-card-wrapper">
        <h3 class="appendix-heading">${data.title}</h3>
        <p class="appendix-intro">${data.introduction}</p>

        ${data.groups.map(grp => `
          <div class="tree-group-box">
            <h4 class="tree-group-title">${grp.groupName}</h4>
            <div class="tree-divisions-list">
              ${grp.divisions.map(d => `
                <div class="tree-div-item">
                  <strong>${d.code}. ${d.name}</strong>
                  <div style="font-size: 0.78rem; color: var(--gold-dark); font-weight: 600; margin: 2px 0;">${d.count}</div>
                  <p>${d.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (cur === 'numbers') {
    const data = DHAMMA_APPENDICES.coreDhammaNumbers;
    container.innerHTML = `
      <div class="appendix-card-wrapper">
        <h3 class="appendix-heading">${data.title}</h3>
        <p class="appendix-intro">${data.introduction}</p>

        <div style="display: flex; flex-direction: column; gap: 2rem;">
          ${data.tables.map(tbl => `
            <div style="background: var(--bg-surface-elevated); padding: 1.5rem; border-radius: var(--radius-md); border-left: 4px solid var(--gold-pure);">
              <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--gold-dark); margin-bottom: 0.35rem;">${tbl.name}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">${tbl.summary}</p>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.85rem;">
                ${tbl.items.map(it => `
                  <div style="background: var(--bg-card); padding: 0.85rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                    <strong style="color: var(--saffron-700);">${it.term}</strong>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem; line-height: 1.5;">${it.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

function switchAppendixSubtab(subtab) {
  renderAppendices(subtab);
  window.LibraryUI?.enhanceAppendix();
}

/* ==========================================================================
   7. Trình Đọc Tam Bản & Song Ngữ (Side-by-Side Bilingual Reader)
   ========================================================================== */
function openTriReader(bookId, mode = 'viet') {
  const data = DAI_THUA_DATA.find(b => b.id === bookId);
  if (data) return window.Reader.open({ type: 'daithua', data }, mode);
}
function openTaishoReader(taishoId, mode = 'viet') {
  const data = DAI_TANG_HAN_DATA.texts.find(t => t.id === taishoId);
  if (data) return window.Reader.open({ type: 'daitang', data }, mode);
}
function closeReader() { window.Reader.close(); }
function switchReaderMode(mode) { return window.Reader.open(window.Reader.state.item, mode); }

/* ==========================================================================
   8. SutraFormatter Integration - Chuyên Trình Bày & Kiểm Định Kinh Văn
   ========================================================================== */
function renderMarkdownToHtml(md, isViet = true) {
  if (!md) return '';

  if (typeof window.SutraFormatter !== 'undefined') {
    return window.SutraFormatter.format(md, isViet);
  }

  // Fallback if SutraFormatter is still loading
  let html = md;
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  return html.split('\n\n').map(p => `<p>${p}</p>`).join('\n');
}

/* ==========================================================================
   9. Milinda Pañha & 218 Practical QA & Pāḷi Glossary
   ========================================================================== */
function renderMilindaQuestions() {
  const container = document.getElementById('milinda-list-container');
  if (!container || typeof MILINDA_PANHA_QUESTIONS === 'undefined') return;

  let list = MILINDA_PANHA_QUESTIONS;

  if (appState.searchQuery) {
    const q = appState.searchQuery;
    list = list.filter(item => 
      accentInsensitiveMatch(item.title, q) ||
      accentInsensitiveMatch(item.summary, q) ||
      accentInsensitiveMatch(item.category, q) ||
      item.id.toString() === q
    );
  }

  const countElem = document.getElementById('milinda-count-badge');
  if (countElem) countElem.innerText = `${list.length} / 244 câu`;

  container.innerHTML = list.map(item => `
    <div class="qa-card" onclick="openMilindaModal(${item.id})">
      <div class="qa-card-header">
        <div class="qa-title-wrap">
          <span class="qa-index">#${item.id}</span>
          <h4 class="qa-title">${item.title}</h4>
        </div>
        <span class="qa-tag">${item.category}</span>
      </div>
      <div class="qa-body">
        <p>${item.summary}</p>
      </div>
    </div>
  `).join('');
}

function openMilindaModal(id) {
  const item = MILINDA_PANHA_QUESTIONS.find(q => q.id === id);
  if (!item) return;

  showModal(
    `#${item.id}. ${item.title}`,
    `
      <div style="margin-bottom: 1rem;">
        <span class="cat-badge">${item.category}</span>
      </div>
      <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; border-left: 3px solid var(--gold-pure);">
        <h4 style="color: var(--gold-dark); margin-bottom: 0.5rem; font-family: var(--font-serif);">Vấn Nạn Của Đức Vua Mi-lan-đà:</h4>
        <p style="font-size: 1.02rem; line-height: 1.7; color: var(--text-primary);">${item.summary}</p>
      </div>
      <div style="margin-top: 1.5rem; text-align: right;">
        <button class="bell-btn" onclick="addNoteFromModal('Mi Tiên Vấn Đáp: #${item.id} ${escapeHtml(item.title)}')">
          Lưu Vào Sổ Tay Quán Chiếu
        </button>
      </div>
    `
  );
}

function renderPracticalQA() {
  const container = document.getElementById('practical-list-container');
  if (!container || typeof PRACTICAL_QA_DATA === 'undefined') return;

  let list = PRACTICAL_QA_DATA;

  if (appState.searchQuery) {
    const q = appState.searchQuery;
    list = list.filter(item => 
      accentInsensitiveMatch(item.question, q) ||
      accentInsensitiveMatch(item.answer, q) ||
      accentInsensitiveMatch(item.category, q)
    );
  }

  const countElem = document.getElementById('practical-count-badge');
  if (countElem) countElem.innerText = `${list.length} câu hỏi`;

  container.innerHTML = list.map(item => `
    <div class="qa-card" onclick="openPracticalModal(${item.id})">
      <div class="qa-card-header">
        <div class="qa-title-wrap">
          <span class="qa-index">?</span>
          <h4 class="qa-title">${item.question}</h4>
        </div>
        <span class="qa-tag">${item.category}</span>
      </div>
      <div class="qa-body">
        <p><strong>Đáp:</strong> ${item.answer}</p>
      </div>
    </div>
  `).join('');
}

function openPracticalModal(id) {
  const item = PRACTICAL_QA_DATA.find(q => q.id === id);
  if (!item) return;

  showModal(
    item.question,
    `
      <div style="margin-bottom: 1rem;">
        <span class="cat-badge">${item.category}</span>
      </div>
      <div style="background: var(--bg-surface-elevated); padding: 1.5rem; border-radius: var(--radius-md); line-height: 1.85; font-size: 1.05rem; border-left: 3px solid var(--gold-pure);">
        <h4 style="color: var(--gold-dark); margin-bottom: 0.75rem; font-family: var(--font-serif);">Lời Phật Dạy & Lời Giải Đáp:</h4>
        <p style="color: var(--text-primary);">${item.answer}</p>
      </div>
      <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
        <button class="bell-btn" onclick="addNoteFromModal('Hỏi đáp Phật pháp: ${escapeHtml(item.question)}')">
          Ghi Chép Lại
        </button>
      </div>
    `
  );
}

function renderPaliGlossary() {
  const container = document.getElementById('glossary-grid-container');
  if (!container || typeof PALI_GLOSSARY === 'undefined') return;

  let list = PALI_GLOSSARY;

  if (appState.searchQuery) {
    const q = appState.searchQuery;
    list = list.filter(item => 
      accentInsensitiveMatch(item.term, q) ||
      accentInsensitiveMatch(item.pali, q) ||
      accentInsensitiveMatch(item.vietnamese, q) ||
      accentInsensitiveMatch(item.definition, q) ||
      accentInsensitiveMatch(item.category, q)
    );
  }

  container.innerHTML = list.map(item => `
    <div class="glossary-card">
      <div class="glossary-term">${item.pali}</div>
      <div class="glossary-viet">${item.vietnamese}</div>
      <span class="glossary-cat">${item.category}</span>
      <p class="glossary-def">${item.definition}</p>
      <div class="glossary-note"><strong>Ứng dụng:</strong> ${item.practiceNote}</div>
    </div>
  `).join('');
}

/* ==========================================================================
   10. Meditation Timer & Notes Manager
   ========================================================================== */
function initMeditationTimer() {
  const timerDigits = document.getElementById('timer-display-digits');
  const outerCircle = document.getElementById('breathing-circle');
  const btnStart = document.getElementById('btn-timer-start');
  const btnPause = document.getElementById('btn-timer-pause');
  const btnReset = document.getElementById('btn-timer-reset');

  if (!timerDigits || !window.meditationTimer) return;

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mins = parseInt(btn.dataset.mins || '15');
      window.meditationTimer.setDuration(mins);
    });
  });

  const breathingPrompt = document.getElementById('breathing-prompt');

  document.querySelectorAll('.ambient-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ambient-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.meditationTimer.setAmbient(btn.dataset.ambient);
    });
  });

  window.meditationTimer.onBreathingPhase = (phase, text) => {
    if (outerCircle) outerCircle.dataset.phase = phase;
    if (breathingPrompt) breathingPrompt.textContent = text;
  };

  window.meditationTimer.onTick = (remaining, total) => {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    timerDigits.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  window.meditationTimer.onComplete = () => {
    if (outerCircle) {
      outerCircle.classList.remove('breathing');
      outerCircle.dataset.phase = 'idle';
    }
    if (breathingPrompt) breathingPrompt.textContent = 'Thời khóa hoàn mãn · Thân tâm thanh tịnh';
    alert('Thời khóa tọa thiền đã hoàn mãn. Nguyện hồi hướng phước báu đến tất cả chúng sanh!');
  };

  if (btnStart) {
    btnStart.addEventListener('click', () => {
      window.meditationTimer.start();
      if (outerCircle) outerCircle.classList.add('breathing');
      btnStart.style.display = 'none';
      if (btnPause) btnPause.style.display = 'inline-flex';
    });
  }

  if (btnPause) {
    btnPause.addEventListener('click', () => {
      window.meditationTimer.pause();
      if (outerCircle) {
        outerCircle.classList.remove('breathing');
        outerCircle.dataset.phase = 'idle';
      }
      if (breathingPrompt) breathingPrompt.textContent = 'Tạm dừng · Giữ tâm bình thản';
      btnPause.style.display = 'none';
      if (btnStart) btnStart.style.display = 'inline-flex';
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      window.meditationTimer.reset();
      if (outerCircle) {
        outerCircle.classList.remove('breathing');
        outerCircle.dataset.phase = 'idle';
      }
      if (breathingPrompt) breathingPrompt.textContent = 'An trú trong chánh niệm';
      if (btnPause) btnPause.style.display = 'none';
      if (btnStart) btnStart.style.display = 'inline-flex';
    });
  }
}

function renderNotesAndBookmarks() {
  const notesList = document.getElementById('notes-history-container');
  if (!window.dhammaNotes || !notesList) return;

  const notes = window.dhammaNotes.getNotes();
  if (notes.length === 0) {
    notesList.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">Chưa có ghi chép nào. Hãy ghi lại những hiểu biết hoặc cảm thọ trong khi học Pháp!</p>`;
  } else {
    notesList.innerHTML = notes.map(n => `
      <div class="note-item-card">
        <button class="btn-del-note" onclick="deleteNoteItem('${n.id}')" title="Xóa ghi chép">×</button>
        <h4>${escapeHtml(n.title)}</h4>
        <div class="note-date">${new Date(n.createdAt).toLocaleDateString('vi-VN')} - ${new Date(n.createdAt).toLocaleTimeString('vi-VN')}</div>
        <div class="note-content">${escapeHtml(n.content)}</div>
      </div>
    `).join('');
  }
}

function saveNewNote() {
  const titleInput = document.getElementById('note-title-input');
  const contentInput = document.getElementById('note-content-input');
  if (!titleInput || !contentInput) return;

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!content) {
    alert('Vui lòng nhập nội dung quán chiếu ghi chép.');
    return;
  }

  window.dhammaNotes.saveNote(title || 'Quán chiếu Chánh pháp', content);
  titleInput.value = '';
  contentInput.value = '';
  renderNotesAndBookmarks();
}

function deleteNoteItem(id) {
  if (confirm('Bạn có chắc muốn xóa ghi chép này?')) {
    window.dhammaNotes.deleteNote(id);
    renderNotesAndBookmarks();
  }
}

function addNoteFromModal(title) {
  closeModal();
  switchTab('notes');
  const titleInput = document.getElementById('note-title-input');
  if (titleInput) {
    titleInput.value = title;
  }
}

function showModal(title, bodyHtml) {
  const backdrop = document.getElementById('noble-modal');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  if (!backdrop || !titleEl || !bodyEl) return;

  titleEl.innerText = title;
  bodyEl.innerHTML = bodyHtml;
  backdrop.classList.add('open');
}

function closeModal() {
  const backdrop = document.getElementById('noble-modal');
  if (backdrop) backdrop.classList.remove('open');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}


/* Touch Mobile & Tablet Native App UI/UX Controller (Chặng A)
 * Unifies Off-Canvas Slide-Over Sidebar, 5-Pillar Bottom Tab Bar, Canon Quick-Sheet,
 * Smart Collapsible Header, Swipeable Mini-Player, Touch Reader Zen/Page Gestures & Back Stack.
 */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  let initialized = false;
  const tabHistory = ['home'];
  let activeTabId = 'home';

  const RAIL_LABELS = {
    home: 'Khám phá',
    'listening-history': 'Lịch sử',
    'tang-han': 'Hán tạng',
    'tang-dai-thua': 'Đại thừa',
    'tang-nam-tong': 'Nam tông',
    phucminh: 'Phúc Minh',
    paths: 'Lộ trình',
    daily: 'Khóa tụng',
    offline: 'Ngoại tuyến',
    study: 'Thời khóa',
    shelf: 'Tủ sách',
  };

  function icon(name) {
    return window.PersistentPlayer?.icon ? window.PersistentPlayer.icon(name) : '';
  }

  function syncNativeStatusBar(theme) {
    const sb = window.Capacitor?.Plugins?.StatusBar;
    if (!sb) return;
    const isNight = (theme || document.documentElement.getAttribute('data-theme')) === 'night';
    sb.setStyle?.({ style: isNight ? 'DARK' : 'LIGHT' }).catch?.(() => {});
    sb.setBackgroundColor?.({ color: isNight ? '#0f1412' : theme === 'amber' ? '#f3e5cb' : '#f7f3e8' }).catch?.(() => {});
  }

  function isDrawerViewport() {
    return window.innerWidth <= 1023;
  }

  function openDrawer() {
    if (!isDrawerViewport()) return;
    document.querySelector('dialog[open]')?.close();
    document.body.classList.add('dharma-drawer-open');
    $('dharma-drawer-scrim')?.removeAttribute('hidden');
    $('dharma-drawer-toggle')?.setAttribute('aria-expanded', 'true');
    syncBottomNavActive(activeTabId);
    void refreshOfflineBadge();
  }

  function closeDrawer(opts = {}) {
    if (!document.body.classList.contains('dharma-drawer-open')) return;
    document.body.classList.remove('dharma-drawer-open');
    $('dharma-drawer-scrim')?.setAttribute('hidden', '');
    const toggle = $('dharma-drawer-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      if (opts.restoreFocus) toggle.focus({ preventScroll: true });
    }
    syncBottomNavActive(activeTabId);
  }

  function toggleDrawer() {
    if (window.innerWidth >= 1024 && window.innerWidth <= 1199) {
      const collapsed = document.body.classList.toggle('dharma-rail-collapsed');
      window.LibraryStore?.write?.('tablet-rail-collapsed', collapsed);
      $('dharma-drawer-toggle')?.setAttribute('aria-expanded', String(!collapsed));
      return;
    }
    if (document.body.classList.contains('dharma-drawer-open')) {
      closeDrawer({ restoreFocus: true });
    } else {
      openDrawer();
    }
  }

  function navigateTarget(target) {
    closeDrawer({ restoreFocus: false });
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    const sidebarBtn = document.querySelector(`#dharma-sidebar [data-dharma-nav="${target}"]`);
    if (sidebarBtn && ['tang-dai-thua', 'tang-nam-tong', 'tang-han'].includes(target)) {
      sidebarBtn.click();
      return;
    }
    if (window.DharmaShell?.navigate) {
      window.DharmaShell.navigate(target);
    } else if (typeof window.switchTab === 'function') {
      window.switchTab(target);
    }
  }

  function installHeaderControls() {
    const headerContainer = document.querySelector('.header-container');
    if (!headerContainer || $('dharma-drawer-toggle')) return;

    const drawerBtn = document.createElement('button');
    drawerBtn.type = 'button';
    drawerBtn.id = 'dharma-drawer-toggle';
    drawerBtn.className = 'r-button touch-drawer-toggle';
    drawerBtn.setAttribute('aria-label', 'Mở danh mục thư viện');
    drawerBtn.setAttribute('aria-controls', 'dharma-sidebar');
    drawerBtn.setAttribute('aria-expanded', 'false');
    drawerBtn.innerHTML = icon('menu');
    drawerBtn.onclick = toggleDrawer;
    headerContainer.prepend(drawerBtn);

    const bellBtn = document.createElement('button');
    bellBtn.type = 'button';
    bellBtn.id = 'dharma-bell-quick';
    bellBtn.className = 'r-button touch-bell-quick';
    bellBtn.setAttribute('aria-label', 'Thỉnh tiếng chuông chánh niệm');
    bellBtn.title = 'Thỉnh tiếng chuông chánh niệm';
    bellBtn.innerHTML = icon('bell');
    bellBtn.onclick = () => window.zenBell?.ring?.(432, 5.2);
    headerContainer.append(bellBtn);

    if (window.LibraryStore?.read?.('tablet-rail-collapsed', false)) {
      document.body.classList.add('dharma-rail-collapsed');
    }
  }

  async function refreshOfflineBadge() {
    const badge = $('ds-offline-badge');
    if (!badge) return;
    try {
      const plugin = window.Capacitor?.Plugins?.ChanhPhapEngine || window.__CHANH_PHAP_MOBILE_SIM__ || window.MobileBridge?.getPlugin?.();
      if (plugin?.getVaultStatus) {
        const st = await plugin.getVaultStatus();
        const packList = st?.packs || st?.installedPacks || ['core-bundled'];
        const count = packList.length + (st?.ttsInstalled ? 1 : 0);
        badge.textContent = st?.ttsInstalled ? `${count} gói · AI` : `${count} gói`;
        return;
      }
      const saved = window.LibraryStore?.read?.('offline-books', []);
      badge.textContent = Array.isArray(saved) && saved.length ? `${saved.length} kinh` : 'Sẵn sàng';
    } catch {
      badge.textContent = 'Sẵn sàng';
    }
  }

  function installSidebarDrawer() {
    const sidebar = $('dharma-sidebar');
    if (!sidebar || $('dharma-drawer-scrim')) return;

    const scrim = document.createElement('div');
    scrim.id = 'dharma-drawer-scrim';
    scrim.className = 'dharma-drawer-scrim';
    scrim.hidden = true;
    scrim.setAttribute('aria-hidden', 'true');
    scrim.onclick = () => closeDrawer({ restoreFocus: false });
    sidebar.before(scrim);

    const wheelSvg = window.LibraryArt?.svg ? window.LibraryArt.svg('wheel', 'ds-drawer-wheel') : '';
    const drawerTop = document.createElement('div');
    drawerTop.className = 'ds-drawer-top';
    drawerTop.innerHTML = `
      <div class="ds-drawer-brand">
        ${wheelSvg}
        <div class="ds-drawer-brand-text">
          <strong>CHÁNH PHÁP</strong>
          <small>TAM TẠNG KINH ĐIỂN</small>
        </div>
        <div class="ds-drawer-actions">
          <button type="button" id="ds-drawer-bell" class="dp-icon" aria-label="Thỉnh chuông chánh niệm" title="Thỉnh chuông">${icon('bell')}</button>
          <button type="button" id="ds-drawer-close" class="dp-icon" aria-label="Đóng danh mục">${icon('close')}</button>
        </div>
      </div>
      <div class="ds-drawer-themes" role="group" aria-label="Chọn màu nền giao diện">
        <button type="button" class="theme-btn" data-theme="parchment">📜 Bạch Ngọc</button>
        <button type="button" class="theme-btn" data-theme="amber">🍂 Hoàng Y</button>
        <button type="button" class="theme-btn" data-theme="night">🌙 Dạ Thiền</button>
      </div>
    `;
    sidebar.prepend(drawerTop);

    $('ds-drawer-close').onclick = () => closeDrawer({ restoreFocus: true });
    $('ds-drawer-bell').onclick = () => window.zenBell?.ring?.(432, 5.2);
    drawerTop.querySelectorAll('.theme-btn').forEach(btn => {
      btn.onclick = () => {
        if (typeof window.setTheme === 'function') window.setTheme(btn.dataset.theme);
        syncNativeStatusBar(btn.dataset.theme);
      };
    });
    window.updateThemeButtons?.();

    // Upgrade any plain-text button appended to .ds-nav (e.g. "Thời khóa của tôi") with proper icon + data-dharma-nav
    sidebar.querySelectorAll('.ds-nav > button').forEach(btn => {
      if (!btn.dataset.dharmaNav && btn.textContent.includes('Thời khóa')) {
        btn.dataset.dharmaNav = 'study';
        btn.innerHTML = `${icon('study')}<span>Thời khóa của tôi</span>`;
      }
      const id = btn.dataset.dharmaNav;
      if (id && RAIL_LABELS[id] && !btn.querySelector('.ds-rail-caption')) {
        const cap = document.createElement('span');
        cap.className = 'ds-rail-caption';
        cap.textContent = RAIL_LABELS[id];
        btn.append(cap);
      }
    });

    const shelfHeadingBtn = sidebar.querySelector('.ds-library-heading > button:first-child');
    if (shelfHeadingBtn && !shelfHeadingBtn.querySelector('.ds-rail-caption')) {
      const cap = document.createElement('span');
      cap.className = 'ds-rail-caption';
      cap.textContent = RAIL_LABELS.shelf;
      shelfHeadingBtn.append(cap);
    }

    const offlineBtn = sidebar.querySelector('[data-dharma-nav="offline"]');
    if (offlineBtn && !offlineBtn.querySelector('#ds-offline-badge')) {
      const badge = document.createElement('span');
      badge.id = 'ds-offline-badge';
      badge.className = 'ds-nav-badge';
      badge.textContent = 'Sẵn sàng';
      offlineBtn.append(badge);
    }

    // Auto-close drawer when selecting any navigation destination on mobile/tablet
    sidebar.addEventListener('click', e => {
      if (!isDrawerViewport()) return;
      const hit = e.target.closest(
        '[data-dharma-nav], .ds-more nav button, .ds-pills button, .ds-book, .ds-playlist'
      );
      if (hit) closeDrawer({ restoreFocus: false });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.classList.contains('dharma-drawer-open')) {
        e.preventDefault();
        closeDrawer({ restoreFocus: true });
      }
    });

    window.addEventListener('resize', () => {
      if (!isDrawerViewport() && document.body.classList.contains('dharma-drawer-open')) {
        closeDrawer({ restoreFocus: false });
      }
    }, { passive: true });

    window.addEventListener('chanhphap-vault-updated', () => { void refreshOfflineBadge(); });
    void refreshOfflineBadge();
  }

  function installDrawerGestures() {
    let gesture = null;
    document.addEventListener('touchstart', e => {
      if (!isDrawerViewport() || e.touches.length !== 1) { gesture = null; return; }
      if ($('reader-view-container')?.classList.contains('active') || document.querySelector('dialog[open]')) {
        gesture = null;
        return;
      }
      const t = e.touches[0];
      const isOpen = document.body.classList.contains('dharma-drawer-open');
      if (!isOpen && t.clientX <= 24) {
        gesture = { mode: 'open', x: t.clientX, y: t.clientY };
      } else if (isOpen) {
        gesture = { mode: 'close', x: t.clientX, y: t.clientY };
      } else {
        gesture = null;
      }
    }, { passive: true });

    document.addEventListener('touchend', e => {
      if (!gesture || !e.changedTouches.length) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - gesture.x;
      const dy = t.clientY - gesture.y;
      const mode = gesture.mode;
      gesture = null;
      if (mode === 'open' && dx > 54 && dx > Math.abs(dy) * 1.35) {
        openDrawer();
      } else if (mode === 'close' && dx < -54 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        closeDrawer({ restoreFocus: false });
      }
    }, { passive: true });
  }

  function openCanonsSheet() {
    closeDrawer({ restoreFocus: false });
    const sheet = $('dharma-canons-sheet');
    if (!sheet) return;
    syncCanonsSheetActive(activeTabId);
    if (!sheet.open) sheet.showModal();
  }

  function syncCanonsSheetActive(tabId) {
    const sheet = $('dharma-canons-sheet');
    if (!sheet) return;
    sheet.querySelectorAll('[data-canon-go]').forEach(btn => {
      const isAct = btn.dataset.canonGo === tabId;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-current', isAct ? 'page' : 'false');
    });
  }

  function installBottomNavAndCanonsSheet() {
    const mobileNav = $('dharma-mobile-nav');
    if (!mobileNav) return;

    if (!$('dharma-canons-sheet')) {
      document.body.insertAdjacentHTML('beforeend', `
        <dialog id="dharma-canons-sheet" class="dharma-dialog" aria-labelledby="canons-sheet-title">
          <div class="sheet-drag-handle" aria-hidden="true"><span></span></div>
          <header>
            <div>
              <span class="eyebrow">KHO TÀNG TAM TẠNG</span>
              <h2 id="canons-sheet-title">Chọn Tạng Kinh & Ngoại Tuyến</h2>
            </div>
            <button type="button" id="canons-sheet-close" class="dp-icon" aria-label="Đóng bảng chọn tạng kinh">${icon('close')}</button>
          </header>
          <div class="canons-sheet-grid">
            <button type="button" class="canon-sheet-card" data-canon-go="tang-dai-thua">
              <span class="canon-sheet-icon">${icon('lotus')}</span>
              <span class="canon-sheet-copy">
                <strong>Tạng Kinh Đại Thừa</strong>
                <small>Kinh · Luật · Luận & Thập Nhị Phân Giáo</small>
              </span>
            </button>
            <button type="button" class="canon-sheet-card" data-canon-go="tang-nam-tong">
              <span class="canon-sheet-icon">${icon('canon')}</span>
              <span class="canon-sheet-copy">
                <strong>Tạng Kinh Nam Tông</strong>
                <small>Pāḷi Nikāya Việt dịch & Sách giảng</small>
              </span>
            </button>
            <button type="button" class="canon-sheet-card" data-canon-go="tang-han">
              <span class="canon-sheet-icon">${icon('scroll')}</span>
              <span class="canon-sheet-copy">
                <strong>Hán Tạng Taishō</strong>
                <small>25 Bộ · 2.471 bản Hán – Việt đối chiếu</small>
              </span>
            </button>
            <button type="button" class="canon-sheet-card" data-canon-go="phucminh">
              <span class="canon-sheet-icon">${icon('temple')}</span>
              <span class="canon-sheet-copy">
                <strong>Tủ Sách Chùa Phúc Minh</strong>
                <small>26 ấn bản kinh sách & PDF nguyên bản</small>
              </span>
            </button>
            <button type="button" class="canon-sheet-card canon-offline-wide" data-canon-go="offline">
              <span class="canon-sheet-icon">${icon('offline')}</span>
              <span class="canon-sheet-copy">
                <strong>Kho Kinh & Giọng Đọc AI Ngoại Tuyến</strong>
                <small>Tải về máy để đọc & nghe tắt màn hình khi không có mạng</small>
              </span>
            </button>
          </div>
          <div class="canons-sheet-sources" aria-label="Danh mục nguồn gốc">
            <button type="button" class="r-button" data-canon-go="daithua">62 Bộ Tuyển Tập</button>
            <button type="button" class="r-button" data-canon-go="daitanghan">25 Bộ Hán Tạng</button>
            <button type="button" class="r-button" data-canon-go="daitang">Sách Việt Ngữ</button>
          </div>
        </dialog>
      `);

      const sheet = $('dharma-canons-sheet');
      $('canons-sheet-close').onclick = () => sheet.close();
      sheet.addEventListener('click', e => {
        if (e.target === sheet) {
          const r = sheet.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) sheet.close();
        }
      });
      sheet.querySelectorAll('[data-canon-go]').forEach(btn => {
        btn.onclick = () => {
          sheet.close();
          navigateTarget(btn.dataset.canonGo);
        };
      });
    }

    // Upgrade Bottom Navigation Bar to 5 ergonomic thumb-zone pillars
    const pillars = [
      ['home', 'Khám phá', 'home'],
      ['canons', 'Tạng kinh', 'lotus'],
      ['search', 'Tra cứu', 'search'],
      ['shelf', 'Tủ sách', 'shelf'],
      ['menu', 'Danh mục', 'menu'],
    ];
    mobileNav.innerHTML = pillars.map(([id, label, ic]) => (
      `<button type="button" data-mobile-nav="${id}" aria-label="${label}">` +
      `<span class="mnav-pill" aria-hidden="true">${icon(ic)}</span>` +
      `<span class="mnav-label">${label}</span>` +
      `</button>`
    )).join('');

    mobileNav.querySelector('[data-mobile-nav="home"]').onclick = () => {
      closeDrawer({ restoreFocus: false });
      document.querySelector('dialog[open]')?.close();
      if (activeTabId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigateTarget('home');
      }
    };
    mobileNav.querySelector('[data-mobile-nav="canons"]').onclick = openCanonsSheet;
    mobileNav.querySelector('[data-mobile-nav="search"]').onclick = () => {
      closeDrawer({ restoreFocus: false });
      document.querySelector('dialog[open]')?.close();
      navigateTarget('fulltext');
      requestAnimationFrame(() => $('fulltext-query')?.focus());
    };
    mobileNav.querySelector('[data-mobile-nav="shelf"]').onclick = () => {
      closeDrawer({ restoreFocus: false });
      document.querySelector('dialog[open]')?.close();
      navigateTarget('shelf');
    };
    mobileNav.querySelector('[data-mobile-nav="menu"]').onclick = () => {
      if (document.body.classList.contains('dharma-drawer-open')) {
        closeDrawer({ restoreFocus: false });
      } else {
        openDrawer();
      }
    };

    // Add personal quick sub-navigation pills inside #tab-shelf
    const tabShelf = $('tab-shelf');
    if (tabShelf && !tabShelf.querySelector('.shelf-quick-tabs')) {
      const quickBar = document.createElement('nav');
      quickBar.className = 'shelf-quick-tabs';
      quickBar.setAttribute('aria-label', 'Lối tắt không gian cá nhân');
      const shortcuts = [
        ['shelf', 'Kinh đã lưu', 'shelf'],
        ['listening-history', 'Lịch sử nghe', 'clock'],
        ['daily', 'Khóa tụng mỗi ngày', 'lyrics'],
        ['study', 'Thời khóa tu học', 'study'],
        ['notes', 'Sổ tay ghi chép', 'note'],
      ];
      quickBar.innerHTML = shortcuts.map(([id, text, ic]) => (
        `<button type="button" class="${id === 'shelf' ? 'active' : ''}" data-shelf-jump="${id}">${icon(ic)}<span>${text}</span></button>`
      )).join('');
      quickBar.querySelectorAll('[data-shelf-jump]').forEach(btn => {
        btn.onclick = () => navigateTarget(btn.dataset.shelfJump);
      });
      const shelfAnchor = tabShelf.querySelector('.cp-module-hero, .section-heading');
      if (shelfAnchor) shelfAnchor.after(quickBar);
      else tabShelf.prepend(quickBar);
    }
  }

  function attachSheetSwipeDismiss(el, closeFn) {
    if (!el || el.dataset.sheetBound === 'true') return;
    el.dataset.sheetBound = 'true';
    if (!el.querySelector(':scope > .sheet-drag-handle')) {
      const handle = document.createElement('div');
      handle.className = 'sheet-drag-handle';
      handle.setAttribute('aria-hidden', 'true');
      handle.innerHTML = '<span></span>';
      el.prepend(handle);
    }
    let start = null;
    el.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) { start = null; return; }
      const target = e.target;
      if (target.closest('input[type="range"]')) { start = null; return; }
      const verses = target.closest('#dp-verses');
      if (verses && verses.scrollTop > 4) { start = null; return; }
      const fromHandle = Boolean(target.closest('.sheet-drag-handle, header, .inspector-heading'));
      if (!fromHandle && el.scrollTop > 4) { start = null; return; }
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    el.addEventListener('touchend', e => {
      if (!start || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - start.x;
      const dy = e.changedTouches[0].clientY - start.y;
      start = null;
      if (dy > 72 && dy > Math.abs(dx) * 1.35) {
        closeFn();
      }
    }, { passive: true });
  }

  function installScrollAndSheetGestures() {
    // 1. Smart Collapsible Header when scrolling down on phones
    let lastScrollY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const dy = y - lastScrollY;
        lastScrollY = y;
        if (
          window.innerWidth > 767 ||
          $('reader-view-container')?.classList.contains('active') ||
          document.activeElement === $('global-search')
        ) {
          document.body.classList.remove('dharma-header-compact');
          return;
        }
        if (y < 48 || dy < -9) {
          document.body.classList.remove('dharma-header-compact');
        } else if (y > 96 && dy > 11) {
          document.body.classList.add('dharma-header-compact');
        }
      });
    }, { passive: true });

    $('global-search')?.addEventListener('focus', () => {
      document.body.classList.remove('dharma-header-compact');
    });

    // 2. Mini-Player Drag Handle + Swipe-Up anywhere on bar to expand Now Playing (#dp-now)
    const player = $('persistent-player');
    if (player && !player.querySelector('.dp-mini-handle')) {
      const miniHandle = document.createElement('span');
      miniHandle.className = 'dp-mini-handle';
      miniHandle.setAttribute('aria-hidden', 'true');
      player.prepend(miniHandle);

      let pStart = null;
      player.addEventListener('touchstart', e => {
        if (player.classList.contains('in-reader') || e.touches.length !== 1 || e.target.closest('input[type="range"]')) {
          pStart = null;
          return;
        }
        pStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }, { passive: true });

      player.addEventListener('touchend', e => {
        if (!pStart || !e.changedTouches.length) return;
        const dx = e.changedTouches[0].clientX - pStart.x;
        const dy = pStart.y - e.changedTouches[0].clientY; // positive when swiping UP
        pStart = null;
        if (dy > 38 && dy > Math.abs(dx) * 1.25) {
          window.PersistentPlayer?.openNow?.();
        }
      }, { passive: true });
    }

    // 3. Swipe-down to dismiss on all Dharma Dialogs / Bottom Sheets
    ['dp-options', 'dp-now', 'dharma-canons-sheet', 'dharma-tools-dialog', 'dharma-companion-dialog', 'ds-create-dialog', 'correction-dialog', 'issue-dialog'].forEach(id => {
      const dlg = $(id);
      if (dlg) attachSheetSwipeDismiss(dlg, () => dlg.close());
    });
  }

  function setReaderZen(enable) {
    const reader = $('reader-view-container');
    if (!reader) return;
    reader.classList.toggle('reader-zen-immersive', Boolean(enable));
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }

  function installReaderGestures() {
    const reader = $('reader-view-container');
    const scrollPane = $('reader-scroll');
    if (!reader || !scrollPane) return;

    if (!$('reader-zen-pill')) {
      const zenPill = document.createElement('button');
      zenPill.type = 'button';
      zenPill.id = 'reader-zen-pill';
      zenPill.className = 'reader-zen-pill';
      zenPill.setAttribute('aria-label', 'Hiện lại thanh công cụ đọc kinh');
      zenPill.textContent = '☸ Hiện thanh công cụ';
      zenPill.onclick = () => setReaderZen(false);
      reader.append(zenPill);
    }

    // Add quick A- / A+ row inside Reader Settings sheet on mobile
    const settingsBox = $('reader-settings');
    const fontInput = $('r-font');
    if (settingsBox && fontInput && !settingsBox.querySelector('.reader-mobile-font-row')) {
      const row = document.createElement('div');
      row.className = 'reader-mobile-font-row';
      row.innerHTML = `
        <button type="button" class="r-button" id="reader-sheet-font-down">A− Giảm cỡ</button>
        <span id="reader-sheet-font-val">${fontInput.value || 21}px</span>
        <button type="button" class="r-button" id="reader-sheet-font-up">A+ Tăng cỡ</button>
      `;
      settingsBox.querySelector('.reader-settings-preview')?.after(row);
      const syncVal = () => {
        const el = $('reader-sheet-font-val');
        if (el && fontInput.value) el.textContent = fontInput.value + 'px';
      };
      row.querySelector('#reader-sheet-font-down').onclick = () => { $('reader-font-down')?.click(); syncVal(); };
      row.querySelector('#reader-sheet-font-up').onclick = () => { $('reader-font-up')?.click(); syncVal(); };
      fontInput.addEventListener('input', syncVal);
      requestAnimationFrame(syncVal);
    }

    // Swipe-down dismiss on mobile Reader Inspector sheet
    const inspector = $('reader-inspector');
    if (inspector) {
      attachSheetSwipeDismiss(inspector, () => $('inspector-close')?.click());
    }

    // Tap center for Immersive Zen Mode, tap outer margins in Paged Mode, horizontal swipe in Parts Mode
    let rTouch = null;
    scrollPane.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) { rTouch = null; return; }
      rTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        t: performance.now(),
      };
    }, { passive: true });

    scrollPane.addEventListener('touchend', e => {
      if (!rTouch || !e.changedTouches.length) return;
      const end = e.changedTouches[0];
      const dx = end.clientX - rTouch.x;
      const dy = end.clientY - rTouch.y;
      const dt = performance.now() - rTouch.t;
      rTouch = null;

      if (window.getSelection?.()?.toString()) return;

      // 1. Clean single tap on touch/tablet/mobile
      const isTouchContext = window.innerWidth <= 1023 || window.matchMedia?.('(pointer: coarse)').matches;
      if (isTouchContext && Math.abs(dx) < 12 && Math.abs(dy) < 12 && dt < 290) {
        if (e.target.closest('a, button, summary, input, select, textarea, label, details, .source-note, [role="button"]')) {
          return;
        }
        if (inspector && !inspector.hidden) {
          $('inspector-close')?.click();
          return;
        }
        if ($('reader-toc-toggle')?.getAttribute('aria-expanded') === 'true' && window.innerWidth <= 1023) {
          $('toc-close')?.click();
          return;
        }
        const rect = scrollPane.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const rx = (end.clientX - rect.left) / rect.width;
        const ry = (end.clientY - rect.top) / rect.height;

        if (reader.classList.contains('reader-paged')) {
          if (rx < 0.18) { $('reader-prev')?.click(); return; }
          if (rx > 0.82) { $('reader-next')?.click(); return; }
        }
        if (rx >= 0.24 && rx <= 0.76 && ry >= 0.18 && ry <= 0.82) {
          setReaderZen(!reader.classList.contains('reader-zen-immersive'));
        }
        return;
      }

      // 2. Horizontal swipe in non-paged mode switches sutra section
      if (
        !reader.classList.contains('reader-paged') &&
        Math.abs(dx) > 88 &&
        Math.abs(dx) > Math.abs(dy) * 2.2 &&
        !e.target.closest('table, .comparison-table-wrapper, pre')
      ) {
        (dx < 0 ? $('reader-next') : $('reader-prev'))?.click();
      }
    }, { passive: true });

    // Auto-clear Zen mode when Reader closes
    const obs = new MutationObserver(() => {
      if (!reader.classList.contains('active') && reader.classList.contains('reader-zen-immersive')) {
        reader.classList.remove('reader-zen-immersive');
      }
    });
    obs.observe(reader, { attributes: true, attributeFilter: ['class'] });
  }

  function resolveMobilePillar(tabId) {
    if (document.body.classList.contains('dharma-drawer-open')) return 'menu';
    if (tabId === 'home') return 'home';
    if (['tang-dai-thua', 'tang-nam-tong', 'tang-han', 'phucminh', 'daithua', 'daitanghan', 'daitang', 'offline', 'album'].includes(tabId)) {
      return 'canons';
    }
    if (['fulltext', 'appendix', 'glossary', 'milinda', 'practical'].includes(tabId)) {
      return 'search';
    }
    if (['shelf', 'listening-history', 'daily', 'study', 'paths', 'learning-path', 'roadmap', 'notes'].includes(tabId)) {
      return 'shelf';
    }
    return 'menu';
  }

  function syncBottomNavActive(tabId) {
    const pillar = resolveMobilePillar(tabId);
    document.querySelectorAll('#dharma-mobile-nav [data-mobile-nav]').forEach(btn => {
      const isAct = btn.dataset.mobileNav === pillar;
      btn.classList.toggle('active', isAct);
      if (isAct) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    syncCanonsSheetActive(tabId);
  }

  function onTab(id) {
    if (!id) return;
    activeTabId = id;
    if (tabHistory[tabHistory.length - 1] !== id) {
      tabHistory.push(id);
      if (tabHistory.length > 24) tabHistory.shift();
    }
    document.body.classList.remove('dharma-header-compact');
    syncBottomNavActive(id);
  }

  function handleBackButton() {
    // 1. Open modal dialog / Bottom Sheet
    const openDialog = document.querySelector('dialog[open]');
    if (openDialog) {
      openDialog.close();
      return true;
    }

    // 2. Active Reader layers
    const reader = $('reader-view-container');
    if (reader?.classList.contains('active')) {
      const inspector = $('reader-inspector');
      if (inspector && !inspector.hidden) {
        $('inspector-close')?.click();
        return true;
      }
      if ($('reader-toc-toggle')?.getAttribute('aria-expanded') === 'true' && window.innerWidth <= 1023) {
        $('toc-close')?.click();
        return true;
      }
      if (reader.classList.contains('reader-zen-immersive')) {
        setReaderZen(false);
        return true;
      }
      window.Reader?.close?.();
      return true;
    }

    // 3. Open Off-Canvas Sidebar Drawer
    if (document.body.classList.contains('dharma-drawer-open')) {
      closeDrawer({ restoreFocus: false });
      return true;
    }

    // 4. Previous tab in session stack
    while (tabHistory.length > 1) {
      tabHistory.pop();
      const prev = tabHistory[tabHistory.length - 1];
      if (prev && prev !== activeTabId) {
        navigateTarget(prev);
        return true;
      }
    }

    // 5. Fallback to Home before allowing OS minimize
    if (activeTabId !== 'home') {
      navigateTarget('home');
      return true;
    }
    return false;
  }

  function init() {
    if (initialized) return;
    initialized = true;
    installHeaderControls();
    installSidebarDrawer();
    installDrawerGestures();
    installBottomNavAndCanonsSheet();
    installScrollAndSheetGestures();
    installReaderGestures();
    syncNativeStatusBar();
    onTab(window.appState?.currentTab || 'home');
  }

  window.TouchUX = {
    init,
    onTab,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    openCanonsSheet,
    setReaderZen,
    handleBackButton,
    refreshOfflineBadge,
  };
})();

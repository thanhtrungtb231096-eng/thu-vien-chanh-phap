/**
 * CollectionPlayer — Nghe Kinh Trọn Bộ Theo Danh Mục / Chủ Đề
 * Phát tuần tự toàn bộ kinh trong một thể loại hoặc lộ trình tu học.
 * Hiển thị chi tiết:
 *  - Bộ đếm thời gian nghe thực tế (từng giây)
 *  - Thời gian còn lại dự kiến (cho bài kinh hiện tại và cho toàn bộ danh mục)
 *  - Giờ bắt đầu và giờ hoàn tất dự kiến
 *  - Danh sách phát tuần tự (playlist)
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const getDT = () => (typeof DAI_THUA_DATA !== 'undefined' ? DAI_THUA_DATA : (window.DAI_THUA_DATA || []));
  const getHT = () => (typeof DAI_TANG_HAN_DATA !== 'undefined' ? DAI_TANG_HAN_DATA : (window.DAI_TANG_HAN_DATA || { divisions: [], texts: [] }));

  let playlist = [];    // [{type: 'daithua'|'daitang', id: string, title: string}]
  let current = -1;     // index in playlist
  let active = false;
  let elapsed = 0;      // seconds elapsed total for collection session
  let sutraElapsed = 0; // seconds elapsed for current sutra
  let startTime = null; // Date when started
  let sutraTimes = {};  // {index: seconds} — recorded time per sutra
  let tick = null;       // interval id
  let collectionName = '';
  let waitingForFinish = false;
  let playbackGeneration = 0;

  function fmt(sec) {
    if (isNaN(sec) || sec < 0) sec = 0;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${m}:${String(s).padStart(2, '0')}`;
  }

  function fmtDuration(sec) {
    if (isNaN(sec) || sec <= 0) return '0:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `~${h}h ${String(m).padStart(2, '0')}p`;
    if (m > 0) return `~${m}p ${String(s).padStart(2, '0')}s`;
    return `~${s}s`;
  }

  function fmtClock(date) {
    if (!date) return '--:--';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  function createUI() {
    if ($('collection-player')) return;
    const panel = document.createElement('div');
    panel.id = 'collection-player';
    panel.className = 'collection-player is-compact';
    panel.hidden = true;
    panel.innerHTML = `
      <div class="cp-header">
        <span class="cp-icon" aria-hidden="true">${window.LibraryArt.svg('headphones')}</span>
        <div class="cp-info">
          <div class="cp-title-row">
            <strong id="cp-collection-name">Trọn Bộ</strong>
            <span class="cp-badge" id="cp-track-info">Kinh 0 / 0</span>
          </div>
          <div class="cp-clock-row" id="cp-clock">Bắt đầu --:-- · Hoàn tất dự kiến ~--:--</div>
        </div>
        <div class="cp-time-grid">
          <div class="cp-time-box">
            <div class="cp-time-label">TỔNG ĐÃ NGHE</div>
            <div class="cp-timer" id="cp-timer">0:00</div>
          </div>
          <div class="cp-time-box cp-time-remain-box">
            <div class="cp-time-label">CÒN LẠI (DỰ KIẾN)</div>
            <div class="cp-remaining" id="cp-remaining">~--:--</div>
          </div>
        </div>
      </div>

      <div class="cp-now-playing">
        <div class="cp-now-left">
          <span class="cp-live-indicator">♫ Đang đọc:</span>
          <strong id="cp-now-title">—</strong>
        </div>
        <div class="cp-sutra-timing">
          <span id="cp-sutra-chunk">Đoạn 0/0</span>
          <span class="cp-sutra-time" id="cp-sutra-time">Đã nghe 0:00 · Còn lại ~0:00</span>
        </div>
      </div>

      <div class="cp-progress-group">
        <div class="cp-progress-bar cp-overall-bar" title="Tiến trình trọn bộ"><div class="cp-progress-fill" id="cp-progress-fill"></div></div>
        <div class="cp-progress-bar cp-sutra-bar" title="Tiến trình kinh hiện tại"><div class="cp-progress-fill" id="cp-sutra-progress-fill"></div></div>
      </div>

      <div class="cp-controls">
        <button class="r-button" id="cp-prev" title="Kinh trước">⏮ Kinh trước</button>
        <button class="r-primary" id="cp-play">⏸ Tạm dừng</button>
        <button class="r-button" id="cp-next" title="Kinh tiếp">Kinh tiếp ⏭</button>
        <button class="r-button" id="cp-toggle-list" title="Danh sách bộ kinh">☰ Danh sách (0)</button>
        <button class="r-button" id="cp-expand" aria-expanded="false">Chi tiết</button><button class="r-button" id="cp-close" title="Đóng trình phát trọn bộ">✕ Đóng</button>
      </div>

      <div class="cp-playlist" id="cp-playlist" hidden></div>`;
    // Share the reader flex column so both players reserve space for the text.
    document.querySelector('.reader-bottombar').before(panel);
    $('cp-expand').onclick = () => {
      const compact = panel.classList.toggle('is-compact');
      $('cp-expand').setAttribute('aria-expanded', String(!compact));
      $('cp-expand').textContent = compact ? 'Chi tiết' : 'Thu gọn';
    };

    $('cp-prev').onclick = () => jump(current - 1);
    $('cp-next').onclick = () => jump(current + 1);
    $('cp-play').onclick = togglePlay;
    $('cp-close').onclick = stop;
    $('cp-toggle-list').onclick = () => {
      const pl = $('cp-playlist');
      pl.hidden = !pl.hidden;
      renderPlaylist();
    };
  }

  function estimateSutraSec() {
    const ab = window.Audiobook?.state;
    const count = ab?.count || 12;
    return count * 22; // ~22 seconds per chunk in Vietnamese neural TTS
  }

  function estimateRemainingSec() {
    const ab = window.Audiobook?.state;
    const count = ab?.count || 12;
    const idx = ab?.index || 0;
    const curRemaining = Math.max(0, (count - idx) * 22);

    // Average time per completed sutra
    const completedCount = current;
    let avgPast = 0;
    if (completedCount > 0) {
      let sum = 0;
      for (let i = 0; i < completedCount; i++) sum += (sutraTimes[i] || 480);
      avgPast = sum / completedCount;
    } else {
      avgPast = 480; // default 8 mins per sutra
    }

    const remainingSutras = Math.max(0, playlist.length - current - 1);
    const totalRemaining = curRemaining + (remainingSutras * avgPast);
    return { curRemaining, totalRemaining };
  }

  function paint() {
    if (!$('collection-player')) return;
    $('collection-player').hidden = !active;
    $('reader-view-container').classList.toggle('collection-active', active);
    if (!active) return;

    $('cp-collection-name').textContent = collectionName;
    $('cp-track-info').textContent = `Kinh ${current + 1} / ${playlist.length}`;
    $('cp-now-title').textContent = playlist[current]?.title || '—';
    $('cp-timer').textContent = fmt(elapsed);

    // Timing & calculations
    const { curRemaining, totalRemaining } = estimateRemainingSec();
    $('cp-remaining').textContent = fmtDuration(totalRemaining);

    const ab = window.Audiobook?.state;
    const chunkIdx = (ab?.index ?? 0) + 1;
    const chunkTotal = ab?.count || 1;
    $('cp-sutra-chunk').textContent = `Đoạn ${Math.min(chunkIdx, chunkTotal)} / ${chunkTotal}`;
    $('cp-sutra-time').textContent = `Đã nghe ${fmt(sutraElapsed)} · Còn lại ${fmtDuration(curRemaining)}`;

    // Clock times
    if (startTime) {
      const estEnd = new Date(Date.now() + totalRemaining * 1000);
      $('cp-clock').textContent = `Bắt đầu ${fmtClock(startTime)} · Hoàn tất dự kiến ~${fmtClock(estEnd)}`;
    }

    // Overall progress (% of sutras in collection)
    const overallPct = playlist.length ? Math.round(((current) / playlist.length) * 100) : 0;
    $('cp-progress-fill').style.width = `${overallPct}%`;

    // Sutra progress (% of chunks in current sutra)
    const sutraPct = chunkTotal > 0 ? Math.round((chunkIdx / chunkTotal) * 100) : 0;
    $('cp-sutra-progress-fill').style.width = `${sutraPct}%`;

    // Controls state
    $('cp-prev').disabled = current <= 0;
    $('cp-next').disabled = current >= playlist.length - 1;
    $('cp-toggle-list').textContent = `☰ Danh sách (${playlist.length} kinh)`;

    const audioState = window.Audiobook?.state?.status;
    const isPlaying = audioState === 'playing' || audioState === 'loading';
    $('cp-play').textContent = isPlaying ? '⏸ Tạm dừng' : '▶ Tiếp tục';
    const statusLabel = { playing: 'Đang đọc:', loading: 'Đang tải:', paused: 'Tạm dừng:', error: 'Chưa phát được:', idle: 'Sẵn sàng:' }[audioState] || 'Sẵn sàng:';
    document.querySelector('.cp-live-indicator').textContent = statusLabel;

    // Update playlist if open
    renderPlaylist();
  }

  function renderPlaylist() {
    const pl = $('cp-playlist');
    if (!pl || pl.hidden) return;
    pl.innerHTML = playlist.map((item, i) => {
      const isCurrent = i === current;
      const isDone = i < current;
      const dur = sutraTimes[i];
      let statusText = '';
      if (isDone) {
        statusText = `<span class="cp-pl-status is-done">✓ Đã nghe (${fmt(dur || 0)})</span>`;
      } else if (isCurrent) {
        statusText = `<span class="cp-pl-status is-current">♫ Đang nghe (${fmt(sutraElapsed)})</span>`;
      } else {
        statusText = `<span class="cp-pl-status is-pending">Chưa phát (~8p)</span>`;
      }

      return `<div class="cp-pl-item ${isCurrent ? 'cp-pl-active' : ''} ${isDone ? 'cp-pl-done' : ''}">
        <span class="cp-pl-num">${i + 1}</span>
        <div class="cp-pl-col">
          <span class="cp-pl-title">${item.title}</span>
          ${statusText}
        </div>
        ${!isCurrent ? `<button class="cp-pl-jump" data-idx="${i}" title="Chuyển đến kinh này">▶ Phát</button>` : '<span class="cp-pl-playing">♫</span>'}
      </div>`;
    }).join('');

    pl.querySelectorAll('.cp-pl-jump').forEach(btn => {
      btn.onclick = () => jump(Number(btn.dataset.idx));
    });
  }

  function startTimer() {
    if (tick) return;
    tick = setInterval(() => {
      const status = window.Audiobook?.state?.status;
      // Increment timer when audio is playing or actively streaming
      if (status === 'playing' || status === 'loading') {
        elapsed++;
        sutraElapsed++;
      }
      paint();
    }, 1000);
  }

  function stopTimer() {
    if (tick) { clearInterval(tick); tick = null; }
  }

  /** Start listening to a collection of sutras */
  function start(name, items) {
    if (!items || !items.length) return;
    createUI();
    playlist = items;
    collectionName = name;
    current = 0;
    elapsed = 0;
    sutraElapsed = 0;
    startTime = new Date();
    sutraTimes = {};
    active = true;
    waitingForFinish = false;
    paint();
    startTimer();
    playCurrentSutra();
  }

  async function playCurrentSutra() {
    if (current < 0 || current >= playlist.length) { stop(); return; }
    const generation = ++playbackGeneration;
    const item = playlist[current];
    if (window.DharmaPlayerStore) {
      waitingForFinish = true; sutraElapsed = 0;
      const ready = await window.DharmaPlayerStore.playItem(item, { collection: true, restart: true });
      if (!active || generation !== playbackGeneration) return;
      waitingForFinish = ready;
      paint(); return;
    }
    waitingForFinish = true;
    sutraElapsed = 0;
    paint();

    const dtList = getDT();
    const htList = getHT();
    const data = item.type === 'ebooks' ? DAI_TANG_KINH_DATA.find(x => x.id === item.id) : item.type === 'phucminh' ? PHUC_MINH_DATA.find(x => x.id === item.id) : item.type === 'daithua'
      ? dtList.find(x => x.id === item.id)
      : htList.texts?.find(x => x.id === item.id);

    if (!data) { advance(); return; }

    window.Reader.toggleAudio(false);
    await window.Reader.open({ type: item.type, data }, 'viet');
    if (!active || generation !== playbackGeneration) return;
    if (window.Reader.state.ready) {
      await window.Audiobook.start();
    }
    paint();
  }

  function advance() {
    if (!active) return;
    if (current >= 0) sutraTimes[current] = sutraElapsed;
    sutraElapsed = 0;
    if (current + 1 < playlist.length) {
      current++;
      playCurrentSutra();
    } else {
      waitingForFinish = false;
      if (window.Audiobook?.state.repeatMode === 'all') { current = 0; playCurrentSutra(); return; }
      active = false; stopTimer();
      paint();
      announce('Đã nghe hết trọn bộ "' + collectionName + '". Tổng thời gian nghe: ' + fmt(elapsed) + '. Nguyện đem công đức này hồi hướng cho tất cả chúng sanh.');
    }
  }

  function jump(idx) {
    if (idx < 0 || idx >= playlist.length) return;
    if (current >= 0) sutraTimes[current] = sutraElapsed;
    sutraElapsed = 0;
    window.Audiobook?.stop();
    current = idx;
    playCurrentSutra();
  }

  function togglePlay() {
    const audioState = window.Audiobook?.state?.status;
    if (audioState === 'playing' || audioState === 'loading') {
      window.Audiobook.pause();
    } else if (audioState === 'paused') {
      window.Audiobook.play();
    } else {
      playCurrentSutra();
    }
    setTimeout(paint, 100);
  }

  function stop() {
    playbackGeneration++;
    window.DharmaPlayerStore?.cancel();
    window.Audiobook?.stop();
    stopTimer();
    active = false;
    waitingForFinish = false;
    if ($('collection-player')) $('collection-player').hidden = true;
    $('reader-view-container').classList.remove('collection-active');
  }

  function announce(msg) {
    if ($('audio-status')) $('audio-status').textContent = msg;
  }

  // Listen for audiobook finishing a sutra to auto-advance
  window.addEventListener('sutra-finished', e => {
    if (!active || !waitingForFinish) return;
    const item = playlist[current];
    if (e.detail.key !== item?.type + ':' + item?.id) return;
    waitingForFinish = false;
    advance();
  });

  /** Build playlist from Đại Thừa category (danh mục) */
  function fromDaiThuaCategory(categoryCode) {
    if (!categoryCode || categoryCode === 'all') return { name: '', items: [] };
    const dtList = getDT();
    const items = dtList
      .filter(d => d.categoryCode === categoryCode && d.files && d.files.vietMd)
      .map(d => ({ type: 'daithua', id: d.id, title: d.title }));
    const catObj = dtList.find(d => d.categoryCode === categoryCode);
    const catName = catObj?.categoryName?.split('—')[0]?.trim() || 'Đại Thừa';
    return { name: `Trọn bộ ${catName} (${items.length} kinh)`, items };
  }

  /** Build playlist from Hán Tạng division (bộ kinh) */
  function fromHanTangDivision(divisionCode) {
    if (!divisionCode || divisionCode === 'all') return { name: '', items: [] };
    const ht = getHT();
    const div = ht.divisions?.find(d => d.code === divisionCode);
    const items = (ht.texts || [])
      .filter(t => t.division === divisionCode && t.hasViet && t.vietFile)
      .map(t => ({ type: 'daitang', id: t.id, title: t.vietTitle || t.title }));
    const name = `Trọn bộ ${div?.name || divisionCode} (${items.length} kinh)`;
    return { name, items };
  }

  /** Build playlist from reading path */
  function fromReadingPath(pathId) {
    const path = window.SutraContext?.getPaths().find(p => p.id === pathId);
    if (!path) return { name: '', items: [] };
    const dtList = getDT();
    const htList = getHT();
    const items = path.sutras.map(s => {
      const dt = dtList.find(x => x.taishoId === s.id);
      const ht = !dt && htList.texts?.find(x => x.id === s.id);
      const data = dt || ht;
      if (!data) return null;
      return { type: dt ? 'daithua' : 'daitang', id: data.id, title: data.vietTitle || data.title };
    }).filter(Boolean);
    return { name: path.name, items };
  }

  /** Direct helper to launch from category code */
  function startFromCategory(catCode) {
    const { name, items } = fromDaiThuaCategory(catCode);
    if (items.length) {
      start(name, items);
    } else {
      alert('Danh mục này chưa có bản dịch tiếng Việt hoàn tất để nghe.');
    }
  }

  /** Direct helper to launch from reading path id */
  function startFromReadingPath(pathId) {
    const { name, items } = fromReadingPath(pathId);
    if (items.length) {
      start(name, items);
    } else {
      alert('Lộ trình này chưa có bản dịch hoàn tất để nghe.');
    }
  }

  window.CollectionPlayer = {
    start, stop, jump, advance,
    fromDaiThuaCategory, fromHanTangDivision, fromReadingPath,
    startFromCategory, startFromReadingPath,
    get isActive() { return active; },
    get state() { return { active, current, total: playlist.length, elapsed, collectionName, playlist: playlist.slice() }; }
  };
})();

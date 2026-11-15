(() => {
  'use strict';
  const $ = id => document.getElementById(id), P = window.DharmaPlayerStore;
  const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icons = {
    play: '<path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none"/>', pause: '<path d="M8 5v14M16 5v14" stroke-width="4"/>',
    next: '<path d="m5 5 11 7-11 7Z"/><path d="M19 5v14"/>', prev: '<path d="m19 5-11 7 11 7Z"/><path d="M5 5v14"/>',
    repeat: '<path d="m16 2 4 4-4 4M4 11V9a3 3 0 0 1 3-3h13M8 22l-4-4 4-4m12-1v2a3 3 0 0 1-3 3H4"/>',
    restart: '<path d="M3 4v6h6M3 10a9 9 0 1 1 1 8"/>',
    book: '<path d="M12 5v16M3 3h4a5 5 0 0 1 5 2 5 5 0 0 1 5-2h4v16h-4a5 5 0 0 0-5 2 5 5 0 0 0-5-2H3Z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    volume: '<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    lyrics: '<path d="M4 4h16v13H8l-4 4V4Zm4 4h8m-8 5h5"/>', queue: '<path d="M3 5h17M3 10h17M3 15h10m3 0 5 3-5 3Z"/>',
    settings: '<path d="M5 3v5m0 4v9M12 3v10m0 4v4M19 3v2m0 4v12M2 8h6m1 9h6m1-12h6"/>', expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    home: '<path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3V10Z"/>', search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
    shelf: '<path d="M3 4h5v16H3Zm8 0h4v16h-4Zm7 1 3 14"/>', compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
    note: '<path d="M12 4H4v16h16v-8M9 15l1-4L19 2l3 3-9 9-4 1Z"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    lotus: '<path d="M12 4c-2.5 3.2-3 6.8 0 10 3-3.2 2.5-6.8 0-10Z"/><path d="M12 14c-3.8-.5-6.8-3.3-7.5-7 3.7.4 6.2 2.8 7.5 7Zm0 0c3.8-.5 6.8-3.3 7.5-7-3.7.4-6.2 2.8-7.5 7Z"/><path d="M5 18c4.2 1.8 9.8 1.8 14 0"/>',
    scroll: '<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 8h7M8 12h7M8 16h4"/>',
    temple: '<path d="M12 3 4 8h16L12 3Z"/><path d="M6 8v9M10 8v9M14 8v9M18 8v9M3 17h18M2 20h20"/>',
    canon: '<path d="M12 3c4.5 3.5 7 7.5 7 11a7 7 0 0 1-14 0c0-3.5 2.5-7.5 7-11Z"/><path d="M12 10v11"/>',
    offline: '<path d="M12 3v11m0 0-4-4m4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    study: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18M8 14h3m2 0h3"/>'
  };
  function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.play}</svg>`; }
  function control(id, label, name, cls = '') { return `<button id="${id}" class="dp-icon ${cls}" title="${label}" aria-label="${label}">${icon(name)}</button>`; }
  function fmt(s) { return `${Math.floor((s || 0) / 60)}:${String(Math.floor((s || 0) % 60)).padStart(2, '0')}`; }
  let lyricKey = '', lyricStart = -1, lastIndex = -1, captured = null, noteSignature = '', contextKey = '', queueSignature = '';
  let audioContext, rainSource, rainGain, lastVolume = 1;
  let lastMessage = '', noticeTimer;
  let glossaryText = '';
  let readerExpanded = false, readerMounted = false;
  const compactReader = matchMedia('(max-width: 767px)');
  function init() {
    document.body.insertAdjacentHTML('beforeend', `
      <section id="persistent-player" aria-label="Trình phát kinh" data-player-surface="shared">
        <div class="dp-meta"><button id="dp-cover" class="dp-cover" aria-label="Mở màn hình đang nghe">${LibraryArt.svg('lotus')}</button><div class="dp-title-wrap"><button id="dp-title">Chọn một bản kinh để nghe</button><span id="dp-subtitle">Lắng nghe. Suy ngẫm. Thực hành.</span></div>${control('dp-save', 'Lưu kinh vào tủ sách', 'heart')}</div>
        <div class="dp-center"><div class="dp-controls">${control('dp-repeat', 'Lặp: tắt', 'repeat')}${control('dp-prev', 'Đoạn trước', 'prev')}<button id="dp-back" class="dp-icon dp-seconds" aria-label="Lùi 10 giây trong đoạn hiện tại">−10</button>${control('dp-play', 'Phát kinh', 'play', 'dp-play')}<button id="dp-forward" class="dp-icon dp-seconds" aria-label="Tiến 10 giây trong đoạn hiện tại">+10</button>${control('dp-next', 'Đoạn sau hoặc kinh tiếp theo', 'next')}<button id="dp-ab" class="dp-icon dp-ab" aria-label="Đánh dấu đoạn bắt đầu A">A↔B</button></div><div class="dp-timeline"><span id="dp-time">0:00</span><input id="dp-seek" type="range" min="0" max="1" value="0" step="0.1" aria-label="Thời gian trong đoạn đang nghe"><span id="dp-duration">0:00</span></div></div>
        <div class="dp-tools">${control('dp-lyrics', 'Lời kinh đồng bộ', 'lyrics')}${control('dp-queue', 'Hàng đợi', 'queue')}${control('dp-settings', 'Giọng đọc, tốc độ và hẹn giờ', 'settings')}${control('dp-mute', 'Tắt âm', 'volume')}${control('dp-expand', 'Không gian tọa thiền (F)', 'expand')}</div>
      </section>
      <dialog id="dp-options" class="dharma-dialog" aria-labelledby="dp-options-title"><header><div><span class="eyebrow">NHỊP ĐỌC CỦA BẠN</span><h2 id="dp-options-title">Tùy chỉnh nghe kinh</h2></div>${control('dp-options-close', 'Đóng tùy chỉnh', 'close')}</header><div class="dp-options-grid">
        <label>Số biến tụng<select id="dp-mala"><option value="0">Không giới hạn số biến</option><option value="3">3 biến</option><option value="7">7 biến</option><option value="21">21 biến</option><option value="108">108 biến</option></select></label>
        <label>Âm nền mưa nhẹ<input id="dp-rain" type="range" min="0" max="0.4" step="0.01" value="0" aria-label="Âm lượng mưa nền"></label><button id="dp-bell" class="r-button">Thỉnh một tiếng chuông</button></div><p class="dp-help">Thanh thời gian điều khiển đoạn hiện tại. A–B lặp từ đoạn A đến hết đoạn B; số biến áp dụng cho vùng lặp hoặc toàn bản kinh. Giọng thiết bị không hỗ trợ tua theo giây.</p><p id="dp-service-note" class="dp-help"></p><button id="dp-retry" class="r-button">Kết nối lại giọng đọc</button></dialog>
      <dialog id="dp-now" class="dharma-dialog dp-now" aria-labelledby="dp-now-title"><header><div><span class="eyebrow">KHÔNG GIAN THÍNH PHÁP</span><h2 id="dp-now-title">Lời kinh</h2><p id="dp-now-meta"></p></div>${control('dp-now-close', 'Thu nhỏ màn hình nghe', 'close')}</header><div class="dp-now-art" aria-hidden="true">${LibraryArt.svg('lotus')}</div><div id="dp-verses" class="dp-verses" aria-label="Lời kinh theo đoạn"></div><footer>${control('dp-now-prev', 'Đoạn trước', 'prev')}${control('dp-now-play', 'Phát hoặc tạm dừng', 'play', 'dp-play')}${control('dp-now-next', 'Đoạn sau', 'next')}<button id="dp-now-note" class="r-button">Ghi chú</button><span id="dp-now-position"></span></footer></dialog>
      <div id="dharma-notice" role="status" aria-live="polite" hidden><span id="dp-notice-text"></span><div id="dp-notice-actions" hidden><button id="dp-notice-retry" class="r-primary">Thử lại</button><button id="dp-notice-device" class="r-button" hidden>Dùng giọng thiết bị</button></div></div>`);
    $('dp-options').querySelector('.dp-options-grid').insertAdjacentHTML('beforeend', '<label>Âm lượng giọng đọc<input id="dp-options-volume" type="range" min="0" max="1" step="0.05" value="1"></label><label>Chế độ lặp<select id="dp-options-repeat"><option value="off">Không lặp</option><option value="all">Lặp trọn bộ</option><option value="one">Lặp một kinh</option></select></label>');
    $('dp-options').insertAdjacentHTML('beforeend', '<button id="dp-stop" class="r-button">Kết thúc phiên nghe</button>');
    $('dp-repeat').insertAdjacentHTML('beforebegin', control('dp-restart', 'Nghe lại bản kinh từ đầu', 'restart'));
    $('dp-now').querySelector('footer').insertAdjacentHTML('beforeend', '<button id="dp-now-restart" class="r-button">Nghe lại từ đầu</button>');
    $('dp-options').insertAdjacentHTML('beforeend', '<button id="dp-restart-chunk" class="r-button">Nghe lại đoạn hiện tại</button>');
    // Keep one settings form and one transport. Move these exact nodes between contexts.
    const settings = $('reader-audio-settings'), grid = $('dp-options').querySelector('.dp-options-grid');
    for (const name of ['sleep', 'rate', 'voice']) {
      grid.prepend($('audio-' + name).closest('label'));
    }
    const chapters = document.createElement('details'); chapters.className = 'dp-chapters';
    chapters.innerHTML = '<summary>Phẩm & vị trí nghe</summary>'; chapters.append(settings); settings.hidden = false;
    $('dp-options').querySelector('.dp-help').before(chapters);
    $('dp-options').querySelector('.dp-help').textContent = 'Thanh thời gian tua trong đoạn hiện tại. Chuyển đoạn nghe và lật trang đọc là hai thao tác riêng.';
    const advanced = document.createElement('div'); advanced.className = 'dp-advanced'; advanced.setAttribute('role', 'group'); advanced.setAttribute('aria-label', 'Nghe lại, lặp, lưu kinh và âm lượng');
    for (const [id, label] of [['dp-restart', 'Nghe lại từ đầu'], ['dp-repeat', 'Lặp'], ['dp-ab', 'Lặp A–B'], ['dp-save', 'Lưu kinh'], ['dp-mute', 'Âm thanh'], ['dp-expand', 'Lời kinh']]) {
      const button = $(id); button.classList.add('dp-advanced-button');
      if (id === 'dp-ab') button.innerHTML = icon('repeat');
      const text = document.createElement('span'); text.className = 'dp-action-label'; text.textContent = label;
      button.append(text); advanced.append(button);
    }
    $('dp-options').querySelector('.dp-options-grid').after(advanced);
    const extras=document.createElement('details');extras.id='dp-extra-options';extras.className='dp-chapters';
    const summary=document.createElement('summary');summary.textContent='Số biến tụng và âm nền';
    const extraGrid=document.createElement('div');extraGrid.className='dp-options-grid';
    for(const id of ['dp-mala','dp-rain'])extraGrid.append($(id).closest('label'));
    extraGrid.append($('dp-bell'));extras.append(summary,extraGrid);advanced.after(extras);
    $('dp-options').insertAdjacentHTML('beforeend', '<button id="dp-options-queue" class="r-button">Hàng đợi nghe</button>');
    $('dp-options-queue').onclick = () => { $('dp-options').close(); showCompanion('queue'); };
    $('dp-settings').insertAdjacentHTML('beforeend', '<span>Tùy chọn</span>');
    $('persistent-player').querySelector('.dp-tools').insertAdjacentHTML('afterbegin', control('dp-read', 'Trở lại bản đọc', 'book'));
    $('dp-read').insertAdjacentHTML('beforeend', '<span>Bản đọc</span>');
    $('dp-read').onclick = returnToReader;
    $('dp-settings').setAttribute('aria-haspopup', 'dialog'); $('dp-settings').setAttribute('aria-controls', 'dp-options');
    const readerTools = $('reader-listening-tools'); readerTools.hidden = false; readerTools.className = 'dp-reader-tools';
    $('persistent-player').querySelector('.dp-tools').prepend(readerTools);
    const readingNav = document.querySelector('.reader-footer-inner'); readingNav.classList.add('dp-reading-nav'); $('persistent-player').prepend(readingNav);
    $('persistent-player').querySelector('.dp-center').insertAdjacentHTML('afterbegin', '<div id="dp-reader-status" class="dp-reader-status"></div>');
    $('dp-options').querySelector('header > div').insertAdjacentHTML('beforeend', '<p id="dp-options-book" class="dp-help"></p>');
    const optionFollow = document.createElement('div'); optionFollow.id = 'dp-option-follow'; grid.append(optionFollow);
    optionFollow.append($('audio-follow').closest('label'));
    const optionReader = document.createElement('div'); optionReader.id = 'dp-option-reader'; optionReader.hidden = true;
    grid.before(optionReader);
    compactReader.addEventListener('change', placeReaderActions);
    $('dp-restart').onclick = $('dp-now-restart').onclick = () => Audiobook.restart();
    $('dp-restart-chunk').onclick = () => { Audiobook.seekChunk(Audiobook.state.index, 0); $('dp-options').close(); };
    $('dp-now').querySelector('footer').insertAdjacentHTML('beforeend', '<button id="dp-now-settings" class="r-button">Tùy chỉnh</button><button id="dp-now-queue" class="r-button">Hàng đợi</button><button id="dp-now-ab" class="r-button">Đánh dấu A</button>');
    $('dp-now-settings').onclick = () => { $('dp-now').close(); syncOptions(); $('dp-options').showModal(); };
    $('dp-now-queue').onclick = () => { $('dp-now').close(); showCompanion('queue'); };
    $('dp-now-ab').onclick = () => Audiobook.toggleRepeat();
    $('dp-options-repeat').onchange = e => Audiobook.setRepeat(e.target.value, $('dp-mala').value);
    $('dp-options-volume').oninput = e => Audiobook.setVolume(e.target.value);
    $('dp-stop').onclick = () => { if (CollectionPlayer.isActive) CollectionPlayer.stop(); P.cancel(); Audiobook.stop(); setRain(0); $('dp-rain').value = '0'; $('dp-options').close(); };
    $('dp-play').onclick = () => P.toggle();
    $('dp-prev').onclick = $('dp-now-prev').onclick = () => Audiobook.seekChunk(Audiobook.state.index - 1, 0, ['playing', 'loading'].includes(Audiobook.state.status));
    $('dp-next').onclick = $('dp-now-next').onclick = () => P.next();
    $('dp-now-play').onclick = () => P.toggle();
    $('dp-back').onclick = () => Audiobook.seekTime(Audiobook.state.currentTime - 10);
    $('dp-forward').onclick = () => Audiobook.seekTime(Audiobook.state.currentTime + 10);
    $('dp-seek').oninput = e => Audiobook.seekTime(Number(e.target.value));
    $('dp-mute').onclick = () => { const volume = Audiobook.state.volume; if (volume) lastVolume = volume; Audiobook.setVolume(volume ? 0 : lastVolume); };
    $('dp-repeat').onclick = () => { const modes = ['off', 'all', 'one']; Audiobook.setRepeat(modes[(modes.indexOf(Audiobook.state.repeatMode) + 1) % 3], $('dp-mala').value); };
    $('dp-ab').onclick = () => Audiobook.toggleRepeat();
    $('dp-save').onclick = P.favorite;
    $('dp-cover').onclick = $('dp-title').onclick = $('dp-lyrics').onclick = openNow;
    $('dp-expand').onclick = () => { $('dp-options').close(); openNow(); };
    $('dp-expand').setAttribute('aria-label', 'Lời kinh đồng bộ (F)');
    $('dp-queue').onclick = () => showCompanion('queue');
    $('dp-settings').onclick = openOptions;
    for (const id of ['options', 'now']) {
      $(`dp-${id}-close`).onclick = () => $(`dp-${id}`).close();
      $(`dp-${id}`).addEventListener('click', e => { if (e.target === e.currentTarget) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close(); } });
    }
    $('dp-mala').onchange = e => Audiobook.setRepeat(Audiobook.state.repeatMode, e.target.value);
    $('dp-retry').onclick = $('dp-notice-retry').onclick = () => P.retry();
    $('dp-notice-device').onclick = () => { P.message(''); Audiobook.useDeviceVoice(); };
    $('dp-bell').onclick = () => window.zenBell?.ring(432, 5);
    $('dp-rain').oninput = e => setRain(Number(e.target.value));
    $('dp-now-note').onclick = () => { $('dp-now').close(); showCompanion('notes'); $('dc-note').focus(); };
    let touchY = 0;
    $('dp-now').addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
    $('dp-now').addEventListener('touchend', e => { if (e.changedTouches[0].clientY - touchY > 110 && !e.target.closest('#dp-verses')) $('dp-now').close(); }, { passive: true });
    $('dp-cover').addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
    $('dp-cover').addEventListener('touchend', e => { if (touchY - e.changedTouches[0].clientY > 50) openNow(); }, { passive: true });
    document.addEventListener('keydown', e => {
      const modal = document.querySelector('dialog[open]');
      if(modal&&e.key==='Tab'){
        const nodes=[...modal.querySelectorAll('button,input,textarea,select,a[href],summary,[tabindex="0"]')].filter(n=>n.checkVisibility()&&!n.disabled&&n.tabIndex>=0);
        const first=nodes[0],last=nodes.at(-1),active=document.activeElement;
        if(!modal.contains(active)||e.shiftKey&&active===first){e.preventDefault();(e.shiftKey?last:first)?.focus();}
        else if(!e.shiftKey&&active===last){e.preventDefault();first?.focus();}
        e.stopImmediatePropagation();return;
      }
      if (modal && modal.id !== 'dp-now') { e.stopImmediatePropagation(); return; }
      if (e.target.matches('input, textarea, select, [contenteditable="true"]')) return;
      const dialog = document.querySelector('dialog[open]');
      if (dialog && dialog.id !== 'dp-now') return;
      if (e.code === 'Space' && (e.target === document.body || e.target.closest('#dp-now, #persistent-player')) && e.target.tagName !== 'BUTTON') { e.preventDefault(); e.stopImmediatePropagation(); P.toggle(); }
      if (!e.ctrlKey && !e.metaKey && !e.altKey && ['f', 'n'].includes(e.key.toLowerCase())) {
        e.preventDefault(); e.stopImmediatePropagation();
        if (e.key.toLowerCase() === 'f') $('dp-now').open ? $('dp-now').close() : openNow();
        else { if ($('dp-now').open) $('dp-now').close(); showCompanion('notes'); $('dc-note').focus(); }
      }
      if (dialog) e.stopImmediatePropagation();
    }, true);
    P.subscribe(paint);
    mountReader($('reader-view-container').classList.contains('active'));
  }
  function setRain(volume) {
    if (!volume) { rainSource?.stop(); rainSource = null; return; }
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); audioContext.resume();
      if (!rainSource) {
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate), samples = buffer.getChannelData(0); let previous = 0;
        for (let i = 0; i < samples.length; i++) { previous = (previous + (Math.random() * 2 - 1) * .02) / 1.02; samples[i] = previous * 3.5; }
        rainSource = audioContext.createBufferSource(); rainSource.buffer = buffer; rainSource.loop = true;
        rainGain = audioContext.createGain(); rainSource.connect(rainGain).connect(audioContext.destination); rainSource.start();
      }
      rainGain.gain.setTargetAtTime(volume, audioContext.currentTime, .1);
    } catch { P.message('Trình duyệt này chưa hỗ trợ âm thanh nền.'); }
  }
  function syncOptions() {
    $('dp-options-book').textContent = P.state.item?.title || 'Chọn một bản kinh để bắt đầu';
    $('dp-service-note').textContent = '';
    $('dp-options-repeat').value = Audiobook.state.repeatMode;
    $('dp-options-volume').value = Audiobook.state.volume;
  }
  function openOptions() { syncOptions(); if (!$('dp-options').open) $('dp-options').showModal(); }
  function openReading(ref) {
    const item = P.resolve(ref); if (!item) return;
    if ($('dharma-companion-dialog').open) $('dharma-companion-dialog').close();
    return LibraryUI.open(item.type, item.id);
  }
  async function returnToReader() {
    const item = P.state.item;
    if (!item || !Reader.path(item, 'viet')) return;
    const playback = Audiobook.state;
    const segment = playback.key === item.key && !playback.recorded ? Audiobook.segments[playback.index] : null;
    const anchor = segment?.block ? { block: segment.block, textOffset: segment.sourceOffset || 0 } : null;
    await Reader.open(item, 'viet', anchor);
    if (Reader.state.ready && Reader.state.key === item.key) $('reader-scroll').focus({ preventScroll: true });
  }
  function placeReaderActions() {
    const inDock = readerMounted && !compactReader.matches;
    (inDock ? $('reader-listening-tools') : $('dp-option-reader')).append($('reader-hear-visible'));
    $('dp-option-reader').hidden = !readerMounted || inDock;
    const restart = $('dp-restart');
    restart.classList.toggle('dp-advanced-button', readerMounted);
    if (readerMounted) $('dp-options').querySelector('.dp-advanced').prepend(restart);
    else $('persistent-player').querySelector('.dp-controls').prepend(restart);
  }
  function mountReader(open) {
    if (!$('persistent-player')) return;
    readerMounted = open; readerExpanded = false;
    const reader = $('reader-view-container'), player = $('persistent-player');
    if (open) {
      document.querySelector('.reader-bottombar').append(player);
      for (const id of ['dp-options', 'dp-now', 'dharma-notice', 'dharma-companion-dialog']) if ($(id)) reader.append($(id));
    } else {
      for (const id of ['dp-options', 'dp-now', 'dharma-companion-dialog']) if ($(id)?.open) $(id).close();
      for (const id of ['persistent-player', 'dp-options', 'dp-now', 'dharma-notice', 'dharma-companion-dialog']) if ($(id)) document.body.append($(id));
    }
    player.classList.toggle('in-reader', open);
    placeReaderActions();
    paint(P.state);
  }
  function setReaderExpanded(show) { readerExpanded = !!show; paint(P.state); }
  function openNow() { if (!$('dp-now').open) $('dp-now').showModal(); renderLyrics(P.state, true); }
  function renderLyrics(state, force = false) {
    if (!$('dp-now').open) return;
    const index = state.playback.index || 0, start = Math.max(0, index - 8);
    $('dp-now-title').textContent = state.item?.title || 'Lắng lại cùng một lời kinh';
    $('dp-now-meta').textContent = state.playback.voiceLabel ? state.playback.voiceLabel + ' · Bản tiếng Việt' : 'Chọn một bản kinh và nhấn phát để bắt đầu.';
    if (force || lyricKey !== state.item?.key || index < lyricStart || index >= lyricStart + 30) {
      lyricKey = state.item?.key; lyricStart = start;
      $('dp-verses').replaceChildren();
      if (!state.chunks.length) $('dp-verses').textContent = 'Lời kinh sẽ xuất hiện tại đây khi bản tiếng Việt sẵn sàng.';
      state.chunks.slice(start, start + 40).forEach((chunk, i) => { const b = document.createElement('button'); b.className = 'dp-verse'; b.dataset.kind = chunk.kind || 'prose'; b.dataset.index = start + i; b.textContent = chunk.text; b.onclick = () => Audiobook.seekChunk(start + i); $('dp-verses').append(b); });
    }
    $('dp-verses').querySelectorAll('.dp-verse').forEach(b => { const active = Number(b.dataset.index) === index; b.classList.toggle('is-reading', active); b.setAttribute('aria-current', String(active)); });
    if (force || lastIndex !== index) $('dp-verses').querySelector('.is-reading')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    lastIndex = index;
    $('dp-now-position').textContent = `Đoạn ${state.chunks.length ? index + 1 : 0} / ${state.chunks.length}${state.playback.repeatTarget ? ` · Biến ${Math.min(state.playback.repeatCount + 1, state.playback.repeatTarget)}/${state.playback.repeatTarget}` : ''}`;
  }
  function paint(state) {
    if (!$('dp-play')) return;
    const s = state.playback, active = state.loading || ['playing', 'loading'].includes(s.status);
    if (readerMounted && (state.loading || s.count && ['playing', 'loading', 'paused', 'error'].includes(s.status))) readerExpanded = true;
    $('persistent-player').classList.toggle('has-audio', readerExpanded);
    $('persistent-player').setAttribute('aria-label', readerMounted ? 'Điều khiển đọc và nghe' : 'Trình phát kinh');
    $('persistent-player').dataset.status = state.loading ? 'loading' : s.status || 'idle';
    $('dp-title').textContent = state.item?.title || 'Chọn một bản kinh để nghe';
    if ($('dp-cover').dataset.editionKey !== (state.item?.key || 'welcome')) {
      $('dp-cover').dataset.editionKey = state.item?.key || 'welcome';
      $('dp-cover').innerHTML = LibraryDesign.jacket(state.item, { mini: true, title: state.item?.title || 'Chánh Pháp', tone: state.item ? undefined : 0 });
    }
    const status = state.loading ? 'Đang mở kinh…' : s.status === 'loading' && /^(Kết nối giọng đọc|Đang tải lại|Đang tải tiếp|Đang chuyển|Chuyển sang|Đang đệm)/.test(s.message || '') ? s.message : { playing: 'Đang nghe', loading: 'Đang chuẩn bị giọng đọc…', paused: 'Đã tạm dừng', error: 'Chưa phát được', idle: 'Sẵn sàng' }[s.status] || 'Thính pháp mỗi ngày';
    $('dp-subtitle').textContent = `${status}${s.count ? ` · Đoạn ${s.index + 1}/${s.count}` : ''}${s.voiceLabel ? ' · ' + s.voiceLabel : ''}`;
    const sameBook = !Reader.state.item || s.key === Reader.state.key;
    const briefStatus = state.loading ? 'Đang mở' : { playing: 'Đang nghe', loading: 'Đang tải', paused: 'Tạm dừng', error: 'Lỗi phát', idle: 'Sẵn sàng' }[s.status] || 'Sẵn sàng';
    $('dp-reader-status').classList.toggle('different-book', !sameBook);
    $('dp-reader-status').textContent = `${sameBook ? '' : (state.item?.title || 'NGHE') + ' · '}${briefStatus}${s.count ? ' · Đoạn ' + (s.index + 1) + '/' + s.count : ''}`;
    $('dp-reader-status').title = $('dp-subtitle').textContent;
    $('audio-follow').disabled = !!s.recorded || readerMounted && (!sameBook || !['viet', 'dual'].includes(Reader.state.mode));
    $('audio-follow').closest('label').title = s.recorded ? 'Bản thu chưa có vị trí đồng bộ với văn bản.' : !sameBook && readerMounted ? 'Mở bản kinh đang nghe để theo lời kinh.' : readerMounted && !['viet', 'dual'].includes(Reader.state.mode) ? 'Chọn bản Việt hoặc đối chiếu để theo lời kinh.' : 'Tự chuyển trang theo đoạn đang nghe';
    const playLabel = active ? 'Tạm dừng nghe kinh' : state.error || s.status === 'error' ? 'Thử lại nghe kinh' : s.status === 'paused' ? 'Nghe tiếp' : 'Phát kinh';
    for (const id of ['dp-play', 'dp-now-play']) { const html = icon(active ? 'pause' : 'play'); if ($(id).innerHTML !== html) $(id).innerHTML = html; $(id).setAttribute('aria-label', playLabel); $(id).title = playLabel; $(id).setAttribute('aria-pressed', String(active)); }
    const seekable = s.recorded || s.voice?.startsWith('online:');
    $('dp-seek').max = s.duration || 1; if (document.activeElement !== $('dp-seek')) $('dp-seek').value = s.currentTime || 0; $('dp-seek').disabled = !s.duration || !seekable;
    $('dp-seek').setAttribute('aria-valuetext', fmt(s.currentTime) + ' / ' + fmt(s.duration) + ' trong đoạn nghe hiện tại');
    let segment=$('dp-segment-progress');if(!segment){segment=document.createElement('span');segment.id='dp-segment-progress';segment.className='dp-segment-progress';$('persistent-player').querySelector('.dp-center').append(segment);}
    segment.textContent=s.count?(s.recorded?'Chương ':'Đoạn ')+(s.index+1)+'/'+s.count+' · '+fmt(s.currentTime)+'/'+(s.durationEstimated?'~':'')+fmt(s.duration):'';
    segment.title='Thời gian của đoạn hiện tại; tiến độ toàn bản tính theo số đoạn.';
    let whole=$('dp-whole-progress');if(!whole){whole=document.createElement('progress');whole.id='dp-whole-progress';whole.setAttribute('aria-label','Tiến độ toàn bản theo số đoạn');$('dp-options-book').after(whole);}
    whole.max=s.count||1;whole.value=s.count?s.index+Math.min(1,(s.currentTime||0)/(s.duration||1)):0;
    $('dp-seek').style.setProperty('--progress', `${s.duration ? s.currentTime / s.duration * 100 : 0}%`);
    $('dp-time').textContent = fmt(s.currentTime); $('dp-duration').textContent = (s.durationEstimated ? '~' : '') + fmt(s.duration);
    if (document.activeElement !== $('dp-options-volume')) $('dp-options-volume').value = s.volume ?? 1;
    if (document.activeElement !== $('dp-options-repeat')) $('dp-options-repeat').value = s.repeatMode || 'off';
    if (document.activeElement !== $('dp-mala')) $('dp-mala').value = String(s.repeatTarget || 0);
    $('dp-mute').setAttribute('aria-label', s.volume ? 'Tắt âm' : 'Bật âm'); $('dp-mute').setAttribute('aria-pressed', String(s.volume === 0));
    $('dp-repeat').setAttribute('aria-pressed', String(s.repeatMode !== 'off')); $('dp-repeat').title = 'Lặp: ' + ({ off: 'tắt', all: 'trọn bộ', one: 'một kinh' }[s.repeatMode] || 'tắt'); $('dp-repeat').setAttribute('aria-label', $('dp-repeat').title);
    $('dp-ab').querySelector('.dp-action-label').textContent = s.repeatA < 0 || s.repeatA == null ? 'Lặp A–B' : s.repeatB < 0 ? 'Đánh dấu B' : 'Bỏ lặp A–B'; $('dp-ab').setAttribute('aria-pressed', String(s.repeatA >= 0));
    $('dp-ab').setAttribute('aria-label', s.repeatA < 0 ? 'Đánh dấu đoạn bắt đầu A' : s.repeatB < 0 ? 'Đánh dấu đoạn kết thúc B' : 'Bỏ lặp A–B');
    $('dp-now-ab').textContent = s.repeatA < 0 || s.repeatA == null ? 'Đánh dấu A' : s.repeatB < 0 ? 'Đánh dấu B' : 'Bỏ lặp A–B'; $('dp-now-ab').disabled = !s.count;
    for (const id of ['dp-save', 'dp-ab', 'dp-prev', 'dp-next', 'dp-now-prev', 'dp-now-next', 'dp-restart', 'dp-now-restart', 'dp-restart-chunk']) $(id).disabled = !s.count || state.loading;
    $('dp-read').disabled = !state.item || state.loading || !Reader.path(state.item, 'viet');
    $('dp-prev').disabled = $('dp-now-prev').disabled = !s.count || state.loading || s.index === 0;
    const collection = CollectionPlayer.state;
    $('dp-next').disabled = $('dp-now-next').disabled = !s.count || state.loading || (s.index + 1 >= s.count && !state.queue.length && !(collection.active && collection.current + 1 < collection.total));
    $('dp-back').disabled = $('dp-forward').disabled = !s.duration || !seekable;
    $('dp-save').setAttribute('aria-pressed', String(LibraryStore.read('favorites', []).some(x => x.key === state.item?.key)));
    const notice = state.error || (s.status === 'error' ? s.message : /^(Đã đánh dấu|Điểm B|Lặp đoạn|Đã bỏ lặp|Đã hoàn tất|Đã dừng theo)/.test(s.message || '') ? s.message : '');
    $('dp-notice-actions').hidden = !state.error && s.status !== 'error';
    $('dp-notice-device').hidden = !!state.error || !Audiobook.state.deviceVoiceAvailable || s.recorded;
    if (notice && notice !== lastMessage) { lastMessage = notice; clearTimeout(noticeTimer); $('dp-notice-text').textContent = notice; $('dharma-notice').hidden = false; if (!state.error && s.status !== 'error') noticeTimer = setTimeout(() => { $('dharma-notice').hidden = true; }, 5000); }
    else if (!notice) { lastMessage = ''; $('dharma-notice').hidden = true; }
    if (s.message?.startsWith('Đã dừng theo hẹn giờ')) { setRain(0); $('dp-rain').value = '0'; }
    renderLyrics(state); renderCompanion(state);
  }
  function companionMarkup() { return `<header class="dc-heading"><span>TU HỌC MỖI NGÀY</span><h2>Không gian tu học</h2></header><div class="dc-tabs" role="tablist" aria-label="Công cụ tu học">${[['context', 'Bản kinh'], ['notes', 'Ghi chú'], ['queue', 'Hàng đợi'], ['glossary', 'Từ điển']].map(([id, label]) => `<button id="dc-tab-${id}" data-companion="${id}" role="tab" aria-controls="dc-${id}" aria-selected="${id === 'context'}">${label}</button>`).join('')}</div>
      <section id="dc-context" role="tabpanel" aria-labelledby="dc-tab-context"><div class="dc-cover">${LibraryArt.svg('lotus')}<span>VĂN · TƯ · TU</span></div><span class="eyebrow">CÙNG BẠN THÍNH PHÁP</span><h3 id="dc-title">Một khoảng lặng,<br>một lời kinh.</h3><p id="dc-description">Chọn bản kinh bạn muốn nghe. Thông tin bản dịch và công cụ tu học luôn ở bên cạnh.</p><dl id="dc-details"></dl><button id="dc-read" class="r-button" hidden>Đọc bản kinh này ↗</button><div class="dc-quote"><span>❝</span><p>Không làm các điều ác,<br>Thành tựu các việc thiện,<br>Giữ tâm luôn trong sạch.</p><small>KINH PHÁP CÚ · KỆ 183</small></div><button id="dc-meditate" class="r-button">${icon('clock')} Một phút lắng tâm</button></section>
      <section id="dc-notes" role="tabpanel" aria-labelledby="dc-tab-notes" hidden><h3>Suy ngẫm bên trang kinh</h3><p class="dp-help">Ghi chú lưu trên thiết bị này, gắn với đoạn và thời gian đang nghe.</p><form id="dc-note-form"><label for="dc-note" id="dc-note-label">Ghi chú mới</label><textarea id="dc-note" rows="4" placeholder="Điều gì đọng lại trong bạn?" maxlength="10000" required></textarea><button class="r-primary" type="submit">Lưu ghi chú</button></form><div id="dc-note-list"></div><button id="dc-export" class="r-button">Xuất ghi chú Markdown</button></section>
      <section id="dc-queue" role="tabpanel" aria-labelledby="dc-tab-queue" hidden><h3>Tiếp nối lời kinh</h3><p class="dp-help">Các đoạn và phẩm tự phát tiếp đến hết kinh. Kinh trong hàng đợi tự phát từ đầu sau đó; khi nghe trọn bộ, thư viện tự chuyển sang kinh kế tiếp trong bộ.</p><div id="dc-queue-list"></div><h3 id="dc-collection-title"></h3><div id="dc-collection-list"></div></section>
      <section id="dc-glossary" role="tabpanel" aria-labelledby="dc-tab-glossary" hidden><h3>Hiểu thêm lời kinh</h3><label for="dc-term">Tra cứu Pāḷi · Hán · Việt</label><input id="dc-term" type="search" placeholder="Vô ngã, chánh niệm…"><div id="dc-terms"></div></section>`; }
  function bindCompanion() {
    document.querySelectorAll('[data-companion]').forEach(b => b.onclick = () => selectCompanion(b.dataset.companion));
    document.querySelector('.dc-tabs').onkeydown = e => { if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return; e.preventDefault(); const tabs = [...document.querySelectorAll('[data-companion]')], at = tabs.indexOf(document.activeElement); const next = tabs[(at + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; next.click(); next.focus(); };
    $('dc-read').onclick = () => openReading(P.state.item);
    $('dc-meditate').onclick = openNow;
    $('dc-note').onfocus = () => { if (!captured && P.state.item) captured = { key: P.state.item.key, index: Audiobook.state.index, seconds: Audiobook.state.currentTime }; updateNoteLabel(); };
    $('dc-note-form').onsubmit = e => { e.preventDefault(); if (P.addNote($('dc-note').value, captured)) { $('dc-note').value = ''; captured = null; updateNoteLabel(); } };
    $('dc-export').onclick = () => { if (!P.state.item) return; LibraryStore.download('ghi-chu-nghe-' + P.state.item.id + '.md', '# ' + P.state.item.title + '\n\n' + P.notes().map(n => `## Đoạn ${n.index + 1} · ${fmt(n.seconds)}\n\n${n.text}`).join('\n\n'), 'text/markdown;charset=utf-8'); };
    $('dc-term').oninput = renderTerms;
    renderTerms(); selectCompanion('context');
  }
  function updateNoteLabel() { $('dc-note-label').textContent = captured ? `Đoạn ${captured.index + 1} · ${fmt(captured.seconds)}` : 'Ghi chú mới'; }
  function selectCompanion(tab) { document.querySelectorAll('[data-companion]').forEach(b => { const active = b.dataset.companion === tab; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; $('dc-' + b.dataset.companion).hidden = !active; }); if (tab === 'glossary') renderTerms(); renderCompanion(P.state); }
  function showCompanion(tab) {
    if (!$('dharma-companion').checkVisibility() || $('reader-view-container').classList.contains('active')) {
      const dialog = $('dharma-companion-dialog'); dialog.append($('dharma-companion-content')); if (!dialog.open) dialog.showModal();
    }
    selectCompanion(tab);
  }
  function renderTerms() {
    if(!LibraryAssets.ready('glossary')){if($('dc-glossary').hidden)return;LibraryAssets.ensure('glossary').then(renderTerms).catch(e=>$('dc-terms').textContent=e.message);return;}
    const q = ReaderModel.normalize($('dc-term').value), current = ReaderModel.normalize(P.state.playback.currentText || '');
    const matches = PALI_GLOSSARY.filter(x => q ? ReaderModel.normalize(x.term + ' ' + x.pali + ' ' + x.vietnamese).includes(q) : current.includes(ReaderModel.normalize(x.vietnamese)));
    const list = q ? matches : matches.length ? matches : PALI_GLOSSARY.slice(0, 3);
    $('dc-terms').innerHTML = list.slice(0, 12).map(x => `<details class="dc-term"><summary>${esc(x.vietnamese)} <small>${esc(x.pali)}</small></summary><p>${esc(x.definition)}</p><p class="dp-help">${esc(x.practiceNote)}</p></details>`).join('') || '<p class="dp-help">Chưa có thuật ngữ phù hợp trong từ điển hiện có.</p>';
  }
  function renderCompanion(state) {
    if (!$('dc-title')) return;
    const key = state.item?.key || '';
    if (glossaryText !== state.playback.currentText) { glossaryText = state.playback.currentText; if (!$('dc-term').value) renderTerms(); }
    if (key !== contextKey) {
      contextKey = key; captured = null; $('dc-note').value = ''; updateNoteLabel();
      $('dc-title').textContent = state.item?.title || 'Một khoảng lặng, một lời kinh.';
      document.querySelector('.dc-cover').innerHTML = LibraryDesign.jacket(state.item, { title: state.item?.title || 'Bên trang kinh', tone: state.item ? undefined : 0 });
      LibraryDesign.refresh();
      const ctx = state.item ? SutraContext.getByItem(state.item) : null;
      $('dc-description').textContent = ctx?.significance || 'Đọc, lắng nghe và lưu lại những suy ngẫm của bạn bên trang kinh.';
      $('dc-details').innerHTML = state.item ? `<dt>Mã kinh</dt><dd>${esc(state.item.data.taishoId || state.item.id)}</dd><dt>Bản sách</dt><dd>${esc(LibraryDesign.creditLine(state.item) || 'Xem thông tin trong bản nguồn')}</dd>` : '';
      $('dc-read').hidden = !state.item;
      renderTerms();
    }
    $('dc-note').disabled = !state.item; $('dc-note-form').querySelector('button').disabled = !state.item;
    const notes = P.notes(), signature = key + JSON.stringify(notes);
    if (signature !== noteSignature) { noteSignature = signature; $('dc-note-list').innerHTML = notes.map(n => `<article class="dc-note"><button class="dc-note-jump" data-note="${esc(n.id)}">Đoạn ${n.index + 1} · ${fmt(n.seconds)}</button><p>${esc(n.text)}</p><button class="dc-note-delete" data-delete-note="${esc(n.id)}" aria-label="Xóa ghi chú">Xóa</button></article>`).join('') || '<p class="dp-help">Chưa có ghi chú cho bản kinh này.</p>'; $('dc-note-list').querySelectorAll('[data-note]').forEach(b => b.onclick = () => { const n = notes.find(x => x.id === b.dataset.note); Audiobook.seekChunk(n.index, n.seconds); }); $('dc-note-list').querySelectorAll('[data-delete-note]').forEach(b => b.onclick = () => P.removeNote(b.dataset.deleteNote)); }
    const collection = CollectionPlayer.state, qs = JSON.stringify([state.queue, collection.current, collection.active, collection.collectionName, collection.playlist]);
    if (qs !== queueSignature) {
      queueSignature = qs;
      $('dc-queue-list').innerHTML = state.queue.map((x, i) => `<article class="dc-queue-item"><button data-play-queued="${i}"><small>${String(i + 1).padStart(2, '0')}</small><strong>${esc(x.title)}</strong></button><div><button class="dc-read-queued" data-read-queued="${i}" aria-label="Đọc kinh: ${esc(x.title)}">Đọc kinh</button><button data-move-queued="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Đưa lên trước">↑</button><button data-remove-queued="${i}" aria-label="Xóa khỏi hàng đợi">×</button></div></article>`).join('') || '<p class="dp-help">Hàng đợi đang trống. Mở một bìa kinh và chọn “Thêm hàng đợi”.</p>';
      $('dc-queue-list').querySelectorAll('[data-read-queued]').forEach(b => b.onclick = () => openReading(state.queue[+b.dataset.readQueued]));
      $('dc-queue-list').querySelectorAll('[data-play-queued]').forEach(b => b.onclick = () => { const i = +b.dataset.playQueued, item = state.queue[i]; P.removeQueue(i); P.playItem(item); });
      $('dc-queue-list').querySelectorAll('[data-remove-queued]').forEach(b => b.onclick = () => P.removeQueue(+b.dataset.removeQueued));
      $('dc-queue-list').querySelectorAll('[data-move-queued]').forEach(b => b.onclick = () => P.moveQueue(+b.dataset.moveQueued, -1));
      $('dc-collection-title').textContent = collection.active ? collection.collectionName : '';
      $('dc-collection-list').innerHTML = collection.active ? collection.playlist.map((x, i) => `<article class="dc-collection-track ${i === collection.current ? 'active' : ''}"><button data-collection-index="${i}" aria-label="Nghe kinh: ${esc(x.title)}"><small>${i + 1}</small><span>${esc(x.title)}</span></button><button class="r-button dc-read-collection" data-read-collection="${i}" aria-label="Đọc kinh: ${esc(x.title)}">Đọc kinh</button></article>`).join('') : '';
      $('dc-collection-list').querySelectorAll('[data-collection-index]').forEach(b => b.onclick = () => CollectionPlayer.jump(+b.dataset.collectionIndex));
      $('dc-collection-list').querySelectorAll('[data-read-collection]').forEach(b => b.onclick = () => openReading(collection.playlist[+b.dataset.readCollection]));
    }
  }
  window.PersistentPlayer = { init, icon, esc, fmt, companionMarkup, bindCompanion, showCompanion, openNow, openOptions, mountReader, setReaderExpanded, paint };
})();

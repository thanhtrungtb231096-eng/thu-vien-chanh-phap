/* Listening history records actual playback, independently of reading and queues. */
(() => {
  'use strict';
  const S = window.LibraryStore, P = window.DharmaPlayerStore, UI = window.PersistentPlayer;
  const $ = id => document.getElementById(id), esc = UI.esc, icon = UI.icon;
  const STORE = 'listening-history', PAGE_SIZE = 20;
  let initialized = false, filter = 'all', query = '', limit = PAGE_SIZE;
  let session = null, lastWrite = 0, lastStatus = '', pending = false, actionVersion = 0;
  const number = value => Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0);
  const identity = audio => audio.key + (audio.recordingId ? ':recording:' + audio.recordingId : '');
  const resolve = key => { const split = String(key || '').indexOf(':'); return split < 0 ? null : P.resolve({ type: key.slice(0, split), id: key.slice(split + 1) }); };
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
  function entries() {
    const unique = new Map();
    S.read(STORE, []).forEach(x => {
      if (!x || typeof x !== 'object' || typeof x.id !== 'string' || typeof x.key !== 'string' || !resolve(x.key)) return;
      if (!unique.has(x.id) || number(x.lastPlayedAt) > number(unique.get(x.id).lastPlayedAt)) unique.set(x.id, x);
    });
    return [...unique.values()].sort((a, b) => number(b.lastPlayedAt) - number(a.lastPlayedAt));
  }
  function checkpoint(audio, completed = false) {
    const item = resolve(audio.key);
    if (!item || !audio.count) return;
    const list = entries(), id = identity(audio), old = list.find(x => x.id === id);
    const segment = audio.segment || (Audiobook.state.key === audio.key ? Audiobook.segments[audio.index] : null);
    const now = Date.now(), position = {
      block: segment?.block || old?.position?.block || '', sourceOffset: number(segment?.sourceOffset),
      index: number(audio.index), seconds: number(audio.currentTime), segmentation: window.NarrationModel.VERSION
    };
    const entry = {
      id, key: item.key, type: item.type, bookId: item.id, title: item.title,
      recordingId: audio.recordingId || null, voiceLabel: audio.voiceLabel || old?.voiceLabel || '',
      chapter: segment?.heading || old?.chapter || '', count: number(audio.count), position,
      duration: number(audio.duration), completed, firstPlayedAt: old?.firstPlayedAt || now,
      lastPlayedAt: now, completedAt: completed ? now : old?.completedAt || null
    };
    S.write(STORE, [entry, ...list.filter(x => x.id !== id)]);
    lastWrite = now;
  }
  function observe(audio) {
    if (!audio.key || !audio.count) return;
    const id = identity(audio);
    if (session?.id !== id) { session = null; lastStatus = ''; }
    if (audio.status === 'playing') {
      const changed = !session || session.completed || session.audio.index !== audio.index || lastStatus !== 'playing';
      session = { id, audio, completed: false };
      if (changed || Date.now() - lastWrite >= 5000) checkpoint(audio);
    } else if (session && !session.completed) {
      const moved = session.audio.index !== audio.index || Math.abs(session.audio.currentTime - audio.currentTime) > .3;
      if (['paused', 'error', 'idle'].includes(audio.status) && (lastStatus !== audio.status || moved)) checkpoint(audio);
      // Loading between chunks belongs to the same listening session.
      session.audio = audio;
    }
    if (lastStatus !== audio.status) scheduleRender();
    lastStatus = audio.status;
  }
  function flush() {
    if (session && !session.completed && session.audio.status === 'playing') checkpoint(Audiobook.state);
  }
  function migrate() {
    if (S.read('listening-history-migrated', false)) return;
    const list = entries(), existing = new Set(list.map(x => x.id));
    // Old positions at zero can be created by opening the reader. They are not listens.
    try {
      for (let n = 0; n < localStorage.length; n++) {
        const storageKey = localStorage.key(n);
        if (!storageKey?.startsWith('cp3:listen:')) continue;
        const key = storageKey.slice('cp3:listen:'.length), item = resolve(key);
        const point = S.read('listen:' + key, null);
        if (!item || existing.has(key) || !point || !(number(point.index) > 0 || number(point.seconds) > 0)) continue;
        list.push({ id: key, key, type: item.type, bookId: item.id, title: item.title, position: point,
          count: 0, completed: false, lastPlayedAt: number(point.updatedAt), firstPlayedAt: number(point.updatedAt), voiceLabel: '', chapter: '', recordingId: null });
      }
    } catch { /* History still works when browser storage is restricted. */ }
    if (list.length) S.write(STORE, list);
    S.write('listening-history-migrated', true);
  }
  function time(seconds) { const s = Math.floor(number(seconds)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
  function date(timestamp) {
    if (!number(timestamp)) return 'Vị trí đã lưu';
    const value = new Date(number(timestamp)), today = new Date(), yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    const day = value.toDateString() === today.toDateString() ? 'Hôm nay' : value.toDateString() === yesterday.toDateString() ? 'Hôm qua' : value.toLocaleDateString('vi-VN');
    return `${day} · ${value.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  }
  function active(entry) { const a = Audiobook.state; return identity(a) === entry.id && ['playing', 'loading'].includes(a.status); }
  function progress(entry) {
    if (entry.completed) return 100;
    if (!entry.count) return 0;
    const fraction = entry.duration ? Math.min(1, number(entry.position?.seconds) / entry.duration) : 0;
    return Math.min(99, Math.floor((number(entry.position?.index) + fraction) / entry.count * 100));
  }
  function row(entry) {
    const article = document.createElement('article'); article.className = 'lh-row'; article.dataset.historyId = entry.id;
    article.innerHTML = `<div class="lh-cover">${LibraryDesign.jacket(resolve(entry.key), { mini: true })}</div><div class="lh-copy"><div class="lh-row-top"><span class="lh-status"></span><time class="lh-date"></time></div><h3>${esc(entry.title)}</h3><p class="lh-detail"></p><div class="lh-progress" role="progressbar" aria-label="Vị trí trong bản kinh" aria-valuemin="0" aria-valuemax="100"><span></span></div></div><div class="lh-actions"><button class="lh-play" type="button"></button><button class="lh-read" type="button" aria-label="Đọc ${esc(entry.title)}" title="Đọc kinh">${icon('lyrics')}</button></div>`;
    article.querySelector('.lh-play').onclick = () => resume(entry.id);
    article.querySelector('.lh-read').onclick = () => { const item = resolve(entry.key); if (item) Reader.open(item, 'viet'); };
    return article;
  }
  function updateRow(article, entry) {
    const playing = active(entry), status = article.querySelector('.lh-status');
    article.classList.toggle('is-playing', playing);
    status.textContent = playing ? (Audiobook.state.status === 'loading' ? 'Đang chuẩn bị…' : 'Đang phát') : entry.completed ? 'Đã nghe xong' : 'Đang nghe dở';
    const stamp = article.querySelector('time'); stamp.textContent = date(entry.lastPlayedAt);
    if (number(entry.lastPlayedAt)) stamp.dateTime = new Date(number(entry.lastPlayedAt)).toISOString();
    const point = entry.position || {}, place = entry.completed ? 'Đã đến cuối bản kinh' : `Đoạn ${number(point.index) + 1}${entry.count ? ' / ' + entry.count : ''} · ${time(point.seconds)}`;
    const detail = [place, entry.chapter, entry.recordingId ? 'Bản thu · ' + (entry.voiceLabel || 'Người đọc chưa ghi') : entry.voiceLabel].filter(Boolean).join(' · ');
    article.querySelector('.lh-detail').textContent = detail;
    article.querySelector('.lh-detail').title = detail;
    const bar = article.querySelector('.lh-progress'), percent = progress(entry);
    bar.setAttribute('aria-valuenow', String(percent));
    bar.setAttribute('aria-valuetext', entry.completed ? 'Đã nghe xong' : place);
    bar.hidden = !entry.count; bar.firstElementChild.style.width = percent + '%';
    const play = article.querySelector('.lh-play'), label = playing ? 'Tạm dừng' : entry.completed ? 'Nghe lại' : 'Nghe tiếp';
    const markup = icon(playing ? 'pause' : entry.completed ? 'restart' : 'play') + '<span>' + label + '</span>';
    if (play.innerHTML !== markup) play.innerHTML = markup;
    play.setAttribute('aria-label', label + ' ' + entry.title); play.setAttribute('aria-pressed', String(playing));
  }
  function renderList(container, list) {
    const ids = list.map(x => x.id), current = [...container.children];
    if (ids.join('\n') !== current.map(x => x.dataset.historyId).join('\n')) container.replaceChildren(...list.map(row));
    [...container.children].forEach((article, i) => updateRow(article, list[i]));
  }
  function render() {
    if (!initialized) return;
    const all = entries(), underway = all.filter(x => !x.completed), done = all.length - underway.length;
    $('lh-summary').textContent = all.length ? `${underway.length} đang nghe · ${done} đã nghe xong` : 'Những bản kinh bạn đã lắng nghe sẽ được lưu tại đây.';
    const counts = { all: all.length, progress: underway.length, completed: done };
    document.querySelectorAll('[data-history-filter]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.historyFilter === filter));
      b.querySelector('span').textContent = counts[b.dataset.historyFilter];
    });
    const matching = all.filter(x => (filter === 'all' || (filter === 'completed' ? x.completed : !x.completed)) && normalize([x.title, x.voiceLabel, x.chapter].join(' ')).includes(normalize(query.trim())));
    renderList($('lh-list'), matching.slice(0, limit));
    $('lh-more').hidden = matching.length <= limit;
    $('lh-result').textContent = all.length ? `${matching.length} bản kinh${query.trim() ? ' phù hợp' : ''}` : '';
    $('lh-empty').hidden = matching.length > 0;
    $('lh-empty-title').textContent = !all.length ? 'Bắt đầu từ một bản kinh' : query.trim() ? 'Chưa tìm thấy bản kinh' : filter === 'completed' ? 'Chưa có bản kinh đã nghe xong' : 'Bạn đã nghe xong các bản kinh';
    $('lh-empty-copy').textContent = !all.length ? 'Chọn một bản kinh để nghe. Lần sau, bạn có thể trở lại đúng vị trí tại đây.' : query.trim() ? 'Thử tên kinh hoặc giọng đọc khác.' : filter === 'completed' ? 'Khi nghe đến cuối bản kinh, bản kinh sẽ xuất hiện ở đây.' : 'Khám phá thêm một bản kinh hoặc nghe lại bản bạn yêu thích.';
    $('lh-discover').hidden = !!query.trim();
    $('home-listening-history').hidden = !underway.length;
    renderList($('lh-continue-list'), underway.slice(0, 3));
  }
  function scheduleRender() {
    if (pending) return; pending = true;
    requestAnimationFrame(() => { pending = false; render(); });
  }
  function recordingNotice(message) {
    ['lh-notice', 'lh-home-notice'].forEach(id => { const element = $(id); element.hidden = !message; element.querySelector('span').textContent = message; });
  }
  async function resume(id) {
    const action = ++actionVersion; recordingNotice('');
    const entry = entries().find(x => x.id === id); if (!entry) return false;
    const same = identity(Audiobook.state) === id;
    if (same && active(entry)) { P.cancel(); return true; }
    if (same && !entry.completed && Audiobook.state.status === 'paused') { await Audiobook.start(); return true; }
    if (entry.recordingId) {
      try {
        const info = S.read('recordings', []).find(x => x.id === entry.recordingId);
        const blob = info && await window.LibraryOffline?.media('get', 'recording:' + entry.recordingId);
        if (action !== actionVersion) return false;
        if (!blob) { recordingNotice('Bản thu này chưa có trên thiết bị. Nhập lại tệp để nghe tiếp.'); return false; }
        P.cancel(); if (CollectionPlayer.isActive) CollectionPlayer.stop();
        await Audiobook.loadRecording(blob, entry.key, info, entry.completed ? { index: 0, seconds: 0 } : entry.position);
        return true;
      } catch { if (action === actionVersion) recordingNotice('Chưa mở được bản thu. Hãy kiểm tra lại tệp âm thanh.'); return false; }
    }
    return P.playItem({ type: entry.type, id: entry.bookId }, entry.completed ? { restart: true } : { position: entry.position });
  }
  function open() { switchTab('listening-history'); }
  function init() {
    if (initialized) return; initialized = true;
    const section = document.createElement('section'); section.id = 'tab-listening-history'; section.className = 'tab-panel listening-history'; section.style.display = 'none'; section.setAttribute('aria-labelledby', 'lh-title');
    section.innerHTML = `<header class="lh-heading"><div><span class="eyebrow">KHÔNG GIAN CỦA BẠN</span><h1 id="lh-title">Lịch sử nghe</h1><p id="lh-summary"></p></div><span class="lh-heading-icon" aria-hidden="true">${icon('clock')}</span></header><div class="lh-toolbar"><div class="lh-filters" role="group" aria-label="Lọc lịch sử nghe">${[['all', 'Tất cả'], ['progress', 'Đang nghe'], ['completed', 'Đã nghe xong']].map(([id, text]) => `<button type="button" data-history-filter="${id}" aria-pressed="${id === 'all'}">${text}<span>0</span></button>`).join('')}</div><label class="lh-search">${icon('search')}<input id="lh-query" type="search" aria-label="Tìm trong lịch sử nghe" placeholder="Tìm kinh đã nghe…" maxlength="160"></label></div><p id="lh-result" class="lh-result" role="status" aria-live="polite"></p><div id="lh-list" class="lh-list"></div><div id="lh-empty" class="lh-empty">${icon('clock')}<h2 id="lh-empty-title"></h2><p id="lh-empty-copy"></p><button id="lh-discover" class="r-primary" type="button">Khám phá kinh điển</button></div><button id="lh-more" class="r-button lh-more" type="button" hidden>Xem thêm</button>`;
    document.querySelector('main').append(section);
    const home = document.createElement('section'); home.id = 'home-listening-history'; home.className = 'home-section lh-home'; home.hidden = true;
    home.innerHTML = '<div class="section-heading"><div><h2>Nghe tiếp</h2><p>Trở lại bên lời kinh, từ chỗ bạn đã dừng.</p></div><button id="lh-view-all" class="lh-link" type="button">Lịch sử nghe <span aria-hidden="true">→</span></button></div><div id="lh-continue-list" class="lh-list"></div>';
    document.querySelector('.sanctuary-hero').after(home);
    [['lh-notice', $('lh-result')], ['lh-home-notice', home.querySelector('.section-heading')]].forEach(([id, anchor]) => {
      const notice = document.createElement('div'); notice.id = id; notice.className = 'lh-notice'; notice.hidden = true; notice.setAttribute('role', 'status');
      notice.innerHTML = '<span></span><button class="lh-link" type="button">Thiết bị & giọng đọc →</button>';
      notice.querySelector('button').onclick = () => switchTab('settings'); anchor.after(notice);
    });
    $('lh-view-all').onclick = open; $('lh-discover').onclick = () => switchTab('home');
    $('lh-query').oninput = e => { query = e.target.value; limit = PAGE_SIZE; render(); };
    section.querySelectorAll('[data-history-filter]').forEach(b => b.onclick = () => { filter = b.dataset.historyFilter; limit = PAGE_SIZE; render(); });
    $('lh-more').onclick = () => { limit += PAGE_SIZE; render(); };
    window.addEventListener('dharma-audio', e => observe(e.detail));
    window.addEventListener('dharma-document', () => { session = null; lastStatus = ''; });
    window.addEventListener('dharma-listening-finished', e => {
      if (!session || session.id !== identity(e.detail)) return;
      checkpoint(e.detail, true); session.completed = true; scheduleRender();
    });
    window.addEventListener('library-store-change', e => { if (e.detail.key === 'cp3:' + STORE) scheduleRender(); });
    window.addEventListener('library-synced', scheduleRender);
    window.addEventListener('library-restored', scheduleRender);
    window.addEventListener('storage', e => { if (e.key === 'cp3:' + STORE || e.key === null) scheduleRender(); });
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
    migrate(); render();
  }
  window.ListeningHistory = { init, open, resume, entries, refresh: render };
})();

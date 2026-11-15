/* One listening session, independent from the reader and library navigation. */
(() => {
  'use strict';
  const storage = window.LibraryStore, listeners = new Set();
  let request, generation = 0;
  const state = { item: null, failedItem: null, chunks: [], playback: {}, queue: [], error: '', loading: false };
  function resolve(ref) {
    if (!ref) return null;
    const data = ref.data || (ref.type === 'ebooks' ? DAI_TANG_KINH_DATA.find(x => x.id === ref.id) : ref.type === 'phucminh' ? PHUC_MINH_DATA.find(x => x.id === ref.id) : ref.type === 'daithua' ? DAI_THUA_DATA.find(x => x.id === ref.id) : ref.type === 'daitang' ? DAI_TANG_HAN_DATA.texts.find(x => x.id === ref.id) : null);
    return data ? { type: ref.type, data, id: data.id, key: ref.type + ':' + data.id, title: data.vietTitle || data.title } : null;
  }
  function emit() { listeners.forEach(fn => fn(state)); }
  function message(text) { state.error = text; emit(); }
  async function playItem(ref, options = {}) {
    window.LibraryDiagnostics?.requestAudio();
    const item = resolve(ref);
    if (!item || !Reader.path(item, 'viet')) { message('Bản kinh này chưa có bản tiếng Việt để nghe.'); return false; }
    if (!options.collection && CollectionPlayer.isActive) CollectionPlayer.stop();
    if (state.item?.key === item.key && Audiobook.state.key === item.key && Audiobook.state.count && !options.restart && !options.page && !options.block && !options.position && !Audiobook.state.recorded) {
      state.error = ''; state.failedItem = null; emit();
      await Audiobook.start(); return true;
    }
    request?.abort(); request = new AbortController(); const token = ++generation;
    Audiobook.pause();
    state.loading = true; state.error = ''; state.failedItem = null; emit();
    try {
      const response = await fetch(Reader.path(item, 'viet'), { signal: request.signal });
      if (!response.ok) throw new Error('Không tải được bản kinh. Hãy kiểm tra máy chủ thư viện rồi thử lại.');
      const original = ReaderModel.parse(await response.text());
      await window.LibraryEditions?.migrate(original,item.key,'viet');
      const doc = window.LibraryEditions?.apply(original, item.key, 'viet') || original;
      if (token !== generation) return false;
      state.item = item; state.loading = false;
      Audiobook.connect(doc, item.key, 'unavailable', true, options.position || null);
      if (options.restart) Audiobook.seekChunk(0, 0, false);
      if (options.block && !Audiobook.seekBlock(options.block, options.sourceOffset || 0)) { message('Đoạn này chưa có nội dung để nghe.'); return false; }
      if (options.page) {
        const marker = doc.blocks.findIndex(x => x.heading?.title === 'Trang ' + options.page);
        const following = marker < 0 ? [] : doc.blocks.slice(marker + 1);
        const end = following.findIndex(x => /^Trang \d+$/u.test(x.heading?.title || ''));
        const block = (end < 0 ? following : following.slice(0, end)).find(x => !['metadata', 'note', 'contents', 'running'].includes(x.kind) && /[a-zA-ZÀ-ỹ]/u.test(x.text));
        if (!block || !Audiobook.seekBlock(block.id)) { message('Trang này chưa có văn bản để nghe. Hãy chọn một trang khác.'); return false; }
      }
      storage.write('dharma-last', { type: item.type, id: item.id });
      const recent = storage.read('recent', []).filter(x => x.key !== item.key);
      recent.unshift({ type: item.type, id: item.id, key: item.key, title: item.title, mode: 'viet', updatedAt: Date.now() });
      storage.write('recent', recent.slice(0, 30));
      LibraryUI.refreshShelf();
      await Audiobook.start(); emit(); return true;
    } catch (error) {
      if (token !== generation) return false;
      state.loading = false;
      if (error.name !== 'AbortError') { state.failedItem = item; message(error instanceof TypeError ? AudioService.connectionMessage() : error.message || 'Chưa tải được kinh văn. Nhấn Thử lại.'); }
      emit(); return false;
    }
  }
  function cancel() { generation++; request?.abort(); state.loading = false; Audiobook.pause(); emit(); }
  function enqueue(ref) { const item = resolve(ref); if (!item || !Reader.path(item, 'viet')) return; state.queue.push({ type: item.type, id: item.id, title: item.title }); persistQueue(); }
  function persistQueue() { storage.write('dharma-queue', state.queue); emit(); }
  async function next() {
    const audio = Audiobook.state;
    if (audio.index + 1 < audio.count) return Audiobook.seekChunk(audio.index + 1, 0, ['playing', 'loading'].includes(audio.status));
    return nextItem();
  }
  async function nextItem() {
    if (state.queue.length) { const item = state.queue.shift(); persistQueue(); return playItem(item, {restart:true}); }
    if (CollectionPlayer.isActive) { const s = CollectionPlayer.state; if (s.current + 1 < s.total) return CollectionPlayer.jump(s.current + 1); }
    return false;
  }
  function toggle() {
    if (state.loading) return cancel();
    if (state.error || Audiobook.state.status === 'error') return retry();
    if (['playing', 'loading'].includes(Audiobook.state.status)) return Audiobook.pause();
    if (Audiobook.state.count) return Audiobook.start();
    const saved = resolve(storage.read('dharma-last', null));
    const data = DAI_THUA_DATA.find(x => x.taishoId === 'T08n0251' && x.files.vietMd) || DAI_THUA_DATA.find(x => x.files.vietMd);
    return playItem(saved || { type: 'daithua', data });
  }
  function retry() {
    const failedItem = state.failedItem;
    state.error = ''; state.failedItem = null; emit();
    if (failedItem) return playItem(failedItem);
    if (Audiobook.state.count) return Audiobook.retry();
    return toggle();
  }
  function notes() { return storage.read('audio-notes:' + state.item?.key, []).filter(n => (n.recordingId || null) === (Audiobook.state.recordingId || null)); }
  function addNote(text, captured) {
    if (!text.trim() || !state.item) return false;
    const point = captured || { key: state.item.key, index: Audiobook.state.index, seconds: Audiobook.state.currentTime };
    const key = point.key;
    const list = storage.read('audio-notes:' + key, []);
    list.unshift({ id: crypto.randomUUID(), index: point.index, seconds: point.seconds || 0, text: text.trim(), created: Date.now(), segmentation: window.NarrationModel.VERSION, recordingId: point.recordingId ?? Audiobook.state.recordingId ?? null });
    const ok = storage.write('audio-notes:' + key, list); emit(); return ok;
  }
  function removeNote(id) { storage.write('audio-notes:' + state.item?.key, storage.read('audio-notes:' + state.item?.key, []).filter(x => x.id !== id)); emit(); }
  function favorite() {
    if (!state.item) return;
    const { type, id, key, title } = state.item, list = storage.read('favorites', []);
    storage.write('favorites', list.some(x => x.key === key) ? list.filter(x => x.key !== key) : [{ type, id, key, title }, ...list]);
    LibraryUI.refreshShelf(); LibraryUI.decorate(); emit();
  }
  function init() {
    state.queue = storage.read('dharma-queue', []).filter(x => x && resolve(x)).slice(0, 500);
    window.addEventListener('dharma-audio', e => {
      state.playback = e.detail;
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = e.detail.status === 'playing' ? 'playing' : e.detail.status === 'paused' ? 'paused' : 'none';
        if (e.detail.duration > 0 && navigator.mediaSession.setPositionState) {
          try { navigator.mediaSession.setPositionState({ duration: e.detail.duration, playbackRate: e.detail.rate, position: Math.min(e.detail.currentTime, e.detail.duration) }); } catch { /* Unsupported position tracking. */ }
        }
      }
      emit();
    });
    window.addEventListener('dharma-document', e => {
      state.chunks = e.detail.chunks;
      const split = e.detail.key.indexOf(':');
      state.item = resolve({ type: e.detail.key.slice(0, split), id: e.detail.key.slice(split + 1) });
      if (state.item && 'mediaSession' in navigator && 'MediaMetadata' in window) navigator.mediaSession.metadata = new MediaMetadata({ title: state.item.title, artist: 'Thư viện Chánh Pháp', album: 'Kinh điển tiếng Việt' });
      emit();
    });
    window.addEventListener('sutra-finished', e => {
      if (e.detail.key !== Audiobook.state.key || state.loading) return;
      if (CollectionPlayer.isActive) return;
      if (state.queue.length) nextItem();
      else if (Audiobook.state.repeatMode === 'all') Audiobook.start();
    });
    if ('mediaSession' in navigator) {
      const handlers = { play: () => Audiobook.start(), pause: () => Audiobook.pause(), nexttrack: next, previoustrack: () => Audiobook.seekChunk(Audiobook.state.index - 1), seekbackward: e => Audiobook.seekTime(Audiobook.state.currentTime - (e.seekOffset || 10)), seekforward: e => Audiobook.seekTime(Audiobook.state.currentTime + (e.seekOffset || 10)), seekto: e => Audiobook.seekTime(e.seekTime) };
      Object.entries(handlers).forEach(([name, fn]) => { try { navigator.mediaSession.setActionHandler(name, fn); } catch { /* Optional browser capability. */ } });
    }
  }
  window.DharmaPlayerStore = { state, init, resolve, playItem, cancel, toggle, retry, next, enqueue, notes, addNote, removeNote, favorite, message,
    playReader: () => playItem(Reader.state.item),
    removeQueue(index) { state.queue.splice(index, 1); persistQueue(); },
    moveQueue(index, delta) { const to = index + delta; if (to < 0 || to >= state.queue.length) return; [state.queue[index], state.queue[to]] = [state.queue[to], state.queue[index]]; persistQueue(); },
    subscribe(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); }
  };
})();

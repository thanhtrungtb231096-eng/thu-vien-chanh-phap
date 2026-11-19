/* Vietnamese narration: Chapter-Sprite studio packs, online neural voices, VieNeu-TTS v3 Turbo offline AI & device fallback. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const store = window.LibraryStore;
  const audio = new Audio();
  let recording = null;
  const allowedOfflineVoice = v => v && typeof v.name === 'string' && /^vieneu-(?:thien-tam-duc|thuc-doan)$/.test(v.id);
  const allowedVoice = allowedOfflineVoice;
  const isServerVoice = v => typeof v === 'string' && v.startsWith('offline:');
  let engineVoices = [];
  let offlineEngineVoices = store.read('audio-offline-voices', []).filter(allowedOfflineVoice);
  let packOnlyVoices = store.read('audio-pack-voices', []).filter(allowedOfflineVoice);
  let deviceVoices = [], queue = [], chapters = [], key = '', index = 0, offset = 0;
  let docVersion = '', docEdited = false, packCache = null, activePackState = null, usedFallbackVoice = false, packsSupported = true;
  let status = 'idle', generation = 0, request = null, url = null, utterance = null, deadline = 0, timer = null;
  const segmentDurations = new Map();
  let smoothedChapter = { id: '', duration: 0 };
  let stitchedSlice = null, stitchingPromise = null, keepAliveActive = false;
  const initialCompletionFn = window.AudioService?.completion || null;
  const isIOSDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent || '') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let settings = { voice: '', rate: 0.95, follow: true, ...store.read('audio-settings', {}) };
  if (typeof settings.voice === 'string') {
    if (settings.voice.includes('NamMinh') || settings.voice.includes('thai-son')) {
      settings.voice = 'offline:vieneu-thien-tam-duc';
      settings.userPickedOffline = true;
    } else if (settings.voice.includes('HoaiMy') || settings.voice.includes('ngoc-linh')) {
      settings.voice = 'offline:vieneu-thuc-doan';
      settings.userPickedOffline = true;
    } else if (settings.voice.startsWith('online:') || (settings.voice.startsWith('offline:') && !allowedOfflineVoice({ id: settings.voice.slice(8), name: 'ok' }))) {
      settings.voice = '';
      settings.userPickedOffline = false;
    }
  }
  const isPackOnlySelectedVoice = () => typeof settings.voice === 'string' && settings.voice.startsWith('offline:') && !offlineEngineVoices.length && packOnlyVoices.some(v => 'offline:' + v.id === settings.voice);
  const prepared = new Map();
  const pending = new Map();
  const completing = new Map(), prefetchFailures = new Map();
  let warmTimer = null;
  let bufferGeneration = 0, warming = null, audioIndex = -1, streamDuration = 0;
  let initialized = false, voiceDiscovery = null, voicesLoaded = false;
  let stallTimer = null;
  let transitionTimer = null, completePlayback = null;
  let heardPosition = 0;
  let actualVoices = [];
  let repeatA = -1, repeatB = -1; // A-B repeat markers
  let listenElapsed = 0;
  let repeatMode = 'off', repeatTarget = 0, repeatCount = 0;
  let message = '';

  function releaseStitchedSlice() {
    if (stitchedSlice?.objectUrl) {
      const old = stitchedSlice.objectUrl;
      stitchedSlice = null;
      queueMicrotask(() => { try { URL.revokeObjectURL(old); } catch {} });
    } else {
      stitchedSlice = null;
    }
  }
  function releasePreparedEntry(entry) {
    if (entry?.objectUrl) {
      try { URL.revokeObjectURL(entry.objectUrl); } catch {}
      entry.objectUrl = null;
    }
  }
  function deletePrepared(name) {
    const entry = prepared.get(name);
    if (entry) { releasePreparedEntry(entry); prepared.delete(name); }
  }
  function clearPrepared() {
    releaseStitchedSlice();
    for (const entry of prepared.values()) releasePreparedEntry(entry);
    prepared.clear();
  }
  function fmtTime(sec) {
    if (isNaN(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  function fmtDuration(sec) {
    if (isNaN(sec) || sec <= 0) return '0:00';
    const m = Math.floor(sec / 60);
    return m > 0 ? `${m} phút` : `${Math.floor(sec)} giây`;
  }
  function plain(raw) {
    return raw.replace(/https?:\/\/\S+/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[\u3400-\u9fff\uf900-\ufaff]/g, '').replace(/[#*_>`~|]/g, '')
      .replace(/\s+/g, ' ').trim();
  }
  function chunks(text, max = 500) { return window.NarrationModel.chunks(text, max); }
  // Kept only to translate listening positions saved before semantic segmentation.
  function legacyChunks(text, max = 450) {
    const parts = text.match(/[^.!?。！？]+[.!?。！？]*[”’"']*\s*/gu) || [text];
    const result = []; let buffer = '';
    for (const part of parts) {
      if (buffer.length + part.length > max && buffer) { result.push(buffer.trim()); buffer = ''; }
      if (part.length > max) {
        for (const word of part.split(/\s+/)) {
          if (buffer.length + word.length + 1 > max && buffer) { result.push(buffer.trim()); buffer = ''; }
          buffer += word + ' ';
        }
      } else buffer += part;
    }
    if (buffer.trim()) result.push(buffer.trim());
    return result;
  }
  function announce(value) { message = value; if ($('audio-status')) $('audio-status').textContent = value; emit(); }
  function emit() { window.dispatchEvent(new CustomEvent('dharma-audio', { detail: snapshot() })); }
  function hasCurrentAudio() { return !keepAliveActive && audioIndex === index && !!audio.getAttribute('src'); }
  function activeCue() { return activePackState?.cueByIndex?.get(index) || null; }
  function position() {
    if (!hasCurrentAudio() || !Number.isFinite(audio.currentTime)) return offset;
    if (activePackState) {
      const cue = activeCue();
      if (!cue) return offset;
      const seconds = Math.max(0, audio.currentTime - cue.start);
      return audio.readyState === 0 ? Math.max(offset, heardPosition, seconds) : Math.min(seconds, Math.max(0, cue.end - cue.start));
    }
    const seconds = Math.max(0, audio.currentTime - (recording ? queue[index]?.recordingStart || 0 : 0));
    // Before metadata arrives, the media clock is still zero even when resuming.
    return !recording && isServerVoice(settings.voice) && audio.readyState === 0 ? Math.max(offset, heardPosition, seconds) : seconds;
  }
  function currentDuration() {
    if (activePackState) {
      const cue = activeCue();
      if (cue) return Math.max(0.5, cue.end - cue.start);
    }
    if (hasCurrentAudio() && Number.isFinite(audio.duration) && audio.duration > 0.05) {
      const d = recording ? (queue[index + 1]?.recordingStart || audio.duration) - (queue[index]?.recordingStart || 0) : audio.duration;
      if (!recording && d > 0.1) segmentDurations.set(index, d);
      return d;
    }
    const known = segmentDurations.get(index);
    if (!recording && Number.isFinite(known) && known > 0.1) return Math.max(known, position() + 0.05);
    return Math.max(streamDuration || window.NarrationModel?.estimateSeconds?.(queue[index], 1) || 1, position() + 1);
  }
  function chapterInfo() {
    if (!queue.length) {
      return { chapterIndex: 0, chapterCount: 0, chapterTitle: '', startIndex: 0, endIndex: 0, chapterTime: 0, chapterDuration: 0, chapterEstimated: false };
    }
    if (recording) {
      const dur = currentDuration(), pos = Math.min(dur, position());
      return {
        chapterIndex: index,
        chapterCount: queue.length,
        chapterTitle: queue[index]?.heading || queue[index]?.text || '',
        startIndex: index,
        endIndex: index,
        chapterTime: pos,
        chapterDuration: dur,
        chapterEstimated: false,
      };
    }
    const raw = window.NarrationModel.chapterProgress(queue, chapters, index, position(), segmentDurations);
    const chKey = `${key}|${settings.voice}|${raw.chapterIndex}`;
    let dur = raw.chapterDuration;
    if (!raw.chapterEstimated) {
      smoothedChapter = { id: chKey, duration: dur };
    } else if (smoothedChapter.id === chKey && smoothedChapter.duration > 0) {
      if (Math.abs(dur - smoothedChapter.duration) >= 4.0) smoothedChapter.duration = dur;
      else dur = smoothedChapter.duration;
    } else {
      smoothedChapter = { id: chKey, duration: dur };
    }
    dur = Math.max(dur, raw.chapterTime + (index < raw.endIndex ? 0.5 : 0));
    return { ...raw, chapterDuration: Math.round(dur * 100) / 100 };
  }
  function snapshot() {
    const ch = chapterInfo();
    return {
      status, index, count: queue.length, key,
      currentText: queue[index]?.text || '',
      currentTime: position(),
      duration: currentDuration(),
      durationEstimated: !activePackState && hasCurrentAudio() && !Number.isFinite(audio.duration) && streamDuration > 0,
      chapterIndex: ch.chapterIndex,
      chapterCount: ch.chapterCount,
      chapterTitle: ch.chapterTitle,
      chapterStartIndex: ch.startIndex,
      chapterEndIndex: ch.endIndex,
      chapterTime: ch.chapterTime,
      chapterDuration: ch.chapterDuration,
      chapterEstimated: ch.chapterEstimated,
      voice: recording ? 'recorded:local' : settings.voice,
      voiceLabel: recording ? recording.narrator || 'Bản thu đã nhập' : currentVoiceLabel(),
      actualVoices: actualVoices.slice(),
      recorded: !!recording, recordingId: recording?.id || null,
      packActive: !!activePackState,
      fallbackVoiceActive: usedFallbackVoice,
      offlineVoiceAvailable: offlineEngineVoices.length > 0,
      rate: settings.rate, volume: audio.volume,
      repeatA, repeatB, repeatMode, repeatTarget, repeatCount,
      deadline, message,
      bufferedSeconds: bufferedAhead(),
      buffered: !!window.AudioService?.config.buffered,
    };
  }
  function save() {
    if (key && queue[index]) store.write((recording ? 'listen-recording:' + recording.id + ':' : 'listen:') + key, { block: queue[index].block, index, chunk: queue[index].chunk, sourceOffset: queue[index].sourceOffset, segmentation: window.NarrationModel.VERSION, seconds: position(), updatedAt: Date.now() });
  }
  function serviceNoteText() {
    if (recording) return 'Bản thu âm lưu trên thiết bị · ' + (recording.narrator || 'Người đọc chưa ghi');
    if (activePackState) return 'Gói âm thanh dựng sẵn liền mạch · Phát tức thì, không giật ngắt.';
    if (isPackOnlySelectedVoice()) return 'Gói giọng dựng sẵn trên máy chủ (0 MB RAM) · Tự động dùng giọng dự phòng với sách chưa dựng gói.';
    if (settings.voice.startsWith('offline:')) return 'Giọng AI Ngoại tuyến chạy trực tiếp trên máy chủ, hoạt động cả khi mất Internet.';
    if (settings.voice.startsWith('online:')) return 'Giọng trực tuyến cần Internet; tự động ưu tiên Gói âm thanh dựng sẵn & dự phòng AI Ngoại tuyến.';
    return 'Giọng tiếng Việt do trình duyệt cung cấp. Khả năng phát nền tùy thiết bị.';
  }
  function paint() {
    if (!$('audio-progress')) { emit(); return; }
    $('audio-sample').disabled = !!recording || !queue.length || !settings.voice;
    $('audio-voice').disabled = !!recording;
    $('audio-progress').disabled = !queue.length;
    $('audio-progress').max = Math.max(0, queue.length - 1);
    if (document.activeElement !== $('audio-progress')) $('audio-progress').value = index;
    if ($('audio-chapter') && document.activeElement !== $('audio-chapter')) {
      const opts = [...$('audio-chapter').options].map(o => Number(o.value)).filter(Number.isFinite);
      const best = opts.filter(v => v <= index).at(-1) ?? opts[0] ?? 0;
      $('audio-chapter').value = String(best);
    }
    if ($('audio-restart')) $('audio-restart').disabled = !queue.length;
    if ($('audio-current-text')) $('audio-current-text').textContent = queue[index]?.text || 'Mở một bản kinh tiếng Việt để bắt đầu nghe.';
    if ($('audio-retry')) $('audio-retry').hidden = !!settings.voice && status !== 'error';
    if ($('audio-service-note')) $('audio-service-note').textContent = serviceNoteText();
    // Update A-B repeat button state
    if ($('audio-repeat-ab')) $('audio-repeat-ab').textContent = repeatA < 0 ? 'Đánh dấu A' : repeatB < 0 ? 'Đánh dấu B' : 'Bỏ lặp A↔B';
    emit();
  }
  function stopWork(keepWarm = false, preserveSession = false) {
    generation++;
    clearTimeout(stallTimer); stallTimer = null;
    clearTimeout(transitionTimer); transitionTimer = null; completePlayback = null;
    activePackState = null;
    usedFallbackVoice = false;
    keepAliveActive = false;
    audio.loop = false;
    if (!keepWarm) {
      request?.abort(); request = null;
      pending.clear(); completing.clear(); prefetchFailures.clear();
      bufferGeneration++; warming = null;
      clearTimeout(warmTimer); warmTimer = null;
      releaseStitchedSlice();
      for (const [name, value] of prepared) if (!value.blob) deletePrepared(name);
    }
    audio.onended = null; audio.onerror = null; audio.onloadedmetadata = null;
    audio.onwaiting = null; audio.onstalled = null; audio.onplaying = null;
    audioIndex = -1;
    streamDuration = 0;
    actualVoices = [];
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    utterance = null;
    if (url) {
      const staleUrl = url;
      url = null;
      if (preserveSession) queueMicrotask(() => { try { URL.revokeObjectURL(staleUrl); } catch {} });
      else { try { URL.revokeObjectURL(staleUrl); } catch {} }
    }
    if (!preserveSession) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
  }
  function stop() { offset = position(); save(); stopWork(); status = 'idle'; clearInterval(timer); deadline = 0; paint(); }
  function pause() {
    if (status !== 'playing' && status !== 'loading') return;
    offset = position();
    save();
    keepAliveActive = false;
    audio.loop = false;
    if (hasCurrentAudio() && (status === 'playing' || audio.ended)) audio.pause();
    else stopWork();
    status = 'paused'; announce('Đã tạm dừng. Vị trí nghe được lưu trên thiết bị.'); paint();
  }
  function move(delta) { seekChunk(index + delta, 0, ['playing', 'loading'].includes(status)); }
  function currentVoiceLabel() {
    const online = engineVoices.find(v => 'online:' + v.id === settings.voice);
    if (online) return online.name + ' · Giọng tổng hợp';
    const offline = offlineEngineVoices.find(v => 'offline:' + v.id === settings.voice);
    if (offline) return offline.name + ' · Giọng tổng hợp';
    const packOnly = packOnlyVoices.find(v => 'offline:' + v.id === settings.voice);
    if (packOnly) return packOnly.name + ' · Gói dựng sẵn · Giọng tổng hợp';
    const device = deviceVoices.find(v => 'device:' + v.voiceURI === settings.voice);
    if (device) return device.name + ' (Thiết bị)';
    return '';
  }
  function voices() {
    deviceVoices = ('speechSynthesis' in window ? speechSynthesis.getVoices() : []).filter(v => /^vi(?:[-_]|$)/i.test(v.lang));
    const options = [
      ...offlineEngineVoices.map(v => ({ value: 'offline:' + v.id, label: v.name })),
      ...packOnlyVoices.map(v => ({ value: 'offline:' + v.id, label: v.name + ' · Gói dựng sẵn' })),
      ...(!offlineEngineVoices.length && !packOnlyVoices.length ? deviceVoices.map(v => ({ value: 'device:' + v.voiceURI, label: v.name + ' · Thiết bị' })) : [])
    ];

    const hasServerVoices = offlineEngineVoices.length > 0 || packOnlyVoices.length > 0;
    const isCurrentValid = options.some(v => v.value === settings.voice);
    const isDeviceVoice = typeof settings.voice === 'string' && settings.voice.startsWith('device:');

    const pendingServer = !voicesLoaded && isServerVoice(settings.voice);
    if ((!isCurrentValid && !pendingServer) || (hasServerVoices && (!settings.voice || (isDeviceVoice && !settings.userPickedDevice)))) {
      const defaultOffline = options.find(v => v.value === 'offline:vieneu-thien-tam-duc') || options.find(v => v.value.startsWith('offline:'));
      settings.voice = defaultOffline ? defaultOffline.value : (options[0]?.value || '');
    }

    if ($('audio-voice')) {
      $('audio-voice').replaceChildren(...options.map(v => new Option(v.label, v.value)));
      if (pendingServer && !isCurrentValid) $('audio-voice').add(new Option('Đang kết nối giọng đã chọn…', settings.voice));
      if (!options.length && !pendingServer) $('audio-voice').add(new Option('Chưa có giọng tiếng Việt', ''));
      $('audio-voice').value = settings.voice;
    }
    paint();
  }
  async function discoverVoices() {
    try {
      if (location.protocol !== 'file:') {
        const response = await fetch('/api/voices', { signal: AbortSignal.timeout(5000), cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          packsSupported = Number(data.audioVersion) >= 8;
          window.AudioService?.configure(data.audioConfig);
          if (data.audioConfig) store.write('audio-config', data.audioConfig);
          engineVoices = [];
          const seenOffline = new Set();
          const rawOffline = [
            ...(data.offlineAvailable && Array.isArray(data.offlineVoices) ? data.offlineVoices : []),
            ...(data.available !== false && Array.isArray(data.voices) ? data.voices : []),
          ];
          offlineEngineVoices = rawOffline.filter(v => allowedOfflineVoice(v) && !seenOffline.has(v.id) && seenOffline.add(v.id));
          packOnlyVoices = !offlineEngineVoices.length && Array.isArray(data.packVoices) ? data.packVoices.filter(allowedOfflineVoice) : [];
          voicesLoaded = true;
          store.write('audio-voices', []);
          store.write('audio-offline-voices', offlineEngineVoices);
          store.write('audio-pack-voices', packOnlyVoices);
        } else {
          window.LibraryConnection?.show('Địa chỉ hiện tại chưa có dịch vụ nghe kinh. Hãy mở thư viện đầy đủ.');
        }
      }
    } catch { /* Keep cached/device voices usable when offline. */ }
    voices();
    if ((offlineEngineVoices.length || packOnlyVoices.length) && settings.voice) store.write('audio-settings', settings);
    if (!settings.voice) announce('Chưa kết nối được giọng đọc. Nhấp đúp MO_THU_VIEN.cmd, rồi chọn Kết nối lại.');
  }

  function recordPackCueDurations(cues) {
    if (!Array.isArray(cues)) return;
    for (const c of cues) {
      if (Number.isInteger(c?.index) && Number.isFinite(c.end) && Number.isFinite(c.start) && c.end > c.start) {
        segmentDurations.set(c.index, Math.max(0.4, c.end - c.start));
      }
    }
  }
  function hasSavedOfflinePackSync() {
    const list = store.read('offline-packs', []);
    const saved = Array.isArray(list) ? list.find(x => x?.key === key) : null;
    return Boolean(saved && Array.isArray(saved.audio) && saved.audio.some(id => typeof id === 'string' && id.startsWith('packblob:')));
  }
  function canSkipPackLookupSync(voice) {
    return Boolean(
      packCache && !packCache.promise && packCache.key === key && packCache.docVersion === docVersion && packCache.voice === voice
      && (!packCache.packs?.length || packCache.disabled) && !hasSavedOfflinePackSync()
    );
  }
  function resolvePackSync(targetIndex, voice) {
    if (!canUseAudioPack() || hasSavedOfflinePackSync()) return null;
    if (!packCache || packCache.promise || packCache.disabled || packCache.key !== key || packCache.docVersion !== docVersion || packCache.voice !== voice) return null;
    const found = packCache.packs?.find(p => p.startIndex <= targetIndex && targetIndex <= p.endIndex);
    if (!found) return null;
    const cues = packCache.cuesByPack.get(found.id);
    if (!cues) return null;
    recordPackCueDurations(cues);
    return { ...found, cues, cueByIndex: new Map(cues.map(c => [c.index, c])) };
  }
  function canUseAudioPack() {
    if (!packsSupported || recording || !key || !docVersion || docEdited) return false;
    if (!isServerVoice(settings.voice)) return false;
    if (store.read('pronunciation', {})?.enabled) return false;
    if (packCache?.disabled && packCache.key === key && packCache.voice === settings.voice) return false;
    return true;
  }
  async function ensurePackManifest(voice, signal) {
    if (!canUseAudioPack()) return null;
    if (packCache && packCache.key === key && packCache.docVersion === docVersion && packCache.voice === voice) {
      return packCache.promise || packCache;
    }
    const state = { key, docVersion, voice, packs: [], cuesByPack: new Map(), disabled: false, promise: null };
    packCache = state;
    state.promise = (async () => {
      const manifest = await window.AudioService?.packManifest?.(key, docVersion, voice, signal);
      if (manifest?.available && Array.isArray(manifest.packs) && manifest.segmentation === window.NarrationModel.VERSION) {
        state.packs = manifest.packs;
      }
      state.promise = null;
      return state;
    })().catch(() => { state.promise = null; return state; });
    return state.promise;
  }
  async function resolvePackForIndex(targetIndex, voice, signal) {
    if (!canUseAudioPack()) return null;
    // 1. Check IndexedDB offline saved pack first (works 100% serverless offline!).
    if (window.LibraryOffline?.getPackForSegment && hasSavedOfflinePackSync()) {
      const savedPack = await LibraryOffline.getPackForSegment(key, docVersion, voice, targetIndex);
      if (savedPack && Array.isArray(savedPack.cues)) {
        recordPackCueDurations(savedPack.cues);
        return { ...savedPack, cueByIndex: new Map(savedPack.cues.map(c => [c.index, c])) };
      }
    }
    // 2. Check server / R2 CDN Chapter-Sprite pack manifest.
    const state = await ensurePackManifest(voice, signal);
    if (!state || state.disabled || !state.packs?.length) return null;
    const found = state.packs.find(p => p.startIndex <= targetIndex && targetIndex <= p.endIndex);
    if (!found) return null;
    let cues = state.cuesByPack.get(found.id);
    if (!cues) {
      const cuesData = await window.AudioService?.packCues?.(found.cuesUrl, found.fallbackCuesUrl, signal);
      if (!cuesData || (cuesData.docVersion && cuesData.docVersion !== docVersion)) return null;
      cues = cuesData.cues;
      state.cuesByPack.set(found.id, cues);
    }
    recordPackCueDurations(cues);
    return { ...found, cues, cueByIndex: new Map(cues.map(c => [c.index, c])) };
  }
  function warmNextPack(currentPack, voice) {
    if (!packCache?.packs?.length) return;
    const nextPack = packCache.packs.find(p => p.startIndex === currentPack.endIndex + 1);
    if (!nextPack || packCache.cuesByPack.has(nextPack.id)) return;
    void window.AudioService?.packCues?.(nextPack.cuesUrl, nextPack.fallbackCuesUrl).then(data => {
      if (data?.cues && packCache?.key === key) {
        packCache.cuesByPack.set(nextPack.id, data.cues);
        recordPackCueDurations(data.cues);
      }
    }).catch(() => {});
  }

  function initialize() {
    if (initialized) return;
    initialized = true;
    window.AudioService?.configure(store.read('audio-config', {}));
    if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', voices);
    voices();
    voiceDiscovery = discoverVoices();
    $('audio-rate').value = settings.rate;
    $('audio-rate-value').textContent = settings.rate + '×';
    const rateDescription = () => $('audio-rate').setAttribute('aria-valuetext', String(settings.rate).replace('.', ',') + ' lần');
    rateDescription(); $('audio-rate').addEventListener('input', () => $('audio-rate').setAttribute('aria-valuetext', $('audio-rate').value.replace('.', ',') + ' lần'));
    $('audio-follow').checked = settings.follow;
    if ($('audio-retry')) $('audio-retry').onclick = () => window.DharmaPlayerStore?.retry ? DharmaPlayerStore.retry() : retry();
    if ($('audio-restart')) $('audio-restart').onclick = restart;
    $('audio-progress').onchange = e => seekChunk(Number(e.target.value), 0, ['playing', 'loading'].includes(status));
    $('audio-voice').onchange = e => {
      const selectedVoice = e.target.value;
      if (!selectedVoice || selectedVoice === settings.voice) return;
      const resume = ['playing', 'loading', 'error'].includes(status) && queue.length > 0;
      pause();
      stopWork();
      packCache = null;
      segmentDurations.clear();
      smoothedChapter = { id: '', duration: 0 };
      releaseStitchedSlice();
      settings.voice = selectedVoice;
      settings.userPickedDevice = settings.voice.startsWith('device:');
      settings.userPickedOffline = settings.voice.startsWith('offline:');
      offset = 0;
      heardPosition = 0;
      status = queue.length ? 'paused' : 'idle';
      store.write('audio-settings', settings);
      paint();
      if (resume) void start();
    };
    $('audio-rate').onchange = e => { settings.rate = Number(e.target.value); audio.playbackRate = settings.rate; $('audio-rate-value').textContent = settings.rate + '×'; store.write('audio-settings', settings); if (settings.voice.startsWith('device:')) pause(); };
    $('audio-follow').onchange = e => {
      settings.follow = e.target.checked; store.write('audio-settings', settings);
      if (settings.follow && queue[index]) window.Reader?.followAudio(queue[index].block, queue[index].sourceOffset);
    };
    $('audio-sleep').onchange = e => {
      clearInterval(timer); deadline = Number(e.target.value) ? Date.now() + Number(e.target.value) * 60000 : 0;
      if (deadline) timer = setInterval(() => { if (Date.now() >= deadline) { pause(); clearInterval(timer); deadline = 0; $('audio-sleep').value = '0'; announce('Đã dừng theo hẹn giờ.'); } }, 1000);
    };
    $('audio-sample').onclick = () => {
      if (!queue.length || !settings.voice) return;
      // A sample is the first sentence of the selected passage; normal queue controls still apply.
      play(true);
    };
    if ($('audio-chapter')) $('audio-chapter').onchange = e => seekChapter(Number(e.target.value));
    if ($('audio-repeat-ab')) $('audio-repeat-ab').onclick = toggleRepeat;
    setInterval(() => {
      // Some browser media engines reach the end without delivering an ended event.
      if (['playing', 'loading'].includes(status) && hasCurrentAudio() && audio.ended) void completePlayback?.();
      if (status === 'playing') {
        listenElapsed++;
        paint();
      }
    }, 1000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && ['playing', 'loading'].includes(status)) {
        prefetchAhead();
        void maybeStitchUpcomingChapter();
      } else if (document.visibilityState === 'visible' && queue[index]) {
        if (settings.follow && status === 'playing') window.Reader?.followAudio(queue[index].block, queue[index].sourceOffset);
        paint();
      }
    });
    window.addEventListener('pagehide', stop);
  }
  async function start() {
    window.LibraryDiagnostics?.startAudio();
    const expectedKey = key, token = generation;
    await voiceDiscovery;
    if (key !== expectedKey || token !== generation) return;
    if (!queue.length) { announce('Bản kinh chưa sẵn sàng để nghe. Hãy đợi tải xong hoặc mở lại bản Việt.'); return; }
    if (!settings.voice && !recording) { status = 'error'; announce('Chưa có giọng đọc. Nhấp đúp MO_THU_VIEN.cmd rồi chọn Kết nối lại.'); paint(); return; }
    if (status === 'playing' || status === 'loading') return;
    if (status === 'paused' && hasCurrentAudio() && audio.ended && completePlayback) {
      status = 'loading'; paint();
      return completePlayback();
    }
    if (status === 'paused' && hasCurrentAudio() && !audio.ended) {
      status = 'loading'; paint();
      try {
        await audio.play();
        if (token !== generation) return;
        status = 'playing'; paint(); announce('Đang đọc tiếng Việt · ' + queue[index].text.slice(0, 70));
      } catch (error) {
        if (token !== generation) return;
        status = 'error'; paint(); announce(error.name === 'NotAllowedError' ? 'Nhấn Nghe tiếp để cho phép phát âm thanh.' : 'Chưa phát tiếp được. Nhấn Nghe tiếp để thử lại.');
      }
      return;
    }
    if (repeatTarget && repeatCount >= repeatTarget) repeatCount = 0;
    return play();
  }
  async function retry() {
    const expectedKey = key;
    offset = position(); save(); stopWork(); packCache = null;
    const token = generation;
    status = 'loading'; announce('Đang kết nối lại giọng đọc…'); paint();
    voiceDiscovery = discoverVoices(); await voiceDiscovery;
    if (key !== expectedKey || token !== generation) return;
    status = 'paused'; return start();
  }
  function useDeviceVoice() {
    const voice = deviceVoices[0];
    if (!voice) return false;
    save(); stopWork(); settings.voice = 'device:' + voice.voiceURI; settings.userPickedDevice = true; settings.userPickedOffline = false;
    offset = 0; status = 'paused'; store.write('audio-settings', settings); voices(); start(); return true;
  }
  function connect(doc, documentKey, emptyState = 'unavailable', force = false, resumePosition = null) {
    // Browsing a second book must not replace the independent listening session.
    if (!force && queue.length && ['playing', 'paused', 'loading'].includes(status)) return;
    stop(); recording = null; clearPrepared(); packCache = null;
    segmentDurations.clear(); smoothedChapter = { id: '', duration: 0 };
    key = documentKey; queue = []; chapters = []; index = 0; offset = 0;
    docVersion = doc?.version || '';
    docEdited = !!(doc?.blocks?.some(b => b.originalRaw !== undefined));
    listenElapsed = 0;
    repeatA = -1; repeatB = -1;
    repeatCount = 0;
    if (doc) {
      queue = window.NarrationModel.build(doc);
      chapters = window.NarrationModel.buildChapters(queue);
      const saved = resumePosition || store.read('listen:' + key, null);
      const notes = store.read('audio-notes:' + key, []);
      let legacy = [];
      if ((saved && saved.segmentation !== window.NarrationModel.VERSION) || notes.some(n => n.segmentation !== window.NarrationModel.VERSION)) {
        for (const block of doc.blocks) {
          if (['metadata', 'note', 'contents', 'running'].includes(block.kind)) continue;
          const text = plain(block.raw); if (!/[a-zA-ZÀ-ỹ]/.test(text)) continue;
          let cursor = 0;
          legacyChunks(text, 420).forEach((part, chunk) => { const sourceOffset = text.indexOf(part, cursor); cursor = sourceOffset + part.length; legacy.push({ block: block.id, chunk, sourceOffset }); });
        }
      }
      if (saved) {
        const sameVersion = saved.segmentation === window.NarrationModel.VERSION;
        const anchor = sameVersion ? saved : legacy.find(q => q.block === saved.block && q.chunk === saved.chunk) || saved;
        const i = window.NarrationModel.locate(queue, anchor.block, anchor.sourceOffset || 0);
        if (i >= 0) { index = i; offset = sameVersion ? Number(saved.seconds) || 0 : 0; }
      }
      if (notes.some(n => n.segmentation !== window.NarrationModel.VERSION)) {
        const migrated = notes.map(n => {
          if (n.segmentation === window.NarrationModel.VERSION) return n;
          const anchor = legacy[n.index];
          const target = anchor ? window.NarrationModel.locate(queue, anchor.block, anchor.sourceOffset) : -1;
          return target < 0 ? n : { ...n, legacyPosition: { index: n.index, seconds: n.seconds }, index: target, seconds: 0, segmentation: window.NarrationModel.VERSION };
        });
        // Never discard the old positions if the browser cannot write the backup.
        if (store.read('audio-notes-v1:' + key, null) || store.write('audio-notes-v1:' + key, notes)) store.write('audio-notes:' + key, migrated);
      }
      if (isServerVoice(settings.voice)) void ensurePackManifest(settings.voice);
    }
    status = 'idle'; paint();
    window.dispatchEvent(new CustomEvent('dharma-document', { detail: { key, chunks: queue.slice(), chapters: chapters.slice() } }));
    if ($('audio-sleep')) $('audio-sleep').value = '0';
    // Populate chapter selector
    renderChapterSelector();
    announce(!doc ? ({ loading: 'Đang tải bản Việt để chuẩn bị nghe…', error: 'Bản Việt chưa tải được. Khắc phục lỗi tải kinh rồi thử lại; đây không phải thông báo thiếu bản dịch.', unavailable: 'Tác phẩm này chưa có bản Việt để nghe.' }[emptyState] || 'Chưa sẵn sàng để nghe.') : settings.voice ? 'Đã sẵn sàng. Chọn Phát tiếng Việt để bắt đầu hoặc nghe tiếp từ vị trí đã lưu.' : 'Chưa có giọng tiếng Việt. Hãy mở thư viện bằng MO_THU_VIEN.cmd hoặc cài giọng tiếng Việt cho thiết bị.');
  }

  async function tryOfflineFallback() { return null; }

  async function tryOnlineFallbackForPackVoice() { return null; }

  async function play(sample = false, continuing = false) {
    if (!queue[index] || (!settings.voice && !recording)) return;
    const lockSafe = isIOSDevice() || document.visibilityState === 'hidden';
    stopWork(continuing, continuing); const token = generation; const current = queue[index];
    heardPosition = offset;
    status = 'loading'; paint(); announce('Đang chuẩn bị giọng đọc…');
    if (settings.follow) window.Reader?.followAudio(current.block, current.sourceOffset);
    let advanced = false;
    const ended = () => {
      if (token !== generation || status === 'paused' || advanced) return;
      advanced = true; completePlayback = null;
      const finished = { ...snapshot(), segment: { ...queue[index] } };
      offset = 0; audioIndex = -1;
      if (sample) { status = 'paused'; paint(); announce('Đã nghe thử. Nhấn Nghe tiếp để nghe kinh.'); return; }
      const bgNow = isIOSDevice() || document.visibilityState === 'hidden';
      // P9: A-B repeat — loop back to A when reaching B
      if (repeatA >= 0 && repeatB >= 0 && index >= repeatB) {
        repeatCount++;
        if (repeatTarget && repeatCount >= repeatTarget) { status = 'paused'; paint(); announce('Đã hoàn tất số biến tụng đã chọn.'); return; }
        index = repeatA; save();
        if (bgNow) { void play(false, true); return; }
        status = 'loading'; paint();
        transitionTimer = setTimeout(() => { if (token === generation) void play(false, true); }, 800); return;
      }
      if (index + 1 < queue.length) {
        index++; save();
        // Never use setTimeout across segments on iOS or hidden lock-screen tabs (prevents AVAudioSession drop).
        const gap = bgNow ? 0 : (queue[index]?.pauseBefore || 0);
        if (gap > 0) {
          status = 'loading'; paint();
          announce(queue[index]?.heading ? `Chuyển sang: ${queue[index].heading}` : 'Đang chuyển đoạn…');
          transitionTimer = setTimeout(() => { if (token === generation) void play(false, true); }, gap);
        } else {
          void play(false, true);
        }
      }
      else {
        // Publish the completed position before resetting or advancing a collection.
        window.dispatchEvent(new CustomEvent('dharma-listening-finished', { detail: finished }));
        if (repeatMode === 'one' || repeatTarget) {
          repeatCount++;
          if (!repeatTarget || repeatCount < repeatTarget) { index = 0; save(); void play(false, true); return; }
          status = 'paused'; index = 0; save(); paint(); announce('Đã hoàn tất số biến tụng đã chọn.'); return;
        }
        status = 'idle'; index = 0; offset = 0; save(); paint(); announce('Đã nghe hết bản kinh.');
        // Notify CollectionPlayer to advance to next sutra
        window.dispatchEvent(new CustomEvent('sutra-finished', { detail: { key } }));
      }
    };
    const failed = message => {
      if (token !== generation) return;
      offset = position();
      if (!recording && isServerVoice(settings.voice)) { offset = Math.max(offset, heardPosition); stopWork(); }
      save(); status = 'error'; paint(); announce(message);
    };
    const mountPackAndPlay = async (pack, isStitched = false) => {
      const cue = pack?.cueByIndex?.get(index);
      if (!pack || !cue) return false;
      activePackState = { ...pack, stitched: isStitched, sample, onSampleDone: ended };
      actualVoices = [settings.voice.replace(/^(?:online|offline):/, '').split(':')[0]];
      streamDuration = Math.max(0.5, cue.end - cue.start);
      const targetTime = Math.min(Math.max(cue.start, cue.start + offset), Math.max(cue.start, cue.end - 0.04));
      if (!isStitched) {
        if (url) { try { URL.revokeObjectURL(url); } catch {} url = null; }
        url = pack.blob ? URL.createObjectURL(pack.blob) : null;
      }
      let triedFallbackPackUrl = false;
      const applySeek = () => {
        if (token !== generation || !activePackState) return;
        const target = Number.isFinite(audio.duration) ? Math.min(targetTime, Math.max(0, audio.duration - 0.04)) : targetTime;
        if (Math.abs(audio.currentTime - target) > 0.05) audio.currentTime = target;
      };
      audio.onloadedmetadata = applySeek;
      audio.onerror = () => {
        if (token !== generation) return;
        if (!isStitched && !url && !triedFallbackPackUrl && pack.fallbackAudioUrl) {
          const fbHref = new URL(pack.fallbackAudioUrl, location.href).href;
          if (audio.src !== fbHref) {
            triedFallbackPackUrl = true;
            audio.src = pack.fallbackAudioUrl;
            audio.playbackRate = settings.rate;
            void audio.play().catch(() => {});
            return;
          }
        }
        if (isStitched) releaseStitchedSlice();
        else if (packCache && packCache.key === key) packCache.disabled = true;
        activePackState = null;
        offset = Math.max(offset, heardPosition);
        void play(sample, false);
      };
      completePlayback = audio.onended = () => {
        if (token !== generation || status === 'paused' || advanced) return;
        index = pack.endIndex;
        activePackState = null;
        ended();
      };
      keepAliveActive = false;
      audio.loop = false;
      audioIndex = index;
      audio.src = isStitched ? pack.objectUrl : (url || pack.audioUrl);
      audio.playbackRate = settings.rate;
      if (audio.readyState >= 1) applySeek();
      const playPromise = audio.play();
      if (isStitched) prefetchAhead();
      else warmNextPack(pack, settings.voice);
      await playPromise;
      if (token !== generation) return true;
      status = 'playing'; paint();
      announce('Đang đọc tiếng Việt · ' + current.text.slice(0, 70));
      return true;
    };
    if (recording) {
      try {
        url = URL.createObjectURL(recording.blob); audioIndex = index; audio.src = url; audio.playbackRate = settings.rate;
        audio.onloadedmetadata = () => { if (token === generation) audio.currentTime = Math.min(audio.duration - .05, (current.recordingStart || 0) + offset); };
        completePlayback = audio.onended = ended; audio.onerror = () => failed('Không đọc được bản thu. Hãy kiểm tra định dạng âm thanh.');
        await audio.play(); if (token !== generation) return; status = 'playing'; paint(); announce('Đang nghe bản thu · ' + (recording.narrator || 'Người đọc chưa ghi'));
      } catch (error) { if (token === generation) failed('Nhấn Phát để nghe bản thu đã nhập.'); }
    } else if (isServerVoice(settings.voice)) {
      request ||= new AbortController();
      // Pillar 1A: Zero-await synchronous Chapter-Sprite Pack or Stitched Chapter Slice handoff (crucial for iPhone Lock Screen!)
      if ((!sample || isPackOnlySelectedVoice()) && canUseAudioPack()) {
        const syncPack = resolvePackSync(index, settings.voice);
        if (syncPack?.cueByIndex?.has(index)) {
          try { if (await mountPackAndPlay(syncPack, false)) return; }
          catch (packError) {
            if (token !== generation || packError.name === 'AbortError') return;
            if (packError.name === 'NotAllowedError') { activePackState = null; failed('Nhấn Phát để cho phép trình duyệt phát âm thanh.'); return; }
            if (packCache && packCache.key === key) packCache.disabled = true;
            activePackState = null;
          }
        }
      }
      if (!sample && lockSafe && stitchedSlice && stitchedSlice.key === key && stitchedSlice.voice === settings.voice
          && stitchedSlice.startIndex <= index && index <= stitchedSlice.endIndex && stitchedSlice.objectUrl) {
        try { if (await mountPackAndPlay(stitchedSlice, true)) return; }
        catch (stitchErr) {
          if (token !== generation || stitchErr.name === 'AbortError') return;
          if (stitchErr.name === 'NotAllowedError') { activePackState = null; failed('Nhấn Phát để cho phép trình duyệt phát âm thanh.'); return; }
          releaseStitchedSlice();
          activePackState = null;
        }
      }
      // Pillar 1B: Async Chapter-Sprite Pack lookup (only when manifest/cues not yet cached in RAM)
      if ((!sample || isPackOnlySelectedVoice()) && canUseAudioPack() && !canSkipPackLookupSync(settings.voice)) {
        const pack = await resolvePackForIndex(index, settings.voice, request.signal).catch(() => null);
        if (token !== generation) return;
        if (pack?.cueByIndex?.has(index)) {
          try { if (await mountPackAndPlay(pack, false)) return; }
          catch (packError) {
            if (token !== generation || packError.name === 'AbortError') return;
            if (packError.name === 'NotAllowedError') { activePackState = null; failed('Nhấn Phát để cho phép trình duyệt phát âm thanh.'); return; }
            if (packCache && packCache.key === key) packCache.disabled = true;
            activePackState = null;
          }
        }
      }

      const voice = settings.voice, text = window.LibraryPronunciation?.prepare(current.text) || current.text;
      const cacheKey = voice + ':' + text;
      let descriptor, recovering = false, recovered = false, checkingEnd = false;
      const clearStall = () => { clearTimeout(stallTimer); stallTimer = null; };
      const recoverCurrent = async () => {
        if (token !== generation || recovering || status === 'paused' || status === 'error') return;
        clearStall();
        const bgRecover = isIOSDevice() || document.visibilityState === 'hidden';
        if (recovered && !bgRecover) { failed('Không tải lại được đoạn đang nghe. Nhấn Thử lại hoặc đổi giọng; vị trí nghe vẫn được giữ.'); return; }
        recovering = true;
        offset = Math.max(offset, position(), heardPosition);
        if (bgRecover) {
          const keepAlive = window.AudioService?.silentKeepAliveUrl?.();
          if (keepAlive) { keepAliveActive = true; audio.loop = true; audio.src = keepAlive; void audio.play().catch(() => {}); }
        } else {
          audio.pause();
          audio.removeAttribute('src'); audio.load();
        }
        audioIndex = -1; save();
        audio.onended = null; audio.onerror = null; audio.onwaiting = null; audio.onstalled = null; audio.onplaying = null;
        if (url) { URL.revokeObjectURL(url); url = null; }
        deletePrepared(cacheKey);
        status = 'loading'; paint(); announce('Đang tải lại đoạn đang nghe…');
        AudioService.report('recovery-start');
        request ||= new AbortController();
        try {
          const offline = await offlineAudio(text, voice);
          let result;
          try {
            result = offline ? { ...offline, seconds: offset } : await AudioService.recover(text, voice, offset, {
              signal: request.signal,
              retries: bgRecover ? 5 : 2,
              delayMs: 800,
            });
          } catch (recErr) {
            if (recErr.name === 'AbortError' || recErr.code === 'network-denied') throw recErr;
            const fb = await tryOfflineFallback(text, request.signal);
            if (!fb) throw recErr;
            result = { ...fb, seconds: offset };
          }
          if (token !== generation) return;
          descriptor = { blob: result.blob, actualVoices: result.actualVoices, activeVoice: result.activeVoice, isFallback: !!result.isFallback };
          offset = result.seconds;
          if (!descriptor.isFallback) {
            await recordBlobDuration(descriptor.blob, text, voice);
            descriptor.objectUrl = URL.createObjectURL(descriptor.blob);
            prepared.set(cacheKey, descriptor);
            trimPrepared();
          }
          recovered = true;
          usedFallbackVoice = !!descriptor.isFallback;
          await useSource();
          if (token !== generation) return;
          status = 'playing'; paint();
          announce(descriptor.isFallback ? 'Đang đọc tạm bằng Giọng AI Ngoại tuyến · ' + current.text.slice(0, 56) : 'Đã nghe tiếp từ vị trí đã lưu.');
          AudioService.report('recovery-success');
          if (!sample && !descriptor.isFallback) prefetchAhead();
        } catch (error) {
          if (token !== generation || error.name === 'AbortError') return;
          AudioService.report('recovery-failed');
          failed(error.name === 'NotAllowedError' ? 'Nhấn Nghe tiếp để cho phép phát âm thanh.' : 'Không tải lại được đoạn đang nghe. Nhấn Thử lại hoặc đổi giọng; vị trí nghe vẫn được giữ.');
        } finally { recovering = false; }
      };
      const armStall = () => {
        if (token !== generation || recovering || audio.paused && status === 'paused') return;
        if (stallTimer !== null) return;
        clearStall(); const before = position();
        stallTimer = setTimeout(() => {
          stallTimer = null;
          if (token !== generation || status === 'paused' || status === 'error') return;
          if (position() > before + .2 && !audio.ended) armStall();
          else void recoverCurrent();
        }, AudioService.config.stallTimeoutMs);
      };
      const useSource = () => {
        if (token !== generation) return Promise.resolve();
        keepAliveActive = false;
        audio.loop = false;
        streamDuration = descriptor.mediaDuration || descriptor.estimatedDuration || 0;
        if (descriptor.mediaDuration > 0.1) segmentDurations.set(index, descriptor.mediaDuration);
        actualVoices = Array.isArray(descriptor.actualVoices) ? descriptor.actualVoices.slice() : [];
        if (url) { URL.revokeObjectURL(url); url = null; }
        let mediaSrc;
        if (descriptor.objectUrl) {
          mediaSrc = descriptor.objectUrl;
        } else if (descriptor.blob) {
          url = URL.createObjectURL(descriptor.blob);
          mediaSrc = url;
        } else {
          mediaSrc = AudioService.streamURL(descriptor, 'foreground', !descriptor.progressiveStream && AudioService.config.buffered);
        }
        audio.onloadedmetadata = () => {
          if (token !== generation) return;
          if (Number.isFinite(audio.duration) && audio.duration > 0.1) segmentDurations.set(index, audio.duration);
          if (offset > 0) audio.currentTime = Number.isFinite(audio.duration) ? Math.min(offset, Math.max(0, audio.duration - .05)) : offset;
        };
        audio.onerror = () => void recoverCurrent(AudioService.mediaMessage(audio.error));
        audio.onwaiting = audio.onstalled = armStall;
        audio.onplaying = clearStall;
        completePlayback = audio.onended = async () => {
          if (token !== generation || recovering || status === 'paused' || checkingEnd || advanced) return;
          // Zero-await fast path when blob is already verified complete (preserves synchronous iOS Lock-Screen gesture/session!)
          if ((descriptor.blob || !descriptor.statusCheck) && window.AudioService?.completion === initialCompletionFn) {
            clearStall();
            ended();
            return;
          }
          checkingEnd = true;
          clearStall();
          try {
            const complete = await AudioService.completion(descriptor, { signal: request?.signal });
            if (token !== generation || status === 'paused') return;
            // Estimated speech length alone cannot prove truncation; use the synthesis job.
            if (!complete.complete) { await recoverCurrent(); return; }
            ended();
          } catch (error) { if (token === generation && status !== 'paused' && error.name !== 'AbortError') await recoverCurrent(); }
          finally { checkingEnd = false; }
        };
        audioIndex = index; audio.src = mediaSrc; audio.playbackRate = settings.rate;
        armStall();
        return audio.play();
      };
      try {
        const isIOS = isIOSDevice();
        // Pillar 2: Zero-await synchronous RAM fast-path when segment is already prefetched!
        const readyCached = !isPackOnlySelectedVoice() ? prepared.get(cacheKey) : null;
        if (readyCached?.blob && readyCached.objectUrl) {
          descriptor = readyCached;
          usedFallbackVoice = !!descriptor.isFallback;
          const playTask = useSource();
          if (!sample) prefetchAhead();
          await playTask;
          if (token !== generation || recovering || status === 'paused') return;
          status = 'playing'; paint();
          announce('Đang đọc tiếng Việt · ' + current.text.slice(0, 70));
          return;
        }
        // Pillar 3: Synchronous Silent Keep-Alive on locked iPhone when awaiting 4G network rebuffering!
        if (continuing && lockSafe) {
          const keepAlive = window.AudioService?.silentKeepAliveUrl?.();
          if (keepAlive) {
            keepAliveActive = true;
            audio.loop = true;
            audio.src = keepAlive;
            void audio.play().catch(() => {});
          }
        }
        if (isPackOnlySelectedVoice()) {
          const savedOffline = await offlineAudio(text, settings.voice);
          if (savedOffline) {
            descriptor = savedOffline;
          } else {
            const fbOnline = await tryOnlineFallbackForPackVoice(text, request?.signal);
            if (!fbOnline) throw Object.assign(new Error('Bản kinh này chưa có gói giọng dựng sẵn trên máy chủ.'), { code: 'offline-voice-unavailable', retryable: false });
            descriptor = fbOnline;
          }
        } else {
          // Buffer complete blobs for normal passages and prefetches; on single-worker VPS
          // (streamLongForeground), cold >220-char passages begin streaming as soon as clip 1 completes.
          const canStreamLong = AudioService.config.buffered && AudioService.config.progressive && AudioService.config.streamLongForeground && !isIOS && text.length > 220 && !prepared.get(cacheKey)?.blob;
          const firstStep = canStreamLong ? prepareAudio(current.text, settings.voice, 'foreground') : null;
          const ready = canStreamLong
            ? (async () => {
                const desc = await firstStep;
                if (desc.blob || desc.cached || !desc.statusCheck) return completeAudio(current.text, settings.voice, 'foreground');
                await AudioService.waitForAudio(desc, { signal: request?.signal, bufferSeconds: 11 });
                const st = await AudioService.completion(desc, { signal: request?.signal });
                if (st.complete) return completeAudio(current.text, settings.voice, 'foreground');
                return { ...desc, progressiveStream: true };
              })()
            : (AudioService.config.buffered ? completeAudio(current.text, settings.voice) : prepareAudio(current.text, settings.voice));
          if (!sample) prefetchAhead();
          try {
            descriptor = await ready;
          } catch (primaryErr) {
            if (token !== generation || primaryErr.name === 'AbortError' || primaryErr.code === 'network-denied') throw primaryErr;
            const fb = primaryErr.code === 'offline-voice-unavailable'
              ? await tryOnlineFallbackForPackVoice(text, request?.signal)
              : await tryOfflineFallback(text, request?.signal);
            if (!fb) throw primaryErr;
            descriptor = fb;
          }
        }
        if (token !== generation) return;
        usedFallbackVoice = !!descriptor.isFallback;
        if (isIOS && !descriptor.blob) descriptor.blob = await AudioService.download(descriptor, { signal: request?.signal, priority: 'foreground' });
        if (token !== generation) return;
        if (AudioService.config.buffered && !descriptor.progressiveStream && !descriptor.isFallback && !sample && !continuing && offset === 0) await waitForBuffer(token);
        if (token !== generation) return;
        await useSource();
        if (token !== generation || recovering || status === 'paused') return;
        status = 'playing'; paint();
        announce('Đang đọc tiếng Việt · ' + current.text.slice(0, 70));
      } catch (error) {
        if (token !== generation || error.name === 'AbortError' || recovering) return;
        if (error.name === 'NotAllowedError') { clearStall(); failed('Nhấn Phát để cho phép trình duyệt phát âm thanh.'); }
        else if (descriptor && !descriptor.isFallback) await recoverCurrent();
        else { clearStall(); failed(typeof error.code === 'string' && typeof error.retryable === 'boolean' ? error.message : 'Chưa phát được âm thanh. Nhấn Thử lại hoặc đổi giọng đọc.'); }
      }
    } else {
      const voice = deviceVoices.find(v => v.voiceURI === settings.voice.slice(7));
      if (!voice || !/^vi(?:[-_]|$)/i.test(voice.lang)) { failed('Giọng tiếng Việt không còn khả dụng. Hãy chọn lại giọng.'); return; }
      // Short utterances avoid the long-utterance limits of several browser engines.
      const sentences = chunks(window.LibraryPronunciation?.prepare(current.text) || current.text, 180); let sentence = 0;
      const speak = () => {
        if (token !== generation) return;
        utterance = new SpeechSynthesisUtterance(sentences[sentence]); utterance.voice = voice; utterance.lang = 'vi-VN'; utterance.rate = settings.rate; utterance.volume = audio.volume;
        utterance.onstart = () => { if (token === generation) { status = 'playing'; paint(); announce('Đang đọc bằng giọng tiếng Việt trên thiết bị.'); } };
        utterance.onend = () => { if (token !== generation) return; if (++sentence < sentences.length) speak(); else ended(); };
        utterance.onerror = e => { if (!['canceled', 'interrupted'].includes(e.error)) failed('Giọng thiết bị bị gián đoạn. Nhấn Nghe tiếp hoặc đổi giọng.'); };
        speechSynthesis.speak(utterance);
      };
      speak();
    }
  }
  async function recordBlobDuration(blob, preparedText, voice) {
    if (!(blob instanceof Blob) || !window.AudioService?.inspectBlob) return 0;
    const info = await window.AudioService.inspectBlob(blob);
    const dur = info?.duration || 0;
    if (dur > 0.05 && voice === settings.voice) {
      for (let i = 0; i < queue.length; i++) {
        const t = window.LibraryPronunciation?.prepare(queue[i].text) || queue[i].text;
        if (t === preparedText) segmentDurations.set(i, dur);
      }
    }
    return dur;
  }
  function prepareAudio(text, voice, priority = 'foreground') {
    text = window.LibraryPronunciation?.prepare(text) || text;
    const cacheKey = voice + ':' + text;
    if (prepared.has(cacheKey)) return Promise.resolve(prepared.get(cacheKey));
    if (pending.has(cacheKey)) return pending.get(cacheKey);
    request ||= new AbortController();
    const signal = request.signal, epoch = bufferGeneration;
    const task = fetchAudio(text, voice, signal, detail => {
      const currentText = window.LibraryPronunciation?.prepare(queue[index]?.text || '') || queue[index]?.text;
      if (epoch === bufferGeneration && !signal.aborted && status === 'loading' && settings.voice === voice && currentText === text) announce(detail.message);
    }, priority).then(async entry => {
      if (epoch === bufferGeneration && !signal.aborted) {
        if (entry?.blob) {
          entry.mediaDuration = await recordBlobDuration(entry.blob, text, voice);
          if (!entry.objectUrl) entry.objectUrl = URL.createObjectURL(entry.blob);
        }
        prepared.set(cacheKey, entry);
        trimPrepared();
      }
      return entry;
    }).finally(() => { if (pending.get(cacheKey) === task) pending.delete(cacheKey); });
    pending.set(cacheKey, task);
    return task;
  }
  function audioKey(text, voice = settings.voice) { return voice + ':' + (window.LibraryPronunciation?.prepare(text) || text); }
  function speechSeconds(segment) {
    return window.NarrationModel?.estimateSeconds ? window.NarrationModel.estimateSeconds(segment, settings.rate) : Math.max(1, (segment?.text || '').trim().split(/\s+/u).length / 3.15) / settings.rate;
  }
  function upcoming() {
    const config = window.AudioService?.config;
    if (!config?.prefetchDepth) return [];
    const list = []; let seconds = 0;
    const lockMode = isIOSDevice() || document.visibilityState === 'hidden';
    const limit = config.buffered ? (lockMode ? Math.max(config.prefetchMax, 36) : config.prefetchMax) : config.prefetchDepth;
    const targetBufferSec = lockMode ? Math.max(config.bufferSeconds, 180) : config.bufferSeconds;
    const startFrom = activePackState?.stitched ? activePackState.endIndex + 1 : index + 1;
    for (let i = startFrom; i < queue.length && list.length < limit; i++) {
      if (repeatB >= 0 && i > repeatB) break;
      list.push(queue[i]); seconds += speechSeconds(queue[i]);
      if (list.length >= config.prefetchDepth && seconds >= targetBufferSec) break;
    }
    return list;
  }
  function bufferedAhead() {
    if (!isServerVoice(settings.voice) || recording) return 0;
    let seconds = 0;
    if (activePackState && Number.isFinite(audio.currentTime)) {
      seconds += Math.max(0, (activePackState.duration || 0) - audio.currentTime);
      if (!activePackState.stitched) return Math.round(seconds);
    }
    for (const segment of upcoming()) {
      if (!prepared.get(audioKey(segment.text))?.blob) break;
      seconds += speechSeconds(segment);
    }
    return Math.round(seconds);
  }
  function trimPrepared() {
    const protectedKeys = new Set(queue.slice(Math.max(0, index - 1), index + 40).map(q => audioKey(q.text)));
    let bytes = [...prepared.values()].reduce((sum, value) => sum + (value.blob?.size || 0), 0);
    for (const [name, value] of prepared) {
      if (prepared.size <= 44 && bytes <= 24 * 1024 * 1024) break;
      if (protectedKeys.has(name) || completing.has(name)) continue;
      deletePrepared(name); bytes -= value.blob?.size || 0;
    }
  }
  async function maybeStitchUpcomingChapter() {
    if (!(isIOSDevice() || document.visibilityState === 'hidden')) return;
    if (!isServerVoice(settings.voice) || recording || stitchingPromise || !window.AudioService?.stitchBlobs) return;
    if (activePackState && !activePackState.stitched) return;
    const startIdx = activePackState?.stitched ? activePackState.endIndex + 1 : (['playing', 'loading'].includes(status) ? index + 1 : index);
    if (startIdx < 0 || startIdx >= queue.length) return;
    const ch = chapters.find(c => c.startIndex <= startIdx && startIdx <= c.endIndex);
    const maxEnd = Math.min(ch ? ch.endIndex : queue.length - 1, repeatB >= startIdx ? repeatB : queue.length - 1, startIdx + 39);
    const entries = [];
    for (let i = startIdx; i <= maxEnd; i++) {
      const entry = prepared.get(audioKey(queue[i].text));
      if (!(entry?.blob instanceof Blob)) break;
      entries.push({ index: i, blob: entry.blob, pauseBeforeMs: queue[i].pauseBefore || 0 });
    }
    if (entries.length < 2) return;
    const lastIdx = entries[entries.length - 1].index;
    if (stitchedSlice && stitchedSlice.key === key && stitchedSlice.voice === settings.voice
        && stitchedSlice.startIndex === startIdx && stitchedSlice.endIndex >= lastIdx) {
      return;
    }
    const snapKey = key, snapVoice = settings.voice, epoch = bufferGeneration;
    stitchingPromise = (async () => {
      try {
        const res = await window.AudioService.stitchBlobs(entries);
        if (!res || epoch !== bufferGeneration || snapKey !== key || snapVoice !== settings.voice) return;
        recordPackCueDurations(res.cues);
        const objectUrl = URL.createObjectURL(res.blob);
        releaseStitchedSlice();
        stitchedSlice = {
          key: snapKey,
          voice: snapVoice,
          startIndex: res.startIndex,
          endIndex: res.endIndex,
          duration: res.duration,
          objectUrl,
          cues: res.cues,
          cueByIndex: new Map(res.cues.map(c => [c.index, c])),
        };
      } catch { /* fallback cleanly to synchronous single-segment handoff */ }
      finally { stitchingPromise = null; }
    })();
    await stitchingPromise;
  }
  function completeAudio(text, voice, priority = 'foreground') {
    const cacheKey = audioKey(text, voice);
    if (prepared.get(cacheKey)?.blob) return Promise.resolve(prepared.get(cacheKey));
    if (completing.has(cacheKey)) return completing.get(cacheKey);
    const epoch = bufferGeneration;
    request ||= new AbortController(); const signal = request.signal;
    const lockRetry = isIOSDevice() || document.visibilityState === 'hidden';
    const task = (async () => {
      const descriptor = await prepareAudio(text, voice, priority);
      if (!descriptor.blob) {
        const blob = await AudioService.download(descriptor, {
          signal,
          priority,
          idleTimeoutMs: 45000,
          retries: lockRetry ? 4 : 2,
        });
        if (signal.aborted || epoch !== bufferGeneration) throw new DOMException('Đã dừng đệm âm thanh.', 'AbortError');
        descriptor.blob = blob;
      }
      if (signal.aborted || epoch !== bufferGeneration) throw new DOMException('Đã dừng đệm âm thanh.', 'AbortError');
      const normText = window.LibraryPronunciation?.prepare(text) || text;
      if (descriptor.blob && !descriptor.mediaDuration) {
        descriptor.mediaDuration = await recordBlobDuration(descriptor.blob, normText, voice);
      }
      if (descriptor.blob && !descriptor.objectUrl) descriptor.objectUrl = URL.createObjectURL(descriptor.blob);
      prepared.set(cacheKey, descriptor); prefetchFailures.delete(cacheKey); trimPrepared();
      void maybeStitchUpcomingChapter();
      return descriptor;
    })().finally(() => { if (completing.get(cacheKey) === task) completing.delete(cacheKey); });
    completing.set(cacheKey, task); return task;
  }
  function prefetchAhead() {
    if (!isServerVoice(settings.voice) || isPackOnlySelectedVoice() || (activePackState && !activePackState.stitched) || recording || !['playing', 'loading'].includes(status)) return;
    const epoch = bufferGeneration, voice = settings.voice;
    if (!warming || warming.epoch !== epoch) warming = { epoch, active: new Set() };
    const state = warming, candidates = upcoming();
    const concurrency = AudioService.config.buffered ? AudioService.config.prefetchConcurrency : 1;
    for (const next of candidates) {
      if (state.active.size >= concurrency) break;
      const cacheKey = audioKey(next.text, voice), failure = prefetchFailures.get(cacheKey);
      if (prepared.get(cacheKey)?.blob || state.active.has(cacheKey) || (failure && failure.at > Date.now())) continue;
      state.active.add(cacheKey);
      void completeAudio(next.text, voice, 'background').then(() => {
        if (epoch === bufferGeneration) emit();
      }).catch(error => {
        if (epoch !== bufferGeneration || error.name === 'AbortError') return;
        if (!prepared.get(cacheKey)?.blob) deletePrepared(cacheKey);
        const attempts = (prefetchFailures.get(cacheKey)?.attempts || 0) + 1;
        prefetchFailures.set(cacheKey, { attempts, at: Date.now() + Math.min(30000, 3000 * 2 ** attempts) });
      }).finally(() => {
        state.active.delete(cacheKey);
        if (warming !== state || epoch !== bufferGeneration) return;
        clearTimeout(warmTimer);
        // One failed prefetch must not block the later passages or create a retry storm.
        warmTimer = setTimeout(prefetchAhead, 100);
      });
    }
    if (!state.active.size && candidates.some(q => !prepared.get(audioKey(q.text, voice))?.blob)) {
      clearTimeout(warmTimer); warmTimer = setTimeout(prefetchAhead, 3000);
    } else if (!state.active.size) {
      void maybeStitchUpcomingChapter();
    }
  }
  async function waitForBuffer(token) {
    const config = AudioService.config;
    if (!config.prefetchDepth || !config.startupBufferSeconds || !upcoming().length) return;
    const target = Math.min(config.startupBufferSeconds, Math.round(upcoming().reduce((s, q) => s + speechSeconds(q), 0)));
    if (bufferedAhead() >= target) return;
    announce('Đang đệm trước để nghe liền mạch…');
    const until = Date.now() + config.startupWaitMs;
    while (token === generation && Date.now() < until && bufferedAhead() < target) {
      prefetchAhead(); await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  async function fetchAudio(text, voice, signal, onRetry, priority) {
    const offline = await offlineAudio(text, voice);
    if (offline) return offline;
    const localOfflineEngine = voice.startsWith('offline:') && ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
    if (!navigator.onLine && !localOfflineEngine) throw Object.assign(new Error('Đoạn này chưa được tải với giọng và cách phát âm hiện tại. Kết nối mạng để tải thêm chương nghe.'), { code: 'offline', retryable: false });
    return AudioService.prepare(text, voice, { signal, onRetry, priority });
  }
  async function offlineAudio(text, voice) {
    try {
      if (window.LibraryOffline?.getAudioInfo) return await LibraryOffline.getAudioInfo(text, voice);
      const blob = await window.LibraryOffline?.getAudio(text, voice);
      return blob ? { blob } : null;
    } catch { return null; }
  }
  function seekBlock(id, sourceOffset = 0) {
    const i = window.NarrationModel.locate(queue, id, sourceOffset);
    if (i >= 0) {
      seekChunk(i, 0, false);
      return true;
    }
    return false;
  }
  // P8: Chapter-based navigation with total section duration
  function renderChapterSelector() {
    const sel = $('audio-chapter'); if (!sel) return;
    sel.replaceChildren();
    const headingItems = [];
    queue.forEach((q, i) => { if (q.heading) headingItems.push({ index: i, title: q.heading }); });
    if (headingItems.length) {
      sel.disabled = false;
      headingItems.forEach((ch, idx) => {
        const endIdx = idx + 1 < headingItems.length ? headingItems[idx + 1].index - 1 : queue.length - 1;
        let sec = 0;
        for (let k = ch.index; k <= endIdx; k++) {
          sec += segmentDurations.get(k) || window.NarrationModel?.estimateSeconds?.(queue[k], 1) || 2;
        }
        sel.add(new Option(`${ch.title} · ~${fmtDuration(sec / settings.rate)}`, String(ch.index)));
      });
      return;
    }
    if (chapters.length > 1) {
      sel.disabled = false;
      chapters.forEach(ch => {
        sel.add(new Option(`${ch.title} · ~${fmtDuration(ch.baseDuration / settings.rate)}`, String(ch.startIndex)));
      });
      return;
    }
    const totalSec = chapters[0]?.baseDuration || queue.reduce((s, q) => s + (window.NarrationModel?.estimateSeconds?.(q, 1) || 2), 0);
    sel.add(new Option(queue.length ? `Toàn kinh · ~${fmtDuration(totalSec / settings.rate)}` : 'Toàn kinh', '0'));
    sel.disabled = true;
  }
  function seekChapter(chapterIndex) {
    if (chapterIndex >= 0 && chapterIndex < queue.length) {
      const resume = ['playing', 'loading'].includes(status);
      seekChunk(chapterIndex, 0, resume);
      if (!resume) announce(`Đã chọn: ${queue[chapterIndex]?.chapterTitle || queue[chapterIndex]?.heading || 'đoạn ' + (chapterIndex + 1)}. Nhấn Nghe tiếp để phát.`);
    }
  }
  function seekChapterTime(chapterSeconds, resume = ['playing', 'loading'].includes(status)) {
    if (!queue.length || (!isServerVoice(settings.voice) && !recording)) return;
    if (recording) {
      seekTime(chapterSeconds);
      return;
    }
    const ch = chapterInfo();
    const target = window.NarrationModel.locateInChapter(queue, chapters, ch.chapterIndex, chapterSeconds, segmentDurations);
    if (target.index === index && hasCurrentAudio()) {
      seekTime(target.seconds);
      if (resume && audio.paused) void start();
      return;
    }
    seekChunk(target.index, target.seconds, resume);
  }
  function skipSeconds(deltaSeconds) {
    if (!queue.length || (!isServerVoice(settings.voice) && !recording)) return;
    if (recording) {
      seekTime(position() + (Number(deltaSeconds) || 0));
      return;
    }
    const target = window.NarrationModel.locateByDelta(queue, index, position(), deltaSeconds, segmentDurations);
    if (target.index === index && hasCurrentAudio()) {
      seekTime(target.seconds);
      return;
    }
    seekChunk(target.index, target.seconds, ['playing', 'loading'].includes(status));
  }
  function nextChapter() {
    if (!queue.length) return false;
    const resume = ['playing', 'loading'].includes(status);
    if (recording) {
      if (index + 1 < queue.length) { seekChunk(index + 1, 0, resume); return true; }
      return false;
    }
    const ch = chapterInfo();
    if (ch.chapterIndex + 1 < chapters.length) {
      const nextCh = chapters[ch.chapterIndex + 1];
      seekChunk(nextCh.startIndex, 0, resume);
      return true;
    }
    return false;
  }
  function prevChapter() {
    if (!queue.length) return false;
    const resume = ['playing', 'loading'].includes(status);
    if (recording) {
      if (position() > 5 || index === 0) seekChunk(index, 0, resume);
      else seekChunk(index - 1, 0, resume);
      return true;
    }
    const ch = chapterInfo();
    if (ch.chapterTime > 5 || ch.chapterIndex === 0) {
      seekChunk(ch.startIndex, 0, resume);
      return true;
    }
    const prevCh = chapters[ch.chapterIndex - 1];
    seekChunk(prevCh.startIndex, 0, resume);
    return true;
  }
  // P9: A-B Repeat
  function toggleRepeat() {
    if (repeatA < 0) { repeatA = index; announce('Đã đánh dấu điểm A. Chọn đoạn kết thúc rồi đánh dấu B.'); }
    else if (repeatB < 0) { repeatB = index; if (repeatB <= repeatA) { repeatB = -1; announce('Điểm B phải sau điểm A.'); return; } announce(`Lặp đoạn ${repeatA + 1} → ${repeatB + 1}. Nhấn lại để bỏ lặp.`); }
    else { repeatA = -1; repeatB = -1; announce('Đã bỏ lặp A↔B.'); }
    paint();
  }
  function seekChunk(value, seconds = 0, resume = true) {
    if (!queue.length) return;
    const nextIndex = Math.max(0, Math.min(queue.length - 1, Number(value) || 0));
    const nextSeconds = Math.max(0, Number(seconds) || 0);
    // Instant in-pack seek (<5ms) when target segment belongs to the active Chapter-Sprite pack!
    if (activePackState && audio.getAttribute('src') && audio.readyState >= 1
        && activePackState.startIndex <= nextIndex && nextIndex <= activePackState.endIndex) {
      const cue = activePackState.cueByIndex.get(nextIndex);
      if (cue) {
        index = nextIndex;
        audioIndex = nextIndex;
        offset = nextSeconds;
        heardPosition = nextSeconds;
        streamDuration = Math.max(0.5, cue.end - cue.start);
        audio.currentTime = Math.min(Math.max(cue.start, cue.start + nextSeconds), Math.max(cue.start, cue.end - 0.04));
        if (settings.follow && queue[index]) window.Reader?.followAudio(queue[index].block, queue[index].sourceOffset);
        if (!resume) {
          audio.pause();
          status = 'paused';
        } else if (audio.paused) {
          status = 'loading';
          void audio.play().then(() => { status = 'playing'; paint(); }).catch(() => {});
        } else {
          status = 'playing';
        }
        save(); paint();
        return;
      }
    }
    stopWork();
    index = nextIndex; offset = nextSeconds; status = 'paused'; save(); paint();
    if (resume) start();
  }
  function restart() {
    if (!queue.length) return;
    repeatA = -1; repeatB = -1; repeatCount = 0; listenElapsed = 0;
    seekChunk(0, 0);
  }
  function seekTime(seconds) {
    if (!isServerVoice(settings.voice) && !recording) return;
    if (activePackState && audio.src) {
      const cue = activeCue();
      if (!cue) return;
      audio.currentTime = Math.max(cue.start, Math.min(Math.max(cue.start, cue.end - 0.04), cue.start + Math.max(0, Number(seconds) || 0)));
      offset = position(); heardPosition = offset; save(); emit();
      return;
    }
    const available = Number.isFinite(audio.duration) ? audio.duration : audio.buffered.length ? audio.buffered.end(audio.buffered.length - 1) : 0;
    if (available > 0 && audio.src) { audio.currentTime = Math.max(0, Math.min(available - .05, seconds + (recording ? queue[index]?.recordingStart || 0 : 0))); offset = position(); heardPosition = offset; save(); emit(); }
  }
  function setVolume(value) { audio.volume = Math.max(0, Math.min(1, Number(value))); if (utterance) utterance.volume = audio.volume; emit(); }
  async function loadRecording(blob, documentKey, info, resumePosition = null) {
    initialize(); stop(); recording = { ...info, blob }; key = documentKey;
    segmentDurations.clear(); smoothedChapter = { id: '', duration: 0 };
    queue = (info.chapters?.length ? info.chapters : [{ title: info.title || 'Bản thu âm', seconds: 0 }]).map((c, i, arr) => ({
      text: c.title, heading: c.title, chapterTitle: c.title, chapterIndex: i, chapterCount: arr.length,
      kind: 'recording', recordingStart: c.seconds, block: 'recording-' + i, chunk: 0, sourceOffset: 0
    }));
    chapters = queue.map((q, i) => ({ chapterIndex: i, chapterCount: queue.length, title: q.title || q.heading, startIndex: i, endIndex: i, segmentCount: 1, baseDuration: 0 }));
    const saved = store.read('listen-recording:' + info.id + ':' + key, null);
    index = Math.min(queue.length - 1, saved?.index || 0); offset = saved?.seconds || 0;
    if (resumePosition) { index = Math.max(0, Math.min(queue.length - 1, Number(resumePosition.index) || 0)); offset = Math.max(0, Number(resumePosition.seconds) || 0); }
    repeatA = -1; repeatB = -1; repeatCount = 0; status = 'paused';
    window.dispatchEvent(new CustomEvent('dharma-document', { detail: { key, chunks: queue.slice(), chapters: chapters.slice() } })); paint();
    return start();
  }
  function setRepeat(mode, target = 0) { repeatMode = mode; repeatTarget = Math.max(0, Number(target) || 0); repeatCount = 0; paint(); }
  function findPackCueAtTime(pack, seconds) {
    const cues = pack?.cues;
    if (!cues?.length) return null;
    let lo = 0, hi = cues.length - 1, best = cues[0];
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (cues[mid].start <= seconds + 0.02) { best = cues[mid]; lo = mid + 1; }
      else hi = mid - 1;
    }
    return best;
  }
  audio.addEventListener('timeupdate', () => {
    if (hasCurrentAudio() && !audio.error) heardPosition = position();
    if (activePackState && audio.src && status === 'playing' && Number.isFinite(audio.currentTime)) {
      const t = audio.currentTime;
      if (activePackState.sample) {
        const curCue = activeCue();
        if (curCue && t >= (curCue.speechEnd || curCue.end) - 0.04) {
          const doneSample = activePackState.onSampleDone;
          audio.pause();
          activePackState = null;
          doneSample?.();
          return;
        }
      }
      if (repeatA >= 0 && repeatB >= 0) {
        const endCue = activePackState.cueByIndex.get(repeatB);
        if ((endCue && t >= endCue.end - 0.04) || index > repeatB) {
          repeatCount++;
          if (repeatTarget && repeatCount >= repeatTarget) { pause(); announce('Đã hoàn tất số biến tụng đã chọn.'); return; }
          seekChunk(repeatA, 0, true);
          return;
        }
      }
      const matchedCue = findPackCueAtTime(activePackState, t);
      if (matchedCue && matchedCue.index !== index) {
        index = matchedCue.index;
        audioIndex = index;
        offset = 0;
        heardPosition = 0;
        streamDuration = Math.max(0.5, matchedCue.end - matchedCue.start);
        save();
        if (settings.follow && queue[index]) window.Reader?.followAudio(queue[index].block, queue[index].sourceOffset);
        announce('Đang đọc tiếng Việt · ' + (queue[index]?.text || '').slice(0, 70));
        paint();
        return;
      }
    }
    if (recording && audio.src && status === 'playing') {
      const next = queue.findLastIndex(q => q.recordingStart <= audio.currentTime);
      if (repeatA >= 0 && repeatB >= 0 && next > repeatB) { repeatCount++; if (repeatTarget && repeatCount >= repeatTarget) { pause(); return; } seekChunk(repeatA, 0, true); return; }
      if (next >= 0 && next !== index) { index = next; audioIndex = index; save(); }
    }
    emit();
  });
  audio.addEventListener('loadedmetadata', emit);
  audio.addEventListener('durationchange', emit);
  audio.addEventListener('waiting', () => { if (status === 'playing' && hasCurrentAudio()) { status = 'loading'; paint(); announce('Đang tải tiếp âm thanh…'); } });
  audio.addEventListener('playing', () => { if (status === 'loading' && hasCurrentAudio()) { status = 'playing'; paint(); } });
  window.Audiobook = {
    initialize, connect, stop, pause, play, start, retry, useDeviceVoice, restart,
    seekBlock, seekChapter, seekChapterTime, skipSeconds, nextChapter, prevChapter, seekChunk, seekTime,
    setVolume, setRepeat, loadRecording, renderChapterSelector, toggleRepeat, plain, chunks,
    get state() { return { ...snapshot(), deviceVoiceAvailable: deviceVoices.length > 0 }; },
    get segments() { return queue.slice(); },
    get chapters() { return chapters.slice(); },
  };
})();

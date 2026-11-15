/* Native iOS, Android (Capacitor) & Windows PC Store (Tauri v2) Bridge:
 * Lock-screen / SystemMediaTransportControls audio, On-Device VieNeu-Nano AI TTS & SQLite Offline Vault.
 * Completely inert on standard Web / Local PC / VPS browsers. */
(() => {
  'use strict';

  const DEFAULT_REMOTE_SERVER = 'https://thuvienchanhphap.duckdns.org';
  const isTauriDesktop = () => Boolean(
    window.__TAURI_INTERNALS__ || window.__TAURI__ || window.__CHANH_PHAP_TAURI_SIM__
  );
  const isNativePlatform = () => Boolean(
    window.Capacitor?.isNativePlatform?.() || window.__CHANH_PHAP_MOBILE_SIM__ || isTauriDesktop()
  );

  if (!isNativePlatform()) {
    window.MobileBridge = { isNative: false };
    return;
  }

  const runningOnDesktop = isTauriDesktop();
  document.documentElement.dataset.nativeApp = 'true';
  if (runningOnDesktop) {
    document.documentElement.dataset.nativeDesktop = 'true';
  }

  const nativeFetch = window.fetch.bind(window);
  let tauriEngineSingleton = null;

  function getTauriBridge() {
    if (window.__CHANH_PHAP_TAURI_SIM__) return window.__CHANH_PHAP_TAURI_SIM__;
    const invoke = window.__TAURI__?.core?.invoke || window.__TAURI_INTERNALS__?.invoke;
    const listen = window.__TAURI__?.event?.listen;
    return invoke ? { invoke: invoke.bind(window.__TAURI__?.core || window.__TAURI_INTERNALS__), listen } : null;
  }

  function base64ToBlobUrl(b64, mime = 'audio/wav') {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  }

  function createTauriEngineAdapter() {
    const bridge = getTauriBridge();
    const listeners = new Map();
    const emit = (event, payload) => {
      (listeners.get(event) || []).forEach(cb => {
        try { cb(payload); } catch { /* ignore listener error */ }
      });
    };

    if (bridge?.listen) {
      bridge.listen('downloadProgress', ev => emit('downloadProgress', ev?.payload || ev)).catch?.(() => {});
    }

    const audioEl = new Audio();
    audioEl.preload = 'auto';
    const blobCache = new Map();
    let runGeneration = 0;

    const q = {
      bookKey: '',
      bookTitle: '',
      remoteBaseUrl: DEFAULT_REMOTE_SERVER,
      voice: 'vieneu-thien-tam-duc',
      rate: 0.95,
      index: 0,
      currentTime: 0,
      duration: 1,
      status: 'idle',
      packActive: false,
      repeatMode: 'off',
      repeatTarget: 0,
      repeatCount: 0,
      repeatA: -1,
      repeatB: -1,
      sleepDeadlineMs: 0,
      segments: [],
    };

    const voiceDisplayName = v => (
      String(v || '').includes('thuc-doan') ? 'Thục Đoan · AI Nội Bộ' : 'Thiền Tâm Đức · AI Nội Bộ'
    );

    const clearBlobCache = () => {
      for (const p of blobCache.values()) {
        Promise.resolve(p).then(entry => {
          if (entry?.url?.startsWith('blob:')) URL.revokeObjectURL(entry.url);
        }).catch(() => {});
      }
      blobCache.clear();
    };

    const emitPlayback = (extra = {}) => {
      const payload = {
        bookKey: q.bookKey,
        status: q.status,
        index: q.index,
        currentTime: q.currentTime,
        duration: q.duration,
        voice: q.voice,
        voiceLabel: voiceDisplayName(q.voice),
        packActive: q.packActive,
        ...extra,
      };
      emit('playbackState', payload);
    };

    const syncWindowsMediaSession = () => {
      if (!('mediaSession' in navigator)) return;
      const seg = q.segments[q.index];
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: seg?.heading || q.bookTitle || 'Thư Viện Chánh Pháp',
          artist: voiceDisplayName(q.voice),
          album: q.bookTitle ? `${q.bookTitle} · Đại Thư Viện Chánh Pháp` : 'Đại Thư Viện Chánh Pháp',
        });
        navigator.mediaSession.playbackState = q.status === 'playing' ? 'playing' : q.status === 'paused' ? 'paused' : 'none';
      } catch { /* ignore unsupported metadata fields */ }
    };

    const resolveSegmentAudio = idx => {
      const seg = q.segments[idx];
      if (!seg?.text) return Promise.resolve(null);
      const cacheKey = `${q.voice}|${q.rate.toFixed(2)}|${idx}|${seg.text.slice(0, 48)}`;
      if (blobCache.has(cacheKey)) return blobCache.get(cacheKey);

      const promise = (async () => {
        // Tier 1: Native Windows Rust ONNX VieNeu-Nano synthesis
        if (bridge?.invoke) {
          try {
            const res = await bridge.invoke('tts_synthesize', {
              text: seg.text,
              voice: q.voice,
              speed: q.rate,
            });
            if (res?.wavBase64) {
              return { url: base64ToBlobUrl(res.wavBase64, 'audio/wav'), packActive: true };
            }
          } catch { /* fall through to Tier 1.5 */ }
        }
        // Tier 1.5: Pre-downloaded offline chapter audio in LibraryOffline IndexedDB
        if (window.LibraryOffline?.getAudio) {
          const savedBlob = await window.LibraryOffline.getAudio(seg.text, 'offline:' + q.voice).catch(() => null)
            || await window.LibraryOffline.getAudio(seg.text, 'online:' + q.voice).catch(() => null);
          if (savedBlob instanceof Blob && savedBlob.size > 256) {
            return { url: URL.createObjectURL(savedBlob), packActive: true };
          }
        }
        // Tier 2: Remote VPS /api/tts stream
        if (navigator.onLine !== false) {
          const resp = await nativeFetch(`${q.remoteBaseUrl}/api/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: seg.text, voice: q.voice, stream: false }),
          });
          if (resp.ok) {
            const blob = await resp.blob();
            return { url: URL.createObjectURL(blob), packActive: false };
          }
        }
        return null;
      })();

      blobCache.set(cacheKey, promise);
      if (blobCache.size > 12) {
        const oldest = blobCache.keys().next().value;
        const oldP = blobCache.get(oldest);
        blobCache.delete(oldest);
        Promise.resolve(oldP).then(e => {
          if (e?.url?.startsWith('blob:')) URL.revokeObjectURL(e.url);
        }).catch(() => {});
      }
      return promise;
    };

    const playSegmentAt = async (idx, startSec = 0) => {
      const gen = ++runGeneration;
      if (!q.segments.length || idx < 0 || idx >= q.segments.length) {
        q.status = 'idle';
        emitPlayback({ finished: true });
        syncWindowsMediaSession();
        return;
      }
      if (q.sleepDeadlineMs > 0 && Date.now() >= q.sleepDeadlineMs) {
        q.sleepDeadlineMs = 0;
        q.status = 'paused';
        audioEl.pause();
        emitPlayback({ message: 'Đã dừng theo hẹn giờ nghỉ.' });
        syncWindowsMediaSession();
        return;
      }

      q.index = idx;
      q.currentTime = startSec;
      q.status = 'loading';
      emitPlayback();

      // Prefetch current + next 2 segments on Rust background thread
      const currentAudio = await resolveSegmentAudio(idx);
      if (gen !== runGeneration) return;
      if (idx + 1 < q.segments.length) void resolveSegmentAudio(idx + 1);
      if (idx + 2 < q.segments.length) void resolveSegmentAudio(idx + 2);

      if (currentAudio?.url) {
        q.packActive = Boolean(currentAudio.packActive);
        audioEl.src = currentAudio.url;
        audioEl.playbackRate = 1.0;
        if (startSec > 0) {
          audioEl.addEventListener('loadedmetadata', () => {
            if (gen === runGeneration && startSec < (audioEl.duration || 0)) {
              audioEl.currentTime = startSec;
            }
          }, { once: true });
        }
        try {
          await audioEl.play();
          if (gen !== runGeneration) return;
          q.status = 'playing';
          q.duration = Number.isFinite(audioEl.duration) && audioEl.duration > 0 ? audioEl.duration : 1;
          syncWindowsMediaSession();
          emitPlayback();
          return;
        } catch { /* fallback to SAPI5 below if blocked */ }
      }

      // Tier 3: Windows built-in SpeechSynthesis (OneCore/SAPI5) offline fallback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(q.segments[idx].text);
        u.lang = 'vi-VN';
        u.rate = Math.max(0.65, Math.min(1.5, q.rate));
        q.packActive = false;
        q.status = 'playing';
        q.duration = Math.max(2, Math.round(q.segments[idx].text.length / 13));
        syncWindowsMediaSession();
        emitPlayback();
        u.onend = () => { if (gen === runGeneration) advanceSegment(); };
        window.speechSynthesis.speak(u);
      } else {
        q.status = 'error';
        emitPlayback({ message: 'Hãy tải Gói Giọng Đọc AI Nội Bộ trong Kho Ngoại Tuyến hoặc bật mạng.' });
      }
    };

    const advanceSegment = () => {
      const a = q.repeatA >= 0 ? q.repeatA : 0;
      const b = q.repeatB >= a ? q.repeatB : q.segments.length - 1;
      if (q.repeatA >= 0 && q.repeatB >= q.repeatA && q.index >= b) {
        q.repeatCount += 1;
        if (q.repeatTarget > 0 && q.repeatCount >= q.repeatTarget) {
          q.repeatA = -1; q.repeatB = -1; q.repeatCount = 0;
        } else {
          void playSegmentAt(a, 0);
          return;
        }
      }
      if (q.index + 1 < q.segments.length) {
        void playSegmentAt(q.index + 1, 0);
        return;
      }
      if (q.repeatMode === 'one' || q.repeatMode === 'all') {
        q.repeatCount += 1;
        if (q.repeatTarget <= 0 || q.repeatCount < q.repeatTarget) {
          void playSegmentAt(0, 0);
          return;
        }
      }
      q.status = 'idle';
      syncWindowsMediaSession();
      emitPlayback({ finished: true });
    };

    audioEl.addEventListener('timeupdate', () => {
      if (q.status !== 'playing') return;
      q.currentTime = audioEl.currentTime || 0;
      q.duration = Number.isFinite(audioEl.duration) && audioEl.duration > 0 ? audioEl.duration : q.duration;
      emitPlayback();
    });
    audioEl.addEventListener('ended', () => advanceSegment());

    if ('mediaSession' in navigator) {
      const safeSet = (action, fn) => {
        try { navigator.mediaSession.setActionHandler(action, fn); } catch { /* ignore */ }
      };
      safeSet('play', () => void adapter.startQueue(null));
      safeSet('pause', () => void adapter.pauseQueue());
      safeSet('previoustrack', () => void playSegmentAt(Math.max(0, q.index - 1), 0));
      safeSet('nexttrack', () => void playSegmentAt(Math.min(q.segments.length - 1, q.index + 1), 0));
      safeSet('seekbackward', () => { audioEl.currentTime = Math.max(0, (audioEl.currentTime || 0) - 10); });
      safeSet('seekforward', () => { audioEl.currentTime = Math.min(audioEl.duration || 0, (audioEl.currentTime || 0) + 10); });
    }

    const adapter = {
      addListener(event, cb) {
        if (!listeners.has(event)) listeners.set(event, []);
        listeners.get(event).push(cb);
        return { remove: () => {} };
      },
      getManuscript: opts => bridge?.invoke?.('vault_get_manuscript', { url: opts?.url || '' }),
      cacheManuscript: opts => bridge?.invoke?.('vault_cache_manuscript', { url: opts?.url || '', content: opts?.content || '' }),
      searchVault: opts => bridge?.invoke?.('vault_search', {
        query: opts?.q || '',
        collection: opts?.collection || '',
        mode: opts?.mode || '',
        offset: Number(opts?.offset) || 0,
      }),
      getVaultStatus: () => bridge?.invoke?.('vault_status', {}),
      downloadPack: opts => bridge?.invoke?.('vault_download_pack', {
        id: opts?.id || '',
        kind: opts?.kind || '',
        remoteBaseUrl: opts?.remoteBaseUrl || DEFAULT_REMOTE_SERVER,
      }),
      removePack: opts => bridge?.invoke?.('vault_remove_pack', { id: opts?.id || '', kind: opts?.kind || '' }),
      async scheduleDailyPracticeReminder(opts) {
        window.LibraryStore?.write?.('desktop-daily-reminder', opts);
        return { scheduled: Boolean(opts?.enabled) };
      },
      async startQueue(opts) {
        if (opts && Array.isArray(opts.segments) && opts.segments.length) {
          if (opts.bookKey !== q.bookKey || opts.voice !== q.voice || opts.rate !== q.rate) {
            clearBlobCache();
          }
          q.bookKey = opts.bookKey || q.bookKey;
          q.bookTitle = opts.bookTitle || q.bookTitle;
          q.remoteBaseUrl = opts.remoteBaseUrl || q.remoteBaseUrl;
          q.voice = opts.voice || q.voice;
          q.rate = Number(opts.rate) || 0.95;
          q.repeatMode = opts.repeatMode || 'off';
          q.repeatTarget = Number(opts.repeatTarget) || 0;
          q.repeatA = Number(opts.repeatA ?? -1);
          q.repeatB = Number(opts.repeatB ?? -1);
          q.sleepDeadlineMs = Number(opts.sleepDeadlineMs) || 0;
          q.segments = opts.segments;
          await playSegmentAt(Number(opts.startIndex) || 0, Number(opts.startSeconds) || 0);
          return;
        }
        if (q.status === 'paused' && audioEl.src) {
          await audioEl.play();
          q.status = 'playing';
          syncWindowsMediaSession();
          emitPlayback();
        } else if (q.segments.length) {
          await playSegmentAt(q.index, q.currentTime);
        }
      },
      async pauseQueue() {
        runGeneration += 1;
        audioEl.pause();
        window.speechSynthesis?.cancel?.();
        q.status = 'paused';
        syncWindowsMediaSession();
        emitPlayback();
      },
      async stopQueue() {
        runGeneration += 1;
        audioEl.pause();
        audioEl.removeAttribute('src');
        window.speechSynthesis?.cancel?.();
        clearBlobCache();
        q.status = 'idle';
        q.currentTime = 0;
        syncWindowsMediaSession();
        emitPlayback();
      },
      async seekQueue(opts) {
        const nextIdx = Math.max(0, Math.min(Math.max(0, q.segments.length - 1), Number(opts?.index ?? q.index)));
        const sec = Math.max(0, Number(opts?.seconds) || 0);
        if (opts?.resume === false) {
          q.index = nextIdx;
          q.currentTime = sec;
          emitPlayback();
          return;
        }
        await playSegmentAt(nextIdx, sec);
      },
      async updateQueueOptions(opts) {
        if (!opts) return;
        if (opts.rate != null) q.rate = Number(opts.rate) || 0.95;
        if (opts.repeatMode != null) q.repeatMode = opts.repeatMode;
        if (opts.repeatTarget != null) q.repeatTarget = Number(opts.repeatTarget) || 0;
        if (opts.repeatA != null) q.repeatA = Number(opts.repeatA);
        if (opts.repeatB != null) q.repeatB = Number(opts.repeatB);
        if (opts.sleepDeadlineMs != null) q.sleepDeadlineMs = Number(opts.sleepDeadlineMs) || 0;
      },
      async getQueueState() {
        return {
          bookKey: q.bookKey,
          status: q.status,
          index: q.index,
          currentTime: q.currentTime,
          duration: q.duration,
          voice: q.voice,
          packActive: q.packActive,
        };
      },
    };
    return adapter;
  }

  const getPlugin = () => {
    if (window.Capacitor?.Plugins?.ChanhPhapEngine || window.__CHANH_PHAP_MOBILE_SIM__) {
      return window.Capacitor?.Plugins?.ChanhPhapEngine || window.__CHANH_PHAP_MOBILE_SIM__;
    }
    if (runningOnDesktop) {
      tauriEngineSingleton ||= createTauriEngineAdapter();
      return tauriEngineSingleton;
    }
    return null;
  };
  const getRemoteBase = () => {
    try {
      const saved = window.LibraryStore?.read?.('mobile-server-url', '');
      if (typeof saved === 'string' && /^https:\/\//i.test(saved.trim())) {
        return saved.trim().replace(/\/+$/, '');
      }
    } catch { /* fallback */ }
    return DEFAULT_REMOTE_SERVER;
  };

  const DEFAULT_PACK_CATALOG = [
    {
      id: 'tts-vieneu-nano',
      kind: 'tts',
      title: 'Gói Giọng Đọc AI Nội Bộ (Thiền Tâm Đức & Thục Đoan)',
      subtitle: 'Tự đọc thành tiếng mọi bản kinh ngay trên chip điện thoại khi mất mạng & tắt màn hình',
      sizeMiB: 138.1,
      bundled: false,
    },
    {
      id: 'core-bundled',
      kind: 'text-pack',
      title: 'Tủ Sách Phúc Minh & 18 Kinh Nhật Tụng Cốt Lõi',
      subtitle: 'Tích hợp sẵn trong ứng dụng · Đọc & tra cứu ngay không cần mạng',
      sizeMiB: 7.0,
      bundled: true,
    },
    {
      id: 'daithua',
      kind: 'text-pack',
      title: 'Kho Kinh Điển Đại Thừa Toàn Tập (155 bản)',
      subtitle: 'Toàn bộ kinh văn chữ Việt & Hán + chỉ mục tìm kiếm không dấu nội bộ',
      sizeMiB: 21.6,
      bundled: false,
    },
    {
      id: 'ebooks',
      kind: 'text-pack',
      title: 'Kho Nam Tông Nikāya & Sách Giảng (1.616 bản)',
      subtitle: 'Kinh tạng Pāḷi Việt dịch, luận giải & sách tu học + tìm kiếm nội bộ',
      sizeMiB: 203.9,
      bundled: false,
    },
    {
      id: 'daitang',
      kind: 'text-pack',
      title: 'Đại Tạng Kinh Hán Tạng Toàn Tập (3.551 bản)',
      subtitle: 'Trọn bộ A-Hàm, Bát-Nhã, Pháp Hoa, Hoa Nghiêm, Luật & Luận + tìm kiếm nội bộ',
      sizeMiB: 224.0,
      bundled: false,
    },
  ];

  function normalizeLibraryPath(rawUrl) {
    try {
      const u = new URL(rawUrl, location.origin);
      return { pathname: decodeURIComponent(u.pathname), search: u.search, searchParams: u.searchParams, href: u.href };
    } catch {
      return { pathname: String(rawUrl || ''), search: '', searchParams: new URLSearchParams(), href: String(rawUrl || '') };
    }
  }

  function isBundledShellAsset(pathname) {
    return (
      pathname === '/' ||
      pathname === '/index.html' ||
      pathname === '/web-thuvien/index.html' ||
      pathname.endsWith('/manifest.webmanifest') ||
      /^\/?(?:web-thuvien\/)?(?:js|css|fonts|design)\//.test(pathname) ||
      /^\/?(?:web-thuvien\/)?data\/(?:library-version\.json|offline-assets\.json|library-audit\.json|dai-tang-kinh\/catalog\.json|edition-migrations\/)/.test(pathname)
    );
  }

  function isManuscriptPath(pathname) {
    return /\.(?:md|txt)$/i.test(pathname) && (
      pathname.startsWith('/Dai_thua/') ||
      pathname.startsWith('/Dai_Tang_Kinh_Han/') ||
      pathname.startsWith('/web-thuvien/data/') ||
      pathname.startsWith('/data/')
    );
  }

  function jsonResponse(obj, status = 200) {
    return new Response(JSON.stringify(obj), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  // 1. Smart Local-First + Cloud Fallback Fetch Router
  window.fetch = async function mobileFetch(input, init) {
    const reqUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input?.url || '';
    if (/^https?:\/\//i.test(reqUrl) && !reqUrl.startsWith(location.origin)) {
      return nativeFetch(input, init);
    }

    const parsed = normalizeLibraryPath(reqUrl);
    const plugin = getPlugin();

    // Bundled app shell files inside Capacitor www/
    if (isBundledShellAsset(parsed.pathname)) {
      try {
        const direct = await nativeFetch(input, init);
        if (direct.ok) return direct;
      } catch { /* try root-relative below */ }
      const localRel = parsed.pathname.replace(/^\/web-thuvien\//, '/');
      try {
        const res = await nativeFetch(localRel + parsed.search, init);
        if (res.ok) return res;
      } catch { /* fallback below */ }
    }

    // Sutra Markdown / Text: Local SQLite Pack Vault first (<2ms), then remote CDN/VPS + auto-cache
    if (isManuscriptPath(parsed.pathname)) {
      const canonicalPath = parsed.pathname.startsWith('/data/')
        ? '/web-thuvien' + parsed.pathname
        : parsed.pathname;
      if (plugin?.getManuscript) {
        try {
          const hit = await plugin.getManuscript({ url: canonicalPath });
          if (hit?.found && typeof hit.content === 'string') {
            return new Response(hit.content, {
              status: 200,
              headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'X-ChanhPhap-Source': hit.packId || 'vault' },
            });
          }
        } catch { /* fall through to remote */ }
      }
      if (navigator.onLine !== false) {
        const remoteRes = await nativeFetch(getRemoteBase() + canonicalPath + parsed.search, init);
        if (remoteRes.ok && plugin?.cacheManuscript) {
          remoteRes.clone().text().then(content => {
            plugin.cacheManuscript({ url: canonicalPath, content }).catch(() => {});
          }).catch(() => {});
        }
        return remoteRes;
      }
      return jsonResponse({ error: 'Bản kinh này chưa tải về máy. Hãy kết nối mạng hoặc tải Gói Kho Kinh trong mục Ngoại tuyến.' }, 404);
    }

    // Voices discovery endpoint: always available offline on mobile
    if (parsed.pathname === '/api/voices') {
      let ttsInstalled = false;
      try {
        const st = await plugin?.getVaultStatus?.();
        ttsInstalled = Boolean(st?.ttsInstalled);
      } catch { /* ignore */ }
      const voices = [
        { id: 'vieneu-thien-tam-duc', name: 'Thiền Tâm Đức · Nam (Trầm tĩnh)' },
        { id: 'vieneu-thuc-doan', name: 'Thục Đoan · Nữ (Dịu dàng)' },
      ];
      return jsonResponse({
        available: true,
        nativeMobile: true,
        onDeviceAiInstalled: ttsInstalled,
        voices: [],
        offlineVoices: voices,
        packVoices: voices,
        config: {
          prefetchDepth: 3,
          buffered: true,
          offlineFallback: true,
          packCdnUrl: getRemoteBase(),
        },
      });
    }

    // Library status check
    if (parsed.pathname === '/api/library/status') {
      return jsonResponse({
        version: 'mobile-native-1.0',
        indexReady: true,
        nativeApp: true,
        features: ['fulltext', 'editions', 'offline', 'pronunciation', 'recordings', 'sync', 'study', 'native-audio', 'on-device-tts'],
      });
    }

    // Full-text search: Online full 5,348-book VPS index -> seamless offline local SQLite FTS5 fallback
    if (parsed.pathname === '/api/search') {
      if (navigator.onLine !== false) {
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 4500);
          try {
            const res = await nativeFetch(getRemoteBase() + parsed.pathname + parsed.search, {
              ...init,
              signal: init?.signal || ctrl.signal,
            });
            if (res.ok) return res;
          } finally {
            clearTimeout(timer);
          }
        } catch { /* fall back to local SQLite FTS5 vault */ }
      }
      if (plugin?.searchVault) {
        const q = parsed.searchParams.get('q') || '';
        const collection = parsed.searchParams.get('collection') || '';
        const mode = parsed.searchParams.get('mode') || '';
        const offset = Number(parsed.searchParams.get('offset') || '0');
        const localResults = await plugin.searchVault({ q, collection, mode, offset });
        return jsonResponse({ ...(localResults || { results: [], total: 0 }), offline: true });
      }
    }

    // Proxy remaining /api/* and PDF/Word downloads to remote server
    if (parsed.pathname.startsWith('/api/') || parsed.pathname.startsWith('/Dai_') || parsed.pathname.startsWith('/web-thuvien/')) {
      return nativeFetch(getRemoteBase() + parsed.pathname + parsed.search, init);
    }

    return nativeFetch(input, init);
  };

  // 2. Native Background / Lock-Screen Audio Queue Delegation
  let activeDocKey = '';
  let activeSegments = [];
  let nativeSnapshot = null;

  function setupNativeAudioBridge() {
    const plugin = getPlugin();
    const ab = window.Audiobook;
    if (!plugin?.startQueue || !ab || ab.__nativeBridged) return;
    ab.__nativeBridged = true;

    window.addEventListener('dharma-document', e => {
      activeDocKey = e.detail?.key || '';
      activeSegments = Array.isArray(e.detail?.chunks) ? e.detail.chunks : [];
    });

    const syncQueueAndPlay = async (startIndex, startSeconds = 0) => {
      const segments = ab.segments?.length ? ab.segments : activeSegments;
      if (!segments.length) return;
      const st = ab.state;
      const itemTitle = window.DharmaPlayerStore?.state?.item?.title || document.getElementById('reader-book-title')?.textContent || 'Thư viện Chánh Pháp';
      const voice = (st.voice || 'offline:vieneu-thien-tam-duc').replace(/^(?:online|offline):/, '');
      await plugin.startQueue({
        bookKey: st.key || activeDocKey,
        bookTitle: itemTitle,
        remoteBaseUrl: getRemoteBase(),
        voice,
        rate: Number(st.rate) || 0.95,
        startIndex: Math.max(0, Number(startIndex ?? st.index) || 0),
        startSeconds: Math.max(0, Number(startSeconds ?? st.currentTime) || 0),
        repeatMode: st.repeatMode || 'off',
        repeatTarget: Number(st.repeatTarget) || 0,
        repeatA: Number(st.repeatA ?? -1),
        repeatB: Number(st.repeatB ?? -1),
        sleepDeadlineMs: Number(st.deadline) || 0,
        segments: segments.map((seg, idx) => ({
          index: idx,
          block: seg.block || '',
          heading: seg.heading || '',
          sourceOffset: seg.sourceOffset || 0,
          text: window.LibraryPronunciation?.prepare ? window.LibraryPronunciation.prepare(seg.text || '') : (seg.text || ''),
        })),
      });
    };

    plugin.addListener?.('playbackState', payload => {
      if (!payload) return;
      nativeSnapshot = payload;
      const key = payload.bookKey || activeDocKey;
      const seg = (ab.segments || activeSegments)[payload.index];
      if (key && seg && window.LibraryStore) {
        window.LibraryStore.write('listen:' + key, {
          block: seg.block,
          index: payload.index,
          chunk: seg.chunk || 0,
          sourceOffset: seg.sourceOffset || 0,
          segmentation: window.NarrationModel?.VERSION || 2,
          seconds: payload.currentTime || 0,
          updatedAt: Date.now(),
        });
      }
      const follow = window.LibraryStore?.read?.('audio-settings', {})?.follow !== false;
      if (follow && seg && payload.status === 'playing') {
        window.Reader?.followAudio?.(seg.block, seg.sourceOffset || 0);
      }
      window.dispatchEvent(new CustomEvent('dharma-audio', {
        detail: {
          ...ab.state,
          key,
          status: payload.status || 'idle',
          index: payload.index ?? 0,
          count: (ab.segments || activeSegments).length,
          currentText: seg?.text || '',
          currentTime: payload.currentTime || 0,
          duration: payload.duration || 1,
          voice: 'offline:' + (payload.voice || 'vieneu-thien-tam-duc'),
          voiceLabel: payload.voiceLabel || 'Giọng AI Chánh Pháp',
          packActive: Boolean(payload.packActive),
          message: payload.message || '',
        },
      }));
      if (payload.finished) {
        window.dispatchEvent(new CustomEvent('sutra-finished', { detail: { key } }));
      }
    });

    const origStateDesc = Object.getOwnPropertyDescriptor(ab, 'state');
    const getBaseState = () => (origStateDesc?.get ? origStateDesc.get.call(ab) : {});
    Object.defineProperty(ab, 'state', {
      configurable: true,
      enumerable: true,
      get() {
        const base = getBaseState();
        if (!nativeSnapshot || (base.key && nativeSnapshot.bookKey && base.key !== nativeSnapshot.bookKey)) {
          return base;
        }
        const segs = ab.segments?.length ? ab.segments : activeSegments;
        const idx = Number.isInteger(nativeSnapshot.index) ? nativeSnapshot.index : base.index;
        return {
          ...base,
          status: nativeSnapshot.status || base.status,
          index: idx,
          count: segs.length || base.count,
          currentText: segs[idx]?.text || base.currentText || '',
          currentTime: Number.isFinite(nativeSnapshot.currentTime) ? nativeSnapshot.currentTime : base.currentTime,
          duration: Number.isFinite(nativeSnapshot.duration) && nativeSnapshot.duration > 0 ? nativeSnapshot.duration : base.duration,
          packActive: Boolean(nativeSnapshot.packActive),
          message: nativeSnapshot.message ?? base.message,
        };
      },
    });

    const origConnect = ab.connect?.bind(ab);
    if (origConnect) {
      ab.connect = (...args) => {
        const nextKey = args[1];
        if (nextKey && nativeSnapshot?.bookKey && nextKey !== nativeSnapshot.bookKey) {
          nativeSnapshot = null;
        }
        return origConnect(...args);
      };
    }

    const origSetRepeat = ab.setRepeat?.bind(ab);
    const origToggleRepeat = ab.toggleRepeat?.bind(ab);

    ab.start = () => syncQueueAndPlay(ab.state.index, ab.state.currentTime);
    ab.play = () => syncQueueAndPlay(ab.state.index, ab.state.currentTime);
    ab.restart = () => syncQueueAndPlay(0, 0);
    ab.pause = async () => {
      await plugin.pauseQueue?.();
    };
    ab.stop = async () => {
      await plugin.stopQueue?.();
      nativeSnapshot = null;
    };
    ab.seekChunk = (idx, sec = 0, resume = true) => {
      const clamped = Math.max(0, Math.min((ab.segments?.length || activeSegments.length || 1) - 1, Number(idx) || 0));
      if (resume) return syncQueueAndPlay(clamped, sec);
      if (nativeSnapshot) {
        nativeSnapshot = { ...nativeSnapshot, index: clamped, currentTime: Math.max(0, Number(sec) || 0) };
      }
      return plugin.seekQueue?.({ index: clamped, seconds: Math.max(0, Number(sec) || 0), resume: false });
    };
    ab.seekTime = sec => plugin.seekQueue?.({
      index: nativeSnapshot?.index ?? ab.state.index,
      seconds: Math.max(0, Number(sec) || 0),
      resume: (nativeSnapshot?.status || ab.state.status) === 'playing',
    });
    ab.setRepeat = (mode, target = 0) => {
      origSetRepeat?.(mode, target);
      return plugin.updateQueueOptions?.({ repeatMode: mode, repeatTarget: Number(target) || 0 });
    };
    if (origToggleRepeat) {
      ab.toggleRepeat = () => {
        origToggleRepeat();
        const st = getBaseState();
        return plugin.updateQueueOptions?.({ repeatA: st.repeatA ?? -1, repeatB: st.repeatB ?? -1 });
      };
    }

    document.addEventListener('change', e => {
      const id = e.target?.id;
      if (id === 'audio-rate') {
        void plugin.updateQueueOptions?.({ rate: Number(e.target.value) || 0.95 });
      } else if (id === 'audio-sleep') {
        const mins = Number(e.target.value) || 0;
        void plugin.updateQueueOptions?.({ sleepDeadlineMs: mins > 0 ? Date.now() + mins * 60000 : 0 });
      } else if (id === 'audio-voice' && ['playing', 'loading'].includes(ab.state.status)) {
        setTimeout(() => void syncQueueAndPlay(ab.state.index, 0), 0);
      }
    });

    // Re-sync Reader paragraph immediately when unlocking the iPhone screen
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible' && plugin.getQueueState) {
        try {
          const latest = await plugin.getQueueState();
          if (latest?.bookKey && Number.isInteger(latest.index)) {
            nativeSnapshot = latest;
            const seg = (ab.segments || activeSegments)[latest.index];
            if (seg) window.Reader?.followAudio?.(seg.block, seg.sourceOffset || 0);
          }
        } catch { /* ignore */ }
      }
    });
  }

  // 3. Mobile Offline Vault & On-Device AI Voice Pack UI inside #tab-offline
  async function mountMobileVaultUI() {
    const offlinePanel = document.getElementById('tab-offline') || document.getElementById('panel-offline');
    if (!offlinePanel || document.getElementById('mobile-vault-root')) return;
    const plugin = getPlugin();

    const deviceNoun = runningOnDesktop ? 'máy tính' : 'điện thoại';
    const modeLabel = runningOnDesktop ? 'Chế độ Ứng dụng Windows PC' : 'Chế độ Ứng dụng Di động';
    const metaDesc = runningOnDesktop
      ? 'Lưu trữ bền vững trong ổ cứng máy tính (%LOCALAPPDATA%\\ChanhPhapVault) · Đọc tra cứu tức thì & tự tổng hợp giọng đọc AI trên CPU khi mất mạng.'
      : 'Lưu trữ bền vững trong bộ nhớ ứng dụng (không tự xóa, không chiếm iCloud, nghe tắt màn hình khi bật Chế độ Máy bay).';

    const container = document.createElement('section');
    container.id = 'mobile-vault-root';
    container.className = 'mobile-vault-panel';
    container.innerHTML = `
      <div class="mobile-vault-header">
        <div>
          <h3 style="margin:0 0 4px;">Kho Tàng Ngoại Tuyến &amp; Giọng Đọc AI Nội Bộ</h3>
          <p class="mobile-pack-meta">${metaDesc}</p>
        </div>
        <span class="mobile-vault-badge" id="mobile-vault-summary">Đang kiểm tra bộ nhớ…</span>
      </div>
      <div class="mobile-pack-list" id="mobile-pack-list"></div>
      <div class="mobile-reminder-row">
        <strong>🔔 Nhắc giờ Thời khóa hằng ngày:</strong>
        <input type="time" id="mobile-reminder-time" value="05:30" aria-label="Giờ nhắc công phu">
        <button type="button" class="r-button" id="mobile-reminder-save">Bật nhắc giờ</button>
        <button type="button" class="r-button" id="mobile-reminder-off">Tắt nhắc</button>
        <span id="mobile-reminder-status" class="mobile-pack-meta"></span>
      </div>
    `;

    const grid = offlinePanel.querySelector('.upgrade-grid');
    if (grid) offlinePanel.insertBefore(container, grid);
    else offlinePanel.append(container);

    const installBtn = document.getElementById('offline-install');
    if (installBtn) installBtn.hidden = true;
    const pwaHelp = document.getElementById('offline-status')?.nextElementSibling;
    if (pwaHelp && pwaHelp.classList.contains('upgrade-help')) {
      pwaHelp.textContent = 'Mẹo: Tải "Gói Giọng Đọc AI Nội Bộ" ở khung trên để tự đọc ngoại tuyến mọi bản kinh không cần tải từng chương âm thanh, hoặc lưu nhanh từng bài kinh lẻ ngay bên dưới.';
    }

    const progressMap = new Map();

    const renderPacks = async () => {
      let installed = { packs: ['core-bundled'], ttsInstalled: false, freeDiskMiB: null };
      try {
        const st = await plugin?.getVaultStatus?.();
        if (st) installed = { ...installed, ...st };
      } catch { /* default */ }

      const summaryEl = document.getElementById('mobile-vault-summary');
      if (summaryEl) {
        summaryEl.textContent = installed.ttsInstalled
          ? '✓ Giọng AI Nội Bộ sẵn sàng' + (installed.freeDiskMiB ? ` · Trống ${(installed.freeDiskMiB / 1024).toFixed(1)} GB` : '')
          : modeLabel + (installed.freeDiskMiB ? ` · Trống ${(installed.freeDiskMiB / 1024).toFixed(1)} GB` : '');
      }

      const listEl = document.getElementById('mobile-pack-list');
      if (!listEl) return;
      listEl.replaceChildren();

      for (const item of DEFAULT_PACK_CATALOG) {
        const isInstalled = item.bundled || (item.kind === 'tts' ? installed.ttsInstalled : (installed.packs || []).includes(item.id));
        const pct = progressMap.get(item.id);
        const card = document.createElement('article');
        card.className = 'mobile-pack-item';
        const subtitle = runningOnDesktop && item.id === 'tts-vieneu-nano'
          ? 'Tự tổng hợp giọng đọc mọi bản kinh ngay trên CPU máy tính khi mất mạng & thu nhỏ cửa sổ'
          : item.subtitle;
        card.innerHTML = `
          <div>
            <h4>${item.title}</h4>
            <p class="mobile-pack-meta">${subtitle}</p>
          </div>
          <div>
            <p class="mobile-pack-meta" style="margin-bottom:8px;">
              Dung lượng: <strong>${item.sizeMiB.toFixed(1)} MB</strong> ·
              Trạng thái: <strong>${isInstalled ? 'Đã lưu trong máy' : pct != null ? `Đang tải ${pct}%…` : 'Chưa tải'}</strong>
            </p>
            ${pct != null ? `<div class="mobile-pack-progress"><span style="width:${pct}%"></span></div>` : ''}
            <div class="upgrade-actions" style="margin-top:8px;"></div>
          </div>
        `;
        const actions = card.querySelector('.upgrade-actions');
        if (item.bundled) {
          const badge = document.createElement('span');
          badge.className = 'mobile-vault-badge';
          badge.textContent = '✓ Luôn sẵn sàng ngoại tuyến';
          actions.append(badge);
        } else if (isInstalled) {
          const removeBtn = document.createElement('button');
          removeBtn.className = 'r-button';
          removeBtn.textContent = 'Gỡ gói để giải phóng máy';
          removeBtn.onclick = async () => {
            if (!confirm(`Gỡ "${item.title}" khỏi ${deviceNoun}?`)) return;
            await plugin?.removePack?.({ id: item.id, kind: item.kind });
            await renderPacks();
            window.dispatchEvent(new CustomEvent('chanhphap-vault-updated'));
          };
          actions.append(removeBtn);
        } else {
          const dlBtn = document.createElement('button');
          dlBtn.className = 'r-primary';
          dlBtn.disabled = pct != null;
          dlBtn.textContent = pct != null ? `Đang tải (${pct}%)…` : `Tải về ${deviceNoun}`;
          dlBtn.onclick = async () => {
            progressMap.set(item.id, 1);
            await renderPacks();
            try {
              await plugin?.downloadPack?.({
                id: item.id,
                kind: item.kind,
                remoteBaseUrl: getRemoteBase(),
              });
            } catch (err) {
              alert(err?.message || 'Chưa tải xong gói dữ liệu. Kiểm tra mạng rồi thử lại (tiến độ tải dở vẫn được giữ).');
            } finally {
              progressMap.delete(item.id);
              await renderPacks();
              window.dispatchEvent(new CustomEvent('chanhphap-vault-updated'));
            }
          };
          actions.append(dlBtn);
        }
        listEl.append(card);
      }
    };

    plugin?.addListener?.('downloadProgress', ev => {
      if (!ev?.id) return;
      progressMap.set(ev.id, Math.min(99, Math.max(1, Math.round(ev.percent || 0))));
      void renderPacks();
    });

    document.getElementById('mobile-reminder-save')?.addEventListener('click', async () => {
      const val = document.getElementById('mobile-reminder-time')?.value || '05:30';
      const [h, m] = val.split(':').map(Number);
      try {
        await plugin?.scheduleDailyPracticeReminder?.({ hour: h || 5, minute: m || 30, enabled: true });
        document.getElementById('mobile-reminder-status').textContent = `Đã đặt nhắc công phu lúc ${val} mỗi ngày.`;
      } catch (e) {
        document.getElementById('mobile-reminder-status').textContent = e?.message || 'Hãy cấp quyền Thông báo trong Cài đặt máy.';
      }
    });

    document.getElementById('mobile-reminder-off')?.addEventListener('click', async () => {
      await plugin?.scheduleDailyPracticeReminder?.({ hour: 5, minute: 30, enabled: false });
      document.getElementById('mobile-reminder-status').textContent = 'Đã tắt nhắc giờ hằng ngày.';
    });

    await renderPacks();
  }

  let backBound = false;
  function setupNativeBackButton() {
    if (backBound) return;
    const capApp = window.Capacitor?.Plugins?.App;
    if (!capApp?.addListener) return;
    backBound = true;
    capApp.addListener('backButton', () => {
      const handled = window.TouchUX?.handleBackButton?.();
      if (!handled) {
        capApp.minimizeApp?.().catch?.(() => {});
      }
    });
  }

  function bootstrapMobile() {
    // Suppress PC file:// warning banner inside native mobile WebView
    document.getElementById('connection-notice')?.remove();
    setupNativeBackButton();
    setupNativeAudioBridge();
    void mountMobileVaultUI();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('connection-notice')?.remove();
        setupNativeBackButton();
        setupNativeAudioBridge();
        void mountMobileVaultUI();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapMobile);
  } else {
    bootstrapMobile();
  }
  window.addEventListener('load', bootstrapMobile);

  window.MobileBridge = {
    isNative: true,
    isDesktop: runningOnDesktop,
    getPlugin,
    getRemoteBase,
    refreshVaultUI: mountMobileVaultUI,
  };
})();

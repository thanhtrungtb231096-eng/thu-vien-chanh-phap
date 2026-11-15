(() => {
  'use strict';
  const CACHE = 'cp-offline-books-v1';
  let database, installPrompt, registration;
  const absolute = path => new URL(path, location.href).href.split('#')[0];
  const isNativeApp = () => Boolean(window.MobileBridge?.isNative || document.documentElement?.dataset?.nativeApp === 'true');
  const canonicalVaultUrl = rawPath => {
    try {
      const p = decodeURIComponent(new URL(rawPath, location.href).pathname);
      return p.startsWith('/data/') ? '/web-thuvien' + p : p;
    } catch {
      return String(rawPath || '');
    }
  };
  const blobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result || '');
      const i = s.indexOf(',');
      resolve(i >= 0 ? s.slice(i + 1) : s);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  function db() {
    return database ||= new Promise((resolve,reject) => {
      const r = indexedDB.open('chanh-phap-media',1);
      r.onupgradeneeded = () => r.result.createObjectStore('media');
      r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
    });
  }
  async function media(operation,key,value) {
    const d = await db();
    return new Promise((resolve,reject) => {
      const tx = d.transaction('media',operation === 'get' || operation === 'getAllKeys' ? 'readonly':'readwrite');
      const s = tx.objectStore('media');
      const r = operation === 'getAllKeys' ? s.getAllKeys() : operation === 'put' ? s.put(value,key) : s[operation](key);
      tx.oncomplete = () => resolve(r.result); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    });
  }
  async function sha256Hex(buffer) {
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256', buffer))].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  async function audioKey(text,voice) {
    const bytes = new TextEncoder().encode(voice + '\0' + text);
    return 'audio:' + await sha256Hex(bytes);
  }
  async function getAudioInfo(text,voice) {
    const value=await media('get',await audioKey(text,voice));
    // Earlier downloads could contain a prefix whose synthesis failed later.
    // Keep the book and progress; replace unverified audio when it is downloaded again.
    return value?.verifiedVersion===1 && value.blob instanceof Blob?value:null;
  }
  async function getAudio(text,voice) { return (await getAudioInfo(text,voice))?.blob||null; }
  function packs() { return LibraryStore.read('offline-packs',[]); }
  async function getPackForSegment(bookKey, docVersion, voice, segmentIndex) {
    if (!bookKey || !docVersion || !voice) return null;
    const savedBook = packs().find(x => x.key === bookKey);
    if (!savedBook || !Array.isArray(savedBook.audio)) return null;
    const prefix = `packblob:${bookKey}:${docVersion}:${voice}:`;
    for (const id of savedBook.audio) {
      if (typeof id !== 'string' || !id.startsWith(prefix)) continue;
      try {
        const entry = await media('get', id);
        if (entry?.verifiedVersion === 1 && entry.blob instanceof Blob && Array.isArray(entry.cues)
            && entry.startIndex <= segmentIndex && segmentIndex <= entry.endIndex) {
          return {
            id: entry.packId || id,
            startIndex: entry.startIndex,
            endIndex: entry.endIndex,
            duration: entry.duration,
            blob: entry.blob,
            cues: entry.cues,
            voice,
          };
        }
      } catch { /* Ignore unreadable IndexedDB entry and fall through. */ }
    }
    return null;
  }
  function paths(item,options={sources:true}) {
    const b = item.data, files = b.files || {};
    return [...new Set([files.vietMd,files.hanMd,files.noteMd,b.vietFile,b.hanFile,...(options.sources?[files.vietPdf,files.hanPdf,files.notePdf,b.pdfFile,b.sourceFile]:[])].filter(Boolean))];
  }
  async function saveBook(item,report=()=>{},options={sources:false}) {
    if (isNativeApp()) {
      const urls = paths(item, options), prior = packs().find(x => x.key === item.key);
      if (!urls.length) throw new Error('Bản này chưa có bản chữ. Chọn thêm PDF/Word nguồn để tải.');
      const plugin = window.MobileBridge?.getPlugin?.();
      let bytes = 0;
      for (let i = 0; i < urls.length; i++) {
        const rawPath = urls[i], url = absolute(rawPath);
        report(`Đang tải tài liệu ${i + 1}/${urls.length}…`);
        options.signal?.throwIfAborted();
        const response = await fetch(url, { cache: 'no-store', signal: options.signal });
        if (!response.ok) throw new Error('Không tải được một bản nguồn. Chưa hoàn tất lưu sách.');
        const cloneForCache = typeof caches !== 'undefined' ? response.clone() : null;
        if (/\.(?:md|txt)$/i.test(rawPath)) {
          const text = await response.text();
          bytes += new TextEncoder().encode(text).length;
          await plugin?.cacheManuscript?.({ url: canonicalVaultUrl(rawPath), content: text });
        } else {
          const blob = await response.blob();
          bytes += blob.size;
        }
        if (cloneForCache) {
          try { const cache = await caches.open(CACHE); await cache.put(url, cloneForCache); } catch {}
        }
      }
      const retained = (prior?.urls || []).filter(url => !urls.map(absolute).includes(url));
      const value = {
        key: item.key, type: item.type, id: item.id, title: item.title,
        urls: [...new Set([...urls.map(absolute), ...retained])],
        bytes, savedAt: Date.now(),
        audio: prior?.audio || [], chapters: prior?.chapters || [],
        sourcesIncluded: options.sources || prior?.sourcesIncluded || false,
      };
      if (!LibraryStore.write('offline-packs', [...packs().filter(x => x.key !== item.key), value])) {
        throw new Error('Không lưu được danh sách sách trên thiết bị. Bản đã lưu trước đó được giữ lại.');
      }
      return value;
    }
    if (!registration || !navigator.serviceWorker?.controller) throw new Error('Chế độ ngoại tuyến đang khởi tạo. Hãy đợi vài giây rồi thử lại.');
    const cache = await caches.open(CACHE), urls = paths(item,options), prior = packs().find(x=>x.key===item.key);
    if(!urls.length)throw new Error('Bản này chưa có bản chữ. Chọn thêm PDF/Word nguồn để tải.');
    const added = [], before = new Map(), fetched = new Map();
    let bytes = 0;
    try {
      for (let i=0;i<urls.length;i++) {
        const url = absolute(urls[i]); report(`Đang tải tài liệu ${i+1}/${urls.length}…`);
        options.signal?.throwIfAborted();
        const response = await fetch(url,{cache:'no-store',signal:options.signal});
        if (!response.ok) throw new Error('Không tải được một bản nguồn. Chưa hoàn tất lưu sách.');
        const blob = await response.clone().blob(); bytes += blob.size;
        const old=await cache.match(url);
        if (!old) added.push(url); else before.set(url,old);
        fetched.set(url,response);
      }
      for(const [url,response]of fetched)await cache.put(url,response);
      const retained=(prior?.urls||[]).filter(url=>!urls.map(absolute).includes(url));
      for(const url of retained){const response=await cache.match(url);if(response)bytes+=(await response.blob()).size;}
      const value = {key:item.key,type:item.type,id:item.id,title:item.title,urls:[...new Set([...urls.map(absolute),...retained])],bytes,savedAt:Date.now(),audio:prior?.audio||[],chapters:prior?.chapters||[],sourcesIncluded:options.sources||prior?.sourcesIncluded||false};
      if (!LibraryStore.write('offline-packs',[...packs().filter(x=>x.key!==item.key),value])) throw new Error('Không lưu được danh sách sách trên thiết bị. Bản đã lưu trước đó được giữ lại.');
      await navigator.storage?.persist?.();
      return value;
    } catch(error) {
      const used = new Set(packs().flatMap(p=>p.urls));
      for(const [url,response]of before)await cache.put(url,response);
      for (const url of added) if(!used.has(url)) await cache.delete(url);
      throw error;
    }
  }
  async function removeBook(key) {
    const old = packs().find(x=>x.key===key), rest = packs().filter(x=>x.key!==key);
    if (typeof caches !== 'undefined') {
      try {
        const cache = await caches.open(CACHE), used = new Set(rest.flatMap(p=>p.urls));
        for (const url of old?.urls||[]) if(!used.has(url)) await cache.delete(url);
      } catch {}
    }
    const retained = new Set(rest.flatMap(p=>p.audio||[]));
    for (const id of old?.audio||[]) if(!retained.has(id)) await media('delete',id);
    LibraryStore.write('offline-packs',rest);
  }
  async function fetchPackBlob(packInfo, signal) {
    for (const url of [packInfo.audioUrl, packInfo.fallbackAudioUrl].filter(Boolean)) {
      signal?.throwIfAborted();
      try {
        const resp = await fetch(url, {signal, cache:'no-store'});
        if (!resp.ok) continue;
        const buf = await resp.arrayBuffer();
        if (packInfo.sha256 && (await sha256Hex(buf)) !== packInfo.sha256) continue;
        return new Blob([buf], {type:'audio/mpeg'});
      } catch (e) {
        if (e.name === 'AbortError') throw e;
      }
    }
    return null;
  }
  async function saveChapter(item,doc,start,end,voice,signal,report=()=>{}) {
    if(!voice.startsWith('online:') && !voice.startsWith('offline:')) throw new Error('Hãy chọn giọng đọc của thư viện để tải chương nghe.');
    const pack = packs().find(x=>x.key===item.key);
    if(!pack) throw new Error('Hãy lưu sách ngoại tuyến trước khi tải chương nghe.');
    // Use the full-book segmentation so downloaded clips have the same keys
    // when a spoken paragraph crosses a reading section or printed page.
    const blocks = new Set(doc.blocks.slice(start,end).map(block=>block.id));
    const allSegments = NarrationModel.build(doc);
    const matched = [];
    allSegments.forEach((segment, idx) => {
      if (segment.sources.some(source => blocks.has(source.block))) matched.push({segment, idx});
    });
    const segments = matched.map(m => m.segment);
    if (!segments.length) throw new Error('Chương này chưa có văn bản để nghe.');
    let completed=0;
    const chapterId=doc.version+':'+start+':'+end+':'+voice;
    const updateChapter=()=>{const current=packs().find(x=>x.key===item.key);if(!current)throw new Error('Sách đã được gỡ.');const progress={id:chapterId,version:doc.version,start,end,voice,total:segments.length,completed,verifiedVersion:1,updatedAt:Date.now()};current.chapters=[...(current.chapters||[]).filter(x=>x.id!==chapterId),progress];if(!LibraryStore.write('offline-packs',packs().map(x=>x.key===item.key?current:x)))throw new Error('Không lưu được tiến độ chương.');};
    updateChapter();

    const nativePlugin = isNativeApp() ? window.MobileBridge?.getPlugin?.() : null;
    if (nativePlugin?.getVaultStatus) {
      const vaultSt = await nativePlugin.getVaultStatus().catch(() => null);
      if (vaultSt?.ttsInstalled) {
        completed = segments.length;
        updateChapter();
        report(`✓ Máy đã cài Gói Giọng Đọc AI Nội Bộ — trọn chương (${segments.length} đoạn) sẵn sàng nghe ngoại tuyến!`);
        return completed;
      }
    }

    // Fast path: download pre-rendered Chapter-Sprite pack(s) in 1 request if available & unmodified (Web PWA only).
    const customPron = !!LibraryStore.read('pronunciation', {})?.enabled;
    const hasEdits = doc.blocks.some(b => b.originalRaw !== undefined);
    if (!isNativeApp() && (voice.startsWith('offline:') || voice.startsWith('online:')) && !customPron && !hasEdits && window.AudioService?.packManifest) {
      const manifest = await AudioService.packManifest(item.key, doc.version, voice, signal).catch(() => ({available:false}));
      if (manifest?.available && Array.isArray(manifest.packs) && manifest.packs.length) {
        const neededPacks = [];
        const allCovered = matched.every(({idx}) => {
          const found = manifest.packs.find(p => p.startIndex <= idx && idx <= p.endIndex);
          if (found && !neededPacks.includes(found)) neededPacks.push(found);
          return !!found;
        });
        if (allCovered && neededPacks.length) {
          let fastOk = true;
          for (let pIdx = 0; pIdx < neededPacks.length; pIdx++) {
            const pInfo = neededPacks[pIdx];
            const storeId = `packblob:${item.key}:${doc.version}:${voice}:${pInfo.id}`;
            const existing = await media('get', storeId).catch(() => null);
            if (!(existing?.verifiedVersion === 1 && existing.blob instanceof Blob && Array.isArray(existing.cues))) {
              report(`Đang tải gói âm thanh liền mạch (${pIdx + 1}/${neededPacks.length})…`);
              const [cuesData, blob] = await Promise.all([
                AudioService.packCues(pInfo.cuesUrl, pInfo.fallbackCuesUrl, signal),
                fetchPackBlob(pInfo, signal),
              ]);
              if (!cuesData || !blob) { fastOk = false; break; }
              await media('put', storeId, {
                packId: pInfo.id,
                blob,
                cues: cuesData.cues,
                docVersion: doc.version,
                segmentation: NarrationModel.VERSION,
                startIndex: pInfo.startIndex,
                endIndex: pInfo.endIndex,
                duration: pInfo.duration,
                voice,
                verifiedVersion: 1,
              });
            }
            const current = packs().find(x => x.key === item.key);
            if (!current) { await media('delete', storeId); throw new Error('Sách đã được gỡ khỏi kho ngoại tuyến.'); }
            current.audio = [...new Set([...current.audio, storeId])];
            if (!LibraryStore.write('offline-packs', packs().map(p => p.key === item.key ? current : p))) {
              throw new Error('Không lưu được danh sách gói âm thanh trên thiết bị.');
            }
          }
          if (fastOk) {
            completed = segments.length;
            updateChapter();
            report(`Đã lưu trọn gói âm thanh liền mạch (${segments.length} đoạn).`);
            return completed;
          }
        }
      }
    }

    for(const chunk of segments) {
      signal?.throwIfAborted();
      const text = window.LibraryPronunciation.prepare(chunk.text), id = await audioKey(text,voice);
      let segInfo = await getAudioInfo(text,voice);
      if(!segInfo) {
        const options={signal,priority:'background',onRetry:detail=>report(detail.message)};
        const descriptor=await AudioService.prepare(text,voice,options);
        const blob=descriptor.blob||await AudioService.download(descriptor,options);
        segInfo={blob,verifiedVersion:1,actualVoices:descriptor.actualVoices||[],activeVoice:descriptor.activeVoice||''};
        await media('put',id,segInfo);
      }
      if (nativePlugin?.cacheAudioSegment && segInfo?.blob instanceof Blob) {
        try {
          const cleanVoice = voice.replace(/^(?:online|offline):/, '').split(':')[0];
          const audioBase64 = await blobToBase64(segInfo.blob);
          await nativePlugin.cacheAudioSegment({ voice: cleanVoice, text: text.trim(), audioBase64 });
        } catch {}
      }
      const current = packs().find(x=>x.key===item.key);
      if (!current) { await media('delete',id); throw new Error('Sách đã được gỡ khỏi kho ngoại tuyến.'); }
      current.audio = [...new Set([...current.audio,id])];
      if (!LibraryStore.write('offline-packs',packs().map(p=>p.key===item.key?current:p))) throw new Error('Không lưu được danh sách đoạn nghe trên thiết bị. Hãy kiểm tra dung lượng rồi tải tiếp.');
      report(`Đã tải ${++completed}/${segments.length} đoạn nghe.`);
      updateChapter();
    }
    return completed;
  }
  async function search(query,collection,mode) {
    if (isNativeApp()) {
      const nativePlugin = window.MobileBridge?.getPlugin?.();
      if (nativePlugin?.searchVault) {
        const res = await nativePlugin.searchVault({ q: query, collection: collection || '', mode: mode || '', offset: 0 }).catch(() => null);
        if (res && Array.isArray(res.results)) return { ...res, offline: true };
      }
    }
    if (typeof caches === 'undefined') return { results: [], total: 0, offline: true };
    const q=ReaderModel.normalize(query), tokens=q.split(/\s+/).filter(Boolean), results=[];
    const cache=await caches.open(CACHE);
    for(const pack of packs()) {
      if(collection && pack.type!==collection) continue;
      const item=DharmaPlayerStore.resolve(pack);
      for(const lang of ['viet','han','note']) {
        if(mode && mode!==lang) continue;
        const path=Reader.path(item,lang); if(!path) continue;
        const response=await cache.match(absolute(path)); if(!response) continue;
        const doc=ReaderModel.parse(await response.text()); let chapter='';
        for(const block of doc.blocks) {
          if(block.heading) chapter=block.heading.title;
          if(tokens.every(t=>ReaderModel.normalize(block.text).includes(t))) results.push({...pack,mode:lang,block:block.id,chapter,excerpt:block.text.slice(0,420),source:path});
          if(results.length>=60) break;
        }
      }
    }
    return {results:results.slice(0,30),total:results.length,offline:true};
  }
  async function init() {
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;window.dispatchEvent(new Event('library-install-ready'));});
    if(!isSecureContext || !('serviceWorker' in navigator)) return;
    try { registration=await navigator.serviceWorker.register('/web-thuvien/sw.js',{scope:'/'}); await navigator.serviceWorker.ready;
      const offer=()=>{if(registration.waiting)window.dispatchEvent(new Event('library-update-ready'));};
      registration.addEventListener('updatefound',()=>registration.installing?.addEventListener('statechange',offer));offer();
    }
    catch { window.dispatchEvent(new Event('library-offline-error')); }
  }
  async function install() {
    if(!installPrompt) return false;
    await installPrompt.prompt(); const result=await installPrompt.userChoice; installPrompt=null; return result.outcome==='accepted';
  }
  function update(){registration?.waiting?.postMessage({type:'ACTIVATE_UPDATE'});}
  window.LibraryOffline={init,install,media,packs,paths,saveBook,removeBook,saveChapter,getAudio,getAudioInfo,getPackForSegment,search,absolute,update,get ready(){return !!registration;}};
})();

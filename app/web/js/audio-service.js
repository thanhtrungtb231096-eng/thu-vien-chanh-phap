/* Shared narration requests: bounded retries, cancellable waits and Vietnamese errors. */
(() => {
  'use strict';
  const root = globalThis;
  const config = {prefetchDepth:4, stallTimeoutMs:15000, progressive:true, buffered:true,
    bufferSeconds:90, prefetchMax:24, prefetchConcurrency:2, startupBufferSeconds:6, startupWaitMs:1500,
    offlineFallback:true, streamLongForeground:false, packCdnUrl:''};
  function configure(value={}) {
    if (!value || typeof value !== 'object') return;
    if (Number.isInteger(value.prefetchDepth) && value.prefetchDepth>=0 && value.prefetchDepth<=10) config.prefetchDepth=value.prefetchDepth;
    if (Number.isFinite(value.stallTimeoutMs) && value.stallTimeoutMs>=1000 && value.stallTimeoutMs<=60000) config.stallTimeoutMs=value.stallTimeoutMs;
    if (typeof value.progressive==='boolean') config.progressive=value.progressive;
    if (typeof value.buffered==='boolean') config.buffered=value.buffered;
    if (typeof value.offlineFallback==='boolean') config.offlineFallback=value.offlineFallback;
    if (typeof value.streamLongForeground==='boolean') config.streamLongForeground=value.streamLongForeground;
    if (typeof value.packCdnUrl==='string') config.packCdnUrl=value.packCdnUrl.trim().replace(/\/+$/,'');
    for (const [key,min,max] of [['bufferSeconds',5,300],['prefetchMax',3,60],['prefetchConcurrency',1,3],['startupBufferSeconds',0,45],['startupWaitMs',0,20000]]) {
      if(Number.isInteger(value[key]) && value[key]>=min && value[key]<=max) config[key]=value[key];
    }
  }
  function voiceInfo(target,source={}) {
    const valid=value=>/^vieneu-(?:thien-tam-duc|thuc-doan)$/.test(value||'');
    if(Array.isArray(source.actualVoices))target.actualVoices=[...new Set(source.actualVoices.filter(valid))];
    if(valid(source.activeVoice))target.activeVoice=source.activeVoice;
    else if(target.actualVoices?.length)target.activeVoice=target.actualVoices.at(-1);
    return target;
  }
  function mediaMessage(error) {
    return ({1:'Đã dừng tải đoạn nghe. Nhấn Nghe tiếp để tiếp tục.',
      2:'Kết nối âm thanh bị gián đoạn. Thư viện đang tải lại đoạn nghe.',
      3:'Không đọc được âm thanh. Thư viện đang tải lại đoạn nghe.',
      4:'Nguồn âm thanh chưa sẵn sàng. Thư viện đang tải lại đoạn nghe.'})[error?.code]
      || 'Âm thanh bị gián đoạn. Thư viện đang tải lại đoạn nghe.';
  }
  function httpMessage(status, code) {
    if (code === 'network-denied') return 'Máy chủ thư viện bị chặn kết nối giọng đọc. Đóng máy chủ rồi mở lại MO_THU_VIEN.cmd để nghe tiếp.';
    if (code === 'offline-voice-unavailable') return 'Mô hình giọng AI ngoại tuyến chưa được cài trên máy chủ.';
    if (status===404 || status===405) return 'Địa chỉ này chưa có dịch vụ nghe kinh. Hãy mở thư viện bằng MO_THU_VIEN.cmd.';
    return status===429 || status>=500
      ? 'Dịch vụ giọng đọc đang gián đoạn. Nhấn Thử lại hoặc chọn giọng tiếng Việt trên thiết bị.'
      : 'Chưa tải được giọng đọc. Hãy mở lại bản kinh và thử lại.';
  }
  function failure(message, code, retryable = false) {
    return Object.assign(new Error(message), {code, retryable});
  }
  function aborted() { return new DOMException('Đã dừng tải giọng đọc.', 'AbortError'); }
  function check(signal) { if (signal?.aborted) throw aborted(); }
  function isLocalServerHost() {
    return ['localhost', '127.0.0.1', '[::1]'].includes(root.location?.hostname);
  }
  function connectionMessage() {
    if (root.navigator?.onLine === false) return 'Đang mất mạng. Kết nối lại hoặc chọn chương nghe đã tải về thiết bị.';
    if (isLocalServerHost()) return 'Mất kết nối với máy chủ thư viện. Mở MO_THU_VIEN.cmd rồi nhấn Thử lại. Vị trí nghe vẫn được giữ.';
    return 'Mất kết nối với thư viện. Kiểm tra mạng hoặc mở lại địa chỉ chia sẻ rồi nhấn Thử lại. Vị trí nghe vẫn được giữ.';
  }
  function wait(ms, signal) {
    check(signal);
    return new Promise((resolve, reject) => {
      const cancel = () => { clearTimeout(timer); signal?.removeEventListener('abort', cancel); reject(aborted()); };
      const timer = setTimeout(() => { signal?.removeEventListener('abort', cancel); resolve(); }, ms);
      signal?.addEventListener('abort', cancel, {once:true});
    });
  }
  async function attempt(text, voice, signal, timeoutMs, priority) {
    check(signal);
    const controller = new AbortController();
    let timedOut = false;
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, {once:true});
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
    try {
      const response = await root.fetch('/api/tts', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({text, voice:voice.replace(/^(?:online|offline):/, ''),stream:config.progressive,priority}),
        signal:controller.signal, cache:'no-store'
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const temporary = response.status === 429 || response.status >= 500;
        const message = httpMessage(response.status, body.code);
        const error = failure(message, body.code || 'http-' + response.status, temporary && body.retryable !== false);
        const retryAfter = Number(response.headers.get('Retry-After'));
        error.retryAfter = Number.isFinite(retryAfter) ? Math.min(4000, Math.max(0, retryAfter * 1000)) : 0;
        throw error;
      }
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const result=await response.json();
        if (!result.stream || !/^\/api\/audio\/[a-f0-9]{32}$/.test(result.url)) throw failure('Dịch vụ chưa trả về đoạn nghe hợp lệ.', 'invalid-audio', true);
        check(signal);return {...result,text,voice};
      }
      const blob = await response.blob();
      if (!blob.size || !blob.type.startsWith('audio/')) throw failure('Dịch vụ chưa trả về âm thanh hợp lệ. Nhấn Thử lại hoặc đổi giọng đọc.', 'invalid-audio', true);
      check(signal);
      let actualVoices=[];
      try{actualVoices=JSON.parse(response.headers.get('X-Narration-Voices')||'[]');}catch{}
      return voiceInfo({blob},{actualVoices});
    } catch (error) {
      check(signal);
      if (timedOut) throw failure('Giọng đọc phản hồi quá lâu. Nhấn Thử lại hoặc đổi giọng; vị trí nghe vẫn được giữ.', 'timeout', true);
      if (typeof error.code === 'string' && typeof error.retryable === 'boolean') throw error;
      throw failure(connectionMessage(), 'connection', true);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
    }
  }
  async function prepare(text, voice, options = {}) {
    const {signal, onRetry, retries = 2, timeoutMs = 10000, budgetMs = 25000, delayMs = 700, priority='foreground'} = options;
    check(signal);
    if (root.location?.protocol === 'file:') throw failure('Hãy mở thư viện bằng MO_THU_VIEN.cmd để sử dụng giọng đọc.', 'file', false);
    if (typeof text !== 'string' || !text.trim()) throw failure('Đoạn nghe chưa hợp lệ. Hãy mở lại bản kinh.', 'text', false);
    const isOfflineEngine = typeof voice === 'string' && voice.startsWith('offline:');
    if (root.navigator?.onLine === false && !(isOfflineEngine && isLocalServerHost())) throw failure(connectionMessage(), 'offline', false);
    // A pronunciation dictionary can expand an otherwise valid semantic passage.
    // Keep its listening anchor while sending bounded requests to the server.
    if (text.length > 1800) {
      const blobs = [],actualVoices=new Set();
      let remaining = text.trim();
      while (remaining) {
        check(signal);
        let cut = remaining.length;
        if (cut > 1800) cut = remaining.lastIndexOf(' ', 1800) || 1800;
        if (cut < 1) cut = 1800;
        const descriptor = await prepare(remaining.slice(0, cut), voice, options);
        blobs.push(descriptor.blob || await download(descriptor, {...options, priority}));
        for(const actual of descriptor.actualVoices||[])actualVoices.add(actual);
        remaining = remaining.slice(cut).trim();
      }
      check(signal);
      return voiceInfo({blob:new Blob(blobs, {type:'audio/mpeg'})},{actualVoices:[...actualVoices]});
    }
    const started = Date.now();
    let lastError;
    for (let number = 0; number <= retries; number++) {
      check(signal);
      const remaining = budgetMs - (Date.now() - started);
      if (remaining <= 0) throw lastError || failure('Giọng đọc phản hồi quá lâu. Nhấn Thử lại.', 'timeout');
      try { return await attempt(text, voice, signal, Math.min(timeoutMs, remaining),priority); }
      catch (error) {
        check(signal);
        lastError = error;
        if (!error.retryable || number === retries) throw error;
        const delay = Math.max(delayMs * 2 ** number, error.retryAfter || 0);
        if (Date.now() - started + delay >= budgetMs) throw error;
        onRetry?.({attempt:number + 1, retries, code:error.code, message:`Kết nối giọng đọc gián đoạn. Đang thử lại (${number + 1}/${retries})…`});
        await wait(delay, signal);
      }
    }
    throw lastError;
  }
  function streamURL(descriptor,priority='foreground',buffered=config.buffered) { return descriptor.url+'?priority='+priority+(buffered?'&buffered=1':''); }
  async function completion(descriptor,options={}) {
    if (descriptor.blob || !descriptor.statusCheck) return voiceInfo({done:true,complete:true},descriptor);
    check(options.signal);
    const controller=new AbortController();
    const cancel=()=>controller.abort();options.signal?.addEventListener('abort',cancel,{once:true});
    const timer=setTimeout(cancel,5000);
    try {
      const response=await root.fetch(descriptor.url+'?status=1',{signal:controller.signal,cache:'no-store'});
      if (!response.ok) throw failure('Chưa kiểm tra được đoạn nghe. Thư viện sẽ tải lại.','stream-status',true);
      const result=await response.json();check(options.signal);
      if (typeof result.complete!=='boolean' || typeof result.done!=='boolean') throw failure('Chưa xác nhận được âm thanh đầy đủ.','stream-status',true);
      voiceInfo(descriptor,result);
      return result;
    } catch(error) {
      check(options.signal);
      if (typeof error.code==='string') throw error;
      throw failure(connectionMessage(),'connection',true);
    } finally { clearTimeout(timer);options.signal?.removeEventListener('abort',cancel); }
  }
  async function waitForAudio(descriptor,options={}) {
    const {signal,budgetMs=120000,bufferSeconds=12}=options;
    if(descriptor.blob || !descriptor.statusCheck)return descriptor;
    const until=Date.now()+budgetMs;
    // Edge audio is 48 kbit/s. Server bytes contain completed clips only.
    const required=Math.max(256,Math.min(12,Math.max(0,bufferSeconds))*6000);
    while(Date.now()<until){
      check(signal);
      const state=await completion(descriptor,{signal});
      if(state.error || state.done&&!state.complete)throw failure(httpMessage(502,state.code),state.code||'upstream',state.retryable!==false);
      if(state.complete || state.bytes>=required)return descriptor;
      await wait(250,signal);
    }
    throw failure('Đoạn nghe phản hồi quá lâu. Vị trí nghe vẫn được giữ.','timeout',true);
  }
  async function downloadOnce(descriptor,options={}) {
    const {signal,priority='background',idleTimeoutMs=45000,budgetMs=120000}=options;
    check(signal);if(descriptor.blob)return descriptor.blob;
    const controller=new AbortController();let timer,timedOut=false;
    const reset=()=>{clearTimeout(timer);timer=setTimeout(()=>{timedOut=true;controller.abort();},idleTimeoutMs);};
    const cancel=()=>controller.abort();signal?.addEventListener('abort',cancel,{once:true});reset();
    const deadline=setTimeout(()=>{timedOut=true;controller.abort();},budgetMs);
    try {
      let response;
      while (true) {
        response=await root.fetch(streamURL(descriptor,priority),{signal:controller.signal,cache:'no-store'});
        if(response.status!==202)break;
        const pending=await response.json();
        if(pending.pending!==true)throw failure('Chưa nhận được đoạn nghe hợp lệ.','invalid-audio',true);
        reset();
        await wait(Math.max(100,Math.min(1000,Number(pending.retryAfterMs)||500)),controller.signal);
      }
      if(!response.ok){
        const body=await response.json().catch(()=>({}));
        throw failure(httpMessage(response.status,body.code),body.code || 'stream', (response.status===404 || response.status===429 || response.status>=500) && body.retryable!==false);
      }
      const reader=response.body.getReader(),parts=[];
      while(true){const {value,done}=await reader.read();if(done)break;parts.push(value);reset();}
      const blob=new Blob(parts,{type:response.headers.get('Content-Type')||'audio/mpeg'});
      if(!blob.size||!blob.type.startsWith('audio/'))throw failure('Đoạn nghe chưa có âm thanh hợp lệ.','invalid-audio',true);
      const state=await completion(descriptor,{signal:controller.signal});
      if(!state.complete)throw failure(state.code==='network-denied' ? httpMessage(503,state.code) : 'Máy chủ chưa tạo được âm thanh đầy đủ. Nhấn Thử lại để tiếp tục đúng đoạn và giọng đã chọn.',state.code || 'stream-truncated',state.code!=='network-denied');
      check(signal);return blob;
    }catch(error){
      check(signal);
      if(timedOut)throw failure('Kết nối giọng đọc bị gián đoạn. Nhấn Thử lại để nghe tiếp.','timeout',true);
      if(typeof error.code==='string' && typeof error.retryable==='boolean')throw error;
      throw failure(connectionMessage(),'connection',true);
    }
    finally{clearTimeout(timer);clearTimeout(deadline);signal?.removeEventListener('abort',cancel);}
  }
  async function download(descriptor,options={}) {
    const original=descriptor;
    // Long semantic paragraphs retain one listening position but need more time to synthesize.
    const paragraphBudget=Math.min(300000,Math.max(120000,(descriptor.text?.length || 0)/7*1000+60000));
    const {signal,retries=2,delayMs=500,budgetMs=paragraphBudget,onRetry}=options;
    const started=Date.now();
    for(let attempt=0;attempt<=retries;attempt++) {
      check(signal);
      const remaining=budgetMs-(Date.now()-started);
      if(remaining<=0)throw failure('Đoạn nghe phản hồi quá lâu. Nhấn Thử lại.','timeout',true);
      try{const blob=await downloadOnce(descriptor,{...options,budgetMs:remaining});voiceInfo(original,descriptor);return blob;}
      catch(error){
        check(signal);if(!error.retryable || attempt===retries)throw error;
        onRetry?.({attempt:attempt+1,message:'Đang tải lại đoạn nghe…'});
        await wait(delayMs*2**attempt,signal);
        if(descriptor.text && descriptor.voice) descriptor=await prepare(descriptor.text,descriptor.voice,{...options,retries:0});
      }
    }
  }
  async function recover(text,voice,seconds=0,options={}) {
    const {signal,retries=1,delayMs=700,onRetry}=options;
    for(let attempt=0;attempt<=retries;attempt++){
      check(signal);
      try {
        const descriptor=await prepare(text,voice,{...options,priority:'foreground',retries:0});
        const blob=await download(descriptor,{...options,priority:'foreground',retries:0});
        check(signal);return voiceInfo({blob,seconds:Math.max(0,Number(seconds)||0)},descriptor);
      } catch(error){
        check(signal);if(!error.retryable || attempt===retries)throw error;
        onRetry?.({attempt:attempt+1,message:'Đang tải lại đoạn đang nghe…'});
        await wait(delayMs*2**attempt,signal);
      }
    }
  }
  async function packManifest(key, version, voice, signal) {
    if (!key || root.location?.protocol === 'file:') return {available:false, packs:[]};
    if (root.navigator?.onLine === false && !isLocalServerHost()) return {available:false, packs:[]};
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, {once:true});
    const timer = setTimeout(cancel, 4000);
    try {
      const params = new URLSearchParams({key, version: version || '', voice: (voice || '').replace(/^(?:online|offline):/, '')});
      const response = await root.fetch('/api/audio-pack/manifest?' + params, {signal:controller.signal, cache:'no-store'});
      if (!response.ok) return {available:false, packs:[]};
      const data = await response.json();
      check(signal);
      return data && typeof data === 'object' ? data : {available:false, packs:[]};
    } catch (error) {
      check(signal);
      return {available:false, packs:[]};
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
    }
  }
  async function packCues(cuesUrl, fallbackUrl = '', signal) {
    for (const candidate of [cuesUrl, fallbackUrl].filter(Boolean)) {
      check(signal);
      const controller = new AbortController();
      const cancel = () => controller.abort();
      signal?.addEventListener('abort', cancel, {once:true});
      const timer = setTimeout(cancel, 6000);
      try {
        const response = await root.fetch(candidate, {signal:controller.signal});
        if (response.ok) {
          const data = await response.json();
          check(signal);
          if (Array.isArray(data?.cues)) return data;
        }
      } catch {
        check(signal);
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', cancel);
      }
    }
    return null;
  }
  const MP3_BITRATES_V1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
  const MP3_BITRATES_V2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
  const MP3_RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };
  let cachedKeepAliveUrl = null;

  function buildWavHeader(dataBytes, sampleRate, channels, bitsPerSample) {
    const blockAlign = channels * (bitsPerSample >> 3);
    const byteRate = sampleRate * blockAlign;
    const hdr = new ArrayBuffer(44);
    const v = new DataView(hdr);
    const w = (off, str) => { for (let i = 0; i < str.length; i++) v.setUint8(off + i, str.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + dataBytes, true); w(8, 'WAVE');
    w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
    v.setUint16(22, channels, true); v.setUint32(24, sampleRate, true);
    v.setUint32(28, byteRate, true); v.setUint16(32, blockAlign, true);
    v.setUint16(34, bitsPerSample, true);
    w(36, 'data'); v.setUint32(40, dataBytes, true);
    return new Uint8Array(hdr);
  }

  function silentKeepAliveUrl() {
    if (cachedKeepAliveUrl) return cachedKeepAliveUrl;
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return null;
    const sampleRate = 8000, seconds = 2, dataBytes = sampleRate * seconds * 2;
    const hdr = buildWavHeader(dataBytes, sampleRate, 1, 16);
    const pcm = new Uint8Array(dataBytes);
    cachedKeepAliveUrl = URL.createObjectURL(new Blob([hdr, pcm], { type: 'audio/wav' }));
    return cachedKeepAliveUrl;
  }

  function hasAsciiToken(bytes, start, end, token) {
    const lim = Math.min(bytes.length, end) - token.length;
    for (let i = start; i <= lim; i++) {
      let ok = true;
      for (let k = 0; k < token.length; k++) {
        if (bytes[i + k] !== token.charCodeAt(k)) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }

  function inspectAudioBytes(bytes) {
    if (!(bytes instanceof Uint8Array) || bytes.length < 44) return null;
    // 1. RIFF WAVE PCM parser
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
        && bytes[8] === 0x57 && bytes[9] === 0x41 && bytes[10] === 0x56 && bytes[11] === 0x45) {
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      let pos = 12, fmt = null, dataOffset = -1, dataLen = 0;
      while (pos + 8 <= bytes.length) {
        const id = String.fromCharCode(bytes[pos], bytes[pos + 1], bytes[pos + 2], bytes[pos + 3]);
        const sz = view.getUint32(pos + 4, true);
        if (id === 'fmt ' && pos + 8 + 16 <= bytes.length) {
          const audioFormat = view.getUint16(pos + 8, true);
          const channels = view.getUint16(pos + 10, true);
          const sampleRate = view.getUint32(pos + 12, true);
          const byteRate = view.getUint32(pos + 16, true);
          const blockAlign = view.getUint16(pos + 20, true);
          const bitsPerSample = view.getUint16(pos + 22, true);
          if (audioFormat === 1 && sampleRate >= 4000 && channels >= 1 && (bitsPerSample === 16 || bitsPerSample === 8) && byteRate > 0 && blockAlign > 0) {
            fmt = { channels, sampleRate, byteRate, blockAlign, bitsPerSample };
          }
        } else if (id === 'data') {
          dataOffset = pos + 8;
          dataLen = Math.min(sz, bytes.length - dataOffset);
          break;
        }
        pos += 8 + sz + (sz & 1);
      }
      if (fmt && dataOffset >= 0 && dataLen >= fmt.blockAlign) {
        const aligned = dataLen - (dataLen % fmt.blockAlign);
        return {
          kind: 'wav',
          mime: 'audio/wav',
          duration: aligned / fmt.byteRate,
          sampleRate: fmt.sampleRate,
          channels: fmt.channels,
          bitsPerSample: fmt.bitsPerSample,
          blockAlign: fmt.blockAlign,
          byteRate: fmt.byteRate,
          slices: [bytes.subarray(dataOffset, dataOffset + aligned)],
        };
      }
    }

    // 2. MPEG-1/2/2.5 Layer III frame scanner
    let pos = 0, limit = bytes.length;
    if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33 && bytes.length >= 10) {
      const id3Size = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
      pos = Math.min(limit, 10 + id3Size);
    }
    if (limit - pos >= 128 && bytes[limit - 128] === 0x54 && bytes[limit - 127] === 0x41 && bytes[limit - 126] === 0x47) {
      limit -= 128;
    }

    let totalSamples = 0, frames = 0, refVer = -1, refRate = 0, refCh = 0, refKbps = 0, refH = null;
    const slices = [];
    let runStart = -1, runEnd = -1;

    while (pos + 4 <= limit) {
      if (bytes[pos] !== 0xFF || (bytes[pos + 1] & 0xE0) !== 0xE0) {
        pos++;
        continue;
      }
      const b1 = bytes[pos + 1], b2 = bytes[pos + 2], b3 = bytes[pos + 3];
      const ver = (b1 >> 3) & 3;
      const layer = (b1 >> 1) & 3;
      const brIdx = (b2 >> 4) & 0x0F;
      const srIdx = (b2 >> 2) & 3;
      const padding = (b2 >> 1) & 1;
      if (ver === 1 || layer !== 1 || brIdx === 0 || brIdx === 15 || srIdx === 3) {
        pos++;
        continue;
      }
      const kbps = ver === 3 ? MP3_BITRATES_V1[brIdx] : MP3_BITRATES_V2[brIdx];
      const sampleRate = MP3_RATES[ver]?.[srIdx] || 0;
      if (!kbps || !sampleRate) { pos++; continue; }
      const samplesPerFrame = ver === 3 ? 1152 : 576;
      const frameLen = Math.floor(((samplesPerFrame / 8) * kbps * 1000) / sampleRate) + padding;
      if (frameLen < 24 || pos + frameLen > limit) break;
      const ch = ((b3 >> 6) & 3) === 3 ? 1 : 2;
      if (refRate && (sampleRate !== refRate || ver !== refVer)) { pos++; continue; }

      // Skip VBR Xing/Info/VBRI header frame so stitched streams never report truncated frame counts on iOS
      if (frames === 0 && (hasAsciiToken(bytes, pos + 4, pos + frameLen, 'Xing')
          || hasAsciiToken(bytes, pos + 4, pos + frameLen, 'Info')
          || hasAsciiToken(bytes, pos + 4, pos + frameLen, 'VBRI'))) {
        pos += frameLen;
        continue;
      }

      if (!refRate) {
        refVer = ver; refRate = sampleRate; refCh = ch; refKbps = kbps;
        refH = [0xFF, b1 | 0x01, b2 & 0xFD, b3];
      }
      if (runStart < 0) { runStart = pos; runEnd = pos + frameLen; }
      else if (pos === runEnd) { runEnd = pos + frameLen; }
      else { slices.push(bytes.subarray(runStart, runEnd)); runStart = pos; runEnd = pos + frameLen; }

      totalSamples += samplesPerFrame;
      frames++;
      pos += frameLen;
    }
    if (runStart >= 0 && runEnd > runStart) slices.push(bytes.subarray(runStart, runEnd));
    if (frames < 2 || !refRate) return null;

    const samplesPerFrame = refVer === 3 ? 1152 : 576;
    const silentFrameLen = Math.max(24, Math.floor(((samplesPerFrame / 8) * refKbps * 1000) / refRate));
    const silentFrame = new Uint8Array(silentFrameLen);
    silentFrame[0] = refH[0]; silentFrame[1] = refH[1]; silentFrame[2] = refH[2]; silentFrame[3] = refH[3];

    return {
      kind: 'mp3',
      mime: 'audio/mpeg',
      duration: totalSamples / refRate,
      totalSamples,
      sampleRate: refRate,
      channels: refCh,
      samplesPerFrame,
      silentFrame,
      slices,
    };
  }

  async function inspectBlob(blob) {
    if (!(blob instanceof Blob) || blob.size < 44) return null;
    try {
      const buf = await blob.arrayBuffer();
      return inspectAudioBytes(new Uint8Array(buf));
    } catch {
      return null;
    }
  }

  async function padSilence(blob, pauseBeforeMs = 0) {
    const info = await inspectBlob(blob);
    if (!info) return { blob, duration: 0, speechOffset: 0 };
    const ms = Math.max(0, Number(pauseBeforeMs) || 0);
    if (ms < 25) return { blob, duration: info.duration, speechOffset: 0 };

    if (info.kind === 'wav') {
      const gapSamples = Math.round((ms / 1000) * info.sampleRate);
      const gapBytes = gapSamples * info.blockAlign;
      const speechBytes = info.slices.reduce((s, a) => s + a.byteLength, 0);
      const totalData = gapBytes + speechBytes;
      const hdr = buildWavHeader(totalData, info.sampleRate, info.channels, info.bitsPerSample);
      const silence = new Uint8Array(gapBytes);
      const padded = new Blob([hdr, silence, ...info.slices], { type: 'audio/wav' });
      return { blob: padded, duration: totalData / info.byteRate, speechOffset: gapBytes / info.byteRate };
    }

    const frameSec = info.samplesPerFrame / info.sampleRate;
    const frameCount = Math.max(1, Math.round((ms / 1000) / frameSec));
    const parts = [];
    for (let i = 0; i < frameCount; i++) parts.push(info.silentFrame);
    parts.push(...info.slices);
    const addedSec = frameCount * frameSec;
    return {
      blob: new Blob(parts, { type: 'audio/mpeg' }),
      duration: info.duration + addedSec,
      speechOffset: addedSec,
    };
  }

  async function stitchBlobs(entries) {
    if (!Array.isArray(entries) || entries.length < 2) return null;
    const parsed = [];
    for (const item of entries) {
      if (!(item?.blob instanceof Blob)) return null;
      const info = await inspectBlob(item.blob);
      if (!info) return null;
      parsed.push({ ...item, info });
    }
    const first = parsed[0].info;
    if (!parsed.every(p => p.info.kind === first.kind && p.info.sampleRate === first.sampleRate && p.info.channels === first.channels)) {
      return null;
    }

    const cues = [];
    if (first.kind === 'wav') {
      if (!parsed.every(p => p.info.bitsPerSample === first.bitsPerSample)) return null;
      const parts = [];
      let totalDataBytes = 0;
      for (let i = 0; i < parsed.length; i++) {
        const cur = parsed[i];
        const speechBytes = cur.info.slices.reduce((s, a) => s + a.byteLength, 0);
        const nextPauseMs = i + 1 < parsed.length ? Math.max(80, Number(parsed[i + 1].pauseBeforeMs) || 80) : 120;
        const tailBytes = Math.round((nextPauseMs / 1000) * first.sampleRate) * first.blockAlign;
        const startSec = Math.round((totalDataBytes / first.byteRate) * 1000) / 1000;
        const speechEndSec = Math.round(((totalDataBytes + speechBytes) / first.byteRate) * 1000) / 1000;
        const endSec = Math.round(((totalDataBytes + speechBytes + tailBytes) / first.byteRate) * 1000) / 1000;
        parts.push(...cur.info.slices, new Uint8Array(tailBytes));
        totalDataBytes += speechBytes + tailBytes;
        cues.push({ index: cur.index, start: startSec, speechEnd: speechEndSec, end: endSec });
      }
      const hdr = buildWavHeader(totalDataBytes, first.sampleRate, first.channels, first.bitsPerSample);
      return {
        blob: new Blob([hdr, ...parts], { type: 'audio/wav' }),
        duration: Math.round((totalDataBytes / first.byteRate) * 1000) / 1000,
        startIndex: parsed[0].index,
        endIndex: parsed[parsed.length - 1].index,
        cues,
      };
    }

    // MP3 lossless frame stitching
    const parts = [];
    let cursorSamples = 0;
    for (let i = 0; i < parsed.length; i++) {
      const cur = parsed[i];
      const segSamples = cur.info.totalSamples;
      const nextPauseMs = i + 1 < parsed.length ? Math.max(80, Number(parsed[i + 1].pauseBeforeMs) || 80) : 120;
      const gapFrames = Math.max(1, Math.round(((nextPauseMs / 1000) * first.sampleRate) / first.samplesPerFrame));
      const tailSamples = gapFrames * first.samplesPerFrame;

      const startSec = Math.round((cursorSamples / first.sampleRate) * 1000) / 1000;
      const speechEndSec = Math.round(((cursorSamples + segSamples) / first.sampleRate) * 1000) / 1000;
      const endSec = Math.round(((cursorSamples + segSamples + tailSamples) / first.sampleRate) * 1000) / 1000;

      parts.push(...cur.info.slices);
      for (let g = 0; g < gapFrames; g++) parts.push(first.silentFrame);
      cursorSamples += segSamples + tailSamples;
      cues.push({ index: cur.index, start: startSec, speechEnd: speechEndSec, end: endSec });
    }
    return {
      blob: new Blob(parts, { type: 'audio/mpeg' }),
      duration: Math.round((cursorSamples / first.sampleRate) * 1000) / 1000,
      startIndex: parsed[0].index,
      endIndex: parsed[parsed.length - 1].index,
      cues,
    };
  }

  function report(event) {
    // Best effort; no manuscript or listening position is sent to telemetry.
    void root.fetch('/api/narration/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event}),keepalive:true}).catch(()=>{});
  }
  async function request(text,voice,options={}) { options={priority:'background',...options};return download(await prepare(text,voice,options),options); }
  root.AudioService = {request,prepare,download,recover,completion,waitForAudio,packManifest,packCues,inspectAudioBytes,inspectBlob,padSilence,stitchBlobs,silentKeepAliveUrl,report,streamURL,connectionMessage,mediaMessage,configure,config};
  if (typeof module !== 'undefined' && module.exports) module.exports = root.AudioService;
})();

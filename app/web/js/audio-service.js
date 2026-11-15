/* Shared narration requests: bounded retries, cancellable waits and Vietnamese errors. */
(() => {
  'use strict';
  const root = globalThis;
  const config = {prefetchDepth:3, stallTimeoutMs:15000, progressive:true, buffered:true,
    bufferSeconds:45, prefetchMax:12, prefetchConcurrency:2, startupBufferSeconds:6, startupWaitMs:1500,
    offlineFallback:true, streamLongForeground:false, packCdnUrl:''};
  function configure(value={}) {
    if (!value || typeof value !== 'object') return;
    if (Number.isInteger(value.prefetchDepth) && value.prefetchDepth>=0 && value.prefetchDepth<=5) config.prefetchDepth=value.prefetchDepth;
    if (Number.isFinite(value.stallTimeoutMs) && value.stallTimeoutMs>=1000 && value.stallTimeoutMs<=60000) config.stallTimeoutMs=value.stallTimeoutMs;
    if (typeof value.progressive==='boolean') config.progressive=value.progressive;
    if (typeof value.buffered==='boolean') config.buffered=value.buffered;
    if (typeof value.offlineFallback==='boolean') config.offlineFallback=value.offlineFallback;
    if (typeof value.streamLongForeground==='boolean') config.streamLongForeground=value.streamLongForeground;
    if (typeof value.packCdnUrl==='string') config.packCdnUrl=value.packCdnUrl.trim().replace(/\/+$/,'');
    for (const [key,min,max] of [['bufferSeconds',5,120],['prefetchMax',3,20],['prefetchConcurrency',1,3],['startupBufferSeconds',0,45],['startupWaitMs',0,20000]]) {
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
  function report(event) {
    // Best effort; no manuscript or listening position is sent to telemetry.
    void root.fetch('/api/narration/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event}),keepalive:true}).catch(()=>{});
  }
  async function request(text,voice,options={}) { options={priority:'background',...options};return download(await prepare(text,voice,options),options); }
  root.AudioService = {request,prepare,download,recover,completion,waitForAudio,packManifest,packCues,report,streamURL,connectionMessage,mediaMessage,configure,config};
  if (typeof module !== 'undefined' && module.exports) module.exports = root.AudioService;
})();

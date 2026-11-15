const {test} = require('node:test');
const assert = require('node:assert/strict');
const service = require('../app/web/js/audio-service.js');
globalThis.location = {hostname:'127.0.0.1', protocol:'http:'};
Object.defineProperty(globalThis, 'navigator', {value:{onLine:true}, configurable:true});
const options = {delayMs:1, timeoutMs:50, budgetMs:250};
const voice = 'offline:vieneu-thuc-doan';
const audio = () => new Response(new Uint8Array(1024), {headers:{'Content-Type':'audio/mpeg'}});

test('a fully downloaded recording keeps its selected voice after a failed job is renewed',async()=>{
  const old='/api/audio/'+'1'.repeat(32),renewed='/api/audio/'+'2'.repeat(32);
  globalThis.fetch=async url=>{
    if(url==='/api/tts')return Response.json({stream:true,url:renewed,statusCheck:true});
    if(url.startsWith(old))return Response.json({code:'upstream',retryable:true},{status:502});
    if(url.includes('status=1'))return Response.json({done:true,complete:true,actualVoices:['vieneu-thuc-doan'],activeVoice:'vieneu-thuc-doan'});
    return audio();
  };
  const descriptor={url:old,statusCheck:true,text:'A local voice metadata test.',voice};
  const blob=await service.download(descriptor,{retries:1,delayMs:1});
  assert.equal(blob.size,1024);
  assert.deepEqual(descriptor.actualVoices,['vieneu-thuc-doan']);
  assert.equal(descriptor.activeVoice,'vieneu-thuc-doan');
});

test('non-streaming audio and expanded paragraphs retain actual-voice metadata',async()=>{
  globalThis.fetch=async()=>new Response(new Uint8Array(1024),{headers:{'Content-Type':'audio/mpeg','X-Narration-Voices':JSON.stringify(['vieneu-thuc-doan'])}});
  const short=await service.prepare('A short local metadata test.',voice);
  assert.deepEqual(short.actualVoices,['vieneu-thuc-doan']);
  const expanded=await service.prepare('A local pronunciation expansion. '.repeat(100),voice);
  assert.deepEqual(expanded.actualVoices,['vieneu-thuc-doan']);
  assert.ok(expanded.blob.size>1024);
});

test('voice metadata cannot inject arbitrary labels or malformed values',async()=>{
  globalThis.fetch=async()=>Response.json({done:true,complete:true,actualVoices:['<script>',null,{},'vieneu-thuc-doan','vieneu-thuc-doan'],activeVoice:'<script>'});
  const descriptor={url:'/api/audio/'+'3'.repeat(32),statusCheck:true};
  await service.completion(descriptor);
  assert.deepEqual(descriptor.actualVoices,['vieneu-thuc-doan']);
  assert.equal(descriptor.activeVoice,'vieneu-thuc-doan');
});

test('long passages become playable after a validated buffer before the complete file is ready',async()=>{
  let calls=0;
  globalThis.fetch=async()=>Response.json({done:false,complete:false,error:false,bytes:++calls===1?0:78000});
  const descriptor={url:'/api/audio/'+'f'.repeat(32),statusCheck:true};
  assert.equal(await service.waitForAudio(descriptor,{budgetMs:1500}),descriptor);
  assert.equal(calls,2);
});

test('a failed synthesis cannot be treated as a playable buffer',async()=>{
  globalThis.fetch=async()=>Response.json({done:true,complete:false,error:true,bytes:90000,retryable:true});
  await assert.rejects(service.waitForAudio({url:'/api/audio/'+'f'.repeat(32),statusCheck:true}),error=>error.code==='upstream');
});

test('pending synthesis polls the same job instead of cancelling and resubmitting text', async () => {
  const urls=[];
  globalThis.fetch=async url=>{urls.push(url);return urls.length<3?Response.json({pending:true,retryAfterMs:1},{status:202}):audio();};
  const descriptor={url:'/api/audio/'+'c'.repeat(32),text:'authored pending probe',voice};
  const blob=await service.download(descriptor,{retries:0,budgetMs:1500});
  assert.equal(blob.size,1024);assert.equal(urls.length,3);
  assert.ok(urls.every(url=>url===urls[0]));
});

test('pause cancels a pending-synthesis poll without starting another request', async () => {
  const controller=new AbortController();let calls=0;
  globalThis.fetch=async()=>{calls++;setTimeout(()=>controller.abort(),5);return Response.json({pending:true},{status:202});};
  await assert.rejects(service.download({url:'/api/audio/'+'d'.repeat(32)},{signal:controller.signal,retries:0}),e=>e.name==='AbortError');
  assert.equal(calls,1);
});

test('pending synthesis still obeys the total download deadline', async () => {
  globalThis.fetch=async()=>Response.json({pending:true,retryAfterMs:1000},{status:202});
  await assert.rejects(service.download({url:'/api/audio/'+'e'.repeat(32)},{budgetMs:100,retries:0}),e=>e.code==='timeout');
});

test('pronunciation expansions retain every word and use requests within the server limit', async () => {
  const text='An expanded pronunciation for a long semantic passage. '.repeat(80).trim(), bodies=[];
  globalThis.fetch=async(_,init)=>{bodies.push(JSON.parse(init.body));return audio();};
  const result=await service.prepare(text,voice,options);
  assert.ok(bodies.length>1);
  assert.ok(bodies.every(body=>body.text.length<=1800 && body.voice==='vieneu-thuc-doan'));
  assert.equal(bodies.map(body=>body.text).join(' '),text);
  assert.equal(result.blob.size,bodies.length*1024);
});

test('cancelling an expanded passage stops all subsequent synthesis requests', async () => {
  const controller=new AbortController();let calls=0;
  globalThis.fetch=async()=>{calls++;controller.abort();return audio();};
  await assert.rejects(service.prepare('Locally expanded words. '.repeat(200),voice,{...options,signal:controller.signal}),e=>e.name==='AbortError');
  assert.equal(calls,1);
});

test('network failures and busy responses recover without changing the requested passage', async () => {
  let calls = 0; const bodies = [], messages = [];
  globalThis.fetch = async (_, init) => {
    calls++; bodies.push(JSON.parse(init.body));
    if (calls === 1) throw new TypeError('Failed to fetch');
    if (calls === 2) return new Response(JSON.stringify({error:'Busy'}), {status:429});
    return audio();
  };
  const result = await service.request('Nam mô Phật', voice, {...options,onRetry:x=>messages.push(x)});
  assert.equal(result.size,1024); assert.equal(calls,3); assert.equal(messages.length,2);
  assert.deepEqual(bodies,[bodies[0],bodies[0],bodies[0]]);
  assert.equal(bodies[0].voice,'vieneu-thuc-doan');
});

test('permanent HTTP failures are reported once', async () => {
  let calls=0;
  globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({error:'Đoạn không hợp lệ.'}),{status:400});};
  await assert.rejects(service.request('Nam mô Phật',voice,options),e=>e.code==='http-400');
  assert.equal(calls,1);
});

test('server network permission failures explain how to restart and are not retried', async () => {
  let calls=0;
  globalThis.fetch=async()=>{
    calls++;
    return Response.json({code:'network-denied',retryable:false,error:'private upstream details'},{status:503});
  };
  const useful=error=>error.code==='network-denied' && !error.retryable && error.message.includes('MO_THU_VIEN.cmd') && !error.message.includes('private');
  await assert.rejects(service.request('Local network permission probe',voice,options),useful);
  assert.equal(calls,1);
  calls=0;
  await assert.rejects(service.download({url:'/api/audio/'+'a'.repeat(32)},options),useful);
  assert.equal(calls,1);
});

test('permission denial after the first clip cannot trigger another synthesis or cache partial audio', async () => {
  let downloads=0;
  globalThis.fetch=async url=>{
    if(url.includes('status=1'))return Response.json({done:true,complete:false,error:true,code:'network-denied',retryable:false});
    downloads++;return audio();
  };
  await assert.rejects(service.download({url:'/api/audio/'+'b'.repeat(32),statusCheck:true},options),
    error=>error.code==='network-denied' && !error.retryable && error.message.includes('MO_THU_VIEN.cmd'));
  assert.equal(downloads,1);
});

test('exhausted network failures have a useful Vietnamese recovery message', async () => {
  let calls=0;globalThis.fetch=async()=>{calls++;throw new TypeError('Failed to fetch');};
  await assert.rejects(service.request('Nam mô Phật',voice,options),e=>e.code==='connection'&&e.message.includes('MO_THU_VIEN.cmd')&&!e.message.includes('Failed to fetch'));
  assert.equal(calls,3);
});

test('pausing during retry backoff cancels immediately and prevents a later request', async () => {
  let calls=0;const controller=new AbortController();
  globalThis.fetch=async()=>{calls++;throw new TypeError('Failed to fetch');};
  const result=service.request('Nam mô Phật',voice,{...options,budgetMs:2500,signal:controller.signal,onRetry:()=>setTimeout(()=>controller.abort(),1),delayMs:1000});
  await assert.rejects(result,e=>e.name==='AbortError');assert.equal(calls,1);
});

test('request timeouts become retryable timeouts, rather than silent cancellation', async () => {
  let calls=0;
  globalThis.fetch=(_,init)=>{calls++;return new Promise((_,reject)=>init.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true}));};
  await assert.rejects(service.request('Nam mô Phật',voice,{...options,timeoutMs:5}),e=>e.code==='timeout');
  assert.equal(calls,3);
});

test('offline and HTML responses cannot be played as audio', async () => {
  const savedLocation = globalThis.location;
  globalThis.location = {hostname:'thuvienchanhphap.duckdns.org', protocol:'https:'};
  globalThis.navigator.onLine=false;let calls=0;
  globalThis.fetch=async()=>{calls++;return new Response('<html>Unavailable</html>',{headers:{'Content-Type':'text/html'}});};
  try {
    await assert.rejects(service.request('Nam mô Phật',voice,options),e=>e.code==='offline');assert.equal(calls,0);
  } finally {
    globalThis.location = savedLocation;
    globalThis.navigator.onLine=true;
  }
  await assert.rejects(service.request('Nam mô Phật',voice,options),e=>e.code==='invalid-audio');assert.equal(calls,3);
});

test('a continuously advancing audio download outlives the idle deadline', async () => {
  const token = 'a'.repeat(32), calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({url, body:init.body && JSON.parse(init.body)});
    if (url === '/api/tts') return Response.json({stream:true,url:'/api/audio/' + token});
    return new Response(new ReadableStream({
      async start(controller) {
        for (let i = 0; i < 6; i++) {
          await new Promise(resolve => setTimeout(resolve, 15));
          controller.enqueue(new Uint8Array(512));
        }
        controller.close();
      }
    }), {headers:{'Content-Type':'audio/mpeg'}});
  };
  const blob = await service.request('Local synthetic audio probe', voice, {...options,idleTimeoutMs:45});
  assert.equal(blob.size, 3072);
  assert.equal(calls[0].body.stream, true);
  assert.equal(calls[0].body.priority, 'background');
  assert.equal(calls[1].url, '/api/audio/' + token + '?priority=background&buffered=1');
});

test('a truncated stream is rejected even when some audio has arrived', async () => {
  globalThis.fetch = async () => new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(512));
      setTimeout(() => controller.error(new TypeError('Stream interrupted')), 5);
    }
  }), {headers:{'Content-Type':'audio/mpeg'}});
  await assert.rejects(service.download({url:'/api/audio/' + 'b'.repeat(32)}), error => error.code === 'connection');
});

test('an inactive audio stream reaches the idle deadline instead of hanging', async () => {
  globalThis.fetch = async (_, init) => new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(512));
      init.signal.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError')), {once:true});
    }
  }), {headers:{'Content-Type':'audio/mpeg'}});
  await assert.rejects(service.download({url:'/api/audio/' + 'c'.repeat(32)}, {idleTimeoutMs:20}), error => error.code === 'timeout');
});

test('user cancellation while downloading stays distinct from a stalled connection', async () => {
  const controller = new AbortController();
  globalThis.fetch = async (_, init) => new Response(new ReadableStream({
    start(stream) {
      stream.enqueue(new Uint8Array(512));
      init.signal.addEventListener('abort', () => stream.error(new DOMException('Aborted', 'AbortError')), {once:true});
      setTimeout(() => controller.abort(), 5);
    }
  }), {headers:{'Content-Type':'audio/mpeg'}});
  await assert.rejects(service.download({url:'/api/audio/' + 'd'.repeat(32)}, {signal:controller.signal}), error => error.name === 'AbortError');
});

test('a clean HTTP ending cannot hide failed synthesis or cache a partial blob', async () => {
  const token='e'.repeat(32);
  globalThis.fetch=async url=>url.includes('status=1')
    ? Response.json({done:true,complete:false,error:true}) : audio();
  await assert.rejects(service.download({url:'/api/audio/'+token,statusCheck:true},{retries:0}),e=>e.code==='stream-truncated');
});

test('recovery renews a failed job and keeps the requested second', async () => {
  let preparations=0;
  globalThis.fetch=async (url,init)=>{
    if(url==='/api/tts')return Response.json({stream:true,statusCheck:true,url:'/api/audio/'+String(++preparations).repeat(32)});
    if(url.includes('status=1'))return Response.json({done:true,complete:preparations>1,error:preparations===1});
    return audio();
  };
  const result=await service.recover('Local synthetic probe',voice,7,{delayMs:1});
  assert.equal(preparations,2);assert.equal(result.blob.size,1024);assert.equal(result.seconds,7);
});

test('browser media errors are translated without exposing their message',()=>{
  for(let code=1;code<=4;code++){
    const message=service.mediaMessage({code,message:'Failed to load because no supported source was found.'});
    assert.ok(/[À-ỹ]/.test(message));assert.ok(!message.includes('Failed'));
  }
});

test('a long paragraph can retry after two minutes while a short passage remains bounded',async()=>{
  const nativeNow=Date.now;
  const token='f'.repeat(32);
  async function run(text) {
    let clock=0,downloads=0;
    Date.now=()=>clock;
    globalThis.fetch=async url=>{
      if(url==='/api/tts')return Response.json({stream:true,url:'/api/audio/'+token});
      downloads++;
      if(downloads===1){clock+=130000;return Response.json({retryable:true},{status:502});}
      return audio();
    };
    const result=service.download({url:'/api/audio/'+token,text,voice},{delayMs:1});
    return {result,get downloads(){return downloads;}};
  }
  try {
    const long=await run('A locally authored complete sentence. '.repeat(45));
    assert.equal((await long.result).size,1024);assert.equal(long.downloads,2);
    const short=await run('A short local probe.');
    await assert.rejects(short.result,e=>e.code==='timeout');assert.equal(short.downloads,1);
  } finally {Date.now=nativeNow;}
});

test('progressive playback can be disabled without changing the requested text or voice',async()=>{
  let payload;
  globalThis.fetch=async(_,init)=>{payload=JSON.parse(init.body);return audio();};
  service.configure({progressive:false});
  try {
    const result=await service.prepare('Local rollback probe',voice,options);
    assert.equal(result.blob.size,1024);assert.equal(payload.stream,false);
    assert.equal(payload.text,'Local rollback probe');assert.equal(payload.voice,'vieneu-thuc-doan');
  } finally {service.configure({progressive:true});}
});

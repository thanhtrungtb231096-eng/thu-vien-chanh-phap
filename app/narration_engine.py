"""Progressive MP3 jobs with priority, bounded upstream work and reusable short clips."""
import asyncio
from collections import Counter, deque
from dataclasses import dataclass, field
import hashlib
import heapq
import json
import math
import os
import re
import secrets
import socket
import threading
import time
import unicodedata
from audio_config import load_audio_config
from project_paths import WORK_CACHE, ORGANIZED

if os.name == 'nt' and not getattr(socket, '_chanh_phap_ipv4_patched', False):
    _orig_getaddrinfo = socket.getaddrinfo
    def _prefer_ipv4_external(host, port, family=0, type=0, proto=0, flags=0):
        res = _orig_getaddrinfo(host, port, family, type, proto, flags)
        if family == 0 and isinstance(host, str) and host not in ('localhost', '127.0.0.1', '::1', ''):
            v4 = [r for r in res if r[0] == socket.AF_INET]
            if v4:
                return v4
        return res
    socket.getaddrinfo = _prefer_ipv4_external
    socket._chanh_phap_ipv4_patched = True


def network_access_denied(error):
    """Recognize socket permission errors wrapped by the HTTP client."""
    seen=set()
    while error is not None and id(error) not in seen:
        seen.add(id(error))
        if isinstance(error,PermissionError):return True
        if isinstance(error,OSError) and (error.errno in {1,13} or getattr(error,'winerror',None) in {5,10013}):return True
        error=getattr(error,'os_error',None) or error.__cause__ or error.__context__
    return False


def transport_parts(text, limit=160):
    """Split transport requests only; the reader's semantic paragraph stays intact."""
    parts=[]
    text=text.strip()
    while len(text)>limit:
        stops=[i+1 for i,c in enumerate(text[:limit]) if c in '.!?;:。！？；：' and i>limit*.35 and text[i+1:i+2].isspace()
               and not (c=='.' and text[i-1:i].isdigit())]
        if not stops:
            stops=[i+1 for i,c in enumerate(text[:limit]) if c in ',，' and i>limit*.4 and text[i+1:i+2].isspace()]
        # A numbered entry starts a topic; keep its number with its title.
        if not stops:
            stops=[m.start() for m in re.finditer(r'(?<!\S)\d{1,4}\.\s+\S',text[:limit]) if m.start()>limit*.4]
        cut=stops[-1] if stops else text.rfind(' ',0,limit+1)
        if cut<1:cut=limit
        parts.append(text[:cut].strip());text=text[cut:].strip()
    if text:parts.append(text)
    return parts


def speech_text(text):
    """Normalize spoken punctuation, without modifying manuscripts or anchors."""
    value=unicodedata.normalize('NFKC',text).translate(str.maketrans({'ƣ':'ư','Ƣ':'Ư','Ð':'Đ','ð':'đ'}))
    value=''.join(c if c in '\n\r\t' or unicodedata.category(c) not in {'Cc','Cf','Cs','Co'} else ' ' for c in value)
    value=' '.join(value.split())
    def roman(match):
        digits={'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
        total=0;previous=0
        for letter in reversed(match[2].upper()):
            number=digits[letter];total+=-number if number<previous else number;previous=max(previous,number)
        return match[1]+' '+str(total)
    value=re.sub(r'\b(Phần|Quyển|Chương|Tập)\s+([IVXLCDM]+)(?=\s|[.!?:;]|$)',roman,value,flags=re.IGNORECASE)
    value=re.sub(r'(?<=[^\s.!?;:])\s+(?=\d{1,3}\.\s+[^\W\d_])','. ',value)
    if value and value[-1] in ',;:':value=value[:-1]+'.'
    elif value and value[-1] not in '.!?。！？…':value+='.'
    return value


@dataclass
class AudioJob:
    token: str
    digest: str
    text: str
    voice: str
    rate: str
    priority: int
    condition: threading.Condition=field(default_factory=threading.Condition)
    cancelled: threading.Event=field(default_factory=threading.Event)
    chunks: list=field(default_factory=list)
    error: str=''
    done: bool=False
    queued: bool=False
    started: bool=False
    listeners: int=0
    created: float=field(default_factory=time.monotonic)
    accessed: float=field(default_factory=time.monotonic)
    last_audio: float=field(default_factory=time.monotonic)
    first_audio: float=0
    bytes: int=0
    cached: bool=False
    truncation_recorded: bool=False
    warmup: bool=False
    hold_until: float=0
    actual_voices: list=field(default_factory=list)
    active_voice: str=''
    last_attempt: float=0


async def offline_stream(text,voice,rate='-5%'):
    from offline_tts import vieneu_stream
    async for chunk in vieneu_stream(text,voice,rate):
        yield chunk


async def relay_stream(text,voice,rate,url,priority=0):
    """Use the owner's library server, preserving the explicitly selected voice."""
    import aiohttp,certifi,ssl
    context=ssl.create_default_context(cafile=certifi.where())
    selected=voice+(':slow' if rate=='-20%' else '')
    timeout=aiohttp.ClientTimeout(total=40,connect=8,sock_read=25)
    lane='background' if priority else 'foreground'
    async def audio_bytes(response):
        response.raise_for_status()
        if response.status!=200 or not response.headers.get('Content-Type','').startswith('audio/'):
            raise RuntimeError('invalid relay audio')
        size=0
        async for data in response.content.iter_chunked(16384):
            size+=len(data)
            if size>2*1024*1024:raise RuntimeError('relay audio exceeds clip limit')
            yield data
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.post(url+'/api/tts',json={'text':text,'voice':selected,'stream':True,'priority':lane},ssl=context,allow_redirects=False) as response:
            response.raise_for_status()
            if response.headers.get('Content-Type','').startswith('audio/'):
                async for data in audio_bytes(response):yield data
                return
            descriptor=await response.json()
        path=descriptor.get('url','')
        if not descriptor.get('stream') or not re.fullmatch(r'/api/audio/[a-f0-9]{32}',path):
            raise RuntimeError('invalid relay descriptor')
        until=time.monotonic()+85
        while True:
            async with session.get(url+path+'?priority='+lane,ssl=context,allow_redirects=False) as response:
                if response.status==202:
                    pending=await response.json()
                    if pending.get('pending') is not True:raise RuntimeError('invalid pending relay response')
                else:
                    async for data in audio_bytes(response):yield data
                    break
            if time.monotonic()>=until:raise TimeoutError('relay synthesis remained pending')
            await asyncio.sleep(.5)
        async with session.get(url+path+'?status=1',ssl=context,allow_redirects=False) as response:
            response.raise_for_status();state=await response.json()
            if state.get('complete') is not True:raise RuntimeError('incomplete relay audio')


class NarrationEngine:
    def __init__(self,read_cache,write_cache,provider=None,workers=None,config=None,log_path=WORK_CACHE/'narration.log',read_metadata=None,write_metadata=None):
        if provider is None:
            provider = offline_stream
        self.read_cache=read_cache;self.write_cache=write_cache;self.provider=provider
        self.config=config or load_audio_config();workers=workers or self.config.workers
        self.read_metadata=read_metadata;self.write_metadata=write_metadata;self.metadata={}
        self.lock=threading.Condition();self.jobs={};self.by_digest={};self.waiting=[];self.sequence=0;self.workers=workers
        self.last_client_activity=time.monotonic()
        self.metrics_lock=threading.Lock();self.counters=Counter();self.errors=Counter();self.retry_errors=Counter();self.latencies=deque(maxlen=1000);self.log_path=log_path
        background_slots=min(self.config.background_workers,max(1,workers-1))
        for index in range(workers):threading.Thread(target=self._worker,args=(index>=workers-background_slots,),name=f'narration-{index}',daemon=True).start()

    def event(self,ev,job=None,**details):
        entry={'ts':time.time(),'ev':ev,**details}
        if job:
            entry.update(token=job.token,text_len=len(job.text),voice=job.voice,bytes=job.bytes)
        with self.metrics_lock:
            self.counters[ev]+=1
            if ev in {'job-error','first-byte-timeout'}:self.errors[details.get('error','unknown')]+=1
            if ev=='clip-retry':self.retry_errors[details.get('error','unknown')]+=1
            if ev=='first-audio':self.latencies.append(details['ms_to_first'])
            if self.log_path is not None:
                try:
                    self.log_path.parent.mkdir(parents=True,exist_ok=True)
                    # Bound the operational log; no text or personal listening data is logged.
                    if self.log_path.exists() and self.log_path.stat().st_size>8*1024*1024:
                        self.log_path.replace(self.log_path.with_suffix('.log.1'))
                    with self.log_path.open('a',encoding='utf-8') as output:
                        print(json.dumps(entry,ensure_ascii=False),file=output,flush=True)
                except OSError:pass

    def stats(self):
        with self.lock:
            active=sum(job.started and not job.done for job in self.jobs.values())
            queued=sum(job.queued and not job.started and not job.done and not job.cancelled.is_set() for job in self.jobs.values())
            jobs=len(self.jobs)
        with self.metrics_lock:
            samples=sorted(self.latencies)
            percentile=lambda p:round(samples[max(0,math.ceil(len(samples)*p)-1)],2) if samples else None
            failures=self.counters['job-error']+self.counters['first-byte-timeout']
            terminal=self.counters['job-complete']+failures
            return {'jobs':jobs,'active':active,'queued':queued,'workers':self.workers,
                    'counters':dict(self.counters),'errors':dict(self.errors),'retryErrors':dict(self.retry_errors),
                    'errorRate':failures/terminal if terminal else 0,
                    'ttfbMs':{'samples':len(samples),'p50':percentile(.5),'p95':percentile(.95)},
                    'streamTruncated':self.counters['stream-truncated'],
                    'recoveries':self.counters['recovery-success'],'config':self.config.public()}

    def mark_truncated(self,job):
        with job.condition:
            if job.truncation_recorded:return
            job.truncation_recorded=True
        self.event('stream-truncated',job,error=job.error)

    def warmup(self):
        if not self.config.warmup:return
        def run():
            started=time.monotonic()
            async def produce():
                # Warm through the background lane so startup never competes with playback.
                digest=hashlib.sha256(('narration-warmup-v1'+secrets.token_hex(16)).encode()).hexdigest()
                job=self.create('Xin chào.','vieneu-thuc-doan','-5%',digest,1)
                job.warmup=True
                self.attach(job,1)
                try:
                    while not job.done:await asyncio.sleep(.1)
                    self.event('warmup',ms=round((time.monotonic()-started)*1000),error=job.error)
                finally:self.detach(job)
            asyncio.run(produce())
        threading.Thread(target=run,name='narration-warmup',daemon=True).start()

    def create(self,text,voice,rate,digest,priority=0):
        with self.lock:
            if priority<=1:self.last_client_activity=time.monotonic()
            old=self.by_digest.get(digest)
            if old and not old.cancelled.is_set() and not old.error:
                old.accessed=time.monotonic();self._promote(old,priority);return old
            # Expire finished/unused URLs only; active readers keep their job.
            for token,job in list(self.jobs.items()):
                if not job.listeners and (time.monotonic()-job.accessed>300 or len(self.jobs)>96) and (job.done or not job.started):
                    job.cancelled.set();self.jobs.pop(token,None)
                    self.metadata.pop(job.digest,None)
                    if self.by_digest.get(job.digest) is job:self.by_digest.pop(job.digest,None)
            if len(self.jobs)>=128:raise RuntimeError('narration queue full')
            job=AudioJob(secrets.token_hex(16),digest,text,voice,rate,priority)
            cached=self.read_cache(digest)
            metadata=None
            if cached is not None:
                try:metadata=self.read_metadata(digest) if self.read_metadata else self.metadata.get(digest)
                except (OSError,ValueError,TypeError):pass
                if metadata:
                    allowed={voice}
                    if not isinstance(metadata,dict) or metadata.get('sha256')!=hashlib.sha256(cached).hexdigest() or not isinstance(metadata.get('voices'),list) or not metadata['voices'] or any(not isinstance(v,str) or v not in allowed for v in metadata['voices']):metadata=None
                # Only completed, verified recordings of the selected voice are reusable.
                if metadata is None:cached=None
            if cached is not None:
                job.chunks=[cached];job.done=True;job.cached=True;job.bytes=len(cached)
                job.actual_voices=metadata['voices'] if metadata else [voice];job.active_voice=job.actual_voices[-1]
            self.jobs[job.token]=job;self.by_digest[digest]=job
            self.event('cache-hit' if job.cached else 'job-created',job)
            return job

    def _promote(self,job,priority):
        if priority<job.priority:
            job.priority=priority
            if job.queued and not job.started:
                self.sequence+=1;heapq.heappush(self.waiting,(priority,self.sequence,job));self.lock.notify_all()

    def find(self,token):
        with self.lock:
            job=self.jobs.get(token)
            if job:job.accessed=time.monotonic()
            return job

    def _foreground_room(self):
        waiting_priorities=[priority for priority,_,job in self.waiting if not job.started and not job.cancelled.is_set()]
        if not waiting_priorities:return
        top_waiting=min(waiting_priorities)
        running=[job for job in self.jobs.values() if job.started and not job.done and not job.cancelled.is_set()]
        if len(running)<self.workers:return
        # Idle warmer (priority>=2) yields immediately to any user foreground/prefetch (<=1);
        # user prefetch (priority==1) yields to foreground (priority==0).
        preemptible=[job for job in running if (job.priority>=2 and top_waiting<=1) or (job.priority>0 and top_waiting==0)]
        if preemptible:
            min(preemptible,key=lambda job:(-job.priority,len(job.chunks))).cancelled.set()

    def prequeue(self,job,hold=3.0):
        with self.lock:
            if job.cancelled.is_set() or job.done:return
            if not job.listeners:job.hold_until=max(job.hold_until,time.monotonic()+hold)
            job.accessed=time.monotonic()
            if not job.queued:
                job.queued=True;self.sequence+=1;heapq.heappush(self.waiting,(job.priority,self.sequence,job));self.lock.notify_all()
            self._foreground_room()

    def attach(self,job,priority=0):
        with self.lock:
            if job.cancelled.is_set():raise RuntimeError('cancelled job')
            if priority<=1 and not job.warmup:self.last_client_activity=time.monotonic()
            job.listeners+=1;job.hold_until=0;job.accessed=time.monotonic();self._promote(job,priority)
            if not job.done and not job.queued:
                job.queued=True;self.sequence+=1;heapq.heappush(self.waiting,(job.priority,self.sequence,job));self.lock.notify_all()
            self._foreground_room()

    def detach(self,job,hold=0):
        with self.lock:
            job.listeners=max(0,job.listeners-1);job.accessed=time.monotonic()
            if not job.listeners and not job.done:
                if hold>0:job.hold_until=time.monotonic()+hold
                else:job.cancelled.set()
        with job.condition:job.condition.notify_all()

    def _worker(self,background_allowed):
        while True:
            with self.lock:
                # Bounded background lanes keep one worker reserved for listening.
                while not self.waiting or (not background_allowed and self.waiting[0][2].priority>0):self.lock.wait()
                _,_,job=heapq.heappop(self.waiting)
                if job.started or job.done or job.cancelled.is_set():continue
                if job.hold_until and not job.listeners and time.monotonic()>job.hold_until:
                    job.cancelled.set();continue
                job.started=True;job.last_audio=time.monotonic();self._foreground_room()
            self.event('job-started',job)
            try:asyncio.run(self._run(job))
            except Exception as error:
                with job.condition:job.error=job.error or type(error).__name__;job.done=True;job.condition.notify_all()

    async def _run(self,job):
        def append(data):
            if not data:return
            with job.condition:
                job.chunks.append(data);job.last_audio=time.monotonic();job.bytes+=len(data)
                if not job.first_audio:
                    job.first_audio=job.last_audio
                    self.event('first-audio',job,ms_to_first=round((job.first_audio-job.created)*1000,2))
                job.condition.notify_all()
        async def produce():
            actual=job.voice
            is_builtin_offline=(self.provider is offline_stream)
            if is_builtin_offline:
                from offline_tts import NANO_MAX_CHARS, _select_engine_kind
                part_limit=min(self.config.transport_limit,NANO_MAX_CHARS) if _select_engine_kind()=='nano' else max(self.config.transport_limit,260)
            else:
                part_limit=self.config.transport_limit
            for part in transport_parts(job.text,part_limit):
                if job.cancelled.is_set():raise asyncio.CancelledError()
                use_relay=False
                attempts=(1 + (1 if (is_builtin_offline and ORGANIZED and self.config.relay_url) else 0)) if is_builtin_offline else (self.config.retries+1)
                for attempt in range(attempts):
                    clip=bytearray()
                    try:
                        job.last_attempt=time.monotonic()
                        digest=hashlib.sha256((actual+'\0'+job.rate+'\0clip-v3\0'+speech_text(part)).encode()).hexdigest()
                        cached=None if job.warmup else self.read_cache(digest)
                        if cached is not None:clip.extend(cached)
                        else:
                            if use_relay:source=relay_stream(part,actual,job.rate,self.config.relay_url,priority=job.priority)
                            else:source=self.provider(part,actual,job.rate)
                            if use_relay:self.event('clip-relay',job,actual_voice=actual)
                            async for data in source:
                                if job.cancelled.is_set():raise asyncio.CancelledError()
                                clip.extend(data)
                                # Only a completed clip is published; retry never repeats spoken words.
                                job.last_audio=time.monotonic()
                        if len(clip)<256:raise RuntimeError('empty audio')
                        if not job.warmup:self.write_cache(digest,bytes(clip))
                        with job.condition:
                            job.active_voice=actual
                            if actual not in job.actual_voices:job.actual_voices.append(actual)
                        append(bytes(clip))
                        break
                    except Exception as error:
                        if network_access_denied(error):raise
                        if attempt>=attempts-1:raise
                        # Only the local installation can fall back to its own VPS.
                        # Test providers and exported servers never make relay requests.
                        if is_builtin_offline and ORGANIZED and self.config.relay_url:
                            use_relay=not use_relay
                        delay=0 if use_relay else self.config.backoff_ms[min(attempt,len(self.config.backoff_ms)-1)]/1000
                        self.event('clip-retry',job,attempt=attempt+1,error=type(error).__name__,backoff_ms=delay*1000,partial_bytes=len(clip),clip_chars=len(part),clip_sha256=hashlib.sha256(part.encode()).hexdigest(),prosody_variant=0)
                        await asyncio.sleep(delay)
            value=b''.join(job.chunks)
            if not job.warmup:
                metadata={'voices':job.actual_voices[:],'sha256':hashlib.sha256(value).hexdigest()}
                self.metadata[job.digest]=metadata
                try:persisted=self.write_metadata(job.digest,metadata) if self.write_metadata else True
                except OSError:persisted=False
                if persisted is not False:self.write_cache(job.digest,value)
        async def watch():
            while not job.cancelled.is_set():
                if job.hold_until and not job.listeners and time.monotonic()>job.hold_until:
                    job.cancelled.set();return
                # Queued jobs are never watched; foreground listeners get extra grace.
                grace=max(self.config.idle_timeout,self.config.receive_timeout+sum(self.config.backoff_ms)/1000)
                if job.priority==0 and (job.listeners or job.hold_until):grace*=2
                if time.monotonic()-max(job.last_audio,job.last_attempt)>grace:return
                await asyncio.sleep(.05)
        producer=asyncio.create_task(produce());watcher=asyncio.create_task(watch())
        try:
            done,_=await asyncio.wait([producer,watcher],return_when=asyncio.FIRST_COMPLETED,timeout=min(300,max(120,len(job.text)/7+60)))
            if producer not in done:
                producer.cancel();await asyncio.gather(producer,return_exceptions=True)
                if not job.cancelled.is_set():raise TimeoutError('synthesis stopped making progress')
            else:await producer
        except asyncio.CancelledError:
            job.cancelled.set()
        except Exception as error:
            with job.condition:job.error='NetworkAccessDenied' if network_access_denied(error) else type(error).__name__
            raise
        finally:
            watcher.cancel();await asyncio.gather(watcher,return_exceptions=True)
            with job.condition:
                if job.cancelled.is_set() and not job.error:job.error='Cancelled'
                job.done=True;job.condition.notify_all()
            self.event('job-cancelled' if job.cancelled.is_set() else 'job-error' if job.error else 'job-complete',job,error=job.error,ms=round((time.monotonic()-job.created)*1000))

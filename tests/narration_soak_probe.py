"""200 synthetic passages over HTTP. --live opts into Microsoft; default is local.

TTFB measures audio bytes, not audible browser playback. Status confirmation prevents
cleanly terminated partial streams from being counted as successful downloads.
"""
import argparse
import asyncio
from concurrent.futures import ThreadPoolExecutor
import hashlib
import http.client
import json
import math
from pathlib import Path
import sys
import threading
import time

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine, edge_stream


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--count',type=int,default=200)
    parser.add_argument('--concurrency',type=int,default=2)
    parser.add_argument('--live',action='store_true')
    parser.add_argument('--inject-faults',action='store_true')
    parser.add_argument('--strict',action='store_true',help='Exit nonzero if acceptance targets fail')
    parser.add_argument('--output',type=Path)
    args=parser.parse_args()
    if not 1<=args.count<=1000 or not 1<=args.concurrency<=4:parser.error('count: 1..1000; concurrency: 1..4')
    memory={};calls={};run_id=str(time.time_ns())
    async def local(text,*unused):
        calls[text]=calls.get(text,0)+1
        index=int(text.split('Mẫu số ')[1].split('.')[0])
        if args.inject_faults and index%10==0 and calls[text]==1:
            if index%20==0:
                yield b'ID3'+b'x'*512;await asyncio.sleep(.03)
                raise ConnectionError('injected partial stream')
            raise ConnectionError('injected no-audio response')
        await asyncio.sleep(.01)
        yield b'ID3'+b'x'*1024;await asyncio.sleep(.01);yield b'x'*1024
    engine=NarrationEngine(memory.get,memory.__setitem__,edge_stream if args.live else local,
        config=server.AUDIO_CONFIG if args.live else AudioConfig(backoff_ms=(5,10,20),warmup=False),log_path=None)
    server.STREAM_ENGINE=engine
    class Quiet(server.Handler):
        def log_message(self,*unused):pass
    service=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);service.allowed_patterns=set()
    thread=threading.Thread(target=service.serve_forever,daemon=True);thread.start()
    if args.live and engine.config.warmup:engine.warmup()
    progress_lock=threading.Lock();completed=0

    def exchange(method,path,body=None):
        conn=http.client.HTTPConnection('127.0.0.1',service.server_port,timeout=75)
        try:
            conn.request(method,path,body=json.dumps(body).encode() if body is not None else None,
                         headers={'Content-Type':'application/json'} if body is not None else {})
            response=conn.getresponse();value=response.read()
            return response.status,json.loads(value)
        finally:conn.close()

    def read_audio(descriptor):
        conn=http.client.HTTPConnection('127.0.0.1',service.server_port,timeout=75)
        start=time.monotonic();first=None;size=0;gaps=[];previous=None;framing=True
        try:
            conn.request('GET',descriptor['url']+'?priority=foreground')
            response=conn.getresponse()
            if response.status!=200:
                response.read();return {'ok':False,'status':response.status,'bytes':0,'framing':True,'first':None,'gaps':[]}
            while True:
                block=response.read1(8192)
                if not block:break
                now=time.monotonic();size+=len(block)
                if first is None:first=now-start
                if previous is not None and now-previous>.4:gaps.append(now-previous)
                previous=now
            status,state=exchange('GET',descriptor['url']+'?status=1')
            return {'ok':size>0 and status==200 and state.get('complete',False),'bytes':size,'framing':framing,'first':first,'gaps':gaps}
        except (http.client.IncompleteRead,OSError,http.client.HTTPException) as error:
            return {'ok':False,'bytes':size,'framing':not isinstance(error,http.client.IncompleteRead),'first':first,'gaps':gaps,'error':type(error).__name__}
        finally:conn.close()

    def passage(index):
        nonlocal completed
        voice='vi-VN-HoaiMyNeural' if index%2==0 else 'vi-VN-NamMinhNeural'
        # Authored probe material only; use three transport lengths, never library text.
        sentence=f'Mẫu số {index}. Đây là câu tự tạo để kiểm tra âm thanh. Buổi sáng có nắng nhẹ và gió mát. '
        text=(sentence*(1+index%3)).strip()+f' Lượt {run_id}.'
        start=time.monotonic();attempts=[];first=None
        for attempt in range(3):
            status,descriptor=exchange('POST','/api/tts',{'text':text,'voice':voice,'stream':True})
            if status==200:
                audio_start=time.monotonic()
                result=read_audio(descriptor);attempts.append(result)
                if first is None and result['first'] is not None:first=audio_start-start+result['first']
                if result['ok']:break
            else:attempts.append({'ok':False,'status':status,'bytes':0,'framing':True,'first':None,'gaps':[]})
            if attempt<2:time.sleep(.2 if not args.live else .7*(2**attempt))
        replay=None
        if attempts[-1]['ok']:
            replay_start=time.monotonic();again=read_audio(descriptor)
            if again['ok']:replay=time.monotonic()-replay_start
        row={'index':index,'characters':len(text),'voice':voice,'success':attempts[-1]['ok'],
             'automaticRecoveries':len(attempts)-1,'firstByteSeconds':round(first,4) if first is not None else None,
             'totalSeconds':round(time.monotonic()-start,4),'cachedReplaySeconds':round(replay,4) if replay is not None else None,'attempts':attempts}
        with progress_lock:
            completed+=1
            if completed%10==0:print(json.dumps({'completed':completed,'count':args.count,'lastSuccess':row['success']}),flush=True)
        return row

    try:
        with ThreadPoolExecutor(max_workers=args.concurrency) as pool:rows=list(pool.map(passage,range(args.count)))
        stats=engine.stats()
    finally:service.shutdown();service.server_close();thread.join()
    firsts=sorted(row['firstByteSeconds'] for row in rows if row['firstByteSeconds'] is not None)
    percentile=lambda values,p:values[max(0,math.ceil(len(values)*p)-1)] if values else None
    success=sum(row['success'] for row in rows)/len(rows)
    truncated=sum(any(not a['ok'] and a['bytes']>0 for a in row['attempts']) for row in rows)/len(rows)
    framing=sum(not a['framing'] for row in rows for a in row['attempts'])
    recovery_cases=[row for row in rows if row['automaticRecoveries']>0]
    replay=[row['cachedReplaySeconds'] for row in rows if row['cachedReplaySeconds'] is not None]
    recovery_rate=sum(row['success'] for row in recovery_cases)/len(recovery_cases) if recovery_cases else None
    targets={'successRate':success>=.99,'ttfbP50':bool(firsts) and percentile(firsts,.5)<=2.5,
             'ttfbP95':bool(firsts) and percentile(firsts,.95)<=6,'midStreamRate':truncated<=.005,
             'httpFraming':framing==0,'cachedReplay':bool(replay) and max(replay)<.3,
             'temporaryRecovery':recovery_rate is None or recovery_rate>=.95}
    report={'provider':'Microsoft edge-tts' if args.live else 'local transport fixture (not decoded playback)',
            'syntheticTextOnly':True,'injectedFaults':args.inject_faults,'count':len(rows),'concurrency':args.concurrency,
            'successRate':round(success,4),'ttfbSeconds':{'p50':percentile(firsts,.5),'p95':percentile(firsts,.95)},
            'midStreamRate':round(truncated,4),'invalidHttpTerminations':framing,'automaticRecoveryCases':len(recovery_cases),
            'temporaryRecoveryRate':recovery_rate,'maxCachedReplaySeconds':max(replay) if replay else None,
            'targets':targets,'allTargetsPassed':all(targets.values()),'stats':stats,'rows':rows,
            'limits':['TTFB is transport latency, not time to audible sound.','iOS/Safari and deployment proxy require separate device/network checks.']}
    output=args.output or ROOT/('tests/artifacts/audio-recovery/soak-live.json' if args.live else 'tests/artifacts/audio-recovery/soak-local.json')
    output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k not in {'rows','stats'}},ensure_ascii=False),flush=True)
    return 1 if args.strict and not report['allTargetsPassed'] else 0


if __name__=='__main__':sys.exit(main())

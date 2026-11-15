"""Read-only health/latency probe; no TTS request or personal data is sent."""
import argparse,json,time,urllib.request
from pathlib import Path
def probe(base):
    results=[]
    for path in ['/api/library/status','/api/narration/stats','/api/search?q=chanh%20niem&collection=phucminh&mode=viet']:
        start=time.perf_counter()
        try:
            with urllib.request.urlopen(base.rstrip('/')+path,timeout=20) as response:value=json.load(response);status=response.status
            results.append({'endpoint':path.split('?')[0],'http':status,'milliseconds':round((time.perf_counter()-start)*1000),'summary':{k:value[k] for k in ('version','indexReady','total') if k in value}})
        except Exception as error:results.append({'endpoint':path.split('?')[0],'error':str(error)})
    return {'measuredAt':time.time(),'passed':all(x.get('http')==200 for x in results),'results':results}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--base',default='http://127.0.0.1:8000');p.add_argument('--out',type=Path);args=p.parse_args();result=probe(args.base)
    if args.out:args.out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False));raise SystemExit(0 if result['passed'] else 1)

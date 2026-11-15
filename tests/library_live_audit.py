"""Cold-cache synthesis and complete MP3 decoding across real library excerpts on local/VPS previews."""
import argparse,base64,concurrent.futures,hashlib,json,random,sqlite3,subprocess,sys,tempfile,threading,time,urllib.error,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
from audio_config import load_audio_config
from narration_engine import NarrationEngine
from project_paths import STATE,public_path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--vps',default='http://127.0.0.1:18091')
parser.add_argument('--per-group',type=int,default=4)
parser.add_argument('--label',default='cold-library')
parser.add_argument('--positions',choices=('all','middle'),default='all')
args=parser.parse_args()
out=ROOT/'tests/artifacts/audio-root-20261112';out.mkdir(parents=True,exist_ok=True)
report={'passed':False,'scope':'Actual necessary source excerpts authorized by user; fresh isolated caches; full MP3 decoding',
        'productionUnchanged':True,'samples':[],'results':[],'failures':[]}

def select_samples():
    groups={}
    with sqlite3.connect((STATE/'search.sqlite3').as_uri()+'?mode=ro',uri=True) as db:
        for key,raw in db.execute("SELECT book_key,meta FROM documents WHERE mode='viet' ORDER BY book_key"):
            meta=json.loads(raw)
            groups.setdefault(key.split(':')[0],[]).append({'key':key,'path':str(public_path(meta['source']))})
    rng=random.Random(20261112);books=[]
    for group in ('daithua','daitang','phucminh','ebooks'):books.extend(rng.sample(groups[group],min(args.per_group,len(groups[group]))))
    for key in ('phucminh:mi-tien-van-dap','ebooks:ep-c2f5222bc69d'):
        if key not in {b['key'] for b in books}:books.append(next(b for b in groups[key.split(':')[0]] if b['key']==key))
    script="""const fs=require('fs'),R=require('./app/web/js/reader-model.js'),N=require('./app/web/js/narration-model.js');
const books=JSON.parse(fs.readFileSync(0,'utf8')),result=[];
for(const b of books){const q=N.build(R.parse(fs.readFileSync(b.path,'utf8'))), candidates=q.map((s,i)=>({...s,index:i})).filter(s=>s.kind!=='heading'&&s.text.length>=80&&s.text.length<=600);
 if(!candidates.length)throw new Error('No valid source sample '+b.key);
 const positions=process.argv[1]==='middle'?[candidates[Math.floor(candidates.length/2)]]:[candidates[0],candidates[Math.floor(candidates.length/2)],candidates.at(-1)];
 if(b.key==='phucminh:mi-tien-van-dap')positions.unshift({...q[1],index:1});
 if(b.key==='ebooks:ep-c2f5222bc69d')positions.unshift({...q[10],index:10});
 const seen=new Set();for(const s of positions){if(seen.has(s.index))continue;seen.add(s.index);result.push({key:b.key,segment:s.index+1,count:q.length,text:s.text});}
}process.stdout.write(JSON.stringify(result));"""
    values=json.loads(subprocess.check_output(['node','-e',script,args.positions],input=json.dumps(books,ensure_ascii=False),cwd=ROOT,text=True,encoding='utf-8'))
    report['selectedBooks']=len(books)
    for value in values:report['samples'].append({k:v for k,v in value.items() if k!='text'}|{'characters':len(value['text']),'sha256':hashlib.sha256(value['text'].encode()).hexdigest()})
    return values

def exchange(base,path,payload=None,timeout=160):
    body=json.dumps(payload,ensure_ascii=False).encode() if payload is not None else None
    request=urllib.request.Request(base+path,data=body,headers={'Content-Type':'application/json'} if body else {})
    try:
        with urllib.request.urlopen(request,timeout=timeout) as response:return response.status,response.headers.get('Content-Type',''),response.read()
    except urllib.error.HTTPError as error:
        body=error.read();error.close();raise RuntimeError(f'HTTP {error.code}: '+body.decode(errors='replace')[:300]) from error

def synthesize_one(label,base,sample,voice):
    started=time.monotonic()
    row={'host':label,'book':sample['key'],'segment':sample['segment'],'voice':voice,'characters':len(sample['text']),
         'sha256':hashlib.sha256(sample['text'].encode()).hexdigest(),'passed':False}
    try:
        _,kind,body=exchange(base,'/api/tts',{'text':sample['text'],'voice':voice,'stream':True})
        descriptor=json.loads(body);row['cached']=descriptor['cached'];row['job']=descriptor['url']
        until=time.monotonic()+300
        while True:
            code,kind,body=exchange(base,descriptor['url']+'?priority=foreground&buffered=1')
            if code==202:
                if time.monotonic()>=until:raise TimeoutError('pending job deadline')
                time.sleep(.5);continue
            break
        if code!=200 or not kind.startswith('audio/') or len(body)<256:raise RuntimeError('Invalid audio response')
        _,_,status=exchange(base,descriptor['url']+'?status=1');status=json.loads(status)
        if status.get('complete') is not True:raise RuntimeError('Synthesis incomplete: '+json.dumps(status))
        
        if status.get('actualVoices')!=[voice]:raise RuntimeError('Unexpected actual voice: '+str(status.get('actualVoices')))
        row.update(bytes=len(body),actualVoices=status.get('actualVoices',[]),seconds=round(time.monotonic()-started,3))
        return row,body
    except Exception as error:
        row.update(error=str(error),seconds=round(time.monotonic()-started,3));return row,None

def save():
    (out/(args.label+'.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

temporary=tempfile.TemporaryDirectory(prefix='chanh-phap-cold-audit-')
server.CACHE=Path(temporary.name)
config=load_audio_config();config.relay_url='';config.warmup=False;config.prefetch_depth=0;config.startup_buffer_seconds=0
server.AUDIO_CONFIG=config
engine=NarrationEngine(server.cached_audio,server.cache_audio,config=config,log_path=out/'local-preview-narration.log',read_metadata=server.cached_audio_metadata,write_metadata=server.cache_audio_metadata)
server.STREAM_ENGINE=engine
class Quiet(server.Handler):
    def log_message(self,*args):pass
http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
hosts=[('local',f'http://127.0.0.1:{http.server_port}'),('vps',args.vps.rstrip('/'))]
try:
    samples=select_samples()
    for label,base in hosts:
        _,_,value=exchange(base,'/api/voices');value=json.loads(value)
        assert {v['id'] for v in value['offlineVoices']}=={'vieneu-thien-tam-duc','vieneu-thuc-doan'},(label,value)
    tasks=[(label,base,sample,voice) for sample in samples for voice in ('vieneu-thien-tam-duc','vieneu-thuc-doan') for label,base in hosts]
    report['totalRequests']=len(tasks);save()
    print(json.dumps({'event':'started','books':report['selectedBooks'],'excerpts':len(samples),'requests':len(tasks),'hosts':dict(hosts)}),flush=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True);page=browser.new_page()
        page.goto(hosts[0][1]+'/web-thuvien/index.html',wait_until='networkidle')
        page.evaluate('window.audioDecoder=new AudioContext()')
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
            futures=[pool.submit(synthesize_one,*task) for task in tasks]
            for future in concurrent.futures.as_completed(futures):
                row,audio=future.result()
                if audio:
                    try:
                        decoded=page.evaluate('''async encoded=>{
                          const raw=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
                          const buffer=await audioDecoder.decodeAudioData(raw.buffer),samples=buffer.getChannelData(0);
                          let sum=0;for(const value of samples)sum+=value*value;
                          return {duration:buffer.duration,sampleRate:buffer.sampleRate,rms:Math.sqrt(sum/samples.length)};
                        }''',base64.b64encode(audio).decode())
                        if decoded['duration']<=.05 or decoded['rms']<.00001:raise RuntimeError('Audio is empty or silent')
                        row.update(decoded=decoded,passed=True)
                    except Exception as error:row['error']='Decoder: '+str(error)
                report['results'].append(row)
                if not row['passed']:report['failures'].append(row)
                save()
                print(json.dumps({'completed':len(report['results']),'total':len(tasks),'failures':len(report['failures']),**row},ensure_ascii=False),flush=True)
        browser.close()
    for label,base in hosts:
        _,_,stats=exchange(base,'/api/narration/stats');report[label+'Stats']=json.loads(stats)
    report['passed']=not report['failures'] and len(report['results'])==len(tasks)
finally:
    http.shutdown();http.server_close();thread.join()
    for job in engine.jobs.values():
        if not job.done:job.cancelled.set()
    temporary.cleanup();save()
print(json.dumps({'passed':report['passed'],'requests':len(report['results']),'failures':len(report['failures'])}),flush=True)
sys.exit(0 if report['passed'] else 1)

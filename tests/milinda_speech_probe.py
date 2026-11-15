"""Test the exact publicly served Milinda passage reported by the user."""
import argparse,hashlib,json,subprocess,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from audio_config import load_audio_config
from narration_engine import NarrationEngine,transport_parts

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--segment',type=int,default=11)
parser.add_argument('--voice',default='vi-VN-NamMinhNeural')
args=parser.parse_args()
source=ROOT/'data/generated/dai-tang-kinh/text/ep-c2f5222bc69d.md'
script="""const fs=require('node:fs'),Reader=require('./app/web/js/reader-model.js'),Narration=require('./app/web/js/narration-model.js');
const queue=Narration.build(Reader.parse(fs.readFileSync(process.argv[1],'utf8'))),segment=queue[Number(process.argv[2])-1];
if(!segment)throw new Error('Unknown segment');process.stdout.write(JSON.stringify({count:queue.length,text:segment.text}));"""
sample=json.loads(subprocess.check_output(['node','-e',script,str(source),str(args.segment)],cwd=ROOT,text=True,encoding='utf-8'))
text=sample['text']
config=load_audio_config();config.relay_url='';config.warmup=False
cache={};engine=NarrationEngine(cache.get,cache.__setitem__,config=config,log_path=None)
started=time.monotonic();job=engine.create(text,args.voice,'-5%',hashlib.sha256((args.voice+'\0'+text).encode()).hexdigest())
engine.attach(job)
try:
    deadline=started+max(100,len(text)/7+40)
    while not job.done and time.monotonic()<deadline:time.sleep(.1)
    result={'book':'ebooks:ep-c2f5222bc69d','segment':args.segment,'voice':args.voice,'characters':len(text),'transportLengths':[len(p) for p in transport_parts(text,config.transport_limit)],'ok':job.done and not job.error,'bytes':job.bytes,'error':job.error,'seconds':round(time.monotonic()-started,3),'stats':engine.stats()}
    destination=ROOT/'tests/artifacts/audio-milinda-20261112'
    (destination/f'probe-{args.segment}-{args.voice}.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if result['ok']:(destination/f'probe-{args.segment}-{args.voice}.mp3').write_bytes(b''.join(job.chunks))
    print(json.dumps(result,ensure_ascii=False),flush=True)
    if not result['ok']:raise SystemExit(1)
finally:engine.detach(job)

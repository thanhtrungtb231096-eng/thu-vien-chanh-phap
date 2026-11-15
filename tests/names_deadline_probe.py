"""Measure real first-audio latency for the uncached names passage found by the library audit."""
import argparse,asyncio,hashlib,json,re,sqlite3,subprocess,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from narration_engine import speech_text,transport_parts
from project_paths import STATE,public_path
import edge_tts
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--voice',default='vi-VN-NamMinhNeural');args=parser.parse_args()
with sqlite3.connect((STATE/'search.sqlite3').as_uri()+'?mode=ro',uri=True) as db:meta=json.loads(db.execute("SELECT meta FROM documents WHERE book_key=? AND mode='viet'",('daithua:dt_05_1',)).fetchone()[0])
script="const fs=require('fs'),R=require('./app/web/js/reader-model.js'),N=require('./app/web/js/narration-model.js');console.log(JSON.stringify(N.build(R.parse(fs.readFileSync(process.argv[1],'utf8')))[2].text));"
paragraph=json.loads(subprocess.check_output(['node','-e',script,str(public_path(meta['source']))],cwd=ROOT,text=True,encoding='utf-8'))
parts=transport_parts(paragraph);samples=[('names-original',parts[2]),('names-spaces',re.sub(r'(?<=[^\W\d_])\s*-\s*(?=[^\W\d_])',' ',parts[2]))]
results=[]
async def main():
    for label,text in samples:
        started=time.monotonic();audio=bytearray();first=None;error=''
        try:
            async with asyncio.timeout(60):
                async for packet in edge_tts.Communicate(speech_text(text),args.voice,rate='-5%',connect_timeout=8,receive_timeout=35).stream():
                    if packet['type']=='audio':
                        if first is None:first=round(time.monotonic()-started,3)
                        audio.extend(packet['data'])
        except Exception as e:error=type(e).__name__
        row={'case':label,'voice':args.voice,'sha256':hashlib.sha256(text.encode()).hexdigest(),'characters':len(text),'firstAudioSeconds':first,'seconds':round(time.monotonic()-started,3),'bytes':len(audio),'error':error,'ok':not error and len(audio)>256}
        results.append(row);print(json.dumps(row),flush=True)
        out=ROOT/'tests/artifacts/audio-root-20261112'
        (out/('names-deadline-'+args.voice+'.json')).write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
asyncio.run(main())

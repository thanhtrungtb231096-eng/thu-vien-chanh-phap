"""Compare one complete passage with short transport requests; use the selected voices only."""
import argparse,asyncio,hashlib,json,sqlite3,subprocess,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from narration_engine import edge_stream,transport_parts
from project_paths import STATE,public_path
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--rounds',type=int,default=2);args=parser.parse_args()
with sqlite3.connect((STATE/'search.sqlite3').as_uri()+'?mode=ro',uri=True) as db:
    meta=json.loads(db.execute("SELECT meta FROM documents WHERE book_key=? AND mode='viet'",('phucminh:mi-tien-van-dap',)).fetchone()[0])
script="const fs=require('fs'),R=require('./app/web/js/reader-model.js'),N=require('./app/web/js/narration-model.js');console.log(JSON.stringify(N.build(R.parse(fs.readFileSync(process.argv[1],'utf8')))[1].text));"
paragraph=json.loads(subprocess.check_output(['node','-e',script,str(public_path(meta['source']))],cwd=ROOT,text=True,encoding='utf-8'))
samples=[('whole',paragraph),('short',transport_parts(paragraph)[1])];results=[]
out=ROOT/'tests/artifacts/audio-root-20261112'
async def main():
    for number in range(args.rounds):
        for voice in ('vi-VN-NamMinhNeural','vi-VN-HoaiMyNeural'):
            for label,text in samples:
                started=time.monotonic();audio=bytearray();first=None;error=''
                try:
                    async with asyncio.timeout(60):
                        async for data in edge_stream(text,voice,'-5%'):
                            if first is None:first=round(time.monotonic()-started,3)
                            audio.extend(data)
                except Exception as e:error=type(e).__name__
                row={'round':number+1,'case':label,'voice':voice,'sha256':hashlib.sha256(text.encode()).hexdigest(),'characters':len(text),'seconds':round(time.monotonic()-started,3),'firstAudioSeconds':first,'bytes':len(audio),'error':error,'passed':not error and len(audio)>=256}
                results.append(row);print(json.dumps(row),flush=True)
                if row['passed']:(out/('transport-'+label+'-'+voice+'.mp3')).write_bytes(audio)
                (out/'transport-size-live.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
                await asyncio.sleep(.5)
asyncio.run(main())

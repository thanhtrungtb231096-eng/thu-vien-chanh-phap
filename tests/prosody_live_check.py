"""Check whether documented prosody parameters change failures, without changing either voice."""
import asyncio,hashlib,json,random,sqlite3,subprocess,sys,time
from pathlib import Path
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from narration_engine import edge_stream,transport_parts
from project_paths import STATE,public_path
import edge_tts
samples=[]
with sqlite3.connect((STATE/'search.sqlite3').as_uri()+'?mode=ro',uri=True) as db:
    for key,index,part in [('phucminh:hoi-dap-can-ban',412,0),('ebooks:ep-c2f5222bc69d',546,-1)]:
        meta=json.loads(db.execute("SELECT meta FROM documents WHERE book_key=? AND mode='viet'",(key,)).fetchone()[0])
        script="const fs=require('fs'),R=require('./app/web/js/reader-model.js'),N=require('./app/web/js/narration-model.js');console.log(JSON.stringify(N.build(R.parse(fs.readFileSync(process.argv[1],'utf8')))[Number(process.argv[2])].text));"
        paragraph=json.loads(subprocess.check_output(['node','-e',script,str(public_path(meta['source'])),str(index)],cwd=ROOT,text=True,encoding='utf-8'))
        samples.append((key,transport_parts(paragraph)[part]))
original=edge_tts.Communicate;results=[];rng=random.Random(20261112)
async def main():
    for number in range(2):
        for key,text in samples:
            for voice in ('vi-VN-NamMinhNeural','vi-VN-HoaiMyNeural'):
                variants=[('-5%','+0Hz'),('+0%','+0Hz'),('-5%','+1Hz')];rng.shuffle(variants)
                for rate,pitch in variants:
                    def communicate(*args,**kwargs):return original(*args,pitch=pitch,**kwargs)
                    started=time.monotonic();size=0;error=''
                    try:
                        with patch.object(edge_tts,'Communicate',communicate):
                            async with asyncio.timeout(40):
                                async for data in edge_stream(text,voice,rate):size+=len(data)
                    except Exception as e:error=type(e).__name__
                    row={'round':number+1,'source':key,'rate':rate,'pitch':pitch,'voice':voice,'sha256':hashlib.sha256(text.encode()).hexdigest(),'characters':len(text),'seconds':round(time.monotonic()-started,3),'bytes':size,'error':error,'passed':not error and size>=256}
                    results.append(row);print(json.dumps(row),flush=True)
                    (ROOT/'tests/artifacts/audio-root-20261112/prosody-live.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
                    await asyncio.sleep(.5)
asyncio.run(main())

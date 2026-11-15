"""Controlled compatibility probe: same Vietnamese words/voices, SSML locale and rate only."""
import asyncio,hashlib,json,sqlite3,subprocess,sys,time
from pathlib import Path
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from narration_engine import edge_stream,transport_parts
from project_paths import STATE,public_path
import edge_tts.communicate as sdk
with sqlite3.connect((STATE/'search.sqlite3').as_uri()+'?mode=ro',uri=True) as db:
    meta=json.loads(db.execute("SELECT meta FROM documents WHERE book_key=? AND mode='viet'",('daithua:dt_05_1',)).fetchone()[0])
script="const fs=require('fs'),R=require('./app/web/js/reader-model.js'),N=require('./app/web/js/narration-model.js');console.log(JSON.stringify(N.build(R.parse(fs.readFileSync(process.argv[1],'utf8')))[27].text));"
paragraph=json.loads(subprocess.check_output(['node','-e',script,str(public_path(meta['source']))],cwd=ROOT,text=True,encoding='utf-8'))
text=transport_parts(paragraph)[-1];original=sdk.mkssml;results=[]
async def main():
    for number in range(2):
        for voice in ('vi-VN-NamMinhNeural','vi-VN-HoaiMyNeural'):
            for locale,rate in [('en-US','-5%'),('vi-VN','-5%'),('vi-VN','+0%'),('en-US','+0%')]:
                def ssml(*args):return original(*args).replace("xml:lang='en-US'","xml:lang='"+locale+"'")
                started=time.monotonic();size=0;error=''
                try:
                    with patch.object(sdk,'mkssml',ssml):
                        async with asyncio.timeout(40):
                            async for data in edge_stream(text,voice,rate):size+=len(data)
                except Exception as e:error=type(e).__name__
                row={'round':number+1,'locale':locale,'rate':rate,'voice':voice,'sha256':hashlib.sha256(text.encode()).hexdigest(),'characters':len(text),'seconds':round(time.monotonic()-started,3),'bytes':size,'error':error,'passed':not error and size>=256}
                results.append(row);print(json.dumps(row),flush=True)
                (ROOT/'tests/artifacts/audio-root-20261112/ssml-locale-live.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
                await asyncio.sleep(.3)
asyncio.run(main())

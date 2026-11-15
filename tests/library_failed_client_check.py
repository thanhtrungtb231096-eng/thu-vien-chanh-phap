"""Replay only failed cold-audit cases through the real deployed browser download/retry flow."""
import argparse,hashlib,json,sqlite3,subprocess,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from project_paths import STATE,public_path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--audit',default='cold-main-recovery.json');args=parser.parse_args()
out=ROOT/'tests/artifacts/audio-root-20261112';audit=json.loads((out/args.audit).read_text())
assert len(audit['results'])==audit['totalRequests'],'Cold audit must finish first'
report={'passed':False,'scope':'Only failed cold-audit cases; actual deployed AudioService retries and full decoding; caches may contain verified clips','cases':[]}
texts={}
def source(row):
    key=(row['book'],row['segment'])
    if key not in texts:
        with sqlite3.connect((STATE/'search.sqlite3').as_uri()+'?mode=ro',uri=True) as db:
            meta=json.loads(db.execute("SELECT meta FROM documents WHERE book_key=? AND mode='viet'",(row['book'],)).fetchone()[0])
        script="const fs=require('fs'),R=require('./app/web/js/reader-model.js'),N=require('./app/web/js/narration-model.js');console.log(JSON.stringify(N.build(R.parse(fs.readFileSync(process.argv[1],'utf8')))[Number(process.argv[2])-1].text));"
        texts[key]=json.loads(subprocess.check_output(['node','-e',script,str(public_path(meta['source'])),str(row['segment'])],cwd=ROOT,text=True,encoding='utf-8'))
    text=texts[key];assert hashlib.sha256(text.encode()).hexdigest()==row['sha256'];return text
def save():(out/'failed-client-replay.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        for host,base in [('local','http://127.0.0.1:8090'),('vps','https://thuvienchanhphap.duckdns.org')]:
            rows=[r for r in audit['results'] if r['host']==host and not r['passed']]
            if not rows:continue
            context=browser.new_context(service_workers='block');page=context.new_page()
            page.goto(base+'/web-thuvien/index.html',wait_until='networkidle')
            page.wait_for_function('!!window.AudioService')
            version=page.evaluate("async()=> (await (await fetch('/api/library/status')).json()).version")
            for row in rows:
                result={k:row[k] for k in ('host','book','segment','voice','sha256')};result['version']=version;start=time.monotonic()
                try:
                    result.update(page.evaluate('''async ({text,voice})=>{
                      const retries=[],descriptor=await AudioService.prepare(text,'online:'+voice,{priority:'foreground'});
                      const blob=descriptor.blob||await AudioService.download(descriptor,{priority:'foreground',onRetry:r=>retries.push(r.attempt)});
                      if(JSON.stringify(descriptor.actualVoices)!==JSON.stringify([voice]))throw new Error('Selected voice mismatch');
                      const decoder=new AudioContext(),audio=await decoder.decodeAudioData(await blob.arrayBuffer());
                      let sum=0;const data=audio.getChannelData(0);for(const sample of data)sum+=sample*sample;
                      await decoder.close();if(audio.duration<=.05||Math.sqrt(sum/data.length)<.00001)throw new Error('Invalid or silent audio');
                      return {passed:true,actualVoices:descriptor.actualVoices,bytes:blob.size,duration:audio.duration,downloadRetries:retries.length};
                    }''',{'text':source(row),'voice':row['voice']}))
                except Exception as error:result.update(passed=False,error=str(error))
                result['seconds']=round(time.monotonic()-start,3);report['cases'].append(result);save();print(json.dumps(result),flush=True)
            context.close()
        browser.close()
    report['passed']=all(r['passed'] for r in report['cases'])
finally:save()
print(json.dumps({'passed':report['passed'],'cases':len(report['cases'])}),flush=True)
sys.exit(0 if report['passed'] else 1)

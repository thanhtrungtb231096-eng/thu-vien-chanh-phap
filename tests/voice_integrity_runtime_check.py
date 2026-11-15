"""Decode recovered complete audio, retain the selected voice and play offline."""
import io,json,sys,threading,wave
from urllib.parse import urljoin
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine
from playwright.sync_api import sync_playwright

output=io.BytesIO()
with wave.open(output,'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(8000);wav.writeframes(b'\0\0'*16000)
fixture=output.getvalue()
calls=[];memory={};attempts={}
async def provider(text,voice,rate):
    calls.append((text,voice,rate))
    key=(text,voice,rate);attempts[key]=attempts.get(key,0)+1
    if attempts[key]==1:
        yield fixture[:720];raise ConnectionError('injected interrupted transport')
    yield fixture

config=AudioConfig(retries=1,backoff_ms=(1,),warmup=False,prefetch_depth=0,startup_buffer_seconds=0)
server.AUDIO_CONFIG=config
server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,provider,config=config,log_path=None)
class Quiet(server.Handler):
    def log_message(self,*args):pass
http=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);http.allowed_patterns=set()
thread=threading.Thread(target=http.serve_forever,daemon=True);thread.start()
report={'passed':False,'checks':[],'pageErrors':[],'fixture':'Local deterministic audio fixture; no live TTS'}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        context=browser.new_context(service_workers='allow')
        context.add_init_script('const NativeAudio=Audio;window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};Audio.prototype=NativeAudio.prototype;')
        page=context.new_page();page.on('pageerror',lambda e:report['pageErrors'].append(str(e)))
        page.goto(f'http://127.0.0.1:{http.server_port}/web-thuvien/index.html',wait_until='networkidle')
        page.wait_for_selector('#audio-voice',state='attached')
        page.wait_for_function('LibraryOffline.ready && !!navigator.serviceWorker.controller',timeout=30000)
        paragraph=' '.join(f'Local item {i}: This authored paragraph tests stable same-voice recovery without publishing an incomplete clip.' for i in range(1,5))
        page.locator('#audio-voice').select_option('offline:vieneu-thien-tam-duc',force=True)
        page.evaluate("doc=>{Audiobook.connect(ReaderModel.parse(doc),'test:voice-integrity','unavailable',true);Audiobook.seekChunk(1,0,false);void Audiobook.start();}",'# Local preview\n\n'+paragraph)
        page.wait_for_function("Audiobook.state.status==='playing' && testAudio.currentTime>.15")
        state=page.evaluate('Audiobook.state')
        assert state['voice']=='offline:vieneu-thien-tam-duc' and state['actualVoices']==['vieneu-thien-tam-duc'],state
        assert 'Thiền Tâm Đức' in state['voiceLabel'],state
        assert page.evaluate("!testAudio.error && testAudio.src.startsWith('blob:')")
        report['checks'].append('An interrupted male clip retries Thiền Tâm Đức; only complete audio decodes with the selected label')
        page.locator('#audio-voice').select_option('offline:vieneu-thuc-doan',force=True)
        page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.actualVoices.includes('vieneu-thuc-doan') && testAudio.currentTime>.15")
        assert page.evaluate("Audiobook.state.index===1 && Audiobook.state.voiceLabel.includes('Thục Đoan') && !testAudio.error")
        page.evaluate('Audiobook.pause()');seconds=page.evaluate('Audiobook.state.currentTime');page.wait_for_timeout(150)
        assert abs(page.evaluate('Audiobook.state.currentTime')-seconds)<.1
        page.evaluate('void Audiobook.start()');page.wait_for_function('s=>Audiobook.state.currentTime>s+.1',arg=seconds)
        report['checks'].append('Switching to Thục Đoan keeps the passage and pause/resume retains seconds')
        page.evaluate('Audiobook.stop()')
        result=page.evaluate('''async()=>{
          AudioService.configure({progressive:false});
          const descriptor=await AudioService.prepare('A different local sentence tests the non-streaming endpoint.','offline:vieneu-thien-tam-duc');
          AudioService.configure({progressive:true});
          return {blob:descriptor.blob instanceof Blob,actualVoices:descriptor.actualVoices};
        }''')
        assert result=={'blob':True,'actualVoices':['vieneu-thien-tam-duc']},result
        report['checks'].append('Non-streaming synthesis follows the same complete-clip validation and selected voice')
        old=page.evaluate('''async()=>{
          const text='An old unverified audio prefix.',voice='offline:vieneu-thien-tam-duc';
          const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(voice+'\\0'+text));
          const key='audio:'+Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
          await LibraryOffline.media('put',key,new Blob(['old incomplete prefix'],{type:'audio/mpeg'}));
          return {unverifiedIgnored:(await LibraryOffline.getAudioInfo(text,voice))===null,sourceRetained:(await LibraryOffline.media('get',key)) instanceof Blob};
        }''')
        assert old=={'unverifiedIgnored':True,'sourceRetained':True},old
        report['checks'].append('Old unverified offline clips cannot replay as complete audio; no source or progress is deleted')
        source=page.evaluate("Reader.path(DharmaPlayerStore.resolve({type:'daithua',id:'dt_10_1'}),'viet')")
        doc='# Offline voice metadata\n\nA locally authored sentence for a downloaded selected voice.'
        context.route(urljoin(page.url,source),lambda route:route.fulfill(body=doc,content_type='text/markdown; charset=utf-8'))
        result=page.evaluate('''async text=>{
          const item=DharmaPlayerStore.resolve({type:'daithua',id:'dt_10_1'}),doc=ReaderModel.parse(text);
          await LibraryOffline.saveBook(item);
          await LibraryOffline.saveChapter(item,doc,0,doc.blocks.length,'offline:vieneu-thuc-doan');
          const segment=NarrationModel.build(doc)[1];
          window.savedOfflineSegment=segment.text;
          const info=await LibraryOffline.getAudioInfo(segment.text,'offline:vieneu-thuc-doan');
          return {voices:info.actualVoices,legacyBlob:(await LibraryOffline.getAudio(segment.text,'offline:vieneu-thuc-doan')) instanceof Blob};
        }''',doc)
        assert result=={'voices':['vieneu-thuc-doan'],'legacyBlob':True},result
        note=page.evaluate('''async()=>{
          const packs=LibraryOffline.packs(),original=packs[0].chapters;
          packs[0].chapters=[{id:'legacy',completed:2,total:2,voice:'offline:vieneu-thuc-doan'}];
          LibraryStore.write('offline-packs',packs);await LibraryUpgrades.renderOffline();
          const message=document.getElementById('offline-books').textContent;
          packs[0].chapters=original;LibraryStore.write('offline-packs',packs);
          return message;
        }''')
        assert 'Bản nghe cũ cần tải lại' in note,note
        report['checks'].append('Offline library identifies old unverified chapters as needing another download')
        context.set_offline(True)
        page.evaluate("void DharmaPlayerStore.playItem({type:'daithua',id:'dt_10_1'},{restart:true})")
        page.wait_for_function("Audiobook.state.status==='playing' && Audiobook.state.voiceLabel.includes('Thục Đoan') && !testAudio.error")
        report['checks'].append('Downloaded audio keeps the selected voice and plays offline with the correct label')
        assert not report['pageErrors'],report['pageErrors']
        report['passed']=True;page.evaluate('Audiobook.stop()');browser.close()
except Exception as error:report['failure']=str(error);raise
finally:
    http.shutdown();http.server_close();thread.join()
    (ROOT/'tests/artifacts/audio-root-20261112/voice-integrity-runtime.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))

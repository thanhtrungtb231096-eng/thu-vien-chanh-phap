"""Decode the actual reported passage on a running library, with user-authorized TTS."""
import argparse
import hashlib
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'local/runtime/python')]
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base', default='http://127.0.0.1:8090')
parser.add_argument('--label', default='local')
args = parser.parse_args()
report = {'base': args.base, 'payload': 'Actual necessary excerpts, explicitly authorized by user',
          'checks': [], 'pageErrors': [], 'playerErrors': [], 'httpErrors': [], 'jobs': [], 'passed': False}
jobs = []


def response_seen(response):
    if '/api/audio/' in response.url and response.status >= 400:
        report['httpErrors'].append({'status': response.status, 'url': response.url})
    if not response.url.endswith('/api/tts'):
        return
    payload = response.request.post_data_json
    if response.status != 200:
        report['httpErrors'].append({'status': response.status, 'url': response.url})
        return
    if 'application/json' in response.headers.get('content-type', ''):
        descriptor = response.json()
        record = {'voice': payload['voice'], 'characters': len(payload['text']),
                  'sha256': hashlib.sha256(payload['text'].encode()).hexdigest(), **descriptor}
        jobs.append(record)
        report['jobs'].append(record)


try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(service_workers='block')
        context.add_init_script('''
          const NativeAudio=Audio;
          window.Audio=function(){const a=new NativeAudio();a.volume=0;return window.testAudio=a;};
          Audio.prototype=NativeAudio.prototype;
        ''')
        page = context.new_page()
        page.on('pageerror', lambda e: report['pageErrors'].append(str(e)))
        page.on('response', response_seen)
        page.goto(args.base.rstrip('/') + '/web-thuvien/index.html', wait_until='networkidle')
        page.wait_for_selector('#audio-voice', state='attached')
        page.wait_for_function("[...document.getElementById('audio-voice').options].some(x=>x.value==='online:vi-VN-NamMinhNeural')")
        page.evaluate("window.playerErrors=[];addEventListener('dharma-audio',e=>{if(e.detail.status==='error')playerErrors.push(e.detail.message);})")
        report['version'] = page.evaluate("async()=>(await(await fetch('data/library-version.json',{cache:'no-store'})).json()).version")
        page.evaluate('AudioService.configure({prefetchDepth:0,startupBufferSeconds:12})')
        selection = page.evaluate('''async()=>{
          const ref={type:'ebooks',id:'ep-c2f5222bc69d'},item=DharmaPlayerStore.resolve(ref);
          const doc=ReaderModel.parse(await(await fetch(Reader.path(item,'viet'))).text());
          const segments=NarrationModel.build(doc),s=segments[10];
          const select=document.getElementById('audio-voice');
          select.value='online:vi-VN-HoaiMyNeural';select.dispatchEvent(new Event('change'));
          void DharmaPlayerStore.playItem(ref,{restart:true,block:s.block,sourceOffset:s.sourceOffset});
          return {title:item.title,characters:s.text.length,count:segments.length,block:s.block};
        }''')
        assert selection['count'] == 1154 and selection['characters'] == 397, selection
        report['selection'] = selection

        for voice in ('HoaiMy', 'NamMinh'):
            started = time.monotonic()
            if voice == 'NamMinh':
                page.locator('#audio-voice').select_option('online:vi-VN-NamMinhNeural', force=True)
            page.wait_for_function("voice=>Audiobook.state.voice==='online:vi-VN-'+voice+'Neural' && Audiobook.state.index===10 && Audiobook.state.status==='playing' && testAudio.currentTime>.4 && !testAudio.paused", arg=voice, timeout=180000)
            state = page.evaluate('Audiobook.state')
            assert page.evaluate('!testAudio.error && testAudio.readyState>=2')
            entry = {'voice': voice, 'segment': 11, 'firstPlaybackSeconds': round(time.monotonic()-started, 3),
                     'decoded': True, 'index': state['index'], 'source': page.evaluate('testAudio.src').split('?')[0]}
            page.evaluate('Audiobook.pause()')
            position = page.evaluate('Audiobook.state.currentTime')
            page.wait_for_timeout(250)
            assert abs(page.evaluate('Audiobook.state.currentTime') - position) < .1
            matching = next(j for j in reversed(jobs) if j['voice'] == 'vi-VN-' + voice + 'Neural' and j['characters'] == 397)
            page.wait_for_function('''async path=>{
              const s=await(await fetch(path+'?status=1',{cache:'no-store'})).json();
              if(s.done&&!s.complete)throw new Error(JSON.stringify(s));
              return s.complete;
            }''', arg=matching['url'], timeout=180000, polling=1000)
            entry['complete'] = True
            page.evaluate('void Audiobook.start()')
            page.wait_for_function('seconds=>Audiobook.state.status==="playing"&&Audiobook.state.currentTime>seconds+.2', arg=position, timeout=15000)
            entry['pauseResumePreservedPosition'] = True
            report['checks'].append(entry)
            print(json.dumps(entry, ensure_ascii=False), flush=True)

        # Short Roman headings were another confirmed failing input in the VPS log.
        for segment in (9, 12):
            for voice in ('NamMinh', 'HoaiMy'):
                page.evaluate('Audiobook.pause()')
                page.locator('#audio-voice').select_option('online:vi-VN-' + voice + 'Neural', force=True)
                page.evaluate('i=>Audiobook.seekChunk(i,0,true)', segment-1)
                started = time.monotonic()
                page.wait_for_function("({i,v})=>Audiobook.state.index===i && Audiobook.state.voice==='online:vi-VN-'+v+'Neural' && Audiobook.state.status==='playing' && testAudio.currentTime>.1 && !testAudio.error", arg={'i': segment-1, 'v': voice}, timeout=120000, polling=50)
                page.evaluate('Audiobook.pause()')
                entry = {'segment': segment, 'voice': voice, 'decoded': True, 'seconds': round(time.monotonic()-started, 3)}
                report['checks'].append(entry)
                print(json.dumps(entry), flush=True)

        # Reload must retain an explicitly selected male voice after discovery.
        page.locator('#audio-voice').select_option('online:vi-VN-NamMinhNeural', force=True)
        report['playerErrors'] = page.evaluate('playerErrors')
        page.reload(wait_until='networkidle')
        page.wait_for_function("Audiobook.state.voice==='online:vi-VN-NamMinhNeural'")
        report['maleVoiceRetainedAfterReload'] = True
        assert not report['pageErrors'], report['pageErrors']
        assert not report['playerErrors'], report['playerErrors']
        # Temporary HTTP failures may be recovered by the bounded download retry.
        # Keep them in the evidence; all excerpts must still decode without a UI error.
        assert all(e['status'] in (429, 502, 503, 504) for e in report['httpErrors']), report['httpErrors']
        report['passed'] = True
        browser.close()
except Exception as error:
    report['failure'] = str(error)
    raise
finally:
    out = ROOT / 'tests/artifacts/audio-milinda-20261112'
    out.mkdir(parents=True, exist_ok=True)
    (out / (args.label + '-live-browser.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'passed': report['passed'], 'checks': len(report['checks']), 'version': report.get('version')}, ensure_ascii=False))

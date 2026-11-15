"""Measure synthesis with authored test sentences. No source manuscript is transmitted."""

# Locate the shared path registry from either the workspace or an exported release.
from pathlib import Path as _BootstrapPath
import sys as _bootstrap_sys
_bootstrap_app = next(candidate for ancestor in _BootstrapPath(__file__).resolve().parents
                      for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
                      if (candidate / 'project_paths.py').is_file())
_bootstrap_sys.path.insert(0, str(_bootstrap_app))
from project_paths import ROOT, APP, WEB, BUILD, GENERATED, STATE, DEPENDENCIES, AUDIO_CACHE, WORK_CACHE, CONFIG, DIST, REPORTS, SOURCES, public_path, public_relative, release_relative
_bootstrap_sys.path.insert(0, str(BUILD))
_bootstrap_sys.path.insert(0, str(DEPENDENCIES))

import asyncio
import json
from pathlib import Path
import sys
import time

sys.path.insert(0,str(DEPENDENCIES))
import edge_tts

sentence='Đây là văn bản thử nghiệm do người phát triển tạo riêng để đo tốc độ giọng đọc. Buổi sáng trời trong, ánh nắng nhẹ qua cửa sổ và những hàng cây xanh. Mỗi câu được đọc rõ ràng, với nhịp điệu tự nhiên và khoảng nghỉ vừa phải. '
def sample(length):
    value=(sentence*12)[:length]
    return value[:value.rfind(' ')]+'.'
samples=[('short',sample(240)),('medium',sample(650)),('long',sample(1760))]
print(json.dumps({'networkPayload':'authored synthetic test sentences only','samples':[(label,len(text))for label,text in samples]}),flush=True)

async def probe(label,text):
    started=time.monotonic();first=None;previous=None;largest_gap=0;audio_bytes=0;frames=0
    try:
        async with asyncio.timeout(65):
            async for part in edge_tts.Communicate(text,'vi-VN-HoaiMyNeural',rate='-5%',connect_timeout=8,receive_timeout=20).stream():
                if part['type']!='audio':continue
                now=time.monotonic();frames+=1;audio_bytes+=len(part['data'])
                if first is None:
                    first=now-started
                    print(json.dumps({'sample':label,'firstAudioSeconds':round(first,3),'characters':len(text)}),flush=True)
                if previous is not None:largest_gap=max(largest_gap,now-previous)
                previous=now
        result={'sample':label,'characters':len(text),'firstAudioSeconds':round(first,3)if first else None,'completeSeconds':round(time.monotonic()-started,3),'audioBytes':audio_bytes,'spokenSeconds':round(audio_bytes/6000,1),'largestGapSeconds':round(largest_gap,3),'frames':frames,'success':True}
    except Exception as error:
        result={'sample':label,'characters':len(text),'firstAudioSeconds':round(first,3)if first else None,'elapsedSeconds':round(time.monotonic()-started,3),'audioBytes':audio_bytes,'error':type(error).__name__,'success':False}
    print(json.dumps(result),flush=True)
    return result

async def main():
    results=[]
    for label,text in samples:results.append(await probe(label,text))
    out=ROOT / 'tests/artifacts/audio-recovery/latency-before.json'
    out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(results,indent=2),encoding='utf-8')

asyncio.run(main())

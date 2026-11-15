"""Run the long synthetic two-voice browser probe on an isolated live TTS server."""
import os
import json
from pathlib import Path
import subprocess
import sys
import threading

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
from narration_engine import NarrationEngine
memory={}
artifacts=ROOT/'tests/artifacts/audio-continuity'
artifacts.mkdir(parents=True,exist_ok=True)
server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,config=server.AUDIO_CONFIG,log_path=artifacts/'long-two-voice.log')
class Quiet(server.Handler):
    def log_message(self,*args):pass
service=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);service.allowed_patterns=set()
thread=threading.Thread(target=service.serve_forever,daemon=True);thread.start()
server.STREAM_ENGINE.warmup()
env={**os.environ,'NARRATION_PROBE_URL':f'http://127.0.0.1:{service.server_port}'}
process=None
try:
    process=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'tests/progressive_live_probe.py')],cwd=ROOT,env=env,timeout=300)
finally:
    (artifacts/'long-two-voice-stats.json').write_text(json.dumps({'returncode':process.returncode if process else None,'stats':server.STREAM_ENGINE.stats()},indent=2),encoding='utf-8')
    service.shutdown();service.server_close();thread.join()
sys.exit(process.returncode)

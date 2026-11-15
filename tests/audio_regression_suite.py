"""Run existing browser regressions on an isolated server with no network TTS."""
import json
import argparse
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import types

ROOT=Path(__file__).resolve().parents[1]
names=['playback_continuity_check.py','audio_recovery_check.py','test_spotify_player.py','library_upgrades_check.py','read_listen_continuity_check.py','listening_history_check.py','unified_player_check.py','reading_actions_check.py']
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--only',nargs='+',choices=names)
args=parser.parse_args()
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
import project_paths
import library_services
from narration_engine import NarrationEngine
async def unused(*args):
    raise AssertionError('Browser fixtures must intercept all audio synthesis')
    yield b''
memory={}
server.STREAM_ENGINE=NarrationEngine(memory.get,memory.__setitem__,unused,log_path=None)
class Quiet(server.Handler):
    def log_message(self,*args):pass
service=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);service.allowed_patterns=set()
thread=threading.Thread(target=service.serve_forever,daemon=True);thread.start()
base=f'http://127.0.0.1:{service.server_port}'
env={**os.environ,'DHARMA_TEST_URL':base+'/web-thuvien/index.html','AUDIO_RECOVERY_URL':base,'UPGRADES_TEST_URL':base}
results=[]
personal_state=tempfile.TemporaryDirectory(prefix='audio-regression-sync-')
project_paths.AUDIO_PACKS=Path(personal_state.name)/'packs'
# Use the real sync schema in an isolated database; searches keep the real read-only index.
library_services.connect_sync=types.FunctionType(library_services.connect_sync.__code__,
    {**library_services.connect_sync.__globals__,'STATE':Path(personal_state.name)},'connect_sync')
try:
    for name in (args.only or names):
        print('Running '+name,flush=True)
        process=subprocess.run([sys.executable,'-X','utf8',str(ROOT/'tests'/name)],cwd=ROOT,env=env,capture_output=True,text=True,encoding='utf-8',timeout=180)
        results.append({'test':name,'exitCode':process.returncode,'stdout':process.stdout,'stderr':process.stderr})
        print(process.stdout or process.stderr,flush=True)
finally:service.shutdown();service.server_close();thread.join();personal_state.cleanup()
output=ROOT/('tests/artifacts/audio-recovery/browser-regressions-selected.json' if args.only else 'tests/artifacts/audio-recovery/browser-regressions.json')
output.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
sys.exit(1 if any(row['exitCode'] for row in results) else 0)

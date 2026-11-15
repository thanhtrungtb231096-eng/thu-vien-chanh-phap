"""Known synthesis, operational JSON log and configuration/telemetry access checks."""
import asyncio
import http.client
import json
from pathlib import Path
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
import server
from audio_config import AudioConfig, load_audio_config
from narration_engine import NarrationEngine


class StatsTests(unittest.TestCase):
    def test_stats_and_log_match_known_work_without_logging_text(self):
        with tempfile.TemporaryDirectory() as folder:
            memory={};attempts=[]
            async def provider(*args):
                attempts.append(1)
                if len(attempts)==1:raise ConnectionError('private upstream details')
                await asyncio.sleep(.02);yield b'x'*1024
            log=Path(folder)/'narration.log'
            engine=NarrationEngine(memory.get,memory.__setitem__,provider,config=AudioConfig(backoff_ms=(1,)),log_path=log)
            class Quiet(server.Handler):
                def log_message(self,*args):pass
            service=server.LibraryHTTPServer(('127.0.0.1',0),Quiet);service.allowed_patterns=set()
            thread=threading.Thread(target=service.serve_forever,daemon=True);thread.start()
            conn=http.client.HTTPConnection('127.0.0.1',service.server_port,timeout=5)
            try:
                with patch.object(server,'STREAM_ENGINE',engine):
                    job=engine.create('PRIVATE_LOCAL_TEXT','voice','rate','digest')
                    conn.request('GET','/api/audio/'+job.token)
                    response=conn.getresponse();self.assertEqual(len(response.read()),1024)
                    deadline=time.monotonic()+1
                    while engine.stats()['counters'].get('job-complete',0)!=1 and time.monotonic()<deadline:time.sleep(.01)
                    conn.request('GET','/api/narration/stats');response=conn.getresponse();stats=json.loads(response.read())
                    self.assertEqual(stats['counters']['job-complete'],1)
                    self.assertEqual(stats['counters']['clip-retry'],1)
                    self.assertEqual(stats['ttfbMs']['samples'],1)
                    self.assertEqual(stats['streamTruncated'],0)
                    conn.request('POST','/api/narration/events',body=json.dumps({'event':'recovery-success'}),headers={'Content-Type':'application/json'})
                    self.assertEqual(conn.getresponse().status,200)
                    self.assertEqual(engine.stats()['recoveries'],1)
                    conn.close()
                    conn=http.client.HTTPConnection('127.0.0.1',service.server_port,timeout=5)
                    conn.request('GET','/api/narration/stats',headers={'Host':'untrusted.example'})
                    response=conn.getresponse();response.read();self.assertEqual(response.status,403)
            finally:
                conn.close();service.shutdown();service.server_close();thread.join()
            entries=[json.loads(line) for line in log.read_text(encoding='utf-8').splitlines()]
            self.assertTrue(any(e['ev']=='first-audio' and e['bytes']==1024 for e in entries))
            self.assertNotIn('PRIVATE_LOCAL_TEXT',log.read_text(encoding='utf-8'))
            self.assertNotIn('private upstream details',log.read_text(encoding='utf-8'))

    def test_invalid_config_falls_back_and_environment_overrides_file(self):
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'audio.txt';path.write_text('workers=99\nretries=2\nbackoff_ms=-1\nwarmup=false\nfirst_byte_timeout=nan\nprefetch_depth=0\n',encoding='utf-8')
            config=load_audio_config(path,{'NARRATION_RETRIES':'4'})
            self.assertEqual(config.workers,3);self.assertEqual(config.retries,4)
            self.assertEqual(config.backoff_ms,(500,1200,2500));self.assertFalse(config.warmup)
            self.assertEqual(config.first_byte_timeout,35);self.assertEqual(config.prefetch_depth,0)


if __name__=='__main__':unittest.main()

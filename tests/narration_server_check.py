"""Exercise real HTTP handlers with a deterministic upstream, including concurrent callers."""

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
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import sys
import tempfile
import threading
import time
import unittest
from unittest.mock import patch
import urllib.request
import urllib.error

sys.path.insert(0,str(APP))
import server
from audio_config import AudioConfig
from narration_engine import NarrationEngine


class NarrationTests(unittest.TestCase):
    def test_only_requested_vietnamese_voices_are_listed_and_accepted(self):
        base=f'http://127.0.0.1:{self.http.server_port}'
        with urllib.request.urlopen(base+'/api/voices',timeout=5) as response:data=json.load(response)
        self.assertEqual(data['voices'],[])
        self.assertFalse(data['onlineAvailable'])
        self.assertEqual({v['id'] for v in data['offlineVoices']},{'vieneu-thien-tam-duc','vieneu-thuc-doan'})
        for bad_voice in ('en-US-AriaNeural','vi-VN-HoaiMyNeural'):
            body=json.dumps({'text':'A locally authored voice validation probe.','voice':bad_voice}).encode()
            request=urllib.request.Request(base+'/api/tts',data=body,headers={'Content-Type':'application/json'})
            with self.assertRaises(urllib.error.HTTPError) as caught:urllib.request.urlopen(request,timeout=5)
            self.assertEqual(caught.exception.code,400);caught.exception.close()
        self.assertEqual(self.calls,0)

    def test_pending_audio_is_polled_without_cancelling_or_restarting_synthesis(self):
        memory={};calls=[]
        async def slow(*args):
            calls.append(1);await asyncio.sleep(.2);yield b'ID3'+b'x'*1024
        config=AudioConfig(first_byte_timeout=.04,warmup=False)
        engine=NarrationEngine(memory.get,memory.__setitem__,slow,config=config,log_path=None)
        with patch.object(server,'STREAM_ENGINE',engine):
            status,data=self.request('authored pending HTTP probe',stream=True)
            self.assertEqual(status,200)
            url=f'http://127.0.0.1:{self.http.server_port}'+json.loads(data)['url']
            with urllib.request.urlopen(url,timeout=3) as response:
                self.assertEqual(response.status,202);self.assertTrue(json.load(response)['pending'])
            time.sleep(.25)
            with urllib.request.urlopen(url,timeout=3) as response:
                self.assertEqual(response.status,200);self.assertEqual(response.read(),b'ID3'+b'x'*1024)
            self.assertEqual(len(calls),1)
            self.assertEqual(engine.stats()['counters']['job-complete'],1)
            self.assertEqual(engine.stats()['counters'].get('job-cancelled',0),0)

    def setUp(self):
        self.folder=tempfile.TemporaryDirectory(prefix='chanh-phap-audio-')
        self.cache=patch.object(server,'CACHE',Path(self.folder.name));self.cache.start()
        class QuietHandler(server.Handler):
            def log_message(self,*args): pass
        self.http=server.LibraryHTTPServer(('127.0.0.1',0),QuietHandler)
        self.http.allowed_patterns=set()
        self.thread=threading.Thread(target=self.http.serve_forever,daemon=True);self.thread.start()
        self.calls=0
        async def fake(text,voice,rate):
            self.calls+=1;await asyncio.sleep(.05);return b'ID3'+b'\0'*2048
        self.real_synthesize=server.synthesize
        self.synthesis=patch.object(server,'synthesize',fake);self.synthesis.start()
        async def fake_stream(text,voice,rate):yield await server.synthesize(text,voice,rate)
        self.engine=NarrationEngine(server.cached_audio,server.cache_audio,fake_stream,config=AudioConfig(retries=0,warmup=False),log_path=None)
        self.stream_patch=patch.object(server,'STREAM_ENGINE',self.engine);self.stream_patch.start()

    def tearDown(self):
        self.http.shutdown();self.http.server_close();self.thread.join()
        self.stream_patch.stop();self.synthesis.stop();self.cache.stop();self.folder.cleanup()

    def request(self,text='Nam mô Phật',stream=False):
        body=json.dumps({'text':text,'voice':'vieneu-thuc-doan','stream':stream}).encode()
        request=urllib.request.Request(f'http://127.0.0.1:{self.http.server_port}/api/tts',data=body,headers={'Content-Type':'application/json'})
        try:
            with urllib.request.urlopen(request,timeout=5) as response:return response.status,response.read()
        except urllib.error.HTTPError as error:return error.code,error.read()

    def test_concurrent_requests_share_one_synthesis_and_cached_audio(self):
        with ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(lambda _:self.request(),range(8)))
        self.assertTrue(all(status==200 and len(data)>1000 for status,data in results))
        self.assertEqual(self.calls,1)
        self.assertEqual(self.request(),results[0]);self.assertEqual(self.calls,1)
        self.assertFalse(server.JOBS)

    def test_unwritable_cache_does_not_interrupt_listening(self):
        blocked=Path(self.folder.name)/'not-a-directory';blocked.write_text('blocked')
        with patch.object(server,'CACHE',blocked):status,data=self.request()
        self.assertEqual(status,200);self.assertGreater(len(data),1000)

    def test_disabling_progressive_returns_complete_audio_for_stream_callers(self):
        with patch.object(server,'AUDIO_CONFIG',AudioConfig(progressive=False)):
            status,data=self.request(stream=True)
        self.assertEqual(status,200);self.assertTrue(data.startswith(b'ID3'))
        self.assertEqual(self.calls,1)

    def test_failed_job_is_released_and_next_request_can_recover(self):
        async def broken(*args):raise ConnectionError('upstream disconnected')
        with patch.object(server,'synthesize',broken):
            status,data=self.request();self.assertEqual(status,502)
            result=json.loads(data);self.assertEqual(result['code'],'upstream');self.assertTrue(result['retryable'])
        self.assertFalse(server.JOBS)
        self.assertEqual(self.request()[0],200)

    def test_network_permission_failure_reports_restart_without_retrying_provider(self):
        calls=[]
        async def blocked(*args):
            calls.append(1)
            try:raise PermissionError(13,'private connection details')
            except PermissionError as error:raise ConnectionError('private provider details') from error
        with patch.object(server,'synthesize',self.real_synthesize),patch.object(server,'_synthesize_attempt',blocked):
            status,data=self.request('Local network permission probe')
        self.assertEqual(status,503)
        result=json.loads(data)
        self.assertEqual(result['code'],'network-denied');self.assertFalse(result['retryable'])
        self.assertIn('MO_THU_VIEN.cmd',result['error']);self.assertNotIn('private',result['error'])
        self.assertEqual(len(calls),1);self.assertFalse(server.JOBS)
        self.assertEqual(self.request()[0],200)

    def test_progressive_network_permission_failure_reaches_audio_and_status_endpoints(self):
        memory={};calls=[]
        async def blocked(*args):
            calls.append(1)
            raise PermissionError(13,'private connection details')
            yield b''
        engine=NarrationEngine(memory.get,memory.__setitem__,blocked,log_path=None)
        with patch.object(server,'STREAM_ENGINE',engine):
            status,data=self.request('Local progressive permission probe',stream=True)
            self.assertEqual(status,200)
            url=f'http://127.0.0.1:{self.http.server_port}'+json.loads(data)['url']
            with self.assertRaises(urllib.error.HTTPError) as caught:urllib.request.urlopen(url,timeout=5)
            self.assertEqual(caught.exception.code,503)
            result=json.loads(caught.exception.read());caught.exception.close()
            self.assertEqual(result['code'],'network-denied');self.assertFalse(result['retryable'])
            with urllib.request.urlopen(url+'?status=1',timeout=5) as response:state=json.load(response)
        self.assertTrue(state['done']);self.assertFalse(state['complete']);self.assertFalse(state['retryable'])
        self.assertEqual(state['code'],'network-denied');self.assertEqual(len(calls),1);self.assertFalse(memory)

    def test_invalid_request_and_busy_queue_have_different_recovery(self):
        status,_=self.request('');self.assertEqual(status,400);self.assertEqual(self.calls,0)
        with patch.object(self.engine,'create',side_effect=RuntimeError('queue full')):
            status,data=self.request();self.assertEqual(status,429);self.assertEqual(json.loads(data)['code'],'busy')
        self.assertFalse(server.JOBS)


if __name__=='__main__':unittest.main()

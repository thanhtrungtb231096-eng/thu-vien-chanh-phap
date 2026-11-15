"""HTTP framing, early upstream errors and byte ranges with local providers only."""
import asyncio
import hashlib
import http.client
import json
from pathlib import Path
import sys
import threading
import time
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT / 'app'), str(ROOT / 'local/runtime/python')]
import server
from narration_engine import NarrationEngine
from audio_config import AudioConfig


class StreamTests(unittest.TestCase):
    def test_buffered_request_keeps_one_job_alive_while_waiting_for_its_tail(self):
        gate=threading.Event();calls=[]
        async def provider(text,*args):
            calls.append(text)
            if len(calls)>1:
                while not gate.is_set():await asyncio.sleep(.005)
            yield b'ID3'+b'x'*1024
        engine=NarrationEngine(self.memory.get,self.memory.__setitem__,provider,config=AudioConfig(first_byte_timeout=.04,transport_limit=80,retries=0),log_path=None)
        text='First complete authored transport sentence with separate words. Second delayed authored transport sentence with separate words.'
        job=engine.create(text,'voice','rate','buffered-tail')
        connection=http.client.HTTPConnection('127.0.0.1',self.http.server_port,timeout=5)
        try:
            with patch.object(server,'STREAM_ENGINE',engine):
                for _ in range(2):
                    connection.request('GET','/api/audio/'+job.token+'?buffered=1')
                    response=connection.getresponse();self.assertEqual(response.status,202);self.assertTrue(json.loads(response.read())['pending'])
                    self.assertEqual(job.bytes,1027);self.assertFalse(job.cancelled.is_set())
                gate.set()
                deadline=time.monotonic()+1
                while not job.done and time.monotonic()<deadline:time.sleep(.005)
                connection.request('GET','/api/audio/'+job.token+'?buffered=1')
                response=connection.getresponse();self.assertEqual(response.status,200);self.assertEqual(len(response.read()),2054)
                self.assertNotIn('Transfer-Encoding',dict(response.getheaders()));self.assertEqual(len(calls),2)
        finally:gate.set();connection.close()

    def setUp(self):
        self.memory = {};self.metadata={}
        class Quiet(server.Handler):
            def log_message(self, *args): pass
        self.http = server.LibraryHTTPServer(('127.0.0.1', 0), Quiet)
        self.http.allowed_patterns = set()
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.http.shutdown(); self.http.server_close(); self.thread.join()

    def run_stream(self, provider, digest='test', range_header=None, config=None,text='Local synthetic probe.'):
        engine = NarrationEngine(self.memory.get, self.memory.__setitem__, provider,config=config,log_path=None,read_metadata=self.metadata.get,write_metadata=self.metadata.__setitem__)
        self.last_engine=engine
        job = engine.create(text, 'voice', 'rate', digest)
        connection = http.client.HTTPConnection('127.0.0.1', self.http.server_port, timeout=8)
        with patch.object(server, 'STREAM_ENGINE', engine):
            connection.request('GET', '/api/audio/' + job.token, headers={'Range': range_header} if range_header else {})
            response = connection.getresponse()
            body = response.read()  # IncompleteRead here reproduces the old bug.
            result = response.status, dict(response.getheaders()), body
        connection.close()
        return result

    def test_mid_stream_error_still_has_a_terminating_chunk(self):
        async def provider(text,*args):
            yield b'ID3' + b'\0' * 1024
            if text.startswith('Second'):
                await asyncio.sleep(.08)
                raise ConnectionError('injected mid-stream failure')
        text='First completed transport contains authored local test words. Second failing transport contains more authored local test words.'
        status, headers, body = self.run_stream(provider,config=AudioConfig(transport_limit=70,retries=0),text=text)
        self.assertEqual(status, 200)
        self.assertEqual(headers['Transfer-Encoding'], 'chunked')
        self.assertEqual(len(body), 1027)
        self.assertNotIn('test', self.memory)

    def test_early_failure_returns_retryable_json_before_audio_headers(self):
        async def provider(*args):
            raise ConnectionError('injected early failure')
            yield b''
        status, headers, body = self.run_stream(provider)
        self.assertEqual(status, 502)
        data = json.loads(body)
        self.assertEqual(data['code'], 'upstream')
        self.assertTrue(data['retryable'])

    def test_initial_wait_returns_pending_without_cancelling_valid_synthesis(self):
        async def provider(*args):
            await asyncio.sleep(20);yield b'x'*1024
        status,headers,body=self.run_stream(provider,config=AudioConfig(first_byte_timeout=.05,warmup=False))
        self.assertEqual(status,202)
        self.assertTrue(json.loads(body)['pending'])
        stats=self.last_engine.stats()
        self.assertEqual(stats['counters']['first-byte-pending'],1)
        self.assertEqual(stats['errorRate'],0)
        self.assertFalse(next(iter(self.last_engine.jobs.values())).cancelled.is_set())

    def test_reusing_a_finished_descriptor_reports_cached(self):
        async def provider(*args):yield b'ID3'+b'x'*1024
        engine=NarrationEngine(self.memory.get,self.memory.__setitem__,provider,log_path=None)
        connection=http.client.HTTPConnection('127.0.0.1',self.http.server_port,timeout=5)
        body=json.dumps({'text':'A locally authored cache descriptor probe.','voice':'vieneu-thuc-doan','stream':True})
        try:
            with patch.object(server,'STREAM_ENGINE',engine):
                connection.request('POST','/api/tts',body,{'Content-Type':'application/json'})
                descriptor=json.loads(connection.getresponse().read())
                self.assertFalse(descriptor['cached'])
                connection.request('GET',descriptor['url'])
                self.assertEqual(len(connection.getresponse().read()),1027)
                connection.request('POST','/api/tts',body,{'Content-Type':'application/json'})
                reused=json.loads(connection.getresponse().read())
                self.assertEqual(reused['url'],descriptor['url']);self.assertTrue(reused['cached'])
        finally:connection.close()

    def test_cached_full_and_suffix_range_have_correct_headers(self):
        value = b'ID3' + b'x' * 1024
        self.memory['cached'] = value
        self.metadata['cached']={'voices':['voice'],'sha256':hashlib.sha256(value).hexdigest()}
        async def unused(*args):
            raise AssertionError('cache should bypass synthesis')
            yield b''
        status, headers, body = self.run_stream(unused, 'cached')
        self.assertEqual(status, 200); self.assertEqual(body, value)
        self.assertEqual(headers['Accept-Ranges'], 'bytes')
        self.assertEqual(headers['Content-Length'], str(len(value)))
        status, headers, body = self.run_stream(unused, 'cached', 'bytes=-12')
        self.assertEqual(status, 206); self.assertEqual(body, value[-12:])
        self.assertEqual(headers['Content-Range'], f'bytes {len(value)-12}-{len(value)-1}/{len(value)}')
        status, headers, body = self.run_stream(unused, 'cached', 'bytes=10-25')
        self.assertEqual(status, 206); self.assertEqual(body, value[10:26])
        status, headers, body = self.run_stream(unused, 'cached', 'bytes=99999-')
        self.assertEqual(status, 416)
        self.assertEqual(headers['Content-Range'], f'bytes */{len(value)}')


if __name__ == '__main__': unittest.main()

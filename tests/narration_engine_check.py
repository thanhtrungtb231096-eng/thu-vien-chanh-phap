"""Scheduling and cancellation regressions; all audio providers are local fakes."""

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
import hashlib
from pathlib import Path
import sys
import threading
import time
import unittest
from unittest.mock import patch
from types import SimpleNamespace

sys.path.insert(0,str(APP))
from narration_engine import NarrationEngine,transport_parts,speech_text
from audio_config import AudioConfig


class EngineTests(unittest.TestCase):
    def test_provider_failure_retries_the_same_voice_and_rate(self):
        for succeeds in (True, False):
            calls = []; cache = {}
            async def provider(text, voice, rate):
                calls.append((voice, rate))
                if not succeeds or len(calls) == 1:
                    raise ConnectionError('injected transient outage')
                yield b'x' * 1024
            with self.subTest(succeeds=succeeds):
                config = AudioConfig(retries=2, backoff_ms=(1,), relay_url='')
                engine = NarrationEngine(cache.get, cache.__setitem__, provider, config=config, log_path=None)
                job = engine.create('local same-voice retry probe', 'vieneu-thien-tam-duc', '-20%', 'prosody')
                engine.attach(job); self.wait_done(job)
                self.assertTrue(all(v == 'vieneu-thien-tam-duc' and r == '-20%' for v, r in calls))
                self.assertEqual(len(calls), 2 if succeeds else 3)
                if succeeds:
                    self.assertFalse(job.error); self.assertEqual(job.actual_voices, ['vieneu-thien-tam-duc'])
                else:
                    self.assertEqual(job.error, 'ConnectionError'); self.assertFalse(cache)
                engine.detach(job)

    def test_retry_progress_keeps_the_job_alive_until_a_later_attempt_succeeds(self):
        cache={};calls=[]
        async def provider(*args):
            calls.append(1);await asyncio.sleep(.12)
            if len(calls)<3:raise ConnectionError('temporary provider outage')
            yield b'x'*1024
        config=AudioConfig(retries=2,backoff_ms=(1,),idle_timeout=.1,receive_timeout=.01)
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,config=config,log_path=None)
        job=engine.create('authored retry progress','voice','rate','attempt-progress');engine.attach(job)
        self.wait_done(job);self.assertFalse(job.error);self.assertEqual(len(calls),3);engine.detach(job)

    def test_numbered_contents_and_roman_headings_get_spoken_boundaries(self):
        self.assertEqual(speech_text('Phần II'),'Phần 2.')
        self.assertEqual(speech_text('Quyển XIV'),'Quyển 14.')
        self.assertEqual(speech_text('12. Topic one 13. Topic two 14. Topic three'),'12. Topic one. 13. Topic two. 14. Topic three.')
        self.assertEqual(speech_text('Năm 1984. Sau đó tiếp tục.'),'Năm 1984. Sau đó tiếp tục.')

    def test_pending_poll_hold_expires_when_client_does_not_return(self):
        cache={}
        async def slow(*args):
            await asyncio.sleep(3);yield b'x'*1024
        engine=NarrationEngine(cache.get,cache.__setitem__,slow,log_path=None)
        job=engine.create('authored pending cancellation','voice','rate','hold-expiration')
        engine.attach(job)
        deadline=time.monotonic()+1
        while not job.started and time.monotonic()<deadline:time.sleep(.01)
        engine.detach(job,hold=.08);self.wait_done(job,1)
        self.assertTrue(job.cancelled.is_set());self.assertFalse(cache)

    def test_pending_poll_keeps_foreground_idle_grace_between_requests(self):
        cache={}
        async def slow(*args):
            await asyncio.sleep(.3);yield b'x'*1024
        config=AudioConfig(idle_timeout=.2,receive_timeout=.01,backoff_ms=(1,))
        engine=NarrationEngine(cache.get,cache.__setitem__,slow,config=config,log_path=None)
        job=engine.create('authored foreground poll','voice','rate','foreground-hold')
        engine.attach(job)
        deadline=time.monotonic()+1
        while not job.started and time.monotonic()<deadline:time.sleep(.005)
        time.sleep(.25)
        engine.detach(job,hold=.2)
        self.wait_done(job,1)
        self.assertFalse(job.error);self.assertFalse(job.cancelled.is_set())
        self.assertEqual(cache['foreground-hold'],b'x'*1024)

    def test_numbered_topics_keep_their_numbers_and_every_word(self):
        text=' '.join(f'{i}. Authored numbered topic with meaningful words' for i in range(1,30))
        parts=transport_parts(text,160)
        self.assertTrue(all(len(p)<=160 for p in parts))
        self.assertTrue(all(not __import__('re').search(r'(?:^|\s)\d+\.$',p) for p in parts))
        self.assertEqual(' '.join(parts),text)

    def test_network_permission_failure_stops_without_retries_or_cached_audio(self):
        cache={};calls=[]
        async def blocked(*args):
            calls.append(1)
            try:raise PermissionError(13,'private connection details')
            except PermissionError as error:raise ConnectionError('private provider details') from error
            yield b''
        engine=NarrationEngine(cache.get,cache.__setitem__,blocked,config=AudioConfig(backoff_ms=(1,)),log_path=None)
        job=engine.create('Local network permission probe','voice','rate','network-denied')
        engine.attach(job);self.wait_done(job,2)
        self.assertEqual(job.error,'NetworkAccessDenied')
        self.assertEqual(len(calls),1)
        self.assertFalse(cache)
        self.assertEqual(engine.stats()['counters'].get('clip-retry',0),0)
        engine.detach(job)

    def test_two_prefetch_jobs_run_together_and_leave_foreground_capacity(self):
        cache={};started=set();gate=threading.Event()
        async def provider(text,*args):
            started.add(text)
            if text.startswith('background'):
                while not gate.is_set():await asyncio.sleep(.01)
            yield b'x'*1024
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,config=AudioConfig(workers=3,background_workers=2),log_path=None)
        backgrounds=[engine.create('background-'+str(i),'voice','rate','parallel-'+str(i),1) for i in range(2)]
        for job in backgrounds:engine.attach(job,1)
        deadline=time.monotonic()+2
        while len(started)<2 and time.monotonic()<deadline:time.sleep(.01)
        try:
            self.assertEqual(len(started),2)
            foreground=engine.create('foreground','voice','rate','parallel-foreground')
            engine.attach(foreground);self.wait_done(foreground,1)
            self.assertFalse(foreground.error)
            self.assertFalse(any(job.cancelled.is_set() for job in backgrounds))
            engine.detach(foreground)
        finally:
            gate.set()
            for job in backgrounds:self.wait_done(job);engine.detach(job)

    def test_long_passage_uses_fewer_transport_connections_without_losing_words(self):
        cache={};calls=[];text=('A locally authored sentence with complete words. '*30).strip()
        async def provider(part,*args):calls.append(part);yield b'x'*1024
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,config=AudioConfig(transport_limit=1000),log_path=None)
        job=engine.create(text,'voice','rate','long-transport');engine.attach(job);self.wait_done(job)
        self.assertEqual(' '.join(calls),' '.join(text.split()))
        self.assertLess(len(calls),len(transport_parts(text,320)))
        self.assertTrue(all(len(part)<=1000 for part in calls));engine.detach(job)

    def test_warmup_contacts_provider_even_when_a_clip_is_cached(self):
        digest=hashlib.sha256(('vieneu-thuc-doan\0-5%\0clip-v3\0Xin chào.').encode()).hexdigest()
        cache={digest:b'x'*1024};calls=[]
        async def provider(*args):
            calls.append(args);yield b'x'*1024
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,config=AudioConfig(warmup=True),log_path=None)
        for expected in (1,2):
            engine.warmup();deadline=time.monotonic()+2
            while engine.stats()['counters'].get('warmup',0)<expected and time.monotonic()<deadline:time.sleep(.01)
        self.assertEqual(len(calls),2);self.assertEqual(set(cache),{digest})

    def wait_done(self,job,seconds=3):
        deadline=time.monotonic()+seconds
        while not job.done and time.monotonic()<deadline:time.sleep(.01)
        self.assertTrue(job.done)

    def test_no_audio_received_retries_with_backoff(self):
        cache={};calls=[]
        class NoAudioReceived(Exception):pass
        async def provider(*args):
            calls.append(time.monotonic())
            if len(calls)<=3:raise NoAudioReceived()
            yield b'x'*1024
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,config=AudioConfig(retries=3,backoff_ms=(20,40,60)),log_path=None)
        job=engine.create('local retry','voice','rate','retry');engine.attach(job)
        self.wait_done(job)
        self.assertFalse(job.error);self.assertEqual(len(calls),4)
        # Windows' asyncio clock can round timers by about 16 ms.
        self.assertGreaterEqual(calls[1]-calls[0],.005)
        self.assertGreaterEqual(calls[3]-calls[2],.03)
        self.assertGreaterEqual(calls[3]-calls[0],.07)
        self.assertEqual(len(cache['retry']),1024)
        engine.detach(job)

    def test_foreground_capacity_is_reserved_without_interrupting_background(self):
        cache={};started=threading.Event()
        async def provider(text,*args):
            if text=='background':
                yield b'x'*512;started.set();await asyncio.sleep(20)
            else:yield b'x'*1024
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,workers=2,log_path=None)
        bg=engine.create('background','voice','rate','bg-reserved',1);engine.attach(bg,1)
        self.assertTrue(started.wait(2))
        fg=engine.create('foreground','voice','rate','fg-reserved');engine.attach(fg)
        self.wait_done(fg,1)
        self.assertFalse(bg.cancelled.is_set());self.assertFalse(fg.error)
        engine.detach(bg);engine.detach(fg)

    def test_stall_fails_cleanly_and_never_caches_partial_audio(self):
        cache={}
        async def provider(*args):
            yield b'x'*512;await asyncio.sleep(20)
        config=AudioConfig(idle_timeout=.1,receive_timeout=.05,backoff_ms=(0,),retries=0)
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,config=config,log_path=None)
        job=engine.create('local stall','voice','rate','stall');engine.attach(job)
        self.wait_done(job,1)
        self.assertEqual(job.error,'TimeoutError');self.assertNotIn('stall',cache)
        engine.detach(job)

    def test_completed_clips_are_reused_after_a_later_clip_fails(self):
        cache={};calls=[];text=('First locally authored part. '*12)+'Second locally authored part.'
        parts=transport_parts(text,320)
        self.assertGreater(len(parts),1)
        async def provider(part,*args):
            calls.append(part)
            if part==parts[-1] and calls.count(part)==1:
                yield b'x'*512;raise ConnectionError()
            yield b'x'*1024
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,config=AudioConfig(transport_limit=320,retries=0),log_path=None)
        first=engine.create(text,'voice','rate','clip-cache');engine.attach(first);self.wait_done(first);engine.detach(first)
        self.assertEqual(first.error,'ConnectionError')
        second=engine.create(text,'voice','rate','clip-cache');engine.attach(second);self.wait_done(second)
        self.assertFalse(second.error);self.assertEqual(calls.count(parts[0]),1)
        self.assertEqual(calls.count(parts[-1]),2)
        engine.detach(second)

    def test_transport_is_bounded_and_keeps_every_word(self):
        text='Một đoạn thử nghiệm, gồm các câu có dấu và khoảng trắng. '*50
        parts=transport_parts(text)
        self.assertTrue(all(len(part)<=320 for part in parts))
        self.assertEqual(' '.join(parts),' '.join(text.split()))

    def test_foreground_releases_a_worker_occupied_by_background(self):
        cache={};first=threading.Event()
        async def provider(text,voice,rate):
            if text=='background':
                yield b'\0'*512;first.set();await asyncio.sleep(20)
            else:yield b'\0'*1024
        engine=NarrationEngine(cache.get,lambda key,value:cache.__setitem__(key,value),provider,workers=1)
        background=engine.create('background','voice','rate','bg',1);engine.attach(background,1)
        self.assertTrue(first.wait(2))
        foreground=engine.create('foreground','voice','rate','fg',0)
        started=time.monotonic();engine.attach(foreground,0)
        deadline=time.monotonic()+2
        while not foreground.done and time.monotonic()<deadline:time.sleep(.01)
        self.assertTrue(foreground.done);self.assertFalse(foreground.error)
        self.assertLess(time.monotonic()-started,1)
        self.assertTrue(background.cancelled.is_set());self.assertTrue(background.done)
        self.assertNotIn('bg',cache,'Never cache an interrupted stream as complete audio')
        engine.detach(background);engine.detach(foreground)

    def test_a_stream_error_cannot_be_mistaken_for_complete_audio(self):
        cache={}
        async def provider(*args):
            yield b'\0'*512;raise ConnectionError('connection interrupted')
        engine=NarrationEngine(cache.get,lambda key,value:cache.__setitem__(key,value),provider,workers=1,config=AudioConfig(retries=0))
        job=engine.create('test','voice','rate','broken',0);engine.attach(job)
        deadline=time.monotonic()+2
        while not job.done and time.monotonic()<deadline:time.sleep(.01)
        self.assertTrue(job.done);self.assertEqual(job.error,'ConnectionError')
        self.assertNotIn('broken',cache)
        self.assertFalse(job.chunks,'Partial clips must never be published as complete audio')
        engine.detach(job)

    def test_partial_clip_is_retried_without_repeated_or_missing_audio(self):
        cache={};calls=[]
        async def provider(*args):
            calls.append(1)
            if len(calls)==1:
                yield b'broken'*100
                raise ConnectionError('interrupted halfway through a clip')
            yield b'complete'*128
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,config=AudioConfig(retries=1,backoff_ms=(1,)),log_path=None)
        job=engine.create('local partial recovery','voice','rate','partial-retry')
        engine.attach(job);self.wait_done(job)
        self.assertFalse(job.error);self.assertEqual(len(calls),2)
        self.assertEqual(b''.join(job.chunks),b'complete'*128)
        self.assertEqual(cache['partial-retry'],b'complete'*128)
        self.assertEqual(engine.stats()['counters']['clip-retry'],1)
        engine.detach(job)

    def test_local_relay_recovers_the_same_voice_without_partial_audio(self):
        import narration_engine,offline_tts
        cache={};relayed=[]
        async def broken(text,voice,rate='-5%'):
            yield b'partial'*100
            raise ConnectionError('direct provider unavailable')
        async def relay(text,voice,rate,url,priority=0):
            relayed.append((text,voice,rate,url));yield b'complete'*128
        with patch.object(offline_tts,'vieneu_stream',broken),patch.object(narration_engine,'relay_stream',relay),patch.object(narration_engine,'ORGANIZED',True):
            engine=NarrationEngine(cache.get,cache.__setitem__,config=AudioConfig(retries=1,relay_url='https://example.invalid'),log_path=None)
            job=engine.create('local relay probe','vieneu-thien-tam-duc','-20%','relay-probe')
            engine.attach(job);self.wait_done(job)
            self.assertFalse(job.error);self.assertEqual(b''.join(job.chunks),b'complete'*128)
            self.assertEqual(relayed,[('local relay probe','vieneu-thien-tam-duc','-20%','https://example.invalid')])
            self.assertEqual(engine.stats()['counters']['clip-relay'],1);engine.detach(job)

    def test_exported_server_never_relays_to_itself(self):
        import narration_engine,offline_tts
        async def broken(text,voice,rate='-5%'):
            raise ConnectionError('provider failure')
            yield b''
        with patch.object(offline_tts,'vieneu_stream',broken),patch.object(narration_engine,'relay_stream',side_effect=AssertionError('recursive relay')),patch.object(narration_engine,'ORGANIZED',False):
            cache={};engine=NarrationEngine(cache.get,cache.__setitem__,config=AudioConfig(retries=1,backoff_ms=(1,),relay_url='https://example.invalid'),log_path=None)
            job=engine.create('exported probe','vieneu-thien-tam-duc','-5%','no-recursion');engine.attach(job);self.wait_done(job)
            self.assertEqual(job.error,'ConnectionError');engine.detach(job)


if __name__=='__main__':unittest.main()

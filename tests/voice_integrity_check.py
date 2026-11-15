"""Keep the selected Vietnamese voice through retries, cache reuse and partial failures."""
import asyncio,hashlib,sys,time,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'app'),str(ROOT/'local/runtime/python')]
from audio_config import AudioConfig
from narration_engine import NarrationEngine,speech_text,transport_parts

PRIMARY='vieneu-thien-tam-duc';OTHER='vieneu-thuc-doan'

class VoiceIntegrityTests(unittest.TestCase):
    def run_job(self,engine,text='A locally authored complete sentence.',digest='test'):
        job=engine.create(text,PRIMARY,'-5%',digest);engine.attach(job)
        until=time.monotonic()+2
        while not job.done and time.monotonic()<until:time.sleep(.005)
        self.assertTrue(job.done);engine.detach(job);return job

    def engine(self,provider,**kwargs):
        cache=kwargs.pop('cache',{})
        engine=NarrationEngine(cache.get,cache.__setitem__,provider,
            config=kwargs.pop('config',AudioConfig(retries=1,backoff_ms=(1,))),log_path=None,**kwargs)
        return engine,cache

    def test_partial_outage_retries_the_same_voice_and_keeps_all_words(self):
        calls=[]
        async def provider(text,voice,rate):
            calls.append((text,voice,rate))
            if sum(t==text for t,v,r in calls)==1:
                yield b'bad'*100;raise ConnectionError('primary outage')
            yield text.encode()*256
        engine,cache=self.engine(provider)
        text=' '.join(f'Local case {i}: this sentence has separate words.' for i in range(12))
        job=self.run_job(engine,text)
        self.assertFalse(job.error);self.assertEqual(job.actual_voices,[PRIMARY])
        self.assertEqual(' '.join(t for t in dict.fromkeys(t for t,v,r in calls)),text)
        self.assertTrue(all(v==PRIMARY for t,v,r in calls))
        self.assertNotIn(b'bad',b''.join(job.chunks));self.assertEqual(job.active_voice,PRIMARY)

    def test_healthy_primary_never_switches(self):
        calls=[]
        async def provider(text,voice,rate):calls.append(voice);yield b'x'*1024
        engine,_=self.engine(provider);job=self.run_job(engine)
        self.assertFalse(job.error);self.assertEqual(calls,[PRIMARY]);self.assertEqual(job.actual_voices,[PRIMARY])

    def test_slow_variant_retains_its_voice_and_rate_on_retry(self):
        calls=[]
        async def provider(text,voice,rate):
            calls.append((voice,rate))
            if len(calls)==1:raise ConnectionError('outage')
            yield b'x'*1024
        engine,_=self.engine(provider)
        job=engine.create('A slow local sample.',PRIMARY,'-20%','slow-variant');engine.attach(job)
        until=time.monotonic()+2
        while not job.done and time.monotonic()<until:time.sleep(.005)
        self.assertTrue(job.done);self.assertFalse(job.error)
        self.assertEqual(calls,[(PRIMARY,'-20%'),(PRIMARY,'-20%')]);engine.detach(job)

    def test_unavailable_voice_never_silently_changes_gender(self):
        calls=[]
        async def provider(text,voice,rate):
            calls.append(voice)
            raise ConnectionError('outage');yield b'x'*1024
        engine,_=self.engine(provider)
        self.assertTrue(self.run_job(engine,digest='first').error)
        self.assertTrue(self.run_job(engine,'A different local sentence.',digest='second').error)
        self.assertEqual(calls,[PRIMARY]*4)

    def test_mid_paragraph_failure_never_repeats_an_already_completed_clip(self):
        text=' '.join(f'Unique item {i} contains meaningful words for testing.' for i in range(8))
        parts=transport_parts(text);calls=[]
        async def provider(part,voice,rate):
            calls.append((part,voice))
            if part!=parts[0] and sum(p==part for p,v in calls)==1:raise ConnectionError('midstream outage')
            yield part.encode()*256
        engine,_=self.engine(provider);job=self.run_job(engine,text)
        self.assertFalse(job.error);self.assertEqual(job.actual_voices,[PRIMARY])
        self.assertEqual(sum(part==parts[0] for part,voice in calls),1)
        self.assertEqual(len(job.chunks),len(parts))

    def test_metadata_survives_restart_and_cannot_mislabel_the_recording(self):
        cache={};metadata={}
        async def provider(text,voice,rate):
            yield b'x'*1024
        first,_=self.engine(provider,cache=cache,read_metadata=metadata.get,write_metadata=metadata.__setitem__)
        self.assertEqual(self.run_job(first).actual_voices,[PRIMARY])
        async def forbidden(*args):raise AssertionError('cached complete audio was regenerated');yield
        restarted,_=self.engine(forbidden,cache=cache,read_metadata=metadata.get,write_metadata=metadata.__setitem__)
        job=self.run_job(restarted)
        self.assertTrue(job.cached);self.assertEqual(job.actual_voices,[PRIMARY]);self.assertEqual(job.active_voice,PRIMARY)

    def test_missing_tampered_or_different_voice_metadata_is_rejected(self):
        for bad in (None,{'voices':[PRIMARY],'sha256':'wrong'},{'voices':[[]],'sha256':hashlib.sha256(b'x'*1024).hexdigest()},{'voices':[OTHER],'sha256':hashlib.sha256(b'x'*1024).hexdigest()}):
            calls=[]
            async def provider(text,voice,rate):calls.append(voice);yield b'y'*1024
            engine,_=self.engine(provider,cache={'test':b'x'*1024},read_metadata=lambda digest:bad)
            job=self.run_job(engine)
            self.assertFalse(job.cached);self.assertEqual(calls,[PRIMARY]);self.assertEqual(job.actual_voices,[PRIMARY])

    def test_permission_failures_never_switch_voice(self):
        for error in (ConnectionError,PermissionError):
            calls=[]
            async def provider(text,voice,rate):calls.append(voice);raise error('failure');yield
            engine,_=self.engine(provider,config=AudioConfig(retries=0,backoff_ms=(1,)))
            self.assertTrue(self.run_job(engine).error);self.assertEqual(calls,[PRIMARY])

    def test_repeated_failure_remains_bounded_and_never_caches_partial_audio(self):
        calls=[]
        async def provider(text,voice,rate):calls.append(voice);yield b'x'*512;raise ConnectionError('outage')
        engine,cache=self.engine(provider);job=self.run_job(engine)
        self.assertTrue(job.error);self.assertEqual(calls,[PRIMARY,PRIMARY]);self.assertFalse(cache)

    def test_pdf_unicode_is_normalized_without_changing_manuscripts(self):
        text='HÒA THƢỢNG Giới Ðức. Hành tƣớng. Phần iii\u200b'
        self.assertEqual(speech_text(text),'HÒA THƯỢNG Giới Đức. Hành tướng. Phần 3.')
        self.assertIn('Ƣ',text)
        self.assertEqual(speech_text('Nguyễn\x00 An,'),'Nguyễn An.')

if __name__=='__main__':unittest.main()

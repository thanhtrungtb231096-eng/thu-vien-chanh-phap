"""Isolated API checks: migration, token revocation, conflicts and quotas."""
from pathlib import Path
import sys,unittest,tempfile,json,io,time,sqlite3
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'app'))
import library_services as services
from contextlib import closing

class Request:
    def __init__(self,path,data,token=None,peer='203.0.113.10'):
        raw=json.dumps(data).encode();self.path='/api/sync/'+path;self.rfile=io.BytesIO(raw)
        self.headers={'Content-Length':str(len(raw)),**({'Authorization':'Bearer '+token} if token else {})};self.client_address=(peer,1000)
    def response(self,status,value):self.status=status;self.value=value

class Lifecycle(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(dir=ROOT/'tests/artifacts/ux-upgrade-20261010');self.prior=services.STATE;services.STATE=Path(self.temp.name)
        services.ATTEMPTS.clear();services.CREATIONS.clear()
    def tearDown(self):services.STATE=self.prior;self.temp.cleanup()
    def call(self,path,data={},token=None,expected=200):
        request=Request(path,data,token);services.services_post(request);self.assertEqual(request.status,expected,request.value);return request.value
    def devices(self):
        a=self.call('create',{'name':'Máy tính'});code=self.call('code',token=a['token'])['code'];b=self.call('pair',{'code':code,'name':'Điện thoại'});return a,b
    def test_device_lifecycle_and_profile_isolation(self):
        a,b=self.devices();outsider=self.call('create')
        self.assertEqual(len(self.call('devices',token=a['token'])['devices']),2)
        self.call('revoke',{'deviceId':outsider['deviceId']},a['token'],400)
        self.call('revoke',{'deviceId':a['deviceId']},b['token'])
        self.call('devices',token=a['token'],expected=401)
        self.call('delete',{'confirm':'DELETE'},b['token'])
        self.call('devices',token=b['token'],expected=401)
        self.assertEqual(len(self.call('devices',token=outsider['token'])['devices']),1)
    def test_legacy_owner_is_revocable_and_stays_revoked(self):
        token='a'*64
        with closing(sqlite3.connect(services.STATE/'personal.sqlite3')) as db,db:
            db.execute('CREATE TABLE profiles(id TEXT PRIMARY KEY,token_hash TEXT UNIQUE)');db.execute('INSERT INTO profiles VALUES(?,?)',('legacy',services.digest(token)))
        devices=self.call('devices',token=token)['devices'];self.assertEqual(len(devices),1)
        self.call('revoke',{'deviceId':devices[0]['id']},token)
        self.call('devices',token=token,expected=401)
    def test_note_conflict_keeps_losing_version_and_deletions(self):
        a,b=self.devices();stamp=int(time.time()*1000)
        def record(text,s,device,deleted=False):return {'key':'cp3:marks:book','id':'note-1','value':{'item':{'id':'note-1','note':text},'rank':0},'stamp':s,'device':device,'deleted':deleted}
        self.call('exchange',{'records':[record('Bản A',stamp,'a')]},a['token'])
        result=self.call('exchange',{'records':[record('Bản B',stamp+1,'b')]},b['token'])
        self.assertEqual(result['conflictsCount'],1)
        self.assertEqual(self.call('conflicts',token=a['token'])['conflicts'][0]['value']['item']['note'],'Bản A')
        result=self.call('exchange',{'records':[record('Bản B',stamp+2,'b',True)]},b['token']);self.assertTrue(result['records'][0]['deleted'])
    def test_creation_limit_and_pair_code_one_use(self):
        a,b=self.devices();code=self.call('code',token=b['token'])['code'];self.call('pair',{'code':code});self.call('pair',{'code':code},expected=400)
        for _ in range(9):self.call('create')
        self.call('create',expected=429)
    def test_profile_quota_rolls_back_and_proxy_peer_is_validated(self):
        a=self.call('create');stamp=int(time.time()*1000)
        records=[{'key':'cp3:note:'+str(i),'id':'@value','value':'x'*400000,'stamp':stamp,'device':'a'} for i in range(26)]
        for i in range(0,24,4):self.call('exchange',{'records':records[i:i+4]},a['token'])
        self.call('exchange',{'records':records[24:]},a['token'],400)
        self.assertEqual(len(self.call('exchange',{'records':[]},a['token'])['records']),24)
        request=Request('create',{},peer='127.0.0.1');request.headers['X-Forwarded-For']='spoof, 203.0.113.44';self.assertEqual(services.sync_peer(request),'203.0.113.44')
        request.client_address=('198.51.100.1',1);self.assertEqual(services.sync_peer(request),'198.51.100.1')

if __name__=='__main__':unittest.main()

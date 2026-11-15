"""Real status endpoint checks for the local opener, including version migration."""
from pathlib import Path
import sys,json,threading,unittest
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'app'))
import launch
import library_services
manifest=json.loads((ROOT/'data/generated/library-version.json').read_text(encoding='utf-8'))
payload={'version':manifest['version'],'indexReady':True}

class Status(BaseHTTPRequestHandler):
    def log_message(self,*args):pass
    def do_GET(self):
        value=json.dumps(payload).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(value)));self.end_headers();self.wfile.write(value)

class Opener(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.http=ThreadingHTTPServer(('127.0.0.1',0),Status);cls.prior=launch.ADDRESS;launch.ADDRESS=f'http://127.0.0.1:{cls.http.server_port}'
        threading.Thread(target=cls.http.serve_forever,daemon=True).start()
    @classmethod
    def tearDownClass(cls):cls.http.shutdown();cls.http.server_close();launch.ADDRESS=cls.prior
    def setUp(self):payload.clear();payload.update(version=manifest['version'],indexReady=True)
    def test_current_string_version_reuses_server_without_spawn(self):
        with patch.object(launch.subprocess,'Popen',side_effect=AssertionError('Must not spawn a second server')):
            self.assertTrue(launch.ready());self.assertEqual(launch.launch(False),launch.ADDRESS+'/')
    def test_old_numeric_version_restarts_owned_server(self):
        payload['version']=10
        def replacement():payload['version']=manifest['version']
        with patch.object(launch,'stop_stale_server',side_effect=replacement) as restart, patch.object(launch.subprocess,'Popen',side_effect=AssertionError('Replacement is already ready')):
            self.assertEqual(launch.launch(False),launch.ADDRESS+'/');restart.assert_called_once()
    def test_unowned_server_is_not_stopped_or_opened(self):
        payload['version']=10
        with patch.object(launch,'stop_stale_server',side_effect=RuntimeError('Cổng 8090 đang được chương trình khác sử dụng')), patch.object(launch.webbrowser,'open') as opener:
            with self.assertRaisesRegex(RuntimeError,'chương trình khác'):launch.launch(True)
            opener.assert_not_called()
    def test_unready_index_does_not_open_or_spawn(self):
        payload['indexReady']=False
        with patch.object(launch.subprocess,'Popen',side_effect=AssertionError('Must not spawn into occupied port')):
            with self.assertRaisesRegex(RuntimeError,'chỉ mục chưa sẵn sàng'):launch.launch(False)
    def test_running_server_identity_does_not_follow_changed_files(self):
        class Request:
            path='/api/library/status'
            def response(self,status,value):self.value=value
        request=Request()
        with patch.object(library_services,'GENERATED',ROOT/'tests/artifacts/nonexistent-manifest'):
            library_services.services_get(request)
        self.assertEqual(request.value['version'],manifest['version'])

if __name__=='__main__':unittest.main()

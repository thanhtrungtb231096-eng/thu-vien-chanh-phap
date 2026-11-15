"""A restored UI must replace browser assets cached with newer timestamps."""

from pathlib import Path
import http.client
import sys
import threading
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'app'))
import server


class QuietHandler(server.Handler):
    def log_message(self, *args):
        pass


class RestoreCacheCheck(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = server.LibraryHTTPServer(('127.0.0.1', 0), QuietHandler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join()

    def request(self, path, method='GET', headers=None):
        connection = http.client.HTTPConnection(*self.httpd.server_address, timeout=5)
        try:
            connection.request(method, path, headers=headers or {})
            response = connection.getresponse()
            return response.status, dict(response.getheaders()), response.read()
        finally:
            connection.close()

    def test_cached_newer_ui_is_replaced_after_restore(self):
        assets = ['index.html', 'css/main.css?v=5', 'js/app.js?v=old-ui',
                  'sw.js', 'manifest.webmanifest']
        validators = [{'If-Modified-Since': 'Tue, 01 Jan 2030 00:00:00 GMT'},
                      {'If-Modified-Since': 'Tue, 01 Jan 2030 00:00:00 GMT',
                       'If-None-Match': '"previous-ui"'}]
        for asset in assets:
            for method in ('GET', 'HEAD'):
                for validator in validators:
                    with self.subTest(asset=asset, method=method, headers=validator):
                        status, headers, body = self.request('/web-thuvien/' + asset, method, validator)
                        expected = (server.WEB / asset.split('?')[0]).read_bytes()
                        self.assertEqual(status, 200)
                        self.assertEqual(headers.get('Cache-Control'), 'no-store')
                        self.assertEqual(int(headers['Content-Length']), len(expected))
                        self.assertEqual(body, expected if method == 'GET' else b'')
                        if asset == 'sw.js':
                            self.assertEqual(headers.get('Service-Worker-Allowed'), '/')

    def test_non_shell_files_keep_conditional_requests(self):
        status, _, _ = self.request('/web-thuvien/fonts/font-0-vietnamese.woff2',
                                   headers={'If-Modified-Since': 'Tue, 01 Jan 2030 00:00:00 GMT'})
        self.assertEqual(status, 304)

    def test_removed_stylesheet_stays_missing(self):
        status, _, _ = self.request('/web-thuvien/css/tang-kinh.css?v=3')
        self.assertEqual(status, 404)

    def test_private_files_remain_blocked(self):
        for path in ['/app/server.py', '/web-thuvien/server.py', '/storage/state/personal.sqlite3']:
            with self.subTest(path=path):
                status, _, _ = self.request(path)
                self.assertEqual(status, 404)


if __name__ == '__main__':
    unittest.main(verbosity=2)

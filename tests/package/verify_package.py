"""Check the exported archive and serve an isolated subset without relying on workspace sources."""

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

from contextlib import closing
import hashlib
import json
from pathlib import Path
import re
import socket
import sqlite3
import subprocess
import sys
import tempfile
import time
import unicodedata
from urllib.error import HTTPError
from urllib.parse import quote, urlencode, unquote
from urllib.request import urlopen

OUT = DIST
MANIFEST = json.loads((OUT / 'package-manifest.json').read_text(encoding='utf-8'))
FILES = {entry['path']: entry for entry in MANIFEST['files']}
ARCHIVE = OUT / 'thuvien.7z'
SEVENZIP = 'C:/Program Files/7-Zip/7z.exe'


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 ** 2), b''):
            value.update(chunk)
    return value.hexdigest()


def main():
    assert digest(ARCHIVE) == MANIFEST['archiveSha256']
    checksum = (OUT / 'thuvien.7z.sha256').read_bytes()
    assert b'\r' not in checksum, 'The Linux checksum file must use LF line endings'
    assert checksum.decode('ascii').split() == [MANIFEST['archiveSha256'], 'thuvien.7z']
    assert {'web-thuvien/audio_config.py','web-thuvien/audio.txt'} <= set(FILES)
    assert not any(path.startswith(('.runtime/', '.runtime-cache/', '.audio-cache/', 'web-thuvien/tests/')) for path in FILES)
    assert '.library-state/personal.sqlite3' not in FILES
    assert not any(path.endswith(('.pyc', '.exe')) for path in FILES)
    chosen = {path for path in FILES if path.startswith(('web-thuvien/js/', 'web-thuvien/css/', 'web-thuvien/fonts/', 'web-thuvien/design/'))
              or (path.startswith('web-thuvien/') and path.count('/') == 1)
              or path in {'web-thuvien/data/offline-assets.json', 'web-thuvien/data/library-audit.json', '.library-state/search.sqlite3'}}
    examples = {}
    with closing(sqlite3.connect((STATE / 'search.sqlite3').as_uri() + '?mode=ro', uri=True)) as db:
        for kind in ('daithua', 'daitang', 'phucminh', 'ebooks'):
            meta, passage = db.execute("SELECT d.meta,p.text FROM documents d JOIN passages p ON d.doc=p.doc WHERE d.book_key LIKE ? AND d.mode='viet' AND length(p.text)>80 ORDER BY p.pid LIMIT 1", (kind + ':%',)).fetchone()
            meta = json.loads(meta)
            rel = public_relative(public_path(meta['source']))
            chosen.add(rel)
            normalized = ''.join(char for char in unicodedata.normalize('NFD', passage.lower().replace('đ', 'd')) if not unicodedata.combining(char))
            query = '"' + ' '.join(re.findall(r'[^\W_]+', normalized)[:3]) + '"'
            examples[kind] = {'key': meta['key'], 'source': rel, 'query': query}
    ebooks_source = next(path for path in FILES if path.startswith('EbooksProject/') and path.endswith('.doc'))
    pdf_source = next(path for path in FILES if path.startswith('chua phuc minh/') and path.endswith('.pdf'))
    chosen.update({ebooks_source, pdf_source})
    outcome = {'archiveSha256': MANIFEST['archiveSha256'], 'manifestFiles': len(FILES), 'extractedFiles': len(chosen), 'collections': {}, 'checks': []}
    with tempfile.TemporaryDirectory(prefix='.verify-', dir=OUT) as temporary:
        staging = Path(temporary).resolve()
        assert staging.is_relative_to(OUT.resolve()) and staging != OUT.resolve()
        listing = staging / 'extract.txt'
        listing.write_text('\n'.join(sorted(chosen)) + '\n', encoding='utf-8')
        print('Extracting an isolated server, search index and sample sources...', flush=True)
        subprocess.run([SEVENZIP, 'x', str(ARCHIVE), '-o' + str(staging), '-i@' + str(listing), '-scsUTF-8', '-sccUTF-8', '-spd', '-y', '-bsp0', '-bso0'], check=True)
        for path in chosen:
            assert digest(staging / path) == FILES[path]['sha256'], path
        outcome['checks'].append('SHA-256 matches for all extracted files, including the search index')
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', 0))
            port = sock.getsockname()[1]
        base = f'http://127.0.0.1:{port}'
        log = (staging / 'server.log').open('w', encoding='utf-8')
        process = subprocess.Popen([sys.executable, '-X', 'utf8', str(staging / 'web-thuvien/server.py'), '--host', '127.0.0.1', '--port', str(port)], cwd=staging, stdout=log, stderr=subprocess.STDOUT)
        try:
            for attempt in range(100):
                if process.poll() is not None:
                    raise RuntimeError((staging / 'server.log').read_text(encoding='utf-8'))
                try:
                    with urlopen(base + '/api/library/status', timeout=2) as response:
                        assert json.load(response)['indexReady']
                    break
                except OSError:
                    time.sleep(0.1)
            else:
                raise RuntimeError('Isolated server did not start')
            with urlopen(base + '/web-thuvien/index.html', timeout=10) as response:
                assert response.status == 200 and b'<html' in response.read().lower()
            with urlopen(base + '/api/voices', timeout=5) as response:
                assert json.load(response)['audioVersion']==11
            with urlopen(base + '/api/narration/stats', timeout=5) as response:
                stats=json.load(response)
                assert stats['workers']==3 and stats['config']['prefetchDepth']==3
            for kind, example in examples.items():
                params = {'q': example['query'], 'collection': kind, 'mode': 'viet'}
                with urlopen(base + '/api/search?' + urlencode(params), timeout=60) as response:
                    result = json.load(response)
                    assert result['total'] > 0 and result['results']
                    assert all(entry['type'] == kind for entry in result['results'])
                    outcome['collections'][kind] = {'searchTotal': result['total'], 'source': example['source']}
                with urlopen(base + '/api/edition?' + urlencode({'key': example['key'], 'mode': 'viet'}), timeout=10) as response:
                    assert json.load(response)['key'] == example['key']
            for path in [example['source'] for example in examples.values()] + [ebooks_source, pdf_source]:
                with urlopen(base + '/' + quote(path, safe='/'), timeout=20) as response:
                    assert hashlib.sha256(response.read()).hexdigest() == FILES[path]['sha256']
            for path in ('/.library-state/search.sqlite3', '/web-thuvien/server.py', '/web-thuvien/audio.txt'):
                try:
                    urlopen(base + path, timeout=10)
                    raise AssertionError('Private file was served: ' + path)
                except HTTPError as error:
                    assert error.code == 404
            assert not (staging / '.library-state/personal.sqlite3').exists()
            outcome['checks'] += ['Server starts without workspace runtime/source folders', 'Audio version 5, config and narration stats work in the exported layout', 'Home page, edition and search APIs work for all four collections', 'Sample texts, original Word and PDF downloads match their hashes', 'Private index/Python/config files return 404', 'Personal database is absent from the update package']
        finally:
            process.terminate()
            process.wait(timeout=15)
            log.close()
    outcome['result'] = 'passed'
    (REPORTS / 'dung-luong/verification.json').write_text(json.dumps(outcome, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(outcome, ensure_ascii=False, indent=2), flush=True)


if __name__ == '__main__':
    main()

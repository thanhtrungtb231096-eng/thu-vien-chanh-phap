"""Download Vietnamese + Latin font subsets for reproducible local typography."""

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

from pathlib import Path
import re
import urllib.request
BASE = WEB
DEST = BASE / 'fonts'
DEST.mkdir(exist_ok=True)
url = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,600;1,400&display=swap'
request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'})
css = urllib.request.urlopen(request, timeout=20).read().decode()
chunks = re.findall(r'/\* (vietnamese|latin) \*/\s*(@font-face\s*\{[^}]+\})', css)
rules = []
for index, (subset, rule) in enumerate(chunks):
    font_url = re.search(r'url\((https://[^)]+)\)', rule).group(1)
    filename = 'font-' + str(index) + '-' + subset + '.woff2'
    (DEST / filename).write_bytes(urllib.request.urlopen(font_url, timeout=20).read())
    rules.append(rule.replace(font_url, '../fonts/' + filename))
if not rules:
    print(css[:1800])
    raise RuntimeError('No local font subset found')
(BASE / 'css/fonts.css').write_text('/* Google Fonts: Be Vietnam Pro and Noto Serif, SIL Open Font License. */\n' + '\n'.join(rules), encoding='utf-8')
for family, repo in [('be-vietnam-pro','https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/OFL.txt'),('noto-serif','https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif/OFL.txt')]:
    (DEST / (family + '-OFL.txt')).write_bytes(urllib.request.urlopen(repo, timeout=20).read())
print('Downloaded',len(rules),'font subsets.')
han_css = urllib.request.urlopen('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400&display=swap', timeout=20).read().decode()
han_url = re.search(r'url\((https://[^)]+)\)', han_css).group(1)
han_suffix = '.woff2' if '.woff2' in han_url else '.ttf'
han_name = 'noto-serif-tc' + han_suffix
(DEST / han_name).write_bytes(urllib.request.urlopen(han_url, timeout=60).read())
with (BASE / 'css/fonts.css').open('a', encoding='utf-8') as f:
    f.write('\n' + han_css.replace(han_url, '../fonts/' + han_name))
(DEST / 'noto-serif-tc-OFL.txt').write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/notoseriftc/OFL.txt', timeout=20).read())
print('Downloaded Noto Serif TC:', (DEST / han_name).stat().st_size, 'bytes.')

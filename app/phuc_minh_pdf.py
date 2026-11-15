"""Bounded, on-demand PDF page previews for the collection reader."""

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

import json
import threading
from pathlib import Path

RENDER_LIMIT = threading.BoundedSemaphore(2)


def render_page(book_id, number):
    catalog = json.loads((GENERATED / 'phuc-minh/catalog.json').read_text(encoding='utf-8'))
    book = next((b for b in catalog['books'] if b['id'] == book_id), None)
    if not book or not 1 <= number <= book['pages']:
        raise ValueError('Tài liệu hoặc số trang không hợp lệ.')
    base = (SOURCES['chua phuc minh']).resolve()
    source = (base / book['filename']).resolve()
    if not source.is_relative_to(base) or source.suffix.lower() != '.pdf':
        raise ValueError('Tài liệu không hợp lệ.')
    import pymupdf
    with RENDER_LIMIT, pymupdf.open(source) as doc:
        page = doc[number - 1]
        # Bound memory even for print/poster editions with very large page dimensions.
        scale = min(2, 1800 / max(page.rect.width, page.rect.height))
        return page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False).tobytes('png')

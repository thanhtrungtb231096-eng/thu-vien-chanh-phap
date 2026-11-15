"""Transactionally update just EbooksProject using the reader's exact block IDs."""

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
import json
import sqlite3
import subprocess
from build_library_index import STATE, WEB, catalog, normalize, publish


def remove_document(db, doc):
    for pid, text in db.execute('SELECT pid,text FROM passages WHERE doc=?', (doc,)):
        db.execute("INSERT INTO fulltext(fulltext,rowid,normalized) VALUES('delete',?,?)", (pid, normalize(text)))
    db.execute('DELETE FROM passages WHERE doc=?', (doc,))
    db.execute('DELETE FROM documents WHERE doc=?', (doc,))


def build():
    target = STATE / 'search.sqlite3'
    if not target.is_file():
        from build_library_index import build as full_build
        full_build(); return
    entries = list(catalog('ebooks'))
    manifest = STATE / 'ebooks-index-input.ndjson'
    manifest.write_text('\n'.join(json.dumps(x, ensure_ascii=False) for x in entries), encoding='utf-8')
    keys = {(entry['key'], entry['mode']) for entry in entries}
    with closing(sqlite3.connect(target, timeout=60)) as db:
        db.execute('BEGIN IMMEDIATE')
        try:
            old = {(key, mode): (doc, json.loads(meta)) for doc, key, mode, meta in
                   db.execute("SELECT doc,book_key,mode,meta FROM documents WHERE book_key LIKE 'ebooks:%'")}
            for key, (doc, meta) in old.items():
                if key not in keys: remove_document(db, doc)
            needed = [entry for entry in entries if (entry['key'], entry['mode']) not in old or
                      old[(entry['key'], entry['mode'])][1].get('sha256') != entry['sha256'] or
                      old[(entry['key'], entry['mode'])][1].get('sourceFlags') != entry['sourceFlags']]
            manifest.write_text('\n'.join(json.dumps(x, ensure_ascii=False) for x in needed), encoding='utf-8')
            with manifest.open('r', encoding='utf-8') as source:
                process = subprocess.Popen(['node', str(BUILD / 'index_documents.cjs')], stdin=source,
                                           stdout=subprocess.PIPE, text=True, encoding='utf-8')
                try:
                    for number, line in enumerate(process.stdout, 1):
                        entry = json.loads(line)
                        blocks = entry.pop('blocks')
                        prior = old.get((entry['key'], entry['mode']))
                        if prior: remove_document(db, prior[0])
                        headings = [{'block': b['id'], **b['heading']} for b in blocks if b.get('heading')]
                        flags = list(entry['sourceFlags'])
                        if entry['replacementCharacters']: flags.append('replacement-characters')
                        if entry['suspiciousGlyphs']: flags.append('private-use-glyphs')
                        if not headings: flags.append('no-structural-headings')
                        entry.update({'headings': headings, 'flags': sorted(set(flags)), 'audit': 'automatic', 'proofread': False})
                        doc = db.execute('INSERT INTO documents(book_key,mode,meta) VALUES(?,?,?)',
                                         (entry['key'], entry['mode'], json.dumps(entry, ensure_ascii=False))).lastrowid
                        chapter = ''
                        for block in blocks:
                            if block.get('heading'): chapter = block['heading']['title']
                            for start in range(0, len(block['text']), 1300):
                                text = block['text'][start:start + 1450]
                                pid = db.execute('INSERT INTO passages(doc,block,chapter,page,text) VALUES(?,?,?,?,?)',
                                                 (doc, block['id'], chapter, None, text)).lastrowid
                                db.execute('INSERT INTO fulltext(rowid,normalized) VALUES(?,?)', (pid, normalize(text)))
                        if number % 100 == 0: print(f'Indexed {number}/{len(needed)} Đại Tạng Kinh editions', flush=True)
                    if process.wait(): raise RuntimeError('Reader parser failed; index transaction rolled back')
                finally:
                    if process.poll() is None: process.terminate(); process.wait()
            db.commit()
        except Exception:
            db.rollback(); raise
    manifest.unlink(missing_ok=True)
    publish(target)
    print(f'Dai Tang Kinh search ready: {len(entries)} readable editions.')


if __name__ == '__main__': build()

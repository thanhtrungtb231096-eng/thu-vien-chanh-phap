"""Create an immutable source checkpoint; never modify original book sources."""
from pathlib import Path
import argparse
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parents[2]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True, help='New checkpoint directory outside the project')
    args = parser.parse_args()
    DEST = args.out.resolve()
    if DEST.is_relative_to(ROOT.resolve()):
        parser.error('Store checkpoints outside the project directory.')
    if (DEST / 'manifest.json').exists():
        print('Checkpoint already exists:', DEST)
        return
    files = []
    for folder in ('app', 'tools/build', 'config', 'docs/guides'):
        files += [p for p in (ROOT / folder).rglob('*') if p.is_file() and p.suffix in
                  ('.js', '.css', '.html', '.py', '.json', '.md', '.txt', '.webmanifest')]
    files += [ROOT / 'data/generated/library-audit.json', ROOT / 'data/generated/offline-assets.json']
    manifest = []
    for path in files:
        relative = path.relative_to(ROOT)
        target = DEST / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, target)
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if hashlib.sha256(target.read_bytes()).hexdigest() != digest:
            raise RuntimeError(f'Checkpoint mismatch: {relative}')
        manifest.append({'path':relative.as_posix(), 'bytes':path.stat().st_size, 'sha256':digest})
    (DEST / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Checkpoint verified: {len(manifest)} files, {sum(x["bytes"] for x in manifest)} bytes')

if __name__ == '__main__':
    main()

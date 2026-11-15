"""Synchronize Chapter-Sprite audio packs to the public VPS and/or Cloudflare R2 CDN."""
from pathlib import Path
import argparse
import hashlib
import io
import json
import os
import shutil
import subprocess
import sys
import tarfile
import tempfile

BOOTSTRAP = next(
    candidate
    for ancestor in Path(__file__).resolve().parents
    for candidate in (ancestor / 'app', ancestor / 'web-thuvien')
    if (candidate / 'project_paths.py').is_file()
)
sys.path.insert(0, str(BOOTSTRAP))
from project_paths import AUDIO_PACKS


def local_inventory(root: Path) -> dict[str, dict]:
    items = {}
    if not root.is_dir():
        return items
    for path in sorted(root.rglob('*')):
        if not path.is_file() or path.name.endswith(('.tmp', '.tmp.mp3', '.tmp.json')):
            continue
        rel = path.relative_to(root).as_posix()
        data = path.read_bytes()
        items[rel] = {
            'bytes': len(data),
            'sha256': hashlib.sha256(data).hexdigest(),
        }
    return items


def sync_to_vps(local_root: Path, host: str, user: str, ssh_key: Path, remote_dir: str = '/opt/thuvien/.audio-packs') -> dict:
    inventory = local_inventory(local_root)
    if not inventory:
        return {'status': 'empty', 'uploadedFiles': 0, 'uploadedBytes': 0}

    ssh_base = ['ssh', '-4', '-i', str(ssh_key), '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=25', '-o', 'StrictHostKeyChecking=accept-new', f'{user}@{host}']
    probe_script = (
        "python3 -c 'import hashlib,json,pathlib;p=pathlib.Path(" + json.dumps(remote_dir) + ");"
        "out={f.relative_to(p).as_posix():hashlib.sha256(f.read_bytes()).hexdigest() for f in p.rglob(\"*\") if f.is_file()} if p.is_dir() else {};"
        "print(json.dumps(out))'"
    )
    remote_out = subprocess.check_output([*ssh_base[:1], '-n', *ssh_base[1:], probe_script], stdin=subprocess.DEVNULL, text=True, timeout=60)
    remote_hashes = json.loads(remote_out.strip() or '{}')

    to_upload = [
        rel for rel, info in inventory.items()
        if remote_hashes.get(rel) != info['sha256'] or rel.endswith('manifest.json')
    ]
    if not to_upload:
        return {'status': 'up_to_date', 'totalFiles': len(inventory), 'uploadedFiles': 0, 'uploadedBytes': 0}

    # Stream changed files in a single compressed tar stream over SSH and set ownership to thuvien:thuvien.
    buf = io.BytesIO()
    uploaded_bytes = 0
    with tarfile.open(fileobj=buf, mode='w:gz') as tar:
        for rel in to_upload:
            src = local_root / rel
            raw = src.read_bytes()
            uploaded_bytes += len(raw)
            ti = tarfile.TarInfo(name=rel)
            ti.size = len(raw)
            ti.mode = 0o644
            tar.addfile(ti, io.BytesIO(raw))
    payload = buf.getvalue()

    apply_cmd = (
        f"sudo mkdir -p {remote_dir} && "
        f"sudo tar -xzf - -C {remote_dir} && "
        f"sudo chown -R thuvien:thuvien {remote_dir} && "
        f"sudo chmod -R u=rwX,go=rX {remote_dir}"
    )
    subprocess.run([*ssh_base, apply_cmd], input=payload, check=True, timeout=300)
    return {
        'status': 'synced',
        'host': host,
        'remoteDir': remote_dir,
        'totalFiles': len(inventory),
        'uploadedFiles': len(to_upload),
        'uploadedBytes': uploaded_bytes,
    }


def sync_to_r2(local_root: Path, bucket: str, endpoint_url: str, profile: str = '') -> dict:
    aws = shutil.which('aws')
    if not aws:
        raise RuntimeError('AWS CLI (`aws`) is required for Cloudflare R2 S3 sync.')
    if not bucket or not endpoint_url:
        raise ValueError('Provide --r2-bucket and --r2-endpoint (or R2_BUCKET / R2_ENDPOINT_URL env vars).')
    cmd = [
        aws, 's3', 'sync',
        str(local_root),
        f's3://{bucket.strip("/")}',
        '--endpoint-url', endpoint_url.strip(),
        '--exclude', '*.tmp*',
        '--cache-control', 'public, max-age=31536000, immutable',
    ]
    if profile:
        cmd.extend(['--profile', profile])
    subprocess.run(cmd, check=True, timeout=600)
    return {'status': 'synced_r2', 'bucket': bucket, 'endpoint': endpoint_url}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=AUDIO_PACKS, help='Local audio-packs directory')
    parser.add_argument('--vps', action='store_true', help='Sync audio packs to the public VPS over SSH')
    parser.add_argument('--vps-host', default=os.environ.get('THUVIEN_VPS_HOST', '161.118.198.123'))
    parser.add_argument('--vps-user', default=os.environ.get('THUVIEN_VPS_USER', 'ubuntu'))
    parser.add_argument('--ssh-key', type=Path, default=Path.home() / '.ssh/thuvien_vps.key')
    parser.add_argument('--r2', action='store_true', help='Sync audio packs to Cloudflare R2 bucket')
    parser.add_argument('--r2-bucket', default=os.environ.get('R2_BUCKET', ''))
    parser.add_argument('--r2-endpoint', default=os.environ.get('R2_ENDPOINT_URL', ''))
    parser.add_argument('--r2-profile', default=os.environ.get('R2_AWS_PROFILE', ''))
    args = parser.parse_args()

    if not args.vps and not args.r2:
        parser.error('Choose --vps and/or --r2.')

    report = {}
    if args.vps:
        report['vps'] = sync_to_vps(args.source.resolve(), args.vps_host, args.vps_user, args.ssh_key.resolve())
    if args.r2:
        report['r2'] = sync_to_r2(args.source.resolve(), args.r2_bucket, args.r2_endpoint, args.r2_profile)
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()


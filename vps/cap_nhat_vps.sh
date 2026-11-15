#!/usr/bin/env bash
# Update the existing library while preserving its service, HTTPS, runtime and personal state.
set -Eeuo pipefail
UPLOAD="${1:?Pass the absolute upload directory}"
RELEASE="${2:?Pass a release identifier}"
APP=/opt/thuvien
[[ "$RELEASE" =~ ^[a-zA-Z0-9-]+$ ]] || { echo 'Invalid release identifier'; exit 1; }
[[ "$UPLOAD" == "/home/ubuntu/$RELEASE" ]] || { echo 'Unexpected upload directory'; exit 1; }
[[ "$(id -u)" -eq 0 ]] || { echo 'Run with sudo'; exit 1; }
[[ "$(realpath "$APP")" == "$APP" ]] || { echo 'Unexpected application path'; exit 1; }
INCOMING="/opt/thuvien-updates/$RELEASE"
BACKUP="/opt/thuvien-backups/$RELEASE"
VERIFIER="/opt/thuvien-updates/$RELEASE.verify.py"
MANIFEST="/opt/thuvien-updates/$RELEASE.manifest.json"
PYTHON="$APP/.venv/bin/python"
ITEMS=('web-thuvien' 'Dai_Tang_Kinh_Han' 'Dai_thua' 'chua phuc minh' 'EbooksProject' 'opengraph.png' 'favicon.ico')
OLD_ITEMS=()
NEW_ITEMS=()
OLD_INDEX=()
NEW_INDEX=0
CHANGING=0

rollback() {
    local result="${1:-1}"
    trap - ERR HUP INT TERM
    if [[ "$CHANGING" -eq 1 ]]; then
        echo '[!] Update failed. Restoring the previous version...'
        systemctl stop thuvien || true
        mkdir -p "$BACKUP/failed/.library-state"
        for item in "${NEW_ITEMS[@]}"; do
            [[ ! -e "$APP/$item" ]] || mv -- "$APP/$item" "$BACKUP/failed/$item"
        done
        for item in "${OLD_ITEMS[@]}"; do
            [[ ! -e "$BACKUP/$item" ]] || mv -- "$BACKUP/$item" "$APP/$item"
        done
        if [[ "$NEW_INDEX" -eq 1 && -e "$APP/.library-state/search.sqlite3" ]]; then
            mv -- "$APP/.library-state/search.sqlite3" "$BACKUP/failed/.library-state/search.sqlite3"
        fi
        for item in "${OLD_INDEX[@]}"; do
            [[ ! -e "$BACKUP/.library-state/$item" ]] || mv -- "$BACKUP/.library-state/$item" "$APP/.library-state/$item"
        done
        systemctl start thuvien || true
    fi
    echo "[!] Exit code: $result. Backup: $BACKUP"
    exit "$result"
}
trap 'rollback $?' ERR
trap 'rollback 129' HUP
trap 'rollback 130' INT
trap 'rollback 143' TERM

echo '[1/5] Verify upload and prepare the incoming version...'
[[ ! -e "$INCOMING" && ! -e "$BACKUP" ]]
(cd "$UPLOAD" && sed 's/\r$//' thuvien.7z.sha256 | sha256sum -c -)
[[ -x "$PYTHON" ]]
install -d -m 755 /opt/thuvien-updates
install -d -m 700 /opt/thuvien-backups
mkdir -p "$INCOMING" "$BACKUP/.library-state"
chmod 700 "$BACKUP"
install -m 644 "$UPLOAD/verify_vps.py" "$VERIFIER"
install -m 644 "$UPLOAD/package-manifest.json" "$MANIFEST"
bash -n "$UPLOAD/cap_nhat_vps.sh"
7z x -y -aoa -o"$INCOMING" "$UPLOAD/thuvien.7z" >/dev/null
chown -R thuvien:thuvien "$INCOMING"
uv pip install --python "$PYTHON" -q -r "$INCOMING/web-thuvien/requirements-audio.txt" -r "$INCOMING/web-thuvien/requirements-collections.txt"

echo '[2/5] Test the incoming application while the existing site stays online...'
sudo -u thuvien "$PYTHON" -X utf8 "$VERIFIER" "$INCOMING" "$MANIFEST" > "$BACKUP/preflight.json"
cat "$BACKUP/preflight.json"
cp -a /etc/systemd/system/thuvien.service /etc/caddy/Caddyfile "$BACKUP/"
sha256sum /etc/systemd/system/thuvien.service /etc/caddy/Caddyfile > "$BACKUP/config.sha256"

echo '[3/5] Pause briefly, save personal state and switch the application...'
CHANGING=1
systemctl stop thuvien
PERSONAL="$APP/.library-state/personal.sqlite3"
if [[ -f "$PERSONAL" ]]; then
    sha256sum "$PERSONAL" > "$BACKUP/personal.sha256"
    "$PYTHON" - "$PERSONAL" "$BACKUP/.library-state/personal.snapshot.sqlite3" <<'PY'
import sqlite3,sys
from contextlib import closing
from pathlib import Path
with closing(sqlite3.connect(Path(sys.argv[1]).as_uri()+'?mode=ro',uri=True)) as source, closing(sqlite3.connect(sys.argv[2])) as target:
    source.backup(target)
PY
    chmod 600 "$BACKUP/.library-state/personal.snapshot.sqlite3"
fi
for item in "${ITEMS[@]}"; do
    if [[ -e "$INCOMING/$item" ]]; then
        if [[ -e "$APP/$item" ]]; then
            mv -- "$APP/$item" "$BACKUP/$item"
            OLD_ITEMS+=("$item")
        fi
        mv -- "$INCOMING/$item" "$APP/$item"
        NEW_ITEMS+=("$item")
    fi
done
for item in search.sqlite3 search.sqlite3-wal search.sqlite3-shm search.sqlite3-journal; do
    if [[ -e "$APP/.library-state/$item" ]]; then
        mv -- "$APP/.library-state/$item" "$BACKUP/.library-state/$item"
        OLD_INDEX+=("$item")
    fi
done
mv -- "$INCOMING/.library-state/search.sqlite3" "$APP/.library-state/search.sqlite3"
NEW_INDEX=1
if [[ -f "$BACKUP/personal.sha256" ]]; then
    sha256sum -c "$BACKUP/personal.sha256"
fi
sha256sum -c "$BACKUP/config.sha256"

echo '[4/5] Start and verify the updated service...'
systemctl start thuvien
for attempt in $(seq 1 60); do
    curl -fsS http://127.0.0.1:8090/api/library/status >/dev/null && break
    sleep 1
done
systemctl is-active --quiet thuvien
sudo -u thuvien "$PYTHON" -X utf8 "$VERIFIER" "$APP" "$MANIFEST" --live-port 8090 > "$BACKUP/live.json"
cat "$BACKUP/live.json"

echo '[5/5] Verify public HTTPS and preserved configuration...'
curl -fsS https://thuvienchanhphap.duckdns.org/api/library/status
curl -fsS https://161-118-198-123.sslip.io/api/library/status
sha256sum -c "$BACKUP/config.sha256"
CHANGING=0
trap - ERR HUP INT TERM
echo ''
echo "[OK] Updated. Backup: $BACKUP"
echo '[OK] https://thuvienchanhphap.duckdns.org/web-thuvien/index.html'

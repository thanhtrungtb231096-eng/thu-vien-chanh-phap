#!/usr/bin/env bash
# Cai dat / cap nhat Dai Thu Vien Chanh Phap tren VPS Ubuntu 22.04 / 24.04.
# Dung:  sudo bash cai_dat_vps.sh                 (giu ten mien cu; lan dau dung <ip>.sslip.io)
#        sudo bash cai_dat_vps.sh thuvien.vidu.com (dung ten mien rieng da tro ve IP VPS)
# Chay lai bao nhieu lan cung duoc: du lieu dong bo va bo nho dem giong doc duoc giu nguyen.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ARCHIVE="$HERE/thuvien.7z"
APP=/opt/thuvien
PORT=8090

[ "$(id -u)" -eq 0 ] || { echo "Hay chay bang: sudo bash $0"; exit 1; }
[ -f "$ARCHIVE" ] || { echo "Khong thay $ARCHIVE - hay tai thuvien.7z len cung thu muc voi script."; exit 1; }
if [ -f "$HERE/thuvien.7z.sha256" ]; then
  (cd "$HERE" && sha256sum -c thuvien.7z.sha256) || { echo "Goi tai len bi loi; hay tai lai truoc khi cap nhat."; exit 1; }
fi

DOMAIN="${1:-}"
# Khi cap nhat, giu ten mien dang chay neu khong truyen ten mien moi.
if [ -z "$DOMAIN" ] && [ -f /etc/systemd/system/thuvien.service ]; then
  DOMAIN="$(sed -nE 's/.*--allow-host ([a-zA-Z0-9.-]+).*/\1/p' /etc/systemd/system/thuvien.service | head -n 1)"
fi
if [ -z "$DOMAIN" ]; then
  IP="$(curl -4 -fsS https://api.ipify.org || curl -4 -fsS https://ifconfig.me)"
  DOMAIN="${IP//./-}.sslip.io"
fi
echo "==> Ten mien se dung: $DOMAIN"

echo "[1/7] Cai goi he thong..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y python3 python3-venv p7zip-full curl gnupg debian-keyring debian-archive-keyring apt-transport-https
if ! command -v caddy >/dev/null 2>&1; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y
  apt-get install -y caddy
fi

echo "[2/7] Kiem tra bo nho (them swap neu RAM nho)..."
if [ "$(swapon --show | wc -l)" -eq 0 ] && [ "$(free -m | awk '/Mem:/{print $2}')" -lt 2000 ]; then
  fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "[3/7] Giai nen thu vien vao $APP ..."
# Kiem tra goi truoc khi dung dich vu hien tai.
7z t "$ARCHIVE" >/dev/null
id thuvien >/dev/null 2>&1 || useradd --system --home "$APP" --shell /usr/sbin/nologin thuvien
mkdir -p "$APP"
systemctl stop thuvien 2>/dev/null || true
7z x -y -aoa -o"$APP" "$ARCHIVE" >/dev/null

echo "[4/7] Cai thu vien Python (giong doc VieNeu-TTS v3 Nano, xem PDF pymupdf)..."
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR="/usr/local/bin" sh
fi
[ -x "$APP/.venv/bin/python" ] || uv venv "$APP/.venv" --python 3.11
uv pip install --python "$APP/.venv/bin/python" -q -r "$APP/web-thuvien/requirements-audio.txt" -r "$APP/web-thuvien/requirements-collections.txt"
uv pip install --python "$APP/.venv/bin/python" -q --no-deps vieneu==3.8.4
chown -R thuvien:thuvien "$APP"

echo "[5/7] Tao dich vu tu khoi dong..."
cat > /etc/systemd/system/thuvien.service <<EOF
[Unit]
Description=Dai Thu Vien Chanh Phap
After=network-online.target
Wants=network-online.target

[Service]
User=thuvien
WorkingDirectory=$APP
Environment=PYTHONUTF8=1
ExecStart=$APP/.venv/bin/python -X utf8 $APP/web-thuvien/server.py --host 127.0.0.1 --port $PORT --allow-host $DOMAIN
Restart=always
RestartSec=3
NoNewPrivileges=true
ProtectSystem=full
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

echo "[6/7] Cau hinh HTTPS tu dong (Caddy + Let's Encrypt)..."
cat > /etc/caddy/Caddyfile <<EOF
$DOMAIN {
    encode zstd gzip
    reverse_proxy 127.0.0.1:$PORT {
        # Truyen ngay tung doan am thanh dang tao, khong doi ca file.
        flush_interval -1
    }
}
EOF

# Anh Ubuntu cua Oracle Cloud chan cong 80/443 bang iptables; mo ra neu gap.
if command -v netfilter-persistent >/dev/null 2>&1 && iptables -S INPUT | grep -q REJECT; then
  for p in 80 443; do
    iptables -C INPUT -p tcp --dport "$p" -j ACCEPT 2>/dev/null || iptables -I INPUT -p tcp --dport "$p" -j ACCEPT
  done
  netfilter-persistent save >/dev/null
fi
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q 'Status: active'; then
  ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null
fi

echo "[7/7] Khoi dong..."
systemctl daemon-reload
systemctl enable --now thuvien
systemctl enable caddy >/dev/null 2>&1
systemctl restart caddy

for _ in $(seq 1 20); do
  curl -fs "http://127.0.0.1:$PORT/api/library/status" >/dev/null && break
  sleep 1
done
if curl -fs "http://127.0.0.1:$PORT/api/library/status" >/dev/null; then
  echo ""
  echo "=================================================================="
  echo " XONG! Gui link nay cho ban be (lan dau mo co the cham ~30 giay"
  echo " vi may chu dang xin chung chi HTTPS):"
  echo ""
  echo "   https://$DOMAIN/web-thuvien/index.html"
  echo "=================================================================="
else
  echo "[!] May chu chua chay. Xem loi bang: journalctl -u thuvien -n 50"
  exit 1
fi

# Cap nhat nhanh: chi upload giao dien va cac module may chu lien quan den OpenGraph len VPS.
# Dung: powershell -File CAP_NHAT_OPENGRAPH.ps1 -Ip 161.118.198.123 -Key C:\duong\dan.key
param(
    [string]$Ip,
    [string]$Key,
    [string]$User = 'ubuntu'
)
$ErrorActionPreference = 'Stop'

if (-not $Ip) { $Ip = Read-Host 'Nhap IP cua VPS (vd 161.118.198.123)' }
if (-not $Key) { $Key = Read-Host 'Duong dan file khoa SSH (.key)' }
$Ip  = $Ip.Trim()
$Key = $Key.Trim().Trim('"').Trim("'")
if (-not (Test-Path $Key)) { throw "Khong thay file khoa: $Key" }

# Sao chep khoa vao .ssh va khoa quyen (bat buoc voi Windows OpenSSH)
$SshDir = Join-Path $env:USERPROFILE '.ssh'
New-Item -ItemType Directory -Force $SshDir | Out-Null
$Dest = Join-Path $SshDir 'thuvien_vps.key'
if ((Resolve-Path $Key).Path -ne $Dest) {
    if (Test-Path $Dest) { icacls $Dest /reset | Out-Null }
    Copy-Item $Key $Dest -Force
}
icacls $Dest /inheritance:r /grant:r "$($env:USERNAME):R" | Out-Null
$Opts = @('-i', $Dest, '-o', 'StrictHostKeyChecking=accept-new')

$Root = Split-Path $PSScriptRoot -Parent
$WebDir = Join-Path $Root 'app\web'

Write-Host "[1/2] Dang upload giao dien va cac module may chu len VPS..." -ForegroundColor Cyan
scp @Opts `
    "$WebDir\opengraph.png" `
    "$WebDir\index.html" `
    "$Root\app\server.py" `
    "$Root\app\project_paths.py" `
    "$Root\app\text_normalize.py" `
    "$Root\app\library_services.py" `
    "$Root\app\phuc_minh_pdf.py" `
    "$Root\app\narration_engine.py" `
    "${User}@${Ip}:/opt/thuvien/web-thuvien/"
if ($LASTEXITCODE -ne 0) { throw 'Upload that bai!' }

Write-Host "[2/2] Khoi dong lai dich vu..." -ForegroundColor Cyan
ssh @Opts "${User}@${Ip}" 'sudo systemctl restart thuvien'
if ($LASTEXITCODE -ne 0) { throw 'Restart that bai!' }

Write-Host ""
Write-Host "HOAN THANH! Kiem tra anh OpenGraph tai:" -ForegroundColor Green
Write-Host "  https://thuvienchanhphap.duckdns.org/opengraph.png" -ForegroundColor Yellow
Write-Host "  Tool test: https://developers.facebook.com/tools/debug/?q=https://thuvienchanhphap.duckdns.org/" -ForegroundColor Yellow

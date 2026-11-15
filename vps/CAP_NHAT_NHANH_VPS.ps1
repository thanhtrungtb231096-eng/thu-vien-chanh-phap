# Cap nhat sieu toc giao dien, giong doc & API len VPS (~15 giay, khong tai lai kho sach 2 GB, tu dong sao luu & khoi phuc an toan).
param(
    [string]$HostName = 'thuvienchanhphap.duckdns.org',
    [string]$User = 'ubuntu',
    [string]$Key = ''
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $Root

$DefaultKey = Join-Path $env:USERPROFILE '.ssh\thuvien_vps.key'
if (-not $Key) {
    $Key = if (Test-Path $DefaultKey) { $DefaultKey } else { (Read-Host 'Keo tha file khoa SSH (.key) vao cua so nay').Trim('"') }
}

Write-Host "[1/3] Dong goi phien ban giao dien & ma nguon moi nhat..."
python -X utf8 tools/build/build_ux_release.py
$MetaJson = python -X utf8 vps/prepare_audio_update.py | ConvertFrom-Json
$Archive = $MetaJson.archive
$Sha = $MetaJson.sha256
$Rel = "audio-" + (Get-Date -Format "yyyyMMdd-HHmmss")

Write-Host "[2/3] Tai goi cap nhat nho ($([math]::Round($MetaJson.bytes / 1MB, 2)) MiB) len $HostName..."
$Opts = @('-i', $Key, '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ServerAliveInterval=30')
scp @Opts "$Archive" "vps/apply_audio_update.py" "${User}@${HostName}:~/"
if ($LASTEXITCODE -ne 0) { throw "Tai len VPS that bai." }

Write-Host "[3/3] Kiem tra preflight & kich hoat an toan tren VPS..."
ssh @Opts "${User}@${HostName}" "sudo /opt/thuvien/.venv/bin/python -X utf8 /home/ubuntu/apply_audio_update.py /home/ubuntu/audio-update.tar.gz --release $Rel --sha256 $Sha && rm -f /home/ubuntu/audio-update.tar.gz /home/ubuntu/apply_audio_update.py"
if ($LASTEXITCODE -ne 0) { throw "Cap nhat VPS bao loi (he thong da tu dong giu ban cu an toan)." }

Write-Host "=================================================================="
Write-Host " DA CAP NHAT THANH CONG LEN https://$HostName !"
Write-Host " Phien ban: $($MetaJson.version)"
Write-Host "=================================================================="


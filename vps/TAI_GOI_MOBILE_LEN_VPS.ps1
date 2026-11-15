# Dong bo Kho Goi Kinh Ngoai Tuyen (.pack.db) & Goi Giong Doc AI Noi Bo (VieNeu-Nano ONNX)
# len may chu VPS (/opt/thuvien/deploy/goi-mobile/cdn-upload) voi doi chieu SHA-256 (chi tai tep thay doi).
param(
    [string]$HostName = 'thuvienchanhphap.duckdns.org',
    [string]$User = 'ubuntu',
    [string]$Key = '',
    [string]$MobileDir = ''
)
$ErrorActionPreference = 'Stop'

$LibraryRoot = Split-Path $PSScriptRoot -Parent
if (-not $MobileDir) {
    $MobileDir = Join-Path (Split-Path $LibraryRoot -Parent) ((Split-Path $LibraryRoot -Leaf) + ' - Mobile\cdn-upload')
}
if (-not (Test-Path $MobileDir)) {
    throw "Khong tim thay thu muc goi Mobile tai: $MobileDir"
}

$DefaultKey = Join-Path $env:USERPROFILE '.ssh\thuvien_vps.key'
if (-not $Key) {
    if (Test-Path $DefaultKey) {
        $Key = $DefaultKey
    } else {
        $Key = (Read-Host 'Keo tha file khoa SSH (.key) vao cua so nay roi bam Enter').Trim().Trim('"').Trim("'")
    }
}
if (-not (Test-Path $Key)) {
    throw "Khong tim thay file khoa SSH: $Key"
}

$SshOpts = @('-i', $Key, '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ServerAliveInterval=30')
$RemoteTarget = '/opt/thuvien/deploy/goi-mobile/cdn-upload'
$RemoteStage = '/home/ubuntu/mobile-packs-upload'

Write-Host "[1/4] Kiem tra danh sach tep & SHA-256 tren VPS ($HostName)..."
$RemoteHashesRaw = ssh @SshOpts "${User}@${HostName}" "if [ -d '$RemoteTarget' ]; then cd '$RemoteTarget' && find . -type f -exec sha256sum {} + ; fi"
$RemoteMap = @{}
foreach ($line in ($RemoteHashesRaw -split "`r?`n")) {
    if ($line -match '^([0-9a-fA-F]{64})\s+\./(.+)$') {
        $RemoteMap[$Matches[2]] = $Matches[1].ToLower()
    }
}

$AllowedExts = @('.json', '.db', '.onnx', '.gz')
$LocalFiles = Get-ChildItem -LiteralPath $MobileDir -Recurse -File | Where-Object {
    ($AllowedExts -contains $_.Extension.ToLower()) -and ($_.FullName -notmatch '[/\\]_')
} | Sort-Object FullName
$ToUpload = @()
foreach ($f in $LocalFiles) {
    $rel = $f.FullName.Substring($MobileDir.Length).TrimStart('\', '/') -replace '\\', '/'
    $sha = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash.ToLower()
    if ($RemoteMap[$rel] -eq $sha) {
        Write-Host "  [OK - Da co tren VPS] $rel"
    } else {
        $ToUpload += [PSCustomObject]@{
            File = $f
            Rel  = $rel
            Sha  = $sha
            MiB  = [math]::Round($f.Length / 1MB, 2)
        }
    }
}

if ($ToUpload.Count -eq 0) {
    Write-Host "[2/4] Tat ca $($LocalFiles.Count) tep tren VPS da khop 100% SHA-256, khong can tai lai."
} else {
    $TotalMiB = [math]::Round(($ToUpload | Measure-Object -Property MiB -Sum).Sum, 2)
    Write-Host "[2/4] Dang tai $($ToUpload.Count) tep ($TotalMiB MiB) len VPS..."
    ssh @SshOpts "${User}@${HostName}" "rm -rf '$RemoteStage' && mkdir -p '$RemoteStage/text-packs' '$RemoteStage/tts/vieneu-nano-mobile-v1'"

    foreach ($item in $ToUpload) {
        Write-Host "  -> Dang tai $($item.Rel) ($($item.MiB) MiB)..."
        scp @SshOpts $item.File.FullName "${User}@${HostName}:${RemoteStage}/$($item.Rel)"
        if ($LASTEXITCODE -ne 0) {
            throw "Loi SCP khi tai $($item.Rel)"
        }
    }

    Write-Host "[3/4] Xac minh toan ven SHA-256 & kich hoat tren VPS..."
    $CheckLines = ($ToUpload | ForEach-Object { "$($_.Sha)  $($_.Rel)" }) -join "`n"
    $CheckB64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($CheckLines + "`n"))
    $ActivateCmd = @"
set -e
cd '$RemoteStage'
echo '$CheckB64' | base64 -d | sha256sum -c -
sudo mkdir -p '$RemoteTarget/text-packs' '$RemoteTarget/tts/vieneu-nano-mobile-v1'
sudo cp -f '$RemoteStage'/text-packs/* '$RemoteTarget/text-packs/' 2>/dev/null || true
sudo cp -f '$RemoteStage'/tts/vieneu-nano-mobile-v1/* '$RemoteTarget/tts/vieneu-nano-mobile-v1/' 2>/dev/null || true
sudo chown -R thuvien:thuvien /opt/thuvien/deploy
sudo chmod -R a+rX /opt/thuvien/deploy
rm -rf '$RemoteStage'
"@ -replace "`r`n", "`n"

    ssh @SshOpts "${User}@${HostName}" $ActivateCmd
    if ($LASTEXITCODE -ne 0) {
        throw "Xac minh SHA-256 hoac kich hoat tren VPS that bai!"
    }
}

Write-Host "[4/4] Kiem tra duong truyen HTTPS cong khai (/mobile-packs/)..."
$PackManifest = Invoke-RestMethod -Uri "https://${HostName}/mobile-packs/text-packs/manifest.json" -TimeoutSec 15
$TtsManifest  = Invoke-RestMethod -Uri "https://${HostName}/mobile-packs/tts/vieneu-nano-mobile-v1/manifest.json" -TimeoutSec 15
Write-Host "=================================================================="
Write-Host " HOAN TAT DONG BO KHO NGOAI TUYEN MOBILE & WINDOWS PC LEN VPS!"
Write-Host " - Goi Kinh (.pack.db): $($PackManifest.packs.Count) goi ($($PackManifest.totalPackMiB) MiB)"
Write-Host " - Goi Giong AI ONNX : $($TtsManifest.files.Count) tep ($($TtsManifest.totalMiB) MiB)"
Write-Host " - Dia chi CDN       : https://${HostName}/mobile-packs/"
Write-Host "=================================================================="


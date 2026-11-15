# Tai thu vien len VPS va cai dat bang mot lan bam.
# Hoi IP + file khoa SSH, tu sua quyen file khoa (Windows OpenSSH bat buoc), roi chay cai_dat_vps.sh.
# Dung: chay TAI_LEN_VPS.cmd  (hoac: powershell -File TAI_LEN_VPS.ps1 -Ip 1.2.3.4 -Key C:\duong\dan.key)
param(
    [string]$Ip,
    [string]$Key,
    [string]$User = 'ubuntu',
    [string]$Domain = '',
    [string]$Out = ''
)
$ErrorActionPreference = 'Stop'
if (-not $Out) {
    $LibraryRoot = Split-Path $PSScriptRoot -Parent
    $Out = Join-Path (Split-Path $LibraryRoot -Parent) ((Split-Path $LibraryRoot -Leaf) + ' - VPS')
}

foreach ($f in 'thuvien.7z', 'cai_dat_vps.sh') {
    if (-not (Test-Path (Join-Path $Out $f))) { throw "Chua co $Out\$f. Hay chay DONG_GOI_VPS.cmd truoc." }
}
if (-not $Ip) { $Ip = Read-Host 'Nhap Public IP cua VPS (vd 152.69.1.2)' }
if (-not $Key) { $Key = Read-Host 'Keo tha file khoa SSH (.key) vao cua so nay roi bam Enter' }
$Ip = $Ip.Trim()
$Key = $Key.Trim().Trim('"').Trim("'")
if (-not (Test-Path $Key)) { throw "Khong thay file khoa: $Key" }

# OpenSSH tren Windows tu choi khoa neu nguoi khac co quyen doc -> chep vao ~/.ssh va khoa quyen lai.
$SshDir = Join-Path $env:USERPROFILE '.ssh'
New-Item -ItemType Directory -Force $SshDir | Out-Null
$Dest = Join-Path $SshDir 'thuvien_vps.key'
if ((Resolve-Path $Key).Path -ne $Dest) {
    if (Test-Path $Dest) { icacls $Dest /reset | Out-Null }
    Copy-Item $Key $Dest -Force
}
icacls $Dest /inheritance:r /grant:r "$($env:USERNAME):R" | Out-Null

$Opts = @('-i', $Dest, '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ServerAliveInterval=30')
$Upload = @((Join-Path $Out 'thuvien.7z'), (Join-Path $Out 'cai_dat_vps.sh'))
$Checksum = Join-Path $Out 'thuvien.7z.sha256'
if (-not (Test-Path $Checksum)) { throw 'Chua co checksum. Hay dong goi lai bang DONG_GOI_VPS.cmd.' }
$ExpectedHash = ((Get-Content -LiteralPath $Checksum -Raw).Trim() -split '\s+')[0]
$ActualHash = (Get-FileHash -LiteralPath (Join-Path $Out 'thuvien.7z') -Algorithm SHA256).Hash
if ($ExpectedHash -ne $ActualHash) { throw 'Goi nen khong khop checksum. Hay dong goi lai.' }
$Upload += $Checksum
$Size = [math]::Round((Get-Item -LiteralPath (Join-Path $Out 'thuvien.7z')).Length / 1MB, 1)
Write-Host "[1/2] Dang tai len $User@$Ip ($Size MiB)..."
scp @Opts @Upload "${User}@${Ip}:~/"
if ($LASTEXITCODE -ne 0) { throw 'Tai len that bai. Kiem tra IP, ten dang nhap va file khoa.' }

Write-Host '[2/2] Dang cai dat tren VPS...'
ssh @Opts -t "${User}@${Ip}" "sudo bash ~/cai_dat_vps.sh $Domain"
if ($LASTEXITCODE -ne 0) { throw 'Cai dat bao loi. Chup man hinh doan cuoi gui lai de duoc ho tro.' }

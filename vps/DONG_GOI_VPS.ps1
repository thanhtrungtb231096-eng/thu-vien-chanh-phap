# Dong goi day du nguon Word/PDF/kinh van, giao dien va chi muc cho VPS.
# Khong xoa nguon; khong dong goi cache, runtime Windows hoac du lieu ca nhan.
# Dung: DONG_GOI_VPS.cmd [thu-muc-xuat] [-AuditOnly]
param(
    [Parameter(Position = 0)]
    [string]$Out = '',
    [switch]$AuditOnly
)
$ErrorActionPreference = 'Stop'
if (-not $Out) {
    $LibraryRoot = Split-Path $PSScriptRoot -Parent
    $Out = Join-Path (Split-Path $LibraryRoot -Parent) ((Split-Path $LibraryRoot -Leaf) + ' - VPS')
}
$Prepare = Join-Path $PSScriptRoot 'prepare_vps.py'
$Python = Get-Command python -ErrorAction SilentlyContinue
if (-not $Python) { throw 'Chua co Python. Hay cai Python 3.10 tro len.' }

$PrepareArgs = @('-X', 'utf8', $Prepare, '--out', $Out)
if ($AuditOnly) { $PrepareArgs += '--audit-only' }
& $Python.Source @PrepareArgs
if ($LASTEXITCODE -ne 0) { throw 'Ra soat/dong goi that bai. Xem thong bao loi o tren.' }

if (-not $AuditOnly) {
    Write-Host ''
    Write-Host "[OK] Goi nam trong: $Out"
    Write-Host 'Buoc tiep theo: TAI_LEN_VPS.cmd (nhap IP va khoa SSH).'
    Write-Host 'Neu chon thu muc xuat khac, truyen cung -Out cho TAI_LEN_VPS.ps1.'
}

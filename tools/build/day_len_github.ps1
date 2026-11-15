# Dong bo ma nguon len GitHub de kich hoat Cloud Build (iOS .ipa, Android .apk, Windows .exe & Microsoft Store .msix)
param(
    [string]$RepoUrl = '',
    [switch]$NoReleaseTag
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location -LiteralPath $Root

if (-not (Test-Path '.git')) {
    Write-Host "[1/4] Khoi tao kho Git cuc bo (nhanh main)..."
    git init -b main
}

$CurrentOrigin = ''
try {
    $CurrentOrigin = (git remote get-url origin 2>$null).Trim()
} catch { $CurrentOrigin = '' }

if (-not $RepoUrl -and -not $CurrentOrigin) {
    Write-Host "=================================================================="
    Write-Host " BUOC 1: Tao 1 kho trong (Empty Repository) tren GitHub:"
    Write-Host "   1. Mo https://github.com/new (dang nhap tai khoan GitHub cua ban)"
    Write-Host "   2. Dat ten kho (vi du: thu-vien-chanh-phap), chon Private hoac Public"
    Write-Host "   3. KHONG tich chon 'Add a README' -> bam 'Create repository'"
    Write-Host "=================================================================="
    Start-Process "https://github.com/new"
    $RepoUrl = (Read-Host 'Dan duong link HTTPS cua kho GitHub vua tao (vd https://github.com/tenban/thu-vien-chanh-phap.git)').Trim()
}

if ($RepoUrl) {
    if ($CurrentOrigin) {
        git remote set-url origin $RepoUrl
    } else {
        git remote add origin $RepoUrl
    }
    $CurrentOrigin = $RepoUrl
}

if (-not $CurrentOrigin) {
    throw "Chua co dia chi kho GitHub. Hay chay lai va dan link kho GitHub."
}

# Dam bao user.name & user.email duoc cau hinh cho commit cuc bo
$GitName = (git config user.name 2>$null)
$GitEmail = (git config user.email 2>$null)
if (-not $GitName)  { git config user.name "Thu Vien Chanh Phap" }
if (-not $GitEmail) { git config user.email "chanhphap@users.noreply.github.com" }

Write-Host "[2/4] Kiem tra va ghi nhan cac thay doi moi nhat..."
git add -A
$Pending = (git status --porcelain)
if ($Pending) {
    $Stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "Cap nhat He sinh thai 4 nen tang Chanh Phap ($Stamp)"
} else {
    Write-Host "  -> Ma nguon da duoc commit day du."
}

Write-Host "[3/4] Dang day ma nguon (~31 MB) len GitHub ($CurrentOrigin)..."
git branch -M main
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    throw "Day len GitHub chua thanh cong. Neu trinh duyet hien cua so dang nhap GitHub, hay bam Authorize roi chay lai."
}

$WebUrl = $CurrentOrigin -replace '\.git$', ''
$ActionsUrl = "$WebUrl/actions"
$ReleasesUrl = "$WebUrl/releases"

if (-not $NoReleaseTag) {
    git fetch --tags origin 2>$null | Out-Null
    $ExistingTags = @(git tag -l "v1.1.*" 2>$null)
    $MaxPatch = -1
    foreach ($t in $ExistingTags) {
        if ($t -match '^v1\.1\.(\d+)$') {
            $n = [int]$Matches[1]
            if ($n -gt $MaxPatch) { $MaxPatch = $n }
        }
    }
    $NextTag = "v1.1.$($MaxPatch + 1)"
    Write-Host "[4/4] Tu dong kich hoat xuat ban cong khai 4 goi cai dat ($NextTag)..."
    git tag $NextTag
    git push origin $NextTag
    Write-Host "=================================================================="
    Write-Host " HOAN TAT! GitHub dang tu dong dong goi & xuat ban len trang Releases:"
    Write-Host "   - Tien trinh build (~6-10 phut): $ActionsUrl"
    Write-Host "   - Trang tai cong khai vinh vien : $ReleasesUrl"
    Write-Host "=================================================================="
} else {
    Write-Host "[4/4] HOAN TAT! Dang mo trang GitHub Actions: $ActionsUrl"
}
Start-Process $ActionsUrl


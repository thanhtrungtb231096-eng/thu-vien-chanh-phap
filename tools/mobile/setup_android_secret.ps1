# Cai dat Khoa Ky Android Chinh Thuc (Release Keystore 27 nam) len GitHub Secrets chi voi 1 cu click
param(
    [string]$KeystorePath = ''
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location -LiteralPath $Root

if (-not $KeystorePath) {
    $SiblingSigning = Join-Path (Split-Path $Root -Parent) "Kinh điển phật giáo - Mobile\signing\chanhphap-android-release.p12"
    $AltSigning = "E:\Kinh điển phật giáo - Mobile\signing\chanhphap-android-release.p12"
    if (Test-Path -LiteralPath $SiblingSigning) {
        $KeystorePath = $SiblingSigning
    } elseif (Test-Path -LiteralPath $AltSigning) {
        $KeystorePath = $AltSigning
    }
}

if (-not $KeystorePath -or -not (Test-Path -LiteralPath $KeystorePath)) {
    throw "Khong tim thay tep khoa chanhphap-android-release.p12 trong thu muc 'Kinh điển phật giáo - Mobile\signing\'."
}

$Bytes = [IO.File]::ReadAllBytes($KeystorePath)
$Base64 = [Convert]::ToBase64String($Bytes)
Set-Clipboard -Value $Base64

$CurrentOrigin = ''
try {
    $CurrentOrigin = (git remote get-url origin 2>$null).Trim()
} catch { $CurrentOrigin = '' }
$WebUrl = if ($CurrentOrigin) { $CurrentOrigin -replace '\.git$', '' } else { 'https://github.com/thanhtrungtb231096-eng/thu-vien-chanh-phap' }
$SecretsUrl = "$WebUrl/settings/secrets/actions/new"

Write-Host "=================================================================="
Write-Host " DA SAO CHEP KHOA KY ANDROID (27 NAM) VAO BO NHO TAM (CLIPBOARD)!"
Write-Host "   - Do dai ma Base64: $($Base64.Length) ky tu"
Write-Host "   - Tep goc         : $KeystorePath"
Write-Host "=================================================================="
Write-Host " Tren cua so trinh duyet GitHub vua mo, ban chi can lam 3 thao tac:"
Write-Host "   1. O 'Name'   : go chinh xac   ANDROID_KEYSTORE_BASE64"
Write-Host "   2. O 'Secret' : bam Ctrl + V   (dan ma khoa da copy san)"
Write-Host "   3. Bam nut mau xanh 'Add secret'"
Write-Host "=================================================================="
Start-Process $SecretsUrl

$Ans = (Read-Host "Sau khi bam 'Add secret', nhan Enter de tu dong xuat ban ban APK ky khoa chinh chu (hoac go N de bo qua)").Trim()
if ($Ans -notmatch '^[nN]') {
    $ExistingTags = @(git tag -l "v1.1.*" 2>$null)
    $MaxPatch = -1
    foreach ($t in $ExistingTags) {
        if ($t -match '^v1\.1\.(\d+)$') {
            $n = [int]$Matches[1]
            if ($n -gt $MaxPatch) { $MaxPatch = $n }
        }
    }
    $NextTag = "v1.1.$($MaxPatch + 1)"
    Write-Host "-> Dang kich hoat ban phat hanh cong khai $NextTag tren GitHub Releases..."
    git tag $NextTag
    git push origin $NextTag
    Write-Host "-> HOAN TAT! Dang mo trang theo doi tien trinh tai $WebUrl/actions"
    Start-Process "$WebUrl/actions"
}

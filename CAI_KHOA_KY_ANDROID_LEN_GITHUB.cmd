@echo off
chcp 65001 >nul
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\mobile\setup_android_secret.ps1" %*
if errorlevel 1 (
  echo.
  echo [!] Co loi khi doc khoa ky Android. Xem thong bao o tren.
  pause
  exit /b 1
)
pause

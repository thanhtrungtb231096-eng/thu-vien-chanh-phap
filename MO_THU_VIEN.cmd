@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0local\open_library.ps1" %*
if errorlevel 1 (
  echo Khong mo duoc thu vien. Xem thong bao loi o tren.
  pause
  exit /b 1
)

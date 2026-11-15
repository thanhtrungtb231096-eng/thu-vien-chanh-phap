@echo off
chcp 65001 >nul
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\build\day_len_github.ps1" %*
if errorlevel 1 (
  echo.
  echo [!] Chua hoan tat day len GitHub. Xem thong bao huong dan o tren.
  pause
  exit /b 1
)
pause


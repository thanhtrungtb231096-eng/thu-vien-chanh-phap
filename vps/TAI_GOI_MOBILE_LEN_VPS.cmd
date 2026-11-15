@echo off
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0TAI_GOI_MOBILE_LEN_VPS.ps1" %*
pause


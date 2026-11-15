@echo off
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0CAP_NHAT_NHANH_VPS.ps1" %*
pause


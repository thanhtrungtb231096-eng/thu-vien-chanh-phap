@echo off
chcp 65001 > nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0DONG_GOI_VPS.ps1" %*
set "DeployResult=%ERRORLEVEL%"
pause
exit /b %DeployResult%

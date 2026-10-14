@echo off
cd /d "%~dp0"
if not exist dist (
  echo Run build.bat first.
  pause
  exit /b 1
)
echo Previewing the built site exactly as it will look on Hostinger...
python preview-server.py 8766
pause

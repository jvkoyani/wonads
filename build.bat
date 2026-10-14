@echo off
cd /d "%~dp0"
if not exist node_modules call npm install
echo Building the website...
call npx astro build
if errorlevel 1 (
  echo.
  echo BUILD FAILED - read the error above. The live website is not affected.
  pause
  exit /b 1
)
echo.
echo Done. Upload the CONTENTS of this folder to Hostinger public_html:
echo   %~dp0dist
explorer "%~dp0dist"
pause

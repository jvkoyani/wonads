@echo off
cd /d "%~dp0"
echo Starting the editor preview... your browser will open at http://localhost:4321
echo Edit files in src\ and the page reloads automatically. Close this window to stop.
if not exist node_modules call npm install
call npx astro dev --open
pause

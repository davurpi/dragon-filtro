@echo off
cd /d "%~dp0"
echo Iniciando el Filtro Dragon...
start "" http://localhost:8123
node server.js
pause

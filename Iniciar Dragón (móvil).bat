@echo off
cd /d "%~dp0"
echo Iniciando el Filtro Dragon en HTTPS (para PC y movil)...
echo.
echo Abre en el movil la direccion "En el movil" que aparece abajo.
echo (Acepta el aviso de seguridad: Avanzado ^> Continuar.)
echo.
start "" https://localhost:8443
node server-https.js
pause

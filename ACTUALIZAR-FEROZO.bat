@echo off
setlocal
cd /d "%~dp0"

echo.
echo  EMPRENOR - Actualizar sitio Ferozo
echo  ==================================
echo.
echo  Este script genera la carpeta dist\ lista para subir por FTP.
echo  Destino en el servidor: public_html\
echo.

if not exist ".env.ferozo" (
  echo  ERROR: Falta .env.ferozo
  echo  Copie .env.ferozo.example a .env.ferozo y complete las variables.
  echo.
  pause
  exit /b 1
)

echo  [1/3] Verificando codigo...
call npm run lint
if errorlevel 1 goto :fail

echo.
echo  [2/3] Tests...
call npm run test
if errorlevel 1 goto :fail

echo.
echo  [3/3] Build Ferozo...
call npm run build:ferozo
if errorlevel 1 goto :fail

echo.
echo  ==========================================
echo   LISTO - Suba por FTP el contenido de:
echo.
echo     %CD%\dist\
echo.
echo   a public_html\ en Ferozo (modo binario).
echo   Incluya .htaccess, index.html y assets\
echo  ==========================================
echo.
explorer "%CD%\dist"
pause
exit /b 0

:fail
echo.
echo  Actualizacion fallida. Revise los errores arriba.
pause
exit /b 1

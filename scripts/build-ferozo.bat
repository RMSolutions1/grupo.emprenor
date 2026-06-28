@echo off
setlocal
cd /d "%~dp0.."

echo.
echo  EMPRENOR - Build para Ferozo
echo  ============================
echo.

if not exist ".env.ferozo" (
  echo  ERROR: Falta .env.ferozo
  echo.
  echo  1. Copie .env.ferozo.example a .env.ferozo
  echo  2. Complete VITE_SITE_URL, VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
  echo     ^(puede copiar Supabase desde .env.local^)
  echo.
  pause
  exit /b 1
)

call npm run build:ferozo
if errorlevel 1 (
  echo.
  echo  Build fallido.
  pause
  exit /b 1
)

echo.
echo  Build listo en dist\
echo  Deploy completo (FTP): npm run deploy:ferozo
echo  o ejecute scripts\deploy-ferozo.bat
echo.
pause

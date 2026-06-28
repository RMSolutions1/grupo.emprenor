@echo off
setlocal
cd /d "%~dp0.."

echo.
echo  EMPRENOR - Deploy automatico a Ferozo (FTP)
echo  ===========================================
echo.

if not exist ".env.ferozo" (
  echo  ERROR: Falta .env.ferozo
  echo.
  echo  1. Copie .env.ferozo.example a .env.ferozo
  echo  2. Complete VITE_* y FTP_* ^(ver deploy\ferozo\CHECKLIST.md^)
  echo.
  pause
  exit /b 1
)

call npm run deploy:ferozo %*
if errorlevel 1 (
  echo.
  echo  Deploy fallido.
  pause
  exit /b 1
)

echo.
pause

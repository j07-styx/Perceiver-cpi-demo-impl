@echo off
title PerceiverCPI Launcher

set "PROJECT=C:\Users\J0124\Downloads\PerceiverCPI-main\PerceiverCPI-main"

echo.
echo ==========================================
echo       PerceiverCPI Application
echo ==========================================
echo.

echo Starting FastAPI...
start "PerceiverCPI - FastAPI" cmd /k "cd /d "%PROJECT%" && call .venv39\Scripts\activate.bat && python -m uvicorn api.app:app --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo Starting Express...
start "PerceiverCPI - Express" cmd /k "cd /d "%PROJECT%\backend" && node src\server.js"

timeout /t 2 /nobreak >nul

echo Starting React...
start "PerceiverCPI - React" cmd /k "cd /d "%PROJECT%\frontend" && npm run dev"

echo.
echo ==========================================
echo All services are starting.
echo.
echo Frontend: http://localhost:5173
echo Express:  http://localhost:3000
echo FastAPI:  http://127.0.0.1:8000
echo ==========================================
echo.

timeout /t 3 /nobreak >nul
start http://localhost:5173

exit
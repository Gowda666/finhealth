@echo off
title FinHealth Launcher
echo ========================================================
echo       Starting FinHealth Full-Stack Application...
echo ========================================================

set PATH=C:\Users\Pavan\.node\node-v20.18.0-win-x64;%PATH%
cd /d "%~dp0"

echo [1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "FinHealth Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak > nul

echo [2/3] Starting Vite Frontend on http://127.0.0.1:5173 ...
start "FinHealth Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 2 /nobreak > nul

echo [3/3] Opening FinHealth in your browser...
start http://localhost:5173

echo ========================================================
echo FinHealth is now running! Keep the windows open.
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:8000
echo ========================================================

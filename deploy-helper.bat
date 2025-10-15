@echo off
echo ========================================
echo    MusicShare - Deployment Helper
echo ========================================
echo.
echo Choose an option:
echo.
echo 1. Open GitHub (create repository)
echo 2. Open Render (deploy backend)
echo 3. Open Netlify (deploy frontend)
echo 4. Open UptimeRobot (keep backend awake)
echo 5. Open all deployment sites
echo 6. Test local setup
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo Opening GitHub...
    start https://github.com/new
)

if "%choice%"=="2" (
    echo Opening Render...
    start https://render.com
)

if "%choice%"=="3" (
    echo Opening Netlify...
    start https://netlify.com
)

if "%choice%"=="4" (
    echo Opening UptimeRobot...
    start https://uptimerobot.com
)

if "%choice%"=="5" (
    echo Opening all deployment sites...
    start https://github.com/new
    timeout /t 2 /nobreak >nul
    start https://render.com
    timeout /t 2 /nobreak >nul
    start https://netlify.com
)

if "%choice%"=="6" (
    echo.
    echo Starting local server...
    echo Press Ctrl+C to stop the server
    echo.
    cd backend
    node server.js
)

if "%choice%"=="7" (
    echo Goodbye!
    exit
)

echo.
echo Done! Check DEPLOY_CHECKLIST.md for step-by-step instructions.
echo.
pause

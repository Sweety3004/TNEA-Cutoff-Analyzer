@echo off
echo Navigating to TNEA Cutoff Analyzer directory...
cd /d "d:\TNEA Cutoff Analyzer\TNEA-Cutoff-Analyzer"

echo Starting local server...
echo.
echo The application will be available at http://localhost:3000
echo (or another port if 3000 is busy - check the output below)
echo.
echo Press Ctrl+C to stop the server.
echo.

call npx -y serve .

pause

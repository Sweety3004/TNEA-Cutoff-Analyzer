@echo off
echo ===================================================
echo   Deploying TNEA Cutoff Analyzer to Vercel
echo ===================================================
echo.
echo This script will publish your website to a public URL using Vercel.
echo.
echo INSTRUCTIONS:
echo 1. If asked to log in, a browser window will open. Log in with Email, GitHub, etc.
echo 2. For "Set up and deploy?", press ENTER (Y).
echo 3. For "Which scope?", press ENTER (your account).
echo 4. For "Link to existing project?", press ENTER (N).
echo 5. For "Project name?", type a name or press ENTER to accept default.
echo 6. For "In which directory?", press ENTER (./).
echo 7. For "Want to modify these settings?", press ENTER (N).
echo.
echo Starting deployment process...
echo.

cd /d "d:\TNEA Cutoff Analyzer\TNEA-Cutoff-Analyzer"
call npx -y vercel --prod

echo.
echo ===================================================
echo   Deployment Complete!
echo   Checks for the 'Production' URL above.
echo ===================================================
pause

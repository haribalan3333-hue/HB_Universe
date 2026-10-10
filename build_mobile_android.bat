@echo off
title HB UNIVERSE - Android Mobile App Sync & Launch
echo ========================================================
echo  🌌 HB UNIVERSE — ANDROID MOBILE APP PACKAGING
echo  Step 1: Building optimized production web assets...
echo ========================================================
cd /d "%~dp0"
call npm run build
echo ========================================================
echo  Step 2: Syncing assets & native plugins to Android project...
echo ========================================================
call npx cap sync android
echo ========================================================
echo  Step 3: Opening Android Studio to generate APK / Debug on device...
echo ========================================================
call npx cap open android
pause

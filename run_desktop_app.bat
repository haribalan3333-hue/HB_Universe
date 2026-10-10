@echo off
title HB UNIVERSE - Standalone Desktop App (Live Dev)
echo ========================================================
echo  🌌 HB UNIVERSE — STANDALONE DESKTOP APPLICATION
echo  Mode: Live Electron Development
echo  Closing this window will exit the app.
echo ========================================================
cd /d "%~dp0"
npm run electron:dev

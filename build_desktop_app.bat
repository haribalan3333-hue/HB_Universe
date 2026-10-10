@echo off
title HB UNIVERSE - Build Standalone Windows App (.exe)
echo ========================================================
echo  🌌 HB UNIVERSE — COMPILING STANDALONE DESKTOP BINARY
echo  Target: Windows 64-bit Installer (.exe) & Portable App
echo ========================================================
cd /d "%~dp0"
npm run electron:dist
echo ========================================================
echo  ✅ Build Complete!
echo  Find your installer (.exe) inside: dist-electron/
echo ========================================================
pause

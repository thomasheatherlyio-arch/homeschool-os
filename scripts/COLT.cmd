@echo off
rem Double-click (or the COLT desktop shortcut) opens COLT (Grok Build) in the Shiloh HQ vault.
cd /d "%~dp0.."
title COLT - Shiloh HQ
set "GROK=%USERPROFILE%\.grok\bin\grok.exe"
if not exist "%GROK%" set "GROK=grok"
"%GROK%"
if errorlevel 1 pause

@echo off
echo =========================================
echo YouTube Transcriber (Run Mode)
echo =========================================

echo.
echo Running the program...
echo.
"%~dp0..\venv\Scripts\python.exe" "%~dp0transcribe.py"
pause

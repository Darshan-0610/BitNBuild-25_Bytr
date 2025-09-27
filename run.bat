@echo off
echo ==========================================
echo  Tiffin Logistics MVP - Hackathon Demo
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

echo Python version:
python --version
echo.

REM Check if virtual environment exists
if exist "tiffin_env" (
    echo Activating virtual environment...
    call tiffin_env\Scripts\activate
) else (
    echo Creating virtual environment...
    python -m venv tiffin_env
    call tiffin_env\Scripts\activate
    
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting Tiffin Logistics MVP...
echo.
echo Open your browser to: http://localhost:5000
echo.
echo Demo Credentials:
echo   Customer: ID 1, 2, or 3
echo   Vendor: ID 1
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
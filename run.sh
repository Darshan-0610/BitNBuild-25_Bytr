#!/bin/bash

echo "=========================================="
echo "  Tiffin Logistics MVP - Hackathon Demo"
echo "=========================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

echo "Python version:"
python3 --version
echo

# Check if virtual environment exists
if [ -d "tiffin_env" ]; then
    echo "Activating virtual environment..."
    source tiffin_env/bin/activate
else
    echo "Creating virtual environment..."
    python3 -m venv tiffin_env
    source tiffin_env/bin/activate
    
    echo "Installing dependencies..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
fi

echo
echo "Starting Tiffin Logistics MVP..."
echo
echo "Open your browser to: http://localhost:5000"
echo
echo "Demo Credentials:"
echo "  Customer: ID 1, 2, or 3"
echo "  Vendor: ID 1"
echo
echo "Press Ctrl+C to stop the server"
echo

python app.py
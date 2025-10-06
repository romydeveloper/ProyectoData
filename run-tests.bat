@echo off
echo ====================================
echo    Ejecutando Tests - Notes App
echo ====================================
echo.

echo [1/2] Tests del Backend (Python)...
cd Backend
python -m pytest -v
if %errorlevel% neq 0 (
    echo ERROR: Tests del backend fallaron
    pause
    exit /b 1
)
cd ..

echo.
echo [2/2] Tests del Frontend (JavaScript)...
cd Frontend
call npm test -- --passWithNoTests --watchAll=false
if %errorlevel% neq 0 (
    echo ERROR: Tests del frontend fallaron
    pause
    exit /b 1
)
cd ..

echo.
echo ====================================
echo    Todos los tests pasaron! ✅
echo ====================================
pause
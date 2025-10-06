@echo off
echo ====================================
echo    Notes App - Inicio Rapido
echo ====================================
echo.

echo Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta instalado o no esta en el PATH
    pause
    exit /b 1
)

echo Docker encontrado!
echo.

echo Construyendo y levantando servicios...
docker-compose up --build -d

echo.
echo ====================================
echo    Servicios iniciados!
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo Documentacion API: http://localhost:8000/docs
echo.
echo Para detener los servicios ejecuta: docker-compose down
echo.
pause
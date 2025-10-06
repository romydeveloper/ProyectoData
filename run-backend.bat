@echo off
echo ====================================
echo   Iniciando Backend con SQLite
echo ====================================

cd Backend
echo Instalando dependencias...
pip install -r requirements.txt

echo.
echo Iniciando servidor FastAPI...
echo Backend disponible en: http://localhost:8000
echo Documentacion API en: http://localhost:8000/docs
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
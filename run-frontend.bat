@echo off
echo ====================================
echo   Iniciando Frontend React
echo ====================================

cd Frontend
echo Instalando dependencias...
npm install

echo.
echo Iniciando servidor de desarrollo...
echo Frontend disponible en: http://localhost:3000
echo.

npm run dev

pause
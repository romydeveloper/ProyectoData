@echo off
echo Configurando Git para el proyecto...

git init
git add .
git commit -m "feat: complete notes app with frontend and backend"

echo.
echo Para subir a GitHub:
echo 1. Crea un repositorio en github.com
echo 2. Ejecuta: git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
echo 3. Ejecuta: git push -u origin main

pause
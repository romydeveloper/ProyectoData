@echo off
echo Comprimiendo proyecto...
powershell Compress-Archive -Path "." -DestinationPath "../ProyectoData.zip" -Force
echo Proyecto comprimido en: ProyectoData.zip
pause
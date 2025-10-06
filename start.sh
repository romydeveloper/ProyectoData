#!/bin/bash

echo "===================================="
echo "    Notes App - Inicio Rápido"
echo "===================================="
echo

echo "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: Docker Compose no está instalado"
    exit 1
fi

echo "Docker encontrado!"
echo

echo "Construyendo y levantando servicios..."
docker-compose up --build -d

echo
echo "===================================="
echo "    Servicios iniciados!"
echo "===================================="
echo
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "Documentación API: http://localhost:8000/docs"
echo
echo "Para detener los servicios ejecuta: docker-compose down"
echo
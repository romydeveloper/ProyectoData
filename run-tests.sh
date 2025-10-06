#!/bin/bash

echo "===================================="
echo "    Ejecutando Tests - Notes App"
echo "===================================="
echo

echo "[1/2] Tests del Backend (Python)..."
cd Backend
python -m pytest -v
if [ $? -ne 0 ]; then
    echo "ERROR: Tests del backend fallaron"
    exit 1
fi
cd ..

echo
echo "[2/2] Tests del Frontend (JavaScript)..."
cd Frontend
npm test -- --passWithNoTests --watchAll=false
if [ $? -ne 0 ]; then
    echo "ERROR: Tests del frontend fallaron"
    exit 1
fi
cd ..

echo
echo "===================================="
echo "    Todos los tests pasaron! ✅"
echo "===================================="
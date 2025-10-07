# 📝 Instrucciones para Prueba Técnica

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado)
```bash
# Descomprimir proyecto
# Abrir terminal en la carpeta del proyecto
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Opción 2: Sin Docker
```bash
# Backend (Terminal 1)
cd Backend
pip install -r requirements.txt
python main.py

# Frontend (Terminal 2)
cd Frontend
npm install
npm run dev
```

## 🔍 Qué Revisar

✅ **Frontend React**: Interfaz de notas + integración PokéAPI
✅ **Backend FastAPI**: API REST completa con documentación
✅ **Docker**: Configuración completa para desarrollo y producción
✅ **Tests**: Implementados para backend y frontend
✅ **Documentación**: README completo con arquitectura

## 📊 Funcionalidades

- CRUD completo de notas
- Búsqueda y paginación
- Integración con API externa (PokéAPI)
- Interfaz responsive
- Documentación automática
- Containerización completa
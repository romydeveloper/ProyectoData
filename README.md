# Notes App - Full Stack Application

Aplicación full-stack de notas con API REST y frontend React, incluyendo integración con API externa (PokéAPI).

## 🚀 Inicio Rápido con Docker

### Prerrequisitos
- Docker
- Docker Compose

### Opción 1: Script automático
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

### Opción 2: Comandos manuales
```bash
# Clonar y navegar al proyecto
git clone <repository-url>
cd ProyectoData

# Levantar servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f
```

### Opción 3: Makefile
```bash
make up      # Levantar servicios
make logs    # Ver logs
make down    # Detener servicios
make clean   # Limpiar todo
```

## 📱 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External API  │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (PokéAPI)     │
│   Port: 3000    │    │   Port: 8000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Desarrollo Local

### Backend
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## 🐳 Comandos Docker Útiles

```bash
# Desarrollo
docker-compose up --build

# Producción
docker-compose -f docker-compose.prod.yml up --build -d

# Ver estado de servicios
docker-compose ps

# Reiniciar servicios
docker-compose restart

# Limpiar todo
docker-compose down -v --rmi all --remove-orphans
```

## 📋 Funcionalidades

### ✅ Backend (FastAPI)
- CRUD completo de notas
- Paginación y búsqueda
- Validación de datos
- Documentación automática (OpenAPI)
- Health checks
- CORS configurado

### ✅ Frontend (React + Vite)
- Interfaz responsive
- CRUD de notas con modales
- Búsqueda y paginación
- Integración con PokéAPI
- Estados de carga y error
- Accesibilidad básica

### ✅ DevOps
- Docker Compose para desarrollo y producción
- Nginx como proxy reverso
- Health checks
- Scripts de inicio automatizados
- Makefile para comandos simplificados

## 🔧 Configuración

Copia `.env.example` a `.env` y ajusta las variables según tu entorno:

```bash
cp .env.example .env
```

## 📚 Estructura del Proyecto

```
ProyectoData/
├── Backend/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── Frontend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── start.bat
└── start.sh
```

## 🧪 Testing

```bash
# Backend tests
cd Backend
python -m pytest

# Frontend tests (pendiente)
cd Frontend
npm test
```

## 🚀 Deployment

Para producción, usa el archivo de compose específico:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 📝 Notas Técnicas

- **Base de datos**: SQLite (notes.db)
- **CORS**: Configurado para desarrollo y producción
- **Proxy**: Nginx maneja el routing del frontend
- **Health Checks**: Implementados para monitoreo
- **Multi-stage builds**: Optimización de imágenes Docker
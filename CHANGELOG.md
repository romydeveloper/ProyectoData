# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-05

### Added

#### Backend (FastAPI)
- CRUD completo de notas (crear, leer, actualizar, eliminar)
- API REST con documentación automática (OpenAPI/Swagger)
- Paginación y búsqueda de notas
- Validación de datos con Pydantic
- Base de datos SQLite con SQLAlchemy ORM
- Health check endpoint para monitoreo
- Tests unitarios con pytest
- Explorador de base de datos (explore_db.py)

#### Frontend (React + Vite)
- Interfaz de usuario responsive y moderna
- Gestión de notas con modales para crear/editar
- Búsqueda en tiempo real y paginación
- Integración con PokéAPI
- Tema claro/oscuro con persistencia
- Custom hooks (useNotes, useTheme)
- Componentes modulares y reutilizables

#### DevOps y Herramientas
- Docker Compose para desarrollo y producción
- Nginx como proxy reverso
- Scripts de automatización (start.bat, start.sh)
- Makefile para comandos simplificados
- Documentación completa

### Changed
- [SI APLICA en un futuro: Cambios en funcionalidades existentes]

### Deprecated
- [SI APLICA en un futuro: Funcionalidades que serán removidas]

### Removed
- [SI APLICA en un futuro: Funcionalidades removidas]

### Fixed
- [SI APLICA en un futuro: Bugs corregidos durante el desarrollo]

### Security
- CORS configurado para desarrollo y producción
- Validación de inputs en backend y frontend
- Sanitización de datos de entrada
- Manejo seguro de sesiones de base de datos
- Headers de seguridad básicos

### Technical Decisions
- FastAPI elegido por velocidad y documentación automática
- React con Vite para desarrollo rápido
- SQLite para simplicidad y portabilidad
- Docker para consistencia entre entornos
- Arquitectura separada frontend/backend

## [Unreleased]

### Planned
- Autenticación y autorización de usuarios (JWT)
- Base de datos PostgreSQL para producción
- Cache con Redis para mejor rendimiento
- Tests end-to-end con Cypress
- CI/CD pipeline con GitHub Actions
- Exportación de notas (PDF, Markdown)
- Colaboración en tiempo real
- API rate limiting y métricas
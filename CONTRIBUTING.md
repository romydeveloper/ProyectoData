# Guía de Contribución

## Cómo Contribuir

### Prerrequisitos
[LISTA: Qué necesita alguien para contribuir]
- Docker y Docker Compose
- [AGREGA: Node.js versión X]
- [AGREGA: Python versión X]
- [AGREGA: Git]

### Configuración del Entorno de Desarrollo

1. **Clonar el repositorio**
   ```bash
   git clone [URL-DEL-REPO]
   cd ProyectoData
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # [INSTRUCCIÓN: Editar .env según necesidades]
   ```

3. **Levantar la aplicación**
   ```bash
   # Opción 1: Docker (recomendado)
   make up
   
   # Opción 2: Desarrollo local
   # [AGREGA: Instrucciones específicas para tu setup]
   ```

### Flujo de Desarrollo

1. **Crear una rama**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Hacer cambios**
   - [INSTRUCCIÓN: Dónde hacer cambios de backend]
   - [INSTRUCCIÓN: Dónde hacer cambios de frontend]

3. **Ejecutar tests**
   ```bash
   make test
   # o
   make test-backend
   make test-frontend
   ```

4. **Verificar linting**
   ```bash
   # Frontend
   cd Frontend && npm run lint
   
   # Backend
   # [AGREGA: Comandos de linting si los tienes]
   ```

5. **Commit con convenciones**
   ```bash
   git commit -m "feat: agregar nueva funcionalidad"
   ```

### Convenciones de Código

#### Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato
- `refactor:` refactoring de código
- `test:` agregar o modificar tests
- `chore:` tareas de mantenimiento

#### Código
**Backend (Python)**:
- [AGREGA: Tus convenciones de Python]
- [EJEMPLO: Usar snake_case para variables]
- [EJEMPLO: Docstrings para funciones]

**Frontend (JavaScript/React)**:
- [AGREGA: Tus convenciones de JS/React]
- [EJEMPLO: Usar camelCase para variables]
- [EJEMPLO: Componentes en PascalCase]

### Estructura del Proyecto

```
ProyectoData/
├── Backend/           # [DESCRIBE: Qué contiene]
├── Frontend/          # [DESCRIBE: Qué contiene]
├── docker-compose.yml # [DESCRIBE: Para qué sirve]
├── Makefile          # [DESCRIBE: Comandos disponibles]
└── docs/             # [DESCRIBE: Documentación]
```

### Testing

#### Backend
```bash
cd Backend
python -m pytest -v
```
- [INSTRUCCIÓN: Dónde agregar nuevos tests]
- [INSTRUCCIÓN: Cómo escribir tests]

#### Frontend
```bash
cd Frontend
npm test
```
- [INSTRUCCIÓN: Dónde agregar nuevos tests]
- [INSTRUCCIÓN: Qué tipo de tests escribir]

### Herramientas de Desarrollo

#### Comandos Útiles
```bash
make up           # Levantar aplicación
make down         # Detener aplicación
make logs         # Ver logs
make test         # Ejecutar todos los tests
make clean        # Limpiar contenedores
```

#### URLs de Desarrollo
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

### Reportar Issues

Si encuentras un bug:
1. [INSTRUCCIÓN: Verificar que no existe ya]
2. [INSTRUCCIÓN: Crear issue con template]
3. [INSTRUCCIÓN: Incluir información específica]

### Solicitar Features

Para nuevas funcionalidades:
1. [INSTRUCCIÓN: Discutir primero en issues]
2. [INSTRUCCIÓN: Explicar el caso de uso]
3. [INSTRUCCIÓN: Proponer implementación]

### Preguntas

Si tienes preguntas:
- [CONTACTO: Cómo contactarte]
- [RECURSOS: Documentación adicional]
# Guía de Contribución

## Cómo Contribuir

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ y npm
- Python 3.8+ y pip
- Git
- Editor de código (recomendado: VS Code)

### Configuración del Entorno de Desarrollo

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/romydeveloper/notes-app-full-stack-proyect
   cd notes-app-full-stack-proyect
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env si es necesario (valores por defecto funcionan para desarrollo)
   ```

3. **Levantar la aplicación**
   ```bash
   # Opción 1: Docker (recomendado)
   docker-compose up --build
   # o usar Makefile
   make up
   
   # Opción 2: Desarrollo local
   # Backend
   cd Backend && pip install -r requirements.txt && uvicorn main:app --reload
   # Frontend (nueva terminal)
   cd Frontend && npm install && npm run dev
   ```

### Flujo de Desarrollo

1. **Crear una rama**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Hacer cambios**
   - **Backend**: Modificar archivos en `Backend/`
     - `main.py` - Endpoints y lógica de API
     - `database.py` - Modelos y configuración de BD
     - `test_main.py` - Tests del backend
   - **Frontend**: Modificar archivos en `Frontend/src/`
     - `components/` - Componentes React
     - `hooks/` - Custom hooks
     - `services/` - Lógica de API calls
     - `App.jsx` - Componente principal

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
- Usar snake_case para variables y funciones
- PascalCase para clases
- Docstrings para funciones públicas
- Type hints cuando sea posible
- Máximo 88 caracteres por línea

**Frontend (JavaScript/React)**:
- camelCase para variables y funciones
- PascalCase para componentes
- Usar hooks funcionales sobre class components
- Comentarios JSX con {/* */}
- Props destructuring en componentes

### Estructura del Proyecto

```
ProyectoData/
├── Backend/           # API FastAPI, modelos, tests
├── Frontend/          # Aplicación React, componentes, hooks
├── docker-compose.yml # Configuración de contenedores
├── Makefile          # Comandos automatizados
├── README.md         # Documentación principal
├── CHANGELOG.md      # Historial de cambios
└── CONTRIBUTING.md   # Esta guía
```

### Testing

#### Backend
```bash
cd Backend
python -m pytest -v
```
- Agregar tests en Backend/test_*.py
- Seguir el patrón de tests existentes
- Usar fixtures para datos de prueba
- Testear casos de éxito y error

#### Frontend
```bash
cd Frontend
npm test
```
- Agregar tests en src/**/*.test.js
- Testear componentes con @testing-library/react
- Mockear llamadas a APIs
- Testear interacciones de usuario

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
1. Verificar que no existe un issue similar
2. Crear un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica

### Solicitar Features

Para nuevas funcionalidades:
1. Crear un issue de tipo "Feature Request"
2. Explicar el caso de uso y beneficio
3. Proponer una implementación si es posible
4. Discutir antes de empezar a desarrollar

### Preguntas

Si tienes preguntas:
- Crear un issue con la etiqueta "question"
- Revisar la documentación en README.md
- Consultar la documentación de la API en /docs

### Contacto

- **GitHub**: [@romydeveloper](https://github.com/romydeveloper)
- **Proyecto**: [notes-app-full-stack-proyect](https://github.com/romydeveloper/notes-app-full-stack-proyect)
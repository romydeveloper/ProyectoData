# Architecture - Notes App

## Resumen
[Esta es una aplicacion full-stack para gestionar notas con funcionalidades CRUD (crear,leer,actualizar, eliminar)incluye busqueda, paginacion, sistema de tags y una seccion adicional que consume la API de pokemon, para poder mostrar informacion de pokemones con filtros por tipo.
Construida en react en el Frontend ya que este lenguaje es el que más conozco, FastAPI en el Backend y containerizada con Dockercompose para facil Deployment. ]

## Diagrama de Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External API  │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (PokéAPI)     │
│   Port: 3000    │    │   Port: 8000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Capas de la Aplicación

### 1. Capa de Presentación (Frontend)

**Tecnología**: [ React + Vite + Tailwind CSS + React Router + Axios + Jest/ Next.js]

**Responsabilidades**:
         [¿Qué hace el Frontend?]

- [El Frontend en esta app se encrga de renderizar la interfaz del usuario y manejar las interacciones del usuario como formularios, botones, navegacion.
Tambien realiza peticiones HTTP al backend para operaciones CRUD de notas y consultas a la API de pokemon.
Tambien gestiona el estado local de la aplicacion como :notas, filtros, estados de carga, errores.
implementa navegacion entre paginas usando reactrouter.
valida los datos del usuario antes de enviarlos al backend
finalmente muestra feedback visual al usuario como loading, errores, confirmaciones.]


-   [¿Cómo maneja el estado?]

[Utilizé React hooks (useState, useEffect) para estado local de componentes y Context API para estado global compartido entre componentes (lista de notas, filtros activos, datos de Pokémon)]


- [¿Cómo se comunica con el backend?]

[A través de peticiones HTTP usando Axios, realizando llamadas REST a http://localhost:8000/api/ para operaciones CRUD de notas y endpoints de Pokémon, manejando respuestas JSON y estados de error/loading]



**Componentes principales**:
- [App - Componente raíz - con Context Provider y React Router

Header/Navbar - Navegación principal entre secciones

NotesList - Lista paginada de notas con búsqueda

NoteCard - Tarjeta individual de nota con acciones CRUD

NoteForm - Modal/formulario para crear/editar notas

SearchBar - Barra de búsqueda con filtros por tags

PokemonList - Lista de Pokémon con filtros por tipo

PokemonCard - Tarjeta individual de Pokémon con detalles

LoadingSpinner - Componente de estado de carga

ErrorMessage - Componente para mostrar errores

Pagination - Controles de paginación reutilizable]

### 2. Capa de Lógica de Negocio (Backend)
  **Tecnología**: [ FastAPI ]


   **Responsabilidades**:
-    [¿Qué hace el backend?]

[Expone una API REST con endpoints para operaciones CRUD de notas (crear, leer, actualizar, eliminar), implementa búsqueda y paginación de notas, actúa como proxy para consultas a la PokéAPI filtrando y transformando datos, maneja CORS para permitir comunicación con el frontend, proporciona documentación automática con OpenAPI/Swagger, y incluye health checks para monitoreo del servicio.]


-   [¿Cómo maneja los datos?]
[Almacena las notas en memoria usando estructuras de datos Python (listas y diccionarios), genera IDs únicos con UUID, mantiene timestamps automáticos para created_at/updated_at, y procesa datos JSON de la PokéAPI antes de enviarlos al frontend con filtrado y transformación según sea necesario]



-   [¿Cómo valida las peticiones?]
 [Utiliza modelos Pydantic para validación automática de tipos de datos y estructura JSON, valida longitud de campos (título 1-120 chars, contenido 1-10000 chars), verifica formato de UUIDs para IDs, valida que campos requeridos estén presentes, retorna errores HTTP 422 con detalles específicos cuando la validación falla, y sanitiza datos de entrada para prevenir inyecciones básicas.]

**Endpoints principales**:
- [Endpoints principales:

GET /api/notes - Obtener todas las notas con paginación y búsqueda

POST /api/notes - Crear nueva nota

GET /api/notes/{id} - Obtener nota específica por ID

PUT /api/notes/{id} - Actualizar nota existente

DELETE /api/notes/{id} - Eliminar nota

GET /api/pokemon - Obtener lista de Pokémon con filtros

GET /api/pokemon/{name} - Obtener detalles de Pokémon específico

GET /health - Health check del servicio

GET /docs - Documentación automática de la API]

### 3. Capa de Datos
**Almacenamiento**: SQLite (notes.db)
**Justificación**: Elegí SQLite por ser una base de datos ligera, sin servidor y perfecta para desarrollo y demos. No requiere instalación adicional, se integra nativamente con Python, persiste los datos entre reinicios del servidor, y es ideal para aplicaciones pequeñas a medianas. Para una prueba técnica, SQLite demuestro conocimiento de bases de datos relacionales sin la complejidad de configurar PostgreSQL o MySQL adicional descargue la interfaz visual de SQLite Desktop y la vincule al proyecto para manejar la BD de forma mas profesional.

## Contratos de API

### API Interna (Backend)
**Base URL**: `http://localhost:8000`
**Formato**: JSON
**Autenticación**: Ninguna (API abierta para demo)

**Modelo de Nota**:
```json
{
  "id": "string (UUID)",
  "title": "string (1-120 chars)",
  "content": "string (1-10000 chars)",
  "tags": ["array of strings"],
  "created_at": "ISO-8601 datetime",
  "updated_at": "ISO-8601 datetime",
  "archived": "boolean"
}
```

### API Externa
**Servicio**: PokéAPI (https://pokeapi.co/)
**Propósito**: Demostrar que la app cumple con la integración de APIs externas y agregar funcionalidad adicional a la aplicación. Permitira a los usuarios explorar información de Pokémon como complemento a la gestión de notas, mostrando habilidades de consumo de APIs REST y manejo de datos externos.
**Filtros implementados**: 
- Filtro por tipo de Pokémon (fire, water, grass, electric.)
- Búsqueda por nombre de Pokémon
- Paginación de resultados
- Límite de resultados por página

## Flujo de Datos

### Crear Nota
1. Usuario completa el formulario NoteForm (título, contenido, tags) y hace clic en "Guardar"
2. Frontend envía POST request a `/api/notes` con JSON: `{"title": "...", "content": "...", "tags": [...]}`
3. Backend valida con Pydantic: longitud de campos, tipos de datos, campos requeridos
4. Backend genera UUID, timestamps automáticos y ejecuta INSERT en SQLite
5. Respuesta HTTP 201 con la nota creada completa, frontend actualiza la lista y cierra el modal

### Consultar API Externa
1. El Usuario navega a la sección Pokémon y selecciona filtros (tipo: fire, water, etc.) o busca por nombre
2. Frontend envía GET request a `/api/pokemon?type=fire&limit=20&offset=0` (nuestro backend)
3. Backend hace request a PokéAPI, filtra datos relevantes (nombre, imagen, tipos, stats) y transforma la respuesta
4. Frontend recibe JSON procesado y renderiza PokemonCard components con imágenes, nombres y detalles en grid responsive

## Decisiones de Diseño

### Frontend
- **Framework**: React + Vite - Elegí React por mi experiencia previa y su ecosistema maduro. Vite por su velocidad de desarrollo y hot reload instantáneo, ideal para demos rápidas.
- **Estado**: useState/useEffect para estado local y Context API para estado global. Evité Redux por simplicidad, Context es suficiente para el alcance del proyecto.
- **Estilos**: Tailwind CSS - Permite desarrollo rápido con clases utilitarias, responsive design fácil, y mantiene consistencia visual sin escribir CSS personalizado.

### Backend
- **Framework**: [JUSTIFICA: ¿Por qué FastAPI/Flask?]
- **Validación**: [JUSTIFICA: ¿Cómo validas los datos?]
- **Estructura**: [JUSTIFICA: ¿Cómo organizaste el código?]

## Trade-offs y Limitaciones

### Decisiones Conscientes
- [EXPLICA: Qué sacrificaste por simplicidad]
- [EXPLICA: Qué harías diferente con más tiempo]
- [EXPLICA: Qué limitaciones tiene tu solución]

### Escalabilidad
- [DESCRIBE: Qué cambiarías para producción]
- [DESCRIBE: Cómo manejarías más usuarios]
- [DESCRIBE: Qué base de datos usarías]

## Seguridad

### Implementado
- [LISTA: Qué medidas de seguridad tienes]

### Pendiente para Producción
- [LISTA: Qué agregarías para producción]
# Notes App Frontend

Frontend de la aplicación de notas construido con React + Vite.

## Características

- ✅ CRUD completo de notas
- ✅ Búsqueda y paginación
- ✅ Integración con API externa (PokéAPI)
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Accesibilidad básica implementada
- ✅ Estados de carga y error
- ✅ Validación de formularios

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Linting

```bash
npm run lint
npm run lint:fix
```

## Estructura del proyecto

```
src/
├── components/
│   ├── notes/          # Componentes de notas
│   ├── external/       # Componentes para API externa
│   └── ui/            # Componentes UI reutilizables
├── hooks/             # Custom hooks
├── pages/             # Páginas principales
├── services/          # Servicios API
└── utils/             # Utilidades
```

## Variables de entorno

Copia `.env.example` a `.env` y configura las variables necesarias.
// Datos de ejemplo para poblar la aplicación
export const sampleNotes = [
  {
    title: "Lista de tareas del proyecto",
    content: "1. Completar el backend API\n2. Implementar el frontend\n3. Escribir tests\n4. Documentar el código\n5. Preparar para producción",
    tags: ["trabajo", "proyecto", "tareas"]
  },
  {
    title: "Ideas para mejorar la app",
    content: "- Agregar modo oscuro\n- Implementar notificaciones\n- Añadir exportación de notas\n- Crear sistema de categorías\n- Mejorar la búsqueda con filtros avanzados",
    tags: ["ideas", "mejoras", "features"]
  },
  {
    title: "Notas de la reunión",
    content: "Puntos discutidos:\n- Revisión del progreso actual\n- Definición de próximos pasos\n- Asignación de responsabilidades\n- Fecha de entrega: próximo lunes",
    tags: ["reunión", "trabajo", "deadlines"]
  },
  {
    title: "Receta de pasta italiana",
    content: "Ingredientes:\n- 400g pasta\n- 200g tomates cherry\n- 3 dientes de ajo\n- Albahaca fresca\n- Aceite de oliva\n- Queso parmesano\n\nPreparación:\n1. Hervir la pasta\n2. Saltear ajo y tomates\n3. Mezclar con pasta\n4. Agregar albahaca y queso",
    tags: ["cocina", "recetas", "italiana"]
  },
  {
    title: "Libros por leer",
    content: "Lista de libros pendientes:\n- Clean Code - Robert Martin\n- The Pragmatic Programmer\n- Design Patterns - Gang of Four\n- You Don't Know JS - Kyle Simpson\n- Eloquent JavaScript",
    tags: ["libros", "programación", "aprendizaje"]
  }
]

// Función para crear notas de ejemplo
export const createSampleNotes = async (createNoteFunction) => {
  try {
    const promises = sampleNotes.map(note => createNoteFunction(note))
    await Promise.all(promises)
    console.log('Notas de ejemplo creadas exitosamente')
  } catch (error) {
    console.error('Error creando notas de ejemplo:', error)
  }
}
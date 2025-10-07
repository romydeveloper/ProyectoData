// Página principal para la gestión de notas
import { useState, useEffect } from 'react'  // Hooks de React para estado y efectos
import { useNotes } from '../hooks/useNotes'  // Hook personalizado para operaciones de notas
import NotesList from '../components/notes/NotesList'  // Componente lista de notas
import NoteModal from '../components/notes/NoteModal'  // Modal para crear/editar notas
import SearchBar from '../components/ui/SearchBar'  // Barra de búsqueda
import Pagination from '../components/ui/Pagination'  // Componente de paginación
import LoadingSpinner from '../components/ui/LoadingSpinner'  // Indicador de carga
import ErrorMessage from '../components/ui/ErrorMessage'  // Componente para mostrar errores

// Componente principal de la página de notas
const NotesPage = () => {
  // Extraer funciones y estado del hook personalizado de notas
  const { notes, loading, error, pagination, loadNotes, createNote, updateNote, deleteNote } = useNotes()
  
  // Estados locales del componente
  const [showModal, setShowModal] = useState(false)  // Controla la visibilidad del modal
  const [editingNote, setEditingNote] = useState(null)  // Nota que se está editando (null para crear nueva)
  const [searchTerm, setSearchTerm] = useState('')  // Término de búsqueda actual

  // Cargar notas al montar el componente
  useEffect(() => {
    loadNotes()
  }, [])

  // Manejar búsqueda de notas
  const handleSearch = (term) => {
    setSearchTerm(term)
    loadNotes(1, pagination.limit, term)  // Reiniciar a la primera página con el nuevo término
  }

  // Manejar cambio de página en la paginación
  const handlePageChange = (page) => {
    loadNotes(page, pagination.limit, searchTerm)
  }

  // Abrir modal para crear nueva nota
  const handleCreateNote = () => {
    setEditingNote(null)  // Limpiar nota en edición
    setShowModal(true)    // Mostrar modal
  }

  // Abrir modal para editar nota existente
  const handleEditNote = (note) => {
    setEditingNote(note)  // Establecer la nota a editar
    setShowModal(true)    // Mostrar modal
  }

  // Guardar nota (crear nueva o actualizar existente)
  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        // Si hay una nota en edición, actualizarla
        await updateNote(editingNote.id, noteData)
      } else {
        // Si no, crear una nueva nota
        await createNote(noteData)
      }
      setShowModal(false)  // Cerrar modal
      loadNotes(pagination.page, pagination.limit, searchTerm)  // Recargar lista
    } catch (error) {
      console.error('Error guardando nota:', error)
    }
  }

  // Eliminar nota con confirmación
  const handleDeleteNote = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      try {
        await deleteNote(id)
        loadNotes(pagination.page, pagination.limit, searchTerm)  // Recargar lista
      } catch (error) {
        console.error('Error eliminando nota:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con título y botón de nueva nota */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mis Notas</h1>
        <button
          onClick={handleCreateNote}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Crear nueva nota"
        >
          Nueva Nota
        </button>
      </div>

      {/* Barra de búsqueda */}
      <SearchBar onSearch={handleSearch} placeholder="Buscar notas..." />

      {/* Mostrar errores si los hay */}
      {error && <ErrorMessage message={error} />}

      {/* Renderizado condicional basado en el estado */}
      {loading ? (
        // Mostrar spinner mientras carga
        <LoadingSpinner />
      ) : notes.length === 0 ? (
        // Mostrar mensaje cuando no hay notas
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No se encontraron notas' : 'No tienes notas aún'}
          </p>
          {/* Botón para crear primera nota (solo si no hay búsqueda activa) */}
          {!searchTerm && (
            <button
              onClick={handleCreateNote}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Crear tu primera nota
            </button>
          )}
        </div>
      ) : (
        // Mostrar lista de notas y paginación
        <>
          <NotesList
            notes={notes}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Modal para crear/editar nota (renderizado condicional) */}
      {showModal && (
        <NoteModal
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default NotesPage
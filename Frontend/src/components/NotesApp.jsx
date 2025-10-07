// Componente principal para la gestión de notas
import { useState, useEffect, useCallback, useMemo } from 'react'  // Hooks de React
import { notesAPI } from '../services/api'  // Servicio API para operaciones de notas
import NotesList from './NotesList'  // Componente lista de notas
import NoteForm from './NoteForm'  // Formulario para crear/editar notas
import Modal from './Modal'  // Componente modal reutilizable

/**
 * NotesApp - Componente principal para la gestión de notas
 * 
 * Características:
 * - Operaciones CRUD para notas
 * - Funcionalidad de búsqueda con debounce
 * - Paginación de resultados
 * - Manejo de errores y estados de carga
 * - Soporte de accesibilidad
 * - Reintentos automáticos en errores de red
 */
function NotesApp() {
  // Gestión de estado del componente
  // Estados principales de la aplicación
  const [notes, setNotes] = useState([])  // Lista de notas cargadas
  const [loading, setLoading] = useState(false)  // Estado de carga
  const [error, setError] = useState(null)  // Mensajes de error
  const [search, setSearch] = useState('')  // Término de búsqueda actual
  
  // Estados de paginación
  const [page, setPage] = useState(1)  // Página actual
  const [totalPages, setTotalPages] = useState(1)  // Total de páginas
  const [total, setTotal] = useState(0)  // Total de notas
  
  // Estados del modal y edición
  const [showModal, setShowModal] = useState(false)  // Visibilidad del modal
  const [editingNote, setEditingNote] = useState(null)  // Nota en edición (null = crear nueva)
  const [retryCount, setRetryCount] = useState(0)  // Contador de reintentos

  // Constantes de configuración
  const perPage = 10  // Notas por página
  const maxRetries = 3  // Máximo número de reintentos

  // Búsqueda con debounce para evitar demasiadas peticiones
  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      if (page !== 1) {
        setPage(1) // Reiniciar a la primera página en nueva búsqueda
      } else {
        loadNotes()
      }
    }, 300)  // Esperar 300ms después del último cambio
    
    return () => clearTimeout(timeoutId)  // Limpiar timeout anterior
  }, [search])

  // Ejecutar búsqueda debounced cuando cambia el término
  useEffect(() => {
    debouncedSearch
  }, [debouncedSearch])

  // Cargar notas cuando cambia la página
  useEffect(() => {
    loadNotes()
  }, [page])

  // Función principal para cargar notas con manejo robusto de errores
  const loadNotes = useCallback(async (showLoadingSpinner = true) => {
    try {
      // Mostrar spinner solo si se solicita (evita parpadeos en reintentos)
      if (showLoadingSpinner) {
        setLoading(true)
      }
      setError(null)  // Limpiar errores previos
      
      // Realizar petición a la API
      const data = await notesAPI.getAll(page, perPage, search)
      
      // Actualizar estados con los datos recibidos
      setNotes(data.notes || [])
      setTotalPages(data.total_pages || Math.ceil((data.total || 0) / perPage))
      setTotal(data.total || 0)
      setRetryCount(0) // Reiniciar contador de reintentos en éxito
      
    } catch (err) {
      console.error('Error cargando notas:', err)
      
      // Determinar mensaje de error basado en el tipo de error
      let errorMessage = 'Error al cargar las notas'
      if (err.response?.status === 404) {
        errorMessage = 'No se encontraron notas'
      } else if (err.response?.status >= 500) {
        errorMessage = 'Error del servidor. Inténtalo más tarde.'
      } else if (!navigator.onLine) {
        errorMessage = 'Sin conexión a internet. Verifica tu red.'
      }
      
      setError(errorMessage)
      
      // Lógica de reintentos automáticos para errores de red
      if (retryCount < maxRetries && (err.code === 'NETWORK_ERROR' || !navigator.onLine)) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          loadNotes(false)  // Reintentar sin mostrar spinner
        }, 2000 * (retryCount + 1)) // Backoff exponencial
      }
      
    } finally {
      if (showLoadingSpinner) {
        setLoading(false)
      }
    }
  }, [page, perPage, search, retryCount])

  // Manejar cambios en la búsqueda con sanitización
  const handleSearch = useCallback((searchTerm) => {
    // Sanitizar entrada de búsqueda
    const sanitizedSearch = searchTerm.trim().slice(0, 200) // Máximo 200 caracteres
    setSearch(sanitizedSearch)
    // El reinicio de página se maneja en el efecto debounced
  }, [])

  // Abrir modal para crear nueva nota
  const handleCreateNote = useCallback(() => {
    setEditingNote(null)  // Limpiar nota en edición
    setShowModal(true)    // Mostrar modal
  }, [])

  // Abrir modal para editar nota existente
  const handleEditNote = useCallback((note) => {
    // Validar datos de la nota
    if (!note || !note.id) {
      console.error('Datos de nota inválidos para edición')
      return
    }
    setEditingNote(note)  // Establecer nota a editar
    setShowModal(true)    // Mostrar modal
  }, [])

  const handleSaveNote = useCallback(async (noteData) => {
    try {
      // Validate note data
      if (!noteData.title?.trim() || !noteData.content?.trim()) {
        throw new Error('Title and content are required')
      }
      
      if (editingNote) {
        await notesAPI.update(editingNote.id, noteData)
      } else {
        await notesAPI.create(noteData)
      }
      
      setShowModal(false)
      setEditingNote(null)
      
      // Refresh notes list
      await loadNotes()
      
      // Show success message (could be implemented with toast)
      console.log(`Note ${editingNote ? 'updated' : 'created'} successfully`)
      
    } catch (err) {
      console.error('Error saving note:', err)
      
      let errorMessage = 'Failed to save note'
      if (err.response?.status === 400) {
        errorMessage = 'Invalid note data. Please check your input.'
      } else if (err.response?.status === 404 && editingNote) {
        errorMessage = 'Note not found. It may have been deleted.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    }
  }, [editingNote, loadNotes])

  const handleDeleteNote = useCallback(async (id) => {
    if (!id) {
      console.error('Invalid note ID for deletion')
      return
    }
    
    // Enhanced confirmation dialog
    const noteToDelete = notes.find(note => note.id === id)
    const confirmMessage = noteToDelete 
      ? `Are you sure you want to delete "${noteToDelete.title.slice(0, 50)}${noteToDelete.title.length > 50 ? '...' : ''}"?`
      : 'Are you sure you want to delete this note?'
    
    if (!window.confirm(confirmMessage)) {
      return
    }
    
    try {
      await notesAPI.delete(id)
      
      // Optimistic update - remove from local state immediately
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
      setTotal(prevTotal => prevTotal - 1)
      
      // Refresh to ensure consistency
      await loadNotes(false)
      
      console.log('Note deleted successfully')
      
    } catch (err) {
      console.error('Error deleting note:', err)
      
      let errorMessage = 'Failed to delete note'
      if (err.response?.status === 404) {
        errorMessage = 'Note not found. It may have already been deleted.'
      }
      
      setError(errorMessage)
      
      // Refresh notes to restore consistency
      await loadNotes(false)
    }
  }, [notes, loadNotes])

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 10000) // Clear error after 10 seconds
      
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div className="notes-app">
      <div className="notes-header">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
            aria-label="Search notes by title or content"
            maxLength={200}
            disabled={loading}
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="search-clear"
              aria-label="Clear search"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
        <button 
          onClick={handleCreateNote}
          className="btn btn-primary"
          aria-label="Create new note"
          disabled={loading}
        >
          ➕ New Note
        </button>
      </div>

      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button
            onClick={() => setError(null)}
            className="error-dismiss"
            aria-label="Dismiss error"
            type="button"
          >
            ✕
          </button>
          {retryCount > 0 && retryCount < maxRetries && (
            <div className="retry-info">
              Retrying... (Attempt {retryCount + 1}/{maxRetries})
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="loading" aria-live="polite">
          <div className="loading-spinner"></div>
          <span>Loading notes...</span>
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          {search ? (
            <>
              <p>No notes found matching "{search}"</p>
              <button 
                onClick={() => handleSearch('')}
                className="btn btn-secondary"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <p>No notes yet. Create your first note to get started!</p>
              <button 
                onClick={handleCreateNote}
                className="btn btn-primary"
              >
                Create First Note
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="notes-summary">
            <span className="notes-count">
              {search ? (
                `Found ${total} note${total !== 1 ? 's' : ''} matching "${search}"`
              ) : (
                `${total} note${total !== 1 ? 's' : ''} total`
              )}
            </span>
          </div>
          
          <NotesList 
            notes={notes}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            loading={loading}
          />
          
          {totalPages > 1 && (
            <div className="pagination" role="navigation" aria-label="Notes pagination">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="btn btn-secondary"
                aria-label="Go to previous page"
              >
                ← Previous
              </button>
              
              <div className="page-info">
                <span className="page-current">Page {page} of {totalPages}</span>
                <span className="page-items">
                  Showing {((page - 1) * perPage) + 1}-{Math.min(page * perPage, total)} of {total}
                </span>
              </div>
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="btn btn-secondary"
                aria-label="Go to next page"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <Modal 
          onClose={() => {
            setShowModal(false)
            setEditingNote(null)
          }}
          title={editingNote ? 'Edit Note' : 'Create New Note'}
        >
          <NoteForm
            note={editingNote}
            onSave={handleSaveNote}
            onCancel={() => {
              setShowModal(false)
              setEditingNote(null)
            }}
          />
        </Modal>
      )}
    </div>
  )
}

export default NotesApp
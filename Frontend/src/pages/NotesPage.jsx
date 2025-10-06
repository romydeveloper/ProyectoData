import { useState, useEffect } from 'react'
import { useNotes } from '../hooks/useNotes'
import NotesList from '../components/notes/NotesList'
import NoteModal from '../components/notes/NoteModal'
import SearchBar from '../components/ui/SearchBar'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const NotesPage = () => {
  const { notes, loading, error, pagination, loadNotes, createNote, updateNote, deleteNote } = useNotes()
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  const handleSearch = (term) => {
    setSearchTerm(term)
    loadNotes(1, pagination.limit, term)
  }

  const handlePageChange = (page) => {
    loadNotes(page, pagination.limit, searchTerm)
  }

  const handleCreateNote = () => {
    setEditingNote(null)
    setShowModal(true)
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setShowModal(true)
  }

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData)
      } else {
        await createNote(noteData)
      }
      setShowModal(false)
      loadNotes(pagination.page, pagination.limit, searchTerm)
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const handleDeleteNote = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      try {
        await deleteNote(id)
        loadNotes(pagination.page, pagination.limit, searchTerm)
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
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

      <SearchBar onSearch={handleSearch} placeholder="Buscar notas..." />

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No se encontraron notas' : 'No tienes notas aún'}
          </p>
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
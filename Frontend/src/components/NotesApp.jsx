import { useState, useEffect, useCallback, useMemo } from 'react'
import { notesAPI } from '../services/api'
import NotesList from './NotesList'
import NoteForm from './NoteForm'
import Modal from './Modal'

/**
 * NotesApp - Main component for notes management
 * 
 * Features:
 * - CRUD operations for notes
 * - Search functionality
 * - Pagination
 * - Error handling and loading states
 * - Accessibility support
 */
function NotesApp() {
  // State management
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const perPage = 10
  const maxRetries = 3

  // Memoized search debounce
  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      if (page !== 1) {
        setPage(1) // Reset to first page on new search
      } else {
        loadNotes()
      }
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    debouncedSearch
  }, [debouncedSearch])

  useEffect(() => {
    loadNotes()
  }, [page])

  const loadNotes = useCallback(async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true)
      }
      setError(null)
      
      const data = await notesAPI.getAll(page, perPage, search)
      
      setNotes(data.notes || [])
      setTotalPages(data.total_pages || Math.ceil((data.total || 0) / perPage))
      setTotal(data.total || 0)
      setRetryCount(0) // Reset retry count on success
      
    } catch (err) {
      console.error('Error loading notes:', err)
      
      // Determine error message based on error type
      let errorMessage = 'Failed to load notes'
      if (err.response?.status === 404) {
        errorMessage = 'No notes found'
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.'
      }
      
      setError(errorMessage)
      
      // Auto-retry logic for network errors
      if (retryCount < maxRetries && (err.code === 'NETWORK_ERROR' || !navigator.onLine)) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          loadNotes(false)
        }, 2000 * (retryCount + 1)) // Exponential backoff
      }
      
    } finally {
      if (showLoadingSpinner) {
        setLoading(false)
      }
    }
  }, [page, perPage, search, retryCount])

  const handleSearch = useCallback((searchTerm) => {
    // Sanitize search input
    const sanitizedSearch = searchTerm.trim().slice(0, 200) // Max 200 chars
    setSearch(sanitizedSearch)
    // Page reset is handled in the debounced effect
  }, [])

  const handleCreateNote = useCallback(() => {
    setEditingNote(null)
    setShowModal(true)
  }, [])

  const handleEditNote = useCallback((note) => {
    if (!note || !note.id) {
      console.error('Invalid note data for editing')
      return
    }
    setEditingNote(note)
    setShowModal(true)
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
// Utilidades para testing
export const mockNote = {
  id: "test-id-123",
  title: "Test Note",
  content: "This is a test note content",
  tags: ["test", "example"],
  created_at: "2024-01-01T10:00:00Z",
  updated_at: "2024-01-01T10:00:00Z",
  archived: false
}

export const mockNotes = [
  mockNote,
  {
    id: "test-id-456",
    title: "Another Test Note",
    content: "Another test content",
    tags: ["test"],
    created_at: "2024-01-01T11:00:00Z",
    updated_at: "2024-01-01T11:00:00Z",
    archived: false
  }
]

export const mockPagination = {
  page: 1,
  limit: 10,
  total: 2,
  total_pages: 1
}

// Mock para API responses
export const mockApiResponse = {
  notes: mockNotes,
  ...mockPagination
}

// Función helper para formatear fechas (misma lógica que en NoteCard)
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
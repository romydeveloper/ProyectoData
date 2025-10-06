function NoteCard({ note, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button
            onClick={() => onEdit(note)}
            className="btn btn-sm btn-secondary"
            aria-label={`Edit note: ${note.title}`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="btn btn-sm btn-danger"
            aria-label={`Delete note: ${note.title}`}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
      
      <div className="note-content">
        <p>{note.content}</p>
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="note-meta">
        <small>
          Created: {formatDate(note.created_at)}
          {note.updated_at !== note.created_at && (
            <> • Updated: {formatDate(note.updated_at)}</>
          )}
        </small>
      </div>
    </div>
  )
}

export default NoteCard
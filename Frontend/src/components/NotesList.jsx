import NoteCard from './NoteCard'

function NotesList({ notes, onEdit, onDelete }) {
  return (
    <div className="notes-list">
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default NotesList
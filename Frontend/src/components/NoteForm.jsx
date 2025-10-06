import { useState } from 'react'

function NoteForm({ note, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags?.join(', ') || ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 120) {
      newErrors.title = 'Title must be 120 characters or less'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Content must be 10000 characters or less'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const noteData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
    }
    
    onSave(noteData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`form-input ${errors.title ? 'error' : ''}`}
          maxLength={120}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <span id="title-error" className="error-text" role="alert">
            {errors.title}
          </span>
        )}
        <small className="char-count">
          {formData.title.length}/120 characters
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className={`form-textarea ${errors.content ? 'error' : ''}`}
          rows={6}
          maxLength={10000}
          aria-describedby={errors.content ? 'content-error' : undefined}
        />
        {errors.content && (
          <span id="content-error" className="error-text" role="alert">
            {errors.content}
          </span>
        )}
        <small className="char-count">
          {formData.content.length}/10000 characters
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          id="tags"
          type="text"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          className="form-input"
          placeholder="e.g. work, important, ideas"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {note ? 'Update' : 'Create'} Note
        </button>
      </div>
    </form>
  )
}

export default NoteForm
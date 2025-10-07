// Formulario para crear y editar notas con validación
import { useState } from 'react'

/**
 * Componente formulario para crear/editar notas
 * @param {Object} note - Nota a editar (null para crear nueva)
 * @param {Function} onSave - Callback al guardar nota
 * @param {Function} onCancel - Callback al cancelar
 */
function NoteForm({ note, onSave, onCancel }) {
  // Estado del formulario inicializado con datos de la nota o valores vacíos
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags?.join(', ') || ''  // Convertir array a string separado por comas
  })
  const [errors, setErrors] = useState({})  // Errores de validación

  // Función de validación del formulario
  const validateForm = () => {
    const newErrors = {}
    
    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    } else if (formData.title.length > 120) {
      newErrors.title = 'El título debe tener 120 caracteres o menos'
    }
    
    // Validar contenido
    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es requerido'
    } else if (formData.content.length > 10000) {
      newErrors.content = 'El contenido debe tener 10000 caracteres o menos'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0  // Retorna true si no hay errores
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()  // Prevenir recarga de página
    
    if (!validateForm()) return  // No continuar si hay errores
    
    // Preparar datos de la nota
    const noteData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags
        .split(',')                    // Dividir por comas
        .map(tag => tag.trim())        // Limpiar espacios
        .filter(tag => tag.length > 0) // Filtrar tags vacíos
    }
    
    onSave(noteData)  // Llamar callback con los datos
  }

  // Manejar cambios en los campos del formulario
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))  // Actualizar campo
    // Limpiar error del campo si existía
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
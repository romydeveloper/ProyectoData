// Componente modal reutilizable con accesibilidad y manejo de teclado
import { useEffect } from 'react'

/**
 * Componente Modal reutilizable
 * @param {React.ReactNode} children - Contenido del modal
 * @param {Function} onClose - Función para cerrar el modal
 */
function Modal({ children, onClose }) {
  // Configurar comportamiento del modal al montarse
  useEffect(() => {
    // Manejar tecla Escape para cerrar modal
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    // Agregar listener de teclado y bloquear scroll del body
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'  // Prevenir scroll de fondo

    // Cleanup: remover listener y restaurar scroll
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  // Manejar click en el fondo para cerrar modal
  const handleBackdropClick = (e) => {
    // Solo cerrar si se hace click en el backdrop, no en el contenido
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"          // Rol ARIA para accesibilidad
      aria-modal="true"      // Indica que es un modal
    >
      <div className="modal-content">
        {/* Botón de cerrar con accesibilidad */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        {/* Contenido dinámico del modal */}
        {children}
      </div>
    </div>
  )
}

export default Modal
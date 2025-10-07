/**
 * Componente para mostrar mensajes de error con opción de reintento
 * @param {string} message - Mensaje de error a mostrar
 * @param {Function} onRetry - Función opcional para reintentar acción
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    // Contenedor de error con estilos de alerta y accesibilidad
    <div className="bg-red-50 border border-red-200 rounded-md p-4" role="alert">
      <div className="flex items-center">
        {/* Icono de advertencia */}
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {/* Mensaje de error */}
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {/* Botón de reintento (condicional) */}
        {onRetry && (
          <div className="ml-3">
            <button
              onClick={onRetry}
              className="text-red-800 hover:text-red-900 text-sm font-medium underline"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
/**
 * Componente de indicador de carga reutilizable
 * @param {string} size - Tamaño del spinner ('small', 'medium', 'large')
 * @param {string} text - Texto a mostrar debajo del spinner
 */
const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }) => {
  // Clases CSS para diferentes tamaños del spinner
  const sizeClasses = {
    small: 'w-4 h-4',    // 16x16px
    medium: 'w-8 h-8',   // 32x32px
    large: 'w-12 h-12'   // 48x48px
  }

  return (
    // Contenedor centrado con roles de accesibilidad
    <div className="flex flex-col items-center justify-center py-8" role="status" aria-live="polite">
      {/* Spinner animado con tamaño dinámico */}
      <div className={`${sizeClasses[size]} animate-spin`}>
        {/* SVG del spinner con animación CSS */}
        <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24">
          {/* Círculo de fondo (estático) */}
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          {/* Arco que gira (animado) */}
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {/* Texto descriptivo personalizable */}
      <p className="mt-2 text-sm text-gray-600">{text}</p>
    </div>
  )
}

export default LoadingSpinner
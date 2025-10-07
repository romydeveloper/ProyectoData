// Hook personalizado para manejar el tema claro/oscuro de la aplicación
import { useState, useEffect } from 'react'

/**
 * Hook personalizado para gestionar el tema de la aplicación
 * Maneja la persistencia en localStorage y detecta preferencias del sistema
 * @returns {Object} - Objeto con estado del tema y función para cambiarlo
 */
export const useTheme = () => {
  // Estado para controlar si el tema oscuro está activo
  const [isDark, setIsDark] = useState(() => {
    // Inicialización lazy: verificar localStorage primero
    const saved = localStorage.getItem('theme')
    // Si hay tema guardado, usarlo; si no, detectar preferencia del sistema
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Efecto para sincronizar cambios de tema con localStorage y DOM
  useEffect(() => {
    // Guardar preferencia de tema en localStorage para persistencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    // Aplicar atributo data-theme al elemento raíz para CSS
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])  // Se ejecuta cada vez que cambia isDark

  // Función para alternar entre tema claro y oscuro
  const toggleTheme = () => setIsDark(!isDark)

  // Retornar estado actual y función para cambiarlo
  return { 
    isDark,      // boolean: true si tema oscuro está activo
    toggleTheme  // function: alterna entre temas
  }
}
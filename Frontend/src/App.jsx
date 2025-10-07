
// Importaciones necesarias para el componente principal


import { useState } from 'react'  // Hook para manejar estado de pestañas
import NotesApp from './components/NotesApp'  // Componente de gestión de notas
import ExternalAPI from './components/ExternalAPI'  // Componente de integración con PokéAPI
import { useTheme } from './hooks/useTheme'  // Hook personalizado para tema claro/oscuro
import './App.css'  // Estilos de la aplicación

// Componente principal que organiza toda la aplicación
function App() {
  // Estado para controlar qué pestaña está activa ('notes' o 'external')
  const [activeTab, setActiveTab] = useState('notes')
  // Hook para manejar el cambio de tema claro/oscuro
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="app">
      {/* Encabezado principal con título y botón de tema */}
      <header className="app-header">
        <div className="header-content">
          <h1>📝 Aplicación de Notas</h1>
          {/* Botón para alternar entre tema claro y oscuro */}
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        {/* Navegación con pestañas */}
        <nav className="nav-tabs">
          {/* Pestaña de Mis Notas */}
          <button 
            className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Mis Notas
          </button>
          {/* Pestaña de Pokémon API */}
          <button 
            className={`tab ${activeTab === 'external' ? 'active' : ''}`}
            onClick={() => setActiveTab('external')}
          >
            Pokémon API
          </button>
        </nav>
      </header>
      
      {/* Contenido principal que cambia según la pestaña activa */}
      <main className="app-main">
        {/* Renderizado condicional: muestra NotesApp si la pestaña activa es 'notes' */}
        {activeTab === 'notes' && <NotesApp />}
        {/* Renderizado condicional: muestra ExternalAPI si la pestaña activa es 'external' */}
        {activeTab === 'external' && <ExternalAPI />}
      </main>
    </div>
  )
}

export default App
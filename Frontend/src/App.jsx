import { useState } from 'react'
import NotesApp from './components/NotesApp'
import ExternalAPI from './components/ExternalAPI'
import { useTheme } from './hooks/useTheme'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('notes')
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📝 Aplicación de Notas</h1>
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <nav className="nav-tabs">
          <button 
            className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Mis Notas
          </button>
          <button 
            className={`tab ${activeTab === 'external' ? 'active' : ''}`}
            onClick={() => setActiveTab('external')}
          >
            Pokémon API
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {activeTab === 'notes' && <NotesApp />}
        {activeTab === 'external' && <ExternalAPI />}
      </main>
    </div>
  )
}

export default App
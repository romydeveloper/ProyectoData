// Componente para demostrar integración con API externa (PokéAPI)
import { useState, useEffect } from 'react'  // Hooks de React
import { pokemonApi } from '../services/externalApi'  // Servicio para consumir PokéAPI

// Componente que muestra datos de Pokémon desde una API externa
function ExternalAPI() {
  // Estados del componente
  const [pokemon, setPokemon] = useState([])  // Lista básica de Pokémon
  const [pokemonDetails, setPokemonDetails] = useState({})  // Detalles cargados por demanda
  const [loading, setLoading] = useState(false)  // Estado de carga
  const [error, setError] = useState(null)  // Errores de la API
  const [page, setPage] = useState(0)  // Página actual (basada en 0)
  const [limit] = useState(20)  // Pokémon por página

  // Cargar Pokémon cuando cambia la página
  useEffect(() => {
    loadPokemon()
  }, [page])

  // Función principal para cargar lista de Pokémon
  const loadPokemon = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Obtener lista básica de Pokémon con paginación
      const data = await pokemonApi.getPokemon(limit, page * limit)
      setPokemon(data.results || [])
      
      // Cargar detalles de los primeros 6 Pokémon para mejor UX
      const detailsPromises = data.results.slice(0, 6).map(async (poke) => {
        try {
          const details = await pokemonApi.getPokemonDetails(poke.name)
          return { name: poke.name, details }
        } catch (err) {
          console.error(`Error cargando ${poke.name}:`, err)
          return { name: poke.name, details: null }
        }
      })
      
      // Procesar resultados y crear mapa de detalles
      const detailsResults = await Promise.all(detailsPromises)
      const detailsMap = {}
      detailsResults.forEach(({ name, details }) => {
        if (details) detailsMap[name] = details
      })
      setPokemonDetails(detailsMap)
    } catch (err) {
      setError('Error cargando datos de Pokémon')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadPokemonDetails = async (pokemonName) => {
    if (pokemonDetails[pokemonName]) return
    
    try {
      const details = await pokemonApi.getPokemonDetails(pokemonName)
      setPokemonDetails(prev => ({ ...prev, [pokemonName]: details }))
    } catch (err) {
      console.error(`Error loading ${pokemonName}:`, err)
    }
  }

  if (loading) {
    return <div className="loading" aria-live="polite">Loading Pokémon...</div>
  }

  if (error) {
    return (
      <div className="error-message" role="alert">
        {error}
        <button onClick={loadPokemon} className="btn btn-secondary">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="external-api">
      <div className="external-header">
        <h2>Pokémon Data (PokéAPI)</h2>
        <div className="pagination-controls">
          <button 
            onClick={() => setPage(Math.max(0, page - 1))} 
            disabled={page === 0 || loading}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span>Page {page + 1}</span>
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={loading}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      </div>

      <div className="pokemon-grid">
        {pokemon.map((poke, index) => {
          const details = pokemonDetails[poke.name]
          return (
            <div key={poke.name} className="pokemon-card" onClick={() => loadPokemonDetails(poke.name)}>
              <div className="pokemon-header">
                <h3 className="pokemon-name">{poke.name}</h3>
                <span className="pokemon-id">#{(page * limit) + index + 1}</span>
              </div>
              {details && (
                <div className="pokemon-details">
                  {details.sprites?.front_default && (
                    <img 
                      src={details.sprites.front_default} 
                      alt={poke.name}
                      className="pokemon-sprite"
                    />
                  )}
                  <div className="pokemon-info">
                    <p><strong>Height:</strong> {details.height / 10} m</p>
                    <p><strong>Weight:</strong> {details.weight / 10} kg</p>
                    <div className="pokemon-types">
                      <strong>Types:</strong>
                      {details.types?.map(type => (
                        <span key={type.type.name} className="type-badge">
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {!details && (
                <p className="click-to-load">Click to load details</p>
              )}
            </div>
          )
        })}
      </div>

      {pokemon.length === 0 && !loading && (
        <div className="empty-state">
          <p>No Pokémon found.</p>
        </div>
      )}
    </div>
  )
}

export default ExternalAPI
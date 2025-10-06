import { useState, useEffect } from 'react'
import { pokemonApi } from '../services/externalApi'

function ExternalAPI() {
  const [pokemon, setPokemon] = useState([])
  const [pokemonDetails, setPokemonDetails] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [limit] = useState(20)

  useEffect(() => {
    loadPokemon()
  }, [page])

  const loadPokemon = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await pokemonApi.getPokemon(limit, page * limit)
      setPokemon(data.results || [])
      
      // Load details for first few pokemon
      const detailsPromises = data.results.slice(0, 6).map(async (poke) => {
        try {
          const details = await pokemonApi.getPokemonDetails(poke.name)
          return { name: poke.name, details }
        } catch (err) {
          console.error(`Error loading ${poke.name}:`, err)
          return { name: poke.name, details: null }
        }
      })
      
      const detailsResults = await Promise.all(detailsPromises)
      const detailsMap = {}
      detailsResults.forEach(({ name, details }) => {
        if (details) detailsMap[name] = details
      })
      setPokemonDetails(detailsMap)
    } catch (err) {
      setError('Error loading Pokémon data')
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
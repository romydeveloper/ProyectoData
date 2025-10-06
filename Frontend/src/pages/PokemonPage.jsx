import { useState, useEffect } from 'react'
import { pokemonApi } from '../services/externalApi'
import PokemonCard from '../components/external/PokemonCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

const PokemonPage = () => {
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [types, setTypes] = useState([])
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('id')

  useEffect(() => {
    loadTypes()
    loadPokemon()
  }, [])

  useEffect(() => {
    if (selectedType) {
      loadPokemonByType()
    } else {
      loadPokemon()
    }
  }, [selectedType])

  const loadTypes = async () => {
    try {
      const data = await pokemonApi.getPokemonTypes()
      setTypes(data.results)
    } catch (err) {
      console.error('Error loading types:', err)
    }
  }

  const loadPokemon = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await pokemonApi.getPokemon(20, 0)
      const pokemonWithDetails = await Promise.all(
        data.results.map(async (p) => {
          const details = await pokemonApi.getPokemonDetails(p.name)
          return details
        })
      )
      setPokemon(pokemonWithDetails)
    } catch (err) {
      setError('Error al cargar los Pokémon')
    } finally {
      setLoading(false)
    }
  }

  const loadPokemonByType = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await pokemonApi.getPokemonByType(selectedType)
      const pokemonWithDetails = await Promise.all(
        data.pokemon.slice(0, 20).map(async (p) => {
          const details = await pokemonApi.getPokemonDetails(p.pokemon.name)
          return details
        })
      )
      setPokemon(pokemonWithDetails)
    } catch (err) {
      setError('Error al cargar los Pokémon por tipo')
    } finally {
      setLoading(false)
    }
  }

  const sortedPokemon = [...pokemon].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'height':
        return b.height - a.height
      case 'weight':
        return b.weight - a.weight
      default:
        return a.id - b.id
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Pokédex</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por tipo:
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los tipos</option>
            {types.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="id">ID</option>
            <option value="name">Nombre</option>
            <option value="height">Altura</option>
            <option value="weight">Peso</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedPokemon.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PokemonPage
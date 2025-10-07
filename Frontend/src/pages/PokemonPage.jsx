// Página para mostrar información de Pokémon usando la PokéAPI
import { useState, useEffect } from 'react'  // Hooks de React para estado y efectos
import { pokemonApi } from '../services/externalApi'  // Servicio para consumir PokéAPI
import PokemonCard from '../components/external/PokemonCard'  // Componente para mostrar cada Pokémon
import LoadingSpinner from '../components/ui/LoadingSpinner'  // Indicador de carga
import ErrorMessage from '../components/ui/ErrorMessage'  // Componente para mostrar errores

// Componente principal de la página de Pokémon
const PokemonPage = () => {
  // Estados del componente
  const [pokemon, setPokemon] = useState([])  // Lista de Pokémon cargados
  const [loading, setLoading] = useState(false)  // Estado de carga
  const [error, setError] = useState(null)  // Errores de la API
  const [types, setTypes] = useState([])  // Lista de tipos de Pokémon disponibles
  const [selectedType, setSelectedType] = useState('')  // Tipo seleccionado para filtrar
  const [sortBy, setSortBy] = useState('id')  // Criterio de ordenamiento

  // Cargar tipos y Pokémon al montar el componente
  useEffect(() => {
    loadTypes()    // Cargar lista de tipos
    loadPokemon()  // Cargar Pokémon iniciales
  }, [])

  // Recargar Pokémon cuando cambia el tipo seleccionado
  useEffect(() => {
    if (selectedType) {
      loadPokemonByType()  // Cargar por tipo específico
    } else {
      loadPokemon()        // Cargar todos los Pokémon
    }
  }, [selectedType])

  // Cargar lista de tipos de Pokémon disponibles
  const loadTypes = async () => {
    try {
      const data = await pokemonApi.getPokemonTypes()
      setTypes(data.results)
    } catch (err) {
      console.error('Error cargando tipos:', err)
    }
  }

  // Cargar Pokémon generales (primeros 20)
  const loadPokemon = async () => {
    setLoading(true)
    setError(null)
    try {
      // Obtener lista básica de Pokémon
      const data = await pokemonApi.getPokemon(20, 0)
      // Cargar detalles completos de cada Pokémon en paralelo
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

  // Cargar Pokémon filtrados por tipo
  const loadPokemonByType = async () => {
    setLoading(true)
    setError(null)
    try {
      // Obtener Pokémon del tipo seleccionado
      const data = await pokemonApi.getPokemonByType(selectedType)
      // Limitar a 20 y cargar detalles completos
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

  // Ordenar Pokémon según el criterio seleccionado
  const sortedPokemon = [...pokemon].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)  // Orden alfabético
      case 'height':
        return b.height - a.height  // Mayor a menor altura
      case 'weight':
        return b.weight - a.weight  // Mayor a menor peso
      default:
        return a.id - b.id  // Por ID (orden numérico)
    }
  })

  return (
    <div className="space-y-6">
      {/* Encabezado de la página */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Pokédex</h1>
      </div>

      {/* Controles de filtro y ordenamiento */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Filtro por tipo */}
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
            {/* Renderizar opciones de tipos dinámicamente */}
            {types.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de ordenamiento */}
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

      {/* Mostrar errores si los hay */}
      {error && <ErrorMessage message={error} />}

      {/* Renderizado condicional: loading o grid de Pokémon */}
      {loading ? (
        // Mostrar spinner mientras carga
        <LoadingSpinner />
      ) : (
        // Grid responsivo de tarjetas de Pokémon
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
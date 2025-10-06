const PokemonCard = ({ pokemon }) => {
  const getTypeColor = (type) => {
    const colors = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300'
    }
    return colors[type] || 'bg-gray-400'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-center">
        <div className="relative mb-4">
          <img
            src={pokemon.sprites?.front_default || '/placeholder-pokemon.png'}
            alt={`Imagen de ${pokemon.name}`}
            className="w-24 h-24 mx-auto object-contain"
            onError={(e) => {
              e.target.src = '/placeholder-pokemon.png'
            }}
          />
          <span className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2">
          {pokemon.name}
        </h3>

        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {pokemon.types?.map((typeInfo) => (
            <span
              key={typeInfo.type.name}
              className={`${getTypeColor(typeInfo.type.name)} text-white text-xs px-2 py-1 rounded-full capitalize`}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium">Altura</p>
            <p>{(pokemon.height / 10).toFixed(1)} m</p>
          </div>
          <div>
            <p className="font-medium">Peso</p>
            <p>{(pokemon.weight / 10).toFixed(1)} kg</p>
          </div>
        </div>

        {pokemon.abilities && pokemon.abilities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Habilidades:</p>
            <div className="flex flex-wrap justify-center gap-1">
              {pokemon.abilities.map((abilityInfo, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded capitalize"
                >
                  {abilityInfo.ability.name.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {pokemon.stats && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Estadísticas base:</p>
            <div className="space-y-1">
              {pokemon.stats.slice(0, 3).map((statInfo) => (
                <div key={statInfo.stat.name} className="flex justify-between text-xs">
                  <span className="capitalize">{statInfo.stat.name.replace('-', ' ')}:</span>
                  <span className="font-medium">{statInfo.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PokemonCard
// Servicio para API externa - usando PokéAPI como ejemplo
import axios from 'axios';

const POKEMON_API_BASE = import.meta.env.VITE_POKEMON_API_BASE_URL || 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  // Obtener lista de pokémon con paginación
  getPokemon: async (limit = 20, offset = 0) => {
    const response = await axios.get(`${POKEMON_API_BASE}/pokemon`, {
      params: { limit, offset }
    });
    return response.data;
  },

  // Obtener detalles de un pokémon específico
  getPokemonDetails: async (nameOrId) => {
    const response = await axios.get(`${POKEMON_API_BASE}/pokemon/${nameOrId}`);
    return response.data;
  },

  // Obtener tipos de pokémon para filtros
  getPokemonTypes: async () => {
    const response = await axios.get(`${POKEMON_API_BASE}/type`);
    return response.data;
  },

  // Obtener pokémon por tipo
  getPokemonByType: async (type) => {
    const response = await axios.get(`${POKEMON_API_BASE}/type/${type}`);
    return response.data;
  },
};
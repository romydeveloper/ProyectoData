// Servicio para conectar con el backend de notas
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesApi = {
  // Obtener todas las notas con paginación y búsqueda
  getNotes: async (page = 1, limit = 10, search = '') => {
    const params = { page, limit };
    if (search) params.search = search;
    
    const response = await api.get('/notes', { params });
    return response.data;
  },

  // Obtener una nota por ID
  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Crear nueva nota
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  // Actualizar nota
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Eliminar nota
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};
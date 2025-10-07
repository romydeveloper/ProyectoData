/**
 * Módulo de Servicios API
 * 
 * Me proporciona configuración de cliente HTTP y métodos API para:
 * - Operaciones CRUD de notas
 * - Integración con API externa
 * - Manejo de errores e interceptores de petición/respuesta
 */

import axios from 'axios'

// Configuración de URLs y timeouts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const EXTERNAL_API_URL = import.meta.env.VITE_EXTERNAL_API_URL || 'https://jsonplaceholder.typicode.com'
const REQUEST_TIMEOUT = 10000 // 10 segundos

// Crea instancias de axios con diferentes configuraciones
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

const externalClient = axios.create({
  baseURL: EXTERNAL_API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Accept': 'application/json'
  }
})

// Interceptor de peticiones para el cliente API
apiClient.interceptors.request.use(
  (config) => {
    // Agregar timestamp de petición para debugging
    config.metadata = { startTime: new Date() }
    console.log(`Petición API: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Error en interceptor de petición:', error)
    return Promise.reject(error)
  }
)

// Interceptor de respuestas para el cliente API
apiClient.interceptors.response.use(
  (response) => {
    // Registrar tiempo de respuesta
    const endTime = new Date()
    const duration = endTime - response.config.metadata.startTime
    console.log(`Respuesta API: ${response.status} ${response.config.url} (${duration}ms)`)
    return response
  },
  (error) => {
    // Manejo mejorado de errores
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method
    }
    
    console.error('Error API:', errorInfo)
    
    // Transformar error para mejor manejo
    if (error.code === 'ECONNABORTED') {
      error.message = 'Tiempo de espera agotado. Inténtalo de nuevo.'
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Error de red. Verifica tu conexión.'
    } else if (error.response?.status >= 500) {
      error.message = 'Error del servidor. Inténtalo más tarde.'
    } else if (error.response?.status === 404) {
      error.message = 'Recurso no encontrado.'
    } else if (error.response?.status === 400) {
      error.message = error.response.data?.detail || 'Datos de petición inválidos.'
    }
    
    return Promise.reject(error)
  }
)

// Función utilitaria para validar datos de nota
const validateNoteData = (note) => {
  const errors = []
  
  if (!note.title || typeof note.title !== 'string' || !note.title.trim()) {
    errors.push('El título es requerido')
  } else if (note.title.length > 120) {
    errors.push('El título debe tener 120 caracteres o menos')
  }
  
  if (!note.content || typeof note.content !== 'string' || !note.content.trim()) {
    errors.push('El contenido es requerido')
  } else if (note.content.length > 10000) {
    errors.push('El contenido debe tener 10,000 caracteres o menos')
  }
  
  if (note.tags && !Array.isArray(note.tags)) {
    errors.push('Las etiquetas deben ser un array')
  }
  
  if (errors.length > 0) {
    throw new Error(`Validación fallida: ${errors.join(', ')}`)
  }
}

// API de notas con manejo mejorado de errores y validación
export const notesAPI = {
  /**
   * Obtener todas las notas con paginación y búsqueda
   * @param {number} page - Número de página (basado en 1)
   * @param {number} perPage - Elementos por página
   * @param {string} search - Término de búsqueda
   * @param {boolean} archived - Filtrar por estado archivado
   * @returns {Promise<Object>} Respuesta con lista de notas
   */
  async getAll(page = 1, perPage = 10, search = '', archived = null) {
    try {
      const params = new URLSearchParams({
        page: Math.max(1, parseInt(page) || 1),
        per_page: Math.min(100, Math.max(1, parseInt(perPage) || 10))
      })
      
      if (search && typeof search === 'string' && search.trim()) {
        params.append('search', search.trim().slice(0, 200))
      }
      
      if (archived !== null) {
        params.append('archived', Boolean(archived))
      }
      
      const response = await apiClient.get(`/notes?${params}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch notes:', error)
      throw error
    }
  },

  /**
   * Get a specific note by ID
   * @param {string} id - Note ID
   * @returns {Promise<Object>} Note data
   */
  async getById(id) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid note ID is required')
      }
      
      const response = await apiClient.get(`/notes/${encodeURIComponent(id)}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch note ${id}:`, error)
      throw error
    }
  },

  /**
   * Create a new note
   * @param {Object} note - Note data
   * @returns {Promise<Object>} Created note data
   */
  async create(note) {
    try {
      // Validate note data
      validateNoteData(note)
      
      // Clean and prepare data
      const noteData = {
        title: note.title.trim(),
        content: note.content.trim(),
        tags: Array.isArray(note.tags) 
          ? note.tags.filter(tag => tag && typeof tag === 'string' && tag.trim())
                    .map(tag => tag.trim().slice(0, 50))
                    .slice(0, 50) // Max 50 tags
          : []
      }
      
      const response = await apiClient.post('/notes', noteData)
      return response.data
    } catch (error) {
      console.error('Failed to create note:', error)
      throw error
    }
  },

  /**
   * Update an existing note
   * @param {string} id - Note ID
   * @param {Object} note - Updated note data
   * @returns {Promise<Object>} Updated note data
   */
  async update(id, note) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid note ID is required')
      }
      
      // Validate note data (partial validation for updates)
      const updateData = {}
      
      if (note.title !== undefined) {
        if (!note.title || typeof note.title !== 'string' || !note.title.trim()) {
          throw new Error('Title cannot be empty')
        }
        if (note.title.length > 120) {
          throw new Error('Title must be 120 characters or less')
        }
        updateData.title = note.title.trim()
      }
      
      if (note.content !== undefined) {
        if (!note.content || typeof note.content !== 'string' || !note.content.trim()) {
          throw new Error('Content cannot be empty')
        }
        if (note.content.length > 10000) {
          throw new Error('Content must be 10,000 characters or less')
        }
        updateData.content = note.content.trim()
      }
      
      if (note.tags !== undefined) {
        if (!Array.isArray(note.tags)) {
          throw new Error('Tags must be an array')
        }
        updateData.tags = note.tags
          .filter(tag => tag && typeof tag === 'string' && tag.trim())
          .map(tag => tag.trim().slice(0, 50))
          .slice(0, 50)
      }
      
      if (note.archived !== undefined) {
        updateData.archived = Boolean(note.archived)
      }
      
      const response = await apiClient.put(`/notes/${encodeURIComponent(id)}`, updateData)
      return response.data
    } catch (error) {
      console.error(`Failed to update note ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete a note
   * @param {string} id - Note ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Valid note ID is required')
      }
      
      await apiClient.delete(`/notes/${encodeURIComponent(id)}`)
    } catch (error) {
      console.error(`Failed to delete note ${id}:`, error)
      throw error
    }
  },

  /**
   * Check API health
   * @returns {Promise<Object>} Health status
   */
  async health() {
    try {
      const response = await apiClient.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }
}

// External API with caching and error handling
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const externalAPI = {
  /**
   * Get posts from external API with caching
   * @returns {Promise<Array>} Posts array
   */
  async getPosts() {
    const cacheKey = 'posts'
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached posts')
      return cached.data
    }
    
    try {
      const response = await externalClient.get('/posts')
      const posts = response.data || []
      
      // Cache the result
      cache.set(cacheKey, {
        data: posts,
        timestamp: Date.now()
      })
      
      return posts
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log('Returning expired cached posts due to error')
        return cached.data
      }
      
      throw error
    }
  },

  /**
   * Get users from external API with caching
   * @returns {Promise<Array>} Users array
   */
  async getUsers() {
    const cacheKey = 'users'
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached users')
      return cached.data
    }
    
    try {
      const response = await externalClient.get('/users')
      const users = response.data || []
      
      // Cache the result
      cache.set(cacheKey, {
        data: users,
        timestamp: Date.now()
      })
      
      return users
    } catch (error) {
      console.error('Failed to fetch users:', error)
      
      // Return cached data if available, even if expired
      if (cached) {
        console.log('Returning expired cached users due to error')
        return cached.data
      }
      
      throw error
    }
  },

  /**
   * Clear cache
   */
  clearCache() {
    cache.clear()
    console.log('External API cache cleared')
  }
}

// Export axios instances for advanced usage
export { apiClient, externalClient }
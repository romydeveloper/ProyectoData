/**
 * API Service Module
 * 
 * Provides HTTP client configuration and API methods for:
 * - Notes CRUD operations
 * - External API integration
 * - Error handling and request/response interceptors
 */

import axios from 'axios'

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const EXTERNAL_API_URL = import.meta.env.VITE_EXTERNAL_API_URL || 'https://jsonplaceholder.typicode.com'
const REQUEST_TIMEOUT = 10000 // 10 seconds

// Create axios instances with different configurations
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

// Request interceptor for API client
apiClient.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for API client
apiClient.interceptors.response.use(
  (response) => {
    // Log response time
    const endTime = new Date()
    const duration = endTime - response.config.metadata.startTime
    console.log(`API Response: ${response.status} ${response.config.url} (${duration}ms)`)
    return response
  },
  (error) => {
    // Enhanced error handling
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method
    }
    
    console.error('API Error:', errorInfo)
    
    // Transform error for better handling
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.'
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your connection.'
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.'
    } else if (error.response?.status === 404) {
      error.message = 'Resource not found.'
    } else if (error.response?.status === 400) {
      error.message = error.response.data?.detail || 'Invalid request data.'
    }
    
    return Promise.reject(error)
  }
)

// Utility function to validate note data
const validateNoteData = (note) => {
  const errors = []
  
  if (!note.title || typeof note.title !== 'string' || !note.title.trim()) {
    errors.push('Title is required')
  } else if (note.title.length > 120) {
    errors.push('Title must be 120 characters or less')
  }
  
  if (!note.content || typeof note.content !== 'string' || !note.content.trim()) {
    errors.push('Content is required')
  } else if (note.content.length > 10000) {
    errors.push('Content must be 10,000 characters or less')
  }
  
  if (note.tags && !Array.isArray(note.tags)) {
    errors.push('Tags must be an array')
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`)
  }
}

// Notes API with enhanced error handling and validation
export const notesAPI = {
  /**
   * Get all notes with pagination and search
   * @param {number} page - Page number (1-based)
   * @param {number} perPage - Items per page
   * @param {string} search - Search term
   * @param {boolean} archived - Filter by archived status
   * @returns {Promise<Object>} Notes list response
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
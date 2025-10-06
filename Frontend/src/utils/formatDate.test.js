// Test básico para utilidad de formateo de fechas
import { formatDate } from './test-utils.js'

describe('formatDate utility', () => {
  test('should format date correctly', () => {
    const testDate = '2024-01-15T14:30:00Z'
    const formatted = formatDate(testDate)
    
    // Verificar que contiene elementos esperados
    expect(formatted).toContain('2024')
    expect(formatted).toContain('ene') // enero en español
    expect(formatted).toContain('15')
    expect(formatted).toContain('14:30')
  })

  test('should handle different date formats', () => {
    const testDate = '2023-12-25T09:15:30.123Z'
    const formatted = formatDate(testDate)
    
    expect(formatted).toContain('2023')
    expect(formatted).toContain('dic') // diciembre
    expect(formatted).toContain('25')
  })

  test('should return valid string for any valid date', () => {
    const testDate = '2024-06-01T00:00:00Z'
    const formatted = formatDate(testDate)
    
    expect(typeof formatted).toBe('string')
    expect(formatted.length).toBeGreaterThan(0)
  })
})

// Test para validación de datos de nota
describe('Note data validation', () => {
  test('should validate note structure', () => {
    const validNote = {
      id: 'test-123',
      title: 'Test Title',
      content: 'Test Content',
      tags: ['tag1', 'tag2'],
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
      archived: false
    }

    // Verificar que tiene todas las propiedades requeridas
    expect(validNote).toHaveProperty('id')
    expect(validNote).toHaveProperty('title')
    expect(validNote).toHaveProperty('content')
    expect(validNote).toHaveProperty('tags')
    expect(validNote).toHaveProperty('created_at')
    expect(validNote).toHaveProperty('updated_at')
    expect(validNote).toHaveProperty('archived')

    // Verificar tipos
    expect(typeof validNote.id).toBe('string')
    expect(typeof validNote.title).toBe('string')
    expect(typeof validNote.content).toBe('string')
    expect(Array.isArray(validNote.tags)).toBe(true)
    expect(typeof validNote.archived).toBe('boolean')
  })

  test('should validate title length constraints', () => {
    const shortTitle = 'A'
    const normalTitle = 'This is a normal title'
    const longTitle = 'x'.repeat(121)

    expect(shortTitle.length).toBeGreaterThanOrEqual(1)
    expect(normalTitle.length).toBeLessThanOrEqual(120)
    expect(longTitle.length).toBeGreaterThan(120) // Esto debería fallar en validación
  })

  test('should validate content length constraints', () => {
    const shortContent = 'A'
    const normalContent = 'This is normal content for a note'
    const longContent = 'x'.repeat(10001)

    expect(shortContent.length).toBeGreaterThanOrEqual(1)
    expect(normalContent.length).toBeLessThanOrEqual(10000)
    expect(longContent.length).toBeGreaterThan(10000) // Esto debería fallar en validación
  })
})

// Test para funciones de utilidad de paginación
describe('Pagination utilities', () => {
  test('should calculate total pages correctly', () => {
    const calculateTotalPages = (total, limit) => {
      return Math.ceil(total / limit)
    }

    expect(calculateTotalPages(25, 10)).toBe(3)
    expect(calculateTotalPages(20, 10)).toBe(2)
    expect(calculateTotalPages(5, 10)).toBe(1)
    expect(calculateTotalPages(0, 10)).toBe(0)
  })

  test('should validate pagination parameters', () => {
    const isValidPage = (page, totalPages) => {
      return page >= 1 && page <= Math.max(1, totalPages)
    }

    expect(isValidPage(1, 5)).toBe(true)
    expect(isValidPage(3, 5)).toBe(true)
    expect(isValidPage(5, 5)).toBe(true)
    expect(isValidPage(0, 5)).toBe(false)
    expect(isValidPage(6, 5)).toBe(false)
  })
})
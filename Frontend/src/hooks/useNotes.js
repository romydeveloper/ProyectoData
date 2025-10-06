// Hook personalizado para manejar el estado de las notas
import { useState, useEffect } from 'react';
import { notesApi } from '../services/notesApi';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  });

  // Cargar notas
  const loadNotes = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await notesApi.getNotes(page, limit, search);
      setNotes(data.notes);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        total_pages: data.total_pages
      });
    } catch (err) {
      setError('Error al cargar las notas');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nota
  const createNote = async (noteData) => {
    try {
      const newNote = await notesApi.createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError('Error al crear la nota');
      throw err;
    }
  };

  // Actualizar nota
  const updateNote = async (id, noteData) => {
    try {
      const updatedNote = await notesApi.updateNote(id, noteData);
      setNotes(prev => prev.map(note => 
        note.id === id ? updatedNote : note
      ));
      return updatedNote;
    } catch (err) {
      setError('Error al actualizar la nota');
      throw err;
    }
  };

  // Eliminar nota
  const deleteNote = async (id) => {
    try {
      await notesApi.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      setError('Error al eliminar la nota');
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    pagination,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    setError
  };
};
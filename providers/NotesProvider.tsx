import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "@/types/note";

const NOTES_KEY = "@olive:notes";

export const [NotesProvider, useNotes] = createContextHook(() => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      if (data) {
        setNotes(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotes = useCallback(async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  }, []);

  const addNote = useCallback((note: Note) => {
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const deleteNote = useCallback((id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const getNoteById = useCallback((id: string) => {
    return notes.find((note) => note.id === id);
  }, [notes]);

  const getNotesbyCategory = useCallback((category: string) => {
    return notes.filter((note) => 
      note.category.toLowerCase() === category.toLowerCase()
    );
  }, [notes]);

  const toggleNoteCompletion = useCallback((id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) {
      const updatedNotes = notes.map((n) =>
        n.id === id ? { ...n, completed: !n.completed, updatedAt: new Date().toISOString() } : n
      );
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    }
  }, [notes, saveNotes]);

  return useMemo(() => ({
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNotesbyCategory,
    toggleNoteCompletion,
  }), [notes, isLoading, addNote, updateNote, deleteNote, getNoteById, getNotesbyCategory, toggleNoteCompletion]);
});
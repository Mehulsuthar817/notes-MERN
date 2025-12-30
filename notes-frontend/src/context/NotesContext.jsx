import { createContext, useContext, useEffect, useState } from "react";
import { getNotes, addNote as apiAddNote, updateNote, deleteNote as apiDeleteNote } from "../api/notesAPI";

const NotesContext = createContext();

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await getNotes();
            setNotes(res.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    const addNoteToContext = async (content) => {
        try {
            const res = await apiAddNote(content);
            const newNote = { ...res.data, id: res.data._id };
            setNotes(prev => [newNote, ...prev]);
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    const deleteNoteFromContext = async (id) => {
        try {
            await apiDeleteNote(id);
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const editNoteInContext = async (id, newContent) => {
        try {
            await updateNote(id, newContent);
            setNotes(prev =>
                prev.map(n =>
                    n.id === id
                        ? { ...n, content: newContent, updatedAt: Date.now() }
                        : n
                )
            );
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    return (
        <NotesContext.Provider value={{ notes, loading, addNote: addNoteToContext, deleteNote: deleteNoteFromContext, editNote: editNoteInContext, fetchNotes }}>
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes(){
    return useContext(NotesContext);
}


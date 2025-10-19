// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api/notes"; // backend endpoint

// Fetch all notes (with optional search)
export const fetchNotes = async (search = "") => {
    return await axios.get(API_BASE, { params: { search } });
};

// Add a new note
export const addNote = async (noteData) => {
    return await axios.post(API_BASE, noteData);
};

// Delete a note by ID
export const deleteNote = async (id) => {
    return await axios.delete(`${API_BASE}/${id}`);
};

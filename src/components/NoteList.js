// src/components/NoteList.js
import React, { useState } from "react";
import { deleteNote } from "../api";

const NoteList = ({ notes, setNotes, loadNotes }) => {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            setDeletingId(id);
            await deleteNote(id);
            setNotes(notes.filter((note) => note._id !== id));
            loadNotes();
        } catch (err) {
            console.error("Error deleting note:", err);
            alert("Failed to delete note.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            {notes.length === 0 ? (
                <p>No notes found.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {notes.map((note) => (
                        <li
                            key={note._id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px",
                                marginBottom: "10px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <h3>{note.title}</h3>
                            <p>{note.content}</p>
                            {note.tags && <p><strong>Tags:</strong> {note.tags.join(", ")}</p>}
                            <button
                                onClick={() => handleDelete(note._id)}
                                disabled={deletingId === note._id}
                                style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#555",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                {deletingId === note._id ? "Deleting..." : "Delete"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NoteList;

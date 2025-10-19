// src/components/NoteForm.js
import React, { useState } from "react";
import { addNote } from "../api";

const NoteForm = ({ onNoteAdded, loadNotes }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        const noteData = {
            title,
            content,
            tags: tags.split(",").map((tag) => tag.trim()),
        };

        try {
            setLoading(true);
            const res = await addNote(noteData);
            onNoteAdded(res.data);
            setTitle("");
            setContent("");
            setTags("");
            loadNotes();
        } catch (err) {
            console.error("Error adding note:", err);
            alert("Failed to add note.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                required
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                required
            />
            <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#FF0000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {loading ? "Adding..." : "Add Note"}
            </button>
        </form>
    );
};

export default NoteForm;

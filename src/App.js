// src/App.js
import React, { useEffect, useState } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { fetchNotes } from "./api"; // Backend API for notes
import { initClient, signIn, signOut, fetchMyVideos } from "./YoutubeAPI"; // YouTube API

function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [userSignedIn, setUserSignedIn] = useState(false);

  // Initialize Google API
  useEffect(() => {
    const initializeGAPI = async () => {
      try {
        await initClient();
      } catch (err) {
        console.error("GAPI initialization error:", err);
        alert("Failed to initialize YouTube API. Check console.");
      }
    };
    initializeGAPI();
  }, []);

  // Load notes from backend
  const loadNotes = async () => {
    try {
      const res = await fetchNotes(search);
      setNotes(res.data);
    } catch (err) {
      console.error("Error loading notes:", err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [search]);

  // Load YouTube videos
  const loadVideos = async () => {
    try {
      setLoadingVideos(true);
      const myVideos = await fetchMyVideos();
      setVideos(myVideos);
    } catch (err) {
      console.error("Error fetching videos:", err);
      alert("Failed to fetch videos.");
    } finally {
      setLoadingVideos(false);
    }
  };

  // Sign-in user
  const handleSignIn = async () => {
    try {
      await signIn();
      setUserSignedIn(true);
      await loadVideos();
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Failed to sign in.");
    }
  };

  // Sign-out user
  const handleSignOut = async () => {
    try {
      await signOut();
      setUserSignedIn(false);
      setVideos([]);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#FF0000", textAlign: "center" }}>YouTube Companion Dashboard</h1>

      {/* YouTube Auth */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {!userSignedIn ? (
          <button
            onClick={handleSignIn}
            style={{ padding: "10px 20px", backgroundColor: "#FF0000", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Sign in with YouTube
          </button>
        ) : (
          <button
            onClick={handleSignOut}
            style={{ padding: "10px 20px", backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Sign out
          </button>
        )}
      </div>

      {/* Videos List */}
      {loadingVideos && <p>Loading videos...</p>}
      {videos.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#FF0000" }}>My Videos</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {videos.map((video) => (
              <li
                key={video.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {video.snippet.thumbnails && (
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    style={{ width: "120px", height: "90px", borderRadius: "5px" }}
                  />
                )}
                <div>
                  <strong>{video.snippet.title}</strong>
                  <p style={{ margin: "5px 0" }}>{video.snippet.description}</p>
                  <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
                    Watch Video
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes Section */}
      <h2 style={{ color: "#FF0000" }}>Notes</h2>
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <NoteForm onNoteAdded={(note) => setNotes([note, ...notes])} loadNotes={loadNotes} />
      <NoteList notes={notes} setNotes={setNotes} loadNotes={loadNotes} />
    </div>
  );
}

export default App;

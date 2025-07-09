import { useState } from "react";
import React from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem("token");
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/movies?search=${query}`,{
        headers: {
        Authorization: `Bearer ${token}`
  }
      });
      setMovies(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-6">🎬 MovieFlix Dashboard</h1>
        
      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 w-80 border rounded-l-md focus:outline-none"
        />
        <button className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">
          Search
        </button>
      </form>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && movies.length === 0 && (
        <p className="text-center text-gray-600">No movies found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Link to={`/movies/${movie.omdbId}`} key={movie.omdbId}>
            <div className="bg-white rounded shadow p-4 hover:shadow-lg transition duration-300">
              <img
                src={movie.poster || "https://via.placeholder.com/150"}
                alt={movie.title}
                className="w-full h-60 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-600">{movie.year} • ⭐ {movie.rating || "N/A"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

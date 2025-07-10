import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import React from "react";
import Select from 'react-select';

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy",
    "Horror", "Romance", "Sci-Fi", "Thriller"
  ];
const [currentPage, setCurrentPage] = useState(1);
const moviesPerPage = 6; 
  const indexOfLastMovie = currentPage * moviesPerPage;
const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
const totalPages = Math.ceil(movies.length / moviesPerPage);

const goToNextPage = () => {
  if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
};

const goToPreviousPage = () => {
  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
};
const genreOptions = genres.map((g) => ({ value: g, label: g }));

const handleGenreChange = (selectedOptions) => {
  const selected = selectedOptions.map((opt) => opt.value);
  setSelectedGenres(selected);
};

  const token = localStorage.getItem("token");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = {
        search: query,
      };
      if (selectedGenres.length > 0) {
        params.filter = `genre:${selectedGenres.join(",")}`;
      }

      const res = await axios.get("http://localhost:5000/api/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setMovies(res.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Title", "Year", "Rating"];
    const rows = movies.map(m => [m.title, m.year, m.rating]);
    const csvContent = [headers, ...rows]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "movies.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 pt-24">
      <Navbar />

      {/* Top Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-6 max-w-6xl mx-auto">
        <Link to="/analytics">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition">
            📊 View Analytics
          </button>
        </Link>

        {movies.length > 0 && (
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            ⬇️ Download CSV
          </button>
        )}
      </div>

      <motion.div
        className="p-6 pt-10 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl font-bold text-center text-purple-700 mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          🎬 MovieFlix Dashboard
        </motion.h1>

        {/* Genre Filter */}
    <Select
  options={genreOptions}
  isMulti
  value={genreOptions.filter((opt) => selectedGenres.includes(opt.value))}
  onChange={handleGenreChange}
  className="mb-6 max-w-md mx-auto"
  classNamePrefix="react-select"
  placeholder="Select genres..."
/>
        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex justify-center items-center mb-8"
        >
          <div className="flex w-full max-w-md rounded overflow-hidden shadow-lg bg-white">
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 outline-none"
            />
            <button className="bg-purple-600 text-white px-4 hover:bg-purple-700 transition">
              <FaSearch />
            </button>
          </div>
        </form>

        {/* Results */}
        {loading && (
          <p className="text-center text-lg font-semibold text-gray-600">
            Loading...
          </p>
        )}

        {!loading && movies.length === 0 && (
          <p className="text-center text-gray-600">
            No movies found. Try a different keyword.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {currentMovies.map((movie, index) => (
            <motion.div
              key={movie.omdbId}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/movies/${movie.omdbId}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                  <img
                    src={
                      movie.poster !== "N/A"
                        ? movie.poster
                        : "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {movie.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {movie.year} • ⭐ {movie.rating || "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {movies.length > moviesPerPage && (
  <div className="flex justify-center mt-8 gap-4">
    <button
      onClick={goToPreviousPage}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
    >
      ◀ Prev
    </button>
    <span className="text-lg font-medium">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={goToNextPage}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
    >
      Next ▶
    </button>
  </div>
)}

      </motion.div>
    </div>
  );
};

export default Dashboard;

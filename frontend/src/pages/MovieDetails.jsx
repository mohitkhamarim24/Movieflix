import { useEffect, useState } from "react";
import React from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const MovieDetail = () => {
  const { id } = useParams(); // omdbId
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMovie = async () => {
      const apiBase = import.meta.env.VITE_BACKEND_URL;
      try {
        const res = await axios.get(`${apiBase}/api/movies${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovie(res.data);
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (!movie) return <p className="text-center mt-10 text-red-500">Movie not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Link to="/" className="text-blue-600 hover:underline mb-4 block">
        ← Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto bg-white rounded shadow-lg p-6">
        <img
          src={movie.poster !== "N/A" ? movie.poster : "https://via.placeholder.com/300x450"}
          alt={movie.title}
          className="w-full md:w-64 h-auto object-cover rounded"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-sm text-gray-600 mb-1">Year: {movie.year}</p>
          <p className="text-sm text-gray-600 mb-1">Runtime: {movie.runtime} mins</p>
          <p className="text-sm text-gray-600 mb-1">Genre: {movie.genre?.join(", ")}</p>
          <p className="text-sm text-gray-600 mb-1">Director: {movie.director}</p>
          <p className="text-sm text-gray-600 mb-1">Actors: {movie.actors?.join(", ")}</p>
          <p className="text-sm text-gray-600 mb-1">Rating: ⭐ {movie.rating || "N/A"}</p>
          <p className="mt-4 text-gray-800">{movie.plot || "No plot available."}</p>

          {movie.imdbUrl && (
            <a
              href={movie.imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              View on IMDb →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

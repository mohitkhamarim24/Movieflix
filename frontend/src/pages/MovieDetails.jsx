import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MovieDetails = () => {
  const { id } = useParams(); // OMDb ID
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error("Failed to load movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!movie) return <p className="text-center mt-10">Movie not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={movie.poster || "https://via.placeholder.com/300x450"}
          alt={movie.title}
          className="w-full md:w-64 rounded shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-600 mb-1">📅 Year: {movie.year}</p>
          <p className="text-gray-600 mb-1">🎬 Genre: {movie.genre?.join(", ")}</p>
          <p className="text-gray-600 mb-1">🎥 Director: {movie.director}</p>
          <p className="text-gray-600 mb-1">👥 Actors: {movie.actors?.join(", ")}</p>
          <p className="text-gray-600 mb-1">⭐ Rating: {movie.rating || "N/A"}</p>
          <p className="text-gray-600 mb-1">⏱ Runtime: {movie.runtime || "N/A"} mins</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

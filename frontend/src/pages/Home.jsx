import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <h1 className="text-5xl font-bold mb-4 animate-pulse">🎬 Welcome to MovieFlix</h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Discover your favorite movies, explore ratings, search by genre or title, and view insightful analytics to know what’s trending.
      </p>

      <div className="flex gap-4 mb-10">
        <Link
          to="/register"
          className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded hover:bg-gray-200 transition duration-300"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded hover:bg-gray-200 transition duration-300"
        >
          Login
        </Link>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm">🚀 Features:</p>
        <ul className="text-white/80 text-sm space-y-1">
          <li>🔍 Search movies by title or genre</li>
          <li>📊 Visualize movie ratings & runtime</li>
          <li>👤 Secure Login & JWT-based Auth</li>
          <li>📁 Browse, Explore & Download CSV</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;

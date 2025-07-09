// src/components/Navbar.jsx
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import React from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🎬 MovieFlix</h1>

      {user && (
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-gray-700 font-medium">
            Hi, {user.username}
          </span>
          <img
            src={user.image || "https://www.gravatar.com/avatar/placeholder?d=mp"}
            alt="User avatar"
            className="w-8 h-8 rounded-full border"
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

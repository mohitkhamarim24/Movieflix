// src/components/Navbar.jsx
import { useAuth } from "../hooks/useAuth";
import { useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // optional for animations
import React from "react";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50"
    >
      <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">
        🎬 MovieFlix
      </h1>
         <Link to="/analytics" className="text-blue-600 hover:underline">Analytics</Link>
      {user && (
        <div className="flex items-center gap-4">
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white font-medium hidden sm:block"
          >
            Hi, <span className="font-bold">{user.username}</span> 👋
          </motion.span>

          <motion.img
            whileHover={{ scale: 1.1 }}
            src={user.image || "https://i.pravatar.cc/100?u=user"}
            alt="User avatar"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md transition-all duration-300"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-white text-purple-700 font-semibold px-4 py-1.5 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Logout
          </motion.button>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;

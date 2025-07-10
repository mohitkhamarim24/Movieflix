import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.msg || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <motion.form
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Welcome Back 👋</h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mb-4 text-center"
          >
            {error}
          </motion.p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          Login
        </motion.button>
        <p className="text-sm text-center mt-4 text-gray-600">
  Don’t have an account?{" "}
  <Link
    to="/register"
    className="text-blue-600 hover:underline font-medium"
  >
    Register here
  </Link>
</p>
      </motion.form>
    </div>
  );
};

export default Login;

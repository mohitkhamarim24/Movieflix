import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MovieDetails from "./pages/MovieDetails";
import { AuthProvider } from "./context/AuthProvider";
import Analytics from "./pages/Analytics";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/movies/:id" element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

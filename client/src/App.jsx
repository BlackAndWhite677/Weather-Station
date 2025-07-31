import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;

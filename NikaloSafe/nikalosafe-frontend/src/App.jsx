// src/App.js
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Homepage";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Leaderboard from "./pages/Leaderboard";

function ThemeApp() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/signup" element={<Signup darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/leaderboard" element={<Leaderboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ThemeApp />);
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Login({ darkMode, setDarkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      // 🔥 SAVE USER
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Login successful!");
      navigate("/");

    } catch (err) {
  console.log("Full Error:", err);
  console.log("Response Data:", err.response?.data);
  console.log("Status:", err.response?.status);

  alert(JSON.stringify(err.response?.data));
}
  };

  return (
    <div className={`auth-shell ${darkMode ? "dark" : ""}`}>
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Sign in to continue to Knowvia</p>
        </div>

        <div className="auth-form">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>

        <div className="auth-actions">
          <button type="button" className="ghost-button" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
          <p onClick={() => navigate("/signup")}>Don't have an account? Signup</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
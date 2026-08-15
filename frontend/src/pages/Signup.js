import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Signup({ darkMode, setDarkMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:8080/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful!");
      navigate("/login");

    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className={`auth-shell ${darkMode ? "dark" : ""}`}>
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create your account</h2>
          <p>Join the Knowvia student community</p>
        </div>

        <div className="auth-form">
          <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleSignup}>Signup</button>
        </div>

        <div className="auth-actions">
          <button type="button" className="ghost-button" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
          <p onClick={() => navigate("/login")}>Already have an account? Login</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
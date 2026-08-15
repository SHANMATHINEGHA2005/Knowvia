import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import "./Leaderboard.css";
import Layout from "../components/Layout";

function Leaderboard({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const loadLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:8080/leaderboard");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLeaderboard();

    // 🔥 auto refresh
    const interval = setInterval(loadLeaderboard, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout
      darkMode={darkMode}
      sidebarContent={
        <>
          <div className="sidebar-brand">
            <div className="brand-mark">K</div>
            <div>
              <h3>Knowvia</h3>
              <p>Student doubt hub</p>
            </div>
          </div>

          <div className="sidebar-section">
            <button className="nav-button" onClick={() => navigate("/")}>
              ⬅ Back to Home
            </button>
            <button className="nav-button" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
            </button>
          </div>
        </>
      }
      topbarContent={
        <>
          <div className="topbar-brand">
            <span className="brand-dot" />
            <span>Community Leaderboard</span>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </>
      }
    >
      <div className="leaderboard-main">
        <div className="leaderboard-card">
          <div className="leaderboard-header">
            <div>
              <p className="eyebrow">Community</p>
              <h1>🏆 Top Contributors</h1>
            </div>
            <p className="leaderboard-subtitle">See who is helping the community most</p>
          </div>

          <div className="leaderboard-list">
            {users.map((u, index) => (
              <div
                key={u.id}
                className={`leader-item ${index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}`}
              >
                <div className="leader-main">
                  <span className="rank">#{index + 1}</span>
                  <div className="avatar">{(u.name || "U").charAt(0).toUpperCase()}</div>
                  <div className="leader-info">
                    <h4>{u.name}</h4>
                    <p>{index < 3 ? "Top contributor" : "Active learner"}</p>
                  </div>
                </div>

                <div className="points-pill">🔥 {u.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Leaderboard;
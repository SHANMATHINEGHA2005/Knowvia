import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Layout from "./components/Layout";

function App({ darkMode, setDarkMode }) {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const profileButtonRef = useRef(null);
  const profileMenuRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMenu &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const loadQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  const normalize = (text) => text.toLowerCase().replace(/\?/g, "").trim();

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const normalizedSearch = normalize(value);
    const filtered = questions.filter((q) =>
      normalize(q.questionText).includes(normalizedSearch)
    );

    const unique = [];
    const seen = new Set();

    filtered.forEach((q) => {
      const normalizedQuestion = normalize(q.questionText);
      if (!seen.has(normalizedQuestion)) {
        seen.add(normalizedQuestion);
        unique.push(q);
      }
    });

    setSuggestions(unique.slice(0, 5));
  };

  const searchQuestion = async (text = search) => {
    if (!text.trim()) return;

    setSuggestions([]);

    const normalizedSearch = normalize(text);
    const found = questions.find(
      (q) => normalize(q.questionText) === normalizedSearch
    );

    if (found) {
      setQuestion(found);
      const ans = await axios.get("http://localhost:8080/answers/" + found.id);
      setAnswers(ans.data);
    } else {
      const newQ = await axios.post("http://localhost:8080/questions", {
        questionText: text,
      });
      setQuestion(newQ.data);
      setAnswers([]);
      loadQuestions();
    }

    const ai = await axios.post("http://localhost:8080/ai", { question: text });
    setAiAnswer(ai.data);
    setSearch("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchQuestion();
  };

  const submitAnswer = async () => {
    if (!answerText.trim()) return;

    await axios.post("http://localhost:8080/answers", {
      questionId: question.id,
      answerText: answerText,
      userId: user.id,
    });

    const ans = await axios.get("http://localhost:8080/answers/" + question.id);
    setAnswers(ans.data);
    setAnswerText("");
  };

  const likeAnswer = async (id) => {
    await axios.put("http://localhost:8080/answers/like/" + id);
    searchQuestion(question.questionText);
  };

  const dislikeAnswer = async (id) => {
    await axios.put("http://localhost:8080/answers/dislike/" + id);
    searchQuestion(question.questionText);
  };

  const bestAnswer = async (id) => {
    await axios.put("http://localhost:8080/answers/best/" + id);
    searchQuestion(question.questionText);
  };

  if (!user) return null;

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
            <h4>Recent activity</h4>
            {[...questions].reverse().slice(0, 8).map((q) => (
              <button
                key={q.id}
                className="history-item"
                onClick={() => {
                  setSearch(q.questionText);
                  searchQuestion(q.questionText);
                }}
              >
                {q.questionText}
              </button>
            ))}
          </div>
        </>
      }
      topbarContent={
        <>
          <div className="topbar-brand">
            <span className="brand-dot" />
            <span>AI Powered Student Doubt Exchange</span>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            <div className="profile-container">
              <button
                type="button"
                ref={profileButtonRef}
                className="profile-icon"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </button>

              {showMenu && (
                <div ref={profileMenuRef} className="dropdown-menu">
                  <p className="dropdown-title">{user?.name || "Student"}</p>
                  <p
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/leaderboard");
                    }}
                  >
                    Leaderboard
                  </p>
                  <p
                    onClick={() => {
                      setShowMenu(false);
                      localStorage.removeItem("user");
                      navigate("/login");
                    }}
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      }
    >
      <div className="content-shell">
            <section className="hero-card">
              <div className="hero-copy">
                <p className="eyebrow">Ask. Learn. Share.</p>
                <h1>Find the answer you need faster.</h1>
                <p className="hero-text">
                  Search through existing doubts, compare peer responses, and get an AI-guided explanation in one place.
                </p>
              </div>

              <form className="search-box" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Ask your doubt"
                  value={search}
                  onChange={handleChange}
                />
                <button type="submit">Search</button>
              </form>

              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((q) => (
                    <button
                      key={q.id}
                      className="suggestion-item"
                      onClick={() => {
                        setSearch(q.questionText);
                        searchQuestion(q.questionText);
                      }}
                    >
                      {q.questionText}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {question && (
              <section className="qa-card">
                <div className="question-header">
                  <p className="eyebrow">Discussion</p>
                  <h2>{question.questionText}</h2>
                </div>

                {aiAnswer && (
                  <div className="ai-answer">
                    <div className="card-title-row">
                      <h3>AI Answer</h3>
                      <span className="pill">Generated insight</span>
                    </div>
                    <p>{aiAnswer}</p>
                  </div>
                )}

                <div className="answers-section">
                  <div className="section-heading">
                    <h3>Student Answers</h3>
                    <span>{answers.length} response{answers.length === 1 ? "" : "s"}</span>
                  </div>

                  {answers.length === 0 ? (
                    <div className="empty-state">No student answers yet. Be the first to contribute.</div>
                  ) : (
                    answers.map((a) => (
                      <article key={a.id} className="answer-card">
                        <div className="answer-meta">
                          <div>
                            <h4>👤 {a.user?.name || "Anonymous"}</h4>
                            <p>{a.answerText}</p>
                          </div>
                        </div>

                        <div className="answer-actions">
                          <button type="button" onClick={() => likeAnswer(a.id)}>
                            👍 {a.likes}
                          </button>
                          <button type="button" onClick={() => dislikeAnswer(a.id)}>
                            👎 {a.dislikes}
                          </button>
                          {a.bestAnswer ? (
                            <span className="best-pill">⭐ Best answer</span>
                          ) : (
                            <button type="button" className="primary-btn" onClick={() => bestAnswer(a.id)}>
                              Mark Best
                            </button>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>

          <div className="answer-box-wrap">
            <div className="answer-box">
              <input
                type="text"
                placeholder="Write your answer..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
              <button type="button" onClick={submitAnswer}>
                Post Answer
              </button>
            </div>
          </div>
    </Layout>
  );
}

export default App;
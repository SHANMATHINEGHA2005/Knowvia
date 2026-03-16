import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import Leaderboard from "./pages/Leaderboard";

function App() {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  // Normalize text (remove ? and lowercase)
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

  return (
    <div className="app-container">
      {/* SIDEBAR: History + Leaderboard */}
      <div className="sidebar">
        <h3>History</h3>
        {[...questions].reverse().map((q) => (
          <div
            key={q.id}
            className="history-item"
            onClick={() => {
              setSearch(q.questionText);
              searchQuestion(q.questionText);
            }}
          >
            {q.questionText}
          </div>
        ))}

        {/* Leaderboard Component */}
        <Leaderboard />
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <h1>Knowvia</h1>
        <h3>AI Powered Student Doubt Exchange</h3>

        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your doubt"
            value={search}
            onChange={handleChange}
          />
          <button type="submit">Search</button>
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((q) => (
              <div
                key={q.id}
                className="suggestion-item"
                onClick={() => {
                  setSearch(q.questionText);
                  searchQuestion(q.questionText);
                }}
              >
                {q.questionText}
              </div>
            ))}
          </div>
        )}

        {/* Question + Answers */}
        {question && (
          <div className="qa-box">
            <h2>{question.questionText}</h2>

            {aiAnswer && (
              <div className="ai-answer">
                <h3>🤖 AI Answer</h3>
                <p>{aiAnswer}</p>
              </div>
            )}

            <h3>Student Answers</h3>

            {answers.length === 0 ? (
              <p style={{ color: "gray" }}>
                No student answers yet. Be the first to answer!
              </p>
            ) : (
              answers
                .sort((a, b) => {
                  if (a.bestAnswer && !b.bestAnswer) return -1;
                  if (!a.bestAnswer && b.bestAnswer) return 1;
                  return b.likes - a.likes;
                })
                .map((a) => (
                  <div key={a.id} className="answer-card">
                    <p>{a.answerText}</p>
                    <span onClick={() => likeAnswer(a.id)}>👍 {a.likes}</span>
                    <span onClick={() => dislikeAnswer(a.id)}>👎 {a.dislikes}</span>
                    {a.bestAnswer && <span className="best">⭐ Best Answer</span>}
                    {!a.bestAnswer && (
                      <button onClick={() => bestAnswer(a.id)}>Mark Best</button>
                    )}
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* ANSWER BOX */}
      {question && (
        <div className="answer-box">
          <input
            type="text"
            placeholder="Write your answer..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
          <button onClick={submitAnswer}>Post Answer</button>
        </div>
      )}
    </div>
  );
}

export default App;
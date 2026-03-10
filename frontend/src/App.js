import React, { useState, useEffect } from "react";
import axios from "axios";

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
    const res = await axios.get("http://localhost:8080/questions");
    setQuestions(res.data);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = questions.filter((q) =>
      q.questionText.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const searchQuestion = async (text = search) => {
    if (!text.trim()) return;

    // Clear suggestions immediately
    setSuggestions([]);

    // Find existing question
    const found = questions.find(
      (q) => q.questionText.toLowerCase() === text.toLowerCase()
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
      loadQuestions(); // refresh questions list
    }

    // AI Answer
    const ai = await axios.post("http://localhost:8080/ai", { question: text });
    setAiAnswer(ai.data);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchQuestion();
    }
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Knowvia</h1>
      <h3>AI Powered Student Doubt Exchange</h3>

      <input
        type="text"
        placeholder="Enter your doubt"
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        style={{ padding: "8px", width: "300px" }}
      />

      <button
        onClick={() => searchQuestion()}
        style={{ marginLeft: "10px", padding: "8px 15px" }}
      >
        Search
      </button>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div
          style={{
            width: "300px",
            margin: "auto",
            border: "1px solid #ccc",
            textAlign: "left",
          }}
        >
          {suggestions.map((q) => (
            <div
              key={q.id}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => {
                setSearch(q.questionText);
                searchQuestion(q.questionText);
                setSuggestions([]); // ensure suggestions cleared
              }}
            >
              {q.questionText}
            </div>
          ))}
        </div>
      )}

      {/* Question & Answers */}
      {question && (
        <div
          style={{
            marginTop: "40px",
            width: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            border: "1px solid #ddd",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <h2>{question.questionText}</h2>

          {aiAnswer && (
            <div
              style={{
                border: "2px solid green",
                padding: "15px",
                marginTop: "20px",
                borderRadius: "6px",
                backgroundColor: "#f3fff3",
              }}
            >
              <h3>🤖 AI Answer</h3>
              <p>{aiAnswer}</p>
            </div>
          )}

          <h3>Student Answers</h3>

          {answers.map((a) => (
            <div
              key={a.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "5px",
              }}
            >
              <p>{a.answerText}</p>

              <span
                style={{ cursor: "pointer", marginRight: "15px" }}
                onClick={() => likeAnswer(a.id)}
              >
                👍 {a.likes}
              </span>

              <span
                style={{ cursor: "pointer", marginRight: "15px" }}
                onClick={() => dislikeAnswer(a.id)}
              >
                👎 {a.dislikes}
              </span>

              {a.bestAnswer && (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  ⭐ Best Answer
                </span>
              )}

              {!a.bestAnswer && (
                <button style={{ marginLeft: "15px" }} onClick={() => bestAnswer(a.id)}>
                  Mark Best
                </button>
              )}
            </div>
          ))}

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Write your answer"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              style={{ width: "70%", padding: "6px" }}
            />
            <button onClick={submitAnswer} style={{ marginLeft: "10px" }}>
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
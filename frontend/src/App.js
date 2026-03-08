import React, { useState } from "react";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [doubts, setDoubts] = useState([]);

  const addDoubt = async () => {
    if (question === "") return;

    try {
      // Send POST request to backend
      const response = await axios.post("http://localhost:8080/users", {
        name: question // change 'name' if your User entity uses a different field
      });

      // Add the returned data to doubts array
      setDoubts([...doubts, response.data.name]);
      setQuestion("");
    } catch (error) {
      console.error("Error sending doubt:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Knowvia</h1>
      <h3>AI Powered Student Doubt Exchange</h3>

      <input
        type="text"
        placeholder="Enter your doubt"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={addDoubt}>Submit</button>

      <ul>
        {doubts.map((d, index) => (
          <li key={index}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
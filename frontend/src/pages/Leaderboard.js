import React, { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/leaderboard")
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h2>🏆 Leaderboard</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Email</th>
            <th>Points</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default Leaderboard;
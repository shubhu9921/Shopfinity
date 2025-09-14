import React, { useEffect, useState } from "react";
import axios from "axios";

function Issues() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user/contact-messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  return (
    <div className="container mt-5">
      <h2
        className="mb-4 text-center"
        style={{ color: "#5a3476", fontWeight: "700", userSelect: "none" }}
      >
        📨 User Submitted Queries
      </h2>

      {messages.length === 0 ? (
        <p className="text-center" style={{ color: "#5a3476" }}>
          No messages yet.
        </p>
      ) : (
        <div className="table-responsive shadow rounded">
          <table
            className="table table-bordered mb-0"
            style={{ borderColor: "#5a3476" }}
          >
            <thead
              style={{
                backgroundColor: "#5a3476",
                color: "#fff",
                fontWeight: "600",
                userSelect: "none",
              }}
            >
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "15%" }}>Name</th>
                <th style={{ width: "20%" }}>Email</th>
                <th>Message</th>
                <th style={{ width: "20%" }}>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <tr
                  key={msg.id}
                  style={{
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f0fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td>{index + 1}</td>
                  <td>{msg.name || "N/A"}</td>
                  <td>{msg.email || "N/A"}</td>
                  <td>{msg.message || "N/A"}</td>
                  <td>
                    {msg.submittedAt
                      ? new Date(msg.submittedAt).toLocaleString("en-IN")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Issues;

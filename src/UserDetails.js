import React, { useEffect, useState } from "react";
import axios from "axios";

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/user/all");
      setUsers(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("❌ Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center" style={{ color: "#5a3476" }}>
        <p>Loading users...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5 text-center">
        <p className="text-danger fw-bold">{error}</p>
      </div>
    );
  if (users.length === 0)
    return (
      <div className="container mt-5 text-center" style={{ color: "#5a3476" }}>
        <p>No users found.</p>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2
        className="mb-4 text-center"
        style={{ color: "#5a3476", fontWeight: "700", userSelect: "none" }}
      >
        🧑‍🤝‍🧑 Registered Users
      </h2>

      <div className="table-responsive shadow rounded">
        <table
          className="table table-striped table-bordered mb-0"
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
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{ cursor: "default", transition: "background-color 0.3s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f0fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td>{user.id}</td>
                <td>{user.name || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.phone || "N/A"}</td>
                <td>{user.address || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDetails;

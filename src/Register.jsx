import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";


function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    profile: ''
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.cpassword) return alert("Passwords do not match!");
    if (!acceptedTerms) return alert("You must accept the terms.");

    try {
      setLoading(true);
      await axios.post('http://localhost:8080/user/register', user, {
        withCredentials: true
      });

      alert("Registered successfully!");
      setUser({ name: '', email: '', password: '', cpassword: '', profile: '' });
      setAcceptedTerms(false);
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Registration failed.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-image">
        {/* Replace with your own image URL or import */}
        <img
          src="https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80"
          alt="Register"
        />
      </div>
      <div className="register-form-container">
        <h2 className="mb-4 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="form-control mb-3"
            disabled={loading}
            autoComplete="name"
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="form-control mb-3"
            disabled={loading}
            autoComplete="email"
          />
          <label htmlFor="profile">Profile</label>
        
          <input
            id="profile"
            type="text"
            name="profile"
            value={user.profile}
            onChange={handleChange}
            placeholder="Profile"
            required
            className="form-control mb-3"
            disabled={loading}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="form-control mb-3"
            disabled={loading}
            autoComplete="new-password"
          />
          <label htmlFor="cpassword">Confirm Password</label>
          <input
            id="cpassword"
            type="password"
            name="cpassword"
            value={user.cpassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="form-control mb-3"
            disabled={loading}
            autoComplete="new-password"
          />
          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              disabled={loading}
            />
             <label className="form-check-label" htmlFor="terms">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      Terms & Conditions
                    </a>
                  </label>
          </div>
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading || !acceptedTerms}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

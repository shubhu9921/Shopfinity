import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/user/forgot-password', { email });

      // If the response was successful, show the success message
      setMessage(res.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      // Extract message from backend response or fallback
      const msg = err.response?.data?.message || 'Something went wrong.';

      if (msg.toLowerCase().includes('not registered') || msg.toLowerCase().includes('incorrect')) {
        setError('Email is incorrect or not registered.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: 400 }}>
        <h3 className="mb-3 text-center">Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter your email"
            required
          />
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {/* Show success or error messages */}
          {message && <div className="alert alert-success mt-3">{message}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

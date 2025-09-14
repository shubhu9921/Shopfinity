import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUsername, setUserId } = useAuth();

  const handleChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/user/login', user, { withCredentials: true });
      const { username, id, token } = res?.data || {};

      if (username && id !== undefined) {
        localStorage.setItem('token', token || 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userId', String(id));

        setIsLoggedIn(true);
        setUsername(username);
        setUserId(id);

        setUser({ email: '', password: '' });

        if (username.toLowerCase() === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(`/dash/${username}`);
        }
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split">
      <div className="left-side" />
      <div className="right-side">
        <div className="form-container">
          <div className="brand-name">Shopfinity</div>
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-4 text-center">Login</h2>
              <form onSubmit={handleSubmit} noValidate>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  disabled={loading}
                  className="form-control mb-3"
                />
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  disabled={loading}
                  className="form-control mb-3"
                />
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="text-danger mt-3 text-center">{error}</p>}

                <p className="mt-3 text-center">
                  Don&apos;t have an account? <Link to="/register">Register here</Link>
                </p>
                <p className="mt-2 text-center">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

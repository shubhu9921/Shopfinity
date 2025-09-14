import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Nav() {
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = username?.toLowerCase() === 'admin';
  const normalizedPath = location.pathname === '/' ? '/' : location.pathname.replace(/\/+$/, '');

  useEffect(() => {
    if (location.pathname.startsWith('/admin') && (!isLoggedIn || !isAdmin)) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, isLoggedIn, isAdmin, navigate]);

  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      const toggler = document.querySelector('.navbar-toggler');
      if (toggler) toggler.click();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return alert('Please enter a search term.');
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    setSearchTerm('');
    closeNavbar();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top px-4 shadow-sm">
        <Link className="navbar-brand" to="/" onClick={closeNavbar}>
          <i className="bi bi-shop-window"></i> Shopfinity
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {!isAdmin && (
            <form className="d-flex ms-auto me-3" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary btn-sm ms-2" type="submit">
                Search
              </button>
            </form>
          )}

          <div className={`navbar-nav d-flex align-items-center gap-2 ${isAdmin ? 'ms-auto' : ''}`}>
            <Link className="nav-link" to="/product" onClick={closeNavbar}>
              Product
            </Link>

            {!isAdmin &&
              (normalizedPath === '/' ||
                normalizedPath === '/dashboard' ||
                normalizedPath.startsWith('/dash') ||
                normalizedPath.startsWith('/orders') ||
                normalizedPath.startsWith('/profile') ||
                normalizedPath.startsWith('/login') ||
                normalizedPath.startsWith('/product') ||
                normalizedPath.startsWith('/contact') ||
                normalizedPath.startsWith('/about') ||
                normalizedPath.startsWith('/forgot-password') ||
                normalizedPath.startsWith('/cart') ||
                normalizedPath.startsWith('/terms') ||
                normalizedPath.startsWith('/register')) && (
                <>
                  <Link className="nav-link" to="/about" onClick={closeNavbar}>
                    About
                  </Link>
                  <Link className="nav-link" to="/contact" onClick={closeNavbar}>
                    Contact
                  </Link>
                </>
              )}

            {!isLoggedIn ? (
              <Link className="nav-link" to="/login" onClick={closeNavbar}>
                Login
              </Link>
            ) : isAdmin ? (
              <>
                <Link className="nav-link" to="/admin/dashboard" onClick={closeNavbar}>
                  Admin Panel
                </Link>
                <span className="nav-link disabled">
                  Logged in as: <strong>{username}</strong>
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    logout();
                    closeNavbar();
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to={`/profile/${username}`} onClick={closeNavbar}>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to={`/orders/${username}`} onClick={closeNavbar}>
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          logout();
                          closeNavbar();
                          navigate('/');
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
                <Link className="nav-link" to="/cart" onClick={closeNavbar}>
                  Cart
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ marginTop: '70px' }}>
        <Outlet />
      </div>
    </>
  );
}

export default Nav;

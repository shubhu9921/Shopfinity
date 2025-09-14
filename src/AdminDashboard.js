import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from './AuthContext';

function AdminDashboard() {
  const { username } = useAuth();

  return (
    <div className="container mt-5 pt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Welcome, {username || 'Admin'}</h2>
        <p className="text-muted">Manage your store efficiently with the dashboard below.</p>
      </div>

      <div className="row g-4">
        <DashboardCard icon="fa-square-plus" color="primary" label="Add Product" link="/admin/addproduct" />
        <DashboardCard icon="fa-layer-group" color="success" label="Add Category" link="/admin/category" />
        <DashboardCard icon="fa-eye" color="info" label="View Products" link="/admin/show_products" />
        <DashboardCard icon="fa-cart-shopping" color="warning" label="Orders" link="/admin/allorders" />
        <DashboardCard icon="fa-users" color="danger" label="Users" link="/admin/user_details" />
        <DashboardCard icon="fa-user-shield" color="secondary" label="Issues" link="/admin/Issues" />
      </div>
    </div>
  );
}

// Reusable Card Component
function DashboardCard({ icon, color, label, link }) {
  const backgroundClass = `bg-${color}-subtle`; // Bootstrap 5.3+ subtle background
  const textColor = color === 'warning' ? 'text-dark' : `text-${color}`;

  return (
    <div className="col-sm-6 col-md-4">
      <Link to={link} className="text-decoration-none">
        <div className={`card dashboard-card h-100 ${backgroundClass}`}>
          <div className="card-body text-center">
            <i className={`fa-solid ${icon} fa-2x mb-3 ${textColor}`}></i>
            <p className={`fw-semibold fs-5 ${textColor}`}>{label}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}


export default AdminDashboard;

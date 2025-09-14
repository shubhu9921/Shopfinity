import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Profile() {
  const { userId } = useAuth();
  const { username } = useParams();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    joined: "",
    profilePicture: "https://via.placeholder.com/100",
    address: [],
    wishlist: [],
    paymentMethods: ["Visa **** 1234", "UPI: user@upi"],
    reviews: [],
    recentOrders: [],
  });

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/user/${userId}`)
      .then((res) => {
        const { name, email, phone, address } = res.data;
        setUser((prev) => ({
          ...prev,
          fullName: name,
          email,
          phone,
          address: address ? [address] : [],
        }));
      })
      .catch((err) => console.error("User fetch error:", err));

    axios
      .get("http://localhost:8080/user/orders", { params: { userId } })
      .then((res) => {
        setUser((prev) => ({ ...prev, recentOrders: res.data }));
      })
      .catch((err) => console.error("Orders fetch error:", err));
  }, [userId]);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Welcome, <strong>{username}</strong>!</h2>

      {/* Profile Section */}
      <div className="card mb-4 p-3 shadow-sm">
        <div className="d-flex align-items-center">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="rounded-circle me-4 img-fluid"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
          <div>
            <h4 className="mb-1">{user.fullName || "User Name"}</h4>
            <p className="mb-0"><strong>Email:</strong> {user.email || "Not Provided"}</p>
            <p className="mb-0"><strong>Phone:</strong> {user.phone || "Not Provided"}</p>
            <p className="mb-0"><strong>Member Since:</strong> {user.joined || "2024"}</p>
          </div>
        </div>
      </div>

      {/* Address Book */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Address Book</h4>
        </div>
        <ul className="list-group list-group-flush">
          {user.address.length > 0 ? (
            user.address.map((addr, index) => (
              <li key={index} className="list-group-item">
                {addr}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No addresses added yet.</li>
          )}
        </ul>
        <div className="card-body">
          <button className="btn btn-primary btn-sm">Add New Address</button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Recent Orders</h4>
        </div>
        <ul className="list-group list-group-flush">
          {user.recentOrders.length > 0 ? (
            user.recentOrders.map((order) => (
              <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  Order #{order.id} - <strong>{order.status}</strong> on {new Date(order.orderTime).toLocaleDateString()}
                </div>
                <button className="btn btn-sm btn-outline-primary">Track</button>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No recent orders found.</li>
          )}
        </ul>
      </div>

      {/* Wishlist */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Wishlist</h4>
        </div>
        <ul className="list-group list-group-flush">
          {user.wishlist.length > 0 ? (
            user.wishlist.map((item, index) => (
              <li key={index} className="list-group-item">
                {item}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">Your wishlist is empty.</li>
          )}
        </ul>
      </div>

      {/* Payment Methods */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Payment Methods</h4>
        </div>
        <ul className="list-group list-group-flush">
          {user.paymentMethods.length > 0 ? (
            user.paymentMethods.map((method, index) => (
              <li key={index} className="list-group-item d-flex align-items-center">
                <i className="fas fa-credit-card me-2 text-primary"></i>
                {method}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No payment methods added.</li>
          )}
        </ul>
        <div className="card-body">
          <button className="btn btn-secondary btn-sm">Add Payment Method</button>
        </div>
      </div>

      {/* Reviews */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">My Reviews</h4>
        </div>
        <ul className="list-group list-group-flush">
          {user.reviews.length > 0 ? (
            user.reviews.map((review, index) => (
              <li key={index} className="list-group-item">
                {review}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">You haven't posted any reviews yet.</li>
          )}
        </ul>
      </div>

      {/* Account Settings */}
      <div className="card mb-4 shadow-sm p-3">
        <h4 className="mb-3">Account Settings</h4>
        <button className="btn btn-outline-primary me-2 mb-2">Change Password</button>
        <button className="btn btn-outline-danger mb-2">Delete Account</button>
      </div>

      {/* Support */}
      <div className="card mb-4 shadow-sm p-3">
        <h4 className="mb-3">Support</h4>
        <p>
          Need help? <a href="/contact">Contact Support</a>
        </p>
      </div>
    </div>
  );
}

export default Profile;

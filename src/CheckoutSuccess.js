import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function CheckoutSuccess() {
  const navigate = useNavigate();
  const { username } = useAuth(); // Get the username from context

  useEffect(() => {
    // Optionally clear cart after order
    // localStorage.removeItem("cart");
  }, []);

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div className="text-center">
        <h2 className="text-success animate__animated animate__fadeInDown">
          🎉 Order Confirmed!
        </h2>
        <p className="mt-3">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="mt-4">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate(`/orders/${username}`)}
          >
            View My Orders
          </button>

          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate(`/dash/${username}`)}
          >
            Go to Dashboard
          </button>

          <button
            className="btn btn-outline-dark"
            onClick={() => navigate(`/dash/${username}`)}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;

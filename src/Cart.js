import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

function Cart() {
  const { isLoggedIn, userId } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !userId || isNaN(Number(userId))) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/cart/view", {
          params: { userId: Number(userId) },
          withCredentials: true,
        });
        setCartItems(response.data || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to load cart items");
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn, userId, navigate]);

  const updateQuantity = async (productId, delta) => {
    const item = cartItems.find((i) => i.product.id === productId);
    if (!item) return;

    if (delta < 0 && item.quantity <= 1) {
      alert("Quantity cannot be less than 1");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/cart/add",
        null,
        {
          params: {
            userId: Number(userId),
            productId,
            quantity: delta,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200 || res.status === 201) {
        const updatedCart = await axios.get("http://localhost:8080/cart/view", {
          params: { userId: Number(userId) },
          withCredentials: true,
        });
        setCartItems(updatedCart.data || []);
      }
    } catch (err) {
      alert("Failed to update quantity: " + (err.response?.data || err.message));
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item from your cart?")) {
      return;
    }
    try {
      await axios.delete("http://localhost:8080/cart/remove", {
        params: { userId: Number(userId), productId },
        withCredentials: true,
      });

      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.post("http://localhost:8080/cart/clear", null, {
        params: { userId: Number(userId) },
        withCredentials: true,
      });
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart");
    }
  };

  const handlePlaceOrder = () => {
    navigate("/checkout");
  };

  if (loading) return <p className="container mt-4">Loading your cart...</p>;

  if (cartItems.length === 0)
    return (
      <div className="container mt-4">
        <h4>Your cart is empty 😔</h4>
        <p>Browse products and start adding items to your cart!</p>
      </div>
    );

  // Calculate total using discounted prices
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.product.price || 0);
    const discount = Number(item.product.discount || 0);
    const discountedPrice = price - (price * discount) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      <ul className="list-group">
        {cartItems.map((item) => {
          const price = Number(item.product.price || 0);
          const discount = Number(item.product.discount || 0);
          const discountedPrice = price - (price * discount) / 100;

          const imagePath =
            item.product.imageUrl && typeof item.product.imageUrl === "string"
              ? item.product.imageUrl.startsWith("http")
                ? item.product.imageUrl
                : `http://localhost:8080${item.product.imageUrl.startsWith("/") ? "" : "/"}${item.product.imageUrl}`
              : "/default.jpg";

          return (
            <li className="list-group-item" key={item.id}>
              <div className="row align-items-center">
                <div className="col-md-2">
                  <img
                    src={imagePath}
                    alt={item.product.name}
                    className="img-fluid rounded"
                    onError={(e) => (e.target.src = "/default.jpg")}
                    style={{ maxHeight: "80px" }}
                  />
                </div>
                <div className="col-md-6">
                  <h5>{item.product.name}</h5>
                  {discount > 0 ? (
                    <>
                      <p>
                        Price:{" "}
                        <span style={{ textDecoration: "line-through", color: "#888", marginRight: "0.5rem" }}>
                          {formatCurrency(price)}
                        </span>
                        <span className="text-success fw-bold">
                          {formatCurrency(discountedPrice)}
                        </span>
                      </p>
                      <p>
                        <small className="text-muted">
                          You save {formatCurrency(price - discountedPrice)} ({discount}%)
                        </small>
                      </p>
                    </>
                  ) : (
                    <p>Price: {formatCurrency(price)}</p>
                  )}
                </div>
                <div className="col-md-2 d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={() => updateQuantity(item.product.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => updateQuantity(item.product.id, 1)}
                  >
                    +
                  </button>
                </div>

                <div className="col-md-2 d-flex flex-column align-items-end">
                  <button
                    className="btn btn-danger btn-sm mb-2"
                    onClick={() => handleRemove(item.product.id)}
                  >
                    Remove
                  </button>
                  <div>
                    <strong>{formatCurrency(discountedPrice * item.quantity)}</strong>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Total: {formatCurrency(total)}</h4>
        <div>
          <button className="btn btn-warning me-2" onClick={handleClearCart}>
            Clear Cart
          </button>
          <button className="btn btn-success" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

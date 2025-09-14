import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { userId, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [useSavedInfo, setUseSavedInfo] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [cartRes, userRes] = await Promise.all([
          axios.get("http://localhost:8080/cart/view", { params: { userId }, withCredentials: true }),
          axios.get(`http://localhost:8080/user/${userId}`, { withCredentials: true }),
        ]);

        setCartItems(cartRes.data || []);

        const { address = "", phone = "" } = userRes.data || {};
        setAddress(address);
        setPhone(phone);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isLoggedIn, userId, navigate]);

  // Recalculate total when cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      const calculatedTotal = cartItems.reduce((sum, item) => {
        const price = Number(item.product?.price || 0);
        const discount = Number(item.product?.discount || 0);
        const discountedPrice = price - (price * discount) / 100;
        return sum + discountedPrice * item.quantity;
      }, 0);
      setTotal(calculatedTotal);
    } else {
      setTotal(0);
    }
  }, [cartItems]);

  // Update address and phone fields if useSavedInfo toggled
  useEffect(() => {
    const updateFields = async () => {
      if (useSavedInfo && userId) {
        try {
          const res = await axios.get(`http://localhost:8080/user/${userId}`, { withCredentials: true });
          const { address = "", phone = "" } = res.data || {};
          setAddress(address);
          setPhone(phone);
        } catch (err) {
          console.error("Error loading saved info", err);
        }
      } else {
        setAddress("");
        setPhone("");
      }
    };
    updateFields();
  }, [useSavedInfo, userId]);

  // Function to update quantity (increment or decrement)
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
            quantity: delta, // can be +1 or -1
          },
          withCredentials: true,
        }
      );

      if (res.status === 200 || res.status === 201) {
        // Refresh cart items after update
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

  const handlePayment = async () => {
    if (!address.trim() || !phone.trim()) {
      alert("Please provide both address and phone number.");
      return;
    }

    try {
      localStorage.setItem("orderAddress", address);
      localStorage.setItem("orderPhone", phone);

      const { data: orderData } = await axios.post(
        "http://localhost:8080/user/payment/create-order",
        null,
        { params: { amount: Math.round(total * 100) } }
      );

      const options = {
        key: "rzp_test_Y0pc1806JqKzSy", // TODO: Move to .env for production
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "My Shop",
        description: "Payment for your order",
        handler: async (response) => {
          try {
            const verifyRes = await axios.post("http://localhost:8080/user/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await axios.post("http://localhost:8080/user/place-order", null, {
                params: { userId, address, phone },
              });

              localStorage.removeItem("orderAddress");
              localStorage.removeItem("orderPhone");

              navigate("/success");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error.");
          }
        },
        prefill: {
          name: "Customer",
          email: "user@example.com", // Replace if you store email
          contact: phone,
        },
        notes: { address },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.warn("Payment failed:", response.error);
        alert("Payment failed or cancelled.");
      });
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Something went wrong during payment.");
    }
  };

  if (loading) return <p className="container mt-5">Loading checkout details...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => {
            const originalPrice = Number(item.product?.price || 0);
            const discount = Number(item.product?.discount || 0);
            const finalPrice = originalPrice - (originalPrice * discount) / 100;

            const imagePath = item.product.imageUrl?.startsWith("http")
              ? item.product.imageUrl
              : `http://localhost:8080${item.product.imageUrl?.startsWith("/") ? "" : "/"}${item.product.imageUrl || ""}`;

            return (
              <div key={item.id} className="card mb-3 p-3 shadow-sm">
                <div className="row g-3 align-items-center">
                  <div className="col-md-3">
                    <img
                      src={imagePath || "/default.jpg"}
                      alt={item.product?.name || "Product"}
                      className="img-fluid rounded"
                      onError={(e) => (e.target.src = "/default.jpg")}
                    />
                  </div>
                  <div className="col-md-9">
                    <h5>{item.product?.name}</h5>
                    <div className="d-flex align-items-center mb-2">
                      <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => updateQuantity(item.product.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    {discount > 0 ? (
                      <>
                        <p>
                          <strong>Price:</strong>{" "}
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                              marginRight: "0.5rem",
                            }}
                          >
                            ₹{originalPrice.toFixed(2)}
                          </span>
                          <span className="text-success fw-bold">₹{finalPrice.toFixed(2)}</span>
                        </p>
                        <p>
                          <small className="text-muted">
                            You save ₹{(originalPrice - finalPrice).toFixed(2)} ({discount}%)
                          </small>
                        </p>
                      </>
                    ) : (
                      <p>
                        <strong>Price:</strong> ₹{originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <h4 className="mt-4">Total: ₹{total.toFixed(2)}</h4>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="useSavedInfo"
              checked={useSavedInfo}
              onChange={(e) => setUseSavedInfo(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="useSavedInfo">
              Use saved address and phone
            </label>
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address:
            </label>
            <textarea
              id="address"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              required
              disabled={useSavedInfo}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone:
            </label>
            <input
              id="phone"
              className="form-control"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={useSavedInfo}
            />
          </div>

          <button className="btn btn-success" onClick={handlePayment}>
            Pay & Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;

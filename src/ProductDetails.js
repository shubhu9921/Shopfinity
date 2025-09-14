import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/admin/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Error fetching product:", err);
        alert("❌ Product not found.");
      })
      .finally(() => setFetching(false));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/cart/add", null, {
        params: {
          userId: Number(userId),
          productId,
          quantity: 1,
        },
      });
      alert("✅ Product added to cart.");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("❌ Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/cart/clear", null, {
        params: { userId: Number(userId) },
      });

      await axios.post("http://localhost:8080/cart/add", null, {
        params: { userId: Number(userId), productId, quantity: 1 },
      });

      navigate("/checkout");
    } catch (error) {
      const msg = error.response?.data || error.message;
      console.error("Error in Buy Now:", msg);
      alert("❌ Buy Now failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-center mt-4">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center mt-4 text-danger">Product not found.</p>;
  }

  // Price calculations
  const originalPrice = Number(product.price);
  const discount = Number(product.discount) || 0;
  const finalPrice = originalPrice - (originalPrice * discount) / 100;

  const imageUrl = product.imageUrl?.startsWith("http")
    ? product.imageUrl
    : `http://localhost:8080/${product.imageUrl || "default.jpg"}`;

  return (
    <div
      className="container mt-8"
      style={{
        maxWidth: "432px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: "100px auto 1.5rem auto",
      }}
    >
      <div
        className="card shadow-sm p-3"
        style={{
          borderRadius: "9px",
          boxShadow: "0 3.6px 10.8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          transition: "transform 0.3s ease",
          margin: "1rem 0",
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="card-img-top mb-3"
          style={{
            objectFit: "cover",
            height: "198px",
            borderRadius: "7.2px",
            boxShadow: "0 2.7px 7.2px rgba(0,0,0,0.1)",
          }}
          onError={(e) => (e.target.src = "/default.jpg")}
        />

        <div className="card-body px-0">
          <h2
            className="card-title fw-bold"
            style={{ fontSize: "1.26rem" }}
          >
            {product.name}
          </h2>
          <p
            className="text-muted mb-2"
            style={{ fontSize: "0.765rem", fontStyle: "italic" }}
          >
            Category: {product.category?.name || "Uncategorized"}
          </p>
          <p
            className="card-text mb-3"
            style={{ fontSize: "0.81rem", lineHeight: "1.4", color: "#333" }}
          >
            {product.description}
          </p>
<ul
  className="list-group list-group-flush mb-3"
  style={{
    fontSize: "0.81rem",
    borderRadius: "7.2px",
    overflow: "hidden",
  }}
>
  <li
    className="list-group-item"
    style={{ backgroundColor: "#f9f9f9" }}
  >
    <strong className="d-block mb-1">Price:</strong>
    <div>
      {discount > 0 ? (
        <>
          <span
            style={{
              textDecoration: "line-through",
              color: "#888",
              marginRight: "0.5rem",
              fontSize: "0.85rem",
            }}
          >
            ₹{originalPrice.toFixed(2)}
          </span>
          <span
            className="text-success fw-bold"
            style={{ fontSize: "1rem" }}
          >
            ₹{finalPrice.toFixed(2)}{" "}
            <small className="text-muted">per unit</small>
          </span>
          <br />
          <small className="text-muted">
            You save ₹{(originalPrice - finalPrice).toFixed(2)} ({discount}%)
          </small>
        </>
      ) : (
        <span className="text-success fw-bold">
          ₹{originalPrice.toFixed(2)}{" "}
          <small className="text-muted">per unit</small>
        </span>
      )}
    </div>
  </li>

 

  <li
    className="list-group-item d-flex justify-content-between align-items-center"
    style={{ backgroundColor: "#f9f9f9" }}
  >
    <strong>Discount:</strong>
    <span>{discount}%</span>
  </li>
</ul>



          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handleAddToCart}
              disabled={loading}
              style={{
                padding: "7.2px 0",
                fontSize: "0.9rem",
                borderRadius: "5.4px",
              }}
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>

            <button
              className="btn btn-success flex-grow-1"
              onClick={handleBuyNow}
              disabled={loading}
              style={{
                padding: "7.2px 0",
                fontSize: "0.9rem",
                borderRadius: "5.4px",
              }}
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

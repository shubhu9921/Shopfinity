import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

export function Product({
  id,
  name = "Unnamed Product",
  category = "Uncategorized",
  description = "No description available.",
  price = 0,
  imageUrl = "",
  onAddToCart,
}) {
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useAuth();
  const [loading, setLoading] = useState(false);

  const resolvedImageUrl = imageUrl
    ? `http://localhost:8080/${imageUrl.replace(/^\/?/, "")}`
    : "/default.jpg";

  const categoryName =
    typeof category === "object" && category?.name
      ? category.name
      : typeof category === "string"
      ? category
      : "Uncategorized";

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // prevent card click
    if (onAddToCart) return await onAddToCart(id);

    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/cart/add", null, {
        params: {
          userId: Number(userId),
          productId: id,
          quantity: 1,
        },
      });
      alert("Product added to cart!");
    } catch (error) {
      const msg = error.response?.data || error.message || "Unknown error";
      alert("Failed to add to cart: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation(); // prevent card click
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
        params: {
          userId: Number(userId),
          productId: id,
          quantity: 1,
        },
      });

      navigate("/checkout");
    } catch (error) {
      const msg = error.response?.data || error.message;
      alert("Buy Now failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to product details page on card click
  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="card h-100 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={handleCardClick}
    >
      <img
        src={resolvedImageUrl}
        alt={name}
        className="card-img-top"
        style={{
          height: "180px",
          width: "100%",
          objectFit: "cover",
          borderTopLeftRadius: "0.375rem",
          borderTopRightRadius: "0.375rem",
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default.jpg";
        }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{categoryName}</h6>
        <p className="card-text text-truncate">{description}</p>

        <p className="fw-bold">₹{Number(price).toFixed(2)}</p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "auto",
            justifyContent: "flex-start",
          }}
        >
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={loading}
            style={{
              flex: "1 1 30%",
              minWidth: "90px",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            className="btn btn-success btn-sm"
            onClick={handleBuyNow}
            disabled={loading}
            style={{
              flex: "1 1 30%",
              minWidth: "90px",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;

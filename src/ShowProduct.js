import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ShowProducts() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/admin/products")
      .then((res) => {
        setAllProducts(res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setMessage("❌ Failed to fetch products.");
      })
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:8080/admin/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/admin/products/${id}`);
      const updated = allProducts.filter((p) => p.id !== id);
      setAllProducts(updated);
      filterByCategory(selectedCategory, updated);
      setMessage("🗑️ Product deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage(
        "❌ Failed to delete product. This item may be referenced in orders."
      );
    }
  };

  const getResolvedImage = (imageUrl) => {
    if (!imageUrl) return "/default.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `http://localhost:8080/${imageUrl}`;
  };

  const filterByCategory = (categoryId, productList = allProducts) => {
    if (categoryId === "all") {
      setProducts(productList);
    } else {
      const filtered = productList.filter(
        (p) => p.category?.id === parseInt(categoryId)
      );
      setProducts(filtered);
    }
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    filterByCategory(selected);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3" style={{ color: "#5a3476", fontWeight: "700" }}>
        🛒 All Products
      </h3>

      {/* Category Filter */}
      <div className="mb-3 row align-items-center">
        <label
          className="col-sm-2 col-form-label fw-semibold"
          style={{ color: "#5a3476" }}
        >
          Filter by Category:
        </label>
        <div className="col-sm-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{
              borderColor: "#5a3476",
              color: "#5a3476",
              fontWeight: "600",
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes("✅") || message.includes("🗑️")
              ? "alert-success"
              : "alert-danger"
          } py-2`}
          style={{ fontWeight: "600" }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available for this category.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle" style={{ borderColor: "#5a3476" }}>
            <thead
              style={{
                backgroundColor: "#5a3476",
                color: "#fff",
                fontWeight: "600",
              }}
            >
              <tr>
                <th>#ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount (%)</th>
                <th>Status</th>
                <th style={{ width: "140px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f0fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td>{p.id}</td>
                  <td>
                    <img
                      src={getResolvedImage(p.imageUrl)}
                      alt={p.name}
                      style={{
                        height: "50px",
                        width: "70px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        backgroundColor: "#f0f0f0",
                      }}
                      onError={(e) => (e.target.src = "/default.jpg")}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category?.name || "N/A"}</td>
                  <td>₹{Number(p.price).toFixed(2)}</td>
                  <td>{p.discount}%</td>
                  <td>
                    <span
                      className={`badge ${
                        p.active ? "bg-success" : "bg-secondary"
                      }`}
                      style={{ fontWeight: "600" }}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/edit_product/${p.id}`}
                      className="btn btn-sm me-2"
                      style={{
                        backgroundColor: "#5a3476",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#462b57")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#5a3476")
                      }
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#d9534f",
                        color: "#fff",
                        fontWeight: "600",
                        border: "none",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#b33935")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#d9534f")
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShowProducts;

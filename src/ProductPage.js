import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Product from "./Product";
import { useAuth } from "./AuthContext";
import Search from "./Search";

function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId } = useAuth();

  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/admin/products")
      .then((res) => {
        setProducts(res.data);
        setOriginalProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        alert("Failed to load products: " + err.message);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlightId = params.get("highlight");

    if (highlightId) {
      const el = document.getElementById(`product-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlight");

        setTimeout(() => el.classList.remove("highlight"), 3000);
      }
    }
  }, [location.search, products]);

  const handleAddToCart = (productId) => {
    if (!isLoggedIn || !userId) {
      alert("Please login to add to cart.");
      navigate("/login");
      return;
    }

    axios
      .post("http://localhost:8080/cart/add", null, {
        params: { userId: Number(userId), productId, quantity: 1 },
      })
      .then(() => alert("Product added to cart!"))
      .catch((err) => {
        console.error("Add to cart error:", err);
        alert("Failed to add to cart: " + (err.response?.data || err.message));
      });
  };

  const handleSearchResults = (filteredProducts) => {
    if (filteredProducts.length > 0) {
      setProducts(filteredProducts);
    } else {
      alert("No matching products found.");
      setProducts(originalProducts);
    }
  };

  return (
    <div className="container mt-4">
      
      <Search onsearch={handleSearchResults} />

      {loadingProducts ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="row justify-content-center">
          {products.map((product) => (
            <div
              className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
              key={product.id}
            >
              <Product {...product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;

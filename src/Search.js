import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "./Product";
import { useAuth } from "./AuthContext";

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, isLoggedIn } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query || query.trim() === "") {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1. Search by product name
        const res = await axios.get("http://localhost:8080/admin/searchName", {
          params: { name: query },
        });

        if (res.data.length > 0) {
          setResults(res.data);
        } else {
          // 2. If no products found, search by category name
          const catRes = await axios.get("http://localhost:8080/admin/products/byCategoryName", {
            params: { categoryName: query },
          });
          setResults(catRes.data);
        }
      } catch (err) {
        console.error("Search error:", err);
        alert("🔍 Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn || !userId) {
      alert("Please log in to add items to your cart.");
      return navigate("/login");
    }

    try {
      await axios.post("http://localhost:8080/cart/add", null, {
        params: {
          userId: Number(userId),
          productId,
          quantity: 1,
        },
      });
      alert("✅ Product added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("❌ Failed to add to cart: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container mt-5">
      {query && query.trim() !== "" && (
        <h3 className="mb-4">
          Search Results for "<em>{query}</em>"
        </h3>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 && query ? (
        <p>No matching products or categories found.</p>
      ) : (
        <div className="row">
          {results.map((product) => {
            const mappedProduct = {
              ...product,
              catalog: product.imageUrl || "/default.jpg",
            };

            return (
              <div key={product.id} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                <Product {...mappedProduct} onAddToCart={handleAddToCart} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Search;

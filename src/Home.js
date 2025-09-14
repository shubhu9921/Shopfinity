import React, { useEffect, useState } from "react";
import axios from "axios";
import Product from "./Product";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { isLoggedIn, userId } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
  setLoading(true);
  axios
    .get("http://localhost:8080/admin/products")
    .then((res) => {
      const filtered = res.data.filter(p => p.active && p.category?.active);
      const mapped = filtered.map((product) => ({
        ...product,
        imageUrl: product.imageUrl || "",
      }));
      setProducts(mapped);
      
    })
    .catch((err) => {
      console.error("Error loading products:", err);
      alert("Failed to load products.");
    })
    .finally(() => setLoading(false));
};


  const fetchCategories = () => {
    axios.get("http://localhost:8080/admin/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch error:", err));
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:8080/cart/add", null, {
        params: { userId: Number(userId), productId, quantity: 1 },
      });
      alert("Product added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add to cart.");
    }
  };

 const filterByCategory = async (categoryName) => {
  setSelectedCategory(categoryName);
  setLoading(true);
  try {
    const res = await axios.get(`http://localhost:8080/admin/products/category/${categoryName}`);
    const filtered = res.data.filter(p => p.active && p.category?.active);
    setProducts(filtered);
  } catch (err) {
    console.error("Category filter error:", err);
    alert("Failed to load products for category: " + categoryName);
  } finally {
    setLoading(false);
  }
};


  return (
   <div className="container mt-5">
  <h2 className="text-center">Welcome to Shopfinity!</h2>

      {/* Category List */}
      <div className="row row-cols-2 row-cols-md-5 g-3 mb-4">
        {categories.map((cat) => (
          <div className="col" key={cat.id}>
            <button
  onClick={() => filterByCategory(cat.name)}
  className={`category-button ${
    selectedCategory === cat.name ? "selected" : ""
  }`}
>
  <img
    src={`http://localhost:8080/${cat.imageUrl}`}
    alt={cat.name}
  />
  <small>{cat.name}</small>
</button>

          </div>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4" key={product.id}>
              <Product {...product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
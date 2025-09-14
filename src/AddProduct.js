import React, { useEffect, useState } from "react";
import axios from "axios";

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    categoryId: "",
    active: true,
    imageFile: null,
  });
  const [message, setMessage] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/admin/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "imageFile" && value) {
        payload.append("imageFile", value);
      } else if (typeof value === "boolean") {
        payload.append(key, value.toString());
      } else {
        payload.append(key, String(value));
      }
    });

    try {
      await axios.post("http://localhost:8080/admin/products", payload);
      setMessage("✅ Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        discount: "",
        categoryId: "",
        active: true,
        imageFile: null,
      });
    } catch (err) {
      console.error("Add product error:", err);
      setMessage("❌ Failed to add product.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-3">
            <h4 className="mb-3 text-center">Add Product</h4>

            {message && (
              <div
                className={`alert ${
                  message.includes("successfully") ? "alert-success" : "alert-danger"
                } py-1 mb-2`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-2">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-sm"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control form-control-sm"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control form-control-sm"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  className="form-control form-control-sm"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Category</label>
                <select
                  name="categoryId"
                  className="form-select form-select-sm"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="active"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="activeCheck">
                  Active
                </label>
              </div>

              <div className="mb-2">
                <label className="form-label">Product Image</label>
                <input
                  className="form-control form-control-sm"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn btn-sm btn-primary w-100">
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;

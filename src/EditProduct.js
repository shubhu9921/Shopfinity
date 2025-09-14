import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    categoryId: "",
    active: true,
    imageFile: null,
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/admin/products/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          discount: data.discount,
          categoryId: data.category?.id || "",
          active: data.active,
          imageFile: null,
        });
        setPreview(`http://localhost:8080/${data.imageUrl}`);
      })
      .catch((err) => {
        console.error("Product fetch error:", err);
        setMessage("❌ Failed to load product.");
      });

    axios.get("http://localhost:8080/admin/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch error:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "imageFile" && value) {
        payload.append("imageFile", value);
      } else {
        payload.append(key, typeof value === "boolean" ? String(value) : value);
      }
    });

    try {
      await axios.put(`http://localhost:8080/admin/products/update/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product updated successfully!");
      navigate("/admin/show_products");
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Failed to update product. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
// ...rest of imports and component code remain unchanged

return (
  <div className="container mt-4" style={{ maxWidth: "600px" }}>
    <div className="container mt-4 edit-product-container">
      

      <div className="card-body" style={{ padding: "1rem 1rem" }}>
        {message && (
          <div className="alert alert-danger py-1 mb-2 text-center">{message}</div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div
        className="card-header text-white text-center py-2"
        style={{
          backgroundColor: "#5a3476",
          border: "2px solid #5a3476",
          borderRadius: "4px",
        }}
      >
        <h5 className="mb-0">✏️ Edit Product</h5>
      </div>
          <div className="mb-2"> {/* Reduced from mb-3 */}
            <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
              Product Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              style={{ padding: "6px 10px", fontSize: "0.9rem" }}
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
              Description
            </label>
            <textarea
              name="description"
              className="form-control"
              rows="2"  // reduced from 3
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter description"
              style={{ padding: "6px 10px", fontSize: "0.9rem" }}
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
              Price
            </label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Enter price"
              style={{ padding: "6px 10px", fontSize: "0.9rem" }}
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              className="form-control"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Optional"
              style={{ padding: "6px 10px", fontSize: "0.9rem" }}
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
              Category
            </label>
            <select
              name="categoryId"
              className="form-select"
              value={formData.categoryId}
              onChange={handleChange}
              required
              style={{ fontSize: "0.9rem" }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              name="active"
              id="activeCheck"
              checked={formData.active}
              onChange={handleChange}
              style={{ cursor: "pointer" }}
            />
            <label
              className="form-check-label"
              htmlFor="activeCheck"
              style={{ fontSize: "0.9rem", cursor: "pointer" }}
            >
              Active Status
            </label>
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
              Product Image
            </label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ fontSize: "0.9rem" }}
            />
            <div className="text-center mt-1">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{
                    height: "50px", // reduced height
                    width: "70px",  // reduced width
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              ) : (
                <span className="text-muted fst-italic" style={{ fontSize: "0.8rem" }}>
                  No image
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 text-white"
            style={{
              backgroundColor: "#5a3476",
              border: "2px solid #5a3476",
              borderRadius: "4px",
              fontSize: "1rem",
              padding: "8px 0",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  </div>
);

}

export default EditProduct;

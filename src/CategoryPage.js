import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    active: true,
    imageFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Show success message if passed via navigation state (e.g. from EditCategory)
  useEffect(() => {
    if (location.state?.successMessage) {
      setMessage(location.state.successMessage);
      // Clear message after 3 seconds
      const timer = setTimeout(() => setMessage(""), 3000);
      // Clear the location state so message doesn't persist on back/forward navigation
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost:8080/admin/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

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
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("active", formData.active.toString());
    if (formData.imageFile) {
      payload.append("imageFile", formData.imageFile);
    }

    try {
      await axios.post("http://localhost:8080/admin/categories", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Category added successfully!");
      setFormData({ name: "", active: true, imageFile: null });
      setPreviewUrl(null);
      fetchCategories();
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      const msg = error.response?.data || "Failed to add category.";
      console.error("Error:", msg);
      setMessage("❌ " + msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:8080/admin/categories/${id}`);
      setMessage("🗑️ Category deleted.");
      fetchCategories();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      const msg = error.response?.data || "Something went wrong!";
      console.error("Delete Error:", msg);
      setMessage(`❌ Failed to delete category. ${msg}`);
    }
  };

  const handleEdit = (cat) => {
    navigate(`/edit-category/${cat.id}`);
  };

  return (
    <div className="container mt-3">
      {/* Form Section */}
      <div className="card shadow-sm p-3 mb-4">
        <h4 className="text-center mb-3">Add New Category</h4>
        {message && (
          <div
            className={`alert ${
              message.includes("✅") || message.includes("🗑️")
                ? "alert-success"
                : "alert-danger"
            } py-2`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-2">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              name="name"
              className="form-control form-control-sm"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
            <label className="form-label">Category Image</label>
            <input
              className="form-control form-control-sm"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="text-center mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ height: "60px", width: "80px", objectFit: "cover" }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-sm btn-primary w-100">
            Add Category
          </button>
        </form>
      </div>

      {/* Table Section */}
<h4 className="mb-4 fw-semibold">📂 All Categories</h4>

{categories.length === 0 ? (
  <p className="text-muted">No categories available.</p>
) : (
  <div className="card shadow-sm border-0">
    <div className="card-body p-3 table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Status</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr
              key={cat.id}
              className={cat.active ? "table-light" : "table-secondary"}
            >
              <td>{index + 1}</td>
              <td className="fw-semibold">{cat.name}</td>
              <td>
                <span
                  className={`badge px-3 py-1 ${
                    cat.active ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {cat.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                {cat.imageUrl ? (
                  <img
                    src={`http://localhost:8080/${cat.imageUrl}`}
                    alt={cat.name}
                    className="img-thumbnail"
                    style={{
                      height: "50px",
                      width: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                    onError={(e) => (e.target.src = "/default.jpg")}
                  />
                ) : (
                  <span className="text-muted fst-italic">No image</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(cat)}
                >
                  <i className="bi bi-pencil-square me-1"></i>Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(cat.id)}
                >
                  <i className="bi bi-trash-fill me-1"></i>Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
    </div>
  );
}

export default CategoryPage;

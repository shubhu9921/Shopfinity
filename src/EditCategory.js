import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    active: true,
    imageFile: null,
  });
  const [existingImage, setExistingImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/admin/categories/${id}`)
      .then(res => {
        const category = res.data;
        setFormData({
          name: category.name || "",
          active: category.active ?? true,
          imageFile: null,
        });
        setExistingImage(category.imageUrl ? `http://localhost:8080/${category.imageUrl}` : null);
      })
      .catch(err => {
        console.error("Error loading category:", err);
        setMessage("❌ Failed to load category.");
      });
  }, [id]);

  // Cleanup object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, imageFile: file }));
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
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
      await axios.put(`http://localhost:8080/admin/categories/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
     navigate("/admin/categories", { state: { successMessage: "✅ Category updated successfully!" } });

    } catch (error) {
      console.error("Error updating category:", error.response?.data || error.message);
      setMessage("❌ Failed to update category.");
    }
  };

 return (
  <div className="container mt-5" style={{ maxWidth: "600px" }}>
    <div className="card shadow border-0">
      <div
        className="card-header text-white text-center py-2"
        style={{ backgroundColor: "#5a3476" }} // 🔁 Replaced bg-success with logo color
      >
        <h5 className="mb-0">✏️ Edit Category</h5>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label fw-semibold">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter category name"
            />
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="active"
              id="activeSwitch"
              checked={formData.active}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="activeSwitch">
              Active Status
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Category Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
            <div className="text-center mt-2">
              {(previewUrl || existingImage) ? (
                <img
                  src={previewUrl || existingImage}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{
                    height: "70px",
                    width: "90px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              ) : (
                <span className="text-muted fst-italic">No image</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#5a3476",
              color: "#fff",
              fontWeight: "600",
              border: "none",
            }}
          >
            Update Category
          </button>
        </form>
      </div>
    </div>
  </div>
);


}

export default EditCategory;

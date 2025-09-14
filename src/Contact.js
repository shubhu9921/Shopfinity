import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/user/contact-us", form);
      alert("✅ Message submitted successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      alert("❌ Failed to submit message.");
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-card shadow">
        <div className="contact-header">
          <h2 className="text-center mb-4">📬 Contact Us</h2>
          <p className="text-muted text-center">
            We'd love to hear from you. Fill out the form below and we’ll respond soon.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Message</label>
            <textarea
              className="form-control"
              rows="4"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Your message..."
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;

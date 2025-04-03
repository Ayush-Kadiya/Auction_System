import React, { useState } from "react";
import axios from "axios";
import "./ContactUs.css";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/contact", formData);
      alert("Your issue has been submitted successfully!");
      setFormData({ name: "", email: "", issue: "" });
    } catch (error) {
      alert("Failed to submit your issue. Please try again.");
    }
  };

  return (
    <div className="contact-us-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="issue">Write Your Issue</label>
          <textarea
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

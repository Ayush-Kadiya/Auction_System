import React, { useState } from "react";
import axios from "axios";
import "./ContactUs.css";

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post("/api/v1/contact", formData);
      if (response.data.status === "success") {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", issue: "" });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions? We'd love to hear from you.</p>
      </div>

      <div className="contact-main">
        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Location</h3>
              <p>SAL Education, Science City Rd</p>
              <p>Ahmedabad, Gujarat</p>
            </div>
          </div>

          <div className="info-item">
            <i className="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>+91 XXXXXXXXXX</p>
              <p>Mon-Fri, 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>support@auction.com</p>
              <p>info@auction.com</p>
            </div>
          </div>

          <div className="social-links">
            <a href="#" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <div className="input-container">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
            {/* </div>

            <div className="form-group"> */}
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            {/* </div>

            <div className="form-group"> */}
              <label htmlFor="issue">Write Your Issue</label>
              <div className="input-container">
                <i className="fas fa-comment-alt"></i>
                <textarea
                  id="issue"
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  required
                  placeholder="Describe your issue here"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus && (
              <div className={`status-message ${submitStatus}`}>
                {submitStatus === 'success' 
                  ? 'Message sent successfully!' 
                  : 'Failed to send message. Please try again.'}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

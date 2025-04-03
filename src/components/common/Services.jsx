import React from "react";
import "./Services.css";

export const Services = () => {
  const services = [
    {
      title: "Online Auctions",
      description: "Participate in live auctions from the comfort of your home.",
      icon: "📦",
    },
    {
      title: "Product Listings",
      description: "Easily list your products for auction.",
      icon: "📝",
    },
    {
      title: "Secure Transactions",
      description: "Experience safe and secure payment methods.",
      icon: "🔒",
    },
    {
      title: "Real-Time Bidding",
      description: "Enjoy real-time bidding with instant updates.",
      icon: "⏱️",
    },
    {
      title: "User Profiles",
      description: "Manage your profile and track your auction history.",
      icon: "👤",
    },
    {
      title: "Customer Support",
      description: "Get 24/7 support for all your auction needs.",
      icon: "📞",
    },
  ];

  return (
    <div className="services-container">
      <h2>Our Services</h2>
      <p>Explore the wide range of services we offer to enhance your auction experience.</p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from "react";
import "./Services.css";

export const Services = () => {
  const services = [
    {
      title: "Live Online Auctions",
      description: "Experience the thrill of real-time bidding from anywhere in the world. Our live auction platform provides seamless participation and instant updates.",
      icon: "🌐",
    },
    {
      title: "Smart Product Listings",
      description: "List your items with our intelligent system that helps you reach the right buyers and maximize your selling potential.",
      icon: "📱",
    },
    {
      title: "Secure Transactions",
      description: "Enjoy peace of mind with our bank-grade security systems and encrypted payment gateways for all transactions.",
      icon: "🔒",
    },
    {
      title: "Real-Time Analytics",
      description: "Track your bids, monitor market trends, and make informed decisions with our advanced analytics dashboard.",
      icon: "📊",
    },
    {
      title: "Premium Membership",
      description: "Access exclusive auctions, priority customer support, and special features with our premium membership options.",
      icon: "⭐",
    },
    {
      title: "24/7 Expert Support",
      description: "Get round-the-clock assistance from our dedicated team of auction experts and customer support specialists.",
      icon: "💬",
    },
  ];

  return (
    <div className="services-container">
      <h2>Our Premium Services</h2>
      <p>
        Discover our comprehensive suite of auction services designed to provide you
        with the ultimate online bidding experience. From secure transactions to
        real-time analytics, we've got everything you need to succeed.
      </p>
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

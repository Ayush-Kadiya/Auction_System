import React from "react";
import { NavLink } from "react-router-dom";
import { FaGavel, FaHome, FaUser } from "react-icons/fa";
import "../layouts/navbar.css";

export const UserNavbar = () => {
  return (
    <nav className="app-header navbar navbar-expand bg-body sticky-top">
        <NavLink to="/" className="navbar-brand">
          <FaGavel className="brand-icon" /> Online Auction System
        </NavLink>
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/user" className="nav-link">
               Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/user/lots" className="nav-link">
              Lots
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/bid-buy" className="nav-link">
               Bid & Buy
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className="nav-link">
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/services" className="nav-link">
              Services
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-link">
              Contact Us
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/bid-status" className="nav-link">
              Bid Status
            </NavLink>
          </li>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item user-menu">
            <span className="nav-link">
              <FaUser /> My Profile
            </span>
            <div className="dropdown-menu">
              <NavLink to="/profile" className="dropdown-item">
                User Profile
              </NavLink>
              <NavLink to="/logout" className="dropdown-item">
                Logout
              </NavLink>
            </div>
          </li>
        </ul>
        </ul>
      </div>
    </nav>
  );
};
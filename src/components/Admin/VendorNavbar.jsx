import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./css/VendorNavbar.css"; // Import the CSS file for styling

export const VendorNavbar = () => {
  return (
    <div className="vendor-navbar">
      <nav className="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/admin">
            Admin Panel
          </NavLink>
          {/* <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/add-auction">
                  Add Auction
                </NavLink>
                <NavLink className="nav-link" to="/admin/Show-all-users">
                  Show User
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

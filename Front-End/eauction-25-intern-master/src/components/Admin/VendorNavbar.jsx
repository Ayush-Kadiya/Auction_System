import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaGavel, FaUsers, FaCog, FaSignOutAlt, FaPlusCircle, FaBars, FaTimes } from "react-icons/fa";
import "./css/VendorNavbar.css";

export const VendorNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`vendor-layout ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <aside className="vendor-sidebar">
        <div className="sidebar-top">
          <h1 className="vendor-title">ADMIN PANEL</h1>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="vendor-nav">
          <NavLink 
            to="/admin/add-auction" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-link-content">
              <FaPlusCircle className="nav-link-icon" />
              <span className="nav-link-text">Add Auction</span>
            </div>
          </NavLink>

          <NavLink 
            to="/admin/Show-all-users" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-link-content">
              <FaUsers className="nav-link-icon" />
              <span className="nav-link-text">Show User</span>
            </div>
          </NavLink>

          <NavLink 
            to="/admin/update-auction" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-link-content">
              <FaGavel className="nav-link-icon" />
              <span className="nav-link-text">Update Auction</span>
            </div>
          </NavLink>

          {/* <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-link-content">
              <FaCog className="nav-link-icon" />
              <span className="nav-link-text">Settings</span>
            </div>
          </NavLink> */}

          <NavLink 
            to="/admin/logout" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-link-content">
              <FaSignOutAlt className="nav-link-icon" />
              <span className="nav-link-text">Logout</span>
            </div>
          </NavLink>
        </nav>
      </aside>

      <main className="vendor-main">
        <Outlet />
      </main>
    </div>
  );
};

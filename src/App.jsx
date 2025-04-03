import { useState } from "react";

// import "./assets/css/adminlte.css";
// import "./assets/css/adminlte.min.css";
import "./assets/css/signup.css";
import "./assets/css/login.css";
// import "./components/layouts/homepage.css";
import "./components/layouts/navbar.css";

import { UserSidebar } from "./components/layouts/UserSidebar";
import { UserNavbar } from "./components/layouts/UserNavbar";
import { Route, Routes } from "react-router-dom";
import { UserDashboard } from "./components/user/UserDashboard";
import { AddProduct } from "./components/Admin/AddProduct";
// import { VenderSidebar } from "./components/vendor/VendorSidebar";
import { Signup } from "./components/common/Signup";
import axios from "axios";
import { Login } from "./components/common/Login";
import PrivateAdminRoutes from "./components/hooks/PrivateAdminRoutes";
import PrivateUserRoutes from "./components/hooks/PrivateUserRoutes";
// import PrivateVendorRoutes from "./components/hooks/PrivateVendorRoutes";
import { AdminSignup } from "../src/components/Admin/AdminSignup";
import { VendorNavbar } from "../src/components/Admin/VendorNavbar";
import AddAuction from "../src/components/Admin/AddAuction"; // Ensure the path and export type are correct
import AuctionList from "./components/layouts/AuctionList"; // Use default import
import { About } from "./components/common/About";
import { ContactUs } from "./components/common/ContactUs";
import { Services } from "./components/common/Services";
import UserProfile from "./pages/UserProfile";
import BidBuy from "./components/pages/BidBuy"; // Use default import
import ShowAllUsers from "./components/Admin/ShowAllUser";

import { ResetPassword } from "./components/common/ReasetPassword";
import { BidStatus } from "./components/pages/BidStatus";

function App() {
  axios.defaults.baseURL = "http://localhost:8000";

  return (
    <div className="layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded">
      <UserNavbar /> {/* Ensure the navbar is included here */}
      <div className="app-wrapper">
        <Routes>
          <Route path="/adminsignup" element={<AdminSignup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword/:token" element ={<ResetPassword/>}></Route>
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/about" element={<About />} /> {/* New Route */}
          <Route path="/contact" element={<ContactUs />} /> {/* Fixed Route */}
          <Route path="/services" element={<Services />} /> {/* Add missing route */}
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/bid-buy" element={<BidBuy />} />
          <Route path="/bid-status" element={<BidStatus />} /> {/* Default Route */}

          <Route element={<PrivateUserRoutes />}>
            <Route path="/user" element={<UserSidebar />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="lots" element={<AuctionList />} /> {/* Correct Route */}
            </Route>
          </Route>

          <Route element={<PrivateAdminRoutes />}>
            <Route path="/admin" element={<VendorNavbar />}>
              <Route path="add-item" element={<AddProduct />} />
              <Route path="add-auction" element={<AddAuction />} />
              <Route path="all-users" element={<ShowAllUsers />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;

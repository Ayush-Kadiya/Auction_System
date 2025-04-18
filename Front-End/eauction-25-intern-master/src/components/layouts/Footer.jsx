import React from "react";

export const Footer = () => {
  return (
    <footer className="py-5" style={{ backgroundColor: "#f8fbff" }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Online Auction System</h5>
            <p>SAL Education</p>
            <p>Science City Rd, Ahmedabad</p>
            <p>Gujarat 3800XX</p>
            <p>Phone: +91 XXXXXXXXXX</p>
            <p>Email: XXXXXXXXXX@gmail.com</p>
          </div>
          <div className="col-md-2">
            <h5>Useful Links</h5>
            <ul className="list-unstyled">
              <li>About us</li>
              <li>Services</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="col-md-2">
            <h5>Our Services</h5>
            <ul className="list-unstyled">
              <li>Sign In</li>
              <li>Register</li>
              <li>Active Auctions</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Stay Connected</h5>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-primary btn-sm">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="btn btn-outline-primary btn-sm">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="btn btn-outline-primary btn-sm">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="btn btn-outline-primary btn-sm">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>&copy; 2023 Online Auction System. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

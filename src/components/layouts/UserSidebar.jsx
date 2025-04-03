import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Auction1 from "../images/auction1.png"; 
import "../layouts/homepage.css";

export const UserSidebar = () => {
  return (
    <>
      <section id="header" className="d-flex align-items-center homepg">
        <div className="container-fluid nav_bg">
          <div className="row">
            <div className="col-10 mx-auto">
              <div id="contentmain" className="row">

                {/* {Left Side contant} */}
                <div 
                  id="leftcontent"
                  className="col-md-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex justify-content-center flex-column"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <h1>
                    {" "}
                    Bid and sell items with{" "}
                    <strong className="brand-name">
                      <br />
                      Online Auction
                    </strong>
                  </h1>

                  <h2 className="my-3">
                    An online auction is a service in which auction users or
                    participants sell or bid for products or services via
                    the Internet.
                  </h2>
                  <div className="mt-3">
                    <NavLink to="/signup" className="btn-get-started">
                      Get Started
                    </NavLink>
                  </div>
                </div>

                {/* {Right Side Image} */}
                <div
                  className="col-lg-6 order-1 order-lg-2 header-img"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <img
                    src={Auction1}
                    className="img-fluid animated hedrimg"
                    alt="auction img"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="app-main">
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="newsletter">
          <h3>Join Our Newsletter</h3>
          <p>Be the first to know about exciting new Auctions, special events, and much more</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <h5>Online Auction System</h5>
              <p>SAL Education</p>
              <p>Science City Rd, Ahmedabad</p>
              <p>Gujarat 3800XX</p>
              <p><strong>Phone:</strong> +91 XXXXXXXXXX</p>
              <p><strong>Email:</strong> XXXXXXXXXX@gmail.com</p>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5>Useful Links</h5>
              <ul>
                <li><NavLink to="/about">About us</NavLink></li>
                <li><NavLink to="/services">Services</NavLink></li>
                <li><NavLink to="/contact">Contact Us</NavLink></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5>Our Services</h5>
              <ul>
                <li><NavLink to="/signin">Sign In</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
                <li><NavLink to="/active-auctions">Active Auctions</NavLink></li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-6">
              <h5>Stay Connected</h5>
              <p>Auction Blogs</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fas fa-envelope"></i></a>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p>© Copyright <strong>Online Auction System</strong>. All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </>
  );
};


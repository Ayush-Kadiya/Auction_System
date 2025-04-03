import React from "react";
import "./About.css";

export const About = () => {
    return (
        <div className="about-container">
            <h1>About Online Auction System</h1>
            <p>
                Welcome to the Online Auction System! Our platform allows users to bid on a variety of items in real-time auctions. 
                Whether you're looking to buy or sell, our system provides a seamless and transparent experience.
            </p>
            <h2>How to Participate</h2>
            <ol>
                <li>Sign up for an account and log in.</li>
                <li>Browse available auctions under the "Lots" section.</li>
                <li>Place your bid on the item you are interested in.</li>
                <li>Track your bids under the "Bid Status" section.</li>
                <li>Win the auction and complete the purchase!</li>
            </ol>
            <p>
                Our platform ensures fair bidding practices and provides a secure environment for all users. 
                Start exploring today and enjoy the thrill of online auctions!
            </p>
        </div>
    );
};

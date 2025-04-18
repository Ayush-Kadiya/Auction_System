import React from "react";
import "./About.css";

export const About = () => {
    return (
        <div className="about-container">
            <h1>About Online Auction System</h1>
            <p>
                Welcome to the <span className="highlight">Online Auction System</span>! Our platform provides a 
                state-of-the-art digital marketplace where users can participate in real-time auctions. 
                We combine cutting-edge technology with user-friendly design to create an exceptional 
                bidding experience for both buyers and sellers.
            </p>
            
            <h2>How to Participate</h2>
            <ol>
                <li>Create your account and complete the verification process to start your auction journey.</li>
                <li>Explore our extensive collection of auctions in the <span className="highlight">"Lots"</span> section.</li>
                <li>Place competitive bids on items that catch your interest.</li>
                <li>Monitor your active bids in real-time through the <span className="highlight">"Bid Status"</span> dashboard.</li>
                <li>Win auctions and securely complete your purchases!</li>
            </ol>

            <h2>Why Choose Us?</h2>
            <p>
                Our platform stands out with its <span className="highlight">secure bidding environment</span>, 
                <span className="highlight">real-time updates</span>, and <span className="highlight">transparent 
                transaction system</span>. We ensure fair practices and provide robust support to make your 
                auction experience seamless and enjoyable.
            </p>
            
            <p>
                Start exploring our diverse range of auctions today and experience the thrill of competitive 
                bidding in a modern, secure environment. Whether you're a seasoned collector or new to online 
                auctions, our platform is designed to meet your needs.
            </p>
        </div>
    );
};

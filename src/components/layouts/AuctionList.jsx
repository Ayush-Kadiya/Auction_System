import React, { useEffect, useState } from "react";

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch("http://localhost:8000/auction/");
                const data = await response.json();
                setAuctions(data);
            } catch (error) {
                console.error("Error fetching auctions:", error);
            }
        };

        fetchAuctions();
    }, []);

    return (
        <div>
            <h1>Auctions</h1>
            <div>
                {Array.isArray(auctions) && auctions.map((auction) => (
                    <div key={auction.id}>
                        <h2>{auction.title}</h2>
                        <p>{auction.description}</p>
                        <p>Starting Bid: {auction.starting_bid}</p>
                        <p>Start Time: {auction.start_time}</p>
                        <p>End Time: {auction.end_time}</p>
                        <p>Created By: {auction.created_by}</p>
                        {auction.image && <img src={auction.image} alt={auction.title} style={{ width: "200px" }} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuctionList;
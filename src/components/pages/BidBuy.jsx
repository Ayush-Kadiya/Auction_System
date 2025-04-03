import React, { useState, useEffect } from "react";
import "./bidbuy.css";
import AuctionList from "../layouts/AuctionList"; // Ensure the path and export type are correct

const BidBuy = () => {
  const [auctions, setAuctions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const fetchAuctions = async () => {
    try {
      const params = new URLSearchParams({
        search,
        category,
        min_price: minPrice,
        max_price: maxPrice,
        sort_by: sortBy,
        order,
      });
      const response = await fetch(`http://127.0.0.1:8000/auctions/?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }
      const data = await response.json();
      setAuctions(data);
    } catch (error) {
      console.error("Error fetching auctions:", error.message);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [search, category, minPrice, maxPrice, sortBy, order]);

  return (
    <div className="bid-buy-container">
      <h1 className="bid-buy-title">AUCTIONS</h1>
      <p className="bid-buy-subtitle">Start Bidding Now!</p>
      <div className="search-section">
        <div className="search-bar">
          <span className="auctions-found">AUCTIONS FOUND</span>
          <input
            type="text"
            placeholder="Looking for an Auction? Search Now"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-button" onClick={fetchAuctions}>
            Search
          </button>
        </div>
      </div>
      <div className="filters">
        <h2 className="filters-title">Filters</h2>
        <div className="filter-category">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Vehicles</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div className="filter-price">
          <label>Price</label>
          <input
            type="range"
            min="0"
            max="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <div className="price-range">
            <span>0</span>
            <span>{maxPrice}</span>
          </div>
        </div>
        <div className="filter-name">
          <label>Name</label>
          <div>
            <input
              type="radio"
              name="name"
              id="a-to-z"
              checked={sortBy === "name" && order === "asc"}
              onChange={() => {
                setSortBy("name");
                setOrder("asc");
              }}
            />
            <label htmlFor="a-to-z">From A to Z</label>
            <input
              type="radio"
              name="name"
              id="z-to-a"
              checked={sortBy === "name" && order === "desc"}
              onChange={() => {
                setSortBy("name");
                setOrder("desc");
              }}
            />
            <label htmlFor="z-to-a">From Z to A</label>
          </div>
        </div>
        <div className="filter-date">
          <label>Date</label>
          <div>
            <input
              type="radio"
              name="date"
              id="oldest-to-newest"
              checked={sortBy === "date" && order === "asc"}
              onChange={() => {
                setSortBy("date");
                setOrder("asc");
              }}
            />
            <label htmlFor="oldest-to-newest">From Oldest to Newest</label>
            <input
              type="radio"
              name="date"
              id="newest-to-oldest"
              checked={sortBy === "date" && order === "desc"}
              onChange={() => {
                setSortBy("date");
                setOrder("desc");
              }}
            />
            <label htmlFor="newest-to-oldest">From Newest to Oldest</label>
          </div>
        </div>
      </div>
      <AuctionList auctions={auctions} />
    </div>
  );
};

export default BidBuy;

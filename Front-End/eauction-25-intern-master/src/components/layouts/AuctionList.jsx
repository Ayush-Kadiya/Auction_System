import React, { useEffect, useState } from "react";
import "./AuctionList.css";
import { useNavigate } from "react-router-dom";

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [popupImage, setPopupImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active'); // 'active', 'upcoming', 'ended'

    const navigate = useNavigate();

    const getAuctionStatus = (auction) => {
        const currentTime = new Date().getTime();
        const startTime = new Date(auction.start_time).getTime();
        const endTime = new Date(auction.end_time).getTime();

        if (currentTime < startTime) return 'upcoming';
        if (currentTime > endTime) return 'ended';
        return 'active';
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeRemaining = (endTime) => {
        const remaining = new Date(endTime).getTime() - new Date().getTime();
        if (remaining <= 0) return 'Auction ended';

        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h remaining`;
        if (hours > 0) return `${hours}h ${minutes}m remaining`;
        return `${minutes}m remaining`;
    };

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:8000/auction/");
                const data = await response.json();
                
                // Add status to each auction
                const auctionsWithStatus = data.map(auction => ({
                    ...auction,
                    status: getAuctionStatus(auction)
                }));
                
                setAuctions(auctionsWithStatus);
            } catch (error) {
                console.error("Error fetching auctions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
        
        // Refresh auction statuses every minute
        const intervalId = setInterval(fetchAuctions, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleMouseEnter = (image) => {
        setPopupImage(image);
    };

    const handleMouseLeave = () => {
        setPopupImage(null);
    };

    const handleImageClick = (image) => {
        setPopupImage(image);
    };

    const handlePopupClick = (e) => {
        if (e.target.classList.contains('image-popup')) {
            setPopupImage(null);
        }
    };

    const handleBidClick = (auction) => {
        if (auction.status === 'active') {
            // Check if user is logged in
            const userId = localStorage.getItem('id');
            const role = localStorage.getItem('role');

            if (!userId || role !== 'USER') {
                alert('Please login as a user to place a bid');
                navigate('/login');
                return;
            }

            // Navigate to BidBuy with auction details
            navigate(`/bid-buy`);
        }
    };

    const filteredAuctions = auctions.filter(auction => {
        if (filter === 'all') return true;
        return auction.status === filter;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading auctions...</p>
            </div>
        );
    }

    return (
        <div className="auction-list-container">
            <h1 className="auction-list-title">Auction List</h1>
            <div className="filter-buttons">
                <button 
                    className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Active Auctions
                </button>
                <button 
                    className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setFilter('upcoming')}
                >
                    Upcoming Auctions
                </button>
                <button 
                    className={`filter-btn ${filter === 'ended' ? 'active' : ''}`}
                    onClick={() => setFilter('ended')}
                >
                    Ended Auctions
                </button>
                <button 
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Auctions
                </button>
            </div>
            
            {filteredAuctions.length === 0 ? (
                <div className="no-auctions">
                    <p>No {filter} auctions available at the moment.</p>
                </div>
            ) : (
                <div className="auction-cards">
                    {filteredAuctions.map((auction) => (
                        <div className={`auction-card ${auction.status}`} key={auction.id}>
                            <div className="auction-card-image-container">
                                <div
                                    className="auction-card-image"
                                    onClick={() => handleImageClick(auction.image)}
                                >
                                    {auction.image && (
                                        <>
                                            <img src={auction.image} alt={auction.title} />
                                            <div className="image-overlay">
                                                <div className="overlay-content">
                                                    <i className="zoom-icon">🔍</i>
                                                    <span>Click to Zoom</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="auction-card-content">
                                <div className="auction-card-header">
                                    <h2 className="auction-card-title">{auction.title}</h2>
                                    <span className={`auction-status-badge ${auction.status}`}>
                                        {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                                    </span>
                                </div>
                                <p className="auction-card-description">{auction.description}</p>
                                <p className="auction-card-detail">
                                    Starting Bid: <strong>₹{auction.starting_bid}</strong>
                                </p>
                                <p className="auction-card-detail">
                                    Current Highest Bid: <strong>₹{auction.current_highest_bid || auction.starting_bid}</strong>
                                </p>
                                <p className="auction-card-detail">
                                    Start Time: {formatDateTime(auction.start_time)}
                                </p>
                                <p className="auction-card-detail">
                                    End Time: {formatDateTime(auction.end_time)}
                                </p>
                                {auction.status === 'active' && (
                                    <p className="auction-time-remaining">
                                        {getTimeRemaining(auction.end_time)}
                                    </p>
                                )}
                                <p className="auction-card-detail">Created By: {auction.created_by}</p>
                                <p className="auction-card-detail">
                                    Category: {auction.category ? auction.category : "N/A"}
                                </p>
                                <button 
                                    className={`btn ${auction.status === 'active' ? 'btn-primary' : 'btn-disabled'}`}
                                    onClick={() => handleBidClick(auction)}
                                    disabled={auction.status !== 'active'}
                                >
                                    {auction.status === 'active' ? 'Place Bid' : 
                                     auction.status === 'upcoming' ? 'Starting Soon' : 'Auction Ended'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {popupImage && (
                <div className="image-popup" onClick={handlePopupClick}>
                    <div className="popup-content">
                        <img src={popupImage} alt="Enlarged view" />
                        <button className="close-popup" onClick={() => setPopupImage(null)}>×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuctionList;
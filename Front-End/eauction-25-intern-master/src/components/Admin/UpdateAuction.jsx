import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VendorNavbar } from "../Admin/VendorNavbar";
import { FaArrowLeft, FaSearch, FaFilter, FaTimes, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./UpdateAuction.css";

const UpdateAuction = () => {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingAuction, setEditingAuction] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        starting_bid: "",
        start_time: "",
        end_time: "",
        category: "",
        created_by: "",
    });
    const [image, setImage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [auctionToDelete, setAuctionToDelete] = useState(null);

    // Add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch("http://localhost:8000/auction/");
                const data = await response.json();
                setAuctions(data);
            } catch (error) {
                console.error("Error fetching auctions:", error);
                toast.error("Failed to fetch auctions.");
            }
        };

        fetchAuctions();
    }, []);

    const handleEdit = (auction) => {
        setEditingAuction(auction);
        setFormData({
            title: auction.title,
            description: auction.description,
            starting_bid: auction.starting_bid,
            start_time: auction.start_time,
            end_time: auction.end_time,
            category: auction.category,
            created_by: auction.created_by,
        });
        setImage(null);
    };

    const openDeleteModal = (auctionId) => {
        setAuctionToDelete(auctionId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setAuctionToDelete(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!auctionToDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/auction/${auctionToDelete}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete auction.");
            }
            toast.success("Auction deleted successfully!");
            setAuctions(auctions.filter((auction) => auction.id !== auctionToDelete));
        } catch (error) {
            console.error("Error deleting auction:", error);
            toast.error("Error deleting auction.");
        } finally {
            closeDeleteModal();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editingAuction || !editingAuction.id) {
            toast.warn("No auction selected for update.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("starting_bid", formData.starting_bid);
            formDataToSend.append("start_time", formData.start_time);
            formDataToSend.append("end_time", formData.end_time);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("created_by", formData.created_by);
            if (image) {
                formDataToSend.append("image", image);
            }

            const response = await fetch(`http://localhost:8000/auction/${editingAuction.id}`, {
                method: "PUT",
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error("Failed to update auction.");
            }

            toast.success("Auction updated successfully!");
            setEditingAuction(null);
            setAuctions(
                auctions.map((auction) =>
                    auction.id === editingAuction.id
                        ? { ...auction, ...formData, image: image ? URL.createObjectURL(image) : auction.image }
                        : auction
                )
            );
        } catch (error) {
            console.error("Error updating auction:", error);
            toast.error("Error updating auction.");
        }
    };

    // Function to determine auction status
    const getAuctionStatus = (auction) => {
        const now = new Date().getTime();
        const startTime = new Date(auction.start_time).getTime();
        const endTime = new Date(auction.end_time).getTime();

        if (now < startTime) return "upcoming";
        if (now > endTime) return "ended";
        return "active";
    };

    // Filter auctions based on search criteria
    const filteredAuctions = auctions.filter(auction => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchCategory === "all" ? true :
            searchCategory === "title" ? auction.title.toLowerCase().includes(searchLower) :
            searchCategory === "description" ? auction.description.toLowerCase().includes(searchLower) :
            searchCategory === "created_by" ? auction.created_by.toLowerCase().includes(searchLower) : true;

        // Price range filter
        const matchesPrice = (
            (!minPrice || auction.starting_bid >= Number(minPrice)) &&
            (!maxPrice || auction.starting_bid <= Number(maxPrice))
        );

        // Status filter
        const currentStatus = getAuctionStatus(auction);
        const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;

        return matchesSearch && matchesPrice && matchesStatus;
    });

    // Clear all filters function
    const handleClearFilters = () => {
        setSearchTerm("");
        setSearchCategory("all");
        setMinPrice("");
        setMaxPrice("");
        setStatusFilter("all");
    };

    // Check if any filter is active
    const isFiltersActive = () => {
        return searchTerm || 
               searchCategory !== "all" || 
               minPrice || 
               maxPrice || 
               statusFilter !== "all";
    };

    return (
        <div className="ua-container">
            <ToastContainer />
            <header className="ua-header">
                <button 
                    className="ua-back-button"
                    onClick={() => navigate(-1)}
                >
                    <FaChevronLeft />
                    Back
                </button>
                <h1 className="ua-main-title">Update Auctions</h1>
            </header>

            <div className={`ua-sticky-search-wrapper ${isScrolled ? 'scrolled' : ''}`}>
                <div className="ua-sticky-search-content">
                    <div className="ua-search-row">
                        <div className="ua-search-input-container">
                            <div className="ua-search-input-wrapper">
                                <FaSearch className="ua-search-icon" />
                                <input
                                    type="text"
                                    className="ua-search-input"
                                    placeholder="Search auctions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="ua-category-select"
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                <option value="title">Title</option>
                                <option value="description">Description</option>
                                <option value="created_by">Created By</option>
                            </select>
                        </div>
                    </div>
                    <div className="ua-filter-row">
                        <div className="ua-price-range">
                            <FaFilter className="ua-filter-icon" />
                            <input
                                type="number"
                                className="ua-price-input"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span className="ua-price-separator">to</span>
                            <input
                                type="number"
                                className="ua-price-input"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <select
                            className="ua-status-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ended">Ended</option>
                        </select>
                        {isFiltersActive() && (
                            <button
                                className="ua-clear-btn"
                                onClick={handleClearFilters}
                            >
                                <FaTimes />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {editingAuction ? (
                <form
                    onSubmit={handleUpdate}
                    className="update-auction-form"
                >
                    <h2 className="update-auction-form-title">
                        Editing Auction: {editingAuction.title}
                    </h2>
                    <div className="update-auction-form-group">
                        <label className="update-auction-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="update-auction-input"
                        />
                    </div>
                    <div className="update-auction-form-group">
                        <label className="update-auction-label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="update-auction-input update-auction-textarea"
                        />
                    </div>
                    <div className="update-auction-form-group">
                        <label className="update-auction-label">Starting Bid</label>
                        <input
                            type="number"
                            name="starting_bid"
                            value={formData.starting_bid}
                            onChange={handleChange}
                            className="update-auction-input"
                        />
                    </div>
                    <div className="update-auction-form-group">
                        <label className="update-auction-label">Start Time</label>
                        <input
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="update-auction-input"
                        />
                    </div>
                    <div className="update-auction-form-group">
                        <label className="update-auction-label">End Time</label>
                        <input
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            className="update-auction-input"
                        />
                    </div>
                    <div className="update-auction-form-group">
                        <label className="update-auction-label">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="update-auction-input update-auction-select"
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion & Accessories">Fashion & Accessories</option>
                            <option value="Automobiles & Vehicles">Automobiles & Vehicles</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Collectibles & Antiques">Collectibles & Antiques</option>
                            <option value="Sports & Fitness">Sports & Fitness</option>
                            <option value="Luxury Goods">Luxury Goods</option>
                        </select>
                    </div>
                    <div className="update-auction-form-group">
                        <label className="update-auction-label">Created By</label>
                        <input
                            type="text"
                            name="created_by"
                            value={formData.created_by}
                            onChange={handleChange}
                            className="update-auction-input"
                        />
                    </div>
                    <div className="update-auction-form-group">
                        <label className="update-auction-label">Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="update-auction-input"
                        />
                    </div>
                    <div className="update-auction-btn-group">
                        <button
                            type="submit"
                            className="update-auction-submit-btn"
                        >
                            Update Auction
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingAuction(null)}
                            className="update-auction-cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="ua-content">
                    <h2 className="ua-section-title">All Auctions</h2>
                    
                    <div className="update-auction-grid">
                        {filteredAuctions.map((auction) => (
                            <div
                                key={auction.id}
                                className={`update-auction-card ua-status-${getAuctionStatus(auction)}`}
                            >
                                {auction.image && (
                                    <img
                                        src={auction.image}
                                        alt={auction.title}
                                        className="update-auction-card-image"
                                    />
                                )}
                                <div className="update-auction-card-content">
                                    <h3 className="update-auction-card-title">{auction.title}</h3>
                                    <p className="update-auction-card-text">{auction.description}</p>
                                    <p className="update-auction-card-text">
                                        <span className="update-auction-card-label">Starting Bid:</span> ₹{auction.starting_bid}
                                    </p>
                                    <p className="update-auction-card-text">
                                        <span className="update-auction-card-label">Start Time:</span> {auction.start_time}
                                    </p>
                                    <p className="update-auction-card-text">
                                        <span className="update-auction-card-label">End Time:</span> {auction.end_time}
                                    </p>
                                    <p className="update-auction-card-text">
                                        <span className="update-auction-card-label">Category:</span> {auction.category}
                                    </p>
                                    <p className="update-auction-card-text">
                                        <span className="update-auction-card-label">Created By:</span> {auction.created_by}
                                    </p>
                                </div>
                                <div className="update-auction-card-actions">
                                    <button
                                        onClick={() => handleEdit(auction)}
                                        className="update-auction-edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(auction.id)}
                                        className="update-auction-delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="ua-status-badge">
                                    {getAuctionStatus(auction)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="update-auction-modal-overlay">
                    <div className="update-auction-modal">
                        <h3 className="update-auction-modal-title">Are you sure you want to delete this auction?</h3>
                        <div className="update-auction-modal-actions">
                            <button
                                onClick={confirmDelete}
                                className="update-auction-delete-btn"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                className="update-auction-cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateAuction;

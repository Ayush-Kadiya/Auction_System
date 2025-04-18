import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import "./AddAuction.css";

const AddAuction = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        starting_bid: "",
        start_time: "",
        end_time: "",
        created_by: "",
        category: "",
    });
    const [image, setImage] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState("");

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
            setSelectedFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("starting_bid", formData.starting_bid);
            formDataToSend.append("start_time", formData.start_time);
            formDataToSend.append("end_time", formData.end_time);
            formDataToSend.append("created_by", formData.created_by);
            formDataToSend.append("category", formData.category);
            if (image) {
                formDataToSend.append("image", image);
            }

            const response = await fetch("http://localhost:8000/auction/", {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error("Failed to add auction.");
            }

            const result = await response.json();
            alert("Auction added successfully!");
            setFormData({
                title: "",
                description: "",
                starting_bid: "",
                start_time: "",
                end_time: "",
                created_by: "",
                category: "",
            });
            setImage(null);
            setSelectedFileName("");
        } catch (error) {
            console.error("Error adding auction:", error);
            alert("Error adding auction.");
        }
    };

    return (
        <div className="auction-form-container">
            <div className="auction-form-header">
                <h2>Create New Auction</h2>
                <p>Fill in the details below to create a new auction listing</p>
            </div>
            
            <form className="auction-form" onSubmit={handleSubmit}>
                <div className="auction-form-group">
                    <label className="auction-form-label">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="auction-form-input"
                        placeholder="Enter auction title"
                        required
                    />
                </div>

                <div className="auction-form-group">
                    <label className="auction-form-label">Starting Bid</label>
                    <input
                        type="number"
                        name="starting_bid"
                        value={formData.starting_bid}
                        onChange={handleChange}
                        className="auction-form-input"
                        placeholder="Enter starting bid amount"
                        required
                    />
                </div>

                <div className="auction-form-group auction-form-group-full">
                    <label className="auction-form-label">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="auction-form-input auction-form-textarea"
                        placeholder="Enter detailed description of the auction item"
                        required
                    />
                </div>

                <div className="auction-form-group">
                    <label className="auction-form-label">Start Time</label>
                    <div className="auction-form-datetime">
                        <input
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="auction-form-input"
                            required
                        />
                    </div>
                </div>

                <div className="auction-form-group">
                    <label className="auction-form-label">End Time</label>
                    <div className="auction-form-datetime">
                        <input
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            className="auction-form-input"
                            required
                        />
                    </div>
                </div>

                <div className="auction-form-group">
                    <label className="auction-form-label">Created By</label>
                    <input
                        type="text"
                        name="created_by"
                        value={formData.created_by}
                        onChange={handleChange}
                        className="auction-form-input"
                        placeholder="Enter creator's name"
                        required
                    />
                </div>

                <div className="auction-form-group">
                    <label className="auction-form-label">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="auction-form-input auction-form-select"
                        required
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

                <div className="auction-form-group auction-form-group-full">
                    <label className="auction-form-label">Image</label>
                    <div className="auction-form-file-wrapper">
                        <label className="auction-form-file-label">
                            <FaUpload />
                            {selectedFileName || "Choose an image"}
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="auction-form-file-input"
                                accept="image/*"
                            />
                        </label>
                    </div>
                </div>

                <button type="submit" className="auction-form-submit">
                    Create Auction
                </button>
            </form>
        </div>
    );
};

export default AddAuction;
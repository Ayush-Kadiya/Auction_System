import React, { useState } from "react";

const AddAuction = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        starting_bid: "",
        start_time: "",
        end_time: "",
        created_by: "",
    });
    const [image, setImage] = useState(null);

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
            });
            setImage(null);
        } catch (error) {
            console.error("Error adding auction:", error);
            alert("Error adding auction.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Starting Bid</label>
                <input
                    type="number"
                    name="starting_bid"
                    value={formData.starting_bid}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Start Time</label>
                <input
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>End Time</label>
                <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Created By</label>
                <input
                    type="text"
                    name="created_by"
                    value={formData.created_by}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Image</label>
                <input type="file" onChange={handleImageChange} />
            </div>
            <button type="submit">Add Auction</button>
        </form>
    );
};

export default AddAuction;
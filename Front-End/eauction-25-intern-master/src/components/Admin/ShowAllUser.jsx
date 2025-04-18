import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import "./ShowAllUser.css";
import {VendorNavbar} from "../Admin/VendorNavbar"; // Import VendorNavbar
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

const ShowAllUser = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("name");
    const [editUserId, setEditUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        status: false,
        role_id: "",
        email: "",
        password: "",
    });

    const handleBack = () => {
        navigate('/admin/add-auction');
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8000/users/");
                if (!response.ok) {
                    throw new Error("Failed to fetch users.");
                }
                const data = await response.json();
                setUsers(data);
                toast.success("Users fetched successfully.");
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Error fetching users. Please check the console for details.");
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search term and category
    const filteredUsers = users.filter(user => {
        const searchTermLower = searchTerm.toLowerCase();
        switch(searchCategory) {
            case "name":
                return user.firstName.toLowerCase().includes(searchTermLower) || 
                       user.lastName.toLowerCase().includes(searchTermLower);
            case "email":
                return user.email.toLowerCase().includes(searchTermLower);
            case "role":
                const role = user.role_id === "67c9466be0705c710909c285" ? "admin" : "user";
                return role.includes(searchTermLower);
            default:
                return true;
        }
    });

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8000/users/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete user.");
            }

            setUsers(users.filter((user) => user._id !== userId));
            toast.success("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Error deleting user. Please check the console for details.");
        }
    };

    const handleEdit = (user) => {
        setEditUserId(user._id);
        setEditFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            status: user.status,
            role_id: user.role_id,
            email: user.email,
            password: "",
        });
    };

    const handleSave = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8000/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) {
                throw new Error("Failed to update user.");
            }

            const updatedUsers = users.map((user) =>
                user._id === userId ? { ...user, ...editFormData } : user
            );
            setUsers(updatedUsers);
            setEditUserId(null);
            toast.success("User updated successfully.");
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Error updating user. Please check the console for details.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="show-all-users">
                <div className="page-header">
                    <button className="back-button" onClick={handleBack}>
                        <FaArrowLeft /> Back
                    </button>
                    <h1 className="title">All Users</h1>
                </div>

                {/* Search Section */}
                <div className="sau-search-container">
                    <div className="sau-search-wrapper">
                        <div className="sau-search-input-group">
                            <FaSearch className="sau-search-icon" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="sau-search-input"
                            />
                        </div>
                        <select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            className="sau-search-select"
                        >
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="role">Role</option>
                        </select>
                    </div>
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Age</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    {editUserId === user._id ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editFormData.firstName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        user.firstName
                                    )}
                                </td>
                                <td>
                                    {editUserId === user._id ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={editFormData.lastName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        user.lastName
                                    )}
                                </td>
                                <td>
                                    {editUserId === user._id ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={editFormData.age}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        user.age
                                    )}
                                </td>
                                <td>
                                    {editUserId === user._id ? (
                                        <input
                                            type="checkbox"
                                            name="status"
                                            checked={editFormData.status}
                                            onChange={(e) =>
                                                setEditFormData((prev) => ({
                                                    ...prev,
                                                    status: e.target.checked,
                                                }))
                                            }
                                            className="checkbox"
                                        />
                                    ) : (
                                        user.status ? "Active" : "Inactive"
                                    )}
                                </td>
                                <td>
                                    {editUserId === user._id ? (
                                        <input
                                            type="text"
                                            name="role_id"
                                            value={editFormData.role_id}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        user.role_id === "67c9466be0705c710909c285" ? "Admin" : "User"
                                    )}
                                </td>
                                <td>
                                    {editUserId === user._id ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editFormData.email}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {editUserId === user._id ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(user._id)}
                                                className="btn save-btn"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditUserId(null)}
                                                className="btn cancel-btn"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="btn edit-btn"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="btn delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ToastContainer /> {/* Add ToastContainer */}
            </div>
        </>
    );
};

export default ShowAllUser;
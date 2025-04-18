import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all user-related data from localStorage
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("userfname");
        localStorage.removeItem("userlname");

        // Show a toast notification
        toast.success("You have successfully logged out!");

        // Navigate to the login page
        navigate("/login");
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <button
                onClick={handleLogout}
                style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1976d2';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#2196f3';
                    e.target.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Logout;
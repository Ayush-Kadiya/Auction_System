import React, { useEffect, useState } from "react";

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUserProfile() {
            const response = await fetch("http://127.0.0.1:8000/user-profiles/1"); // Replace '1' with dynamic user ID if needed
            const data = await response.json();
            setUser(data);
        }
        fetchUserProfile();
    }, []);

    if (!user) {
        return <p>Loading user profile...</p>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
        </div>
    );
};

export default UserProfile;

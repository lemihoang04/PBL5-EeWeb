import React, { useEffect, useState } from "react";
import { GetAllUser, DeleteUser } from "../../../services/userService";
import { toast } from "react-toastify";
import "./UserManager.css";

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await GetAllUser();
            // If response is an array, set it directly, otherwise use response.data
            if (Array.isArray(response)) {
                setUsers(response);
            } else if (response && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                toast.error("Unable to load user list.");
            }
        } catch (error) {
            toast.error("Error loading user list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await DeleteUser(userId);
                toast.success("User deleted successfully.");
                fetchUsers();
            } catch (error) {
                toast.error("Error deleting user.");
            }
        }
    };

    return (
        <div className="user-manager-container">
            <h2>User Management</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.address}</td>
                                    <td>
                                        {/* Delete button, can add edit button if needed */}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserManager;
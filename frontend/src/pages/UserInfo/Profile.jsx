import React, { useState, useContext, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPencilAlt, FaKey, FaCheckCircle } from 'react-icons/fa';
import { UserContext } from "../../context/UserProvider";
import { EditUser } from '../../services/userService';
import './Profile.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { user, fetchUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user?.account) {
            setFormData({
                name: user.account.name || '',
                email: user.account.email || '',
                phone: user.account.phone || '',
                address: user.account.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await EditUser(user.account.id, formData);
            if (response && response.errCode === 0) {
                fetchUser();
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(response.error || "Failed to update profile.");
            }
        }
        catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating the profile.");
        }
    };

    return (
        <div className="user-profile-container">
            <div className="user-profile-card">
                <div className="user-profile-header">
                    <div className="user-profile-avatar">
                        {user?.account?.name ? user.account.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-profile-title-container">
                        <h1 className="user-profile-title">My Profile</h1>
                        <p className="user-profile-subtitle">Manage your personal information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="user-profile-form">
                    <div className="user-profile-form-content">
                        <div className="user-profile-form-group">
                            <div className="user-profile-label-container">
                                <FaUser className="user-profile-field-icon" />
                                <label htmlFor="name" className="user-profile-label">Full Name</label>
                            </div>
                            <div className="user-profile-input-wrapper">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`user-profile-input ${!isEditing ? 'user-profile-input-readonly' : ''}`}
                                    readOnly={!isEditing}
                                    required
                                />
                            </div>
                        </div>

                        <div className="user-profile-form-group">
                            <div className="user-profile-label-container">
                                <FaEnvelope className="user-profile-field-icon" />
                                <label htmlFor="email" className="user-profile-label">Email Address</label>
                            </div>
                            <div className="user-profile-input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    className="user-profile-input user-profile-input-disabled"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="user-profile-form-group">
                            <div className="user-profile-label-container">
                                <FaPhone className="user-profile-field-icon" />
                                <label htmlFor="phone" className="user-profile-label">Phone Number</label>
                            </div>
                            <div className="user-profile-input-wrapper">
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`user-profile-input ${!isEditing ? 'user-profile-input-readonly' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="user-profile-form-group">
                            <div className="user-profile-label-container">
                                <FaMapMarkerAlt className="user-profile-field-icon" />
                                <label htmlFor="address" className="user-profile-label">Address</label>
                            </div>
                            <div className="user-profile-input-wrapper">
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`user-profile-input ${!isEditing ? 'user-profile-input-readonly' : ''}`}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="user-profile-actions">
                        {!isEditing ? (
                            <>
                                <button
                                    type="button"
                                    className="user-profile-edit-button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <FaPencilAlt className="user-profile-button-icon" />
                                    Edit Profile
                                </button>
                                <button
                                    type="button"
                                    className="user-profile-password-button"
                                    onClick={() => navigate('/change-password', { state: { userId: user.account.id } })}
                                >
                                    <FaKey className="user-profile-button-icon" />
                                    Change Password
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="user-profile-cancel-button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        if (user?.account) {
                                            setFormData({
                                                name: user.account.name || '',
                                                email: user.account.email || '',
                                                phone: user.account.phone || '',
                                                address: user.account.address || ''
                                            });
                                        }
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="user-profile-save-button"
                                >
                                    <FaCheckCircle className="user-profile-button-icon" />
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
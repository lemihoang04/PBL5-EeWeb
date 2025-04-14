import React, { useState, useContext, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaKey } from 'react-icons/fa';
import { UserContext } from "../../context/UserProvider";
import { EditUser } from '../../services/userService';
import './Profile.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

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
                updateUser(formData);
                toast.success("Profile updated successfully!");

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
        <div className="profile_container">
            <h1 className="profile_title">Account Details</h1>

            <form onSubmit={handleSubmit} className="profile_form">
                <div className="profile_form_content">
                    {/* Name Field */}
                    <div className="profile_form_row">
                        <label htmlFor="name" className="profile_label">Name:</label>
                        <div className="profile_input_container">
                            <div className="profile_icon_wrapper">
                                <FaUser size={18} className="profile_field_icon" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="profile_input"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Field (Disabled) */}
                    <div className="profile_form_row">
                        <label htmlFor="email" className="profile_label">Email:</label>
                        <div className="profile_input_container">
                            <div className="profile_icon_wrapper">
                                <FaEnvelope size={18} className="profile_field_icon" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                className="profile_input profile_input_disabled"
                                disabled
                            />
                        </div>
                    </div>

                    {/* Phone Field */}
                    <div className="profile_form_row">
                        <label htmlFor="phone" className="profile_label">Phone:</label>
                        <div className="profile_input_container">
                            <div className="profile_icon_wrapper">
                                <FaPhone size={18} className="profile_field_icon" />
                            </div>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="profile_input"
                            />
                        </div>
                    </div>

                    {/* Address Field */}
                    <div className="profile_form_row">
                        <label htmlFor="address" className="profile_label">Address:</label>
                        <div className="profile_input_container">
                            <div className="profile_icon_wrapper">
                                <FaMapMarkerAlt size={18} className="profile_field_icon" />
                            </div>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="profile_input"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="profile_button_container">
                    <button
                        type="button"
                        className="profile_change_password_button"
                        onClick={() => navigate('/change-password', { state: { userId: user.account.id } })}
                    >
                        <FaKey size={16} className="profile_button_icon" />
                        Change Password
                    </button>
                    <button
                        type="submit"
                        className="profile_submit_button"
                    >
                        <FaSave size={16} className="profile_button_icon" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
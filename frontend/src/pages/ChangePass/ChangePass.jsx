import React, { useState } from 'react';
import './ChangePass.css';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { changePassword } from '../../services/userService'; // API để đổi mật khẩu

const ChangePassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId;
    const [formData, setFormData] = useState({
        userid: userId,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirm password do not match!");
            return;
        }
        try {
            const response = await changePassword(formData.userid, formData.oldPassword, formData.newPassword);
            if (response && response.errCode === 0) {
                toast.success("Password changed successfully!");
                navigate('/profile');
            } else {
                toast.error(response.error || "Failed to change password.");
            }
        } catch (error) {
            toast.error("An error occurred while changing the password.");
        }
    };

    return (
        <div className="change_password_container">
            <h1 className="change_password_title">Change Password</h1>
            <form onSubmit={handleSubmit} className="change_password_form">
                <div className="form_group">
                    <label htmlFor="oldPassword" className="form_label">Old Password:</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="form_input"
                        required
                    />
                </div>
                <div className="form_group">
                    <label htmlFor="newPassword" className="form_label">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="form_input"
                        required
                    />
                </div>
                <div className="form_group">
                    <label htmlFor="confirmPassword" className="form_label">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form_input"
                        required
                    />
                </div>
                <div className="form_buttons">
                    <button type="submit" className="submit_button">Change Password</button>
                    <button
                        type="button"
                        className="cancel_button"
                        onClick={() => navigate('/profile')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
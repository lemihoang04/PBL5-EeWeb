import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginAdmin } from '../../../services/adminService';
import './AdminLogin.css';
import { UserContext } from '../../../context/UserProvider';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    const { admin, loginAdmin } = useContext(UserContext);
    useEffect(() => {
        if (admin && admin.isAuthenticated) {
            navigate("/admin");
        }
    }, [admin, navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (validateForm()) {
            setIsLoading(true);

            try {
                const response = await LoginAdmin(formData);
                console.log("Login response:", response);
                // For demo purposes - in real app, validate with backend
                if (response && response.errCode === 0) {
                    // Store token and redirect
                    let data = {
                        isAuthenticated: true,
                        account: response.admin,
                        isLoading: false,
                    };
                    loginAdmin(data);
                    navigate('/admin/dashboard');
                } else {
                    setLoginError('Invalid username or password');
                }
            } catch (error) {
                setLoginError('Login failed. Please try again later.');
                console.error('Login error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h1>Admin Login</h1>
                    <p>Enter your credentials to access the admin panel</p>
                </div>

                {loginError && (
                    <div className="error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {loginError}
                    </div>
                )}

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            autoComplete="username"
                            disabled={isLoading}
                        />
                        {errors.username && <div className="error-message">{errors.username}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <div className="remember-forgot">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <a href="#forgot-password" className="forgot-password">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

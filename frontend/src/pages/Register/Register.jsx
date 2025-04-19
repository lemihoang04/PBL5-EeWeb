import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserProvider';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';
import LoginImg from '../../assets/images/logintem.png';
import { CreateNewUser } from '../../services/userService';

const Register = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.isAuthenticated) {
            navigate("/home");
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await CreateNewUser({
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phoneNumber
            });

            if (response && response.errCode === 0) {
                toast.success("Registration successful!");
                setTimeout(() => navigate('/login'), 500);
            } else {
                toast.error(response.error || "Registration failed!");
            }
        } catch (error) {
            toast.error("An error occurred during registration!");
            console.error(error);
        }
    };

    return (
        <div className="register__container">
            <div className="register__wrapper">
                <div className="register__image-section">
                    <img src={LoginImg} alt="Register Background" className="register__image" />
                </div>
                <div className="register__form-section">
                    <h2 className="register__title">Create an Account</h2>
                    <form onSubmit={handleRegister} className="register__form">
                        <div className="register__form-group">
                            <label className="register__label">Full Name</label>
                            <input 
                                type="text" 
                                name="fullName" 
                                className="register__input" 
                                placeholder="Enter your full name" 
                                value={formData.fullName} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="register__form-group">
                            <label className="register__label">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                className="register__input" 
                                placeholder="Enter your email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="register__form-group">
                            <label className="register__label">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                className="register__input" 
                                placeholder="Enter password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="register__form-group">
                            <label className="register__label">Confirm Password</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                className="register__input" 
                                placeholder="Re-enter password" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="register__form-group">
                            <label className="register__label">Phone Number</label>
                            <input 
                                type="text" 
                                name="phoneNumber" 
                                className="register__input" 
                                placeholder="Enter your phone number" 
                                value={formData.phoneNumber} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <button type="submit" className="register__button">
                            Register
                        </button>
                    </form>
                    
                    <div className="register__footer">
                        <p className="register__footer-text">
                            Already have an account? <Link to="/login" className="register__link">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

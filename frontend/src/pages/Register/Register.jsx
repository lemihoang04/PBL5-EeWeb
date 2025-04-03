import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
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
                setTimeout(() => window.location.href = '/login', 500);
            } else {
                toast.error(response.error || "Registration failed!");
            }
        } catch (error) {
            toast.error("An error occurred during registration!");
            console.error(error);
        }
    };

    return (
        <div className="register-page">
            <Header />
            <div className="container-fluid d-flex align-items-center justify-content-center my-5">
                <div className="row w-75 shadow-lg rounded-3 overflow-hidden">
                    <div className="col-md-6 d-none d-md-block p-0">
                        <img src={LoginImg} alt="Background" className="img-fluid h-100 w-100 object-fit-cover" />
                    </div>
                    <div className="col-md-6 bg-white p-5 d-flex flex-column justify-content-center">
                        <h2 className="text-primary fw-bold text-center mb-4">Register</h2>
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input type="text" name="fullName" className="form-control" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" className="form-control" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" className="form-control" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" name="confirmPassword" className="form-control" placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone Number</label>
                                <input type="text" name="phoneNumber" className="form-control" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                        <p className="mt-3 text-center">Already have an account? <a href="/login" className="text-decoration-none text-primary">Login here</a></p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;

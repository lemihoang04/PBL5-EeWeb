import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Register.css'; // Import custom CSS for additional styling
import LoginImg from '../../assets/images/logintem.png'; // Import your image

const Register = () => {
    return (
        <div className="register-page">
            <Header />
            <div className="container-fluid d-flex align-items-center justify-content-center my-5">
                <div className="row w-75 shadow-lg rounded-3 overflow-hidden">
                    {/* Image on the left */}
                    <div className="col-md-6 d-none d-md-block p-0">
                        <img src={LoginImg} alt="Background" className="img-fluid h-100 w-100 object-fit-cover" />
                    </div>

                    {/* Register form on the right */}
                    <div className="col-md-6 bg-white p-5 d-flex flex-column justify-content-center">
                        <h2 className="text-primary fw-bold text-center mb-4">Register</h2>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" placeholder="Enter your full name" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" placeholder="Enter your email" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" className="form-control" placeholder="Re-enter password" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone Number</label>
                                <input type="text" className="form-control" placeholder="Enter your phone number" />
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

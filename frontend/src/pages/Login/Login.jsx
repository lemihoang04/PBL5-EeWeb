import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Login.css'; // Import custom CSS for additional styling
import LoginImg from '../../assets/images/logintem.png'; // Import your image

const Login = () => {
    return (
        <div className="login-page">
            <Header />
            <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
                <div className="row w-75 shadow-lg rounded-3 overflow-hidden">
                    {/* Image on the left */}
                    <div className="col-md-6 d-none d-md-block p-0">
                        <img src={LoginImg} alt="Background" className="img-fluid h-100 w-100 object-fit-cover" />
                    </div>

                    {/* Login form on the right */}
                    <div className="col-md-6 bg-white p-5 d-flex flex-column justify-content-center">
                        <h2 className="text-primary fw-bold text-center mb-4">Login</h2>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Email or Username</label>
                                <input type="text" className="form-control" placeholder="Enter email or username" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" />
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                </div>
                                <a href="#" className="text-decoration-none text-primary">Forgot password?</a>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                        <p className="mt-3 text-center">Don't have an account? <a href="/Register" className="text-decoration-none text-primary">Sign up now</a></p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Điều hướng sau khi login
import { LoginUser } from '../../services/userService';
import { UserContext } from '../../context/UserProvider'; // Import UserContext
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import LoginImg from '../../assets/images/logintem.png';

const Login = () => {
    const { loginUser } = useContext(UserContext); // Lấy hàm login từ context
    const [formValues, setFormValues] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Điều hướng

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await LoginUser(formValues);
            if (response && response.errCode === 0) {
                toast.success('Login successful!', { position: "top-right" });

                // Lưu thông tin user vào UserProvider
                let data = {
                    isAuthenticated: true,
                    account: response.user,
                    isLoading: false,
                };
                loginUser(data);

                // Chuyển hướng sau khi login thành công
                setTimeout(() => {
                    navigate("/");
                }, 500);
            } else {
                toast.error(response.error);
            }
        } catch (err) {
            toast.error('Invalid email or password', { position: "top-right" });
        }
    };

    return (
        <div className="login-page">
            <Header />
            <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
                <div className="row w-75 shadow-lg rounded-3 overflow-hidden">
                    <div className="col-md-7 d-none d-md-block p-0">
                        <img src={LoginImg} alt="Background" className="img-fluid h-100 w-100 object-fit-cover" />
                    </div>
                    <div className="col-md-5 bg-white p-5 d-flex flex-column justify-content-center">
                        <h2 className="text-primary fw-bold text-center mb-4">Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label">Email or Username</label>
                                <input
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter email or username"
                                    value={formValues.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={formValues.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="showPassword"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                    <label className="form-check-label" htmlFor="showPassword">Show password</label>
                                </div>
                                <a href="#" className="text-decoration-none text-primary">Forgot password?</a>
                            </div>
                            <button onClick={handleLogin} className="btn btn-primary w-100">Login</button>
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

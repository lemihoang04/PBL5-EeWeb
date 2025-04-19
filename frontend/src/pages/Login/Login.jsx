import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { LoginUser } from '../../services/userService';
import { UserContext } from '../../context/UserProvider';
import './Login.css';
import LoginImg from '../../assets/images/logintem.png';

const Login = () => {
    const { user, loginUser } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user && user.isAuthenticated) {
            navigate("/home");
        }
    }, [user, navigate]);

    const [formValues, setFormValues] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!formValues.email || !formValues.password) {
            toast.error('Please enter both email and password');
            return;
        }

        try {
            const response = await LoginUser(formValues);
            if (response && response.errCode === 0) {
                toast.success('Login successful!');

                let data = {
                    isAuthenticated: true,
                    account: response.user,
                    isLoading: false,
                };
                loginUser(data);

                setTimeout(() => {
                    navigate("/");
                }, 500);
            } else {
                toast.error(response.error);
                setFormValues({ ...formValues, password: '' });
            }
        } catch (err) {
            toast.error('Invalid email or password');
            setFormValues({ ...formValues, password: '' });
        }
    };

    return (
        <div className="l-container">
            <div className="l-card">
                <div className="l-image-section">
                    <img src={LoginImg} alt="Login" className="l-image" />
                    <div className="l-overlay">
                        <h2 className="l-welcome">Welcome Back</h2>
                        <p className="l-motto">Sign in to continue your journey</p>
                    </div>
                </div>
                <div className="l-form-section">
                    <div className="l-form-container">
                        <h1 className="l-title">Sign In</h1>
                        <p className="l-subtitle">Please login to access your account</p>

                        <form onSubmit={handleLogin} className="l-form">
                            <div className="l-input-group">
                                <label className="l-label">Email or Username</label>
                                <input
                                    type="text"
                                    name="email"
                                    className="l-input"
                                    placeholder="Enter your email or username"
                                    value={formValues.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="l-input-group">
                                <label className="l-label">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="l-input"
                                    placeholder="Enter your password"
                                    value={formValues.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="l-options">
                                <div className="l-checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="showPassword"
                                        className="l-checkbox"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                    <label className="l-checkbox-label" htmlFor="showPassword">Show password</label>
                                </div>
                                <Link to="/forgot-password" className="l-forgot">Forgot password?</Link>
                            </div>

                            <button type="submit" className="l-button">Sign In</button>

                            <div className="l-signup">
                                <p>Don't have an account? <Link to="/Register" className="l-link">Sign up now</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

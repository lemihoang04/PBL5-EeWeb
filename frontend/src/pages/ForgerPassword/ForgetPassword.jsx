import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgetPassword.css';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Implement your API call here to handle forget password
            // For now, we'll just simulate a successful API call
            setTimeout(() => {
                setIsLoading(false);
                setIsSubmitted(true);
            }, 1500);
        } catch (error) {
            setIsLoading(false);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="forget-password__container">
            <div className="forget-password__card">
                <div className="forget-password__header">
                    <h1 className="forget-password__title">Forgot Password</h1>
                    {!isSubmitted && (
                        <p className="forget-password__subtitle">
                            Enter your registered email to receive password reset instructions
                        </p>
                    )}
                </div>

                {!isSubmitted ? (
                    <form className="forget-password__form" onSubmit={handleSubmit}>
                        <div className="forget-password__form-group">
                            <label htmlFor="email" className="forget-password__label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="forget-password__input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                            />
                            {error && <p className="forget-password__error">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            className={`forget-password__button ${isLoading ? 'forget-password__button--loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="forget-password__spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                'Send Request'
                            )}
                        </button>

                        <div className="forget-password__links">
                            <Link to="/login" className="forget-password__back-link">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="forget-password__success">
                        <div className="forget-password__success-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h2 className="forget-password__success-title">Request Sent!</h2>
                        <p className="forget-password__success-message">
                            We've sent password reset instructions to <strong>{email}</strong>.
                            Please check your inbox and follow the instructions.
                        </p>
                        <Link to="/login" className="forget-password__back-button">
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
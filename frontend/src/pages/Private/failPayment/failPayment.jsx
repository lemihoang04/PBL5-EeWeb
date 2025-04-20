import React from "react";
import { useNavigate } from "react-router-dom";
import "./failPayment.css";

const FailPayment = () => {
    const navigate = useNavigate();

    return (
        <div className="fail-payment-container">
            <h2>Payment Failed</h2>
            <p>An error occurred during the payment process. Please try again or contact support.</p>
            <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
    );
};

export default FailPayment;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Dummy components for demonstration
import Home from "../pages/Home";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Admin from "../pages/Admin/Admin";

const ClientRoute = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/" element={<Home />} /> {/* Add a route for the home page */}
            </Routes>
        </Router>
    );
};

export default ClientRoute;
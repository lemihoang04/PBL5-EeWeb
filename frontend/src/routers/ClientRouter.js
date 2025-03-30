import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Dummy components for demonstration
import Home from "../pages/Home";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Admin from "../pages/Admin/Admin";
import ProductInfo from "../pages/ProductInfo";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

const ClientRoute = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/" element={<Home />} /> {/* Add a route for the home page */}
                <Route path="/product-info" element={<ProductInfo />} /> {/* Add a route for product info */}
                <Route path="/cart" element={<Cart />} /> {/* Add a route for the cart page */}
                <Route path="/login" element={<Login />} /> {/* Add a route for the login page */}
                <Route path="/register" element={<Register />} /> {/* Add a route for the register page */}
            </Routes>
        </Router>
    );
};

export default ClientRoute;
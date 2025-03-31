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
import AppContextProvider from "../context/AppContext"; // Import your context provider
import Sidebar from "../pages/Home/ShoppingPage";

const ClientRoute = () => {
    return (
        <AppContextProvider>
            <Router>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/login" element={<Login />} /> */}
                    <Route path="/product-info" element={<ProductInfo />} /> {/* Add a route for product info */}
                    <Route path="/cart" element={<Cart />} /> {/* Add a route for the cart page */}
                    <Route path="/login" element={<Login />} /> {/* Add a route for the login page */}
                    <Route path="/register" element={<Register />} /> {/* Add a route for the register page */}
                    <Route path="/product-info/:productId" element={<ProductInfo />} />
                    <Route path="/sidebar" element={<Sidebar />} /> {/* Add a route for the sidebar page */}
                </Routes>
            </Router>
        </AppContextProvider>
    );
};

export default ClientRoute;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Dummy components for demonstration
import Home from "../pages/Home";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Admin from "../pages/Admin/Admin";
import ProductInfo from "../pages/ProductInfo";
import AppContextProvider from "../context/AppContext";

const ClientRoute = () => {
    return (
        <AppContextProvider>
            <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/" element={<Home />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/product-info/:productId" element={<ProductInfo />} />
            </Routes>
        </Router>
        </AppContextProvider>
    );
};

export default ClientRoute;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Dummy components for demonstration
import Home from "../pages/Home";
import Admin from "../pages/Admin/Admin";
import AppContextProvider from "../context/AppContext";
import ProductInfo from "../pages/ProductInfo";
import Cart from "../pages/Cart/Cart"
import Login from "../pages/Login/Login"
import Register from "../pages/Register/Register"


const ClientRoute = () => {
    return (
        <AppContextProvider>
            <Router>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} /> 
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/register" element={<Register />} />
                    <Route path="/product-info/:productId" element={<ProductInfo />} />
                    <Route path="/product-info" element={<ProductInfo />} /> 
                </Routes>
            </Router>
        </AppContextProvider>
    );
};

export default ClientRoute;
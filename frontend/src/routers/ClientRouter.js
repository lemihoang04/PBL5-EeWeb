import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Admin from "../pages/Admin/Admin";
import ProductInfo from "../pages/ProductInfo";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AppContextProvider from "../context/AppContext";
import ShoppingPage from "../pages/Home/ShoppingPage";


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
                    <Route path="/ShoppingPage" element={<ShoppingPage />} /> 
                </Routes>
            </Router>
        </AppContextProvider>
    );
};

export default ClientRoute;
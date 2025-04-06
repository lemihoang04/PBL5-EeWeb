import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContextProvider from "../context/AppContext";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home";
import ProductInfo from "../pages/ProductInfo";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Products from "../pages/Products/Products";
import Admin from "../pages/Admin/Admin";
import NotFound from "../components/NotFound";

const AppRoutes = () => {
    return (
        <AppContextProvider>
            <Router>
                <Routes>
                    {/* Các route của User */}
                    <Route element={<UserLayout />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/product-info/:productId" element={<ProductInfo />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Route Admin */}
                    <Route path="/admin" element={<Admin />} />

                    {/* Route 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AppContextProvider>
    );
};

export default AppRoutes;

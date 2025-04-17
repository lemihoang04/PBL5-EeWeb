import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContextProvider from "../services/AppContext";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home/Home";
import ProductInfo from "../pages/ProductInfo/ProductInfo";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Admin from "../pages/Admin/Admin";
import NotFound from "../components/NotFound";
import Build from "../pages/Build/Build";
import Checkout from "../pages/Checkout/Checkout";
import Profile from "../pages/UserInfo/Profile";
import ChangePassword from "../pages/ChangePass/ChangePass";
import LaptopSearch from "../pages/laptop/LaptopSearch"
import ComponentSearch from "../pages/Component/ComponentSearch"
import Order from "../pages/Order/Order";

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
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/orders" element={<Order />} />
                        <Route path="/laptops" element={<LaptopSearch />} />
                        <Route path="/build" element={<Build />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/components/:type" element={<ComponentSearch />} />
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

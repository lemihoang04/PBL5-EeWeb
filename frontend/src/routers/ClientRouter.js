import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContextProvider from "../context/AppContext";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/Home";
import ProductInfo from "../pages/ProductInfo";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Admin from "../pages/Admin/Admin";
import NotFound from "../components/NotFound";
import LaptopSearch from "../pages/laptop/LaptopSearch";
import Header from "../pages/Nhap/nhap"
import Build from "../pages/Build/Build";

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
                        <Route path="/laptops" element={<LaptopSearch />} />
                        <Route path="/header" element={<Header />} />
                        {/* <Route path="/build" element={<Build />} /> */}
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

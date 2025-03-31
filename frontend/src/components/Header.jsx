import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserProvider";
import { useContext } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LogOutUser } from "../services/userService";

function Header() {

    const { user, logoutUser } = useContext(UserContext);
    const navigate = useNavigate(); // Điều hướng sau khi login
    const HandleLogout = async () => {
        try {
            let data = await LogOutUser();
            logoutUser();
            if (data && data.errCode === 0) {
                navigate("/");
                toast.success("Log out success");
            } else {
                toast.error("Log out failed");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">TechShop</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="#">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">Cart</Link>
                        </li>
                        {user &&
                            user.isAuthenticated === true ? (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Welcome, {user.account.name}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li><Link className="dropdown-item" to="/account">Account</Link></li>
                                    <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item" onClick={HandleLogout}>Logout</button></li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;

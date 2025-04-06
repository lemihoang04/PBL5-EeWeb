import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserProvider";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LogOutUser } from "../../services/userService";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Header.css";

function Header() {
    const { user, logoutUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedValue, setSelectedValue] = useState("all");
    const selectRef = useRef(null);
    const spanRef = useRef(null);
    const options = [
        { value: "all", label: "All" },
        { value: "toys", label: "Toys" },
        { value: "games", label: "Games and pro" }
    ];
    const handleLogout = async () => {
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
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
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
                    {/* Thanh tìm kiếm ở giữa */}
                    <form className="d-flex mx-auto w-50" onSubmit={handleSearch}>
                        <div className="input-group">
                            <select
                                className="form-select bg-light border-end-0"
                                value={selectedValue}
                                onChange={(e) => setSelectedValue(e.target.value)}
                                style={{ maxWidth: '70px' }}
                            >
                                {options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn btn-primary" type="submit">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </form>

                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
                        {user && user.isAuthenticated ? (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" data-bs-toggle="dropdown">
                                    Welcome, {user.account.name}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/account">Account</Link></li>
                                    <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                        )}
                    </ul>
                </div>
            </div >
        </nav >
    );
}

export default Header;

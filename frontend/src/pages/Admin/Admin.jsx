import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Admin.css";
import Sidebar from "./Sidebar/Sidebar.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import UserManager from "./User/UserManager.jsx";
import OrderManager from "./Order/OrderManager.jsx";
import CategoryManager from "./Category/CategoryManager.jsx";
import ProductManager from "./Product/ProductManager.jsx"; // Thêm dòng này

const Admin = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard":
                return <Dashboard />;
            case "Category":
                return <CategoryManager />;
            case "Order":
                return <OrderManager />;
            case "Customers":
                return <UserManager />;
            case "Product":
                return <ProductManager />;
            default:
                return <h2>Welcome to Admin Panel</h2>;
        }
    };

    return (
        <div className="admin-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} collapsed={collapsed} toggleSidebar={toggleSidebar} />
            <div className={`content-area p-2 ${collapsed ? "expanded" : ""}`}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Admin;
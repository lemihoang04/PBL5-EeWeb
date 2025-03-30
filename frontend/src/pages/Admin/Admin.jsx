import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Admin.css"; // Import your CSS file for custom styles
import Sidebar from "./Sidebar/Sidebar.jsx"; // Adjust the import path as necessary
import Dashboard from "./Dashboard/Dashboard.jsx";

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
                return <h2>Category Management</h2>;
            case "Order":
                return <h2>Order Management</h2>;
            case "Customers":
                return <h2>Customer Management</h2>;
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
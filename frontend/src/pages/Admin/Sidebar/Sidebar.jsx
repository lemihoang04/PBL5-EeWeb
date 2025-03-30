import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import adminLogo from "../assets/images/admin-icon.svg";

const Sidebar = ({ activeTab, setActiveTab, collapsed, toggleSidebar }) => {
    const sidebarItems = [
        { name: "Dashboard", icon: "bi-speedometer2" },
        { name: "Category", icon: "bi-tag" },
        { name: "Order", icon: "bi-cart" },
        { name: "Customers", icon: "bi-people" },
        { name: "Reports", icon: "bi-bar-chart" },
        { name: "Settings", icon: "bi-gear" },
    ];

    return (
        <div className={`sidebar bg-gradient p-2 ${collapsed ? 'collapsed' : ''}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                {!collapsed && <h4 className="mb-0 sidebar-title">EcommerceAdmin</h4>}
                <button className="btn btn-toggle p-1" onClick={toggleSidebar}>
                    <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                </button>
            </div>

            <div className="user-profile mb-3">
                {!collapsed && (
                    <>

                        <div className="text-center">
                            <img src={adminLogo} alt="Admin" className="profile-img" />
                            <h6 className="mb-1">Admin User</h6>
                            <p className="small text-muted mb-0">Administrator</p>
                        </div>
                    </>
                )}
                {collapsed && (
                    <div className="profile-img-container-sm mx-auto mb-3">
                        <img src={adminLogo} alt="Admin" className="profile-img" />
                    </div>
                )}
            </div>

            <ul className="nav flex-column">
                {sidebarItems.map((item) => (
                    <li key={item.name} className="nav-item mb-2">
                        <button
                            className={`nav-link btn btn-link w-100 text-start sidebar-item ${activeTab === item.name ? "active" : ""}`}
                            onClick={() => setActiveTab(item.name)}
                            title={collapsed ? item.name : ""}
                        >
                            <i className={`${item.icon} ${collapsed ? 'mx-auto' : 'me-3'}`}></i>
                            {!collapsed && <span>{item.name}</span>}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mt-auto pt-4">
                <button className="nav-link btn btn-link w-100 text-start sidebar-item sidebar-footer">
                    <i className="bi bi-box-arrow-left me-3"></i>
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>

    );
};

export default Sidebar;

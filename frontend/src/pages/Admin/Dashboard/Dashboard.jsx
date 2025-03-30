import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css"; // Định nghĩa CSS tùy chỉnh nếu cần
import { FaShoppingCart, FaDollarSign, FaCheckCircle, FaUndo } from "react-icons/fa";

const Dashboard = ({ setActiveMenu }) => {
    const stats = [
        { value: "12,432", label: "Orders Completed", color: "text-primary", icon: <FaShoppingCart />, bgColor: "bg-primary-subtle", link: "#orders" },
        { value: "$324,091", label: "Total in Revenue", color: "text-danger", icon: <FaDollarSign />, bgColor: "bg-danger-subtle", link: "#revenue" },
        { value: "4,532", label: "Completed Purchases", color: "text-success", icon: <FaCheckCircle />, bgColor: "bg-success-subtle", link: "#purchases" },
        { value: "435", label: "Return Requests", color: "text-warning", icon: <FaUndo />, bgColor: "bg-warning-subtle", link: "#returns" },
    ];

    return (
        <div className="container mt-4">
            <h3 className="mb-3">E-Commerce</h3>
            <div className="row g-3">
                {stats.map((stat, index) => (
                    <div key={index} className="col-md-3 d-flex">
                        <a href={stat.link} className="text-decoration-none w-100">
                            <div className="card shadow-sm p-3 d-flex flex-column h-100 justify-content-center align-items-start">
                                <div className="d-flex align-items-center mb-2 w-100">
                                    <span className={`p-3 rounded ${stat.bgColor} ${stat.color} d-flex align-items-center justify-content-center`} style={{ width: "50px", height: "50px" }}>
                                        {stat.icon}
                                    </span>
                                    <div className="ms-3 flex-grow-1">
                                        <h4 className={stat.color}>{stat.value}</h4>
                                        <p className="mb-0 text-dark">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;

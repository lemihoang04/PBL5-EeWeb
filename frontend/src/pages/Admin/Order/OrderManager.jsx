import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetOrdersData, CancelOrder, ApproveOrder } from "../../../services/orderService";
import { FaEye, FaTimes, FaCheck } from "react-icons/fa";
import "./OrderManager.css";

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [filteredOrders, setFilteredOrders] = useState([]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await GetOrdersData("all");
            if (response && response.errCode === 0) {
                setOrders(response.orders || []);
                filterOrdersByStatus(response.orders || [], activeTab);
            } else {
                toast.error("Failed to fetch orders.");
            }
        } catch (error) {
            toast.error("Error fetching orders.");
        } finally {
            setLoading(false);
        }
    };

    const filterOrdersByStatus = (ordersData, status) => {
        if (status === "all") {
            setFilteredOrders(ordersData);
        } else {
            const filtered = ordersData.filter(order => order.status === status);
            setFilteredOrders(filtered);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrdersByStatus(orders, activeTab);
    }, [activeTab, orders]);

    const handleTabChange = (status) => {
        setActiveTab(status);
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            const response = await CancelOrder(orderId);
            if (response && response.errCode === 0) {
                toast.success("Order cancelled successfully.");
                fetchOrders();
            } else {
                toast.error("Failed to cancel order.");
            }
        } catch (error) {
            toast.error("Error cancelling order.");
        }
    };

    const handleApproveOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to approve this order?")) return;
        try {
            const response = await ApproveOrder(orderId);
            if (response && response.errCode === 0) {
                toast.success("Order approved successfully.");
                fetchOrders();
            } else {
                toast.error("Failed to approve order.");
            }
        } catch (error) {
            toast.error("Error approving order.");
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => setSelectedOrder(null);

    const formatMoney = (amount) =>
        amount ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "N/A";

    const getStatusClass = (status) => {
        if (!status) return "";
        if (status === "cancelled") return "status-cancelled";
        if (status === "completed") return "status-completed";
        if (status === "pending") return "status-pending";
        return "status-other";
    };

    return (
        <div className="admin-order-manager">
            <h2>Order Management</h2>
            
            <div className="order-status-tabs">
                <button 
                    className={`tab-btn ${activeTab === "all" ? "active" : ""}`} 
                    onClick={() => handleTabChange("all")}
                >
                    All Orders
                </button>
                <button 
                    className={`tab-btn ${activeTab === "pending" ? "active" : ""}`} 
                    onClick={() => handleTabChange("pending")}
                >
                    Pending
                </button>
                <button 
                    className={`tab-btn ${activeTab === "completed" ? "active" : ""}`} 
                    onClick={() => handleTabChange("completed")}
                >
                    Completed
                </button>
                <button 
                    className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`} 
                    onClick={() => handleTabChange("cancelled")}
                >
                    Cancelled
                </button>
            </div>

            {loading ? (
                <div>Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
                <div className="no-orders-message">No {activeTab !== "all" ? activeTab : ""} orders found</div>
            ) : (
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Created Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.order_id || order.id}>
                                <td>{order.order_id || order.id}</td>
                                <td>{order.user_name || order.userId || "N/A"}</td>
                                <td>{order.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}</td>
                                <td>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>                                <td>{formatMoney(order.total || order.price * order.quantity)}</td>
                                <td className="action-cell">
                                    <div className="action-buttons">
                                        <button className="action-btn view-btn" onClick={() => handleViewDetails(order)}>
                                            <FaEye /> Details
                                        </button>
                                        {order.status === "pending" && (
                                            <>
                                                <button
                                                    className="action-btn approve-btn"
                                                    onClick={() => handleApproveOrder(order.order_id || order.id)}
                                                >
                                                    <FaCheck /> Approve
                                                </button>
                                                <button
                                                    className="action-btn cancel-btn"
                                                    onClick={() => handleCancelOrder(order.order_id || order.id)}
                                                >
                                                    <FaTimes /> Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedOrder && (
                <div className="order-modal">
                    <div className="order-modal-content">
                        <h3>Order Details</h3>
                        <p><b>Order ID:</b> {selectedOrder.order_id || selectedOrder.id}</p>
                        <p><b>Customer:</b> {selectedOrder.user_name || selectedOrder.userId}</p>
                        <p><b>Created Date:</b> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "N/A"}</p>
                        <p><b>Status:</b> <span className={`order-status ${getStatusClass(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                        <p><b>Total:</b> {formatMoney(selectedOrder.total || selectedOrder.price * selectedOrder.quantity)}</p>
                        <button className="close-modal-btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
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
    const [filteredOrders, setFilteredOrders] = useState([]);    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await GetOrdersData("all");
            if (response && response.errCode === 0) {
                // Chuẩn hóa dữ liệu trước khi lưu vào state
                const normalizedOrders = (response.orders || []).map(order => ({
                    ...order,
                    // Đảm bảo status luôn có giá trị và được chuẩn hóa
                    status: order.status ? order.status.toLowerCase().trim() : 'unknown'
                }));
                
                setOrders(normalizedOrders);
                // Áp dụng bộ lọc hiện tại cho dữ liệu mới nhận
                filterOrdersByStatus(normalizedOrders, activeTab);
            } else {
                toast.error("Failed to fetch orders.");
            }
        } catch (error) {
            toast.error("Error fetching orders: " + (error.message || "Unknown error"));
            console.error("Order fetch error:", error);
        } finally {
            setLoading(false);
        }
    };const filterOrdersByStatus = (ordersData, status) => {
        if (!ordersData || ordersData.length === 0) {
            setFilteredOrders([]);
            return;
        }
        
        // Chuẩn hóa dữ liệu đầu vào
        const normalizedOrders = ordersData.map(order => ({
            ...order,
            // Đảm bảo status luôn có giá trị và được chuẩn hóa
            status: order.status ? order.status.toLowerCase().trim() : 'unknown'
        }));
        
        if (status === "all") {
            // Sắp xếp đơn hàng với đơn hàng được tạo gần đây nhất lên đầu
            const sortedOrders = [...normalizedOrders].sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            setFilteredOrders(sortedOrders);
        } else {
            // Lọc theo trạng thái đã được chuẩn hóa
            const normalizedStatus = status.toLowerCase().trim();
            const filtered = normalizedOrders.filter(order => {
                const orderStatus = order.status ? order.status.toLowerCase().trim() : '';
                return orderStatus === normalizedStatus;
            });
            
            // Sắp xếp các đơn hàng đã lọc
            const sortedFiltered = [...filtered].sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            
            setFilteredOrders(sortedFiltered);
        }
    };    // Gọi fetchOrders khi component được mount
    useEffect(() => {
        fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (orders && orders.length > 0) {
            filterOrdersByStatus(orders, activeTab);
        }
    }, [activeTab, orders]);const handleTabChange = (status) => {
        setActiveTab(status);
        // Khi thay đổi tab, ngay lập tức lọc lại đơn hàng với status mới
        if (orders && orders.length > 0) {
            filterOrdersByStatus(orders, status);
        }
    };    
    const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
        const response = await CancelOrder(orderId);
        if (response && response.errCode === 0) {
            toast.success("Order cancelled successfully.");

            const updatedOrders = orders.map(order =>
                (order.order_id === orderId || order.id === orderId)
                    ? { ...order, status: "cancelled".toLowerCase().trim() }
                    : order
            );

            setOrders(updatedOrders);
            filterOrdersByStatus(updatedOrders, activeTab);
        } else {
            toast.error("Failed to cancel order.");
        }
    } catch (error) {
        toast.error("Error cancelling order: " + (error.message || "Unknown error"));
        console.error("Cancel order error:", error);
    }
};
    const handleApproveOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to approve this order?")) return;
    try {
        const response = await ApproveOrder(orderId);
        if (response && response.errCode === 0) {
            toast.success("Order approved successfully.");

            const updatedOrders = orders.map(order =>
                (order.order_id === orderId || order.id === orderId)
                    ? { ...order, status: "completed".toLowerCase().trim() }
                    : order
            );

            setOrders(updatedOrders);
            filterOrdersByStatus(updatedOrders, activeTab);
        } else {
            toast.error("Failed to approve order.");
        }
    } catch (error) {
        toast.error("Error approving order: " + (error.message || "Unknown error"));
        console.error("Approve order error:", error);
    }
};


    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => setSelectedOrder(null);

    const formatMoney = (amount) =>
        amount ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "N/A";    const getStatusClass = (status) => {
        if (!status) return "status-unknown";
        
        // Chuyển đổi status thành chữ thường để đảm bảo so sánh chính xác
        const normalizedStatus = status.toLowerCase().trim();
        
        if (normalizedStatus === "cancelled") return "status-cancelled";
        if (normalizedStatus === "completed") return "status-completed";
        if (normalizedStatus === "pending") return "status-pending";
        return "status-other";
    };
    
    // Hàm giúp hiển thị trạng thái đơn hàng một cách nhất quán
    const formatStatus = (status) => {
        if (!status) return "Unknown";
        
        const normalizedStatus = status.toLowerCase().trim();
        // Chuẩn hóa cách viết hoa chữ cái đầu tiên
        return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
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
                {/* <button 
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
                </button> */}
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
                                <td>{order.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}</td>                                <td>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                        {formatStatus(order.status)}
                                    </span>
                                </td><td>{formatMoney(order.total || order.price * order.quantity)}</td>
                                <td className="action-cell">
                                    <div className="action-buttons">
                                        <button className="action-btn view-btn" onClick={() => handleViewDetails(order)}>
                                            <FaEye /> Details
                                        </button>                                        {order.status && order.status.toLowerCase() === "pending" && (
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
                        <p><b>Status:</b> <span className={`order-status ${getStatusClass(selectedOrder.status)}`}>{formatStatus(selectedOrder.status)}</span></p>
                        <p><b>Total:</b> {formatMoney(selectedOrder.total || selectedOrder.price * selectedOrder.quantity)}</p>
                        <button className="close-modal-btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
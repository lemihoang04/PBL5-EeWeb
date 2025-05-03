import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetOrdersData, CancelOrder } from "../../../services/orderService";
import { FaEye, FaTimes } from "react-icons/fa";
import "./OrderManager.css";

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await GetOrdersData("all");
            if (response && response.errCode === 0) {
                setOrders(response.orders || []);
            } else {
                toast.error("Failed to fetch orders.");
            }
        } catch (error) {
            toast.error("Error fetching orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
        try {
            const response = await CancelOrder(orderId);
            if (response && response.errCode === 0) {
                toast.success("Đã hủy đơn hàng thành công.");
                fetchOrders();
            } else {
                toast.error("Hủy đơn hàng thất bại.");
            }
        } catch (error) {
            toast.error("Lỗi khi hủy đơn hàng.");
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => setSelectedOrder(null);

    // const formatMoney = (amount) =>
    //     amount ? amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "N/A";
    const formatMoney = (amount) =>
        amount ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "N/A";

    const getStatusClass = (status) => {
        if (!status) return "";
        if (status === "cancelled") return "status-cancelled";
        if (status === "completed") return "status-completed";
        return "status-other";
    };

    return (
        <div className="admin-order-manager">
            <h2>Quản lý đơn hàng</h2>
            {loading ? (
                <div>Đang tải đơn hàng...</div>
            ) : (
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Tổng tiền</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id || order.id}>
                                <td>{order.order_id || order.id}</td>
                                <td>{order.user_name || order.userId || "N/A"}</td>
                                <td>{order.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}</td>
                                <td>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{formatMoney(order.total || order.price * order.quantity)}</td>
                                <td>
                                    <button className="action-btn view-btn" onClick={() => handleViewDetails(order)}>
                                        <FaEye /> Chi tiết
                                    </button>
                                    {order.status !== "cancelled" && (
                                        <button
                                            className="action-btn cancel-btn"
                                            onClick={() => handleCancelOrder(order.order_id || order.id)}
                                        >
                                            <FaTimes /> Hủy
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedOrder && (
                <div className="order-modal">
                    <div className="order-modal-content">
                        <h3>Chi tiết đơn hàng</h3>
                        <p><b>Mã đơn:</b> {selectedOrder.order_id || selectedOrder.id}</p>
                        <p><b>Khách hàng:</b> {selectedOrder.user_name || selectedOrder.userId}</p>
                        <p><b>Ngày tạo:</b> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "N/A"}</p>
                        <p><b>Trạng thái:</b> <span className={`order-status ${getStatusClass(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                        <p><b>Tổng tiền:</b> {formatMoney(selectedOrder.total || selectedOrder.price * selectedOrder.quantity)}</p>
                        <button className="close-modal-btn" onClick={closeModal}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
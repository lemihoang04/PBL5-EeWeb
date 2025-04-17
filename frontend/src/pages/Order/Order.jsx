import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserProvider';
import { toast } from 'react-toastify';
import { GetOrdersData } from '../../services/apiService';

import './Order.css';

// Hàm định dạng ngày giờ
const formatDate = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const Order = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);

                // if (!user || !user.account || !user.account.id) {
                //     toast.error("Please log in to view your orders");
                //     navigate('/login');
                //     return;
                // }

                const response = await GetOrdersData(user.account.id);
                if (response && response.errCode === 0) {
                    // Không dùng items, trả về dữ liệu phẳng
                    const orders = (response.orders || []).map(item => ({
                        id: item.order_id,
                        orderNumber: `ORD-${item.id}`,
                        date: item.created_at || new Date().toISOString(),
                        // Normalize status: trim and lowercase - store lowercase for filtering
                        status: (item.status || '').trim().toLowerCase(),
                        // Store original or capitalized status for display
                        statusDisplay: (item.status || 'pending').trim().charAt(0).toUpperCase() +
                            (item.status || 'pending').trim().slice(1).toLowerCase(),
                        productId: item.product_id,
                        productName: item.title,
                        productImage: item.image,
                        price: item.price,
                        quantity: item.quantity,
                        total: item.price * item.quantity
                    }));
                    setOrders(orders);
                }
            } catch (error) {
                console.error('Error loading orders:', error);
                toast.error("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    // Lọc đơn hàng theo trạng thái - đã sửa logic filter
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;

        // Ensure order.status exists before comparing
        const orderStatus = (order.status || '').toLowerCase();
        return orderStatus === filter.toLowerCase();
    });

    // Sắp xếp đơn hàng
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'total') {
            comparison = a.total - b.total;
        } else if (sortBy === 'status') {
            comparison = (a.status || '').localeCompare(b.status || '');
        }
        return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Lấy tổng số lượng sản phẩm (giờ chỉ là quantity)
    const getTotalItems = (order) => order.quantity || 0;

    // Lấy ảnh sản phẩm an toàn
    const getProductImage = (order) => {
        if (!order.productImage) return "default-image.jpg";

        // Handle ";" separated image URLs
        try {
            return order.productImage.split("; ")[0];
        } catch (e) {
            return order.productImage;
        }
    };

    // Lấy tên sản phẩm
    const getProductName = (order) => order.productName || 'Product';

    // Hiển thị trạng thái đang tải
    if (loading) {
        return (
            <div className="odrs__container">
                <div className="odrs__loading">
                    <div className="odrs__loading-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    // Helper to determine if a button should be active
    const isFilterActive = (buttonFilter) => {
        return filter.toLowerCase() === buttonFilter.toLowerCase();
    };

    return (
        <div className="odrs__container">
            <div className="odrs__header">
                <h1 className="odrs__title">My Orders</h1>
                <div className="odrs__subheader">
                    <p className="odrs__count">
                        {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
                    </p>
                </div>
            </div>

            <div className="odrs__controls">
                <div className="odrs__filters">
                    <button
                        className={`odrs__filter-btn ${isFilterActive('all') ? 'odrs__active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={`odrs__filter-btn ${isFilterActive('pending') ? 'odrs__active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`odrs__filter-btn ${isFilterActive('shipped') ? 'odrs__active' : ''}`}
                        onClick={() => setFilter('shipped')}
                    >
                        Shipped
                    </button>
                    <button
                        className={`odrs__filter-btn ${isFilterActive('delivered') ? 'odrs__active' : ''}`}
                        onClick={() => setFilter('delivered')}
                    >
                        Delivered
                    </button>
                    <button
                        className={`odrs__filter-btn ${isFilterActive('cancelled') ? 'odrs__active' : ''}`}
                        onClick={() => setFilter('cancelled')}
                    >
                        Cancelled
                    </button>
                </div>

                <div className="odrs__sort">
                    <label className="odrs__sort-label">Sort by:</label>
                    <select
                        className="odrs__sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="date">Date</option>
                        <option value="total">Total</option>
                        <option value="status">Status</option>
                    </select>
                    <button
                        className="odrs__sort-direction"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            {sortedOrders.length === 0 ? (
                <div className="odrs__empty">
                    <h3>No orders found</h3>
                    {filter !== 'all' ? (
                        <p>Try changing your filter or checking back later.</p>
                    ) : (
                        <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
                    )}
                    <button
                        className="odrs__button odrs__primary-button"
                        onClick={() => navigate('/products')}
                    >
                        Shop Now
                    </button>
                </div>
            ) : (
                <div className="odrs__orders-list">
                    {sortedOrders.map((order) => (
                        <div key={order.id} className="odrs__order-card">
                            <div className="odrs__order-header">
                                <div className="odrs__order-info">
                                    <div className="odrs__order-number">
                                        <span className="odrs__label">Order #:</span>
                                        <span className="odrs__value">{order.orderNumber}</span>
                                    </div>
                                    <div className="odrs__order-date">
                                        <span className="odrs__label">Placed on:</span>
                                        <span className="odrs__value">{formatDate(order.date)}</span>
                                    </div>
                                </div>
                                <div className={`odrs__status odrs__status-${order.status}`}>
                                    {/* Use statusDisplay if available, otherwise capitalize status */}
                                    {order.statusDisplay || order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </div>
                            </div>

                            <div className="odrs__order-summary">
                                <div className="odrs__product-preview">
                                    <div className="odrs__product-image">
                                        <img src={getProductImage(order)} alt={getProductName(order)} />
                                    </div>
                                    <div className="odrs__product-info">
                                        <h4 className="odrs__product-name">{getProductName(order)}</h4>
                                        <div className="odrs__product-meta">
                                            <span className="odrs__quantity">x{getTotalItems(order)}</span>
                                            <span className="odrs__price">${(order.total || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="odrs__order-actions">
                                <button
                                    className="odrs__button odrs__primary-button"
                                    onClick={() => navigate(`/order/${order.id}`)}
                                >
                                    View Details
                                </button>
                                <button className="odrs__button odrs__secondary-button">
                                    Track Order
                                </button>
                                {/* Also check for pending status */}
                                {(order.status === 'pending' || order.status === 'processing' || order.status === 'shipped') && (
                                    <button className="odrs__button odrs__outline-button">
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Order;
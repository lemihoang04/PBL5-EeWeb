import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Cart.css';
import Laptop from '../../assets/images/laptop1.jpg';
import { UserContext } from "../../context/UserProvider";
import { toast } from 'react-toastify';
import { loadCart, removeFromCart } from '../../services/apiService';


const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user && user.account.id) {
            const loadCartData = async () => {
                try {
                    const response = await loadCart(user.account.id);
                    if (response && response.errCode === 0) {
                        setCartItems(response.data);
                    } else {
                        toast.error("Failed to load cart items.");
                    }
                } catch (error) {
                    console.error('Error loading cart:', error);
                    toast.error("Failed to load cart items.");
                }
            };

            loadCartData();
        }
    }, [user]);


    const handleCheckboxChange = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id) // Bỏ chọn nếu đã được chọn
                : [...prev, id] // Thêm vào nếu chưa được chọn
        );
    };
    const handleCheckoutClick = () => {
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item to proceed to checkout.");
            return;
        }
        const formValue = {
            items: cartItems.filter(item => selectedItems.includes(item.product_id)),
            amount: calculateSubtotal(),
        };
        navigate("/checkout", {
            state: { formValue }
        });
    };

    const handleDeleteClick = async (cart_id) => {
        try {
            const response = await removeFromCart(cart_id);
            if (response && response.errCode === 0) {
                setCartItems((prevCartItems) =>
                    prevCartItems.filter((item) => item.cart_id !== cart_id)
                );

                toast.success("Item removed from the cart.");
            } else {
                toast.error("Failed to delete items.");
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error("Failed to delete items.");
        }
    };
    const [selectedItems, setSelectedItems] = useState([]);
    const handleSelectToggle = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.product_id));
        }
    };
    // Calculate subtotal dynamically
    const calculateSubtotal = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.product_id))
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2);
    };

    // Handle quantity change
    const handleQuantityChange = (product_id, delta) => {
        setCartItems(
            cartItems.map((item) => {
                if (item.product_id === product_id) {
                    const newQuantity = Math.max(1, item.quantity + delta); // Prevent quantity from going below 1
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    return (
        <div className="App">
            <div className="container my-4">
                <div className="row">
                    {/* Cart Items (Left Side) */}
                    <div className="col-md-8">
                        <h2 className="mb-3">Shopping Cart</h2>
                        <a
                            href="#"
                            className="text-primary mb-3 d-block text-decoration-none"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSelectToggle();
                            }}
                        >
                            {selectedItems.length === cartItems.length ? "Deselect all items" : "Select all items"}
                        </a>

                        {/* Dynamically render cart items */}
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item border p-3 mb-3 d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    className="me-3"
                                    checked={selectedItems.includes(item.product_id)} // Kiểm tra trạng thái
                                    onChange={() => handleCheckboxChange(item.product_id)} // Cập nhật trạng thái khi thay đổi
                                />
                                <img
                                    src={item.image ? item.image.split("; ")[0] : "default-image.jpg"}
                                    alt={item.name}
                                    className="me-3"
                                    style={{ width: '100px', height: 'auto' }}
                                />
                                <div className="flex-grow-1">
                                    <h5>{item.name}</h5>
                                    <div className="d-flex align-items-center">
                                        <div className="input-group w-auto me-3">
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => handleQuantityChange(item.product_id, -1)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="text"
                                                className="form-control text-center"
                                                value={item.quantity}
                                                readOnly
                                                style={{ width: '50px' }}
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => handleQuantityChange(item.product_id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <a onClick={() => handleDeleteClick(item.cart_id)} href="#" className="text-primary me-3">Delete</a>
                                        <a href="#" className="text-primary me-3">Compare with similar items</a>
                                        <a href="#" className="text-primary">Share</a>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h5>${(item.price * item.quantity).toFixed(2)}</h5>
                                </div>
                            </div>
                        ))}

                        {/* Subtotal */}
                        <div className="text-end">
                            <h5>
                                {selectedItems.length !== 0 ? `Subtotal (${selectedItems.length} items): $${calculateSubtotal()}` : "No items selected"}
                            </h5>

                        </div>
                    </div>

                    {/* Checkout Section (Right Side) */}
                    <div className="col-md-4">
                        <div className="border p-3 mb-3">
                            <h5>
                                {selectedItems.length !== 0 ? `Subtotal (${selectedItems.length} items): $${calculateSubtotal()}` : "No items selected"}
                            </h5>
                            <button onClick={handleCheckoutClick} className="btn btn-primary w-100">Proceed to checkout</button>
                        </div>

                        {/* International Top Sellers */}
                        <div className="border p-3">
                            <h6>International Top Sellers</h6>
                            <div className="d-flex align-items-center mb-2">
                                <img src="https://via.placeholder.com/50" alt="Product" className="me-2" />
                                <div>
                                    <p>FUJIFILM Instax Mini... <br /> $104.61 <br /> -30% $74.14 ($0.74/Count)</p>
                                </div>
                            </div>
                            <p>List: $220.59 <br /> Get it Apr 25 - May 13</p>
                            <a href="#" className="text-primary">See all buying options</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
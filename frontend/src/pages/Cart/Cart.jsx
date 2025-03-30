import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';
import './Cart.css'; // Import custom CSS for Cart component
import Laptop from '../../assets/images/laptop1.jpg'; // Example image import

const Cart = () => {
    // Sample dynamic data (this could come from an API or props)
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Kingston FURY Beast RGB 32GB (2x16GB) 6000MT/s DDR5 CL30 Desktop Memory",
            description: "AMD EXPO | Plug N Play | Kit of 2 | KF560C30BBEAK2-32",
            image: Laptop, // Replace with actual image URL
            price: 124.99,
            quantity: 1,
            style: "6000MT/s",
            size: "32GB (2x16GB)",
        },
        {
            id: 2,
            name: "NIAKUN 16 Inch Laptop Computer, Gaming Laptop",
            description: "16GB RAM 1TB SSD, N95 Processor, FHD 1920 x 1200, 180 Angle Open, Backlit Keyboard",
            image: "https://via.placeholder.com/100", // Replace with actual image URL
            price: 369.99,
            quantity: 1,
            style: "N95",
            capacity: "16GB RAM + 1TB SSD",
        },
    ]);

    // Calculate subtotal dynamically
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Handle quantity change
    const handleQuantityChange = (id, delta) => {
        setCartItems(
            cartItems.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta); // Prevent quantity from going below 1
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    return (
        <div className="App">
            {/* Header */}
            <Header />

            {/* Main Cart Section */}
            <div className="container my-4">
                <div className="row">
                    {/* Cart Items (Left Side) */}
                    <div className="col-md-8">
                        <h2 className="mb-3">Shopping Cart</h2>
                        <a href="#" className="text-primary mb-3 d-block">Deselect all items</a>

                        {/* Dynamically render cart items */}
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item border p-3 mb-3 d-flex align-items-center">
                                <input type="checkbox" className="me-3" defaultChecked />
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="me-3"
                                    style={{ width: '100px', height: 'auto' }}
                                />
                                <div className="flex-grow-1">
                                    <h5>{item.name}</h5>
                                    <p className="text-muted">{item.description}</p>
                                    {item.style && <p><strong>Style:</strong> {item.style}</p>}
                                    {item.size && <p><strong>Size:</strong> {item.size}</p>}
                                    {item.capacity && <p><strong>Capacity:</strong> {item.capacity}</p>}
                                    <div className="d-flex align-items-center">
                                        <div className="input-group w-auto me-3">
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => handleQuantityChange(item.id, -1)}
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
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <a href="#" className="text-primary me-3">Delete</a>
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
                            <h5>Subtotal ({cartItems.length} items): ${calculateSubtotal()}</h5>
                        </div>
                    </div>

                    {/* Checkout Section (Right Side) */}
                    <div className="col-md-4">
                        <div className="border p-3 mb-3">
                            <h5>Subtotal ({cartItems.length} items): ${calculateSubtotal()}</h5>
                            <button className="btn btn-primary w-100">Proceed to checkout</button>
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

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Cart;
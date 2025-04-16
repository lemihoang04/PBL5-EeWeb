import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { PaymentZaloPay } from "../../services/apiService.js";
import { UserContext } from "../../context/UserProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckOut } from "../../services/apiService.js";
import "./Checkout.css";
const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const formValue = location.state?.formValue || null;

    useEffect(() => {
        if (formValue === null) {
            navigate("/home");
        }
    }, [formValue, navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "Viet Nam",
        address: "",
        payment: "",
    });

    useEffect(() => {
        if (user?.account) {
            setFormData({
                name: user.account.name || '',
                email: user.account.email || '',
                phone: user.account.phone || '',
                address: user.account.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePaymentChange = (e) => {
        setFormData({ ...formData, payment: e.target.id });
    };

    const handleSubmit = async () => {
        if (!formData.payment) {
            toast.error("Please select a payment method.");
            return;
        }
        if (formData.payment === "pay_later") {
            const orderData = {
                user_id: user.account.id,
                order_items: formValue.items.map((item) => ({
                    cart_id: item.cart_id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    total_price: item.price * item.quantity,
                })),
                total_amount: formValue.amount,
                payment_method: formData.payment,
                shipping_address: formData.address + ", " + formData.country,
            };
            try {
                const response = await CheckOut(orderData);
                if (response && response.errCode === 0) {
                    toast.success("Order placed successfully. You will pay when you receive the goods.");
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Error while saving order information: " + error.message);
            }
        } else if (formData.payment === "online_payment") {
            // Xử lý thanh toán online qua ZaloPay như cũ
            try {
                let payment = await PaymentZaloPay({
                    name: formData.name,
                    amount: formValue.amount,
                });
                if (payment && payment.return_code === 1) {
                    window.location.href = payment.order_url;
                } else {
                    toast.error("Payment Failed");
                }
            } catch (e) {
                toast.error("Error while Deposit Money");
            }
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                {/* Billing Details */}
                <div className="col-md-7">
                    <h3 className="mb-4 p-2 border-bottom">Billing Details</h3>

                    <div className="mb-3">
                        <label className="form-label">Full Name*</label>
                        <input
                            type="text"
                            className="form-control"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Number*</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Country*</label>
                        <input
                            type="text"
                            className="form-control"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Street Address*</label>
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-md-5">
                    <h3>Your Order</h3>
                    <div className="border p-3 rounded">
                        <div className="d-flex justify-content-between mb-2">
                            <strong>PRODUCT</strong>
                            <strong>TOTAL</strong>
                        </div>
                        {formValue.items.map((item) => (
                            <div className="d-flex justify-content-between mb-1" key={item.id}>
                                <span className="d-flex align-items-center">
                                    <span className="product-name me-2">{item.name}</span> {/* Tên sản phẩm */}
                                    <strong><span>x {item.quantity}</span></strong> {/* Số lượng */}
                                </span>
                                <span>${(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between">
                            <strong>Subtotal</strong>
                            <strong>${formValue.amount}</strong>
                        </div>
                        <div className="d-flex justify-content-between text-primary mt-2">
                            <strong>TOTAL</strong>
                            <strong>${formValue.amount}</strong>
                        </div>
                        <div className="form-check mt-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment"
                                id="pay_later"
                                checked={formData.payment === "pay_later"}
                                onChange={handlePaymentChange}
                            />
                            <label className="form-check-label" htmlFor="pay_later">
                                Pay later
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment"
                                id="online_payment"
                                checked={formData.payment === "online_payment"}
                                onChange={handlePaymentChange}
                            />
                            <label className="form-check-label" htmlFor="online_payment">
                                Online payment
                            </label>
                        </div>

                        {/* Submit Button for Desktop */}
                        <button className="btn btn-dark w-100 mt-3" onClick={handleSubmit}>
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

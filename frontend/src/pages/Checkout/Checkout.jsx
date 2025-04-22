import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { PaymentZaloPay, CheckOut } from "../../services/apiService.js";
import { UserContext } from "../../context/UserProvider";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, fetchUser } = useContext(UserContext);
    const formValue = location.state?.formValue || null;
    const [isLoading, setIsLoading] = useState(false);

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

    const [discountCode, setDiscountCode] = useState("");
    const [discount, setDiscount] = useState({
        applied: false,
        amount: 0,
        code: ""
    });
    const [totalAmount, setTotalAmount] = useState(formValue?.amount || 0);

    useEffect(() => {
        if (user?.account) {
            setFormData({
                name: user.account.name || '',
                email: user.account.email || '',
                phone: user.account.phone || '',
                country: "Viet Nam",
                address: user.account.address || ''
            });
        }
    }, [user]);

    useEffect(() => {
        // Update total amount when discount changes
        if (formValue) {
            const newTotal = formValue.amount - discount.amount;
            setTotalAmount(newTotal > 0 ? newTotal : 0);
        }
    }, [discount, formValue]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePaymentChange = (e) => {
        setFormData({ ...formData, payment: e.target.id });
    };

    const applyDiscountCode = () => {
        if (!discountCode.trim()) {
            toast.error("Please enter a discount code");
            return;
        }

        // Simulated discount validation
        // In a real app, this would be an API call to validate the code
        const mockDiscounts = {
            "WELCOME10": { percentage: 10, maxAmount: 50 },
            "SAVE20": { percentage: 20, maxAmount: 100 },
            "FREESHIP": { fixedAmount: 5 }
        };

        const foundDiscount = mockDiscounts[discountCode.toUpperCase()];

        if (foundDiscount) {
            let discountAmount = 0;

            if (foundDiscount.percentage) {
                discountAmount = (formValue.amount * foundDiscount.percentage) / 100;
                if (foundDiscount.maxAmount && discountAmount > foundDiscount.maxAmount) {
                    discountAmount = foundDiscount.maxAmount;
                }
            } else if (foundDiscount.fixedAmount) {
                discountAmount = foundDiscount.fixedAmount;
            }

            setDiscount({
                applied: true,
                amount: discountAmount,
                code: discountCode.toUpperCase()
            });

            toast.success(`Discount code "${discountCode.toUpperCase()}" applied successfully!`);
        } else {
            toast.error("Invalid discount code. Please try another one.");
        }
    };

    const removeDiscount = () => {
        setDiscount({
            applied: false,
            amount: 0,
            code: ""
        });
        setDiscountCode("");
        toast.info("Discount code removed");
    };

    const handleSubmit = async () => {
        if (!formData.payment) {
            toast.error("Please select a payment method.");
            return;
        }
        const orderData = {
            user_id: user.account.id,
            order_items: formValue.items.map((item) => ({
                cart_id: item.cart_id,
                product_id: item.product_id,
                quantity: item.quantity,
                total_price: item.price * item.quantity,
            })),
            isBuyNow: formValue.isBuyNow,
            total_amount: totalAmount,
            discount_amount: discount.amount,
            discount_code: discount.code,
            payment_method: formData.payment,
            shipping_address: formData.address + ", " + formData.country,
        };
        if (formData.payment === "pay_later") {
            setIsLoading(true);
            try {
                const response = await CheckOut(orderData);
                if (response && response.errCode === 0) {
                    toast.success("Order placed successfully. You will pay when you receive the goods.");
                    fetchUser();
                    setTimeout(() => navigate("/orders"), 2000); // Extended to 2 seconds to show the spinner
                } else {
                    toast.error(response.message);
                    setIsLoading(false);
                }
            } catch (error) {
                toast.error("Error while saving order information: " + error.message);
                setIsLoading(false);
            }
        } else if (formData.payment === "online_payment") {
            localStorage.setItem("pendingOrderData", JSON.stringify(orderData));
            setIsLoading(true);
            try {
                let payment = await PaymentZaloPay({
                    name: formData.name,
                    amount: totalAmount,
                });
                if (payment && payment.return_code === 1) {
                    window.location.href = payment.order_url;
                } else {
                    toast.error("Payment Failed");
                    setIsLoading(false);
                }
            } catch (e) {
                toast.error("Error while processing payment");
                setIsLoading(false);
            }
        }
    };

    // Input field component for consistent styling
    const FormInput = ({ label, name, type = "text", placeholder, value, required = true }) => (
        <div className="checkout-form-group">
            <label className="checkout-label">
                {label} {required && <span className="checkout-required">*</span>}
            </label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                required={required}
                className="checkout-input"
            />
        </div>
    );

    return (
        <div className="checkout-wrapper">
            {isLoading && (
                <div className="checkout-loading-overlay">
                    <div className="checkout-spinner"></div>
                    <p className="checkout-loading-text">Processing your order...</p>
                </div>
            )}
            <div className="checkout-container">
                <div className="checkout-header">
                    <h1 className="checkout-title">Checkout</h1>
                    <p className="checkout-subtitle">Complete your purchase securely</p>
                </div>

                <div className="checkout-content">
                    {/* Billing Details */}
                    <div className="checkout-billing">
                        <h2 className="checkout-section-title">Billing Details</h2>

                        <FormInput
                            label="Full Name"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                        />

                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                        />

                        <FormInput
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                        />

                        <FormInput
                            label="Country"
                            name="country"
                            value={formData.country}
                        />

                        <FormInput
                            label="Street Address"
                            name="address"
                            placeholder="Enter your complete address"
                            value={formData.address}
                        />
                    </div>

                    {/* Order Summary */}
                    <div className="checkout-summary">
                        <div className="checkout-summary-header">
                            <h2 className="checkout-section-title">Order Summary</h2>
                        </div>

                        <div className="checkout-summary-content">
                            {/* Products */}
                            <div className="checkout-products">
                                <div className="checkout-products-header">
                                    <span>PRODUCT</span>
                                    <span>TOTAL</span>
                                </div>

                                <div className="checkout-products-list">
                                    {formValue?.items.map((item) => (
                                        <div className="checkout-product-item" key={item.id}>
                                            <div className="checkout-product-info">
                                                <span className="checkout-product-name">{item.title}</span>
                                                <span className="checkout-product-quantity">x{item.quantity}</span>
                                            </div>
                                            <span className="checkout-product-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Discount Code Section */}
                            <div className="checkout-discount">
                                <h3 className="checkout-discount-title">Discount Code</h3>

                                {!discount.applied ? (
                                    <div className="checkout-discount-input-group">
                                        <input
                                            type="text"
                                            placeholder="Enter discount code"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            className="checkout-discount-input"
                                        />
                                        <button
                                            onClick={applyDiscountCode}
                                            className="checkout-discount-button"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                ) : (
                                    <div className="checkout-discount-applied">
                                        <div className="checkout-discount-info">
                                            <span className="checkout-discount-code">{discount.code}</span>
                                            <span className="checkout-discount-value">-${discount.amount.toFixed(2)}</span>
                                        </div>
                                        <button
                                            onClick={removeDiscount}
                                            className="checkout-discount-remove"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="checkout-totals">
                                <div className="checkout-subtotal">
                                    <span>Subtotal</span>
                                    <span>${Number(formValue?.amount).toFixed(2)}</span>
                                </div>

                                {discount.applied && (
                                    <div className="checkout-discount-row">
                                        <span>Discount</span>
                                        <span>-${discount.amount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="checkout-total">
                                    <span>Total</span>
                                    <span>${Number(totalAmount).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="checkout-payment-methods">
                                <h3 className="checkout-payment-title">Payment Method</h3>

                                <div className="checkout-payment-options">
                                    <label
                                        className={`checkout-payment-option ${formData.payment === "pay_later" ? "selected" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="pay_later"
                                            checked={formData.payment === "pay_later"}
                                            onChange={handlePaymentChange}
                                            className="checkout-payment-radio"
                                        />
                                        <div className="checkout-payment-details">
                                            <span className="checkout-payment-name">Pay later (Cash on Delivery)</span>
                                            <p className="checkout-payment-description">Pay with cash when your order is delivered</p>
                                        </div>
                                    </label>

                                    <label
                                        className={`checkout-payment-option ${formData.payment === "online_payment" ? "selected" : ""}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="online_payment"
                                            checked={formData.payment === "online_payment"}
                                            onChange={handlePaymentChange}
                                            className="checkout-payment-radio"
                                        />
                                        <div className="checkout-payment-details">
                                            <span className="checkout-payment-name">Online payment with ZaloPay</span>
                                            <p className="checkout-payment-description">Pay securely using ZaloPay</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handleSubmit}
                                className="checkout-submit-button"
                            >
                                PLACE ORDER
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
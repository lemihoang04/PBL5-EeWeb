import React from "react";

const ZaloPayButton = () => {
    const handlePay = async () => {
        const res = await fetch("http://localhost:5000/create-zalopay-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 10000 }),
        });

        const data = await res.json();
        if (data.order_url) {
            window.location.href = data.order_url; // redirect tới trang thanh toán ZaloPay
        } else {
            alert("Không tạo được đơn hàng!");
            console.log(data);
        }
    };

    return (
        <button
            onClick={handlePay}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Thanh toán ZaloPay
        </button>
    );
};

export default ZaloPayButton;

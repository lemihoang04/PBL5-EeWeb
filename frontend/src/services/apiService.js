import axios from "../setup/axios";

const loadCart = async (userId) => {
	try {
		const response = await axios.get(`/cart/${userId}`);
		return response;
	} catch (error) {
		console.error("Error loading cart:", error);
		throw error.response.data;
	}
};
const addToCart = async (userId, product_id, quantity = 1) => {
	try {
		const response = await axios.post('/addToCart', {
			user_id: userId,
			product_id: product_id,
			quantity: quantity,
		});
		return response;
	} catch (error) {
		console.error("Error adding to cart:", error);
		throw error.response.data;
	}
};
const removeFromCart = async (cart_id) => {
	try {
		const response = await axios.delete(`/delete_cart/${cart_id}`);
		return response;
	} catch (error) {
		console.error("Error removing from cart:", error);
		throw error.response.data;
	}
}
const CheckPayment = async (apptransid) => {
	return axios.post(
		"/payment/CheckZaloPay",
		{ app_trans_id: apptransid },
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}
	);
};
const PaymentZaloPay = async (user) => {
	return axios.post("/create_order", user, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
};
const CheckOut = async (orderData) => {
	// try {
	// 	const response = await fetch("/api/checkout", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(orderData),
	// 	});
	// 	return await response.json();
	// } catch (error) {
	// 	console.error("Error during checkout:", error);
	// 	throw error;
	// }
	return axios.post("/checkout", orderData, {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
export {
	loadCart,
	addToCart,
	removeFromCart,
	CheckPayment,
	PaymentZaloPay,
	CheckOut,
};

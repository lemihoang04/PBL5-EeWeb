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
const CreatePayment = (form) => {
	return axios
		.post("/payments", form, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			return response;
		})
		.catch((error) => {
			console.error(error);
		});
};
const UpdatePayment = (booking_id) => {
	return axios
		.put(`/payments/${booking_id}`, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			return response;
		})
		.catch((error) => {
			console.error(error);
		});
};

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
const ChangeRoomAva = async (form) => {
	return axios.put(`/rooms/${form.RoomID}`, form, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
};
const DeleteRooms = async (id_rooms) => {
	return axios.delete(`/rooms/${id_rooms}`, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
};
export {
	loadCart,
	addToCart,
	removeFromCart,
	UpdatePayment,
	CreatePayment,
	CheckPayment,
	PaymentZaloPay,
	ChangeRoomAva,
	DeleteRooms,
};

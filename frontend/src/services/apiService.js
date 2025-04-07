import axios from "../setup/axios";

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
	UpdatePayment,
	CreatePayment,
	CheckPayment,
	PaymentZaloPay,
	ChangeRoomAva,
	DeleteRooms,
};

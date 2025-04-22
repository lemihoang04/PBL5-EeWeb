import axios from "../setup/axios";
const LoginUser = (data) => {
	return axios
		.post("/login", data, {
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
const LoginAdmin = (data) => {
	return axios
		.post("/loginAdmin", data, {
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

const CreateNewUser = (data) => {
	return axios
		.post("/register", data, {
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
const GetAllUser = () => {
	return axios
		.get("/users", {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			return response;
		})
		.catch((err) => {
			console.log(err);
		});
};
const GetUserID = (userID) => {
	return axios
		.get(`/users/${userID}`, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
		.then((response) => {
			return response;
		})
		.catch((err) => {
			console.log(err);
		});
};
const getUserAccount = () => {
	return axios.get("/api/account");
};
const getAdminAccount = () => {
	return axios.get("/api/admin");
};
const LogOutUser = () => {
	return axios.post("/logout");
};
const DeleteUser = (idUser) => {
	return axios.delete(`/users/${idUser}`, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
};
const EditUser = (user_edit, formValue) => {
	return axios.put(`/users/${user_edit}`, formValue, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
};
const changePassword = async (userId, oldPassword, newPassword) => {
	try {
		const response = await axios.put('/changePassword', {
			userid: userId,
			oldPassword,
			newPassword,
		});
		return response;
	} catch (error) {
		console.error("Error changing password:", error);
		throw error.response.data;
	}
};

const forgotPassword = async (email) => {
	try {
		const response = await axios.post('/forgotPassword', { email }, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error in forgot password request:", error);
		throw error.response ? error.response.data : error;
	}
};

const verifyOTP = async (email, otp) => {
	try {
		const response = await axios.post('/verifyOTP', { email, otp }, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error verifying OTP:", error);
		throw error.response ? error.response.data : error;
	}
};

const resetPassword = async (email, otp, newPassword) => {
	try {
		const response = await axios.post('/resetPassword', {
			email,
			otp,
			newPassword
		}, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Error resetting password:", error);
		throw error.response ? error.response.data : error;
	}
};

export {
	LoginUser,
	LoginAdmin,
	CreateNewUser,
	GetAllUser,
	getAdminAccount,
	getUserAccount,
	LogOutUser,
	EditUser,
	DeleteUser,
	GetUserID,
	changePassword,
	forgotPassword,
	verifyOTP,
	resetPassword,
};

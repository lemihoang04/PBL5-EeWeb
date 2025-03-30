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
const EditUserService = (user_edit, formValue) => {
	return axios.put(`/users/${user_edit}`, formValue, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
};
const DeleteUser = (idUser) => {
	return axios.delete(`/users/${idUser}`, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
};
export {
	LoginUser,
	LoginAdmin,
	CreateNewUser,
	GetAllUser,
	getAdminAccount,
	getUserAccount,
	LogOutUser,
	EditUserService,
	DeleteUser,
	GetUserID,
};

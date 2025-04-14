import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
	const userDefault = {
		isLoading: true,
		isAuthenticated: false,
		account: {},
	};
	const [user, setUser] = useState(userDefault);
	const [admin, setAdmin] = useState(userDefault);

	useEffect(() => {
		const storedUser = sessionStorage.getItem("user");
		const storedAdmin = sessionStorage.getItem("admin");

		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				console.error("Error parsing user data:", error);
			}
		}

		if (storedAdmin) {
			try {
				setAdmin(JSON.parse(storedAdmin));
			} catch (error) {
				console.error("Error parsing admin data:", error);
			}
		}
	}, []);

	const loginUser = (userData) => {
		setUser(userData);
		sessionStorage.setItem("user", JSON.stringify(userData));
	};

	const updateUser = (userData) => {
		setUser((prev) => ({ ...prev, account: { ...prev.account, ...userData } }));
		sessionStorage.setItem("user", JSON.stringify({ ...user, account: { ...user.account, ...userData } }));
	};

	const loginAdmin = (adminData) => {
		setAdmin(adminData);
		sessionStorage.setItem("admin", JSON.stringify(adminData));
	};

	const logoutUser = () => {
		setUser(null);
		sessionStorage.removeItem("user");
	};

	const logoutAdmin = () => {
		setAdmin(null);
		sessionStorage.removeItem("admin");
	};

	return (
		<UserContext.Provider value={{ user, admin, loginUser, updateUser, loginAdmin, logoutUser, logoutAdmin }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;

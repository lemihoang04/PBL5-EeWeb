import React, { createContext, useState, useEffect } from "react";
import { getUserAccount } from "../services/userService";
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
		fetchUser();
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

	const fetchUser = async () => {
		console.log('🔍 fetchUser called');
		console.trace();
		try {
			const response = await getUserAccount();
			if (response && response.errCode === 0) {
				setUser({
					isAuthenticated: true,
					account: { ...response.user, cart_items_count: response.cart_items_count },
					isLoading: false,
				});
			} else {
				setUser({ ...userDefault, isLoading: false });
			}
		} catch (error) {
			console.error("Error fetching user:", error);
			setUser({ ...userDefault, isLoading: false });
		}
	};


	const logoutUser = () => {
		setUser(null);
		sessionStorage.removeItem("user", "chatMessages");

	};

	const logoutAdmin = () => {
		setAdmin(null);
		sessionStorage.removeItem("admin");
	};
	useEffect(() => {
		if (
			window.location.pathname !== "/login" &&
			window.location.pathname !== "/register"
		) {
			fetchUser();
		} else {
			setUser({ ...user, isLoading: false });
		}
	}, []);
	return (
		<UserContext.Provider value={{ user, loginUser, updateUser, logoutUser, fetchUser }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;

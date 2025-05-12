import axios from "../setup/axios";


const LoginAdmin = (data) => {
    return axios
        .post("/admin/login", data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        });
};
const LogoutAdmin = () => {
    return axios
        .post("/admin/logout")
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        });
};
const getDashboardStats = async () => {
    try {
        const response = await axios.get(`/admin/dashboard/stats`);
        return response;
    } catch (error) {
        console.error("Error loading dashboard stats:", error);
        throw error.response.data;
    }
};

export {
    LoginAdmin,
    LogoutAdmin,
    getDashboardStats,
}
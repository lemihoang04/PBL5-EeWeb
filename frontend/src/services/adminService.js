import axios from "../setup/axios";

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
    getDashboardStats,
}
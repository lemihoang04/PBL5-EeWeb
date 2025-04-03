import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "../pages/Admin/Admin";
import NotFound from "../components/NotFound";

// Giả sử có một hàm kiểm tra quyền admin
const isAdmin = () => {
    // Code kiểm tra quyền admin (ví dụ: check token hoặc state user)
    return localStorage.getItem("role") === "admin";
};

const AdminRoutes = () => {
    return (
        <Routes>
            {isAdmin() ? (
                <>
                    <Route path="/admin" element={<Admin />} />
                </>
            ) : (
                <Route path="/admin" element={<Navigate to="/login" />} />
            )}

        </Routes>
    );
};

export default AdminRoutes;

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

const UserRouter = ({ children }) => {
    const { user } = useContext(UserContext);
    if (user.isLoading) {
        // Có thể hiển thị loading spinner ở đây nếu muốn
        return <div>Loading...</div>;
    }
    if (!user.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default UserRouter;
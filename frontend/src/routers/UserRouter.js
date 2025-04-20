import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

const UserRouter = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user || !user.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default UserRouter;
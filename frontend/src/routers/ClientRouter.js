import { BrowserRouter as Router } from "react-router-dom";
import AppContextProvider from "../context/AppContext";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
    return (
        <AppContextProvider>
            <Router>
                <UserRoutes />
                <AdminRoutes />
            </Router>
        </AppContextProvider>
    );
};

export default AppRoutes;

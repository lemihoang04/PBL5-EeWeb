import Header from "../components/Header/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
    return (
        <>
            <Header />
            <main style={{ minHeight: "80vh" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default UserLayout;

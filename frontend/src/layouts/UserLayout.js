import Header from "../pages/HeaderNew/HeaderNew";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
    return (
        <>
            <Header />
            {/* <main style={{ minHeight: "80vh" }}> */}
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default UserLayout;

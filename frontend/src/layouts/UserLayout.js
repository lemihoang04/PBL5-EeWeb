import Header from "./Header/Header";
import Footer from "./Footer/Footer";
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

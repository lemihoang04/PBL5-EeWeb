import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";
import Chatbot from "./Chatbot/Chatbot";

const UserLayout = () => {
    return (
        <>
            <Header />
            {/* <main style={{ minHeight: "80vh" }}> */}
            <main>
                <Outlet />
            </main>
            <Footer />
            <Chatbot />
        </>
    );
};

export default UserLayout;

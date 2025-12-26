import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../common/Footer";

const UserLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans text-gray-900">
            <Navbar />
            <main className="flex-1 w-full max-w-[1600px] mx-auto pt-24 px-4 sm:px-6 lg:px-12 xl:px-20 pb-12">
                {children || <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "../ui/spinner";
import Footer from "../common/Footer";

const ProtectedLayout = () => {
  const { userData, isCheckingAuth } = useSelector((state) => state.user);

  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-bg">
        <Spinner className="w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;

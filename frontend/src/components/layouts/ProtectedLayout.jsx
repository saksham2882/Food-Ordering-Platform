import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { userData, isCheckingAuth } = useSelector((state) => state.user);

  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
    </div>
  );
};

export default ProtectedLayout;

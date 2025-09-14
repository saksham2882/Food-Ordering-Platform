import { useSelector } from "react-redux";
import UserDashboard from "../components/userDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoy from "../components/DeliveryBoy";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  
  return (
    <div className="w-[100vw] min-h-[100vh] pt-[100px] flex items-center bg-bg">
      {userData.role == "user" && <UserDashboard />}
      {userData.role == "owner" && <OwnerDashboard />}
      {userData.role == "deliveryBoy" && <DeliveryBoy />}
    </div>
  );
};

export default Home;

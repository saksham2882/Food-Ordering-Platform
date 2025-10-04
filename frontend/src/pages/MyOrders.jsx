import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard"
import { useEffect } from "react";
import { setMyOrders } from "../redux/userSlice";

const MyOrders = () => {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if (data.shopOrders?.owner._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    });

    return () => {
      socket?.off("newOrder");
    };
  }, [socket]);

  return (
    <div className="w-full min-h-screen bg-bg flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">
        {/* ----------- back button and heading ---------- */}
        <div className="flex items-center gap-[20px] mb-6">
          <div className=" z-[10] cursor-pointer" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-start">My Orders</h1>
        </div>

        {/* ----------- Orders ------------- */}
        <div className="space-y-6">
          {myOrders?.map((order, index) =>
            userData.role == "user" ? (
              <UserOrderCard data={order} key={index} />
            ) : userData.role == "owner" ? (
              <OwnerOrderCard data={order} key={index} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};
export default MyOrders;

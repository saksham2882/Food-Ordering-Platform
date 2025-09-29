import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { TbReceipt } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user
  );
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success(res.data.message || "Log Out Successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-bg overflow-visible">
      {/* ---------- Show search in small devices ----------- */}
      {showSearch && userData.role == "user" && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden">
          {/* ----------- Location ------------ */}
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-primary" />
            <div className="w-[80%] truncate text-gray-600">{currentCity}</div>
          </div>

          {/* ----------- Search ------------- */}
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-primary" />
            <input
              type="text"
              placeholder="search delicious food...."
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2 text-primary">Yummigo</h1>

      {userData.role == "user" && (
        <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-md rounded-lg items-center gap-[20px] md:flex hidden">
          {/* ----------- Location ------------ */}
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-primary" />
            <div className="w-[80%] truncate text-gray-600">{currentCity}</div>
          </div>

          {/* ----------- Search ------------- */}
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-primary" />
            <input
              type="text"
              placeholder="search delicious food...."
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* ----------- Search in small devices -------- */}
        {userData.role == "user" &&
          (showSearch ? (
            <RxCross2
              size={25}
              className="text-primary cursor-pointer md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-primary cursor-pointer md:hidden"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {userData.role == "owner" ? (
          <>
            {myShopData && (
              <>
                {/* ----------- Add Food Button for Owner ----------  */}
                <button
                  className="hidden md:flex items-center gap-2 p-1 px-3 cursor-pointer rounded-full bg-primary/10 text-primary"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={20} />
                  <span>Add Food Item</span>
                </button>
                <button
                  className="md:hidden flex items-center gap-1 p-2 cursor-pointer rounded-full bg-primary/10 text-primary"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={20} />
                </button>
              </>
            )}

            {/* ------------ Pending Orders Button for Owner ----------- */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt size={20} />
              <span>Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-primary rounded-full px-[6px] py-[1px]">
                0
              </span>
            </div>
            <div
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt size={20} />
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-primary rounded-full px-[6px] py-[1px]">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {/* ------------ cart ----------- */}
            {userData.role == "user" && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <FiShoppingCart size={25} className="text-primary" />
                <span className="absolute right-[-9px] top-[-12px] text-primary">
                  {cartItems.length}
                </span>
              </div>
            )}

            {/* ------------ my orders ---------- */}
            <button
              className="hidden md:block px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium cursor-pointer"
              onClick={() => navigate("/my-orders")}
            >
              My Orders
            </button>
          </>
        )}

        {/* ------------ user profile ----------  */}
        <div
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-primary text-white text-[18px] shadow-md font-semibold cursor-pointer"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          {userData?.fullName.slice(0, 1)}
        </div>

        {/* ------------ Profile Popup ----------- */}
        {showPopup && (
          <div
            className={`fixed top-[80px] right-[10px] ${
              userData.role == "deliveryBoy"
                ? "md:right-[20%] lg:right-[40%]"
                : "md:right-[19%] lg:right-[35%]"
            }  w-[180px] bg-white shadow-xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]`}
          >
            {/* -------- full Name -------- */}
            <div className="text-[17px] font-semibold text-gray-700">
              {userData.fullName}
            </div>

            {/* -------- my orders --------- */}
            {userData.role == "user" && (
              <div
                className="md:hidden text-primary font-semibold cursor-pointer"
                onClick={() => navigate("/my-orders")}
              >
                My Orders
              </div>
            )}

            {/* -------- Logout ----------- */}
            <div
              className="text-primary font-semibold cursor-pointer"
              onClick={handleLogOut}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;

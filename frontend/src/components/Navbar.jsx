import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx"
import { useState } from "react";
import axios from "axios";
import { URL } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { userData, city } = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [showPopup, setShowPopup] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogOut = async () => {
    try {
      const res = await axios.get(`${URL}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null))
      toast.success(res.data.message || "Log Out Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-bg overflow-visible">
      {/* ---------- Show search in small devices ----------- */}
      {showSearch && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden">
          {/* ----------- Location ------------ */}
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-primary" />
            <div className="w-[80%] truncate text-gray-600">{city}</div>
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

      <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-md rounded-lg items-center gap-[20px] md:flex hidden">
        {/* ----------- Location ------------ */}
        <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
          <FaLocationDot size={25} className="text-primary" />
          <div className="w-[80%] truncate text-gray-600">{city}</div>
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

      <div className="flex items-center gap-4">
        {/* ----------- Search in small devices -------- */}
        {showSearch ? (
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
        )}

        {/* ------------ cart ----------- */}
        <div className="relative cursor-pointer">
          <FiShoppingCart size={25} className="text-primary" />
          <span className="absolute right-[-9px] top-[-12px] text-primary">
            0
          </span>
        </div>

        {/* ------------ my orders ---------- */}
        <button className="hidden md:block px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium cursor-pointer">
          My Orders
        </button>

        {/* ------------ user profile ----------  */}
        <div
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-primary text-white text-[18px] shadow-md font-semibold cursor-pointer"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          {userData?.fullName.slice(0, 1)}
        </div>

        {/* ------------ Profile Popup ----------- */}
        {showPopup && (
          <div className="fixed top-[80px] right-[10px] md:right-[10%] lg:right-[20%] w-[180px] bg-white shadow-xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
            {/* -------- full Name -------- */}
            <div className="text-[17px] font-semibold text-gray-700">
              {userData.fullName}
            </div>

            {/* -------- my orders --------- */}
            <div className="md:hidden text-primary font-semibold cursor-pointer">
              My Orders
            </div>

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

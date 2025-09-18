import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { FaUtensils } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-bg flex flex-col items-center">
      <Navbar />

      {/* ---------- Add Shop when not present --------- */}
      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-primary w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery and reach thousands of hungry customers
                every day.
              </p>

              <button
                className="bg-primary text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-700 hover:shadow-lg transition-colors duration-200 cursor-pointer"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl text-gray-600 flex items-center gap-3 mt-8 text-center text-shadow-sm text-shadow-gray-300 font-medium">
            <FaUtensils className="text-primary w-14 h-14" />
            <span>
              Welcome to{" "}
              <strong className="text-primary">{myShopData.name}</strong>
            </span>
          </h1>

          {/* --------------- Shop info ------------- */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-xl transition-all duration-300 w-full max-w-3xl relative">
            {/* ---------- Edit Shop button -------- */}
            <div
              className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen size={20} />
            </div>

            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-48 sm:h-64 object-cover"
            />

            <div className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {myShopData.name}
              </h1>
              <p className="text-gray-500">
                {myShopData.city}, {myShopData.state}
              </p>
              <p className="text-gray-500 mb-4">{myShopData.address}</p>
            </div>
          </div>

          {/* --------------- Add food item div when no items presents ------------ */}
          {myShopData.items.length == 0 && (
            <div className="flex justify-center items-center p-4 sm:p-6">
              <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="text-primary w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add Your Food Item
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Share your delicious creations with our customers by adding them to the menu.
                  </p>

                  <button
                    className="bg-primary text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-700 hover:shadow-lg transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/add")}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default OwnerDashboard
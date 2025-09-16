import { useSelector } from "react-redux"
import Navbar from "./Navbar"
import { FaUtensils } from "react-icons/fa6"

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner)

  return (
    <div className="w-full min-h-screen bg-bg flex flex-col items-center">
      <Navbar />

      {/* ---------- Add Shop when not present --------- */}
      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-primary w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Add Your Restaurant</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Join our food delivery and reach thousands of hungry customers every day.</p>

              <button className="bg-primary text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-700 hover:shadow-lg transition-colors duration-200 cursor-pointer">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default OwnerDashboard
import { FaLeaf } from "react-icons/fa6";
import { FaDrumstickBite } from "react-icons/fa";

const FoodCard = ({ data }) => {
  return (
    <div className="w-[250px] rounded-2xl border-2 border-primary bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* -------- Food Image --------- */}
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType == "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-700 text-lg" />
          )}
        </div>
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-gray-800 text-base truncate">{data.name}</h1>
      </div>
    </div>
  );
};

export default FoodCard;
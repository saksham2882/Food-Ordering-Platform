import { useNavigate, useParams } from "react-router-dom";
import shopApi from "../../api/shopApi";
import { useEffect, useState } from "react";
import { FaStore, FaLocationDot } from "react-icons/fa6";
import { FaUtensils, FaArrowLeft } from "react-icons/fa";
import FoodCard from "../../components/FoodCard";

const Shop = () => {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      const data = await shopApi.getItemsByShop(shopId);
      console.log(data);
      setShop(data.shop);
      setItems(data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------------- Back Button -------------- */}
      <button
        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow-md transition cursor-pointer"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft /> Back
      </button>

      {/* ----------------- Shop Info ---------------- */}
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />

            {/* -------------- Name --------------- */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {shop.name}
            </h1>

            {/* ---------------- Location --------------- */}
            <div className="flex items-center gap-[10px]">
              <FaLocationDot size={24} color="red" className="shadow-xl" />
              <p className="text-lg font-medium text-gray-200 mt-[10px]">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Menu ----------------- */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800">
          <FaUtensils color="red" /> Our Menu
        </h2>

        {/* ------------- Items ------------- */}
        {items?.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {items?.map((item) => (
              <FoodCard data={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No Items Available
          </p>
        )}
      </div>
    </div>
  );
};

export default Shop;

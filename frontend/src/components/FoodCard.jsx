import { FaLeaf, FaRegStar } from "react-icons/fa6";
import {
  FaDrumstickBite,
  FaStar,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar className="text-yellow-500 text-lg" />
        )
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };

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
        <h1 className="font-semibold text-gray-800 text-base truncate">
          {data.name}
        </h1>

        {/* ------------- rating ------------ */}
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">
            ({data.rating?.userCount || 0})
          </span>
        </div>

        {/* ------------ price & Add to Cart-------------- */}
        <div className="flex items-center justify-between mt-auto pt-5">
          <span className="font-bold text-red-700 text-lg">
            ₹{data.price}.00
          </span>

          <div className="flex items-center border rounded-full overflow-hidden shadow-md gap-1">
            {/* ----------- Decrease Button --------- */}
            <button
              className="px-2 py-1 hover:bg-gray-100 transition cursor-pointer rounded-4xl"
              onClick={handleDecrease}
            >
              <FaMinus size={12} />
            </button>

            {/* ----------- Quantity --------- */}
            <span>{quantity}</span>

            {/* ----------- Increase Button --------- */}
            <button
              className="px-2 py-1 hover:bg-gray-100 transition cursor-pointer rounded-4xl"
              onClick={handleIncrease}
            >
              <FaPlus size={12} />
            </button>

            {/* ---------- Cart ----------- */}
            <button
              className={`${
                cartItems.some((i) => i.id == data._id)
                  ? "bg-gray-700"
                  : "bg-primary"
              } text-white px-3 py-2 transition-colors cursor-pointer`}
              onClick={() => {
                quantity > 0
                  ? dispatch(
                      addToCart({
                        id: data._id,
                        name: data.name,
                        price: data.price,
                        image: data.image,
                        shop: data.shop,
                        quantity,
                        foodType: data.foodType,
                      })
                    )
                  : null;
              }}
            >
              <FaShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

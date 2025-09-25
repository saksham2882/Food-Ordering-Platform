import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { removeCartItem, updateQuantity } from "../redux/userSlice";

const Card = ({ data }) => {
  const dispatch = useDispatch();

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };
  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
      {/* ----------- left side ------------ */}
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt={data.name}
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div>
          <h1 className="font-medium text-gray-800">{data.name}</h1>
          <p className="text-sm text-gray-500">
            ₹{data.price}.00 x {data.quantity}
          </p>
          <p className="font-bold text-primary">
            ₹{data.price * data.quantity}.00
          </p>
        </div>
      </div>

      {/* ----------- right side ------------ */}
      <div className="flex items-center gap-4">
        {/* ----------- Decrease Button --------- */}
        <button
          className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200"
          onClick={() => handleDecrease(data.id, data.quantity)}
        >
          <FaMinus size={12} />
        </button>

        {/* ----------- Quantity --------- */}
        <span>{data.quantity}</span>

        {/* ----------- Increase Button --------- */}
        <button
          className="p-2 cursor-pointer bg-gray-100 rounded-full hover:bg-gray-200"
          onClick={() => handleIncrease(data.id, data.quantity)}
        >
          <FaPlus size={12} />
        </button>

        {/* ------------ Trash Button ----------- */}
        <button
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 cursor-pointer"
          onClick={() => dispatch(removeCartItem(data.id))}
        >
          <CiTrash size={18} />
        </button>
      </div>
    </div>
  );
};
export default Card;

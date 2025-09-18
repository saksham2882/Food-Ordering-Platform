import { FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { toast } from "sonner";
import { useState } from "react";

const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const isConfirmed = confirm(`Are you sure you want to delete "${data.name}" from your menu?`);
    if(!isConfirmed) return;
    
    setLoading(true)
    try {
      const res = axios.get(`${SERVER_URL}/api/item/delete/${data._id}`, {
        withCredentials: true,
      });
      dispatch(setMyShopData(res.data));
      toast.success("Item Deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-primary w-full max-w-2xl">
      <div className="w-36 flex-shrink-0 bg-gray-50">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h2 className="text-xl font-semibold text-primary">{data.name}</h2>
          <p>
            <span className="font-medium text-gray-700">Category: </span>
            {data.category}
          </p>
          <p>
            <span className="font-medium text-gray-700">Food Type: </span>
            {data.foodType}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="font-bold text-primary">
            <span className="font-medium text-gray-700">Price: </span>₹
            {data.price}.00
          </div>

          <div className="flex items-center gap-2">
            <div
              className="p-2 cursor-pointer rounded-full hover:bg-primary/10 text-primary"
              onClick={() => navigate(`/edit-item/${data._id}`)}
            >
              <FaPen size={16} />
            </div>
            <div
              className="p-2 cursor-pointer rounded-full hover:bg-primary/10 text-primary"
              onClick={handleDelete}
            >
              {loading ? <Clipboard size={15} /> : <FaTrashAlt size={16} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OwnerItemCard;

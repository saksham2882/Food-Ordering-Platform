import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const AddItem = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(null); // frontend
  const [uploadImage, setUploadImage] = useState(null); // backend
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const categories = [
    "Snacks",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "Rolls",
    "Biryani",
    "North Indian",
    "South Indian",
    "Chinese",
    "Momos",
    "Pasta",
    "Salads",
    "Desserts",
    "Ice Cream",
    "Cakes",
    "Beverages",
    "Tea & Coffee",
    "Juices",
    "Shakes",
    "Chicken",
    "Vegan",
    "Pure Veg",
    "Street Food",
    "Healthy Food",
    "Breakfast",
    "Combo Meals",
    "Other",
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    setUploadImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);
      if (uploadImage) {
        formData.append("image", uploadImage);
      }

      const res = await axios.post(
        `${SERVER_URL}/api/item/add-item`,
        formData,
        {
          withCredentials: true,
        }
      );

      // Update shop — items will be updated automatically because we populated "items"
      dispatch(setMyShopData(res.data));
      toast.success("Food Item Added");
      console.log(res)
      navigate("/")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack
          size={35}
          className="text-primary cursor-pointer"
        />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border-orange-100">
        {/* ---------- Add or Edit Shop Icon --------- */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-primary w-16 h-16" />
          </div>

          <div className="text-3xl font-extrabold text-gray-900">Add Food</div>
        </div>

        {/* ----------- Form ----------- */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* -------- Name -------- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter shop name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* ---------- image --------- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={handleImage}
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt=""
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* -------- Price -------- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              min={0}
              placeholder="Enter price"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>

          {/* -------- Food Category -------- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Category
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Select Category</option>
              {categories.map((cate, index) => (
                <option value={cate} key={index}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          {/* -------- Food Type -------- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Food Type
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
            >
              <option value="veg">veg</option>
              <option value="non veg">non veg</option>
            </select>
          </div>

          {/* ------------ Save Button ------------ */}
          <button
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all cursor-pointer"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;

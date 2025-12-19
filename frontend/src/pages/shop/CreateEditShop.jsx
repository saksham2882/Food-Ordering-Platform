import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../App";
import { setMyShopData } from "../../redux/ownerSlice";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(myShopData?.address || currentAddress);
  const [city, setCity] = useState(myShopData?.city || currentCity);
  const [state, setState] = useState(myShopData?.state || currentState);
  const [imagePreview, setImagePreview] = useState(myShopData?.image || null);    // frontend
  const [uploadImage, setUploadImage] = useState(null);                           // backend
  const [loading, setLoading] = useState(false);

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
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (uploadImage) {
        formData.append("image", uploadImage);
      }

      const res = await axios.post(`${SERVER_URL}/api/shop/create-edit`, formData, {
        withCredentials: true,
      });

      dispatch(setMyShopData(res.data))
      toast.success(!myShopData ? "Shop Created Successfully" : "Shop Updated Successfully")
      navigate("/")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
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

          <div className="text-3xl font-extrabold text-gray-900">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
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
              Shop Image
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

          {/* ---------- Address --------- */}
          <div className="flex grid-cols-1 md:grid-cols-2 gap-4">
            {/* --------- City --------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>

            {/* -------- State ----------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="Enter state"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setState(e.target.value)}
                value={state}
              />
            </div>
          </div>

          {/* ------------- Address ------------- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter shop address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
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

export default CreateEditShop;

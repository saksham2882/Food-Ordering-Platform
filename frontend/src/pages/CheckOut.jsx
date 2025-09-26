import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";
import { TbCurrentLocation } from "react-icons/tb";
import { FaMobileScreenButton, FaCreditCard } from "react-icons/fa6";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../App";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { addMyOrder } from "../redux/userSlice";

// move Map
const RecenterMap = ({ location }) => {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 16, { animate: true });
  }

  return null;
};

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const deliveryFee = totalAmount >= 499 ? 0 : totalAmount * 0.08;
  const AmountWithDeliveryFee = totalAmount + deliveryFee;
  const [loading, setLoading] = useState(false)

  // Update location
  const onDragEnd = (e) => {
    // console.log(e.target._latlng);
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  // get address by latitude and longitude (when moving the marker)
  const getAddressByLatLng = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      dispatch(setAddress(res?.data?.results[0].formatted || res?.data?.results[0].address_line2));
      setAddressInput(res?.data?.results[0].formatted || res?.data?.results[0].address_line2);
    } catch (error) {
      console.log(error);
    }
  };

  // get current location
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLng(latitude, longitude);
    });
  };

  // get latitude and longitude by address
  const getLatLngByAddress = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apiKey}`
      );

      const { lat, lon } = res.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  // handle place order
  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount: AmountWithDeliveryFee,
          cartItems,
        },
        { withCredentials: true }
      );
      dispatch(addMyOrder(res.data.newOrder))
      toast.success(res?.data?.message || "Order Placed Successfully")
      navigate("/order-placed")
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      {/* ----------- back button and heading ---------- */}
      <div
        className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
        onClick={() => navigate("/cart")}
      >
        <IoIosArrowRoundBack size={35} className="text-primary" />
      </div>

      {/* ----------- Checkout ----------- */}
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

        {/* ----------- Location ----------- */}
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <IoLocationSharp className=" text-primary" />
            Delivery Location
          </h2>

          {/* --------- location SearchBar & Buttons ----------- */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your delivery address...."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            {/* ------------- Search Button ----------- */}
            <button
              className="bg-primary hover:bg-primary/80 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              onClick={getLatLngByAddress}
            >
              <IoSearchOutline size={17} />
            </button>

            {/* ------------ current location button --------- */}
            <button
              className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={() => getCurrentLocation()}
            >
              <TbCurrentLocation size={17} />
            </button>
          </div>

          {/* -------------- Map --------------- */}
          <div className="rounded-xl border overflow-hidden">
            <div className="h-80 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                zoom={17}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap location={location} />

                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                >
                  <Popup>{addressInput}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>

        {/* ----------- Payment Method ----------- */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ----------- COD ------------ */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition cursor-pointer ${
                paymentMethod === "COD"
                  ? "border-primary bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("COD")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl " />
              </span>
              <div>
                <p className="font-medium text-gray-800">Cash On Delivery</p>
                <p className="text-xs text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
            </div>

            {/* ------------- Online -------------- */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition cursor-pointer ${
                paymentMethod === "Online"
                  ? "border-primary bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("Online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  UPI / Credit / Debit Card
                </p>
                <p className="text-xs text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------ Order Summary -----------  */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}.00</span>
              </div>
            ))}
            <hr className="border-gray-200 my-2" />

            <div className="flex justify-between font-medium text-gray-800">
              <span>Subtotal</span>
              <span>₹{totalAmount}.00</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee == 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between font-bold text-primary pt-2">
              <span>Total</span>
              <span>₹{AmountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        {/* ---------------- Place Order Button ---------------- */}
        <button
          className="w-full bg-primary hover:bg-primary/80 text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={20} color="white" />
          ) : (
            `${paymentMethod == "COD" ? "Place Order" : "Pay & Place Order"}`
          )}
        </button>
      </div>
    </div>
  );
};
export default CheckOut;

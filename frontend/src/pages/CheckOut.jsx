import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { useEffect, useState } from "react";

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
  const [addressInput, setAddressInput] = useState("");

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

      const { lat, lon } = res.data.features[0].properties
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
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
      </div>
    </div>
  );
};
export default CheckOut;

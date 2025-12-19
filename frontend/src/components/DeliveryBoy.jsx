import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import axios from "axios";
import { SERVER_URL } from "../App";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ClipLoader } from "react-spinners";

const DeliveryBoy = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const [loading, setLoading] = useState(false)

  const ratePerDelivery = 50
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)

  const getAssignments = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async (assignmentId) => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/order/get-current-order`, {
        withCredentials: true,
      });
      if (res.data._id) {
        setCurrentOrder(res.data);
      } else {
        setCurrentOrder(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptDeliveryAssignment = async (assignmentId) => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success(res.data.message || "Delivery Assignment Accepted");
      await getCurrentOrder();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  };

  const sendOTP = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/order/send-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id },
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success(res.data.message || "OTP Send Successfully");
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false)
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/order/verify-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp },
        { withCredentials: true }
      );
      console.log(res.data);
      toast.success(res.data.message || "Order Delivered Successfully");
      location.reload()
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/order/get-today-deliveries`, {withCredentials: true})
      console.log("Today Deliveries: ", res.data)
      setTodayDeliveries(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket?.on('newAssignment', (data) => {
      if(data.sentTo == userData._id){
        setAvailableAssignments(prev => [...prev, data])
      }
    })

    return () => {
      socket?.off('newAssignment')
    }
  }, [socket])

  // Live Location Tracking
  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") {
      return;
    }
    let watchId;

    if (navigator.geolocation) {
      (watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setDeliveryBoyLocation({lat: latitude, lon: longitude})

        socket.emit("updateLocation", {
          latitude,
          longitude,
          deliveryBoyId: userData._id,
        });
      })),
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        };
    }

    return () => {
      if(watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [socket, userData]);

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries()
  }, [userData]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-bg overflow-y-auto">
      <Navbar />

      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        {/* ------------- Delivery Boy Info --------------  */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-center items-center w-[90%] border border-orange-50 text-center gap-3">
          <h1 className="text-xl font-bold text-primary">
            Welcome, {userData.fullName}
          </h1>

          <p className="text-primary">
            <span className="font-bold">Latitude: </span>{" "}
            {deliveryBoyLocation?.lat},{" "}
            <span className="font-bold">Longitude: </span>{" "}
            {deliveryBoyLocation?.lon}
          </p>
        </div>

        {/* ------------ Today Deliveries Chart ------------- */}
        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100">
          <h1 className="text-lg font-bold mb-3 text-primary">
            Today Deliveries
          </h1>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#ff4d2d" />
            </BarChart>
          </ResponsiveContainer>

          {/* --------------- Total Earning --------------- */}
          <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Today's Earning
            </h1>
            <span className="text-3xl font-bold text-green-600">
              ₹{totalEarning}
            </span>
          </div>
        </div>

        {/* ------------- Available Delivery Assignments -------------- */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>

            <div className="space-y-4">
              {availableAssignments?.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center gap-2"
                    key={index}
                  >
                    {/* ------------- Delivery Assignment Info-------------- */}
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">{a?.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">
                          Delivery Address:{" "}
                        </span>{" "}
                        {a?.deliveryAddress.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {a.items.length} items | ₹{a.subtotal}
                      </p>
                    </div>

                    {/* --------------- Delivery Accept Button ------------ */}
                    <button
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600 cursor-pointer"
                      onClick={() => acceptDeliveryAssignment(a.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Available Orders</p>
              )}
            </div>
          </div>
        )}

        {/* ------------- Current Delivery Order -------------- */}
        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h2 className="text-lg font-bold mb-3">📦Current Order</h2>

            {/* ------------ delivery info ------------ */}
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                {currentOrder?.shopOrder?.shop?.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder?.deliveryAddress?.text}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrder?.shopOrder?.shopOrderItems?.length} items | ₹
                {currentOrder?.shopOrder?.subtotal}
              </p>
            </div>

            {/* ------------ Delivery Boy real-time Tracking ------------ */}
            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData?.location?.coordinates[1],
                  lon: userData?.location?.coordinates[0],
                },
                customerLocation: {
                  lat: currentOrder?.deliveryAddress?.latitude,
                  lon: currentOrder?.deliveryAddress?.longitude,
                },
              }}
            />

            {/* ------------ Order Delivered Confirmation button -------------- */}
            {!showOtpBox ? (
              <button
                className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200 cursor-pointer"
                onClick={sendOTP}
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Mark As Delivered"}
              </button>
            ) : (
              <div className="mt-4 p-4 border rounded-xl bg-gray-50">
                <p className="text-sm font-semibold mb-2">
                  Enter OTP send to{" "}
                  <span className="text-orange-500">
                    {currentOrder.user.fullName}
                  </span>
                </p>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />

                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all cursor-pointer"
                  onClick={verifyOTP}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default DeliveryBoy;

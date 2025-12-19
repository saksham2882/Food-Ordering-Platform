import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../../App";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState();
  const { socket } = useSelector((state) => state.user);
  const [liveLocation, setLiveLocation] = useState({});

  const handleGetOrder = async () => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      setCurrentOrder(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  useEffect(() => {
    socket.on(
      "updateDeliveryLocation",
      ({ deliveryBoyId, latitude, longitude }) => {
        setLiveLocation((prev) => ({
          ...prev,
          [deliveryBoyId]: { lat: latitude, lon: longitude },
        }));
      }
    );

    return () => {
      socket.off("updateDeliveryLocation");
    }
  }, [socket])

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div
        className="relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px]"
        onClick={() => navigate("/my-orders")}
      >
        <IoIosArrowRoundBack
          size={35}
          className="text-primary cursor-pointer"
        />

        <h1 className="text-2xl font-bold md:text-center">Track Order</h1>
      </div>

      {/* --------------- Delivery Order Info ------------- */}
      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div
          className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4"
          key={index}
        >
          <div>
            <p className="text-lg font-bold text-primary">
              {shopOrder.shop.name}
            </p>

            {/* -------------- Items -------------- */}
            <p className="">
              <span className="font-semibold">Items: </span>
              {shopOrder.shopOrderItems?.map((i) => i.name).join(", ")}
            </p>

            {/* --------------- subtotal ------------ */}
            <p>
              <span className="font-semibold">Subtotal: </span>₹
              {shopOrder.subtotal}
            </p>

            {/* --------------- Address -------------- */}
            <p className="mt-6">
              <span className="font-semibold">Delivery Address: </span>
              {currentOrder.deliveryAddress?.text}
            </p>
          </div>

          {/* ------------ Delivery Boy Information ---------------- */}
          {shopOrder.status != "Delivered" ? (
            <>
              {shopOrder.assignedDeliveryBoy ? (
                <div className="flex flex-col gap-1 text-sm bg-green-200 p-4 rounded-lg">
                  <h2 className="font-semibold">Delivery Boy Info: </h2>

                  {/* ----------- name ---------- */}
                  <p className="font-semibold ">
                    <span className="text-gray-700">Name: </span>
                    {shopOrder.assignedDeliveryBoy.fullName}
                  </p>

                  {/* ----------- mobile ----------- */}
                  <p className="font-semibold">
                    <span className="text-gray-700">Contact No.: </span>
                    {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p className="font-semibold text-orange-700 bg-red-100 p-4 rounded-lg">
                  Delivery Boy is not assigned yet.
                </p>
              )}
            </>
          ) : (
            // --------------- Order Delivered ----------------
            <p className="text-green-600 font-bold text-xl pt-2">
              Order Delivered ✅
            </p>
          )}

          {/* ---------------- Map -------------------- */}
          {shopOrder.assignedDeliveryBoy &&
            shopOrder.status !== "Delivered" && (
              <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                <DeliveryBoyTracking
                  data={{
                    deliveryBoyLocation: liveLocation[
                      shopOrder.assignedDeliveryBoy._id
                    ] || {
                      lat: shopOrder.assignedDeliveryBoy.location
                        .coordinates[1],
                      lon: shopOrder.assignedDeliveryBoy.location
                        .coordinates[0],
                    },
                    customerLocation: {
                      lat: currentOrder.deliveryAddress.latitude,
                      lon: currentOrder.deliveryAddress.longitude,
                    },
                  }}
                />
              </div>
            )}
        </div>
      ))}
    </div>
  );
};
export default TrackOrderPage;

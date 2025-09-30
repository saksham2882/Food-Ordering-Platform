import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import axios from "axios";
import { SERVER_URL } from "../App";
import { useEffect, useState } from "react";

const DeliveryBoy = () => {
  const { userData } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState(null);

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

  const acceptDeliveryAssignment = async (assignmentId) => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAssignments();
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
            {userData.location.coordinates[1]},{" "}
            <span className="font-bold">Longitude: </span>{" "}
            {userData.location.coordinates[0]}
          </p>
        </div>

        {/* ------------- Delivery Assignments -------------- */}
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
                      <span className="font-semibold">Delivery Address: </span>{" "}
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
      </div>
    </div>
  );
};
export default DeliveryBoy;

import axios from "axios";
import { MdPhone } from "react-icons/md";
import { SERVER_URL } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
import { toast } from "sonner";
import { useState } from "react";

const OwnerOrderCard = ({ data }) => {
  const dispatch = useDispatch();
  const [availableBoys, setAvailableBoys] = useState([]);

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(res.data.availableBoys);
      toast.success(`Order status updated to: ${status}`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* ---------- User personal info ------------ */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {data.user.fullName}
        </h2>
        <p className="text-sm text-gray-500">{data.user.email}</p>
        <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <MdPhone /> <span>{data.user.mobile}</span>
        </p>
      </div>

      {/* ------------- User address -------------- */}
      <div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
        <p>{data?.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-500">
          Lat: {data?.deliveryAddress.latitude}, Lon:{" "}
          {data?.deliveryAddress.longitude}
        </p>
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        {/* ----------Order Id --------- */}
        <p className="font-semibold">
          Order ID:{" "}
          <span className="text-gray-600">#{data._id?.slice(-9)}</span>
        </p>

        {/* ----------- Date ---------- */}
        <p className="text-sm text-gray-500">
          Date: {formatDate(data.createdAt)}
        </p>
      </div>

      {/* ------------ Order items------------- */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {data.shopOrders.shopOrderItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
          >
            <img
              src={item.item.image}
              alt={item.name}
              className="w-full h-24 object-cover rounded"
            />

            <p className="text-sm font-semibold mt-1">{item.name}</p>

            {/* -------------- quantity & price ------------ */}
            <p className="text-xs text-gray-500">
              Qty: {item.quantity} x ₹{item.price}.00
            </p>
          </div>
        ))}
      </div>

      {/* ------------ Status ---------- */}
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span className="text-sm">
          status:{" "}
          <span className="font-semibold capitalize text-primary ">
            {" "}
            {data.shopOrders.status}
          </span>
        </span>

        {/* ---------- Update status --------- */}
        <select
          className="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-primary text-primary"
          onChange={(e) =>
            handleUpdateStatus(
              data._id,
              data.shopOrders.shop._id,
              e.target.value
            )
          }
        >
          <option value="">Change</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Out for Delivery">Out for Delivery</option>
        </select>
      </div>

      {/* ----------- Available delivery Boys ------------ */}
      {data.shopOrders.status == "Out for Delivery" && (
        <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50 gap-4">
          {data.shopOrders.assignedDeliveryBoy ? (
            <p>Assigned Delivery Boys:</p>
          ) : (
            <p>Available Delivery Boys:</p>
          )}

          {availableBoys?.length > 0 ? (
            availableBoys.map((b, index) => (
              <li className="text-gray-600 ml-6 mt-1">
                {b.fullName} - {b.mobile}
              </li>
            ))
          ) : data.shopOrders.assignedDeliveryBoy ? (
            <div>
              {data.shopOrders.assignedDeliveryBoy.fullName} -{" "}
              {data.shopOrders.assignedDeliveryBoy.mobile}
            </div>
          ) : (
            <div>Waiting for delivery boys</div>
          )}
        </div>
      )}

      {/* ----------- Total ------------- */}
      <div className="text-right font-bold text-gray-800 text-sm">
        Total: ₹{data.shopOrders.subtotal}.00
      </div>
    </div>
  );
};

export default OwnerOrderCard;

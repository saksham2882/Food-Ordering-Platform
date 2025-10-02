import { useNavigate } from "react-router-dom";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* ----------- Order Info ---------- */}
      <div className="flex justify-between border-b border-gray-300 pb-2">
        <div>
          {/* ----------Order Id --------- */}
          <p className="font-semibold">Order ID: #{data._id?.slice(-9)}</p>

          {/* ----------- Date ---------- */}
          <p className="text-sm text-gray-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right">
          {/* ----------- Payment method ----------- */}
          <p className="text-sm text-gray-500">
            {data.paymentMethod?.toUpperCase()}
          </p>

          {/* --------- Status ---------- */}
          <p className="font-medium text-blue-600">
            {data.shopOrders?.[0].status}
          </p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-700 font-semibold">
        {data.paymentMethod == "Online" ? (
          <>
            <p>
              Payment Method:{" "}
              <span className="text-red-600">{data.paymentMethod}</span>
            </p>
            <p>
              Payment Status:{" "}
              <span className="text-red-600">
                {data.payment ? "Paid" : "Not Paid"}
              </span>
            </p>
          </>
        ) : (
          <p>
            Payment Method:{" "}
            <span className="text-red-600">{data.paymentMethod}</span>
          </p>
        )}
      </div>

      {/* ----------- Shop Order items ------------ */}
      {data.shopOrders?.map((shopOrder, index) => (
        <div className="border rounded-lg p-3 bg-bg space-y-3" key={index}>
          <p>{shopOrder.shop.name}</p>

          {/* --------- items --------- */}
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder.shopOrderItems.map((item, index) => (
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

          {/* ------------ Subtotal & status ------------- */}
          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold">Subtotal: ₹{shopOrder.subtotal}.00</p>
            <span className="text-sm font-medium text-blue-600">
              status: {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      {/* -------------- Total Amount --------------- */}
      <div className="flex justify-between items-center border-t border-gray-400 pt-2">
        <p>Total: ₹{data.totalAmount}</p>

        {/* -------------- Track order ------------ */}
        <button
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
          onClick={() => navigate(`/track-order/${data._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
};
export default UserOrderCard;

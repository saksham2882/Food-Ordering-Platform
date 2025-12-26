import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FaCheck, FaArrowRight, FaStore } from "react-icons/fa6";
import { IoReceiptOutline, IoHomeOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import orderApi from "../../api/orderApi";
import { setMyOrders } from "../../redux/userSlice";

const OrderPlaced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { myOrders } = useSelector((state) => state.user);
  const [fetchedOrder, setFetchedOrder] = useState(null);

  // Get Order from Navigation State OR Redux Store OR API Fallback
  const order = location.state?.order || (myOrders?.length > 0 ? myOrders[0] : null) || fetchedOrder;

  // Fetch latest order if missing
  useEffect(() => {
    if (!order) {
      const fetchOrders = async () => {
        try {
          const data = await orderApi.getMyOrders();
          if (data && data.length > 0) {
            dispatch(setMyOrders(data));
            setFetchedOrder(data[0]);
          }
        } catch (error) {
          console.error("Failed to fetch orders", error);
        }
      };
      fetchOrders();
    }
  }, [order, dispatch]);

  const orderIdRaw = order?._id || "#123456";
  const displayOrderId = orderIdRaw.length > 9 ? `#${orderIdRaw.slice(-9)}` : orderIdRaw;
  const estimatedTime = "30-45 mins";


  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* --------- Background --------- */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 rounded-full blur-[100px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      {/* --------- Main Container --------- */}
      <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 fade-in duration-700 mt-20 mb-20">

        {/* --------- Animation --------- */}
        <div className="flex justify-center mb-8 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75 duration-1000" />
            <div className="relative bg-green-500 text-white p-6 rounded-full shadow-lg shadow-green-500/30">
              <FaCheck className="size-8 md:size-10" />
            </div>
            <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce delay-100">✦</div>
            <div className="absolute -bottom-1 -left-4 text-primary animate-bounce delay-300">★</div>
            <div className="absolute top-4 -right-8 text-blue-400 animate-pulse">●</div>
          </div>
        </div>

        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Order Placed!</h1>
          <p className="text-gray-500 font-medium text-lg">Your food is being prepared with love.</p>
        </div>

        {/* --------- Card --------- */}
        <div className="relative drop-shadow-2xl">
          <Card className="border-none bg-white overflow-hidden relative z-10 mx-4 md:mx-0 rounded-[2rem]">
            <div className="bg-gray-900 p-6 text-white text-center pb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />

              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Order ID</p>
              <p className="text-3xl font-mono font-bold tracking-widest">{displayOrderId}</p>

              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                <FaStore className="text-orange-400 size-3" />
                <span className="text-xs font-semibold">Sent to Shop</span>
              </div>
            </div>

            {/* --------- Dashed Line / Punch Hole Effect --------- */}
            <div className="relative h-4 bg-gray-900">
              <div className="absolute -bottom-3 left-0 w-full h-6 bg-white rounded-t-[1.5rem]" />
              <div className="absolute top-[calc(50%-1px)] left-4 right-4 border-t-2 border-dashed border-gray-600/50" />
              <div className="absolute -left-3 top-[-6px] w-6 h-6 bg-gray-50 rounded-full" />
              <div className="absolute -right-3 top-[-6px] w-6 h-6 bg-gray-50 rounded-full" />
            </div>

            <CardContent className="pt-8 pb-8 px-8 text-center space-y-6">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Estimated Delivery</p>
                <p className="text-2xl font-black text-gray-900">{estimatedTime}</p>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-sm text-blue-800 flex items-start gap-3 text-left">
                <IoReceiptOutline className="size-5 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  You will receive a confirmation listing the details of your order shortly.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---------- Buttons ---------- */}
        <div className="mt-10 space-y-3 px-8 md:px-0">
          <Button
            onClick={() => navigate("/my-orders")}
            className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 bg-primary hover:bg-orange-600 active:scale-[0.98] transition-all group"
          >
            Track Order <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="w-full h-12 text-gray-500 font-semibold hover:bg-white hover:text-gray-900 rounded-xl"
          >
            <IoHomeOutline className="mr-2 size-5" /> Continue Shopping
          </Button>
        </div>

      </div>
    </div>
  );
};

export default OrderPlaced;

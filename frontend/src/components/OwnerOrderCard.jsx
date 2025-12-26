import orderApi from "../api/orderApi";
import { MdPhone, MdLocationOn, MdAccessTime, MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser, FaCircle, FaUtensils } from "react-icons/fa6";
import { cn } from "@/lib/utils";


const OwnerOrderCard = ({ data }) => {
  const dispatch = useDispatch();
  const [availableBoys, setAvailableBoys] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (value) => {
    const orderId = data._id;
    const shopId = data.shopOrders.shop?._id || data.shopOrders.shop;
    const status = value;

    setLoading(true);
    try {
      const res = await orderApi.updateOrderStatus(orderId, shopId, status);
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(res.availableBoys || []);
      toast.success(`Order status updated to: ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString, locale = navigator.language || "en-GB") => {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const statusConfig = {
    Pending: { color: "bg-orange-100 text-orange-700", dot: "text-orange-500" },
    Preparing: { color: "bg-blue-100 text-blue-700", dot: "text-blue-500" },
    "Out for Delivery": {
      color: "bg-purple-100 text-purple-700",
      dot: "text-purple-500",
    },
    Delivered: { color: "bg-green-100 text-green-700", dot: "text-green-500" },
    Cancelled: { color: "bg-red-100 text-red-700", dot: "text-red-500" },
  };

  const currentStatus = data.shopOrders.status || "Pending";
  const statusStyle = statusConfig[currentStatus] || statusConfig["Pending"];

  return (
    <Card className="border-none shadow-xl shadow-slate-400/60 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
      {/* ------------ Header ------------ */}
      <CardHeader className="bg-white border-b border-gray-100 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          {/* --------- User Info --------- */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-sm transition-transform group-hover:scale-105">
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-black text-lg">
                {data?.user?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {data?.user?.fullName || "Unknown Guest"}
              </h2>
              <p className="text-xs text-slate-400 font-bold tracking-wider mt-0.5">
                #{data._id?.slice(-9).toUpperCase()}
              </p>
            </div>
          </div>

          {/* --------- Status Dropdown --------- */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-2 transition-colors",
                statusStyle.color
              )}
            >
              <FaCircle className={cn("text-[8px]", statusStyle.dot)} />
              {currentStatus}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full border-gray-200 hover:bg-gray-100 bg-white shadow-sm"
                  disabled={loading}
                >
                  <MdKeyboardArrowDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>

              {/* --------- Status Dropdown Menu --------- */}
              <DropdownMenuContent align="end" className="w-48 font-medium">
                {Object.keys(statusConfig).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    className="cursor-pointer font-medium focus:bg-slate-50 focus:text-primary"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* ------------ Content ------------ */}
      <CardContent className="p-0">
        <div className="p-5 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ---------- Left Column: Details ---------- */}
          <div className="space-y-6">

            {/* ----------- Customer Info ----------- */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <FaUser className="text-gray-500" /> Contact Details
              </h3>
              <div className="bg-slate-100/90 p-4 rounded-xl space-y-2 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <MdPhone />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {data?.user?.mobile || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <div className="text-[10px] font-black">@</div>
                  </div>
                  <span className="text-sm font-medium text-slate-600 truncate">
                    {data?.user?.email || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* ----------- Address ----------- */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <MdLocationOn className="text-gray-500 text-sm" /> Delivery
                Location
              </h3>
              <div className="bg-slate-100/90 p-4 rounded-xl border border-slate-100 flex gap-3 items-start">
                <MdLocationOn className="text-red-500 text-xl mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed max-w-xs">
                    {data?.deliveryAddress?.text || "No address provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Right Column: Order Items ---------- */}
          <div className="flex flex-col h-full bg-slate-100/70 rounded-2xl p-5 border border-slate-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaUtensils className="text-gray-500 text-xs" /> Order Summary
            </h3>

            {/* --------- Order Items --------- */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
              {data.shopOrders.shopOrderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100/90 hover:border-primary/30 hover:shadow-md hover:shadow-primary/20 transition-colors"
                >
                  <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.item.image}
                      alt={item.item.name || 'Food item'}  
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-slate-800 text-sm truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-gray-400">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-md font-bold text-slate-900 mr-2">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4 bg-gray-200" />

            {/* --------- Total Bill Amount --------- */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">
                  Total Bill Amount
                </p>
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{data.shopOrders.subtotal}
                  </h4>
                  <Badge
                    variant={data.payment ? "default" : "destructive"}
                    className="text-[9px] h-6 px-3 uppercase tracking-wide"
                  >
                    {data.payment ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </div>

              {/* --------- Placed On --------- */}
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-end gap-1">
                  <MdAccessTime /> Placed On
                </p>
                <p className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                  {formatDate(data.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* -------------- Delivery Boy Assignment Section -------------- */}
        {currentStatus === "Out for Delivery" && (
          <div className="bg-slate-900 p-5 mt-0">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              {/* --------- Delivery Partner Status --------- */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <MdLocationOn className="text-lg animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">
                    Delivery Partner Status
                  </p>
                  <p className="text-slate-400 text-xs text-opacity-80">
                    {data.shopOrders.assignedDeliveryBoy
                      ? "Partner assigned and on the way"
                      : "Looking for nearby partners..."}
                  </p>
                </div>
              </div>

              {/* --------- Assigned Delivery Boy Details --------- */}
              {data.shopOrders.assignedDeliveryBoy ? (
                <div className="bg-white/10 rounded-xl p-2 px-4 flex items-center gap-3 border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-green-500/20">
                    {data.shopOrders.assignedDeliveryBoy?.fullName?.charAt(0) || "N/A"}
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-white text-sm font-bold">
                      {data.shopOrders.assignedDeliveryBoy?.fullName || "N/A"}
                    </p>
                    <p className="text-xs text-slate-300 font-mono">
                      {data.shopOrders.assignedDeliveryBoy?.mobile || "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                // --------- Available Delivery Boys ---------
                <div className="flex gap-2 overflow-x-auto max-w-md pb-2 custom-scrollbar">
                  {availableBoys.length > 0 ? (
                    availableBoys.map((boy, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer shrink-0"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                          {boy.fullName?.charAt(0) || "N/A"}
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">
                            {boy.fullName || "N/A"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {boy.mobile || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs italic">
                      Searching for available delivery boys...
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerOrderCard;

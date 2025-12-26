import { useNavigate, useParams } from "react-router-dom";
import orderApi from "../../api/orderApi";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaPhone, FaCheckCircle, FaMotorcycle, FaBox } from "react-icons/fa";
import DeliveryBoyTracking from "../../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Terminal } from "lucide-react";
import { toast } from "sonner";


const TrackOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState();
  const { socket } = useSelector((state) => state.user);
  const [liveLocation, setLiveLocation] = useState({});

  const handleGetOrder = async () => {
    try {
      const data = await orderApi.getOrderById(orderId);
      setCurrentOrder(data);
    } catch (error) {
      toast.error("Failed to get order");
      // console.log(error);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  useEffect(() => {
    if (!socket) return;
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
    };
  }, [socket]);

  const getProgress = (status) => {
    switch (status) {
      case "Placed": return 25;
      case "Confirmed": return 50;
      case "Preparing": return 75;
      case "Out for Delivery": return 90;
      case "Delivered": return 100;
      default: return 10;
    }
  };

  const getStatusStep = (status) => {
    const steps = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered",];
    return steps.indexOf(status);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* ----------- Header ----------- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-orders")}
            className="rounded-full hover:bg-slate-100"
          >
            <FaArrowLeft className="text-slate-600" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800">Track Order</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* --------------- Delivery Order Info --------------- */}
        {currentOrder?.shopOrders?.map((shopOrder, index) => {
          const progress = getProgress(shopOrder.status);

          return (
            <div key={index} className="space-y-6">
              {/* ---------- Order Status Card ---------- */}
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-red-400 via-gray-200 to-red-400 " />

                {/* ---------- Header ---------- */}
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">
                        {shopOrder.shop.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        Order #{shopOrder._id.slice(-9).toUpperCase()} •{" "}
                        {shopOrder.shopOrderItems?.length} Items
                      </CardDescription>
                    </div>
                    <Badge
                      className={`text-sm py-1 px-3 ${shopOrder.status === "Delivered"
                        ? "bg-green-500"
                        : "bg-orange-500"
                        }`}
                    >
                      {shopOrder.status}
                    </Badge>
                  </div>
                </CardHeader>

                {/* ---------- Order Details ---------- */}
                <CardContent className="space-y-8">
                  {/* ---------- Visual Timeline ---------- */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                      <span>Preparing</span>
                      <span>On the Way</span>
                      <span>Delivered</span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2.5 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-orange-300 [&>div]:to-red-600"
                    />
                  </div>

                  {/* ---------- Item List ---------- */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <FaBox className="text-orange-500" /> Order Summary
                    </h3>
                    <div className="space-y-2">

                      {/* --------- Order Items --------- */}
                      {shopOrder.shopOrderItems?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-600 font-medium">
                            <span className="text-slate-400 mr-2">
                              x{item.quantity || 1}
                            </span>{" "}
                            {item.name}
                          </span>
                          <span className="font-bold text-slate-800">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}

                      <Separator className="my-2" />
                      <div className="flex justify-between text-base font-black text-slate-900">
                        <span>Total</span>
                        <span>₹{shopOrder.subtotal}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ---------- Delivery Partner Card ---------- */}
              {shopOrder.assignedDeliveryBoy ? (
                <Card className="border-none shadow-md bg-white">
                  <CardContent className="p-6">

                    {/* --------- Delivery Partner Information --------- */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-4 border-slate-50 shadow-sm">
                        <AvatarImage
                          src={shopOrder.assignedDeliveryBoy.profileImage}
                        />
                        <AvatarFallback className="bg-slate-900 text-white font-bold text-xl">
                          {shopOrder.assignedDeliveryBoy.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">
                          {shopOrder.assignedDeliveryBoy.fullName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <FaMotorcycle className="text-slate-400" />
                          <span>Yamaha R15 • UP16 AR 8721</span>
                        </div>
                        {/* ---------- Rating ---------- */}
                        <div className="flex items-center gap-1 text-xs font-bold text-orange-500 mt-1">
                          ★ 4.5 Rating
                        </div>
                      </div>

                      {/* ---------- Phone Number ---------- */}
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200 text-white"
                        onClick={() =>
                          window.open(
                            `tel:${shopOrder.assignedDeliveryBoy.mobile}`
                          )
                        }
                      >
                        <FaPhone />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                shopOrder.status !== "Delivered" && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3 items-start">
                    <Terminal className="h-4 w-4 text-orange-600 mt-1 shrink-0" />
                    <div className="space-y-1">
                      <h5 className="text-orange-900 font-bold text-sm leading-none tracking-tight">
                        Assigning Delivery Partner
                      </h5>
                      <div className="text-sm text-orange-700 leading-relaxed">
                        We are currently looking for a nearby delivery partner for your order.
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* ----------- Live Tracking Map ----------- */}
              {shopOrder.assignedDeliveryBoy &&
                shopOrder.status !== "Delivered" && (
                  <Card className="border-none shadow-xl overflow-hidden rounded-2xl">

                    <CardHeader className="bg-slate-50 pb-4 border-b border-slate-100">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live Tracking
                      </CardTitle>
                    </CardHeader>

                    <div className="h-[450px] w-full relative p-2">
                      <DeliveryBoyTracking
                        data={{
                          deliveryBoyLocation: liveLocation[
                            shopOrder.assignedDeliveryBoy._id
                          ] || {
                            lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                            lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
                          },
                          customerLocation: {
                            lat: currentOrder.deliveryAddress.latitude,
                            lon: currentOrder.deliveryAddress.longitude,
                          },
                        }}
                      />
                      <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  </Card>
                )}

              {/* ----------- Order Delivered ----------- */}
              {shopOrder.status === "Delivered" && (
                <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-100 mb-8">
                  <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-3" />
                  <h2 className="text-2xl font-black text-green-700">
                    Order Delivered!
                  </h2>
                  <p className="text-green-600">Enjoy your meal.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackOrderPage;
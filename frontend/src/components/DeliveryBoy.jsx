import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import orderApi from "../api/orderApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MapPin, Navigation, Phone, Package, TrendingUp, Clock, CheckCircle2, AlertCircle, Banknote, Bike, User, ChevronRight } from "lucide-react";
import { Spinner } from "./ui/spinner";


const chartConfig = {
  orders: {
    label: "Orders",
    color: "#F97316",
  },
};

// View Components
const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="border-none shadow-sm hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm">
    <CardContent className="p-6 flex items-center gap-4">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>
    </CardContent>
  </Card>
);


const DeliveryBoy = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const ratePerDelivery = 40;
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0);
  const totalDeliveriesCount = todayDeliveries.reduce((sum, d) => sum + d.count, 0);

  const getAssignments = async () => {
    try {
      const data = await orderApi.getAssignments();
      setAvailableAssignments(data ? [...data].reverse() : []);
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const data = await orderApi.getCurrentOrder();
      if (data?._id) {
        setCurrentOrder(data);
        setActiveTab("active");
      } else {
        setCurrentOrder(null);
        if (activeTab === "active") setActiveTab("dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const acceptDeliveryAssignment = async (assignmentId) => {
    try {
      const data = await orderApi.acceptOrder(assignmentId);
      toast.success(data.message || "Delivery Assignment Accepted");
      await getCurrentOrder();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      const data = await orderApi.sendDeliveryOtp({
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
      });
      toast.success(data.message || "OTP Sent Successfully");
      setShowOtpBox(true);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      const data = await orderApi.verifyDeliveryOtp({
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
        otp,
      });
      toast.success(data.message || "Order Delivered Successfully");
      setCurrentOrder(null);
      setShowOtpBox(false);
      setOtp("");
      setActiveTab("dashboard");
      await getAssignments();
      await handleTodayDeliveries();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Invalid OTP");
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const data = await orderApi.getTodayDeliveries();
      setTodayDeliveries(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Socket & Location
  useEffect(() => {
    socket?.on("newAssignment", (data) => {
      if (data.sentTo === userData._id) {
        // Prepend new assignment to show it first
        setAvailableAssignments((prev) => [data, ...prev]);
        toast.info("New order available nearby!");
      }
    });
    return () => socket?.off("newAssignment");
  }, [socket, userData]);

  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return;
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDeliveryBoyLocation({ lat: latitude, lon: longitude });
          socket.emit("updateLocation", {
            latitude,
            longitude,
            deliveryBoyId: userData._id,
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Navbar />

      <main className="container max-w-7xl mx-auto px-4 pt-24 space-y-8">
        {/* ---------- Header Section ---------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online
              </span>
              Welcome back, {userData?.fullName}
            </p>
          </div>
          {/* ------ Location ------ */}
          {deliveryBoyLocation && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white px-4 py-2 rounded-full border shadow-sm">
              <Navigation className="w-4 h-4 text-orange-500" />
              <span>
                Lat: {deliveryBoyLocation.lat.toFixed(4)} • Lon:{" "}
                {deliveryBoyLocation.lon.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        {/* ---------- Stats ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Today's Earnings"
            value={`₹${totalEarning}`}
            icon={Banknote}
            colorClass="text-emerald-600 bg-emerald-100"
          />
          <StatsCard
            title="Completed Deliveries"
            value={totalDeliveriesCount}
            icon={CheckCircle2}
            colorClass="text-blue-600 bg-blue-100"
          />
          <StatsCard
            title="Active Hours"
            value="4h 30m"
            icon={Clock}
            colorClass="text-orange-600 bg-orange-100"
          />
        </div>

        {/* --------- Main Content --------- */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          {/* --------- Tabs --------- */}
          <TabsList className="bg-white border p-1 rounded-xl h-auto inline-flex relative">
            <TabsTrigger
              value="dashboard"
              className="px-6 py-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
            >
              Requests & Stats
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="px-6 py-2 rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
              disabled={!currentOrder}
            >
              Active Delivery
              {currentOrder && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* --------- 1. Dashboard Tab --------- */}
          <TabsContent value="dashboard" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">

            {/* --------- 1.1 Requests Carousel --------- */}
            <div className="space-y-4">

              {/* ------ Header ------- */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  New Requests
                  <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-bold hover:bg-slate-300">
                    {availableAssignments?.length || 0}
                  </Badge>
                </h3>
              </div>

              {/* ------ Delivery Requests Carousel ------- */}
              <div className="w-full flex justify-center bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60 min-h-[220px]">
                {availableAssignments?.length > 0 ? (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full max-w-5xl"
                  >
                    <CarouselContent className="-ml-4 p-4">
                      {availableAssignments.map((a, i) => (
                        <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">

                          {/* ------ Delivery Request Card ------ */}
                          <Card className="border-none shadow-md overflow-hidden group bg-white hover:shadow-2xl transition-all duration-300 h-full">
                            <div className="h-1.5 w-full bg-slate-900 group-hover:bg-orange-500 transition-colors" />
                            <CardContent className="p-5 space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-lg text-slate-900 line-clamp-1">{a.shopName}</h4>
                                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                    <Package className="w-3 h-3" /> {a.items.length} items • ₹{a.subtotal}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 shadow-sm shrink-0">
                                  +₹{ratePerDelivery}
                                </Badge>
                              </div>

                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-3 items-start min-h-[60px]">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                                  {a.deliveryAddress.text}
                                </p>
                              </div>
                              {/* ------- Accept Delivery Button ------- */}
                              <Button
                                className="w-full bg-slate-900 group-hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 text-white font-semibold transition-all mt-auto"
                                onClick={() => acceptDeliveryAssignment(a.assignmentId)}
                              >
                                Accept Delivery
                              </Button>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4 lg:-left-12 h-10 w-10 border-slate-200" />
                    <CarouselNext className="-right-4 lg:-right-12 h-10 w-10 border-slate-200" />
                  </Carousel>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center max-w-sm animate-in fade-in zoom-in-50">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
                      <Bike className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-600">No new orders available</p>
                    <p className="text-xs text-slate-400 mt-1">Stay online! New requests will appear here automatically.</p>
                  </div>
                )}
              </div>
            </div>

            {/* --------- 1.2. Delivery Velocity Chart --------- */}
            <Card className="border-none shadow-md bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Delivery Velocity
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 font-medium">Hourly breakdown of your deliveries today</CardDescription>
              </CardHeader>

              {/* --------- Delivery Chart --------- */}
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart accessibilityLayer data={todayDeliveries} margin={{ top: 20 }}>
                    <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="hour"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => `${value}:00`}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="count" fill="var(--color-orders)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --------- 2. Active Delivery Tab --------- */}
          <TabsContent value="active" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500 h-[calc(100vh-280px)] min-h-[600px] overflow-hidden">
            {currentOrder ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full p-1 md:p-0 md:pb-6">

                {/* ------------ 2.1 Left Panel: Order Details & Actions ------------ */}
                <div className="lg:col-span-5 col-span-1 space-y-4 flex flex-col h-full overflow-hidden p-1.5 md:p-4 rounded-2xl">
                  <Card className="border-none shadow-xl hover:shadow-2xl bg-white active-order-card ring-1 ring-slate-300 flex flex-col h-full overflow-hidden">

                    {/* ----------- Order Header ----------- */}
                    <div className="bg-slate-900 p-4 md:p-6 text-white relative overflow-hidden shrink-0">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Bike className="w-32 h-32 text-white" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <Badge className="bg-orange-500 text-white hover:bg-orange-600 border-none px-3 py-1 shadow-lg shadow-orange-900/20">In Progress</Badge>
                          <span className="font-mono text-xs opacity-60 bg-white/10 px-2 py-1 rounded">ID: #{currentOrder._id.slice(-9).toUpperCase()}</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight truncate pr-4">Partner Shop</h2>
                        <p className="text-slate-300 text-sm mt-2 flex items-center gap-2 font-medium">
                          <Package className="w-4 h-4" />
                          {currentOrder.shopOrder.shopOrderItems.length} items to deliver
                        </p>
                      </div>
                    </div>

                    {/* ----------- Order Body ----------- */}
                    <CardContent className="p-0 flex-1 overflow-y-auto relative scrollbar-hide">
                      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                        {/* ---------- Journey ---------- */}
                        <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 my-2 ml-2">

                          {/* ------- Pickup Node ------- */}
                          <div className="relative">
                            <span className="absolute -left-[31px] top-1 bg-white border-4 border-slate-200 w-4 h-4 rounded-full ring-4 ring-white"></span>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pickup From Partner Shop</p>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="link" className="h-auto p-0 text-orange-600 text-xs font-semibold hover:no-underline flex items-center gap-1 group">
                                    View Item Details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                  </Button>
                                </DialogTrigger>

                                {/* -------- Items Details Dialog -------- */}
                                <DialogContent className="w-[90%] max-w-lg rounded-xl">
                                  <DialogHeader>
                                    <DialogTitle>Order Items</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 mt-4">
                                    {currentOrder.shopOrder.shopOrderItems.map((item, idx) => (
                                      <div key={idx} className="flex justify-between text-sm border-b border-dashed pb-3 last:border-0">
                                        <span className="font-medium text-slate-700">
                                          <span className="font-bold mr-2 text-slate-900">{item.quantity}x</span>
                                          {item.name || "Item"}
                                        </span>
                                        <span className="font-bold text-slate-900"> ₹{item.price}</span>
                                      </div>
                                    ))}
                                    <div className="flex justify-between font-bold pt-4 text-lg border-t text-slate-900">
                                      <span>Total Amount</span>
                                      <span>₹{currentOrder.shopOrder.subtotal}</span>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          {/* ---------- Customer Info Node ---------- */}
                          <div className="relative">
                            <span className="absolute -left-[31px] top-1 bg-orange-500 border-4 border-orange-100 w-4 h-4 rounded-full shadow-md ring-4 ring-white"></span>
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Deliver To</p>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border text-slate-500">
                                  <User className="w-4 h-4" />
                                </div>
                                <p className="font-bold text-slate-800 text-lg">{currentOrder.user.fullName}</p>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100 flex gap-3">
                                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                {currentOrder.deliveryAddress.text}
                              </p>
                            </div>

                            {/* ---------- Customer Contact Button ---------- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                              <Button
                                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm font-semibold h-12 w-full cursor-pointer"
                                onClick={() => window.open(`tel:${currentOrder.user.mobile}`)}
                              >
                                <Phone className="w-4 h-4 mr-2" /> Call Customer
                              </Button>
                              <Button
                                className="bg-slate-900 hover:bg-slate-700 text-white shadow-lg shadow-slate-200 font-semibold h-12 w-full cursor-pointer"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${currentOrder.deliveryAddress.latitude},${currentOrder.deliveryAddress.longitude}`, "_blank")}
                              >
                                <Navigation className="w-4 h-4 mr-2" /> Navigate
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <Separator />

                    {/* ---------- Bootom Button ---------- */}
                    <CardFooter className="p-4 md:p-6 bg-slate-50/80 shrink-0">
                      {!showOtpBox ? (

                        // ---------- Sent OTP Button ----------
                        <div className="w-full">
                          <Button
                            className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200 text-white transition-all active:scale-[0.98]"
                            onClick={sendOTP}
                            disabled={loading}
                          >
                            {loading ? <Spinner className="mr-2 h-4 w-4 animate-spin" />  : "I've Arrived & Sent OTP"}
                          </Button>
                          <p className="text-center text-xs text-slate-400 mt-3">Click only when you are at the customer's location</p>
                        </div>
                      ) : (
                        // ---------- OTP Box ----------
                        <div className="w-full space-y-5 animate-in zoom-in-95 duration-300">
                          <div className="text-center space-y-1">
                            <Badge variant="outline" className="mb-2 bg-green-50 text-green-700 border-green-200">OTP Sent</Badge>
                            <h4 className="font-bold text-xl text-slate-900">Enter Verification PIN</h4>
                            <p className="text-sm text-slate-500">Ask the customer for the 6-digit code</p>
                          </div>
                          <div className="flex justify-center py-2">
                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} className="bg-white border-slate-200 h-10 w-10 md:h-12 md:w-10 text-lg" />
                                <InputOTPSlot index={1} className="bg-white border-slate-200 h-10 w-10 md:h-12 md:w-10 text-lg" />
                                <InputOTPSlot index={2} className="bg-white border-slate-200 h-10 w-10 md:h-12 md:w-10 text-lg" />
                              </InputOTPGroup>
                              <div className="w-4 flex items-center justify-center text-slate-300">-</div>
                              <InputOTPGroup>
                                <InputOTPSlot index={3} className="bg-white border-slate-200 h-10 w-10 md:h-12 md:w-10 text-lg" />
                                <InputOTPSlot index={4} className="bg-white border-slate-200 h-10 w-10 md:h-12 md:w-10 text-lg" />
                                <InputOTPSlot index={5} className="bg-white border-slate-200 h-10 w-10 md:h-12 md:w-10 text-lg" />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>

                          {/* ---------- Verify OTP Button ---------- */}
                          <Button
                            className="w-full h-12 text-lg font-bold bg-slate-900 hover:bg-orange-600 hover:shadow-orange-200 transition-all text-white"
                            onClick={verifyOTP}
                          >
                            Verify & Complete Delivery
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </div>

                {/* ------------ 2.2 Right Panel: Map ------------ */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center h-full p-2 lg:p-1">
                  <div className="w-full h-auto border-2 border-slate-300 shadow-xl hover:shadow-2xl rounded-2xl p-2">
                    <DeliveryBoyTracking
                      data={{
                        deliveryBoyLocation: deliveryBoyLocation || { lat: 28.61, lon: 77.23 },
                        customerLocation: {
                          lat: currentOrder.deliveryAddress.latitude,
                          lon: currentOrder.deliveryAddress.longitude,
                        },
                      }}
                    />
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-slate-200 rounded-3xl m-4">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <AlertCircle className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700 text-xl">No Active Order</h3>
                <p className="text-slate-500 text-sm mt-2">Accept a request from the dashboard to start.</p>
                <Button variant="link" className="text-orange-600 mt-4 font-semibold" onClick={() => setActiveTab("dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DeliveryBoy;

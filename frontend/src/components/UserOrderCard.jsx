import { useState } from "react";
import { useNavigate } from "react-router-dom";
import shopApi from "../api/shopApi";
import { toast } from "sonner";
import { FaStore, FaStar, FaCircleCheck, FaReceipt, FaArrowRotateRight, FaHeadset, FaLocationDot } from "react-icons/fa6";
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();
  
  const [selectedRating, setSelectedRating] = useState(() => {
    const initial = {};
    data.shopOrders?.forEach((so) => {
      so.shopOrderItems?.forEach((item) => {
        if (item.userRating) {
          initial[item.item._id] = item.userRating;
        }
      });
    });
    return initial;
  });

  const formatDate = (dateString, type = "full") => {
    const date = new Date(dateString);
    if (type === "time")
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (type === "date")
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-emerald-500",
          text: "text-emerald-700",
          border: "border-emerald-200",
          light: "bg-emerald-50",
        };
      case "Cancelled":
        return {
          bg: "bg-rose-500",
          text: "text-rose-700",
          border: "border-rose-200",
          light: "bg-rose-50",
        };
      case "Preparing":
        return {
          bg: "bg-blue-500",
          text: "text-blue-700",
          border: "border-blue-200",
          light: "bg-blue-50",
        };
      case "Out for Delivery":
        return {
          bg: "bg-amber-500",
          text: "text-amber-700",
          border: "border-amber-200",
          light: "bg-amber-50",
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-gray-700",
          border: "border-gray-200",
          light: "bg-gray-50",
        };
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "Pending":
        return 10;
      case "Preparing":
        return 45;
      case "Out for Delivery":
        return 75;
      case "Delivered":
        return 100;
      case "Cancelled":
        return 100;
      default:
        return 0;
    }
  };

  const mainStatus = data.shopOrders?.[0]?.status || "Pending";
  const statusStyle = getStatusStyle(mainStatus);
  const progressValue = getProgress(mainStatus);

  const handleRating = async (itemId, rating) => {
    try {
      await shopApi.addRating(itemId, rating);
      setSelectedRating((prev) => ({ ...prev, [itemId]: rating }));
      toast.success("Thank you for rating!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit rating");
    }
  };

  // --------- Shop Order Data ---------
  const shopOrders = data.shopOrders || [];
  const shopNames = shopOrders.map((so) => so.shop?.name).filter(Boolean);

  let shopDisplay = "Unknown Shop";
  if (shopNames.length === 1) shopDisplay = shopNames[0];
  else if (shopNames.length === 2)
    shopDisplay = `${shopNames[0]} & ${shopNames[1]}`;
  else if (shopNames.length > 2)
    shopDisplay = `${shopNames[0]} + ${shopNames.length - 1} others`;

  const allItems = shopOrders.flatMap((so) => so.shopOrderItems);
  const displayId = data._id ? `#${data._id.slice(-9).toUpperCase()}` : "#123456789";


  // -------- Price Logic --------
  const itemTotal = allItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(itemTotal * 0.05);
  const deliveryFee = 40;
  const totalPrice = data.totalAmount;
  const originalPrice = Math.ceil(allItems.reduce((acc, item) => acc + item.price * item.quantity * 1.40, 0)) + deliveryFee + tax;  // 40% discount
  const discount = originalPrice - totalPrice;

  return (
    <Card className="group relative w-full border-0 overflow-hidden rounded-[24px] bg-white shadow-xl shadow-gray-200/40 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:shadow-slate-800/30 hover:ring-1 hover:ring-gray-900/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-40" />

      <div className="flex flex-col lg:flex-row h-full relative z-10">

        {/* -------------- 1. Left Side: Status Timeline - Desktop -------------- */}
        <div className="md:w-[60px] lg:w-[70px] hidden lg:flex flex-row border-r border-gray-200 bg-gray-50/50">
          <div className="w-1/2 h-full flex justify-center py-6 ml-2">
            <div className="h-full w-1.5 rounded-full bg-gray-200 relative overflow-hidden">
              <div
                className={`absolute bottom-0 w-full transition-all duration-500 ease-out rounded-full ${statusStyle.bg}`}
                style={{ height: `${progressValue}%` }}
              />
            </div>
          </div>

          <div className="w-1/2 h-full flex items-center justify-center -ml-3">
            <div className="text-[10px] font-bold -rotate-90 whitespace-nowrap text-gray-400 tracking-widest uppercase">
              {mainStatus}
            </div>
          </div>
        </div>

        {/* -------------- 2. Middle: Order Info & Items -------------- */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          {/* ---------- Header ---------- */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">

              {/* ---------- Shop Name & Order ID ---------- */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2.5 md:mb-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                  {shopDisplay}
                </h3>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold px-1.5 py-0.5 border-gray-200 bg-gray-100 text-gray-500 whitespace-nowrap"
                >
                  {displayId}
                </Badge>
              </div>

              {/* ---------- Order Date & Store Count ---------- */}
              <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 flex-wrap">
                <IoCalendarOutline className="text-gray-400" />{" "}
                {formatDate(data.createdAt)}
                <span className="text-gray-300">•</span>
                {shopOrders.length}{" "}
                {shopOrders.length === 1 ? "Store" : "Stores"}
              </p>
            </div>

            {/* ----------- Price Tag with Discount ----------- */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0 w-full sm:w-auto justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-gray-100 sm:border-none">
              <div className="text-sm font-bold text-red-600 line-through decoration-gray-900">
                ₹{originalPrice}
              </div>
              <div className="text-2xl font-black text-slate-900 leading-none flex items-center gap-2">
                ₹{totalPrice}
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-1.5 py-1 text-[10px] font-bold tracking-tight">
                  SAVE ₹{discount}
                </Badge>
              </div>
            </div>
          </div>

          {/* ------------ Mobile Progress Bar ------------ */}
          <div className="lg:hidden space-y-1.5 mb-6">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Ordered</span>
              <span className={statusStyle.text}>{mainStatus}</span>
            </div>
            <Progress
              value={progressValue}
              className="h-2 rounded-full bg-gray-100"
            />
          </div>

          {/* ------------ Items with Tooltips ------------ */}
          <TooltipProvider>
            <div className="flex flex-wrap gap-3 mt-2">
              {allItems.slice(0, 5).map((item, i) => (
                <Tooltip key={i} delayDuration={0}>

                  <TooltipTrigger asChild>
                    <div className="relative group/item cursor-pointer">
                      <Avatar className="h-12 w-12 rounded-xl border border-gray-100 shadow-sm bg-white transition-transform hover:scale-110 hover:-rotate-2">
                        <AvatarImage
                          src={item.item.image}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-[9px] font-bold text-gray-400">
                          FD
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-md border border-white">
                        {item.quantity}
                      </div>
                    </div>
                  </TooltipTrigger>

                  <TooltipContent className="bg-slate-800 text-white border-0 font-bold text-xs">
                    <p>
                      {item.name} - ₹{item.price}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}

              {/* ------------ More Items Tooltip ------------ */}
              {allItems.length > 5 && (
                <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-200 border-dashed flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-gray-100 transition-colors cursor-default">
                  +{allItems.length - 5}
                </div>
              )}
            </div>
          </TooltipProvider>
        </div>

        {/* ------------- 3. Right Side: Status, Track Order & Details ------------- */}
        <div className="w-full lg:w-48 bg-gray-50/50 border-t lg:border-t-0 lg:border-l border-gray-100 p-5 flex flex-row lg:flex-col justify-center gap-3">
          <div className="hidden md:flex flex-col items-center text-center space-y-1 mb-2">
            <span
              className={`h-10 w-10 rounded-full flex items-center justify-center text-lg shadow-sm ${statusStyle.light} ${statusStyle.text}`}
            >
              {mainStatus === "Delivered" ? (
                <FaCircleCheck />
              ) : (
                <FaLocationDot />
              )}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${statusStyle.text}`}
            >
              {mainStatus}
            </span>
          </div>

          {/* --------- Track Order Button --------- */}
          <Button
            className="flex-1 md:flex-none w-full bg-slate-800 text-white hover:bg-slate-700 font-bold shadow-lg shadow-slate-900/20 rounded-xl transition-all active:scale-95 cursor-pointer"
            onClick={() => navigate(`/track-order/${data._id}`)}
          >
            Track Order
          </Button>

          <Sheet>
            {/* --------- Details Button --------- */}
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 md:flex-none w-full bg-white font-bold border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-primary/30 rounded-xl transition-all cursor-pointer"
              >
                Details
              </Button>
            </SheetTrigger>

            {/* ------ Details Content ------ */}
            <SheetContent className="w-[100vw] sm:w-full sm:max-w-md md:max-w-lg p-0 gap-0 border-none shadow-2xl bg-white/80 backdrop-blur-xl z-[150] h-[100vh] sm:h-full">
              <div className="h-full flex flex-col bg-white sm:rounded-l-[32px] overflow-hidden shadow-2xl border-l border-white/20">

                {/* --------- Header --------- */}
                <div className="p-6 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden shrink-0">
                  <div
                    className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${statusStyle.bg}`}
                  />
                  <SheetHeader className="text-left space-y-4 relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="bg-white/60 backdrop-blur shadow-sm border-gray-200 font-mono text-[10px] px-2 py-1 rounded-md text-gray-500"
                          >
                            {displayId}
                          </Badge>
                          <Badge
                            className={`${statusStyle.bg} border-none text-white text-[10px]`}
                          >
                            {mainStatus}
                          </Badge>
                        </div>
                        <SheetTitle className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
                          Order Details
                        </SheetTitle>
                        <SheetDescription className="font-semibold text-gray-500 flex items-center gap-2 mt-1">
                          <IoTimeOutline /> Ordered on{" "}
                          {formatDate(data.createdAt)}
                        </SheetDescription>
                      </div>
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-xl ${statusStyle.bg} text-white`}
                      >
                        <FaReceipt />
                      </div>
                    </div>
                  </SheetHeader>
                </div>

                {/* --------- Tabs --------- */}
                <div className="flex-1 overflow-hidden flex flex-col bg-white relative">
                  {shopOrders.length > 0 ? (
                    <Tabs
                      defaultValue={shopOrders[0].shop?._id}
                      className="h-full flex flex-col"
                    >
                      {/* --------- Shop Tabs --------- */}
                      <div className="px-8 pb-2">
                        <ScrollArea className="w-full whitespace-nowrap pb-2">
                          <TabsList className="bg-gray-100/50 p-1.5 h-auto rounded-xl inline-flex gap-2">

                            {shopOrders.map((so, idx) => (
                              <TabsTrigger
                                key={idx}
                                value={so.shop?._id}
                                className="rounded-lg px-4 py-2 text-xs md:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 transition-all text-gray-500"
                              >
                                {so.shop?.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </ScrollArea>
                      </div>

                      {/* --------- Shop Tabs Content --------- */}
                      <ScrollArea className="flex-1 px-4 sm:px-8 pb-48 sm:pb-32">
                        {shopOrders.map((so, idx) => (
                          <TabsContent
                            key={idx}
                            value={so.shop?._id}
                            className="mt-2 space-y-6 focus-visible:outline-none"
                          >
                            {/* --------- Order Status --------- */}
                            <div
                              className={`p-4 rounded-2xl border ${getStatusStyle(so.status).border} ${getStatusStyle(so.status).light} flex justify-between items-center shadow-sm`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                  <FaStore
                                    className={`size-3 ${getStatusStyle(so.status).text}`}
                                  />
                                </div>
                                <span
                                  className={`font-bold text-xs uppercase tracking-wider ${getStatusStyle(so.status).text}`}
                                >
                                  Shop Status
                                </span>
                              </div>
                              <span
                                className={`font-bold text-sm ${getStatusStyle(so.status).text}`}
                              >
                                {so.status}
                              </span>
                            </div>

                            {/* --------- Order Items --------- */}
                            <div className="space-y-3">
                              {so.shopOrderItems.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col sm:flex-row gap-4 p-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all group/item"
                                >
                                  <div className="flex gap-4 min-w-0">
                                    <Avatar className="h-14 w-14 rounded-xl bg-gray-50 border border-gray-100 shrink-0">
                                      <AvatarImage
                                        src={item.item.image}
                                        className="object-cover"
                                      />
                                      <AvatarFallback>FD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0 sm:hidden">
                                      <h4 className="font-bold text-slate-900 truncate pr-2">
                                        {item.name}
                                      </h4>
                                      <p className="text-xs text-gray-500 truncate">
                                        Size: Regular • {item.quantity}x
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0 hidden sm:block">
                                    <h4 className="font-bold text-slate-900 truncate pr-2">
                                      {item.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">
                                      Size: Regular • {item.quantity}x
                                    </p>
                                  </div>

                                  <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto mt-0 pt-0 border-t sm:border-t-0 border-dashed border-gray-100 sm:border-none">
                                    {/* --------- Price --------- */}
                                    <div className="flex items-center sm:items-end gap-2 sm:gap-1 flex-row sm:flex-col">
                                      <div className="text-xs sm:text-sm font-bold text-red-600 line-through decoration-gray-900 order-last sm:order-first">
                                        ₹{Math.ceil(item.item.price * item.quantity * 1.40)}
                                      </div>
                                      <div className="text-lg sm:text-2xl font-black text-slate-900 leading-none flex items-center gap-2">
                                        ₹{item.item.price * item.quantity}
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold tracking-tight">
                                          SAVE ₹{Math.ceil((item.item.price * 1.40) - item.item.price)}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* --------- Rating --------- */}
                                    {so.status === "Delivered" && (
                                      <div className="flex gap-0.5">
                                        <p className="text-xs text-gray-500 mr-1">Rate: </p>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <FaStar
                                            key={star}
                                            className={`size-3.5 cursor-pointer transition-all hover:scale-125 ${(selectedRating[item.item._id] ||
                                              0) >= star
                                              ? "text-yellow-400"
                                              : "text-gray-200 hover:text-yellow-400"
                                              }`}
                                            onClick={() =>
                                              handleRating(item.item._id, star)
                                            }
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <Separator className="bg-gray-200" />

                            <div className="flex justify-between items-center text-sm font-bold text-gray-500 pb-32">
                              <span>Subtotal</span>{" "}
                              <span className="text-slate-900 text-lg">
                                ₹{so.subtotal}
                              </span>
                            </div>
                          </TabsContent>
                        ))}
                      </ScrollArea>
                    </Tabs>
                  ) : (
                    <div className="p-10 text-center">No details found.</div>
                  )}


                  {/* ---------- Bottom Panel ---------- */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent pt-12">

                    {/* ---------- Bill Details Accordion ---------- */}
                    <div className="mb-4 bg-gray-50/80 rounded-2xl border border-gray-100 backdrop-blur-sm px-4">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b-0">
                          <AccordionTrigger className="hover:no-underline py-3">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                              Bill Details
                            </span>
                          </AccordionTrigger>

                          <AccordionContent>
                            <div className="space-y-2 text-sm pt-1">
                              <div className="flex justify-between text-gray-600">
                                <span>Original Total</span>
                                <span className="font-bold">₹{originalPrice}</span>
                              </div>
                              <div className="flex justify-between text-red-600">
                                <span>Discount</span>
                                <span className="font-bold">-₹{originalPrice - itemTotal}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span>Item Total</span>
                                <span className="font-bold">₹{itemTotal}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span>Tax (5%)</span>
                                <span className="font-bold">₹{tax}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span className="font-bold">
                                  ₹{deliveryFee}
                                </span>
                              </div>
                              <div className="my-2 border-t border-dashed border-gray-200" />
                              <div className="flex justify-between items-end">
                                <span className="font-bold text-gray-900">
                                  Grand Total
                                </span>
                                <div className="text-right">
                                  <div className="text-xs text-gray-400 line-through">
                                    ₹{originalPrice}
                                  </div>
                                  <div className="text-xl font-black text-slate-900 leading-none">
                                    ₹{totalPrice}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* ----------- Buy Again and Track Order Button ----------- */}
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl font-bold border-gray-200 text-gray-600 hover:text-primary hover:border-primary/30 h-10 text-xs"
                        >
                          <FaArrowRotateRight className="mr-2" /> Buy Again
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl font-bold border-gray-200 text-gray-600 hover:text-primary hover:border-primary/30 h-10 text-xs"
                        >
                          <FaHeadset className="mr-2" /> Get Help
                        </Button>
                      </div>
                      <div className="bg-slate-900 rounded-[20px] p-1.5 pr-2 flex items-center justify-between shadow-xl shadow-slate-900/20 ring-4 ring-white">
                        <div className="flex flex-col pl-4 py-2">
                          <span className="text-[10px] font-bold text-emerald-400 mb-0.5">
                            You saved ₹{discount}
                          </span>
                          <span className="text-xl font-black text-white leading-none">
                            ₹{data.totalAmount}
                          </span>
                        </div>
                        <Button
                          className="h-12 rounded-[16px] bg-white text-black hover:bg-gray-100 font-bold px-6 shadow-md transition-all active:scale-95 cursor-pointer"
                          onClick={() => navigate(`/track-order/${data._id}`)}
                        >
                          Track Order
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Card>
  );
};
export default UserOrderCard;

import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../../components/UserOrderCard";
import OwnerOrderCard from "../../components/OwnerOrderCard"
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { useEffect, useState } from "react";
import { setMyOrders, updateRealTimeOrderStatus } from "../../redux/userSlice";
import useGetMyOrders from "../../hooks/useGetMyOrders";
import { FaSearch, FaSortAmountDown, FaShoppingBag } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ArrowLeft } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";


const MyOrders = () => {
  useGetMyOrders();
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("active");
  const [showLoading, setShowLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if (data.shopOrders?.owner._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    });
    socket?.on("update-status", ({ orderId, shopId, status, userId }) => {
      if (userData.role === "owner" || (userId === userData._id)) {
        dispatch(updateRealTimeOrderStatus({ orderId, shopId, status }));
      }
    });
    return () => {
      socket?.off("newOrder");
      socket?.off("update-status")
    };
  }, [socket, myOrders, userData, dispatch]);


  // ---------- Filtering & Sorting -----------
  const filteredOrders = myOrders?.filter((order) => {
    // 1. Search Filter
    const query = searchQuery.toLowerCase();
    let shopOrders = [];
    let customerName = "";

    if (userData.role === 'owner') {
      shopOrders = Array.isArray(order.shopOrders) ? order.shopOrders : [order.shopOrders];
      customerName = order.user?.fullName?.toLowerCase() || "";
    } else {
      shopOrders = Array.isArray(order.shopOrders) ? order.shopOrders : [];
    }

    const shopNames = shopOrders.map(so => so.shop?.name?.toLowerCase() || "").join(" ");
    const itemNames = shopOrders.flatMap(so => so.shopOrderItems?.map(item => item.name.toLowerCase()) || []).join(" ");
    const orderIdMatch = order._id ? order._id.toLowerCase().includes(query) : false;

    const matchesSearch = !query || shopNames.includes(query) || itemNames.includes(query) 
                          || orderIdMatch || customerName.includes(query);

    // 2. Tab Filter
    const mainStatus = shopOrders[0]?.status || "Pending";
    const isActive = ["Pending", "Preparing", "Out for Delivery"].includes(mainStatus);
    const isPast = ["Delivered", "Cancelled"].includes(mainStatus);

    const matchesTab = activeTab === "active" ? isActive : isPast;
    return matchesSearch && matchesTab;

  }).sort((a, b) => {
    // 3. Sorting
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "priceHigh") return b.totalAmount - a.totalAmount;
    if (sortBy === "priceLow") return a.totalAmount - b.totalAmount;
    return 0;
  });

  const activeCount = myOrders?.filter(o => {
    const shopOrders = Array.isArray(o.shopOrders) ? o.shopOrders : [o.shopOrders];
    const status = shopOrders[0]?.status;
    return ["Pending", "Preparing", "Out for Delivery"].includes(status);
  }).length || 0;

  const historyCount = myOrders?.filter(o => {
    const shopOrders = Array.isArray(o.shopOrders) ? o.shopOrders : [o.shopOrders];
    const status = shopOrders[0]?.status;
    return ["Delivered", "Cancelled"].includes(status);
  }).length || 0;


  const content = (
    <div className={`w-full ${userData.role === 'owner' ? '' : 'min-h-screen bg-gray-50/30 flex justify-center px-0 py-0 font-sans'}`}>
      <div className={`w-full ${userData.role === 'owner' ? 'space-y-6' : 'max-w-6xl space-y-4'}`}>

        {/* ----------- Header Section ---------- */}
        <div className={`relative ${userData.role === 'owner' ? 'pb-6 border-b border-gray-100' : 'px-2 md:px-0 pb-4 pt-4 border-white overflow-hidden'}`}>
          <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">

            {/* ----------- Back Button & Title ---------- */}
            <div className="flex items-start gap-4">
              {userData.role !== "owner" && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-200 bg-white hover:bg-gray-50 hover:border-primary/20 transition-all shadow-sm h-10 w-10 md:h-12 md:w-12"
                  onClick={() => navigate("/home")}
                >
                  <ArrowLeft size={20} className="text-gray-700 hover:text-primary" />
                </Button>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                    {userData.role === 'owner' ? 'Incoming Orders' : 'My Orders'}
                  </h1>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 rounded-lg px-2 py-0.5 text-xs font-bold border border-gray-200">
                    {myOrders?.length || 0} Total
                  </Badge>
                </div>
                <p className="text-gray-500 font-medium text-base">
                  {userData.role === 'owner' ? 'Manage and track your restaurant orders.' : "Here's what you've ordered recently."}
                </p>
              </div>
            </div>

            {/* ----------- Search & Sorting Section ---------- */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <div className="relative w-full sm:min-w-[280px] lg:w-[320px]">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <Input
                  placeholder={userData.role === 'owner' ? "Search by customer, item..." : "Search by store, item..."}
                  className="pl-11 h-10 bg-gray-50/50 border-gray-200 focus:bg-white focus-visible:ring-primary/20 rounded-2xl shadow-sm transition-all text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 bg-white border-gray-200 rounded-2xl shadow-sm font-bold text-gray-700 focus:ring-primary/20">
                  <div className="flex items-center gap-2 truncate">
                    <FaSortAmountDown className="text-gray-400 shrink-0" />
                    <span className="truncate"><SelectValue placeholder="Sort" /></span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest" className="font-medium">Newest First</SelectItem>
                  <SelectItem value="oldest" className="font-medium">Oldest First</SelectItem>
                  <SelectItem value="priceHigh" className="font-medium">Price: High to Low</SelectItem>
                  <SelectItem value="priceLow" className="font-medium">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ----------- Tabs ------------- */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <div className="flex justify-center md:justify-start">
            <TabsList className="bg-white p-1.5 rounded-full border border-gray-200 shadow-sm inline-flex h-auto">
              <TabsTrigger
                value="active"
                className="rounded-full px-6 md:px-8 py-3 text-sm font-bold data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all text-gray-500 gap-2.5"
              > Ongoing
                <Badge className="bg-primary text-white border-none px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]">{activeCount}</Badge>
              </TabsTrigger>

              <TabsTrigger
                value="past"
                className="rounded-full px-6 md:px-8 py-3 text-sm font-bold data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all text-gray-500 gap-2.5"
              > History
                <Badge variant="secondary" className="bg-gray-200 text-gray-600 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full text-[10px]">{historyCount}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ----------- Active Content ------------- */}
          <TabsContent value="active" className="space-y-6 outline-none animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
            {showLoading ? (
              <OrdersSkeleton />
            ) : filteredOrders?.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.map((order, index) =>
                  userData.role === "user" ? (
                    <UserOrderCard data={order} key={index} />
                  ) : userData.role === "owner" ? (
                    <OwnerOrderCard data={order} key={index} />
                  ) : null
                )}
              </div>
            ) : (
              <OrderEmptyState type="active" navigate={navigate} role={userData.role} />
            )}
          </TabsContent>

          {/* ----------- Past Content ------------- */}
          <TabsContent value="past" className="space-y-6 outline-none animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
            {showLoading ? (
              <OrdersSkeleton />
            ) : filteredOrders?.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.map((order, index) =>
                  userData.role === "user" ? (
                    <UserOrderCard data={order} key={index} />
                  ) : userData.role === "owner" ? (
                    <OwnerOrderCard data={order} key={index} />
                  ) : null
                )}
              </div>
            ) : (
              <OrderEmptyState type="past" navigate={navigate} role={userData.role} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  if (userData.role === 'owner') {
    return (
      <OwnerLayout>
        {content}
      </OwnerLayout>
    );
  }

  if (userData.role === 'user') {
    return (
      <UserLayout>
        {content}
      </UserLayout>
    );
  }
};


// ---------- Orders Skeleton ----------
const OrdersSkeleton = () => (
  <div className="grid gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex flex-col md:flex-row h-auto md:h-52 w-full border-0 overflow-hidden rounded-[24px] bg-white shadow-xl shadow-gray-200/40 ring-1 ring-gray-100">

        {/* ------------ Left Side Skeleton ------------ */}
        <div className="md:w-[32%] bg-gray-50/80 p-6 flex flex-col justify-between border-r border-gray-100/80 relative">
          <div className="flex justify-between w-full mb-6">
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-4 w-24 rounded-lg" />
          </div>
          <div className="flex -space-x-4 pl-1 py-4">
            <Skeleton className="h-16 w-16 rounded-2xl border-[3px] border-white" />
            <Skeleton className="h-16 w-16 rounded-2xl border-[3px] border-white" />
            <Skeleton className="h-16 w-16 rounded-2xl border-[3px] border-white" />
          </div>
          <div className="mt-auto">
            <Skeleton className="h-3 w-16 rounded mb-1" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>

        {/* ------------ Right Side Skeleton ------------ */}
        <div className="flex-1 p-7 flex flex-col justify-between bg-white relative">
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 h-12">
            <Skeleton className="h-full w-full rounded-xl" />
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);


const OrderEmptyState = ({ type, navigate }) => (
  <Empty className="bg-white rounded-[32px] border-none shadow-xl shadow-gray-200/50 py-24">
    <EmptyMedia className="mb-6">
      <div className="h-24 w-24 rounded-3xl bg-gray-50 flex items-center justify-center shadow-inner">
        {type === 'active' ? (
          <FaShoppingBag className="text-4xl text-gray-300" />
        ) : (
          <FaBoxOpen className="text-4xl text-gray-300" />
        )}
      </div>
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle className="text-2xl font-black text-gray-900">
        {type === 'active' ? "No active orders" : "No past orders"}
      </EmptyTitle>
      <EmptyDescription className="text-base font-medium text-gray-500 max-w-sm mx-auto mt-2">
        {type === 'active'
          ? "You don't have any orders in progress right now. Hungry?"
          : "You haven't placed any orders yet. Better late than never!"}
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent className="mt-8">
      {type === 'active' && (
        <Button onClick={() => navigate('/home')} className="h-12 rounded-full px-8 text-base font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
          Browse Restaurants
        </Button>
      )}
    </EmptyContent>
  </Empty>
);

export default MyOrders;

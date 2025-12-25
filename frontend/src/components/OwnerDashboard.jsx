import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerItemCard from "./OwnerItemCard";
import useGetMyShop from "../hooks/useGetMyShop";
import useGetMyOrders from "../hooks/useGetMyOrders";
import { FaUtensils, FaPlus, FaStore, FaChartLine, FaBoxOpen, FaMagnifyingGlass } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";


const OwnerDashboard = () => {
  useGetMyShop();
  useGetMyOrders();
  const { myShopData } = useSelector((state) => state.owner);
  const { myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate Stats
  const totalRevenue = myOrders?.reduce((acc, order) => {
    const shopOrder = Array.isArray(order.shopOrders) ? order.shopOrders[0] : order.shopOrders;
    return acc + (shopOrder?.subtotal || 0);
  }, 0) || 0;

  const activeOrdersCount = myOrders?.filter((order) => {
    const shopOrder = Array.isArray(order.shopOrders) ? order.shopOrders[0] : order.shopOrders;
    return ["Pending", "Preparing", "Out for Delivery"].includes(shopOrder?.status);
  }).length || 0;

  const activeItemsCount = myOrders?.reduce((acc, order) => {
    const shopOrder = Array.isArray(order.shopOrders) ? order.shopOrders[0] : order.shopOrders;
    if (["Pending", "Preparing", "Out for Delivery"].includes(shopOrder?.status)) {
      return acc + (shopOrder?.shopOrderItems?.length || 0);
    }
    return acc;
  }, 0) || 0;


  if (loading) {
    return (
      <OwnerLayout>
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* --------- Header Skeleton --------- */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48 rounded-lg" />
              <Skeleton className="h-5 w-72 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>

          {/* --------- Stats Skeleton --------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl shadow-lg" />
            ))}
          </div>

          {/* --------- Tabs Skeleton --------- */}
          <div className="space-y-6">
            <Skeleton className="h-12 w-full max-w-md rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  if (!myShopData) {
    return (
      <OwnerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-700">
          <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-primary/10 border border-gray-100 max-w-lg w-full">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <FaStore className="text-4xl" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Setup Your Restaurant
            </h2>
            <p className="text-gray-500 mb-8 text-lg">
              Join our platform to reach thousands of hungry customers. It takes
              less than 2 minutes to get started.
            </p>
            <Button
              onClick={() => navigate("/create-edit-shop")}
              size="lg"
              className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold h-12 shadow-lg shadow-primary/25"
            >
              Register Restaurant
            </Button>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  // ------- Filter items -------
  const filteredItems = myShopData.items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <OwnerLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 p-0.5 md:p-4 lg:p-6">
        {/* --------- Header --------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 font-medium">
              Welcome back, here's what's happening at{" "}
              <span className="text-primary font-bold">{myShopData.name}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/add-item")}
              className="w-full rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              <FaPlus className="mr-2" /> Add New Item
            </Button>
          </div>
        </div>

        {/* --------- Stats --------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ------------ Total Revenue ------------ */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-indigo-500 to-violet-600 text-white relative overflow-hidden h-full sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FaChartLine className="text-9xl transform translate-x-4 -translate-y-4" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-100 uppercase tracking-wider">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          {/* ------------ Active Orders ------------ */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Active Orders
              </CardTitle>
              <FaBoxOpen className="text-primary text-xl" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{activeOrdersCount}</div>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                {activeItemsCount} items preparing
              </p>
            </CardContent>
          </Card>

          {/* ------------ Total Menu Items ------------ */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Total Menu Items
              </CardTitle>
              <FaUtensils className="text-orange-500 text-xl" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">
                {myShopData.items.length}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Across {new Set(myShopData.items.map((i) => i.category)).size}{" "}
                categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ---------- Tabs ---------- */}
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 mb-8 inline-flex h-auto">
            <TabsTrigger
              value="menu"
              className="flex-1 sm:flex-none rounded-full data-[state=active]:bg-slate-900 data-[state=active]:text-white px-4 sm:px-8 py-3 text-sm font-bold text-gray-500 transition-all hover:text-slate-900"
            >
              Menu Management
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="flex-1 sm:flex-none rounded-full data-[state=active]:bg-slate-900 data-[state=active]:text-white px-4 sm:px-8 py-3 text-sm font-bold text-gray-500 transition-all hover:text-slate-900"
            >
              Shop Overview
            </TabsTrigger>
          </TabsList>

          {/* ----------- Menu Management ----------- */}
          <TabsContent value="menu" className="space-y-6">

            {/* ----------- Search Bar ----------- */}
            <div className="flex gap-4 items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
              <FaMagnifyingGlass className="ml-3 text-gray-400" />
              <Input
                placeholder="Search by item name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0 text-base"
              />
            </div>

            {/* ----------- Menu Items ----------- */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUtensils className="text-gray-300 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No Items Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or add a new item.
                </p>
                <Button onClick={() => navigate("/add-item")} variant="outline">
                  Add New Item
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item, index) => (
                  <OwnerItemCard data={item} key={index} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ----------- Shop Overview ----------- */}
          <TabsContent value="overview">
            <div className="bg-white rounded-3xl p-0 overflow-hidden shadow-xl shadow-slate-200/50 border border-gray-100">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={myShopData.image}
                  alt={myShopData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-black">{myShopData.name}</h2>
                  <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-none backdrop-blur-md"
                    >
                      {myShopData.city}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Contact Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-50">
                      <span className="text-gray-500">Address</span>
                      <span className="font-bold text-slate-900 text-right">
                        {myShopData.address}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-50">
                      <span className="text-gray-500">State</span>
                      <span className="font-bold text-slate-900 text-right">
                        {myShopData.state}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-end items-start">
                  <Button
                    onClick={() => navigate("/create-edit-shop")}
                    variant="outline"
                    className="w-full h-12 rounded-xl font-bold border-gray-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 cursor-pointer"
                  >
                    Edit Shop Details
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;
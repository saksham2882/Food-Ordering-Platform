import { useNavigate, useParams } from "react-router-dom";
import shopApi from "../../api/shopApi";
import { useEffect, useState, useMemo } from "react";
import { FaStore, FaLocationDot } from "react-icons/fa6";
import { FaUtensils, FaStar, FaSearch, FaLeaf } from "react-icons/fa";
import FoodCard from "../../components/FoodCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/common/Footer";


const Shop = () => {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVegOnly, setIsVegOnly] = useState(false);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      setLoading(true);
      const data = await shopApi.getItemsByShop(shopId);
      setShop(data.shop);
      setItems(data.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleShop();
    }, 800);
    return () => clearTimeout(timer);
  }, [shopId]);

  // ------ Filter -------
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = isVegOnly ? item.foodType === "veg" : true;
      return matchesSearch && matchesVeg;
    });
  }, [items, searchQuery, isVegOnly]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative w-full h-[300px] md:h-[400px] bg-gray-200 animate-pulse">
          <div className="absolute top-6 left-6 z-20">
            <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-10">
          <Skeleton className="h-48 w-full rounded-3xl bg-gray-300 shadow-xl" />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-2xl bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans text-slate-900">
      {/* ----------------- Top ---------------- */}
      <div className="relative w-full h-[40vh] min-h-[320px] lg:h-[450px]">
        {/* ---------- Back Button ---------- */}
        <Button
          variant="secondary"
          size="icon"
          onClick={() => navigate("/home")}
          className="absolute top-6 left-6 md:top-10 md:left-10 z-30 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white rounded-full h-10 w-10 border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft size={26} />
        </Button>

        {/* ------- Background Image ------- */}
        <div className="absolute inset-0">
          <img
            src={shop?.image}
            alt={shop?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      </div>

      {/* ----------------- Shop Info Card ---------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-40 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center md:text-left space-y-3 w-full">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg px-3 py-1 text-xs uppercase tracking-wider font-bold">
                <FaStore className="mr-1.5" /> Restaurant
              </Badge>

              <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/30">
                <FaStar className="text-yellow-600 text-sm" />
                <span className="text-yellow-700 font-bold text-sm">4.5</span>
                <span className="text-yellow-700/60 text-xs">(500+)</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-none">
              {shop?.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 font-medium text-sm md:text-base">
              <div className="flex items-center gap-1.5">
                <FaLocationDot className="text-red-500/80" />
                {shop?.address}, {shop?.city}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center bg-green-50 px-6 py-3 rounded-2xl border border-green-100 text-green-700 font-bold shadow-sm">
            Open Now
          </div>
        </div>
      </div>

      {/* -------------- Filter Bar -------------- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm mt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* ---------- Left: Heading ----------- */}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
              <FaUtensils className="text-primary" />
              <span>
                Menu{" "}
                <span className="text-gray-400 text-lg font-medium ml-1">
                  ({items.length} items)
                </span>
              </span>
            </div>

            {/* ---------- Right: Filters ---------- */}
            <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3 sm:gap-4">
              {/* --------- Search --------- */}
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <Input
                  placeholder="Search food..."
                  className="pl-9 h-10 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* ---------- Veg Toggle ---------- */}
              <div
                className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                onClick={() => setIsVegOnly(!isVegOnly)}
              >
                <Label className="cursor-pointer font-semibold text-gray-700 text-sm flex items-center gap-2">
                  <span
                    className={isVegOnly ? "text-green-600" : "text-gray-500"}
                  >
                    Veg Only
                  </span>
                  <FaLeaf
                    className={`text-xs ${isVegOnly ? "text-green-600" : "text-gray-400" }`}
                  />
                </Label>
                <Switch
                  checked={isVegOnly}
                  onCheckedChange={setIsVegOnly}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Menu Grid ----------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[500px]">
        {/* ------------- Items Grid ------------- */}
        {filteredItems?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={item._id || index}
                className={`animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <FoodCard data={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center">
            <div className="bg-gray-100 p-8 rounded-full mb-6">
              <FaUtensils className="text-4xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-600">No items found</h3>
            <p className="text-sm mt-2 max-w-xs mx-auto">
              {searchQuery
                ? `We couldn't find anything matching "${searchQuery}"`
                : "This shop hasn't added any items yet."}
            </p>
            {searchQuery && (
              <Button
                variant="link"
                className="text-primary mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setIsVegOnly(false);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ---------------- Footer -----------------  */}
      <Footer />
    </div>
  );
};

export default Shop;

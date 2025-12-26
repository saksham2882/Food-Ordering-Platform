import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaLeaf, FaDrumstickBite, FaStar, FaMinus, FaPlus, FaClock, FaFire, FaStore } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";


const ItemDetailsDialog = ({ open, onOpenChange, data, cartItem }) => {
    const dispatch = useDispatch();
    const { shopsInMyCity } = useSelector((state) => state.user);
    const [quantity, setQuantity] = useState(1);

    const shopDetails = shopsInMyCity?.find((s) => s._id === data?.shop);
    const shopName = shopDetails?.name || "FoodXpress Partner";

    if (!data) return null;

    useEffect(() => {
        setQuantity(cartItem ? cartItem.quantity : 1);
    }, [cartItem?.quantity, data?._id]);

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: data._id,
                name: data.name,
                price: data.price,
                image: data.image,
                shop: data.shop,
                shopName: shopName,
                quantity,
                foodType: data.foodType,
                description: data.description,
            })
        );
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden gap-0 border-none shadow-2xl rounded-3xl grid grid-cols-1 md:grid-cols-2 h-[90vh] md:h-auto max-h-[600px]">

                {/* ---------- Left Side - Image ---------- */}
                <div className="relative h-[250px] md:h-full w-full group overflow-hidden bg-gray-100">
                    <img
                        src={data.image}
                        alt={data.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* ---------- Image Details ---------- */} 
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        {data.foodType === "veg" ? (
                            <Badge className="bg-white/90 text-green-700 hover:bg-white border-0 shadow-sm gap-1.5 px-3 py-1 font-bold backdrop-blur-md">
                                <FaLeaf size={12} /> VEG
                            </Badge>
                        ) : (
                            <Badge className="bg-white/90 text-red-600 hover:bg-white border-0 shadow-sm gap-1.5 px-3 py-1 font-bold backdrop-blur-md">
                                <FaDrumstickBite size={12} /> NON-VEG
                            </Badge>
                        )}
                        <Badge
                            variant="secondary"
                            className="bg-black/40 text-white border-0 backdrop-blur-md gap-1.5"
                        >
                            <FaClock size={12} className="text-orange-400" /> 20 min
                        </Badge>
                    </div>

                    {/* ---------- Image Details ---------- */} 
                    <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                        <h2 className="text-3xl font-black leading-tight mb-2 shadow-black/50 drop-shadow-lg">
                            {data.name}
                        </h2>
                        <div className="flex items-center gap-3 text-sm font-medium opacity-90">
                            <span className="flex items-center gap-1 bg-yellow-400 text-black px-1.5 rounded-sm font-bold">
                                {data.rating?.average || 4.2} <FaStar size={10} />
                            </span>
                            <span>({data.rating?.userCount || 100}+ reviews)</span>
                            <span>•</span>
                            <span>{data.category || "Fast Food"}</span>
                        </div>
                    </div>
                </div>

                {/* ------------- Right Side - Content ------------- */}
                <div className="flex flex-col h-full bg-white max-h-[calc(90vh-250px)] md:max-h-[600px]">

                    {/* ------------- Dialog Header ------------- */}
                    <DialogHeader className="p-6 pb-2 shrink-0 text-left">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <FaStore className="text-primary" />
                                {shopName}
                            </div>
                            <Badge
                                variant="outline"
                                className="border-orange-200 bg-orange-50 text-orange-600"
                            >
                                Bestseller
                            </Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-gray-900">
                                ₹{data.price}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                                ₹{Math.round(data.price * 1.4)}
                            </span>
                        </div>
                    </DialogHeader>

                    {/* ------------- Tabs ------------- */}
                    <Tabs
                        defaultValue="details"
                        className="flex-1 flex flex-col w-full overflow-hidden"
                    >
                        <div className="px-6">
                            <TabsList className="w-full grid grid-cols-3 bg-gray-100/50 p-1">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* ------------- Tabs Content ------------- */}
                        <div className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar">

                            {/* ------------ Description & Ingredients ------------ */}
                            <TabsContent value="details" className="mt-0 space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        Description
                                    </h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {data.description ||
                                            "Indulge in our chef's special recipe. Prepared with fresh, locally sourced ingredients and a blend of aromatic spices to give you an unforgettable taste experience."}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        Ingredients
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "Fresh Dough",
                                            "Mozzarella",
                                            "Basil",
                                            "Olive Oil",
                                            "Signature Sauce",
                                        ].map((ing, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            >
                                                {ing}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            {/* ------------ Nutrition ------------ */}
                            <TabsContent value="nutrition" className="mt-0">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                                        <div className="text-xs text-gray-500 font-medium mb-1">
                                            Calories
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                            <FaFire className="text-orange-500 size-3" /> 320 kcal
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                        <div className="text-xs text-gray-500 font-medium mb-1">
                                            Protein
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">12g</div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                        <div className="text-xs text-gray-500 font-medium mb-1">
                                            Carbs
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">45g</div>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                                        <div className="text-xs text-gray-500 font-medium mb-1">
                                            Fat
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">14g</div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-4">
                                    * Percent Daily Values are based on a 2,000 calorie diet.
                                </p>
                            </TabsContent>

                            {/* ------------ Reviews ------------ */}
                            <TabsContent value="reviews" className="mt-0 space-y-4">
                                <div className="space-y-4">
                                    {[1, 2].map((_, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-900">
                                                        User {i + 1}
                                                    </span>
                                                    <span className="flex text-yellow-400 text-[10px]">
                                                        <FaStar />
                                                        <FaStar />
                                                        <FaStar />
                                                        <FaStar />
                                                        <FaStar />
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Absolutely delicious! The flavors were perfectly
                                                    balanced.
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="link"
                                        className="text-primary text-xs w-full h-auto p-0"
                                    >
                                        View all 124 reviews
                                    </Button>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    <Separator />

                    {/* ------------- Add To Cart ------------- */}
                    <div className="p-4 md:p-6 bg-gray-50">
                        <div className="flex flex-row items-center justify-between gap-3 md:gap-4">
                            <div className="flex items-center gap-2 md:gap-3 bg-white rounded-xl p-1 shadow-sm border border-gray-200 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-lg hover:bg-gray-100 hover:text-red-500"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <FaMinus size={14} />
                                </Button>
                                <span className="w-6 md:w-8 text-center font-bold text-lg md:text-xl text-gray-900">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-lg hover:bg-gray-100 hover:text-green-600"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <FaPlus size={14} />
                                </Button>
                            </div>

                            <Button
                                className="flex-1 text-sm md:text-base font-bold h-12 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-orange-600 active:scale-[0.98] transition-all truncate px-2"
                                onClick={handleAddToCart}
                            >
                                Add — ₹{data.price * quantity}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ItemDetailsDialog;

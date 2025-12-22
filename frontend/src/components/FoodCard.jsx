import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaLeaf, FaDrumstickBite, FaStar, FaPlus, FaMinus, FaHeart, FaRegHeart, FaClock, FaStore } from "react-icons/fa6";
import { addToCart, removeCartItem, updateQuantity } from "../redux/userSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import ItemDetailsDialog from "./ItemDetailsDialog";

const FoodCard = ({ data }) => {
  const dispatch = useDispatch();
  const { cartItems, shopsInMyCity } = useSelector((state) => state.user);
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItem = cartItems.find((item) => item.id === data._id);
  const isInCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;

  const shopDetails = shopsInMyCity?.find((s) => s._id === data.shop);
  const shopName = shopDetails?.name || "FoodXpress Partner";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        id: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        shop: data.shop,
        shopName: shopName,
        quantity: 1,
        foodType: data.foodType,
      })
    );
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    dispatch(updateQuantity({ id: data._id, quantity: quantity + 1 }));
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      dispatch(updateQuantity({ id: data._id, quantity: quantity - 1 }));
    } else {
      dispatch(removeCartItem(data._id));
    }
  };

  return (
    <>
      <Card
        className="group w-full overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white rounded-[24px]"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative h-[240px] overflow-hidden m-0">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

          {/* --------- Top Left - Veg/NonVeg Badge --------- */}
          <div className="absolute top-4 left-4 z-10">
            <Badge
              variant="outline"
              className={cn(
                "backdrop-blur-md bg-white/95 border-0 text-[10px] font-black tracking-wider px-2 py-1 gap-1 shadow-sm uppercase",
                data.foodType === "veg" ? "text-green-700" : "text-red-600"
              )}
            >
              {data.foodType === "veg" ? (
                <>
                  <FaLeaf className="size-3" /> VEG
                </>
              ) : (
                <>
                  <FaDrumstickBite className="size-3" /> NON-VEG
                </>
              )}
            </Badge>
          </div>

          {/* --------- Top Right - Favorite Button --------- */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-black/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 transition-all border border-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
          >
            {isFavorite ? (
              <FaHeart className="size-4 text-red-500" />
            ) : (
              <FaRegHeart className="size-4" />
            )}
          </Button>

          {/* --------- Bottom Left - Rating --------- */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            <Badge className="bg-yellow-400 hover:bg-yellow-500 text-black border-0 shadow-lg px-2 py-0.5 gap-1 font-bold">
              <span className="text-sm">{data.rating?.average || 4.2}</span>
              <FaStar className="size-3" />
            </Badge>
            <span className="text-xs text-gray-300 font-medium tracking-wide">
              ({data.rating?.userCount || 24}+ reviews)
            </span>
          </div>

          {/* --------- Bottom Right - Time Estimate (Mock) --------- */}
          <div className="absolute bottom-4 right-4 z-10">
            <Badge
              variant="secondary"
              className="bg-black/40 backdrop-blur-md text-white border border-white/10 text-xs px-2 py-1 gap-1.5 font-medium hover:bg-black/50"
            >
              <FaClock className="size-3 text-orange-400" /> 20-30 min
            </Badge>
          </div>
        </div>


        {/* --------- Card Content --------- */}
        <CardContent className="p-5 space-y-3">
          {/* ----------- Shop Name ----------- */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <FaStore className="text-primary size-3" />
            {shopName}
          </div>

          {/* ----------- Title & Description ----------- */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-bold text-gray-900 text-xl leading-tight truncate group-hover:text-primary transition-colors cursor-help">
                    {data.name}
                  </h3>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] bg-gray-900 text-white border-0">
                  <p>
                    {data.description ||
                      "Detailed description available in quick view."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px] leading-relaxed">
              {data.description ||
                "Freshly prepared with authentic ingredients for a delightful taste."}
            </p>
          </div>

          <Separator className="bg-gray-100" />

          {/* ----------- Price & Action ----------- */}
          <div className="flex items-center justify-between pt-1 h-10">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-gray-900 tracking-tight">
                  ₹{data.price}
                </span>
                <span className="text-xs text-gray-400 font-bold line-through decoration-gray-400/80">
                  ₹{Math.round(data.price * 1.4)}
                </span>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full tracking-wide">
                40% OFF
              </span>
            </div>

            {/* ----------- Add to Cart Button ----------- */}
            {isInCart ? (
              <ButtonGroup className="shadow-sm">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-xl border-gray-200 bg-gray-50 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
                  onClick={handleDecrement}
                >
                  <FaMinus className="size-3.5" />
                </Button>
                <ButtonGroupText className="h-10 border-y border-x-0 border-gray-200 bg-white min-w-[40px] justify-center px-0 font-bold text-lg text-gray-900">
                  {quantity}
                </ButtonGroupText>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-xl border-gray-200 bg-gray-50 text-gray-600 hover:text-green-600 hover:bg-green-50 hover:border-green-100"
                  onClick={handleIncrement}
                >
                  <FaPlus className="size-3.5" />
                </Button>
              </ButtonGroup>
            ) : (
              <Button
                className="rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/25 bg-primary hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all duration-300"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>


      {/* ----------- Item Details Dialog ----------- */}
      <ItemDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        data={data}
        cartItem={cartItem}
      />
    </>
  );
};

export default FoodCard;
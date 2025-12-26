import { useDispatch } from "react-redux";
import { FaMinus, FaPlus, FaStore, FaXmark } from "react-icons/fa6";
import { removeCartItem, updateQuantity } from "../redux/userSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


const Card = ({ data }) => {
  const dispatch = useDispatch();

  return (
    <div className="relative group w-full bg-white rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden isolate border border-gray-100 font-sans">

      <div className="flex flex-col sm:flex-row h-auto sm:h-[220px]">

        {/* ---------- Left Side ---------- */}
        <div className="relative w-full sm:w-[40%] h-[200px] sm:h-full shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 sm:from-black/50 via-transparent to-transparent z-10" />
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
          />

          {/* ------------ Floating Price Tag ------------ */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-white/20 flex flex-col items-center leading-none">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price</span>
              <span className="text-sm font-black text-gray-900">₹{data.price}</span>
            </div>
          </div>

          {/* ------------ Mobile Only Title ------------ */}
          <div className="absolute bottom-4 left-4 right-4 z-20 sm:hidden">
            <h3 className="text-white font-black text-2xl leading-none drop-shadow-md truncate">{data.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              {data.foodType === "veg" ? (
                <Badge className="bg-green-500/90 hover:bg-green-500 text-white border-0 text-[10px] px-2">VEG</Badge>
              ) : (
                <Badge className="bg-red-500/90 hover:bg-red-500 text-white border-0 text-[10px] px-2">NON-VEG</Badge>
              )}
            </div>
          </div>
        </div>

        {/* ------------ Right Side ------------ */}
        <div className="flex-1 flex flex-col justify-between p-5 pt-6 sm:p-6 relative bg-white">

          {/* -------------- Desktop Title & Details --------------- */}
          <div className="hidden sm:block space-y-3 pr-8">
            <div className="flex items-center gap-2">
              {data.foodType === "veg" ? (
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 text-[10px] h-5 px-2 font-black tracking-widest uppercase">VEG</Badge>
              ) : (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 text-[10px] h-5 px-2 font-black tracking-widest uppercase">NON-VEG</Badge>
              )}
              <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FaStore className="size-3" /> {data.shopName}
              </span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">{data.name}</h3>
            <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed max-w-[90%]">
              {data.description || "Freshly prepared with authentic ingredients for a delightful taste."}
            </p>
          </div>

          {/* ------------ Close Button ------------ */}
          <button
            onClick={() => dispatch(removeCartItem(data.id))}
            className="absolute top-1 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-20"
          >
            <FaXmark size={20} />
          </button>

          {/* ------------ Footer ------------ */}
          <div className="flex items-end justify-between mt-4 sm:mt-0 pt-4 border-t border-dashed border-gray-100 sm:border-0 sm:pt-0">

            {/* ------------ Quantity ------------ */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-50 rounded-2xl p-1 shadow-inner border border-gray-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-white shadow-sm hover:shadow-md text-gray-400 hover:text-primary transition-all active:scale-95"
                  onClick={() => dispatch(updateQuantity({ id: data.id, quantity: data.quantity - 1 }))}
                  disabled={data.quantity <= 1}
                >
                  <FaMinus size={10} />
                </Button>
                <span className="w-8 text-center font-black text-lg text-gray-900 mx-1 lining-nums">{data.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-white shadow-sm hover:shadow-md text-gray-900 hover:text-primary transition-all active:scale-95"
                  onClick={() => dispatch(updateQuantity({ id: data.id, quantity: data.quantity + 1 }))}
                >
                  <FaPlus size={10} />
                </Button>
              </div>
            </div>

            {/* ------------ Total Price ------------ */}
            <div className="text-right flex flex-col items-end">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900 tracking-tight">₹{data.price * data.quantity}</span>
                <span className="hidden sm:inline-block text-sm font-bold text-red-500 line-through decoration-2">₹{Math.round(data.price * data.quantity * 1.4)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
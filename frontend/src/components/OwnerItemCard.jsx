import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import shopApi from "../api/shopApi";
import { setMyShopData } from "../redux/ownerSlice";
import { toast } from "sonner";
import { useState } from "react";
import { FaPen, FaTrash, FaUtensils } from "react-icons/fa6";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";


const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [inStock, setInStock] = useState(true);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await shopApi.deleteItem(data._id);
      dispatch(setMyShopData(res));
      toast.success("Item Deleted Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  const handleStockToggle = (checked) => {
    setInStock(checked);
    toast.success(`${data.name} is now ${checked ? "In Stock" : "Out of Stock"}`);
  };

  return (
    <div className="group relative w-full bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col min-[1100px]:flex-row h-full">
      {/* --------------- Image Section --------------- */}
      <div className="w-full h-52 min-[1100px]:w-48 min-[1100px]:h-48 relative overflow-hidden bg-gray-100 shrink-0">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-white/90 text-slate-900 border-none shadow-sm backdrop-blur font-bold text-[10px]">
            {data.foodType}
          </Badge>
          {!inStock && (
            <Badge className="bg-red-500/90 text-white border-none shadow-sm backdrop-blur font-bold text-[10px]">
              Sold Out
            </Badge>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* --------------- Content Section --------------- */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div>
          <div className="flex justify-between items-start mb-2 gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1 truncate">
                {data.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <FaUtensils className="text-primary/60" /> {data.category}
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-slate-900">₹{data.price}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {data.description || "No description available for this delicious item."}
          </p>
        </div>

        {/* --------------- Footer Section --------------- */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 border transition-colors ${inStock ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-200'}`}>
              <Switch
                checked={inStock}
                onCheckedChange={handleStockToggle}
                className={`scale-75 ${inStock ? '!bg-emerald-500' : '!bg-gray-300'}`}
              />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${inStock ? "text-emerald-700" : "text-gray-400"}`}>
                {inStock ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <TooltipProvider>
              {/* --------------- Edit Button --------------- */}
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-gray-200 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
                    onClick={() => navigate(`/edit-item/${data._id}`)}
                  >
                    <FaPen size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p className="font-bold">Edit Item</p></TooltipContent>
              </Tooltip>

              {/* --------------- Delete Button --------------- */}
              <AlertDialog>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full border-gray-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm group/delete"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaTrash size={14} className="group-hover/delete:animate-shake" />}
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p className="font-bold text-red-500">Delete Item</p></TooltipContent>
                </Tooltip>

                {/* --------------- Delete Modal --------------- */}
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {data.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this item? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-xl font-bold">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;

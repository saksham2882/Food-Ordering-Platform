import { FaUtensils, FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import shopApi from "../../api/shopApi";
import { setMyShopData } from "../../redux/ownerSlice";
import { toast } from "sonner";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";


const EditItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [currentItem, setCurrentItem] = useState(null)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // frontend
  const [uploadImage, setUploadImage] = useState(null);   // backend
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");

  const categories = [
    "Snacks",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "Rolls",
    "Biryani",
    "North Indian",
    "South Indian",
    "Chinese",
    "Momos",
    "Pasta",
    "Salads",
    "Desserts",
    "Ice Cream",
    "Cakes",
    "Beverages",
    "Tea & Coffee",
    "Juices",
    "Shakes",
    "Chicken",
    "Vegan",
    "Pure Veg",
    "Street Food",
    "Healthy Food",
    "Breakfast",
    "Combo Meals",
    "Other"
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }
      setUploadImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !foodType) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);
      if (uploadImage) {
        formData.append("image", uploadImage);
      }

      const data = await shopApi.editItem(itemId, formData);
      // Update shop — items will be updated automatically because we populated "items"
      dispatch(setMyShopData(data));
      toast.success("Food Item Updated");
      navigate("/home");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetItemById = async () => {
      try {
        const data = await shopApi.getItemById(itemId);
        setCurrentItem(data)
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
      }
    };
    handleGetItemById()
  }, [itemId]);

  // Update form fields when currentItem changes
  useEffect(() => {
    if (currentItem) {
      setName(currentItem?.name || "")
      setCategory(currentItem?.category || "")
      setFoodType(currentItem?.foodType || "veg")
      setPrice(currentItem?.price || "")
      setImagePreview(currentItem?.image || null)
    }
  }, [currentItem])


  return (
    <OwnerLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
        <div className="max-w-xl w-full bg-white shadow-2xl shadow-slate-400/50 rounded-3xl p-8 border border-gray-100 relative animate-in fade-in zoom-in-95 duration-500">

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="absolute top-6 left-6 text-gray-400 hover:text-primary hover:bg-orange-50 rounded-full h-10 w-10 transition-colors"
          >
            <ArrowLeft size={28} />
          </Button>

          <div className="text-center mb-10 mt-2">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25 transform">
              <FaUtensils className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Item</h2>
            <p className="text-gray-500 font-medium">Update details for {name}</p>
          </div>

          {/* ----------- Form ----------- */}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* -------- Name -------- */}
            <Field>
              <FieldLabel className="font-bold text-gray-700">Item Name</FieldLabel>
              <Input
                type="text"
                placeholder="Ex. Chicken Biryani"
                className="h-12 rounded-xl text-base bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium py-3"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Field>

            {/* ---------- Image Upload --------- */}
            <Field>
              <FieldLabel className="font-bold text-gray-700">Food Image</FieldLabel>
              <div className="border-2 border-dashed border-gray-200 bg-gray-50/30 rounded-2xl p-4 hover:bg-gray-50 hover:border-primary/40 transition-all cursor-pointer relative group text-center min-h-[200px] flex flex-col items-center justify-center overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={handleImage}
                />

                {!imagePreview ? (
                  <div className="space-y-3 z-10 p-6">
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-primary">
                      <FaCloudUploadAlt className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-[2px]">
                      <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full border border-white/20">Change Image</span>
                    </div>
                  </>
                )}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-5">
              {/* -------- Price -------- */}
              <Field>
                <FieldLabel className="font-bold text-gray-700">Price (₹)</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  placeholder="0.00"
                  className="h-12 rounded-xl text-base bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary font-medium"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </Field>

              {/* -------- Food Type -------- */}
              <Field>
                <FieldLabel className="font-bold text-gray-700">Type</FieldLabel>
                <Select value={foodType} onValueChange={setFoodType}>
                  <SelectTrigger className="p-6 rounded-xl bg-gray-50/50 border-gray-200 focus:ring-primary/20 font-medium">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg" className="font-medium text-green-600 focus:text-green-700">Veg</SelectItem>
                    <SelectItem value="non-veg" className="font-medium text-red-600 focus:text-red-700">Non-Veg</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* -------- Food Category -------- */}
            <Field>
              <FieldLabel className="font-bold text-gray-700">Category</FieldLabel>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="p-6 rounded-xl bg-gray-50/50 border-gray-200 focus:ring-primary/20 font-medium">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {categories.map((cate, index) => (
                    <SelectItem value={cate} key={index} className="font-medium cursor-pointer">
                      {cate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* ------------ Save Button ------------ */}
            <Button
              className="w-full h-14 rounded-xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 mt-4"
              disabled={loading}
              type="submit"
            >
              {loading ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : "Update Item"}
            </Button>
          </form>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default EditItem;

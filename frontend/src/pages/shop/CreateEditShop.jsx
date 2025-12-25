import { FaStore, FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import shopApi from "../../api/shopApi";
import { setMyShopData } from "../../redux/ownerSlice";
import { toast } from "sonner";
import OwnerLayout from "@/components/layouts/OwnerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(myShopData?.address || currentAddress || "");
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [imagePreview, setImagePreview] = useState(myShopData?.image || null);    // frontend
  const [uploadImage, setUploadImage] = useState(null);                           // backend
  const [loading, setLoading] = useState(false);

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
    if (!name || !city || !state || !address) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (uploadImage) {
        formData.append("image", uploadImage);
      }
      const data = await shopApi.createEditShop(formData);
      dispatch(setMyShopData(data))
      toast.success(!myShopData ? "Shop Created Successfully" : "Shop Updated Successfully")
      navigate("/home")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  };

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
              <FaStore className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {myShopData ? "Edit Shop" : "Create Shop"}
            </h2>
            <p className="text-gray-500 font-medium">Manage your restaurant details</p>
          </div>

          {/* ----------- Form ----------- */}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* -------- Name -------- */}
            <Field>
              <FieldLabel className="font-bold text-gray-700">Shop Name</FieldLabel>
              <Input
                type="text"
                placeholder="Ex. The Burger Joint"
                className="h-12 rounded-xl text-base bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium py-3"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Field>

            {/* ---------- Image Upload --------- */}
            <Field>
              <FieldLabel className="font-bold text-gray-700">Shop Banner</FieldLabel>
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
                      <p className="text-sm font-bold text-slate-900">Click to upload banner</p>
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
                      <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full border border-white/20">Change Banner</span>
                    </div>
                  </>
                )}
              </div>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* --------- City --------- */}
              <Field>
                <FieldLabel className="font-bold text-gray-700">City</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter city"
                  className="h-12 rounded-xl text-base bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary font-medium"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                />
              </Field>

              {/* -------- State ----------- */}
              <Field>
                <FieldLabel className="font-bold text-gray-700">State</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter state"
                  className="h-12 rounded-xl text-base bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary font-medium"
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                />
              </Field>
            </div>

            {/* ------------- Address ------------- */}
            <Field>
              <FieldLabel className="font-bold text-gray-700">Full Address</FieldLabel>
              <Input
                type="text"
                placeholder="Shop No, Street, Landmark"
                className="h-12 rounded-xl text-base bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary font-medium"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </Field>

            {/* ------------ Save Button ------------ */}
            <Button
              className="w-full h-14 rounded-xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 mt-4"
              disabled={loading}
              type="submit"
            >
              {loading ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : (myShopData ? "Save Changes" : "Create Shop")}
            </Button>
          </form>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default CreateEditShop;

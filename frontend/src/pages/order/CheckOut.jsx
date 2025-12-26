import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline, IoWalletOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { MdDeliveryDining, MdPayment } from "react-icons/md";
import { TbCurrentLocation } from "react-icons/tb";
import { FaUser, FaPhone, FaHouse, FaRegMap } from "react-icons/fa6";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../../redux/mapSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { addMyOrder, clearCart } from "../../redux/userSlice";
import cityApi from "../../api/cityApi";
import orderApi from "../../api/orderApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import UserLayout from "../../components/layouts/UserLayout";


// Recenter Map Component
const RecenterMap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location.lat && location.lon) {
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);
  return null;
};


const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [addressDetails, setAddressDetails] = useState({
    houseNo: "",
    landmark: "",
    street: "",
    mobile: ""
  });

  const DELIVERY_FEE = 40;
  const TAX_RATE = 0.05;
  const taxes = Math.round(totalAmount * TAX_RATE);
  const finalTotal = totalAmount + DELIVERY_FEE + taxes;

  // Initial Data Load
  useEffect(() => {
    if (userData) {
      setAddressDetails(prev => ({
        ...prev,
        mobile: userData.mobile || "",
        street: address || ""
      }));
      setPageLoading(false);
    }
  }, [userData, address]);


  // Update specific address field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails(prev => ({ ...prev, [name]: value }));
  };

  // Map Drag Handler
  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const data = await cityApi.getReverseGeocoding(lat, lng);
      const result = data?.results?.[0];
      if (!result) {
        toast.error("Could not determine address for this location");
        return;
      }
      const formattedAddress = result.formatted || result.address_line2;
      dispatch(setAddress(formattedAddress));
      setAddressDetails(prev => ({ ...prev, street: formattedAddress }));
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentLocation = () => {
    if (userData?.location?.coordinates) {
      const lat = userData.location.coordinates[1];
      const lng = userData.location.coordinates[0];
      dispatch(setLocation({ lat, lon: lng }));
      getAddressByLatLng(lat, lng);
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const data = await cityApi.getForwardGeocoding(addressDetails.street);
      const { lat, lon } = data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.error(error);
      toast.error("Address not found on map");
    }
  };

  // Form Validation
  const validateForm = () => {
    if (!addressDetails.street) return "Please enter a delivery address";
    if (!addressDetails.houseNo) return "House or Flat number is required";
    if (!addressDetails.mobile || !/^\d{10}$/.test(addressDetails.mobile)) return "Valid 10-digit mobile number is required";
    return null;
  };


  // Place Order
  const handlePlaceOrder = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    // Combine fields for backend
    const fullAddress = `${addressDetails.houseNo}, ${addressDetails.street}${addressDetails.landmark ? `, Near ${addressDetails.landmark}` : ''}, Phone: ${addressDetails.mobile}`;

    try {
      const data = await orderApi.placeOrder({
        paymentMethod,
        deliveryAddress: {
          text: fullAddress,
          latitude: location.lat,
          longitude: location.lon,
        },
        totalAmount: finalTotal,
        cartItems,
      });

      if (paymentMethod === "COD") {
        dispatch(addMyOrder(data.newOrder));
        dispatch(clearCart());
        toast.success(data.message || "Order Placed Successfully");
        navigate("/order-placed", { state: { order: data.newOrder } });
      } else {
        openRazorpayWindow(data.orderId, data.razorOrder);
      }

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Razorpay Payment
  const openRazorpayWindow = (orderId, razorOrder) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway not available. Please try again.");
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "FoodXpress",
      description: "Food Delivery",
      order_id: razorOrder.id,
      handler: (response) => verifyPayment(response, orderId),
      prefill: {
        name: userData?.name,
        contact: addressDetails.mobile,
      },
      theme: {
        color: "#F97316"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  // Verify Payment
  const verifyPayment = async (response, orderId) => {
    try {
      const data = await orderApi.verifyPayment({
        razorpay_payment_id: response.razorpay_payment_id,
        orderId
      });
      dispatch(addMyOrder(data.newOrder));
      dispatch(clearCart());
      toast.success("Payment Successful! Order Placed.");
      navigate("/order-placed", { state: { order: data.newOrder } });
    } catch (error) {
      console.error(error);
      toast.error("Payment verification failed");
    }
  };

  // Skeleton Loading
  if (pageLoading) {
    return (
      <UserLayout>
        <div className="max-w-7xl mx-auto p-4 space-y-8">
          <div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-8 w-40" /></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in-50 duration-700 pb-20 pt-4">

        {/* ------------ Header ------------ */}
        <div className="flex items-center gap-4 px-4 sm:px-0">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={() => navigate(-1)}>
            <IoIosArrowRoundBack className="size-7 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
            <p className="text-gray-500 font-medium">Review & complete your order</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start px-4 sm:px-0">

          {/* ------------ Left Side: Details ------------ */}
          <div className="lg:col-span-2 space-y-8">

            {/* ------------ 1. Contact & Personal Details ------------ */}
            <Card className="border-none shadow-lg shadow-gray-100 ring-1 ring-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FaUser className="text-primary size-5" /> Contact Details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* ------------ Full Name ------------ */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400 size-4" />
                      <Input id="name" value={userData?.fullName} readOnly className="pl-9 bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  {/* ------------ Mobile Number ------------ */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-3 text-gray-400 size-4" />
                      <Input
                        id="mobile"
                        name="mobile"
                        value={addressDetails.mobile}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className="pl-9 border-gray-200 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ------------ 2. Delivery Address ------------ */}
            <Card className="border-none shadow-lg shadow-gray-100 ring-1 ring-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <IoLocationSharp className="text-primary size-6" /> Delivery Address
                </CardTitle>
                <CardDescription>Select your exact location on the map</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* ------------ Address Forms ------------ */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <IoSearchOutline className="absolute left-3 top-3 text-gray-400 size-4" />
                      <Input
                        name="street"
                        value={addressDetails.street}
                        onChange={handleInputChange}
                        className="pl-9"
                        placeholder="Search Area / Street Name..."
                      />
                    </div>
                    <Button variant="secondary" onClick={getLatLngByAddress}>Find</Button>
                    <Button onClick={getCurrentLocation} className="gap-2 bg-blue-600 hover:bg-blue-700">
                      <TbCurrentLocation /> <span className="hidden sm:inline">My Location</span>
                    </Button>
                  </div>

                  {/* ------------ Address Forms ------------ */}
                  <div className="grid sm:grid-cols-2 gap-4">

                    {/* ------------ House / Flat No. ------------ */}
                    <div className="space-y-2">
                      <Label htmlFor="houseNo">House / Flat No. <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <FaHouse className="absolute left-3 top-3 text-gray-400 size-4" />
                        <Input
                          id="houseNo"
                          name="houseNo"
                          value={addressDetails.houseNo}
                          onChange={handleInputChange}
                          placeholder="e.g. Flat 402, Building A"
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {/* ------------ Landmark ------------ */}
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <div className="relative">
                        <FaRegMap className="absolute left-3 top-3 text-gray-400 size-4" />
                        <Input
                          id="landmark"
                          name="landmark"
                          value={addressDetails.landmark}
                          onChange={handleInputChange}
                          placeholder="e.g. Near City Mall"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ------------ Map ------------ */}
                <div className="h-[350px] w-full rounded-2xl overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-100 relative z-0">
                  <MapContainer
                    className={"w-full h-full"}
                    center={[location?.lat || 20.5937, location?.lon || 78.9629]}
                    zoom={15}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap location={location} />

                    {location?.lat && (
                      <Marker
                        position={[location.lat, location.lon]}
                        draggable
                        eventHandlers={{ dragend: onDragEnd }}
                      >
                        <Popup>Delivery Location</Popup>
                      </Marker>
                    )}
                  </MapContainer>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg text-xs text-center border border-gray-200 shadow-sm z-[400] pointer-events-none">
                    Drag the marker to pinpoint your exact delivery location.
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* ------------ 3. Payment Method ------------ */}
            <Card className="border-none shadow-lg shadow-gray-100 ring-1 ring-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MdPayment className="text-primary size-6" /> Payment Method
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ------------- COD Option ------------- */}
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "COD"
                      ? "border-primary bg-orange-50/50 shadow-md shadow-orange-100"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50 bg-white"
                      }`}
                  >
                    <div className={`p-3 rounded-full shrink-0 ${paymentMethod === "COD" ? "bg-white text-primary shadow-sm" : "bg-green-100 text-green-600"}`}>
                      <MdDeliveryDining className="size-6" />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Pay in cash when order arrives</p>
                    </div>
                    {paymentMethod === "COD" && <div className="absolute top-4 right-4 h-4 w-4 bg-primary rounded-full ring-4 ring-orange-100" />}
                  </div>

                  {/* ------------- Online Option ------------- */}
                  <div
                    onClick={() => setPaymentMethod("Online")}
                    className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "Online"
                      ? "border-primary bg-orange-50/50 shadow-md shadow-orange-100"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50 bg-white"
                      }`}
                  >
                    <div className={`p-3 rounded-full shrink-0 ${paymentMethod === "Online" ? "bg-white text-primary shadow-sm" : "bg-purple-100 text-purple-600"}`}>
                      <IoWalletOutline className="size-6" />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">Pay Online</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">UPI, Cards, Netbanking</p>
                    </div>
                    {paymentMethod === "Online" && <div className="absolute top-4 right-4 h-4 w-4 bg-primary rounded-full ring-4 ring-orange-100" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* ------------- Right Side: Summary Sticky ------------- */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <Card className="border-none shadow-2xl shadow-gray-200 bg-white ring-1 ring-gray-100 overflow-hidden">

              {/* ----------- Header ----------- */}
              <div className="bg-gray-50/50 p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  Order Summary <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{cartItems.length} items</span>
                </h3>
              </div>

              <CardContent className="p-0">
                {/* ----------- Detailed Item List ----------- */}
                <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar bg-white">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      {/* ----------- Image ----------- */}
                      <div className="h-16 w-16 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                        <img src={item.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>

                      {/* ----------- Item Details ----------- */}
                      <div className="flex-1 py-1">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>

                        {/* ----------- Quantity ----------- */}
                        <div className="flex justify-between items-center mt-2">
                          <div className="bg-gray-50 px-2 py-0.5 rounded text-gray-600 font-medium text-xs">Qty: {item.quantity}</div>
                          {/* ----------- Price ----------- */}
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 line-through mr-2">₹{Math.round(item.price * item.quantity * 1.4)}</span>
                            <span className="font-bold text-gray-900 text-sm">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* ------------- Bill Details ------------- */}
                <div className="p-6 space-y-3 bg-gray-50/30">
                  {/* ------------- Item Total ------------- */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Item Total</span>
                    <span className="font-semibold text-gray-900">
                      ₹{totalAmount}
                    </span>
                  </div>
                  {/* ------------- Delivery Fee ------------- */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">Delivery Fee <IoShieldCheckmarkOutline className="text-green-500" /></span>
                    <span className="font-semibold text-green-600">
                      {DELIVERY_FEE === 0 ? "FREE" : `₹${DELIVERY_FEE}`}
                    </span>
                  </div>

                  {/* ------------- GST & Restaurant Charges (5%) ------------- */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST & Restaurant Charges (5%)</span>
                    <span className="font-semibold text-gray-900">
                      ₹{taxes}
                    </span>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* ------------- Total ------------- */}
                <div className="p-6 bg-white space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Grand Total</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{finalTotal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider bg-green-50 px-2 py-1 rounded">Saved ₹{(totalAmount * 0.4).toFixed(0)}</p>
                    </div>
                  </div>

                  {/* ------------- Place Order Button ------------- */}
                  <Button
                    className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 hover:bg-orange-600 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? <ClipLoader size={24} color="white" /> : "Place Order"}
                  </Button>

                  <p className="text-[11px] text-center text-gray-400 font-medium max-w-[80%] mx-auto">
                    By placing an order, you agree to our Terms and Conditions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default CheckOut;

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeftLong, FaReceipt } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card as SCard, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UserLayout from "../../components/layouts/UserLayout";
import Card from "../../components/Card";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const DELIVERY_FEE = 40;
  const TAX_RATE = 0.05;    // 5 percent
  const taxes = Math.round(totalAmount * TAX_RATE);
  const finalTotal = totalAmount + DELIVERY_FEE + taxes;

  // --------- Empty Cart ----------
  if (cartItems?.length === 0) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-in fade-in-50">
          <div className="bg-orange-50 p-8 rounded-full">
            <span className="text-6xl">🥣</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-gray-500 max-w-sm">
              Looks like you haven't added anything to your cart yet. Go ahead and explore our top categories.
            </p>
          </div>
          <Button
            onClick={() => navigate("/home")}
            className="rounded-full px-8 h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Browse Restaurants
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 mt-6">

        {/* --------- Header --------- */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={() => navigate(-1)}>
            <FaArrowLeftLong className="size-5 text-gray-700" />
          </Button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Cart</h1>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 px-3 py-1 text-sm">
            {cartItems.length} items
          </Badge>
        </div>

        {/* --------- Cart Info --------- */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* -------- Left Side (items) -------- */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} data={item} />
            ))}
          </div>

          {/* -------- Right Side (summary) -------- */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <SCard className="border-none shadow-xl shadow-gray-200/50 bg-white ring-1 ring-gray-100">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <FaReceipt className="text-gray-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Bill Details</h2>
                </div>

                {/* --------- Bill Details --------- */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Item Total</span>
                    <span className="font-semibold text-gray-900">
                      ₹{totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-gray-900">
                      ₹{DELIVERY_FEE}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST & Charges (5%)</span>
                    <span className="font-semibold text-gray-900">
                      ₹{taxes}
                    </span>
                  </div>

                  <Separator className="my-2" />

                  {/* --------- Total Amount --------- */}
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-900">To Pay</span>
                    <span className="font-black text-2xl text-primary">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* --------- Promo Code --------- */}
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Promo Code</label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter code" className="bg-white" />
                    <Button variant="outline" className="font-bold border-gray-300">Apply</Button>
                  </div>
                </div>

                {/* --------- Checkout Button --------- */}
                <Button
                  className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-orange-600 active:scale-[0.98] transition-all"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-center text-gray-400 font-medium">
                  Review your order carefully before payment.
                </p>
              </CardContent>
            </SCard>
          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default CartPage;

import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import Card from "../components/Card";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-bg flex justify-center p-6">
      <div className="w-full max-w-[800px]">
        {/* ----------- back button and heading ---------- */}
        <div className="flex items-center gap-[20px] mb-6">
          <div className=" z-[10] cursor-pointer" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-start">Your Cart</h1>
        </div>

        {/* -------------- Cart Items -------------- */}
        {cartItems?.length == 0 ? (
          <p className="text-gray-500 text-lg text-center">
            Your Cart is Empty
          </p>
        ) : (
          <>
            {/* ----------- Card ------------ */}
            <div className="space-y-4">
              {cartItems?.map((item, index) => (
                <Card data={item} key={index} />
              ))}
            </div>

            {/* ------------ Total Amount ------------ */}
            <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border">
              <h1 className="text-lg font-semibold">Total Amount</h1>
              <span className="text-xl font-bold text-primary">
                ₹{totalAmount}.00
              </span>
            </div>

            {/* -------------- Checkout Button ------------ */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-hover transition-all cursor-pointer"
                onClick={() => navigate("/checkout")}
              >
                Proceed to checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default CartPage;

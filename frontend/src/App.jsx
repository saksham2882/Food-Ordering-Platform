import { Navigate, Route, Routes } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import SignIn from "./pages/auth/SignIn"
import ForgotPassword from "./pages/auth/ForgotPassword"
import { Toaster } from "sonner"
import useGetCurrentUser from "./hooks/useGetCurrentUser"
import { useDispatch, useSelector } from "react-redux"
import Home from "./pages/Home"
import CreateEditShop from "./pages/shop/CreateEditShop"
import AddItem from "./pages/shop/AddItem"
import EditItem from "./pages/shop/EditItem"
import CartPage from "./pages/order/CartPage"
import CheckOut from "./pages/order/CheckOut"
import OrderPlaced from "./pages/order/OrderPlaced"
import MyOrders from "./pages/order/MyOrders"
import TrackOrderPage from "./pages/order/TrackOrderPage"
import Shop from "./pages/shop/Shop"
import { useEffect } from "react"
import { io } from "socket.io-client"
import { setSocket } from "./redux/userSlice"
import LandingPage from "./pages/LandingPage"
import ProtectedLayout from "./components/layouts/ProtectedLayout"
import GuestFriendlyLayout from "./components/layouts/GuestFriendlyLayout"
import Profile from "./pages/Profile"
import ScrollToTop from "./components/ScrollToTop"

// Server URL
if (!import.meta.env.VITE_SERVER_URL) {
  throw new Error("VITE_SERVER_URL environment variable is required");
}
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const App = () => {
  useGetCurrentUser()
  const { userData, isCheckingAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  useEffect(() => {
    const socketInstance = io(SERVER_URL, { withCredentials: true })
    dispatch(setSocket(socketInstance))
    socketInstance.on("connect", () => {
      if (userData) {
        socketInstance.emit('identity', { userId: userData._id })
      }
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [userData?._id])


  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" />
      <Routes>
        {/* ----------- Public Routes ----------- */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/home"} />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to={"/home"} />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to={"/home"} />}
        />

        {/* ----------- Guest Friendly Routes ----------- */}
        <Route element={<GuestFriendlyLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/shop/:shopId" element={<Shop />} />
        </Route>

        {/* ----------- Protected Routes ----------- */}
        <Route element={<ProtectedLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-edit-shop" element={<CreateEditShop />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/edit-item/:itemId" element={<EditItem />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/order-placed" element={<OrderPlaced />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
        </Route>
      </Routes>
    </>
  )
}
export default App
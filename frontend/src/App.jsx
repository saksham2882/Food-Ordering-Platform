import { Navigate, Route, Routes } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import SignIn from "./pages/auth/SignIn"
import ForgotPassword from "./pages/auth/ForgotPassword"
import { Toaster } from "sonner"
import useGetCurrentUser from "./hooks/useGetCurrentUser"
import { useDispatch, useSelector } from "react-redux"
import Home from "./pages/Home"
import useGetCity from "./hooks/useGetCity"
import useGetMyShop from "./hooks/useGetMyShop"
import CreateEditShop from "./pages/shop/CreateEditShop"
import AddItem from "./pages/shop/AddItem"
import EditItem from "./pages/shop/EditItem"
import useGetShopByCity from "./hooks/useGetShopByCity"
import useGetItemsByCity from "./hooks/useGetItemsByCity"
import CartPage from "./pages/order/CartPage"
import CheckOut from "./pages/order/CheckOut"
import OrderPlaced from "./pages/order/OrderPlaced"
import MyOrders from "./pages/order/MyOrders"
import useGetMyOrders from "./hooks/useGetMyOrders"
import useUpdateLocation from "./hooks/useUpdateLocation"
import TrackOrderPage from "./pages/order/TrackOrderPage"
import Shop from "./pages/shop/Shop"
import { useEffect } from "react"
import { io } from "socket.io-client"
import { setSocket } from "./redux/userSlice"

if (!import.meta.env.VITE_SERVER_URL) {
  throw new Error("VITE_SERVER_URL environment variable is required");
}
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const App = () => {
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()
  useUpdateLocation()
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch()

  useEffect(() => {
    const socketInstance = io(SERVER_URL, {withCredentials: true})
    dispatch(setSocket(socketInstance))
    socketInstance.on("connect", () => {
      if(userData){
        socketInstance.emit('identity', {userId: userData._id})
      }
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [userData?._id])

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to={"/"} />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
        />
        <Route 
          path="/"
          element={userData ? <Home /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/create-edit-shop"
          element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/add-item"
          element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/edit-item/:itemId"
          element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/cart"
          element={userData ? <CartPage /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/checkout"
          element={userData ? <CheckOut /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/order-placed"
          element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/my-orders"
          element={userData ? <MyOrders /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/track-order/:orderId"
          element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/shop/:shopId"
          element={userData ? <Shop /> : <Navigate to={"/signin"} />}
        />
      </Routes>
    </>
  )
}
export default App
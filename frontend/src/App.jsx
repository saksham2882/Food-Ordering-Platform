import { Navigate, Route, Routes } from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import ForgotPassword from "./pages/ForgotPassword"
import { Toaster } from "sonner"
import useGetCurrentUser from "./hooks/useGetCurrentUser"
import { useSelector } from "react-redux"
import Home from "./pages/Home"
import useGetCity from "./hooks/useGetCity"

export const URL = "http://localhost:8000"

const App = () => {
  useGetCurrentUser()
  useGetCity()
  const { userData } = useSelector((state) => state.user);

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
      </Routes>
    </>
  )
}
export default App
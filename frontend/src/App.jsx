import { Route, Routes } from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import ForgotPassword from "./pages/ForgotPassword"
import { Toaster } from "sonner"
import useGetCurrentUser from "./hooks/useGetCurrentUser"

export const URL = "http://localhost:8000"

const App = () => {
  useGetCurrentUser()
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  )
}
export default App
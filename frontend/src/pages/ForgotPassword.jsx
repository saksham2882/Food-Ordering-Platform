import axios from "axios";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../App";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // forgot password in three step - email type, opt send, enter opt and match
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if(!email){
       toast.info("Please enter your email");
       return; 
    }
    setLoading(true)
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      setError("")
      toast.success(res.data.message || "OTP Send Successfully");
      setStep(2);
    } catch (error) {
      setError(error?.response?.data?.message || error?.message || "Something went wrong");
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally{
      setLoading(false)
    }
  };

  const handleVerifyOTP = async () => {
    if(!otp){
        toast.info("Please enter a 6-digits OTP")
        return;
    }
    setLoading(true)
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      setError("")
      toast.success(res.data.message || "OTP Verify Successfully");
      setStep(3);
    } catch (error) {
      setError(error?.response?.data?.message || error?.message || "Something went wrong");
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally{
      setLoading(false)
    }
  };

  const handleResetPassword = async () => {
    if(!newPassword || !confirmPassword){
        toast.info("Please provide all fields")
        return;
    }
    if (newPassword != confirmPassword) {
      toast.info("Confirm Password not matched")
      return null;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      setError("")
      toast.success(res.data.message || "Password Reset Successfully");
      navigate("/signin");
    } catch (error) {
      setError(error?.response?.data?.message || error?.message || "Something went wrong");
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-bg">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-6">
          <IoIosArrowRoundBack
            size={35}
            className="text-primary shadow-sm cursor-pointer hover:bg-hover rounded-full hover:text-white"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-primary">
            Forgot Password
          </h1>
        </div>

        {step == 1 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full font-medium py-2 rounded-lg transition duration-200 cursor-pointer bg-primary text-white hover:bg-hover"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>

            {error && (
              <p className="text-primary text-center my-[10px]">*{error}</p>
            )}
          </div>
        )}

        {step == 2 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                One Time Password
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter OTP here"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>

            <button
              className="w-full font-medium py-2 rounded-lg transition duration-200 cursor-pointer bg-primary text-white hover:bg-hover"
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify"}
            </button>

            {error && (
              <p className="text-primary text-center my-[10px]">*{error}</p>
            )}
          </div>
        )}

        {step == 3 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>

            <button
              className="w-full font-medium py-2 rounded-lg transition duration-200 cursor-pointer bg-primary text-white hover:bg-hover"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>

            {error && (
              <p className="text-primary text-center my-[10px]">*{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;

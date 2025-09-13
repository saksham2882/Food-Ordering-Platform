import axios from "axios";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { URL } from "../App";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // forgot password in three step - email type, opt send, enter opt and match
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      const res = await axios.post(
        `${URL}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      toast.success(res.data.message || "OTP Send Successfully");
      setStep(2);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || error.message || "Something went wrong");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post(
        `${URL}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      toast.success(res.data.message || "OTP Verify Successfully");
      setStep(3);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || error.message || "Something went wrong");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword != confirmPassword) {
        toast.info("Confirm Password not matched")
      return null;
    }
    try {
      const res = await axios.post(
        `${URL}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Password Reset Successfully");
      navigate("/signin");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || error.message || "Something went wrong");
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
              className="w-full font-medium py-2 rounded-lg transition duration-200 cursor-pointer bg-primary text-white hover:bg-hover"
              onClick={handleSendOTP}
            >
              Send OTP
            </button>
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
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter OTP here"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>

            <button
              className="w-full font-medium py-2 rounded-lg transition duration-200 cursor-pointer bg-primary text-white hover:bg-hover"
              onClick={handleVerifyOTP}
            >
              Verify
            </button>
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
              />
            </div>

            <button
              className="w-full font-medium py-2 rounded-lg transition duration-200 cursor-pointer bg-primary text-white hover:bg-hover"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;

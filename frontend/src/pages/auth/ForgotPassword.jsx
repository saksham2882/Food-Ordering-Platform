import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authApi from "../../api/authApi";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // forgot password in three step - email type, opt send, enter opt and match
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      toast.info("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.sendOtp(email);
      toast.success(data.message || "OTP Send Successfully");
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.info("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.verifyOtp(email, otp);
      toast.success(data.message || "OTP Verify Successfully");
      setStep(3);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.info("Please provide all fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.info("Confirm Password not matched");
      return null;
    }
    setLoading(true);
    try {
      const data = await authApi.resetPassword(email, newPassword);
      toast.success(data.message || "Password Reset Successfully");
      navigate("/signin");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle={
        step === 1 ? "Enter your email to receive a code" :
          step === 2 ? `Enter the code sent to ${email}` :
            "Create a new password"
      }
    >
      <div className="grid gap-6">
        {/* ------------- Step 1: Email Input ------------- */}
        {step === 1 && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <Button disabled={loading} onClick={handleSendOTP} className="w-full">
              {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
          </div>
        )}

        {/* ------------- Step 2: OTP Input ------------- */}
        {step === 2 && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-300 justify-items-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <div className="grid gap-2 w-full">
              <Button disabled={loading} onClick={handleVerifyOTP} className="w-full">
                {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={loading}
                className="w-full"
              >
                Change Email
              </Button>
            </div>
          </div>
        )}

        {/* ------------- Step 3: Reset Password ------------- */}
        {step === 3 && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button disabled={loading} onClick={handleResetPassword} className="w-full">
              {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </div>
        )}

        <div className="text-center">
          <Button variant="link" onClick={() => navigate("/signin")} className="p-0 h-auto font-normal text-muted-foreground hover:text-primary">
            <IoIosArrowRoundBack className="mr-1 h-4 w-4" />
            Back to Sign In
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;

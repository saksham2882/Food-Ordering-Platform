import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../App";
import { toast } from "sonner";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSignUp = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${URL}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      dispatch(setUserData(res.data))
      setError("")
      toast.success(res.data.message || "User Registered Successfully");
    } catch (error) {
      setError(error?.response?.data?.message || error?.message || "Something went wrong");
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally{
      setLoading(false)
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) {
      toast.info("Please enter your mobile number before proceeding");
      return null;
    }

    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    console.log(res)

    // send data to backend
    try {
      const { data } = await axios.post(
        `${URL}/api/auth/google-auth`,
        {
          fullName: res.user.displayName,
          email: res.user.email,
          role,
          mobile,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data))
      setError("");
      toast.success("User Registered Successfully");
    } catch (error) {
        setError(error?.response?.data?.message || error?.message || "Something went wrong");
        toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 bg-bg`}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] border-border`}
      >
        <h1 className={`text-3xl font-bold mb-2 text-primary`}>Tomato</h1>
        <p className="text-gray-600 mb-8">
          Create your account to get started with delicious food deliveries
        </p>

        {/* ----------- fullName ----------- */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your name"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            required
          />
        </div>

        {/* ----------- email ----------- */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        {/* ----------- mobile ----------- */}
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile no.
          </label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your mobile number"
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            required
          />
        </div>

        {/* ----------- password ----------- */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {/* ----------- role ----------- */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r, key) => (
              <button
                key={key}
                className={`flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer ${
                  role == r
                    ? "bg-primary text-white"
                    : "border-primary text-primary"
                }`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full font-medium py-2 rounded-lg transition duration-200 cursor-pointer bg-primary text-white hover:bg-hover"
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
        </button>

        {error && (
          <p className="text-primary text-center my-[10px]">*{error}</p>
        )}

        <p className="w-full mt-4 text-center font-semibold text-gray-500">
          -------------- OR --------------
        </p>

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

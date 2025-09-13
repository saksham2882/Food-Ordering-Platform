import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../App";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        `${URL}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
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
        >
          Sign Up
        </button>

        <p className="w-full mt-4 text-center font-semibold text-gray-500">
          -------------- OR --------------
        </p>

        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer">
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

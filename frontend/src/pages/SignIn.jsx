import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../App";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const res = await axios.post(
        `${URL}/api/auth/signin`,
        { email, password },
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
          Sign In to your account to get started with delicious food deliveries
        </p>

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

        <div
          className="text-right mb-4 text-primary font-medium cursor-pointer hover:text-red-700 hover:underline"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password
        </div>

        <button
          className="w-full font-medium py-2 rounded-lg transition duration-200 cursor-pointer bg-primary text-white hover:bg-hover"
          onClick={handleSignIn}
        >
          Sign In
        </button>

        <p className="w-full mt-4 text-center font-semibold text-gray-500">
          -------------- OR --------------
        </p>

        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer">
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>

        <p className="text-center mt-6">
          want to create a new account?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

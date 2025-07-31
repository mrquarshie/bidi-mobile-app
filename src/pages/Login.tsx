import React, { useState } from "react";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both Email and Password", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password }
      );

      const { access_token } = response.data;
      const payload = JSON.parse(atob(access_token.split(".")[1]));
      const role = payload.role;

      if (["OMC_ADMIN", "STATION_MANAGER", "PUMP_ATTENDANT"].includes(role)) {
        setRole(role);
        localStorage.setItem("accessToken", access_token);

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
        });

        navigate("/");
      } else {
        toast.error("Access denied. User only access.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center md:justify-end">
      {/* Background Image */}
      <img
        src="/fuel-pump.svg"
        alt="Fuel Pump"
        className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
        draggable="false"
      />

      {/* Toast Container */}
      <ToastContainer />

      {/* Login Card */}
      <Card
        className="w-full max-w-[400px] mx-4 bg-white/95 sm:mx-auto md:mr-2.5 md:h-[calc(100vh-20px)] md:flex md:items-center md:justify-center shadow-lg z-10 rounded-lg"
      >
        <CardContent className="p-4 sm:p-6 w-full max-w-[360px] mx-auto">
          {/* Logo and Welcome Text */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/bidi-logo.svg"
              alt="Bidi Logo"
              className="w-[100px] h-[70px] mb-4 object-contain select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
            />
            <h1 className="font-['Poppins',Helvetica] font-semibold text-[#00380A] text-2xl md:text-3xl tracking-tight">
              Welcome back
            </h1>
            <p className="font-['Poppins',Helvetica] text-gray-600 text-sm md:text-base mt-1">
              Login to your account
            </p>
          </div>

          {/* Login Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                className="w-full pl-10 text-black font-normal border-b border-gray-300 focus:border-[#9b9c9b] outline-none bg-transparent pb-2 placeholder-gray-400"
                placeholder="Email*"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={
                  <MailOutlined
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
                  />
                }
              />
            </div>
            <div className="relative">
              <Input
                className="w-full pl-10 text-black font-normal border-b border-gray-300 focus:border-[#9b9c9b] outline-none bg-transparent pb-2 placeholder-gray-400"
                placeholder="Password*"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={
                  <LockOutlined
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"
                  />
                }
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
            <Button
              className="cursor-pointer bg-[#064021] hover:bg-[#064021f1] text-white font-semibold py-2 rounded-md"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-center">
              <a
                href="/forgot-password"
                className="font-['Poppins',Helvetica] text-sm text-gray-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
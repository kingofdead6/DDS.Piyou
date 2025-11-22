import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email format.";
    if (!password) e.password = "Please enter your password.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });
        const { token, usertype } = response.data;
        console.log("Token received:", token);
        if (remember) {
          localStorage.setItem("token", token);
          console.log("Token saved to localStorage");
        } else {
          sessionStorage.setItem("token", token);
          console.log("Token saved to sessionStorage");
        }
        window.dispatchEvent(new Event("authChanged"));
        setErrors({});
        if (usertype === "admin" || usertype === "superadmin") {
          console.log("Navigating to /admin/dashboard");
          navigate("/admin/dashboard");
        } else {
          console.log("Navigating to /");
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ form: error.response?.data?.message || "Login failed." });
        toast.error(error.response?.data?.message || "Login failed.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      <ToastContainer />
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#1f2a2d]/90 backdrop-blur-md border border-[#3b82f6]/30 rounded-2xl p-6 shadow-xl"
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full  flex items-center justify-center text-[#1e293b] text-2xl font-bold shadow-[0_0_10px_rgba(245,214,46,0.5)]">
            <img src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1759361064/20251002_0010_Enhanced_Design_Symbol_remix_01k6h0mgarfwpb5p8s654nwy76_ywrayk.png"/>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#d1d5db]">Login</h1>
          <p className="mt-2 text-sm text-[#d1d5db]/70">Enter your credentials to continue</p>
        </div>

        {errors.form && (
          <div className="mb-4 text-sm text-[#ec4899] text-center">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#d1d5db] mb-2 font-medium">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pr-12 pl-10 py-3 rounded-lg bg-[#1f2a2d] border ${
                  errors.email ? "border-[#ec4899]" : "border-[#3b82f6]/40"
                } text-white outline-none focus:border-[#f5d62e] focus:ring-2 focus:ring-[#f5d62e]/50 transition-all`}
                placeholder="example@mail.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#d1d5db]/70">
                <FaUser />
              </div>
            </div>
            {errors.email && (
              <p id="email-error" className="mt-2 text-xs text-[#ec4899]">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#d1d5db] mb-2 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pr-12 pl-10 py-3 rounded-lg bg-[#1f2a2d] border ${
                  errors.password ? "border-[#ec4899]" : "border-[#3b82f6]/40"
                } text-white outline-none focus:border-[#f5d62e] focus:ring-2 focus:ring-[#f5d62e]/50 transition-all`}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-[#d1d5db]/70 hover:text-[#f5d62e]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#d1d5db]/70">
                <FaLock />
              </div>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-2 text-xs text-[#ec4899]">{errors.password}</p>
            )}
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className={`cursor-pointer w-full py-3 rounded-full bg-gradient-to-r from-[#f5d62e] to-[#3b82f6] text-[#1e293b] font-bold hover:from-[#ffd83b] hover:to-[#60a5fa] transition-colors disabled:opacity-60`}
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(245, 214, 46, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
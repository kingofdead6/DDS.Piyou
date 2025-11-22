import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const titleRef = useRef(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.usertype === "admin" || decoded.usertype === "superadmin") {
            setUserType(decoded.usertype);
          } else {
            toast.error("Unauthorized access.", { theme: "light" });
            navigate("/login");
          }
        } catch (error) {
          toast.error("Invalid token. Please log in again.", { theme: "light" });
          navigate("/login");
        }
      } else {
        toast.error("Please log in to access the dashboard.", { theme: "light" });
        navigate("/login");
      }
      setIsLoading(false);
    };

    const timer = setTimeout(checkToken, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Subtle floating title animation


  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully", { theme: "light" });
    navigate("/login");
  };

  const adminSections = [
    { path: "/admin/orders", title: "Manage Orders", description: "View and update order statuses" },
    { path: "/admin/products", title: "Manage Products", description: "Create, update, and delete products" },
    { path: "/admin/announcements", title: "Manage Announcements", description: "Create and manage announcements" },
    { path: "/admin/reviews", title: "Manage Reviews", description: "Moderate and respond to reviews" },
  ];

  const superadminSections = [
    ...adminSections,
    { path: "/admin/users", title: "Manage Users", description: "Create, update, and delete user accounts" },
    { path: "/admin/categories", title: "Manage Categories", description: "Add and update delivery area prices" },
    { path: "/admin/delivery-areas", title: "Manage Delivery Areas", description: "Add and update delivery area prices" },

  ];

  const sections = userType === "superadmin" ? superadminSections : adminSections;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" theme="light" autoClose={3000} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="min-h-screen py-20 mt-20"  
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              ref={titleRef}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl font-light tracking-wide text-gray-900"
            >
              Admin Dashboard
            </motion.h1>
            <p className="mt-4 text-lg text-gray-600 font-light">
              Welcome back, {userType === "superadmin" ? "Super Admin" : "Administrator"}
            </p>
          </div>

          {/* Dashboard Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link to={section.path}>
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-medium text-gray-900 group-hover:text-black transition-colors">
                        {section.title}
                      </h2>
                      <p className="mt-3 text-gray-600 font-light leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <span className="inline-flex items-center text-sm font-medium text-gray-500 group-hover:text-black transition-colors">
                        Manage
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Logout Button */}
          <div className="mt-16 text-center">
            <button
              onClick={handleLogout}
              className="px-8 py-4 border border-gray-300 bg-red-500 rounded-md text-white hover:bg-red-600 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.section>
    </>
  );
}
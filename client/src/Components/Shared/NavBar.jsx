// src/components/Navbar.jsx
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCartIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";

export default function Navbar() {
  const { lang, toggleLang } = useContext(LanguageContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userType, setUserType] = useState(null); // null | "admin" | "superadmin"
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const t = translations[lang]?.navbar || translations["fr"].navbar;
  const isRTL = lang === "ar";

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Check auth status from token
  const checkAuth = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.usertype); // "admin" or "superadmin"
      } catch {
        setUserType(null);
      }
    } else {
      setUserType(null);
    }
  };

  // Update cart count
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(total);
  };

  // Listen to auth + cart changes
  useEffect(() => {
    checkAuth();
    updateCartCount();

    const handleChange = () => {
      checkAuth();
      updateCartCount();
    };

    window.addEventListener("storage", handleChange);
    window.addEventListener("authChanged", handleChange);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("authChanged", handleChange);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserType(null);
    window.dispatchEvent(new Event("authChanged")); // Immediate update
    navigate("/login");
  };

  // Navigation items based on user role
  const normalNavItems = t.items || [];

  const adminNavItems = [
    { name: "Commandes", link: "/admin/orders" },
    { name: "Produits", link: "/admin/products" },
  ];

  const superadminNavItems = [
    ...adminNavItems.slice(0, -1), // All except logout
    { name: "Utilisateurs", link: "/admin/users" },
    { name: "Catégories", link: "/admin/categories" },
    { name: "Zones de livraison", link: "/admin/delivery-areas" },
  ];

  const navItems =
    userType === "superadmin"
      ? superadminNavItems
      : userType === "admin"
      ? adminNavItems
      : normalNavItems;

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className={`max-w-7xl mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-xl transition-all duration-300 ${
            userType ? "bg-[#4c2a00]/95 text-white" : "bg-white/20 text-[#2d2a26]"
          } shadow-lg rounded-b-2xl`}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={isRTL ? "order-3" : "order-1"}
          >
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg"
                alt="DDS Piyou Logo"
                className="h-12 w-auto rounded-full shadow-md"
              />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <ul
            className={`hidden md:flex space-x-10 font-semibold ${
              isRTL ? "space-x-reverse" : ""
            } order-2`}
          >
            {navItems.map((item, i) => {
              const isActive = location.pathname === item.link;
              return (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.link || "#"}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    className={`text-lg pb-1 transition-all ${
                      isActive
                        ? "text-white border-b-2 border-white"
                        : "hover:text-white/80"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Right Section */}
          <div className={`flex items-center gap-5 ${isRTL ? "order-1" : "order-3"}`}>
            {/* Language Switcher */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLang}
              className="bg-white/30 backdrop-blur-md px-5 py-2 rounded-full font-bold text-sm hover:bg-white/50 transition shadow-md flex items-center gap-2"
            >
              <span>{lang === "fr" ? "AR" : "FR"}</span>
              <span className="text-xl">
                {lang === "fr" ? "العربية" : "Français"}
              </span>
            </motion.button>

            {/* Cart Icon - Only for non-admins */}
            {!userType && (
              <Link to="/cart" className="relative group">
                <ShoppingCartIcon className="w-9 h-9 group-hover:text-white/80 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#4c2a00] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-3xl"
            >
              {menuOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/20 backdrop-blur-xl shadow-lg px-6 py-6 space-y-4 font-semibold text-[#2d2a26] mt-2 rounded-b-2xl"
          >
            {navItems.map((item, i) => (
              <motion.li
                key={i}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.link || "#"}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    setMenuOpen(false);
                  }}
                  className={`block text-lg py-2 transition-colors  ${
                    location.pathname === item.link
                      ? "text-[#4c2a00] font-bold"
                      : "hover:text-[#4c2a00]"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </nav>
    </>
  );
}
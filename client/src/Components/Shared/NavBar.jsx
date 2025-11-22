import { useState, useEffect } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");

  // Get current path on load
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
    { name: "Men", link: "/products/men" },
    { name: "Women", link: "/products/women" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-white/20 shadow-lg rounded-b-2xl">
        
        {/* Left: Logo */}
        <a href="/">
          <img
            src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg"
            alt="DDS Piyou Logo"
            className="h-12 w-auto rounded-full"
          />
        </a>

        {/* Center: Navigation Links */}
        <ul className="hidden md:flex space-x-10 font-semibold">
          {navItems.map((item, i) => {
            const isActive = currentPath === item.link;
            return (
              <li key={i}>
                <a
                  href={item.link}
                  className={`text-lg transition-colors ${
                    isActive
                      ? "text-[#4c2a00] border-b-2 border-[#4c2a00]"
                      : "text-[#2d2a26] hover:text-[#4c2a00]"
                  }`}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right: Cart */}
        <div className="flex items-center space-x-4">
          <a href="/cart">
            <ShoppingCartIcon className="w-8 h-8 text-[#2d2a26] hover:text-[#4c2a00] transition" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl font-bold text-[#2d2a26]"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-white/20 backdrop-blur-xl shadow-lg px-6 pb-6 space-y-4 font-semibold text-[#2d2a26]">
          {navItems.map((item, i) => {
            const isActive = currentPath === item.link;
            return (
              <li key={i}>
                <a
                  href={item.link}
                  className={`block text-lg transition-colors ${
                    isActive
                      ? "text-[#4c2a00] border-b-2 border-[#4c2a00]"
                      : "hover:text-[#4c2a00]"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}

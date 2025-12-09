// src/pages/WomenProductsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";

export default function WomenProductsPage() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].womenPage;
  const f = translations[lang].filters;
  const isRTL = lang === "ar";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(t.allShoes);
  const [maxPrice, setMaxPrice] = useState();
  const [selectedColor, setSelectedColor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const productsPerPage = 9;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories`);
        setCategories([{ _id: "all", name: t.allShoes }, ...res.data]);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, [t.allShoes]);

  // Fetch WOMEN products only
  useEffect(() => {
   const fetchWomenProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/products/featured`);
    const womenProducts = res.data.filter(p =>
      p.showOnProductsPage === true && p.gender === "female" ||p.gender === "unisex"
    );
    setProducts(womenProducts);
    setFilteredProducts(womenProducts);

    // Set maxPrice dynamically
    const prices = womenProducts.map(p => p.price);
    const maxProductPrice = Math.max(...prices, 100000);
    setMaxPrice(maxProductPrice);

    // Filter categories to only those with products
    const productCategories = Array.from(new Set(womenProducts.map(p => p.category)));
    const catRes = await axios.get(`${API_BASE_URL}/categories`);
    const filteredCategories = catRes.data.filter(cat => productCategories.includes(cat.name));
    setCategories([{ _id: "all", name: t.allShoes }, ...filteredCategories]);

  } catch (err) {
    toast.error(lang === "fr" ? "Échec du chargement" : "فشل تحميل المجموعة");
  } finally {
    setLoading(false);
  }
};

    fetchWomenProducts();
  }, [lang]);

  // Unique colors
  const uniqueColors = React.useMemo(() => {
    const colorMap = new Map();
    products.forEach(p => {
      p.availableColors?.forEach(color => {
        if (color.sizes?.some(s => s.quantity > 0)) {
          colorMap.set(color.name.toLowerCase(), {
            name: color.name,
            value: color.value || "#cccccc"
          });
        }
      });
    });
    return Array.from(colorMap.values());
  }, [products]);

  // Apply filters
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== t.allShoes) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    filtered = filtered.filter(p => p.price <= maxPrice);

    if (selectedColor) {
      filtered = filtered.filter(p =>
        p.availableColors?.some(c =>
          c.name.toLowerCase() === selectedColor.toLowerCase() &&
          c.sizes?.some(s => s.quantity > 0)
        )
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, maxPrice, selectedColor, products, t.allShoes]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const clearFilters = () => {
    setSelectedCategory(t.allShoes);
    setMaxPrice(100000);
    setSelectedColor("");
    setIsFilterOpen(false);
  };

  const hasActiveFilters = selectedCategory !== t.allShoes || maxPrice < 100000 || selectedColor;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d8cfc7] flex items-center justify-center">
        <p className="text-2xl font-light text-gray-700">{t.loading}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-20 pb-10" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900">{t.title}</h1>
          <p className="mt-2 text-lg text-gray-600">
            {t.itemsCount(filteredProducts.length)}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="max-w-7xl mx-auto px-6 mt-6 md:hidden">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-full py-4 bg-white border border-black rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {f.title || "Filters"}
            {hasActiveFilters && (
              <span className="ml-2 px-2.5 py-1 text-xs bg-black text-white rounded-full font-medium">
                {[
                  selectedCategory !== t.allShoes,
                  maxPrice < 100000,
                  !!selectedColor
                ].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="flex gap-8 lg:gap-16">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-[300px] shrink-0 space-y-10 py-4">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
                  {f.category}
                </h3>
                <ul className="space-y-3 text-sm">
                  {categories.map(cat => (
                    <li key={cat._id}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.name}
                          onChange={() => setSelectedCategory(cat.name)}
                          className="w-4 h-4 accent-black"
                        />
                        <span className="group-hover:underline underline-offset-4">
                          {cat.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
                  {f.priceUpTo}
                </h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="100"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-black h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-700">
                  <span>0 DA</span>
                  <span className="font-medium">{maxPrice.toLocaleString()} DA</span>
                </div>
              </div>

              {uniqueColors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
                    {f.color}
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {uniqueColors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(selectedColor === color.name ? "" : color.name)}
                        className={`cursor-pointer w-10 h-10 rounded-full border-4 transition-all
                          ${selectedColor === color.name
                            ? "border-black scale-110 ring-4 ring-black/20"
                            : "border-gray-300 hover:border-gray-600"
                          }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={clearFilters}
                className="cursor-pointer w-full py-3 border border-black hover:bg-black hover:text-white transition rounded font-medium"
              >
                {f.clearAll}
              </button>
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              {displayedProducts.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-2xl md:text-3xl font-light text-gray-600">{t.noProducts}</p>
                  <button onClick={clearFilters} className="mt-6 text-black underline text-lg">
                    {t.viewAll}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                    {displayedProducts.map(product => (
                      <div
                                              key={product._id}
                                              className="group relative bg-[#ffffff] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                              <Link to={`/product/${product._id}`} className="cursor-pointer block relative">
                                                <div className="aspect-square bg-gray-100 overflow-hidden">
                                                  <img
                                                    src={product.images[0]?.image || "/placeholder.jpg"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                  />
                                                </div>
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                              </Link>
                      
                                              <div className="p-2 sm:p-5 flex flex-col gap-2">
                                                <h3 className="text-sm sm:text-lg font-light text-gray-600 leading-tight line-clamp-2">
                                                  {product.name}
                                                </h3>
                                                <p className="text-md sm:text-2xl -mt-3 md:mt-0 font-light tracking-wide text-gray-800">
                                                  {product.price} DA
                                                </p>
                                                <Link to={`/product/${product._id}`} className="cursor-pointer -mt-2 md:mt-2">
                                                  <button className="cursor-pointer w-full py-2.5 sm:py-3 rounded-lg text-sm bg-[#efe5ce] font-semibold border border-gray-400 text-gray-800 hover:bg-black hover:text-white transition-all duration-300">
                                                    {t.viewDetails}
                                                  </button>
                                                </Link>
                                              </div>
                                            </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center gap-3 mt-12 flex-wrap">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="cursor-pointer px-5 py-3 border border-black disabled:opacity-40 hover:bg-black hover:text-white transition rounded"
                      >
                        {f.previous}
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                          key={n}
                          onClick={() => setCurrentPage(n)}
                          className={`cursor-pointer w-10 h-10 rounded-full text-sm font-medium transition
                            ${n === currentPage ? "bg-black text-white" : "hover:bg-gray-200"}
                          `}
                        >
                          {n}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="cursor-pointer px-5 py-3 border border-black disabled:opacity-40 hover:bg-black hover:text-white transition rounded"
                      >
                        {f.next}
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>

        {/* PREMIUM ANIMATED MOBILE FILTER DRAWER */}
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              style={{
                animation: isFilterOpen ? "fadeIn 0.4s ease-out" : "fadeOut 0.35s ease-in forwards"
              }}
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed inset-x-0 bottom-0 z-50">
              <div
                className="bg-white rounded-t-3xl shadow-2xl max-h-[88vh] overflow-y-auto"
                style={{
                  animation: isFilterOpen
                    ? "slideUpIn 0.55s cubic-bezier(0.22, 1, 0.36, 1)"
                    : "slideDownOut 0.45s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards"
                }}
              >
                {/* Drag Handle */}
                <div className="flex justify-center pt-5 pb-2">
                  <div className="w-14 h-1.5 bg-gray-300 rounded-full" />
                </div>

                <div className="p-6 pb-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-medium">{f.title || "Filters"}</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-3 hover:bg-gray-100 rounded-full transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-10">
                    {/* CATEGORY DROPDOWN */}
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gray-800">
                        {f.category}
                      </h3>
                      <div className="relative">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full appearance-none bg-white border-2 border-black rounded-xl px-5 py-4 text-base font-medium focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                        >
                          {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 end-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-gray-800">
                        {f.priceUpTo}
                      </h3>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="100"
                        value={maxPrice}
                        onChange={e => setMaxPrice(Number(e.target.value))}
                        className="w-full h-2 accent-black rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between mt-4 text-sm font-medium">
                        <span>0 DA</span>
                        <span>{maxPrice.toLocaleString()} DA</span>
                      </div>
                    </div>

                    {/* Colors */}
                    {uniqueColors.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-gray-800">
                          {f.color}
                        </h3>
                        <div className="flex gap-5 flex-wrap">
                          {uniqueColors.map(color => (
                            <button
                              key={color.name}
                              onClick={() => setSelectedColor(selectedColor === color.name ? "" : color.name)}
                              className={`w-14 h-14 rounded-full border-4 transition-all duration-200
                                ${selectedColor === color.name
                                  ? "border-black ring-4 ring-black/20 scale-110 shadow-lg"
                                  : "border-gray-300 hover:border-gray-600"
                                }`}
                              style={{ backgroundColor: color.value }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clear Button */}
                    <button
                      onClick={clearFilters}
                      className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition shadow-lg mt-8"
                    >
                      {f.clearAll}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Smooth Animations */}
        <style jsx>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
          @keyframes slideUpIn {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideDownOut {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
          }
        `}</style>
      </div>
    </>
  );
}
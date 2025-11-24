// src/pages/ProductsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";

export default function ProductsPage() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].productsPage;
  const isRTL = lang === "ar";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(t.allShoes);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [selectedColor, setSelectedColor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter panel

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

  // Fetch featured products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/featured`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        toast.error(lang === "fr" ? "Échec du chargement" : "فشل تحميل المجموعة");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [lang]);

  // Unique colors
  const uniqueColors = React.useMemo(() => {
    const colorMap = new Map();
    products.forEach(product => {
      product.availableColors?.forEach(color => {
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

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const clearFilters = () => {
    setSelectedCategory(t.allShoes);
    setMaxPrice(3000);
    setSelectedColor("");
    setIsFilterOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d8cfc7]">
        <p className="text-2xl font-light text-gray-700">
          {lang === "fr" ? "Chargement..." : "جاري التحميل..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d8cfc7] pt-20 pb-10" dir={isRTL ? "rtl" : "ltr"}>
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
          className="w-full py-4 bg-white border border-black rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {t.filters.title || "Filters"}
          {(selectedCategory !== t.allShoes || maxPrice < 3000 || selectedColor) && (
            <span className="ml-2 px-2 py-1 text-xs bg-black text-white rounded-full">
              {[
                selectedCategory !== t.allShoes,
                maxPrice < 3000,
                !!selectedColor
              ].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex gap-8 lg:gap-16">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-[300px] shrink-0 space-y-10 py-4">
            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
                {t.filters.category}
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

            {/* Price */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
                {t.filters.priceUpTo}
              </h3>
              <input
                type="range"
                min="0"
                max="3000"
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

            {/* Color */}
            {uniqueColors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
                  {t.filters.color}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {uniqueColors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(selectedColor === color.name ? "" : color.name)}
                      className={`w-10 h-10 rounded-full border-4 transition-all
                        ${selectedColor === color.name
                          ? "border-4 border-black scale-110 ring-4 ring-black/20"
                          : "border-2 border-gray-300 hover:border-gray-600"
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
              className="w-full py-3 border border-black hover:bg-black hover:text-white transition rounded font-medium"
            >
              {t.filters.clearAll}
            </button>
          </aside>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
              <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-medium">Filters</h2>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Same filters as desktop */}
                  <div className="space-y-8">
                    {/* Category */}
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                        {t.filters.category}
                      </h3>
                      {categories.map(cat => (
                        <label key={cat._id} className="flex items-center gap-3 py-3 cursor-pointer">
                          <input
                            type="radio"
                            name="mobile-category"
                            checked={selectedCategory === cat.name}
                            onChange={() => setSelectedCategory(cat.name)}
                            className="w-5 h-5 accent-black"
                          />
                          <span>{cat.name}</span>
                        </label>
                      ))}
                    </div>

                    {/* Price */}
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                        {t.filters.priceUpTo}
                      </h3>
                      <input
                        type="range"
                        min="0"
                        max="3000"
                        step="100"
                        value={maxPrice}
                        onChange={e => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-black"
                      />
                      <div className="flex justify-between mt-3 text-sm">
                        <span>0 DA</span>
                        <span className="ml-auto font-medium">{maxPrice.toLocaleString()} DA</span>
                      </div>
                    </div>

                    {/* Color */}
                    {uniqueColors.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                          {t.filters.color}
                        </h3>
                        <div className="flex gap-4 flex-wrap">
                          {uniqueColors.map(color => (
                            <button
                              key={color.name}
                              onClick={() => setSelectedColor(selectedColor === color.name ? "" : color.name)}
                              className={`w-12 h-12 rounded-full border-4 transition-all
                                ${selectedColor === color.name
                                  ? "border-black ring-4 ring-black/30 scale-110"
                                  : "border-gray-300"
                                }`}
                              style={{ backgroundColor: color.value }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={clearFilters}
                      className="w-full py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                    >
                      {t.filters.clearAll}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <main className="flex-1">
            {displayedProducts.length === 0 ? (
              <div className="text-center py-24 py-32">
                <p className="text-2xl md:text-3xl font-light text-gray-600">{t.noProducts}</p>
                <button
                  onClick={clearFilters}
                  className="mt-6 text-black underline text-lg"
                >
                  {t.viewFullCollection}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                  {displayedProducts.map(product => (
                    <div
                      key={product._id}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      <Link to={`/product/${product._id}`}>
                        <div className="aspect-square bg-gray-50 overflow-hidden">
                          <img
                            src={product.images[0]?.image || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      </Link>
                      <div className="p-6 md:p-8 space-y-3">
                        <h3 className="text-lg md:text-xl font-medium text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600">
                          {product.category} • {product.gender}
                        </p>
                        <p className="text-2xl md:text-3xl font-light">{product.price} DA</p>
                        <Link
                          to={`/product/${product._id}`}
                          className="block text-center mt-4 py-3 border border-black hover:bg-black hover:text-white transition rounded text-sm font-medium"
                        >
                          {t.viewDetails}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-3 mt-12 flex-wrap">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-5 py-3 border border-black disabled:opacity-40 hover:bg-black hover:text-white transition rounded"
                    >
                      {t.previous}
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition
                          ${n === currentPage ? "bg-black text-white" : "hover:bg-gray-200"}
                        `}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-5 py-3 border border-black disabled:opacity-40 hover:bg-black hover:text-white transition rounded"
                    >
                      {t.next}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
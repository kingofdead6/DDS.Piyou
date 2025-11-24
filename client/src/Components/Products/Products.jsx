// src/pages/ProductsPage.jsx
"use client";

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";
import { Menu, X } from "lucide-react"; // Install: npm install lucide-react

export default function ProductsPage() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].productsPage;
  const isRTL = lang === "ar";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(t.allShoes);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [selectedColor, setSelectedColor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  // Fetch products
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
    <div className="min-h-screen bg-[#d8cfc7] pt-20 pb-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center sm:text-left mb-8">
          <h1 className="text-4xl sm:text-5xl font-light tracking-wide text-gray-900">
            {t.title}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {t.itemsCount(filteredProducts.length)}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="sm:hidden mb-6">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-full py-4 bg-white border-2 border-black rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <Menu size={24} />
            {t.filters.title || "Filtres"}
            {selectedCategory !== t.allShoes || maxPrice < 3000 || selectedColor ? (
              <span className="ml-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                {(selectedCategory !== t.allShoes ? 1 : 0) + (maxPrice < 3000 ? 1 : 0) + (selectedColor ? 1 : 0)}
              </span>
            ) : null}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Filters Sidebar - Hidden on mobile, drawer */}
          <aside
            className={`fixed inset-0 z-50 bg-white lg:relative lg:inset-auto lg:z-auto lg:block transition-transform duration-300 ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            } w-full lg:w-80 lg:shrink-0`}
          >
            <div className="h-full lg:h-auto overflow-y-auto">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b lg:hidden">
                <h2 className="text-xl font-semibold">{t.filters.title}</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X size={28} />
                </button>
              </div>

              <div className="p-6 lg:p-0 space-y-10 lg:space-y-12">
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
                            onChange={() => {
                              setSelectedCategory(cat.name);
                              setIsFilterOpen(false);
                            }}
                            className="w-5 h-5 accent-black"
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
                  <div className="flex justify-between text-sm">
                    <span>0 DA</span>
                    <span className="font-bold">{maxPrice.toLocaleString()} DA</span>
                  </div>
                </div>

                {/* Color */}
                {uniqueColors.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
                      {t.filters.color}
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-4">
                      {uniqueColors.map(color => (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(selectedColor === color.name ? "" : color.name);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full aspect-square rounded-full border-4 transition-all shadow-md
                            ${selectedColor === color.name
                              ? "border-black scale-110 ring-4 ring-black/20"
                              : "border-gray-300 hover:border-gray-500"
                            }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory(t.allShoes);
                    setMaxPrice(3000);
                    setSelectedColor("");
                    setIsFilterOpen(false);
                  }}
                  className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 transition"
                >
                  {t.filters.clearAll}
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Products Grid */}
          <main className="flex-1">
            {displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl font-light text-gray-600 mb-6">{t.noProducts}</p>
                <button
                  onClick={() => {
                    setSelectedCategory(t.allShoes);
                    setMaxPrice(3000);
                    setSelectedColor("");
                  }}
                  className="text-black underline text-lg"
                >
                  {t.viewFullCollection}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {displayedProducts.map(product => (
                    <div
                      key={product._id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                    >
                      <Link to={`/product/${product._id}`}>
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={product.images[0]?.image || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      </Link>
                      <div className="p-4 sm:p-6 space-y-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm sm:text-base">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {product.category}
                        </p>
                        <p className="text-xl sm:text-2xl font-light">{product.price} DA</p>
                        <Link
                          to={`/product/${product._id}`}
                          className="block mt-4 text-center py-3 border border-black text-xs sm:text-sm font-medium hover:bg-black hover:text-white transition rounded"
                        >
                          {t.viewDetails}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center gap-3 mt-12">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-5 py-3 border border-black disabled:opacity-40 hover:bg-black hover:text-white transition rounded text-sm"
                    >
                      ← {t.previous}
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage > totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                      if (page < 1 || page > totalPages) return null;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-full text-sm font-medium transition ${
                            page === currentPage ? "bg-black text-white" : "hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-5 py-3 border border-black disabled:opacity-40 hover:bg-black hover:text-white transition rounded text-sm"
                    >
                      {t.next} →
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
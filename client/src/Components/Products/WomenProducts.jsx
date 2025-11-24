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
  const f = translations[lang].filters; // shared filter translations
  const isRTL = lang === "ar";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch WOMEN products only
  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/featured`);
        const womenProducts = res.data.filter(p =>
          p.showOnProductsPage === true && p.gender === "female"
        );
        setProducts(womenProducts);
        setFilteredProducts(womenProducts);
      } catch (err) {
        toast.error(lang === "fr" ? "Échec du chargement" : "فشل تحميل المجموعة");
      } finally {
        setLoading(false);
      }
    };
    fetchWomenProducts();
  }, [lang]);

  // Dynamic unique colors
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d8cfc7] flex items-center justify-center">
        <p className="text-3xl font-light text-gray-700">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d8cfc7] pt-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <h1 className="text-5xl font-light tracking-wide text-gray-900">{t.title}</h1>
        <p className="mt-3 text-lg text-gray-600">
          {t.itemsCount(filteredProducts.length)}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex gap-16">
        {/* Filters Sidebar */}
        <aside className="w-[300px] shrink-0 space-y-12 py-8">
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

          {uniqueColors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-black pb-3">
                {f.color}
              </h3>
              <div className="flex gap-4 flex-wrap">
                {uniqueColors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(selectedColor === color.name ? "" : color.name)}
                    className={`current-pointer relative w-12 h-12 rounded-full border-4 transition-all shadow-lg
                      ${selectedColor === color.name
                        ? "border-black scale-110 ring-4 ring-black/30"
                        : "border-gray-300 hover:border-gray-500"
                      }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setSelectedCategory(t.allShoes);
              setMaxPrice(3000);
              setSelectedColor("");
            }}
            className="current-pointer w-full py-3 border border-black hover:bg-black hover:text-white transition rounded font-medium"
          >
            {f.clearAll}
          </button>
        </aside>

        {/* Products Grid */}
        <main className="flex-1 py-8">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-3xl font-light text-gray-600">{t.noProducts}</p>
              <button
                onClick={() => {
                  setSelectedCategory(t.allShoes);
                  setMaxPrice(3000);
                  setSelectedColor("");
                }}
                className="current-pointer mt-6 text-black underline text-lg"
              >
                {t.viewAll}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                {displayedProducts.map(product => (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    <Link to={`/product/${product._id}`}>
                      <div className="current-pointer aspect-square bg-gray-50 overflow-hidden">
                        <img
                          src={product.images[0]?.image || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </Link>
                    <div className="p-8 space-y-4">
                      <h3 className="text-xl font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="text-3xl font-light">{product.price} DA</p>
                      <Link
                        to={`/product/${product._id}`}
                        className="current-pointer block text-center mt-6 py-3 border border-black hover:bg-black hover:text-white transition rounded text-sm font-medium"
                      >
                        {t.viewDetails}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-20 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="current-pointer px-6 py-3 border border-black disabled:opacity-40 hover:bg-black hover:text-white transition rounded"
                  >
                    {f.previous}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`current-pointer w-12 h-12 rounded-full text-sm font-medium transition
                        ${n === currentPage ? "bg-black text-white" : "hover:bg-gray-200"}
                      `}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="current-pointer px-6 py-3 border border-black disabled:opacity-40 hover:bg-black hover:text-white transition rounded"
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
  );
}
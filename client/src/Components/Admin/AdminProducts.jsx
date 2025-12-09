"use client";

import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Search, X, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";

const MAX_IMAGES = 4;

export default function AdminProducts() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].adminProducts;
  const isRTL = lang === "ar";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    name: "", category: "", price: "", gender: "unisex",
    availableColors: [], images: [],
    showOnProductsPage: false, showOnTrendingPage: false,
    showOnBestOffersPage: false, showOnSpecialsPage: false,
  });

  const [customColorName, setCustomColorName] = useState("");
  const [customColorValue, setCustomColorValue] = useState("#000000");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } });
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/products/admin-products`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (err) {
      toast.error(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name.trim()) return toast.error(t.required);
    if (!form.category) return toast.error(t.required);
    if (!form.price || form.price < 0) return toast.error(t.required);
    if (form.availableColors.length === 0) return toast.error(t.atLeastOneColor);
    if (form.availableColors.some(c => c.sizes.length === 0)) return toast.error(t.atLeastOneSize);

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("gender", form.gender);
    formData.append("availableColors", JSON.stringify(
      form.availableColors.map(c => ({
        name: c.name.trim(),
        value: c.value,
        sizes: c.sizes.map(s => ({ size: s.size.trim(), quantity: Number(s.quantity) || 0 }))
      }))
    ));
    ["showOnProductsPage", "showOnTrendingPage", "showOnBestOffersPage", "showOnSpecialsPage"].forEach(key => {
      formData.append(key, form[key]);
    });
    form.images.forEach(file => formData.append("images", file));

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (editingId) {
        await axios.put(`${API_BASE_URL}/products/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success(t.productUpdated);
      } else {
        await axios.post(`${API_BASE_URL}/products`, formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success(t.productCreated);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "", category: "", price: "", gender: "unisex",
      availableColors: [], images: [],
      showOnProductsPage: false, showOnTrendingPage: false,
      showOnBestOffersPage: false, showOnSpecialsPage: false,
    });
    setCustomColorName("");
    setCustomColorValue("#000000");
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      gender: product.gender || "unisex",
      availableColors: product.availableColors.map(c => ({
        name: c.name,
        value: c.value,
        sizes: c.sizes.map(s => ({ size: s.size, quantity: s.quantity.toString() }))
      })),
      images: [],
      showOnProductsPage: !!product.showOnProductsPage,
      showOnTrendingPage: !!product.showOnTrendingPage,
      showOnBestOffersPage: !!product.showOnBestOffersPage,
      showOnSpecialsPage: !!product.showOnSpecialsPage,
    });
    setShowModal(true);
  };

  const handleToggleVisibility = async (id, field) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const endpoints = {
      showOnProductsPage: "toggle-products-page",
      showOnTrendingPage: "toggle-trending-page",
      showOnBestOffersPage: "toggle-best-offers-page",
      showOnSpecialsPage: "toggle-specials-page"
    };

    const res = await axios.patch(
      `${API_BASE_URL}/products/${id}/${endpoints[field]}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update products array
    setProducts(prev => prev.map(p => p._id === id ? res.data : p));

    // Update selectedProduct if it's the same product being viewed
    setSelectedProduct(prev => prev?._id === id ? res.data : prev);

    toast.success(t.visibilityUpdated);
  } catch (err) {
    toast.error(t.errorGeneric);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success(t.productDeleted);
    } catch (err) {
      toast.error(t.errorGeneric);
    }
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-8 px-4 mt-14"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-wider text-gray-900">
              {t.title}
            </h1>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="cursor-pointer flex items-center justify-center gap-3 px-6 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition shadow-lg text-lg"
            >
              <Plus size={24} /> {t.addProduct}
            </button>

            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search size={20} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:border-black outline-none text-base"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-5 py-4 border border-gray-300 rounded-2xl focus:border-black outline-none bg-white text-base font-medium"
              >
                <option value="">{t.allCategories}</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20 text-2xl text-gray-500">{t.loading}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl sm:text-3xl text-gray-400 font-light mb-6">{t.noProducts}</p>
              <button onClick={() => setShowModal(true)} className="cursor-pointer text-lg text-black underline font-medium">
                {t.addFirst}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredProducts.map(product => (
                <motion.div
                  key={product._id}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden cursor-pointer transition-all"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={product.images[0]?.image || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{product.category}</p>
                    <p className="text-lg font-semibold mt-2">{product.price} DA</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <Modal onClose={() => setSelectedProduct(null)} title={selectedProduct.name}>
              <div className="grid md:grid-cols-2 gap-8">
                <img
                  src={selectedProduct.images[0]?.image || "/placeholder.jpg"}
                  alt={selectedProduct.name}
                  className="w-full rounded-2xl shadow-lg object-cover"
                />
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600">{t.category}</p>
                    <p className="text-xl font-bold">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.gender}</p>
                    <p className="text-xl font-bold capitalize">
                      {selectedProduct.gender === "male" ? t.male : selectedProduct.gender === "female" ? t.female : t.unisex}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.price}</p>
                    <p className="text-3xl font-light">{selectedProduct.price} DA</p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => { handleEdit(selectedProduct); setSelectedProduct(null); }}
                      className="cursor-pointer flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                      <Edit size={20} /> {t.editProduct}
                    </button>
                    <button
                      onClick={() => { handleDelete(selectedProduct._id); setSelectedProduct(null); }}
                      className="cursor-pointer flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} /> {t.deleteProduct}
                    </button>
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    {[
                      { label: t.productsPage, field: "showOnProductsPage" },
                      { label: t.trending, field: "showOnTrendingPage" },
                      { label: t.bestOffers, field: "showOnBestOffersPage" },
                      { label: t.specials, field: "showOnSpecialsPage" }
                    ].map(({ label, field }) => (
                      <button
                        key={field}
                        onClick={() => handleToggleVisibility(selectedProduct._id, field)}
                        className={`cursor-pointer w-full py-4 px-4 rounded-xl font-medium flex items-center justify-between transition ${
                          selectedProduct[field]
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span>{t.showOn} {label}</span>
                        {selectedProduct[field] ? <Eye size={24} /> : <EyeOff size={24} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Add/Edit Product Modal */}
        <AnimatePresence>
          {showModal && (
            <Modal onClose={resetForm} title={editingId ? t.editProduct : t.addProduct}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label={t.productName} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  <Select label={t.category} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="">{t.selectCategory}</option>
                    {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                  </Select>
                  <Input label={t.price} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required min="0" />
                  <Select label={t.gender} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="unisex">{t.unisex}</option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                  </Select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "showOnProductsPage", label: t.productsPage },
                    { key: "showOnTrendingPage", label: t.trending },
                    { key: "showOnBestOffersPage", label: t.bestOffers },
                    { key: "showOnSpecialsPage", label: t.specials }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} className="w-6 h-6 rounded accent-black" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Colors & Sizes */}
                <div className="space-y-6 p-6 bg-gray-50 ">
                  <h3 className="text-lg font-bold">{t.colorsAndSizes}</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input placeholder={t.colorName} value={customColorName} onChange={e => setCustomColorName(e.target.value)} />
                    <input type="color" value={customColorValue} onChange={e => setCustomColorValue(e.target.value)} className="w-20 h-20 rounded-full cursor-pointer" />
                    <button type="button" onClick={() => {
                      if (!customColorName.trim()) return toast.error(t.required);
                      setForm({ ...form, availableColors: [...form.availableColors, { name: customColorName.trim(), value: customColorValue, sizes: [] }] });
                      setCustomColorName("");
                    }} className="cursor-pointer px-6  bg-black text-white rounded-xl font-medium hover:bg-gray-800">
                      {t.addColor}
                    </button>
                  </div>

                  {form.availableColors.map((color, colorIdx) => (
                    <div key={colorIdx} className="p-5 bg-white rounded-xl shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl shadow" style={{ backgroundColor: color.value }} />
                          <p className="font-bold">{color.name}</p>
                        </div>
                        <button type="button" onClick={() => setForm({ ...form, availableColors: form.availableColors.filter((_, i) => i !== colorIdx) })} className="cursor-pointer text-red-600">
                          <Trash2 size={20} />
                        </button>
                      </div>
                      {color.sizes.map((size, sizeIdx) => (
                        <div key={sizeIdx} className="flex gap-3 mb-3 items-center">
                          <input type="text" placeholder={t.size} value={size.size} onChange={e => {
                            const updated = [...form.availableColors];
                            updated[colorIdx].sizes[sizeIdx].size = e.target.value;
                            setForm({ ...form, availableColors: updated });
                          }} className="flex-1 px-4 py-3 border rounded-xl text-sm" />
                          <input type="number" placeholder={t.quantity} value={size.quantity} onChange={e => {
                            const updated = [...form.availableColors];
                            updated[colorIdx].sizes[sizeIdx].quantity = e.target.value;
                            setForm({ ...form, availableColors: updated });
                          }} className="w-24 px-4 py-3 border rounded-xl text-sm" min="0" />
                          <button type="button" onClick={() => {
                            const updated = [...form.availableColors];
                            updated[colorIdx].sizes.splice(sizeIdx, 1);
                            setForm({ ...form, availableColors: updated });
                          }} className="cursor-pointer text-red-600">
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => {
                        const updated = [...form.availableColors];
                        updated[colorIdx].sizes.push({ size: "", quantity: "" });
                        setForm({ ...form, availableColors: updated });
                      }} className="cursor-pointer text-sm text-black underline mt-3">
                        + {t.addSize}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Images */}
                <div>
                  <p className="text-sm font-medium mb-3">{t.images} ({form.images.length}/{MAX_IMAGES})</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => {
                      const files = Array.from(e.target.files || []);
                      if (files.length + form.images.length > MAX_IMAGES) return toast.error(t.maxImagesError.replace("{max}", MAX_IMAGES));
                      setForm({ ...form, images: [...form.images, ...files] });
                    }}
                    className="w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl text-sm file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-black file:text-white"
                  />
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {form.images.map((file, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full aspect-square object-cover rounded-xl shadow" />
                        <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="cursor-pointer absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button type="submit" disabled={loading} className="cursor-pointer flex-1 py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-50 transition">
                    {loading ? t.saving : editingId ? t.updateProduct : t.createProduct}
                  </button>
                  <button type="button" onClick={resetForm} className="cursor-pointer flex-1 py-5 border-2 border-gray-300 rounded-2xl font-bold hover:bg-gray-50 transition">
                    {t.cancel}
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </AnimatePresence>
      </motion.section>
    </>
  );
}

// Reusable Modal (Bottom Sheet on Mobile)
function Modal({ children, title, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extralight">{title}</h2>
            <button onClick={onClose} className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
              <X size={28} />
            </button>
          </div>
          <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto -mt-10 mb-6" />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:border-black outline-none text-base" {...props} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:border-black outline-none bg-white text-base" {...props}>
        {children}
      </select>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Search, Filter, X, Edit, Trash2, Eye, EyeOff } from "lucide-react";

const categories = [
  "T-shirt", "Polo", "Polo manches longues", "Sweat shirt",
  "Sweet shirt Sans capuche", "Short", "Jogging", "Tote bags", "Mug"
];

const noSizeCategories = ["Tote bags", "Mug"];
const sizes = ["S", "M", "L", "XL", "XXL"];
const MAX_IMAGES = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    name: "", category: "", price: "", availableColors: [], images: [], views: [],
    showOnProductsPage: false, showOnTrendingPage: false,
    showOnBestOffersPage: false, showOnSpecialsPage: false
  });

  const [customColorName, setCustomColorName] = useState("");
  const [customColorValue, setCustomColorValue] = useState("#000000");

  const titleRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    gsap.to(titleRef.current, {
      y: [0, -8, 0],
      duration: 4,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/products/admin-products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("availableColors", JSON.stringify(
      form.availableColors.map(c => ({
        name: c.name,
        value: c.value,
        sizes: noSizeCategories.includes(form.category)
          ? [{ size: "One Size", quantity: c.quantity || "0" }]
          : c.sizes
      }))
    ));
    formData.append("showOnProductsPage", form.showOnProductsPage);
    formData.append("showOnTrendingPage", form.showOnTrendingPage);
    formData.append("showOnBestOffersPage", form.showOnBestOffersPage);
    formData.append("showOnSpecialsPage", form.showOnSpecialsPage);

    form.images.forEach(img => formData.append("images", img));
    form.views.forEach(view => formData.append("views", view));

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/products`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Product created successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "", category: "", price: "", availableColors: [], images: [], views: [],
      showOnProductsPage: false, showOnTrendingPage: false,
      showOnBestOffersPage: false, showOnSpecialsPage: false
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      availableColors: product.availableColors.map(c => ({
        name: c.name,
        value: c.value,
        sizes: noSizeCategories.includes(product.category) ? [] : c.sizes,
        quantity: noSizeCategories.includes(product.category) ? c.sizes[0]?.quantity || "" : ""
      })),
      images: [],
      views: product.images.map(i => i.view || ""),
      showOnProductsPage: product.showOnProductsPage || false,
      showOnTrendingPage: product.showOnTrendingPage || false,
      showOnBestOffersPage: product.showOnBestOffersPage || false,
      showOnSpecialsPage: product.showOnSpecialsPage || false,
    });
    setShowModal(true);
  };

  const handleToggleVisibility = async (id, field) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const endpoint = {
        showOnProductsPage: "toggle-products-page",
        showOnTrendingPage: "toggle-trending-page",
        showOnBestOffersPage: "toggle-best-offers-page",
        showOnSpecialsPage: "toggle-specials-page"
      }[field];

      const res = await axios.patch(`${API_BASE_URL}/products/${id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.map(p => p._id === id ? res.data : p));
      toast.success("Visibility updated");
    } catch (err) {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="light" autoClose={3000} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              ref={titleRef}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-light tracking-wide text-gray-900"
            >
              Manage Products
            </motion.h1>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              <Plus size={20} />
              Add New Product
            </button>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black w-full sm:w-80"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-600">Loading products...</div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {filteredProducts.map((product, i) => (
                <motion.article
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={product.images[0]?.image || "/api/placeholder/400/400"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                    <p className="text-2xl font-light mt-3">{product.price} DA</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-light">{selectedProduct.name}</h2>
                    <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-black">
                      <X size={28} />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <img src={selectedProduct.images[0]?.image} alt="" className="w-full rounded-lg" />
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="text-lg font-medium">{selectedProduct.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-2xl font-light">{selectedProduct.price} DA</p>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <button onClick={() => { handleEdit(selectedProduct); setSelectedProduct(null); }} className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                          <Edit size={18} /> Edit
                        </button>
                        <button onClick={() => { handleDelete(selectedProduct._id); setSelectedProduct(null); }} className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          <Trash2 size={18} /> Delete
                        </button>
                      </div>
                      <div className="space-y-3 pt-4 border-t">
                        {["Products Page", "Trending", "Best Offers", "Specials"].map((label, i) => {
                          const field = ["showOnProductsPage", "showOnTrendingPage", "showOnBestOffersPage", "showOnSpecialsPage"][i];
                          const active = selectedProduct[field];
                          return (
                            <button
                              key={field}
                              onClick={() => handleToggleVisibility(selectedProduct._id, field)}
                              className={`w-full flex items-center justify-between px-5 py-3 rounded-lg border ${active ? "bg-black text-white border-black" : "border-gray-300 hover:border-black"} transition-all`}
                            >
                              <span>Show on {label}</span>
                              {active ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Modal */}
        {/* ====== FULL ADD / EDIT PRODUCT MODAL ====== */}
{/* ====== UPDATED ADD / EDIT PRODUCT MODAL (SHOES ONLY) ====== */}
<AnimatePresence>
  {showModal && (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={resetForm}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-light tracking-wide">
              {editingId ? "Edit Shoe" : "Add New Shoe"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shoe Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="e.g. The Urban Walker"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="">Select category</option>
                  {["Sneakers", "Boots", "Heels", "Loafers", "Sandals", "Formal", "Casual"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (DA)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Visibility Toggles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Show on Sections</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "showOnProductsPage", label: "Products" },
                  { key: "showOnTrendingPage", label: "Trending" },
                  { key: "showOnBestOffersPage", label: "Best Offers" },
                  { key: "showOnSpecialsPage", label: "Specials" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                      className="w-5 h-5 text-black rounded focus:ring-black"
                    />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colors & Sizes */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Colors & Sizes <span className="text-red-600">*</span>
                </label>

                {/* Add Color */}
                <div className="flex gap-3 mb-6 p-5 bg-gray-50 rounded-xl">
                  <input
                    type="text"
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    placeholder="Color name (e.g. Midnight Black)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                  <input
                    type="color"
                    value={customColorValue}
                    onChange={(e) => setCustomColorValue(e.target.value)}
                    className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customColorName.trim()) return toast.error("Color name required");
                      setForm({
                        ...form,
                        availableColors: [...form.availableColors, {
                          name: customColorName.trim(),
                          value: customColorValue,
                          sizes: []
                        }]
                      });
                      setCustomColorName("");
                    }}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Add Color
                  </button>
                </div>

                {/* Selected Colors */}
                {form.availableColors.length === 0 ? (
                  <p className="text-red-600 text-sm">At least one color is required</p>
                ) : (
                  <div className="space-y-5">
                    {form.availableColors.map((color, colorIdx) => (
                      <div key={colorIdx} className="p-6 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-lg border-2 border-gray-300" style={{ backgroundColor: color.value }} />
                            <div>
                              <p className="font-medium text-lg">{color.name}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setForm({
                              ...form,
                              availableColors: form.availableColors.filter((_, i) => i !== colorIdx)
                            })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={22} />
                          </button>
                        </div>

                        {/* Sizes Input */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700">Sizes & Quantities <span className="text-red-600">*</span></p>
                          {color.sizes.length === 0 && (
                            <p className="text-red-600 text-sm">Add at least one size</p>
                          )}
                          {color.sizes.map((sizeObj, sizeIdx) => (
                            <div key={sizeIdx} className="flex gap-3 items-center">
                              <input
                                type="text"
                                value={sizeObj.size}
                                onChange={(e) => {
                                  const updated = [...form.availableColors];
                                  updated[colorIdx].sizes[sizeIdx].size = e.target.value;
                                  setForm({ ...form, availableColors: updated });
                                }}
                                placeholder="Size (e.g. 41, 10 US)"
                                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                              />
                              <input
                                type="number"
                                value={sizeObj.quantity}
                                onChange={(e) => {
                                  const updated = [...form.availableColors];
                                  updated[colorIdx].sizes[sizeIdx].quantity = e.target.value;
                                  setForm({ ...form, availableColors: updated });
                                }}
                                placeholder="Qty"
                                min="0"
                                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...form.availableColors];
                                  updated[colorIdx].sizes.splice(sizeIdx, 1);
                                  setForm({ ...form, availableColors: updated });
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...form.availableColors];
                              updated[colorIdx].sizes.push({ size: "", quantity: "" });
                              setForm({ ...form, availableColors: updated });
                            }}
                            className="text-sm text-black hover:underline"
                          >
                            + Add Size
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Images ({form.images.length}/{MAX_IMAGES})
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length + form.images.length > MAX_IMAGES) {
                    toast.error(`Max ${MAX_IMAGES} images`);
                    return;
                  }
                  setForm({ ...form, images: [...form.images, ...files] });
                }}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black"
              />
              <div className="mt-4 grid grid-cols-4 gap-4">
                {form.images.map((file, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full aspect-square object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setForm({
                        ...form,
                        images: form.images.filter((_, idx) => idx !== i),
                        views: form.views.filter((_, idx) => idx !== i)
                      })}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading || form.availableColors.length === 0 || form.availableColors.some(c => c.sizes.length === 0)}
                className="flex-1 py-4 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
                onClick={(e) => {
                  if (form.availableColors.length === 0) {
                    e.preventDefault();
                    toast.error("At least one color is required");
                  } else if (form.availableColors.some(c => c.sizes.length === 0)) {
                    e.preventDefault();
                    toast.error("Each color must have at least one size");
                  }
                }}
              >
                {loading ? "Saving..." : editingId ? "Update Shoe" : "Create Shoe"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      </motion.div>
  )}
</AnimatePresence>
      </motion.section>
    </>
  );
}
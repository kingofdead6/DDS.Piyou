import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Search, Trash2, X } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const titleRef = useRef(null);

  useEffect(() => {
    fetchCategories();
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
    const filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/categories`,
        { name: newCategoryName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, res.data]);
      setNewCategoryName("");
      setShowAddModal(false);
      toast.success("Category added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter(cat => cat._id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="light" autoClose={3000} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen mt-20 py-20"
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
              Manage Categories
            </motion.h1>
            <p className="mt-4 text-lg text-gray-600 font-light">
              Organize your shoe collections
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <button
              onClick={() => setShowAddModal(true)}
              className="cursor-pointer flex items-center gap-3 px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              <Plus size={20} />
              Add New Category
            </button>

            <div className="relative w-full lg:w-96">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-600">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 font-light">
                {searchTerm ? "No categories found" : "No categories yet"}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 text-black underline"
              >
                Add your first category
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.08 }}
            >
              {filteredCategories.map((category, i) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-medium text-gray-900">
                      {category.name}
                    </h3>
                    <button
                      onClick={() => handleDeleteCategory(category._id, category.name)}
                      className="cursor-pointer absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light">Add New Category</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleAddCategory}>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Sneakers, Boots, Sandals..."
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition text-lg"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!newCategoryName.trim()}
                    className="cursor-pointer flex-1 py-4 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
                  >
                    Create Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="cursor-pointer flex-1 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
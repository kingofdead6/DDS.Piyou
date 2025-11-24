// src/pages/admin/AdminDeliveryAreas.jsx
"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Search, Edit, Trash2, Home, Package, Truck, Store } from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";

const STORES = ["DDS.Piyou", "AB-Zone", "Tchingo Mima 2"];
const COMPANIES = ["yalidine", "zawar"];

export default function AdminDeliveryAreas() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].adminDeliveryAreas;
  const isRTL = lang === "ar";

  const [activeStore, setActiveStore] = useState("DDS.Piyou");
  const [activeCompany, setActiveCompany] = useState("yalidine");
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    wilaya: "",
    priceHome: 600,
    priceDesk: 700,
    isActive: true,
  });

  useEffect(() => {
    fetchAreas();
  }, [activeStore, activeCompany]);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/delivery-areas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAreas(res.data);
    } catch (err) {
      toast.error(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = areas
      .filter(a => a.store === activeStore)
      .filter(a => a.deliveryCompany === activeCompany)
      .filter(a => a.wilaya.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredAreas(filtered);
  }, [areas, activeStore, activeCompany, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.wilaya.trim()) return toast.error(t.errorWilayaRequired);

    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const payload = {
        wilaya: form.wilaya.trim(),
        deliveryCompany: activeCompany,
        store: activeStore,
        priceHome: Number(form.priceHome),
        priceDesk: Number(form.priceDesk),
        isActive: form.isActive,
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/delivery-areas/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(t.updatedSuccess);
      } else {
        await axios.post(`${API_BASE_URL}/delivery-areas`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(t.addedSuccess.replace("{wilaya}", form.wilaya).replace("{store}", activeStore));
      }
      resetForm();
      fetchAreas();
    } catch (err) {
      toast.error(err?.response?.data?.message || t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ wilaya: "", priceHome: 600, priceDesk: 700, isActive: true });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (area) => {
    setEditingId(area._id);
    setForm({
      wilaya: area.wilaya,
      priceHome: area.priceHome,
      priceDesk: area.priceDesk,
      isActive: area.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/delivery-areas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t.deletedSuccess);
      fetchAreas();
    } catch (err) {
      toast.error(t.errorGeneric);
    }
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-8 px-4 sm:py-12 mt-10"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-wider text-gray-900">
              {t.title}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 font-light">{t.subtitle}</p>
          </div>

          {/* Store Selector - Mobile Scrollable */}
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-6 mb-10 scrollbar-hide snap-x snap-mandatory md:justify-center md:flex-wrap">
            {STORES.map(store => (
              <button
                key={store}
                onClick={() => { setActiveStore(store); setSearchTerm(""); }}
                className={`flex-shrink-0 snap-center flex items-center gap-3 px-6 py-5 rounded-2xl shadow-lg transition-all transform hover:scale-105 min-w-[200px] sm:min-w-0 ${
                  activeStore === store 
                    ? "bg-black text-white scale-105" 
                    : "bg-white text-gray-900"
                }`}
              >
                <Store size={32} />
                <span className="text-lg sm:text-xl font-bold whitespace-nowrap">{store}</span>
              </button>
            ))}
          </div>

          {/* Company Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-wrap justify-center gap-3 bg-gray-100 p-2 rounded-2xl shadow-md">
              {COMPANIES.map(company => (
                <button
                  key={company}
                  onClick={() => setActiveCompany(company)}
                  className={`cursor-pointer flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-base sm:text-lg transition-all ${
                    activeCompany === company 
                      ? "bg-black text-white" 
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Truck size={24} />
                  {company.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8 mb-10">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-light">
                {activeStore} → <span className="font-bold text-black">{activeCompany.toUpperCase()}</span>
              </h2>
              <p className="text-lg text-gray-600 mt-2">{t.manageWilayas}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="cursor-pointer flex items-center justify-center gap-3 px-6 py-4 bg-black text-white text-lg font-bold rounded-2xl hover:bg-gray-900 transition shadow-lg"
              >
                <Plus size={28} /> {t.addWilaya}
              </button>

              <div className="relative flex-1 min-w-0">
                <Search size={24} className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:border-black outline-none text-lg"
                />
              </div>
            </div>
          </div>

          {/* Wilayas Grid */}
          {loading ? (
            <div className="text-center py-20 text-2xl text-gray-600">{t.loading || "جاري التحميل..."}</div>
          ) : filteredAreas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl sm:text-3xl text-gray-500 font-light leading-relaxed">
                {t.noWilayas}<br className="sm:hidden" />
                <span dangerouslySetInnerHTML={{
                  __html: t.noWilayasDetail
                    .replace("{store}", activeStore)
                    .replace("{company}", activeCompany.toUpperCase())
                }} />
              </p>
              <button onClick={() => setShowModal(true)} className="cursor-pointer mt-8 text-lg sm:text-xl text-black underline font-medium">
                {t.addFirstWilaya}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAreas.map(area => (
                <motion.div
                  key={area._id}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group"
                  onClick={() => handleEdit(area)}
                >
                  <div className="p-6 sm:p-8 space-y-6 text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{area.wilaya}</h3>

                    <div className="space-y-5">
                      <div className="flex items-center justify-center gap-4 text-lg sm:text-xl">
                        <Home size={28} className="text-green-600" />
                        <span className="font-bold">{area.priceHome} DA</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-lg sm:text-xl">
                        <Package size={28} className="text-blue-600" />
                        <span className="font-bold">{area.priceDesk} DA</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <span className={`text-lg sm:text-xl font-bold ${area.isActive ? "text-green-600" : "text-red-600"}`}>
                        {area.isActive ? t.active : t.inactive}
                      </span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(area._id); }}
                      className="cursor-pointer w-full py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 opacity-0 group-hover:opacity-100 transition font-bold text-lg flex items-center justify-center gap-2"
                    >
                      <Trash2 size={24} /> {t.delete}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile-Friendly Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
            >
              <motion.div
                className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-2xl"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 sm:p-10">
                  {/* Mobile pull indicator */}
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 sm:hidden" />

                  <h2 className="text-2xl sm:text-3xl font-extralight text-center mb-8">
                    {editingId ? t.editWilaya : t.addNewWilaya}<br className="sm:hidden" />
                    <span className="text-lg sm:text-xl text-gray-600 font-light block mt-2">
                      {activeStore} → {activeCompany.toUpperCase()}
                    </span>
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <input
                      type="text"
                      placeholder={t.wilayaPlaceholder}
                      value={form.wilaya}
                      onChange={e => setForm({ ...form, wilaya: e.target.value })}
                      required
                      className="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-black outline-none"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-medium mb-3">{t.homeDelivery}</label>
                        <input
                          type="number"
                          value={form.priceHome}
                          onChange={e => setForm({ ...form, priceHome: +e.target.value })}
                          className="w-full px-5 py-4 border-2 rounded-xl text-xl focus:border-black outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-medium mb-3">{t.deskDelivery}</label>
                        <input
                          type="number"
                          value={form.priceDesk}
                          onChange={e => setForm({ ...form, priceDesk: +e.target.value })}
                          className="w-full px-5 py-4 border-2 rounded-xl text-xl focus:border-black outline-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={e => setForm({ ...form, isActive: e.target.checked })}
                        className="w-8 h-8 rounded accent-black"
                      />
                      <span className="text-lg font-medium">{t.visibleToCustomers}</span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer flex-1 py-5 bg-black text-white text-xl sm:text-2xl font-bold rounded-2xl hover:bg-gray-900 disabled:bg-gray-500 transition"
                      >
                        {loading ? t.saving : editingId ? t.update : t.save}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="cursor-pointer flex-1 py-5 border-2 border-gray-400 text-xl sm:text-2xl font-bold rounded-2xl hover:bg-gray-50 transition"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hide scrollbar on mobile */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </motion.section>
    </>
  );
}
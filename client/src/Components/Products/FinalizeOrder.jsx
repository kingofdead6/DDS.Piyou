// src/pages/FinalizeOrder.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";
import { CheckCircle } from "lucide-react";

const STORES = ["DDS.Piyou", "AB-Zone", "Tchingo Mima 2"];

export default function FinalizeOrder() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].checkout;
  const isRTL = lang === "ar";
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [availableWilayas, setAvailableWilayas] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    wilaya: "",
    address: "",
    deliveryType: "desk",
    store: STORES[0],
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  useEffect(() => {
    const fetchWilayasForStore = async () => {
      if (!form.store) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/delivery-areas`);
        const storeAreas = res.data.filter(area => 
          area.store === form.store && area.isActive
        );

        const wilayaMap = new Map();
        storeAreas.forEach(area => {
          if (!wilayaMap.has(area.wilaya)) {
            wilayaMap.set(area.wilaya, {
              wilaya: area.wilaya,
              priceHome: area.priceHome,
              priceDesk: area.priceDesk,
            });
          }
        });

        const wilayas = Array.from(wilayaMap.values()).sort((a, b) => 
          a.wilaya.localeCompare(b.wilaya)
        );

        setAvailableWilayas(wilayas);
        setForm(prev => ({ ...prev, wilaya: "" }));
        setDeliveryPrice(null);
      } catch (err) {
        toast.error(lang === "fr" ? "Échec du chargement des zones" : "فشل تحميل المناطق");
        setAvailableWilayas([]);
      }
    };

    fetchWilayasForStore();
  }, [form.store, lang]);

  useEffect(() => {
    if (form.wilaya && availableWilayas.length > 0) {
      const selected = availableWilayas.find(w => w.wilaya === form.wilaya);
      if (selected) {
        setDeliveryPrice(form.deliveryType === "home" ? selected.priceHome : selected.priceDesk);
      }
    } else {
      setDeliveryPrice(null);
    }
  }, [form.wilaya, form.deliveryType, availableWilayas]);

  const hasBulkItem = cartItems.some(item => item.quantity > 7);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithDelivery = deliveryPrice !== null ? subtotal + deliveryPrice : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error(t.emptyCart);
    if (!form.wilaya) return toast.error(t.selectWilaya);
    if (form.deliveryType === "home" && !form.address.trim()) return toast.error(t.addressRequired);

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/orders/create`, {
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        wilaya: form.wilaya,
        address: form.deliveryType === "home" ? form.address.trim() : null,
        deliveryType: form.deliveryType,
        store: form.store,
        deliveryPrice,
        items: cartItems,
      });

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(t.orderPlaced);
    } catch (err) {
      toast.error(err.response?.data?.message || t.orderFailed);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (!loading && localStorage.getItem("cart") === null && cartItems.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white rounded-3xl shadow-2xl p-16 max-w-2xl w-full text-center">
          <CheckCircle className="w-32 h-32 mx-auto text-green-600 mb-8" />
          <h1 className="text-5xl font-bold text-green-600 mb-6">{t.successTitle}</h1>
          <div 
            className="text-xl text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: t.successMessage
                .replace("{store}", form.store)
                .replace("{wilaya}", form.wilaya)
            }}
          />
          <p className="text-gray-500 mt-12 text-lg">{t.redirecting}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-16 text-[#2d2a26]">{t.title}</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-7">

              <input
                type="text"
                placeholder={t.fullName}
                value={form.customerName}
                onChange={e => setForm({ ...form, customerName: e.target.value })}
                required
                className="w-full px-6 py-5 border border-gray-300 rounded-xl focus:border-black outline-none text-lg"
              />

              <input
                type="tel"
                placeholder={t.phone}
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full px-6 py-5 border border-gray-300 rounded-xl focus:border-black outline-none text-lg"
              />

              <select
                value={form.store}
                onChange={e => setForm({ ...form, store: e.target.value, wilaya: "" })}
                className="w-full px-6 py-5 border border-gray-300 rounded-xl focus:border-black outline-none text-lg"
              >
                {STORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <div>
                <label className="block text-lg font-semibold mb-3">
                  {t.wilayaLabel.replace("{store}", form.store)}
                </label>
                {availableWilayas.length === 0 ? (
                  <p className="text-red-600 font-medium py-6 text-center bg-red-50 rounded-xl">
                    {t.noDelivery.replace("{store}", form.store)}
                  </p>
                ) : (
                  <select
                    value={form.wilaya}
                    onChange={e => setForm({ ...form, wilaya: e.target.value })}
                    required
                    className="w-full px-6 py-5 border border-gray-300 rounded-xl focus:border-black outline-none text-lg"
                  >
                    <option value="">{t.chooseWilaya}</option>
                    {availableWilayas.map(w => (
                      <option key={w.wilaya} value={w.wilaya}>{w.wilaya}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4">{t.deliveryType}</label>
                <div className="grid grid-cols-2 gap-6">
                  {["desk", "home"].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryType: type })}
                      className={`py-6 rounded-2xl border-4 text-xl font-bold transition-all ${
                        form.deliveryType === type
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {type === "home" ? t.home : t.desk}
                    </button>
                  ))}
                </div>
              </div>

              {form.deliveryType === "home" && (
                <textarea
                  placeholder={t.addressPlaceholder}
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-6 py-5 border border-gray-300 rounded-xl focus:border-black outline-none text-lg resize-none"
                />
              )}

              <button
                type="submit"
                disabled={loading || availableWilayas.length === 0 || !form.wilaya}
                className="w-full py-6 bg-black text-white text-2xl font-bold rounded-2xl hover:bg-gray-900 disabled:bg-gray-400 transition shadow-2xl"
              >
                {loading ? t.placingOrder : t.orderNow}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold mb-8">{t.orderSummary}</h2>

            <div className="space-y-5 max-h-96 overflow-y-auto mb-8">
              {cartItems.map((item, i) => (
                <div key={i} className="flex gap-5 pb-5 border-b last:border-0">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <p className="text-gray-600">{item.color} • Taille {item.size} × {item.quantity}</p>
                  </div>
                  {hasBulkItem && item.quantity > 7 ? (
                    <span className="text-orange-600 font-bold text-lg">{t.bulkOrder}</span>
                  ) : (
                    <span className="font-bold text-xl">{(item.price * item.quantity).toLocaleString()} DA</span>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t-2 pt-6 space-y-5 text-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.subtotal}</span>
                <span className="font-semibold">{subtotal.toLocaleString()} DA</span>
              </div>

              {deliveryPrice !== null && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>{t.delivery} ({form.wilaya})</span>
                  <span>{deliveryPrice} DA</span>
                </div>
              )}

              {hasBulkItem ? (
                <div className="bg-orange-50 rounded-2xl p-8 text-center">
                  <p className="text-3xl font-bold text-orange-600">{t.bulkOrder}</p>
                  <p className="text-gray-700 mt-2">{t.bulkNote}</p>
                </div>
              ) : totalWithDelivery !== null && (
                <div className="flex justify-between text-3xl font-bold pt-6 border-t-2">
                  <span>{t.total}</span>
                  <span>{totalWithDelivery.toLocaleString()} DA</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// src/pages/CartPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";

export default function CartPage() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].cart;
  const isRTL = lang === "ar";

  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cartItems]);

  const updateQuantity = (productId, color, size, change) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.productId === productId && item.color === color && item.size === size) {
          const newQty = item.quantity + change;
          return newQty >= 1 && newQty <= item.maxQuantity
            ? { ...item, quantity: newQty }
            : item;
        }
        return item;
      })
    );
  };

  const removeItem = (productId, color, size) => {
    setCartItems(prev =>
      prev.filter(item => !(item.productId === productId && item.color === color && item.size === size))
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-6 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8">
          <ArrowLeft size={20} /> {t.backToShop}
        </Link>
        <h1 className="text-4xl font-bold mb-10">{t.emptyCart}</h1>
        <Link to="/products" className="text-black underline text-xl font-medium">
          {t.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/products" className="text-gray-600 hover:text-black">
            <ArrowLeft size={28} />
          </Link>
          <h1 className="text-4xl font-bold">
            {t.yourCart} {t.itemsCount(totalItems)}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 items-center hover:shadow-xl transition-shadow"
              >
                <Link to={`/product/${item.productId}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-xl hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex-1 space-y-3">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    {t.color}: {item.color} • {t.size}: {item.size}
                  </p>
                  <p className="text-lg font-medium">{item.price} DA</p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, -1)}
                      className="w-10 h-10 border border-gray-400 rounded-lg hover:bg-gray-100 transition text-xl"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-lg font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, +1)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="w-10 h-10 border border-gray-400 rounded-lg hover:bg-gray-100 transition text-xl disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right space-y-4">
                  <p className="text-2xl font-bold text-[#2d2a26]">
                    {(item.price * item.quantity).toLocaleString()} DA
                  </p>
                  <button
                    onClick={() => removeItem(item.productId, item.color, item.size)}
                    className="text-red-600 hover:text-red-800 font-medium underline text-sm"
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
            <h3 className="text-2xl font-bold mb-6">{t.orderSummary}</h3>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.subtotal}</span>
                <span className="font-medium">{subtotal.toLocaleString()} DA</span>
              </div>
              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between text-2xl font-bold">
                  <span>{t.total}</span>
                  <span>{subtotal.toLocaleString()} DA</span>
                </div>
              </div>
            </div>

            <Link to="/checkout">
              <button className="w-full mt-8 py-5 bg-black text-white text-xl font-medium rounded-xl hover:bg-gray-900 transition shadow-lg">
                {t.proceedToCheckout}
              </button>
            </Link>

            <Link to="/products" className="block text-center mt-6 text-gray-600 hover:text-black underline font-medium">
              {t.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
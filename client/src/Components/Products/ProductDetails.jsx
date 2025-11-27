import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../../../translations";

const SimilarProductsGrid = ({ currentProductId, category }) => {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].productDetail;
  const isRTL = lang === "ar";
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
        );
        const filtered = res.data
          .filter(p => p._id !== currentProductId)
          .filter(p =>
            p.availableColors.some(color =>
              color.sizes.some(size => size.quantity > 0)
            )
          );
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setSimilarProducts(shuffled.slice(0, 6));
      } catch (err) {
        console.error("Failed to load similar products");
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [currentProductId, category]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-96" />
        ))}
      </div>
    );
  }
  if (similarProducts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {similarProducts.map((p) => (
        <div key={p._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
          <Link to={`/product/${p._id}`}>
            <div className="cursor-pointer aspect-square overflow-hidden bg-gray-50">
              <img
                src={p.images[0]?.image || "/placeholder.jpg"}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </Link>
          <div className="p-6 text-center space-y-4">
            <h3 className="font-medium text-lg line-clamp-2">{p.name}</h3>
            <p className="text-2xl font-light text-gray-800">{p.price} DA</p>
            <Link to={`/product/${p._id}`}>
              <button className="cursor-pointer w-full bg-black text-white py-3 rounded-xl hover:bg-[#6f5f4b] transition font-medium">
                {t.viewDetails}
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ProductDetailsPage() {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang].productDetail;
  const isRTL = lang === "ar";
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAddedPopup, setShowAddedPopup] = useState(false); 

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const handleCartAdded = () => {
      setShowAddedPopup(true);
      setTimeout(() => setShowAddedPopup(false), 2000); 
    };

    window.addEventListener("cartAdded", handleCartAdded);
    return () => window.removeEventListener("cartAdded", handleCartAdded);
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(res.data);
      if (res.data.images.length > 0) {
        setActiveImage(res.data.images[0].image);
      }
      const availableColors = res.data.availableColors.filter(color =>
        color.sizes.some(s => s.quantity > 0)
      );
      if (availableColors.length > 0) {
        setSelectedColor(availableColors[0]);
      }
    } catch (err) {
      toast.error(t.notFound);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-600">{t.loading}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">{t.notFound}</p>
      </div>
    );
  }

  const inStockColors = product.availableColors.filter(color =>
    color.sizes.some(s => s.quantity > 0)
  );
  const availableSizes = selectedColor
    ? selectedColor.sizes.filter(s => s.quantity > 0)
    : [];
  const sizeInStock = availableSizes.find(s => s.size === selectedSize);

  const handleAddToCart = () => {
    if (!selectedColor) return toast.error(t.selectColor);
    if (!selectedSize) return toast.error(t.selectSize);
    if (!sizeInStock || sizeInStock.quantity < quantity) {
      return toast.error(t.notEnoughStock);
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0].image,
      color: selectedColor.name,
      size: selectedSize,
      quantity: quantity,
      maxQuantity: sizeInStock.quantity,
      addedAt: new Date().toISOString(),
    };

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex(
      item => item.productId === cartItem.productId && item.color === cartItem.color && item.size === cartItem.size
    );

    if (existingIndex !== -1) {
      const newQty = cart[existingIndex].quantity + quantity;
      if (newQty > sizeInStock.quantity) {
        toast.error(t.cannotAddMore);
        return;
      }
      cart[existingIndex].quantity = newQty;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new CustomEvent("cartAdded", { detail: t.addedToCart }));

    toast.success(t.addedToCart);
  };

  return (
    <>
      <div className="min-h-screen pt-24 pb-20" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/products" className="cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition">
            <ArrowLeft size={20} /> {t.backToShop}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white">
                <img src={activeImage} alt={product.name} className="w-full h-96 md:h-[600px] object-cover" />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img.image)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer  ${
                        activeImage === img.image ? "border-black shadow-md" : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img src={img.image} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-600 font-light">{t.brand}</p>
                <h1 className="text-4xl md:text-5xl font-light mt-2">{product.name}</h1>
                <p className="text-3xl font-light mt-4">{product.price} DA</p>
                <p className="text-sm text-gray-600 mt-2 capitalize">
                  • {product.gender === "male" ? (lang === "fr" ? "Homme" : "Men") : (lang === "fr" ? "Femme" : "Women")}
                  • {product.category}
                </p>
              </div>

              {inStockColors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{t.color}</h3>
                  <div className="flex gap-4 flex-wrap">
                    {inStockColors.map((color) => {
                      const hasStock = color.sizes.some(s => s.quantity > 0);
                      return (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedSize("");
                          }}
                          disabled={!hasStock}
                          className={`cursor-pointer relative group ${!hasStock ? "opacity-50" : ""}`}
                        >
                          <div
                            className={`w-16 h-16 rounded-xl border-4 transition-all ${
                              selectedColor?.name === color.name
                                ? "border-black shadow-lg scale-110"
                                : "border-gray-300 hover:border-gray-500"
                            }`}
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="block text-xs mt-2 text-center font-medium">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedColor && availableSizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                    {t.size} <span className="text-gray-500 font-normal lowercase">({selectedColor.name})</span>
                  </h3>
                  <div className="grid grid-cols-6 gap-3 max-w-md">
                    {availableSizes.map((s) => (
                      <button
                        key={s.size}
                        onClick={() => setSelectedSize(s.size)}
                        className={`cursor-pointer py-3 border rounded-lg text-sm font-medium transition-all ${
                          selectedSize === s.size
                            ? "bg-black text-white border-black"
                            : "border-gray-400 hover:bg-gray-100"
                        } ${s.quantity < 5 ? "ring-2 ring-orange-400" : ""}`}
                      >
                        {s.size}
                        {s.quantity < 5 && s.quantity > 0 && (
                          <span className="block text-xs mt-1">
                            {t.lowStock.replace("{count}", s.quantity)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">{t.quantity}</h3>
                <div className="flex items-center gap-6">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="cursor-pointer w-12 h-12 border border-gray-400 rounded-lg hover:bg-gray-100 transition">−</button>
                  <span className="text-2xl font-light w-16 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="cursor-pointer w-12 h-12 border border-gray-400 rounded-lg hover:bg-gray-100 transition">+</button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedColor || !selectedSize || !sizeInStock}
                className="cursor-pointer w-full py-5 bg-black text-white text-lg font-medium rounded-xl hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400  transition shadow-lg"
              >
                {sizeInStock ? t.addToCart : t.outOfStock}
              </button>

              {selectedSize && sizeInStock && sizeInStock.quantity <= 3 && (
                <p className="text-orange-600 font-medium text-center">
                  {t.onlyLeft.replace("{count}", sizeInStock.quantity)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-32">
            <h2 className="text-4xl font-light text-center mb-16 text-[#2d2a26]">
              {t.youMightLike}
            </h2>
            <SimilarProductsGrid currentProductId={product._id} category={product.category} />
          </div>
        </div>

        {/* Mobile-First "Added to Cart" Floating Popup */}
        <div
          className={`fixed inset-x-0 bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-500 ${
            showAddedPopup ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
        >
          <div className="bg-black text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 max-w-sm mx-auto pointer-events-auto animate-bounce-once">
            <svg className="w-14 h-14 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm md:text-base">{t.addedToCart}</p>
              <p className="text-xs opacity-90">{product.name}</p>
            </div>
            <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={product.images[0]?.image || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.7s ease-out;
        }
      `}</style>
    </>
  );
}
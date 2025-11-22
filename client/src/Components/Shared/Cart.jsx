import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "The Signature Loafer",
      price: 450,
      image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763722004/20251121_1145_Sleek_Urban_Sneakers_simple_compose_01kak08x72etqb9n66kcmgvyfj_proj2d.png",
      size: 42,
      quantity: 1,
    },
    {
      id: 2,
      name: "The Classic Belt",
      price: 150,
      image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763722004/20251121_1145_Sleek_Urban_Sneakers_simple_compose_01kak08x72etqb9n66kcmgvyfj_proj2d.png",
      size: 42,
      quantity: 2,
    },
  ]);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-lg text-gray-700">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* LEFT — ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow p-5 flex gap-5 items-center"
                >
                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />

                  {/* INFO */}
                  <div className="flex-1 space-y-1">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-600 text-sm">Size: {item.size}</p>
                    <p className="font-medium">${item.price.toFixed(2)}</p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>

                      <span className="text-lg">{item.quantity}</span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <div className="bg-white rounded-xl shadow p-6 h-fit space-y-4">
              <h3 className="text-xl font-semibold">Order Summary</h3>

              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button className="w-full mt-4 py-3 bg-black text-white rounded-lg text-lg hover:bg-gray-800 transition">
                Order Now
              </button>

              <Link
                to="/"
                className="block text-center text-gray-500 mt-2 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "The Signature Loafer",
    price: 450,
    category: "Loafers",
    color: "Black",
    gender: "Men",
    image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg",
    description:
      "Crafted from the finest full-grain leather, The Signature Loafer is a testament to timeless style and impeccable craftsmanship. An essential piece for the modern wardrobe.",
    sizes: [39, 40, 41, 42, 43, 45],
    thumbnails: [
      "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg",
      "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg",
      "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg",
      "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1763721586/468950233_555581560607916_1075285265882447077_n_nxe88x.jpg",
    ],
  },
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product?.image);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Product not found.</p>
      </div>
    );
  }

  const similarProducts = [
    { id: 10, name: "The Chelsea Boot", price: 550, image: "https://via.placeholder.com/400" },
    { id: 11, name: "The Minimalist Sneaker", price: 380, image: "https://via.placeholder.com/400" },
    { id: 12, name: "The Oxford Brogue", price: 490, image: "https://via.placeholder.com/400" },
    { id: 13, name: "The Classic Belt", price: 150, image: "https://via.placeholder.com/400" },
  ];

  return (
    <div className="min-h-screen bg-[#d0b8a8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">

        {/* LEFT — Main Image + Thumbnails */}
        <div className="flex-1">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full rounded-xl shadow-lg object-cover"
          />

          <div className="flex gap-3 mt-6">
            {product.thumbnails.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                onClick={() => setActiveImage(img)}
                className={`w-24 h-24 rounded-lg object-cover border cursor-pointer ${
                  activeImage === img
                    ? "border-black"
                    : "border-transparent hover:border-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Product Details */}
        <div className="flex-1 space-y-6">
          <p className="text-sm uppercase tracking-widest text-gray-700">DDS.PIYOU</p>

          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold">${product.price.toFixed(2)}</p>

          <p className="text-gray-800 leading-relaxed max-w-lg">{product.description}</p>

          {/* Size Selector */}
          <div>
            <h3 className="text-sm font-semibold mb-2">SIZE</h3>
            <div className="grid grid-cols-6 gap-2 max-w-md">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 border rounded-md text-sm transition ${
                    selectedSize === s
                      ? "bg-black text-white border-black"
                      : "border-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <h3 className="text-sm font-semibold mb-2">QUANTITY</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 border text-lg"
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 border text-lg"
              >
                +
              </button>
            </div>
          </div>

          <button className="w-full py-3 bg-black text-white rounded-md text-lg hover:bg-gray-900 transition">
            Add to Cart
          </button>


        </div>
      </div>

      {/* YOU MIGHT ALSO LIKE */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <h2 className="text-2xl font-semibold text-center mb-10">You Might Also Like</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {similarProducts.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-64 object-cover group-hover:brightness-95 transition"
              />
              <div className="p-4">
                <h3 className="text-md font-medium">{p.name}</h3>
                <p className="text-gray-700">${p.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";

const trendingProducts = [
  {
    id: 1,
    name: "Air Force Max",
    price: "$120",
    image: "https://source.unsplash.com/400x400/?sneakers"
  },
  {
    id: 2,
    name: "RunPro X",
    price: "$95",
    image: "https://source.unsplash.com/400x400/?running-shoes"
  },
  {
    id: 3,
    name: "StreetFlex",
    price: "$110",
    image: "https://source.unsplash.com/400x400/?nike-shoes"
  },
  {
    id: 4,
    name: "Urban Step",
    price: "$89",
    image: "https://source.unsplash.com/400x400/?adidas-shoes"
  }
];

export default function TrendingSection() {
  return (
    <section className="py-20 px-6 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        🔥 Trending Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {trendingProducts.map((product) => (
          <motion.div
            whileHover={{ y: -8 }}
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 object-cover"
            />

            <div className="p-5">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500 mt-2">{product.price}</p>

              <button className="mt-4 w-full bg-black text-white py-3 rounded-full text-sm hover:bg-gray-800 transition">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

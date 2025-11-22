import { motion } from "framer-motion";

export default function BestOffers() {
  return (
    <section className="py-20 px-6 md:px-20 bg-gray-100">
      <div className="grid md:grid-cols-2 gap-10 items-center">

        <motion.img
          whileHover={{ scale: 1.05 }}
          src="https://source.unsplash.com/800x800/?discount-shoes"
          alt="Best offer"
          className="rounded-3xl shadow-xl"
        />

        <div>
          <h2 className="text-3xl md:text-5xl font-bold">
            💥 Best Deals of the Season
          </h2>

          <p className="text-gray-600 mt-6 text-lg">
            Save up to 50% on premium sneakers and running shoes. Limited stock available.
          </p>

          <button className="mt-8 bg-black text-white px-10 py-4 rounded-full font-semibold text-sm hover:bg-gray-800 transition">
            Shop Offers
          </button>
        </div>

      </div>
    </section>
  );
}

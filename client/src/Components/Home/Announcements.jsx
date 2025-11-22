import { motion } from "framer-motion";

export default function Announcements() {
  const announcements = [
    {
      title: "🔥 Black Friday Mega Sale",
      description: "Up to 50% off on selected sneakers. Limited time only!",
    },
    {
      title: "🚚 Free Shipping",
      description: "Enjoy free shipping on all orders over $100.",
    },
    {
      title: "🎁 New Collection Drop",
      description: "Check out our brand-new winter collection.",
    },
  ];

  return (
    <section className="py-24 px-10 ">
      <h2 className="text-4xl font-bold text-center mb-16">
        Announcements
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        {announcements.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-xl hover:scale-105 transition"
          >
            <h3 className="text-2xl font-semibold mb-4">
              {item.title}
            </h3>
            <p className="text-gray-600">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

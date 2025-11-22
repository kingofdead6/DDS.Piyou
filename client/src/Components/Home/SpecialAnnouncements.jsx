import { motion } from "framer-motion";

export default function SpecialAnnouncements() {
  return (
    <section className="py-20 px-6 md:px-20">
      <div className="bg-black text-white rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold"
        >
          🚀 Special Announcement
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6 text-gray-300 text-lg md:text-xl"
        >
          Our new premium shoe collection drops next week. Be the first to experience it.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-10 bg-white text-black px-10 py-4 rounded-full font-semibold text-sm hover:bg-gray-200 transition"
        >
          Get Notified
        </motion.button>

      </div>
    </section>
  );
}

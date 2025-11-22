import { motion } from "framer-motion";

export default function ContactUs() {
  return (
    <section className="py-24 px-6 ">
      <h2 className="text-4xl font-bold text-center mb-16">
        Contact Us
      </h2>

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <input
          type="text"
          placeholder="Subject"
          className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black"
        />

        <textarea
          placeholder="Your Message"
          rows="5"
          className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black resize-none"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-[#6f5f4b] transition"
        >
          Send Message
        </button>
      </motion.form>
    </section>
  );
}

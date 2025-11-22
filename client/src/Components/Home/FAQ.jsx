import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Shipping usually takes between 3 to 7 business days depending on your location.",
    },
    {
      question: "Can I return or exchange my shoes?",
      answer:
        "Yes, you can return or exchange within 14 days of delivery in original condition.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide with additional international shipping fees.",
    },
    {
      question: "Are your shoes authentic?",
      answer:
        "All shoes sold on our platform are 100% authentic and quality checked.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer"
            onClick={() =>
              setOpenIndex(openIndex === i ? null : i)
            }
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {faq.question}
              </h3>
              <span className="text-2xl font-bold">
                {openIndex === i ? "−" : "+"}
              </span>
            </div>

            <AnimatePresence>
              {openIndex === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 text-gray-600"
                >
                  {faq.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

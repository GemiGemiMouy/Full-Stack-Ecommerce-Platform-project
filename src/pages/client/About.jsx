import React from "react";
import Footer from "../../components/Footer";

import {
  Sparkles,
  Leaf,
  Truck,
  Headset,
  Star,
  HeartHandshake,
} from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Main content */}
      <main className="flex-grow px-6 py-12 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            About ModaioFashion
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Discover the essence of modern style. ModaioFashion blends trend,
            comfort, and sustainability into every stitch — empowering you to
            wear your story with confidence.
          </p>
        </motion.div>

        {/* Image & Intro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image with animation */}
          <motion.div
            className="w-full px-4 md:px-8"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://i.pinimg.com/736x/ed/15/36/ed1536e1112dfbd90ac1686e8bb56b5c.jpg"
              alt="About ModaioFashion"
              className="w-full h-auto max-h-[700px] object-contain rounded-xl shadow-md border dark:border-gray-700"
            />
          </motion.div>

          {/* Text with animation */}
          <motion.div
            className="flex flex-col justify-center h-full px-6 md:px-12 max-h-[700px] text-gray-800 dark:text-gray-100"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-4 leading-relaxed text-lg">
              At <strong>ModaioFashion</strong>, we believe fashion is a powerful form of
              self-expression. Our collections are designed for those who embrace
              individuality, confidence, and timeless modern style.
            </p>
            <p className="leading-relaxed text-lg">
              Inspired by global trends and everyday elegance, each piece reflects
              comfort, creativity, and a sense of purpose — whether you're heading to a
              casual brunch, a bold event, or your daily hustle.
            </p>
          </motion.div>
        </div>

        {/* Features with Icons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          {[
            {
              icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
              title: "Trendy Designs",
              desc: "Stay ahead with hand-picked modern fashion pieces.",
            },
            {
              icon: <Leaf className="w-8 h-8 text-green-500" />,
              title: "Sustainable",
              desc: "We focus on eco-friendly fabrics and ethical production.",
            },
            {
              icon: <Truck className="w-8 h-8 text-yellow-500" />,
              title: "Fast Shipping",
              desc: "Get your favorites delivered worldwide in days.",
            },
            {
              icon: <Headset className="w-8 h-8 text-blue-500" />,
              title: "24/7 Support",
              desc: "Friendly customer service here when you need us.",
            },
            {
              icon: <Star className="w-8 h-8 text-pink-500" />,
              title: "Quality Guaranteed",
              desc: "Every product goes through quality checks — always.",
            },
            {
              icon: <HeartHandshake className="w-8 h-8 text-rose-500" />,
              title: "Community Driven",
              desc: "We support creators, causes, and you — always.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              {f.icon}
              <h3 className="mt-3 font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 px-6 py-8 mt-12 w-full">
        <Footer />
      </footer>
    </div>
  );
}

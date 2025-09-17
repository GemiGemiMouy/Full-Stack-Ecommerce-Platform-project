import React from "react";
import Footer from "../../components/Footer";

import {
  Sparkles,
  Leaf,
  Truck,
  Headset,
  Star,
  HeartHandshake,
  Users,
  Award,
  Globe,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Palette,
  Shirt,
  Crown,
  Gem,
  Lightbulb,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-400/5 dark:to-purple-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Fashion Forward Since 2020
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              About ModaioFashion
            </h1>
            
            <p className="text-xl max-w-4xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover the essence of modern style. ModaioFashion blends trend,
              comfort, and sustainability into every stitch — empowering you to
              wear your story with confidence and elegance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <main className="flex-grow px-6 py-12 max-w-7xl mx-auto space-y-20">

        {/* Stats Section */}
        <motion.section
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          {[
            { number: "50K+", label: "Happy Customers", icon: <Heart className="w-8 h-8" /> },
            { number: "10K+", label: "Products Sold", icon: <Shirt className="w-8 h-8" /> },
            { number: "100+", label: "Countries", icon: <Globe className="w-8 h-8" /> },
            { number: "24/7", label: "Support", icon: <Zap className="w-8 h-8" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-indigo-600 dark:text-indigo-400 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Mission Section */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              At <strong>ModaioFashion</strong>, we believe fashion is a powerful form of
              self-expression. Our collections are designed for those who embrace
              individuality, confidence, and timeless modern style.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Inspired by global trends and everyday elegance, each piece reflects
              comfort, creativity, and a sense of purpose — whether you're heading to a
              casual brunch, a bold event, or your daily hustle.
            </p>
          </div>
        </motion.section>

        {/* Image & Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="ModaioFashion Team - Fashion Design Studio"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20"></div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Story
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Founded in 2020, ModaioFashion started as a small team of passionate designers 
              who believed that fashion should be accessible, sustainable, and empowering.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Today, we're proud to serve customers worldwide with our carefully curated 
              collections that blend contemporary trends with timeless elegance.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-white dark:border-gray-800"></div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Our Team</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">50+ passionate professionals</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Crown className="w-12 h-12 text-indigo-600" />,
                title: "Quality First",
                desc: "Every product is carefully selected and tested to meet our high standards of quality and durability.",
              },
              {
                icon: <Leaf className="w-12 h-12 text-green-600" />,
                title: "Sustainability",
                desc: "We're committed to eco-friendly practices and ethical sourcing to protect our planet.",
              },
              {
                icon: <Heart className="w-12 h-12 text-pink-600" />,
                title: "Customer Care",
                desc: "Your satisfaction is our priority. We're here to help you find the perfect style.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                className="p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 dark:border-gray-700/50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're committed to delivering exceptional fashion experiences that go beyond just clothing. 
              Here's what sets us apart in the world of style and elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Palette className="w-12 h-12" />,
                title: "Curated Excellence",
                subtitle: "Trendy Designs",
                desc: "Every piece in our collection is hand-selected by our expert stylists, ensuring you stay ahead of fashion trends with timeless elegance.",
              },
              {
                icon: <Leaf className="w-12 h-12" />,
                title: "Eco-Conscious",
                subtitle: "Sustainable Fashion",
                desc: "We partner with ethical manufacturers and use sustainable materials, making fashion choices that respect our planet and future generations.",
              },
              {
                icon: <Zap className="w-12 h-12" />,
                title: "Lightning Fast",
                subtitle: "Express Delivery",
                desc: "From our warehouse to your doorstep in record time. Experience premium shipping that matches the quality of our products.",
              },
              {
                icon: <Headset className="w-12 h-12" />,
                title: "Always Here",
                subtitle: "24/7 Support",
                desc: "Our dedicated customer care team is available around the clock to assist you with any questions or styling advice you need.",
              },
              {
                icon: <Gem className="w-12 h-12" />,
                title: "Premium Quality",
                subtitle: "Guaranteed Excellence",
                desc: "Every item undergoes rigorous quality testing. We stand behind our products with comprehensive quality guarantees.",
              },
              {
                icon: <Crown className="w-12 h-12" />,
                title: "Industry Leader",
                subtitle: "Award-Winning Service",
                desc: "Recognized by fashion industry leaders for our innovation, customer service, and commitment to sustainable fashion practices.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="group p-8 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-500 hover:-translate-y-2"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-6 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors duration-300">
                  <div className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">
                  {f.subtitle}
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* CTA Section */}
      <motion.section
        className="relative overflow-hidden bg-gray-900 dark:bg-gray-800 rounded-3xl mx-6 mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 dark:from-gray-700/50 dark:to-gray-800/50"></div>
        <div className="relative px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Elevate Your Style?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join over 50,000 fashion-forward individuals who have discovered their perfect style with ModaioFashion. 
              Experience the difference that quality, sustainability, and exceptional service can make in your wardrobe.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group px-10 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <span className="flex items-center gap-2">
                  Start Shopping
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button className="px-10 py-4 border-2 border-gray-300 text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 hover:border-white">
                Explore Collections
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-6">Trusted by fashion enthusiasts worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-gray-300 font-semibold">50K+ Happy Customers</div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="text-gray-300 font-semibold">100+ Countries</div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="text-gray-300 font-semibold">Premium Quality</div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="text-gray-300 font-semibold">24/7 Support</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

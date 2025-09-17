import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import ProductCard from "../../components/ProductCard";
import Footer from "../../components/Footer";
import ModernDropdown from "../../components/ModernDropdown";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  Headphones,
  Sun,
  Moon,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null); // null | "success" | "error"
  const [user, setUser] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Fetch products & categories from Firebase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const productsCol = collection(db, "products");
        const productSnapshot = await getDocs(productsCol);
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);

        const cats = Array.from(
          new Set(productList.map((p) => p.category).filter(Boolean))
        );
        setCategories(cats);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Fetch testimonials from Firestore
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const testCol = collection(db, "testimonials");
        const testSnapshot = await getDocs(testCol);
        const testList = testSnapshot.docs.map((doc) => doc.data());
        setTestimonials(testList);
      } catch (error) {
        console.error("Error loading testimonials:", error);
      }
    }
    fetchTestimonials();
  }, []);

  

  // Back to top button show/hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-slide testimonials every 6 seconds
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setTestimonialIndex((idx) => (idx + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  // Filter & sort products
  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "all" ? true : p.category === selectedCategory
    )
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const sortedFiltered = filteredProducts.sort((a, b) =>
    sortOrder === "asc" ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0)
  );

  const handleAddToCart = (product) => {
    if (typeof onAddToCart === "function") {
      onAddToCart(product);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Newsletter submit handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const re = /\S+@\S+\.\S+/;
    if (re.test(email)) {
      setNewsletterStatus("success");
      setEmail("");
    } else {
      setNewsletterStatus("error");
    }
  };

  return (
    <>
      <div className="h-8 md:h-12" />

      {/* Hero Section */}
      <section
        className={`
          max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16 rounded-lg
          bg-[#e6f0f2] dark:bg-gradient-to-r dark:from-indigo-900 dark:via-gray-900 dark:to-black
          text-gray-900 dark:text-indigo-100
          relative
        `}
      >
      <motion.div
  className="md:w-1/2 max-w-xl text-center md:text-left"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-indigo-100">
    Discover Your Style with Our Premium Clothing Collection
  </h1>
  <p className="text-gray-700 dark:text-indigo-200 text-lg mb-8 max-w-lg mx-auto md:mx-0">
    Elevate your wardrobe with timeless, comfortable fashion. Shop the
    latest trends and enjoy effortless style.
  </p>

  {/* Buttons side by side */}
  <div className="flex flex-wrap gap-4 justify-center md:justify-start max-w-max mx-auto md:mx-0">
    <Link
      to="/products"
      className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-md font-semibold hover:bg-indigo-700 transition text-center"
    >
      Shop Now
    </Link>

    <Link
      to="/about"
      className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
    >
      Learn More
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
</motion.div>



        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="https://i.pinimg.com/736x/b7/88/4c/b7884c93043bc306267d5fafd6040632.jpg"
            alt="Fashion model hero"
            className="rounded-lg shadow-lg object-cover max-w-full"
            style={{ height: 360, width: "auto" }}
            loading="lazy"
          />
        </motion.div>

       
      </section>

      {/* Search, Category, Sort */}
     <main className="max-w-7xl mx-auto px-6 py-8">
  {/* Filter Bar */}
  <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">

    {/* Search Input */}
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full lg:w-1/3 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
{/* Categories */}
<div className="flex flex-wrap justify-center gap-2">
  {["all", ...categories].map((cat) => (
    <button
      key={cat}
      onClick={() => setSelectedCategory(cat)}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition
        ${
          selectedCategory === cat
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
        }`}
    >
      {cat.charAt(0).toUpperCase() + cat.slice(1)}
    </button>
  ))}
</div>


    {/* Sort Dropdown */}
    <ModernDropdown
      value={sortOrder}
      onChange={setSortOrder}
      placeholder="Sort by price"
      icon={ArrowUpDown}
      variant="sort"
      className="min-w-[200px]"
      options={[
        { value: "asc", label: "Price: Low to High" },
        { value: "desc", label: "Price: High to Low" }
      ]}
    />
  </div>

  {/* Featured Heading */}
  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-10 text-center">
    Featured Products
  </h2>

  {/* Product Grid */}
  {loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-72 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
        />
      ))}
    </div>
  ) : sortedFiltered.length === 0 ? (
    <motion.p
      className="text-center text-gray-600 dark:text-gray-300 mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      No products found.
    </motion.p>
  ) : (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {sortedFiltered.slice(0, 8).map((product) => (
        <motion.div
          key={product.id}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
          className="cursor-pointer rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ProductCard
            product={product}
            onAddToCart={() => handleAddToCart(product)}
            userId={user?.uid}
          />
        </motion.div>
      ))}
    </motion.div>
  )}

  {/* See All Button */}
  <div className="text-center mt-10">
    <Link
      to="/products"
      className="inline-block text-indigo-600 border border-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-600 hover:text-white transition"
    >
      See All Products
    </Link>
  </div>
</main>


      {/* Why Choose Us Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-indigo-100">
            Why Choose Us?
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {[
              {
                icon: (
                  <Truck className="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" />
                ),
                title: "Fast & Free Shipping",
                description:
                  "Enjoy fast and free shipping on orders over $50, delivered directly to your doorstep.",
              },
              {
                icon: (
                  <ShieldCheck className="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" />
                ),
                title: "Secure Payments",
                description:
                  "We guarantee 100% secure payments with advanced encryption technology.",
              },
              {
                icon: (
                  <Headphones className="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" />
                ),
                title: "24/7 Customer Support",
                description:
                  "Our dedicated support team is available anytime to assist you with your needs.",
              },
            ].map(({ icon, title, description }) => (
              <motion.div
                key={title}
                className="flex flex-col items-center space-y-4 px-6 py-8 border rounded-lg shadow-sm hover:shadow-lg transition cursor-default bg-white dark:bg-gray-800"
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {icon}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-indigo-100">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-indigo-200 max-w-xs">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-indigo-50 dark:bg-indigo-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-indigo-900 dark:text-indigo-100">
            What Our Customers Say
          </h2>

          {testimonials.length === 0 ? (
            <p className="text-indigo-900 dark:text-indigo-100">
              Loading testimonials...
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={testimonialIndex}
                className="text-xl italic text-gray-700 dark:text-indigo-200 max-w-3xl mx-auto mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
              >
                “{testimonials[testimonialIndex].quote}”
                <footer className="mt-4 font-semibold text-indigo-900 dark:text-indigo-100">
                  — {testimonials[testimonialIndex].name}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-indigo-100">
            Subscribe to Our Newsletter
          </h2>
          <p className="mb-6 text-gray-700 dark:text-indigo-200">
            Get the latest updates, discounts, and news straight to your inbox.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <input
              type="email"
              aria-label="Email address"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:w-auto px-4 py-3 border rounded-md dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition font-semibold"
            >
              Subscribe
            </button>
          </form>
          {newsletterStatus === "success" && (
            <p className="mt-4 text-green-600 font-semibold">
              Thanks for subscribing!
            </p>
          )}
          {newsletterStatus === "error" && (
            <p className="mt-4 text-red-600 font-semibold">
              Please enter a valid email address.
            </p>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        aria-label="Back to top"
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg
          transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${showBackToTop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <ChevronUp size={28} />
      </button>

      <Footer />
    </>
  );
}

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import ProductCard from "../../components/ProductCard";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Products({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const productsCol = collection(db, "products");
      const productSnapshot = await getDocs(productsCol);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setCategories([...new Set(productList.map((p) => p.category).filter(Boolean))]);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleAddToCartAndRedirect = (product) => {
    onAddToCart(product);
    navigate("/cart");
  };

  const filtered = products.filter((product) => {
    const matchCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const sortedFiltered = filtered.sort((a, b) => {
    if (sortOrder === "asc") return (a.price || 0) - (b.price || 0);
    else return (b.price || 0) - (a.price || 0);
  });

  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const diffDays = (new Date() - createdDate) / (1000 * 3600 * 24);
    return diffDays <= 30;
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white">
          All Products
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-800 text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-gray-800 text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
              />
            ))}
          </div>
        ) : sortedFiltered.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No products found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {sortedFiltered.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCartAndRedirect(product)}
                  isNew={isNewProduct(product.createdAt)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </>
  );
}

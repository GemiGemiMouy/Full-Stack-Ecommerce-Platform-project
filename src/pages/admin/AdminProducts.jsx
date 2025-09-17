import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import ModernDropdown from "../../components/ModernDropdown";
import { Filter, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    rating: 4,
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  // Ref for modal background click to close modal
  const modalRef = useRef();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }

  async function fetchCategories() {
    const categoriesCol = collection(db, "categories");
    const snapshot = await getDocs(categoriesCol);
    setCategories(snapshot.docs.map((doc) => doc.data().name));
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal and set form data for editing
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      rating: product.rating || 4,
      category: product.category || "",
    });
    setEditingId(product.id);
  };

  // Cancel editing (close modal)
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", price: "", image: "", rating: 4, category: "" });
  };

  // Submit add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), {
          name: form.name,
          price: parseFloat(form.price),
          image: form.image,
          rating: parseInt(form.rating) || 4,
          category: form.category,
        });
      } else {
        await addDoc(collection(db, "products"), {
          name: form.name,
          price: parseFloat(form.price),
          image: form.image,
          rating: parseInt(form.rating) || 4,
          category: form.category,
        });
      }
      setForm({ name: "", price: "", image: "", rating: 4, category: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  // Modal background click closes modal
  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      handleCancelEdit();
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "name") {
      const nameA = a.name || "";
      const nameB = b.name || "";
      return nameA.localeCompare(nameB);
    }
    if (sortBy === "price") {
      return (a.price || 0) - (b.price || 0);
    }
    return 0;
  });

  const displayedProducts = showAllProducts
    ? sortedProducts
    : sortedProducts.slice(0, 12);

  // Filter by category
  const filteredProducts =
    filterCategory === ""
      ? displayedProducts
      : displayedProducts.filter(
          (product) => product.category === filterCategory
        );

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Add New Product Section (always visible) */}
      <section className="max-w-4xl mx-auto mb-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add New Product
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {["name", "price", "image", "rating"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 capitalize">
                {field}
              </label>
              <input
                type={field === "price" || field === "rating" ? "number" : "text"}
                name={field}
                value={form[field]}
                onChange={handleInputChange}
                className="rounded p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                required={field !== "rating"}
                min={field === "rating" ? 1 : undefined}
                max={field === "rating" ? 5 : undefined}
                step={field === "price" ? "0.01" : undefined}
              />
            </div>
          ))}
          {/* Category select */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 capitalize">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              required
              className="rounded p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5 flex justify-end items-center">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </section>

      {/* Filter and Sort Section */}
      <section className="max-w-6xl mx-auto mb-6 flex flex-wrap gap-6 items-center">
        <ModernDropdown
          value={filterCategory}
          onChange={setFilterCategory}
          placeholder="All Categories"
          label="Filter by Category"
          icon={Filter}
          variant="filter"
          className="min-w-[200px]"
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((cat) => ({
              value: cat,
              label: cat
            }))
          ]}
        />

        <ModernDropdown
          value={sortBy}
          onChange={setSortBy}
          placeholder="Sort by"
          label="Sort by"
          icon={ArrowUpDown}
          variant="sort"
          className="min-w-[200px]"
          options={[
            { value: "name", label: "Name (A-Z)" },
            { value: "price", label: "Price (Low to High)" }
          ]}
        />
      </section>

      {/* Product List Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105 rounded-sm"
            />

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {product.name}
            </h4>
            <p className="text-indigo-500 dark:text-indigo-300 font-medium mb-1">
              ${product.price.toFixed(2)}
            </p>
            <p className="mb-2 italic text-sm text-gray-600 dark:text-gray-400">
              Category: {product.category || "Uncategorized"}
            </p>
            <div className="flex space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < product.rating
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <div className="mt-auto flex justify-between">
              <button
                onClick={() => handleEdit(product)}
                className="text-sm text-indigo-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Show More / Less Button */}
      {products.length > 12 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAllProducts(!showAllProducts)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {showAllProducts ? "Show Less" : `Show All (${products.length})`}
          </button>
        </div>
      )}

      {/* Edit Modal Popup */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            ref={modalRef}
            onClick={handleModalClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-xl w-full p-6 mx-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Edit Product
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {["name", "price", "image", "rating"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "price" || field === "rating" ? "number" : "text"}
                      name={field}
                      value={form[field]}
                      onChange={handleInputChange}
                      className="rounded p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      required={field !== "rating"}
                      min={field === "rating" ? 1 : undefined}
                      max={field === "rating" ? 5 : undefined}
                      step={field === "price" ? "0.01" : undefined}
                    />
                  </div>
                ))}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 capitalize">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    required
                    className="rounded p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-5 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    {loading ? "Saving..." : "Update Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

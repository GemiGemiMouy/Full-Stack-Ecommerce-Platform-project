import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const col = collection(db, "categories");
    const snapshot = await getDocs(col);
    setCategories(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }

  const handleInputChange = (e) => {
    setForm({ name: e.target.value });
  };

  const handleEdit = (category) => {
    setForm({ name: category.name });
    setEditingId(category.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "categories", editingId), { name: form.name.trim() });
      } else {
        await addDoc(collection(db, "categories"), { name: form.name.trim() });
      }
      setForm({ name: "" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await deleteDoc(doc(db, "categories", id));
    fetchCategories();
  };

  return (
    <motion.div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Categories</h2>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-2">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Category Name</label>
          <input
            type="text"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter category name"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="flex space-x-2">
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
          >
            {loading ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {categories.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No categories found.</p>
      ) : (
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between items-center bg-white dark:bg-gray-800 rounded p-3 shadow"
            >
              <span className="text-gray-900 dark:text-white font-medium">{cat.name}</span>
              <div className="space-x-3">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

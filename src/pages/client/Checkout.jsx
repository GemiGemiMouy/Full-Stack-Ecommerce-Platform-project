import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function Checkout({ cart }) {
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        ...form,
        cart,
        total,
        createdAt: Timestamp.now(),
        status: "Pending",
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // optional: to clear state
      }, 2500);
    } catch (err) {
      alert("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Checkout
      </h2>

      {success ? (
        <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 p-4 rounded-lg">
          ✅ Order placed successfully! Redirecting...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200">Shipping Address</label>
            <textarea
              name="address"
              required
              rows="3"
              value={form.address}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>

          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            Total: ${total.toFixed(2)}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </form>
      )}
    </div>
  );
}

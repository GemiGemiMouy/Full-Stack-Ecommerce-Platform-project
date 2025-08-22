import React, { useEffect, useState } from "react";
import { createNotification } from "../../utils/notifications"; // adjust path as needed

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { motion } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiClock,
  FiLoader,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Modal from "../../components/Modal";

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function StatusBadge({ status }) {
  const map = {
    pending: { icon: <FiClock className="inline mr-1" />, color: "yellow" },
    processing: {
      icon: <FiLoader className="inline mr-1 animate-spin" />,
      color: "blue",
    },
    shipped: { icon: <FiTruck className="inline mr-1" />, color: "purple" },
    completed: { icon: <FiCheckCircle className="inline mr-1" />, color: "green" },
    cancelled: { icon: <FiXCircle className="inline mr-1" />, color: "red" },
  };

  const normalized = (status || "").toLowerCase();
  const { icon, color } = map[normalized] || {
    icon: <FiClock />,
    color: "gray",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
        ${
          color === "yellow"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900"
            : color === "blue"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-300 dark:text-blue-900"
            : color === "purple"
            ? "bg-purple-100 text-purple-800 dark:bg-purple-300 dark:text-purple-900"
            : color === "green"
            ? "bg-green-100 text-green-800 dark:bg-green-300 dark:text-green-900"
            : color === "red"
            ? "bg-red-100 text-red-800 dark:bg-red-300 dark:text-red-900"
            : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
        }`}
    >
      {icon}
      {normalized || "Unknown"}
    </span>
  );
}

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg max-w-xl w-full p-6 overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Order Details - {order.id}</h2>

        <div className="mb-4">
          <p>
            <strong>Customer:</strong> {order.name || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {order.email || "-"}
          </p>
          <p className="flex items-center gap-2">
            <strong>Status:</strong>{" "}
            <StatusBadge status={(order.status || "").toLowerCase()} />
          </p>
          <p>
            <strong>Date:</strong> {orderDate ? orderDate.toLocaleString() : "-"}
          </p>
          <p>
            <strong>Total:</strong> ${order.total?.toFixed(2) || "0.00"}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Items</h3>

          {Array.isArray(order.cart) && order.cart.length > 0 ? (
            <ul className="divide-y divide-gray-300 dark:divide-gray-700 max-h-64 overflow-y-auto">
              {order.cart.map((item, index) => (
                <li
                  key={item.id || index}
                  className="flex items-center py-3 space-x-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {item.name || "Unnamed product"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Price: ${item.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 italic">
              No items found in the order.
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", status: "" });
  const [saving, setSaving] = useState(false);

  const [detailsOrder, setDetailsOrder] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      const ordersCol = collection(db, "orders");
      const snapshot = await getDocs(ordersCol);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
      setFilteredOrders(list);
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];
    if (searchTerm) {
      result = result.filter((o) =>
        (o.name || o.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (dateFilter) {
      result = result.filter(
        (o) =>
          o.createdAt?.toDate?.().toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }
    if (statusFilter) {
  result = result.filter(
    (o) => (o.status || "").toLowerCase() === statusFilter.toLowerCase()
  );
}

    setFilteredOrders(result);
  }, [searchTerm, dateFilter, statusFilter, orders]);

  async function handleStatusChange(orderId, newStatus) {
    setLoadingIds((prev) => new Set(prev).add(orderId));
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      const order = orders.find((o) => o.id === orderId);
      const userId = order?.userId; // get from order object

      if (userId) {
        await createNotification(userId, orderId, newStatus);
      } else {
        console.warn("No userId on order; skipping notification");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch {
      alert("Failed to update status.");
    } finally {
      setLoadingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(orderId);
        return copy;
      });
    }
  }

  async function handleDelete(orderId) {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch {
      alert("Failed to delete order.");
    }
  }

  function openEditModal(order) {
    setEditingOrder(order);
    setEditForm({
      name: order.name || "",
      email: order.email || "",
      status: order.status || "pending",
    });
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditingOrder(null);
    setEditModalOpen(false);
    setSaving(false);
  }

  function handleEditInputChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleEditSave(e) {
    e.preventDefault();
    if (!editingOrder) return;
    setSaving(true);
    try {
      const orderRef = doc(db, "orders", editingOrder.id);
      await updateDoc(orderRef, {
        name: editForm.name,
        email: editForm.email,
        status: editForm.status,
      });

      // Add notification after status update in modal save (optional)
      if (editingOrder.status !== editForm.status && editingOrder.userId) {
        await addDoc(collection(db, "notifications"), {
          userId: editingOrder.userId,
          orderId: editingOrder.id,
          message: `Your order ${editingOrder.id} status has been updated to "${editForm.status}".`,
          read: false,
          createdAt: serverTimestamp(),
        });
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrder.id ? { ...order, ...editForm } : order
        )
      );
      closeEditModal();
    } catch {
      alert("Failed to save changes.");
      setSaving(false);
    }
  }

  function formatDateTime(date) {
    return date.toLocaleString();
  }

  function openDetailsModal(order) {
    setDetailsOrder(order);
  }

  function closeDetailsModal() {
    setDetailsOrder(null);
  }

  return (
    <>
      <motion.div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">
          Customer Orders
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-10 space-y-4 sm:space-y-0">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-44 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-20">
            No orders match your filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-indigo-600 text-white sticky top-0">
                <tr>
                  <th className="p-3 text-left font-semibold">Order ID</th>
                  <th className="p-3 text-left font-semibold">Customer</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-right font-semibold">Total</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                  >
                    <td className="p-3 font-mono text-xs text-gray-800 dark:text-gray-100 max-w-[120px] truncate">
                      {order.id}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-100 max-w-[150px] truncate">
                      {order.name || "Unknown"}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-100 max-w-[180px] truncate">
                      {order.email || "-"}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-100">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                          text-xs font-semibold capitalize
                          bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                      >
                        <StatusBadge status={order.status} />
                      </span>
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-100 max-w-[140px] truncate">
                      {order.createdAt?.toDate
                        ? formatDateTime(order.createdAt.toDate())
                        : "-"}
                    </td>
                    <td className="p-3 font-semibold text-gray-800 dark:text-gray-100 text-right min-w-[80px]">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-100 flex justify-center space-x-2 min-w-[130px]">
                      <button
                        onClick={() => openEditModal(order)}
                        className="flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        title="Edit Order"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                        title="Delete Order"
                      >
                        <FiTrash2 size={18} />
                      </button>
                      <button
                        onClick={() => openDetailsModal(order)}
                        className="flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                        title="View Details"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Modal isOpen={editModalOpen} onClose={closeEditModal} title="Edit Order">
        <form onSubmit={handleEditSave} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
              Customer Name
            </label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
              Status
            </label>
            <select
              name="status"
              value={editForm.status}
              onChange={handleEditInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            >
              {STATUS_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-6 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <OrderDetailsModal order={detailsOrder} onClose={closeDetailsModal} />
    </>
  );
}

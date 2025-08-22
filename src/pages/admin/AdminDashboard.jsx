import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  FiBox,
  FiDollarSign,
  FiClock,
  FiTruck,
  FiXCircle,
  FiX,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";

function StatusBadge({ status }) {
  const map = {
    pending: { icon: <FiClock className="inline mr-1" />, color: "yellow" },
    processing: { icon: <FiLoader className="inline mr-1 animate-spin" />, color: "blue" },
    shipped: { icon: <FiTruck className="inline mr-1" />, color: "purple" },
    completed: { icon: <FiCheckCircle className="inline mr-1" />, color: "green" },
    cancelled: { icon: <FiXCircle className="inline mr-1" />, color: "red" },
  };
  const { icon, color } = map[status] || { icon: null, color: "gray" };

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
      {status}
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-600"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const ORDERS_PER_PAGE = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const ordersCol = collection(db, "orders");
      const snapshot = await getDocs(ordersCol);
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      alert("Failed to fetch orders: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (statusFilter && order.status?.toLowerCase() !== statusFilter) return false;
        const name = order.name || "";
        const email = order.email || "";
        const lowerSearch = search.toLowerCase();
        return (
          name.toLowerCase().includes(lowerSearch) ||
          email.toLowerCase().includes(lowerSearch)
        );
      })
      .sort((a, b) => {
        let valA, valB;
        if (sortField === "createdAt") {
          valA = a.createdAt?.toDate?.() ?? new Date(0);
          valB = b.createdAt?.toDate?.() ?? new Date(0);
        } else if (sortField === "total") {
          valA = a.total ?? 0;
          valB = b.total ?? 0;
        } else {
          valA = a[sortField] ?? "";
          valB = b[sortField] ?? "";
        }
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [orders, search, statusFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const statuses = ["pending", "processing", "shipped", "completed", "cancelled"];

  const statusData = statuses
    .map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: orders.filter((o) => o.status?.toLowerCase() === status).length,
    }))
    .filter((item) => item.value > 0);

  const pieColors = ["#2563EB", "#16A34A", "#EAB308", "#10B981", "#DC2626"]; // Blue, Green, Yellow, Teal, Red

  const revenueByDate = Object.values(
    orders.reduce((acc, order) => {
      const date =
        order.createdAt?.toDate?.()?.toLocaleDateString() ?? "Unknown";
      if (!acc[date]) acc[date] = { date, revenue: 0 };
      acc[date].revenue += order.total || 0;
      return acc;
    }, {})
  );

  const formatDateTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const cardColors = {
    totalOrders: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    revenue: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    completed: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin-products"
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-3 rounded-md font-semibold shadow-md transition"
          >
            Manage Products
          </Link>
         
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Total Orders",
            icon: <FiBox className="text-3xl mb-1" />,
            value: orders.length,
            color: cardColors.totalOrders,
          },
          {
            label: "Total Revenue",
            icon: <FiDollarSign className="text-3xl mb-1" />,
            value: `$${orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}`,
            color: cardColors.revenue,
          },
          {
            label: "Pending Orders",
            icon: <FiClock className="text-3xl mb-1" />,
            value: orders.filter((o) => o.status?.toLowerCase() === "pending").length,
            color: cardColors.pending,
          },
          {
            label: "Processing Orders",
            icon: <FiLoader className="text-3xl mb-1 animate-spin" />,
            value: orders.filter((o) => o.status?.toLowerCase() === "processing").length,
            color: cardColors.processing,
          },
          {
            label: "Shipped Orders",
            icon: <FiTruck className="text-3xl mb-1" />,
            value: orders.filter((o) => o.status?.toLowerCase() === "shipped").length,
            color: cardColors.shipped,
          },
          {
            label: "Completed Orders",
            icon: <FiCheckCircle className="text-3xl mb-1" />,
            value: orders.filter((o) => o.status?.toLowerCase() === "completed").length,
            color: cardColors.completed,
          },
          {
            label: "Cancelled Orders",
            icon: <FiXCircle className="text-3xl mb-1" />,
            value: orders.filter((o) => o.status?.toLowerCase() === "cancelled").length,
            color: cardColors.cancelled,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`${card.color} rounded-xl p-5 shadow flex flex-col items-center justify-center text-center`}
          >
            {card.icon}
            <p className="text-base font-medium">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <section className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-12">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4  top-0 bg-white dark:bg-gray-800 z-10 py-2">
          Orders
        </h3>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="search"
            placeholder="Search orders by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
            className="flex-grow min-w-[250px] p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition focus:ring-2 focus:ring-indigo-500"
            aria-label="Search orders"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // reset page when filtering
            }}
            className="p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition"
            aria-label="Filter orders by status"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300 py-20">
            No orders found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-300 dark:border-gray-700 rounded-lg">
                <thead className="bg-indigo-600 text-white sticky top-0">
                  <tr>
                    <th
                      className="p-3 cursor-pointer text-white"
                      onClick={() => handleSort("id")}
                    >
                      Order ID
                    </th>
                    <th
                      className="p-3 cursor-pointer text-white"
                      onClick={() => handleSort("name")}
                    >
                      Customer
                    </th>
                    <th
                      className="p-3 cursor-pointer text-white"
                      onClick={() => handleSort("email")}
                    >
                      Email
                    </th>
                    <th
                      className="p-3 cursor-pointer text-white"
                      onClick={() => handleSort("status")}
                    >
                      Status
                    </th>
                    <th
                      className="p-3 cursor-pointer text-white"
                      onClick={() => handleSort("createdAt")}
                    >
                      Date {sortField === "createdAt" ? (sortAsc ? "↑" : "↓") : ""}
                    </th>
                    <th
                      className="p-3 cursor-pointer text-white"
                      onClick={() => handleSort("total")}
                    >
                      Total {sortField === "total" ? (sortAsc ? "↑" : "↓") : ""}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-3 font-mono text-xs text-gray-800 dark:text-gray-100">{order.id}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-100">{order.name || "Unknown"}</td>
                      <td className="p-3 truncate max-w-xs text-gray-800 dark:text-gray-100">{order.email || "-"}</td>
                      <td className="p-3">
                        <StatusBadge status={order.status?.toLowerCase()} />
                      </td>
                      <td className="p-3 text-gray-800 dark:text-gray-100">
                        {order.createdAt?.toDate
                          ? formatDateTime(order.createdAt.toDate())
                          : "-"}
                      </td>
                      <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">
                        ${order.total?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center items-center space-x-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
              >
                Prev
              </button>
              <span className="text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

     {/* Charts Section */}
<section className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
    Analytics
  </h3>

  <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
    {/* Orders by Status - Pie Chart Card */}
    <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold mb-6 text-gray-900 dark:text-white">
        Orders by Status
      </h4>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            dataKey="value"
            data={statusData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={false}
          >
            {statusData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={pieColors[index % pieColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Revenue Over Time - Line Chart Card */}
    <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold mb-6 text-gray-900 dark:text-white">
        Revenue Over Time
      </h4>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={revenueByDate}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#4B5563" }}
            tickLine={false}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tick={{ fill: "#4B5563" }}
            tickLine={false}
            domain={["dataMin", "dataMax"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
            }}
            itemStyle={{ color: "#10B981" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: "#10B981" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</section>

      {/* Selected Order Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Order Details — {selectedOrder.id}
            </h2>
            <p className="mb-2 dark:text-gray-300">
              <strong>Customer:</strong> {selectedOrder.name || "Unknown"}
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>Email:</strong> {selectedOrder.email || "-"}
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>Status:</strong>{" "}
              <StatusBadge status={selectedOrder.status?.toLowerCase()} />
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>Date:</strong>{" "}
              {selectedOrder.createdAt?.toDate
                ? formatDateTime(selectedOrder.createdAt.toDate())
                : "-"}
            </p>
            <p className="mb-2 dark:text-gray-300 font-semibold text-lg">
              Total: ${selectedOrder.total?.toFixed(2) || "0.00"}
            </p>
            {/* Add more details or actions here */}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

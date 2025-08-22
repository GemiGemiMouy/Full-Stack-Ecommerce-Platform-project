import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { auth } from "../../firebase/config";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    async function fetchOrders() {
      const q = query(
        collection(db, "orders"),
        where("email", "==", auth.currentUser.email),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    }

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-800 bg-white shadow-sm"
            >
              <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Placed on {order.createdAt?.toDate().toLocaleString()}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.cart.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-indigo-600 dark:text-indigo-400">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 font-semibold text-gray-900 dark:text-white">
                Total: ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

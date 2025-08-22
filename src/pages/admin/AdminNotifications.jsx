import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(items);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id) => {
    try {
      const ref = doc(db, "notifications", id);
      await updateDoc(ref, { read: true });
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        All Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No notifications found.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 border rounded-md dark:border-gray-700 ${
                notif.read
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-indigo-50 dark:bg-indigo-900 font-semibold"
              } flex justify-between items-start gap-3`}
            >
              <div>
                <p className="text-sm text-gray-800 dark:text-white">{notif.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {notif.createdAt?.toDate
                    ? notif.createdAt.toDate().toLocaleString()
                    : ""}
                </p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-xs px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

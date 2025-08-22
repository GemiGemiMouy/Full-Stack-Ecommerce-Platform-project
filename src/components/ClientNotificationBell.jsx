import { useState, useEffect, useRef } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { Bell } from "lucide-react";

export default function ClientNotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(items);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    const notifDoc = doc(db, "notifications", id);
    await updateDoc(notifDoc, { read: true });
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Toggle notifications"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold select-none">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50">
          <h3 className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {notifications.length === 0 && (
            <p className="p-4 text-gray-500 dark:text-gray-400">No notifications</p>
          )}
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                !notif.read ? "bg-indigo-100 dark:bg-indigo-900 font-semibold" : ""
              } hover:bg-indigo-200 dark:hover:bg-indigo-700`}
              onClick={() => {
                if (!notif.read) markAsRead(notif.id);
                // Optionally navigate to order detail page:
                // navigate(`/order/${notif.orderId}`)
              }}
            >
              <p className="text-sm">{notif.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {notif.createdAt?.toDate
                  ? notif.createdAt.toDate().toLocaleString()
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

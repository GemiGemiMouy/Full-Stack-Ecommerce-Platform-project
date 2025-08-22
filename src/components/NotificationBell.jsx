import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { Bell } from "lucide-react";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [userId]);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Click outside dropdown to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Mark all as read when dropdown opens
  useEffect(() => {
    async function markAsRead() {
      const unread = notifications.filter((n) => !n.read);
      const batchPromises = unread.map((notif) => {
        const notifRef = doc(db, "notifications", notif.id);
        return updateDoc(notifRef, { read: true });
      });
      await Promise.all(batchPromises);
    }
    if (dropdownOpen && unreadCount > 0) {
      markAsRead();
    }
  }, [dropdownOpen, unreadCount, notifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((open) => !open)}
        className="relative focus:outline-none"
        aria-label="Toggle notifications"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50">
          <h4 className="font-semibold p-3 border-b border-gray-200 dark:border-gray-700 dark:text-white">
            Notifications
          </h4>
          {notifications.length === 0 ? (
            <p className="p-3 text-gray-600 dark:text-gray-400">No notifications.</p>
          ) : (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-default
                    ${notif.read ? "text-gray-500" : "font-semibold text-gray-900 dark:text-white"}`}
                >
                  {notif.message}
                  <br />
                  <small className="text-xs text-gray-400">
                    {notif.createdAt?.toDate
                      ? notif.createdAt.toDate().toLocaleString()
                      : ""}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

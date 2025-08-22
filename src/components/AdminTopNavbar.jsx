import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Sun, Moon } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import NotificationBell from "./NotificationBell";

export default function AdminTopNavbar({ darkMode, toggleDarkMode, user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathTitles = {
    "/admin-dashboard": "Dashboard",
    "/admin-products": "Products",
    "/admin-orders": "Orders",
    "/admin-settings": "Settings",
    "/admin/categories": "Categories",
    "/admin-notifications": "Notifications",
  };

  const currentTitle = pathTitles[location.pathname] || "Admin Panel";

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700 shadow-md sticky top-0 z-40">
      {/* Page Title */}
      <h1 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight select-none">
        {currentTitle}
      </h1>

      {/* Controls */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <NotificationBell userId={user?.uid} />

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle dark mode"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700" />
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold rounded-lg px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800 transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { Menu, X } from "lucide-react";
import AdminTopNavbar from "../components/AdminTopNavbar";

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Dark mode state, initialize from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Sync dark mode class on html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) navigate("/admin-login");
    });
    return () => unsubscribe();
  }, [navigate]);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", (!prev).toString());
      return !prev;
    });
  };

  const handleNavClick = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 shadow-md
          overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col
        `}
        style={{ top: 0, bottom: 0 }}
      >
        <div className="p-6 font-bold text-2xl text-indigo-600 dark:text-indigo-400 flex justify-between items-center">
          AdminPanel
          {/* Close button on mobile */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              isActive
                ? "block py-2 px-3 rounded bg-indigo-600 text-white font-semibold"
                : "block py-2 px-3 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 dark:text-gray-300 text-gray-700"
            }
            onClick={handleNavClick}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              isActive
                ? "block py-2 px-3 rounded bg-indigo-600 text-white font-semibold"
                : "block py-2 px-3 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 dark:text-gray-300 text-gray-700"
            }
            onClick={handleNavClick}
          >
            Categories
          </NavLink>

          <NavLink
            to="/admin-products"
            className={({ isActive }) =>
              isActive
                ? "block py-2 px-3 rounded bg-indigo-600 text-white font-semibold"
                : "block py-2 px-3 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 dark:text-gray-300 text-gray-700"
            }
            onClick={handleNavClick}
          >
            Products
          </NavLink>

          <NavLink
            to="/admin-orders"
            className={({ isActive }) =>
              isActive
                ? "block py-2 px-3 rounded bg-indigo-500 text-white font-semibold"
                : "block py-2 px-3 rounded hover:bg-indigo-100 dark:hover:bg-gray-700 dark:text-gray-300 text-gray-700"
            }
            onClick={handleNavClick}
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin-settings"
            className={({ isActive }) =>
              isActive
                ? "block py-2 px-3 rounded bg-indigo-600 text-white font-semibold"
                : "block py-2 px-3 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 dark:text-gray-300 text-gray-700"
            }
            onClick={handleNavClick}
          >
            Settings
          </NavLink>
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-semibold uppercase select-none">
              {user?.displayName
                ? user.displayName.charAt(0)
                : user?.email?.charAt(0)}
            </div>
            <div className="flex-1 text-gray-900 dark:text-gray-200 font-medium truncate select-text">
              {user?.displayName || user?.email}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with hamburger for mobile */}
        <header className="md:hidden flex items-center justify-between bg-white dark:bg-gray-900 p-4 shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">
            AdminPanel
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-auto">
          {/* Pass dark mode props here */}
          <AdminTopNavbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            user={user}
          />
          <main className="flex-1 p-6 overflow-auto bg-white dark:bg-gray-900">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

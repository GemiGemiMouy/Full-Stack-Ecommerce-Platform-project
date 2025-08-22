// ClientNavbar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ShoppingCart, Menu, X, Sun, Moon, LogOut, UserCog } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ClientNotificationBell from "../components/ClientNotificationBell";

function UserAvatar({ user, onClick }) {
  const initial = (user?.displayName || user?.email || "U").charAt(0).toUpperCase();
  return user?.photoURL ? (
    <img
      src={user.photoURL}
      onClick={onClick}
      className="w-9 h-9 rounded-full border-2 border-indigo-500 cursor-pointer object-cover"
      alt="User avatar"
    />
  ) : (
    <div
      onClick={onClick}
      className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg shadow cursor-pointer"
    >
      {initial}
    </div>
  );
}

export default function ClientNavbar({ cartCount }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("darkMode", next.toString());
      return next;
    });
  };

  const handleLogout = () => {
    signOut(auth);
    setMenuOpen(false);
  };

  const navLink = "hover:text-indigo-500 dark:hover:text-indigo-300 transition font-semibold";

  return (
    <nav className="bg-white dark:bg-[#212352] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Logo */}
        <Link
          to="/"
          className="text-indigo-600 dark:text-white font-extrabold text-3xl tracking-tight select-none"
        >
          ModaioFashion
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 dark:text-gray-200 ">
          <Link to="/" className={navLink}>Home</Link>
          <Link to="/wishlist" className={navLink}>Wishlist</Link>
          <Link to="/my-orders" className={navLink}>My Orders</Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs px-1.5 font-semibold shadow">
                {cartCount}
              </span>
            )}
          </Link>
          <ClientNotificationBell />

          {/* Avatar + Dropdown */}
          {user ? (
            <div className="relative">
              <UserAvatar user={user} onClick={() => setShowDropdown((prev) => !prev)} />
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-40"
                >
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4 inline" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold">Login</Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden text-gray-700 dark:text-gray-300">
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Right Side Drawer (Mobile) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-[#212352] z-50 shadow-lg p-6 flex flex-col gap-4"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "tween" }}
            >
              <div className="flex justify-between items-center mb-6 ">
                <span className="font-bold text-xl text-indigo-600 dark:text-white">Menu</span>
                <X className="cursor-pointer" onClick={() => setMenuOpen(false)} />
              </div>

              <Link to="/" onClick={() => setMenuOpen(false)} className={navLink}>Home</Link>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)} className={navLink}>Wishlist</Link>
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className={navLink}>My Orders</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className={navLink}>
                Cart ({cartCount})
              </Link>

              <ClientNotificationBell />

              {user ? (
                <>
                  <div className="border-t pt-4 mt-4">
                    <span className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      {user.displayName || user.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold">Login</Link>
              )}

              <button
                onClick={toggleDarkMode}
                className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded flex items-center gap-2 justify-center"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

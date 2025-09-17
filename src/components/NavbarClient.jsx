import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  UserCog, 
  Sun, 
  Moon,
  Heart,
  Package,
  ChevronDown,
  Sparkles,
  Bell
} from 'lucide-react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ClientNotificationBell from './ClientNotificationBell';

export default function NavbarClient({ cartItems = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const categoriesRef = useRef(null);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Dark mode effect
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Auth state effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen for profile updates
  useEffect(() => {
    const handleStorageChange = () => {
      // Refresh user data when profile is updated
      if (auth.currentUser) {
        setUser({ ...auth.currentUser });
      }
    };

    // Listen for custom events or storage changes
    window.addEventListener('profileUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, []);

  // Click outside effect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const UserAvatar = ({ user, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        )}
      </div>
    </button>
  );

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
        {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
        <Link
          to="/"
          className="flex items-center space-x-1 sm:space-x-2 text-indigo-600 dark:text-white font-extrabold text-lg sm:text-xl lg:text-2xl tracking-tight select-none transition-all duration-300"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-indigo-600 dark:text-indigo-400" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-sm opacity-30"></div>
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
            ModaioFashion
          </span>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:hidden">
            MF
          </span>
        </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-4 xl:space-x-6">
              <Link 
                to="/" 
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/products" 
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group"
              >
                <span className="relative z-10">Products</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/about" 
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group"
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group"
                >
                  <Package className="w-4 h-4" />
                  <span>Categories</span>
                  <motion.div
                    animate={{ rotate: showCategoriesDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {showCategoriesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40 backdrop-blur-sm"
                    >
                      <div className="p-2">
                        <Link
                          to="/products"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-200"
                          onClick={() => setShowCategoriesDropdown(false)}
                        >
                          <Package className="w-4 h-4 text-indigo-500" />
                          <span>All Products</span>
                        </Link>
                        <Link
                          to="/products?category=men"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-200"
                          onClick={() => setShowCategoriesDropdown(false)}
                        >
                          <User className="w-4 h-4 text-blue-500" />
                          <span>Men's Fashion</span>
                        </Link>
                        <Link
                          to="/products?category=women"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-200"
                          onClick={() => setShowCategoriesDropdown(false)}
                        >
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span>Women's Fashion</span>
                        </Link>
                        <Link
                          to="/products?category=accessories"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-200"
                          onClick={() => setShowCategoriesDropdown(false)}
                        >
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>Accessories</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Wishlist - Hidden on small screens */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
              <Link to="/wishlist" className="relative group">
                <div className="p-2 sm:p-3 rounded-full hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300" />
                </div>
              </Link>
            </motion.div>
            
            {/* Orders - Hidden on small screens */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
              <Link to="/my-orders" className="relative group">
                <div className="p-2 sm:p-3 rounded-full hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                </div>
              </Link>
            </motion.div>
            
            {/* Cart - Always visible */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/cart" className="relative group">
                <div className="p-2 sm:p-3 rounded-full hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                </div>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 font-bold shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            
            {/* Notifications - Hidden on small screens */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
              <ClientNotificationBell />
            </motion.div>

            {/* User Section */}
            {user ? (
              <div className="relative ml-1 sm:ml-2" ref={dropdownRef}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <UserAvatar user={user} onClick={() => setShowDropdown((prev) => !prev)} />
                </motion.div>
                
                <AnimatePresence>
              {showDropdown && (
                <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 backdrop-blur-sm"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-2">
                  <Link
                    to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                          <UserCog className="w-4 h-4 text-indigo-500" />
                          <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 rounded-xl transition-all duration-200"
                  >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                  </button>
                      </div>
                </motion.div>
              )}
                </AnimatePresence>
            </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Login</span>
                  <span className="sm:hidden">Sign In</span>
                </Link>
              </motion.div>
            )}

            {/* Dark Mode Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 rounded-full hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:to-orange-900/20 transition-all duration-300 group"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-12 transition-transform duration-300" />
                )}
              </button>
            </motion.div>
        </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/cart" className="relative p-2 sm:p-3 rounded-full hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs px-1.5 py-0.5 font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button 
                onClick={() => setMenuOpen(true)} 
                className="p-2 sm:p-3 rounded-full hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-72 sm:w-80 h-full bg-white dark:bg-gray-900 z-50 shadow-2xl p-4 sm:p-6 flex flex-col"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Menu
                  </span>
                </div>
                <motion.button 
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 space-y-1">
                {/* Main Navigation */}
                <Link 
                  to="/" 
                  onClick={() => setMenuOpen(false)} 
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                >
                  <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Home</span>
                </Link>
                
                <Link 
                  to="/products" 
                  onClick={() => setMenuOpen(false)} 
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                >
                  <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Products</span>
                </Link>
                
                <Link 
                  to="/about" 
                  onClick={() => setMenuOpen(false)} 
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">About</span>
                </Link>

                {/* Categories Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Categories</span>
                    </div>
                    <motion.div
                      animate={{ rotate: showCategoriesDropdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {showCategoriesDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-2 space-y-1 overflow-hidden"
                      >
                        <Link
                          to="/products"
                          onClick={() => {
                            setMenuOpen(false);
                            setShowCategoriesDropdown(false);
                          }}
                          className="flex items-center space-x-3 p-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-200"
                        >
                          <Package className="w-4 h-4 text-indigo-500" />
                          <span>All Products</span>
                        </Link>
                        <Link
                          to="/products?category=men"
                          onClick={() => {
                            setMenuOpen(false);
                            setShowCategoriesDropdown(false);
                          }}
                          className="flex items-center space-x-3 p-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-200"
                        >
                          <User className="w-4 h-4 text-blue-500" />
                          <span>Men's Fashion</span>
                        </Link>
                        <Link
                          to="/products?category=women"
                          onClick={() => {
                            setMenuOpen(false);
                            setShowCategoriesDropdown(false);
                          }}
                          className="flex items-center space-x-3 p-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-200"
                        >
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span>Women's Fashion</span>
                        </Link>
                        <Link
                          to="/products?category=accessories"
                          onClick={() => {
                            setMenuOpen(false);
                            setShowCategoriesDropdown(false);
                          }}
                          className="flex items-center space-x-3 p-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-200"
                        >
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>Accessories</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>

                {/* Action Items */}
                <Link 
                  to="/wishlist" 
                  onClick={() => setMenuOpen(false)} 
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Wishlist</span>
                </Link>
                
                <Link 
                  to="/my-orders" 
                  onClick={() => setMenuOpen(false)} 
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                >
                  <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">My Orders</span>
              </Link>

                <div className="p-4">
              <ClientNotificationBell />
                </div>
              </div>

              {/* User Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
              {user ? (
                <>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                      <UserAvatar user={user} onClick={() => {}} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300"
                    >
                      <UserCog className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">My Profile</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-600 dark:text-red-400 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-semibold">Logout</span>
                    </button>
                </>
              ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setMenuOpen(false)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Login
                  </Link>
                )}

                {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-900/30 dark:hover:to-orange-900/30 transition-all duration-300"
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Dark Mode</span>
                    </>
                  )}
              </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}  
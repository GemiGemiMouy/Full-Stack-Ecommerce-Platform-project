import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import ClientLayout from "./components/ClientLayout";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";

// Client Pages
import Home from "./pages/client/Home";
import Products from "./pages/client/Products";
import Cart from "./pages/client/Cart";
import Checkout from "./pages/client/Checkout";
import About from "./pages/client/About";
import Wishlist from "./pages/client/Wishlist";
import MyOrders from "./pages/client/MyOrders";
import Profile from "./pages/client/Profile";
import LoginPage from "./pages/client/LoginPage";
import RegisterPage from "./pages/client/RegisterPage";
import ProductDetails from "./pages/client/ProductDetails";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminNotifications from "./pages/admin/AdminNotifications";

export default function App({ darkMode, toggleDarkMode }) {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item with quantity
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = newQuantity;
      return updatedItems;
    });
  };

  return (
    <Routes>
      {/* Client Side */}
      <Route
        element={
          <ClientLayout
            cartItems={cartItems}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        }
      >
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route
          path="/products"
          element={<Products onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart 
              cart={cartItems} 
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          }
        />
        <Route path="/checkout" element={<Checkout cart={cartItems} />} />
        <Route path="/wishlist" element={<Wishlist onAddToCart={handleAddToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:id" element={<ProductDetails onAddToCart={handleAddToCart} />} />
      </Route>

      {/* Admin Side */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        element={
          <AdminRoute>
            <AdminLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </AdminRoute>
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-products" element={<AdminProducts />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin-notifications" element={<AdminNotifications />} />
      </Route>
    </Routes>
  );
}

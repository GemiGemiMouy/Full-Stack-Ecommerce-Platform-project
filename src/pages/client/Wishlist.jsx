import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Heart, ShoppingCart, Eye, Trash2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

export default function WishlistPage({ onAddToCart }) {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return; // Wait for auth state to be determined
    
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchWishlist() {
      try {
        setLoading(true);
        const wishlistColRef = collection(db, "users", user.uid, "wishlist");
        const wishlistSnapshot = await getDocs(wishlistColRef);
        
        // The wishlist documents already contain the product data
        const products = wishlistSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setWishlistProducts(products);
        setError(null);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError("Failed to load wishlist. Please try again.");
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [user, authLoading]);

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    
    try {
      setRemovingItem(productId);
      await deleteDoc(doc(db, "users", user.uid, "wishlist", productId));
      setWishlistProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove item from wishlist. Please try again.");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
      setSuccessMessage(`${product.name} added to cart!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md mx-4">
          <Heart className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please log in to view and manage your wishlist.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {authLoading ? "Checking authentication..." : "Loading your wishlist..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
            <Heart className="w-4 h-4 mr-2" />
            Your Favorites
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Save your favorite items and come back to them anytime. Your personal collection of style.
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 dark:text-red-400 hover:underline text-sm"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-green-600 dark:text-green-400 text-center">{successMessage}</p>
          </motion.div>
        )}

        {/* Wishlist Content */}
        {wishlistProducts.length === 0 && !error ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Start adding items you love to your wishlist and they'll appear here.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Products
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Wishlist Stats */}
            <motion.div
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'} in Wishlist
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Save items you love for later
                  </p>
                </div>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                  Add More Items
                </button>
              </div>
            </motion.div>

            {/* Product Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <AnimatePresence>
                {wishlistProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          disabled={removingItem === product.id}
                          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {removingItem === product.id ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Heart className="w-5 h-5 text-red-500 fill-current" />
                          )}
                        </button>
                      </div>
                      {product.isNew && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            New
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                            ({product.rating})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${product.price}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProduct(product.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

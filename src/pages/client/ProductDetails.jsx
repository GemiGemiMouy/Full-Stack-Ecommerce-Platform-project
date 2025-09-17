import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Share2, 
  ArrowLeft,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../../firebase/wishlist";
import ProductCard from "../../components/ProductCard";
import Footer from "../../components/Footer";

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch product and reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const productData = { id: snap.id, ...snap.data() };
          setProduct(productData);
          
          // Check if product is in wishlist
          if (user) {
            const inWishlist = await isInWishlist(user.uid, id);
            setIsInWishlistState(inWishlist);
          }
        } else {
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onSnapshot(
      collection(db, "products", id, "reviews"),
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(fetchedReviews);
      }
    );

    fetchProduct();
    return () => unsubscribe();
  }, [id, user, navigate]);

  // Fetch related products
  useEffect(() => {
    if (product?.category) {
      const q = query(
        collection(db, "products"),
        where("category", "==", product.category)
      );
      getDocs(q).then((snap) => {
        const items = snap.docs
          .filter((doc) => doc.id !== id)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setRelated(items);
      });
    }
  }, [product, id]);

  const handleAddReview = async () => {
    if (!user) {
      setSuccessMessage("Please login to leave a review.");
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }
    if (!reviewText.trim()) return;

    try {
      await addDoc(collection(db, "products", id, "reviews"), {
        userId: user.uid,
        userName: user.displayName || user.email,
        rating,
        reviewText,
        timestamp: new Date(),
      });

      setReviewText("");
      setRating(5);
      setSuccessMessage("Review submitted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error adding review:", error);
      setSuccessMessage("Failed to submit review. Please try again.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setSuccessMessage("Please login to add items to cart.");
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }
    
    try {
      setAddingToCart(true);
      
      if (onAddToCart) {
        // Use the parent's add to cart function
        for (let i = 0; i < quantity; i++) {
          onAddToCart(product);
        }
        setSuccessMessage(`${quantity} item(s) added to cart!`);
      } else {
        // Fallback to direct Firebase cart
        const cartItemRef = doc(db, "users", user.uid, "cart", id);
        await setDoc(cartItemRef, {
          productId: id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          addedAt: new Date(),
        });
        setSuccessMessage(`${quantity} item(s) added to cart!`);
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSuccessMessage("Failed to add to cart. Please try again.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      setSuccessMessage("Please login to manage your wishlist.");
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    try {
      setWishlistLoading(true);
      if (isInWishlistState) {
        await removeFromWishlist(user.uid, id);
        setIsInWishlistState(false);
        setSuccessMessage("Removed from wishlist!");
      } else {
        await addToWishlist(user.uid, product);
        setIsInWishlistState(true);
        setSuccessMessage("Added to wishlist!");
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setSuccessMessage("Failed to update wishlist. Please try again.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setSuccessMessage("Link copied to clipboard!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors duration-300"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;
  const productImages = product.images ? [product.image, ...product.images] : [product.image];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              {successMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </motion.button>

        {/* Product Info */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : productImages.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev < productImages.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}
              {product.isNew && (
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    New
                  </span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                      selectedImage === index 
                        ? "border-indigo-500" 
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-300">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-600 dark:text-gray-300">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock || 10, prev + 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                  isInWishlistState
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {wishlistLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Heart className={`w-5 h-5 ${isInWishlistState ? 'fill-current' : ''}`} />
                )}
                {isInWishlistState ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
            >
              <Share2 className="w-5 h-5" />
              Share Product
            </button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Free Shipping</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Secure Payment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Easy Returns</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.section
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Customer Reviews</h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">No reviews yet</p>
              <p className="text-gray-500 dark:text-gray-400">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{review.userName}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.timestamp?.toDate?.() || review.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.reviewText}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add Review Form */}
          {user ? (
            <motion.div
              className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Leave a Review</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                          i <= rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
                        }`}
                        onClick={() => setRating(i)}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  onClick={handleAddReview}
                  disabled={!reviewText.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Want to leave a review?</p>
              <button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-300"
              >
                Login to Review
              </button>
            </div>
          )}
        </motion.section>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ProductCard
                    product={item}
                    onAddToCart={() => onAddToCart?.(item)}
                    userId={user?.uid}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../firebase/wishlist";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, onAddToCart, isNew, userId }) {
  if (!product || typeof product !== "object") return null;

  const navigate = useNavigate();

  const rating = product.rating ?? 4;
  const [favorited, setFavorited] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  useEffect(() => {
    async function checkWishlist() {
      if (!userId) {
        setFavorited(false);
        setLoadingWishlist(false);
        return;
      }
      const exists = await isInWishlist(userId, product.id);
      setFavorited(exists);
      setLoadingWishlist(false);
    }
    checkWishlist();
  }, [userId, product.id]);

  const toggleFavorite = async () => {
    if (!userId) {
      alert("Please log in to manage your wishlist.");
      return;
    }
    setLoadingWishlist(true);
    try {
      if (favorited) {
        await removeFromWishlist(userId, product.id);
        setFavorited(false);
      } else {
        await addToWishlist(userId, product);
        setFavorited(true);
        navigate("/wishlist");
      }
    } catch (error) {
      alert("Failed to update wishlist.");
      console.error("Wishlist error:", error);
    }
    setLoadingWishlist(false);
  };

  const goToProductDetail = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700/50 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500/60 transition-all duration-300 flex flex-col relative">
      <div className="relative overflow-hidden cursor-pointer" onClick={goToProductDetail}>
        {isNew && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg z-10">
            New
          </span>
        )}
        <img
          src={product.image || "/placeholder.jpg"}
          alt={product.name || "Product Image"}
          className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent click bubbling
            toggleFavorite();
          }}
          disabled={loadingWishlist}
          className={`absolute top-3 right-3 p-1 rounded-full bg-white dark:bg-gray-800 shadow text-gray-400 hover:text-red-500 transition flex items-center justify-center w-8 h-8 ${
            favorited ? "text-red-500" : ""
          }`}
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          {favorited ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3
          onClick={goToProductDetail}
          className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:underline"
        >
          {product.name || "Unnamed Product"}
        </h3>

        <div className="flex space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
        </div>

        <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-xl mb-6">
          ${product.price?.toFixed(2) || "0.00"}
        </p>

        <button
          onClick={() => onAddToCart(product)}
          className="bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

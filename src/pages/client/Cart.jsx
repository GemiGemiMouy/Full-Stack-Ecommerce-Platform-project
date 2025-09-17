import React from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Minus, Plus } from "lucide-react";

export default function Cart({ cart, onRemoveFromCart, onUpdateQuantity }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveFromCart(index);
    } else {
      onUpdateQuantity(index, newQuantity);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg shadow-sm dark:bg-gray-800 bg-white"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold">
                    ${item.price.toFixed(2)} each
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => onRemoveFromCart(index)}
                  className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-8 pt-6 border-t dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Total: ${total.toFixed(2)}
            </p>
            <Link
              to="/checkout"
              className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Go to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

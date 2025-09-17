import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModernDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
  disabled = false,
  icon: Icon,
  variant = "default", // default, filter, sort
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const getVariantStyles = () => {
    switch (variant) {
      case "filter":
        return {
          button: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-indigo-500 dark:hover:border-indigo-400",
          dropdown: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl",
          option: "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        };
      case "sort":
        return {
          button: "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-indigo-200 dark:border-gray-600 text-indigo-700 dark:text-indigo-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-gray-700 dark:hover:to-gray-600",
          dropdown: "bg-white dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 shadow-xl",
          option: "hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        };
      default:
        return {
          button: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-indigo-500 dark:hover:border-indigo-400",
          dropdown: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl",
          option: "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-xl
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          ${styles.button}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5" />}
          <span className="text-sm font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute top-full left-0 right-0 mt-2 z-50
              rounded-xl overflow-hidden
              ${styles.dropdown}
            `}
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 text-left
                    transition-colors duration-200
                    ${styles.option}
                    ${index === 0 ? 'rounded-t-xl' : ''}
                    ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                  `}
                  whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    {option.icon && <option.icon className="w-4 h-4" />}
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernDropdown;



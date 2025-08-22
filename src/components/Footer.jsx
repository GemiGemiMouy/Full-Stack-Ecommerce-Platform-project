import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 pt-16 pb-10 px-6 md:px-20 border-t border-gray-200 dark:border-gray-700 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="space-y-4">
         <Link
          to="/"
          className="text-indigo-600 dark:text-white font-extrabold text-3xl tracking-tight select-none"
        >
          ModaioFashion
        </Link>
          <p className="text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">
            Elevate your style with curated fashion trends. Confidence starts here.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-lg font-semibold mb-6 uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Explore
          </h3>
          <ul className="space-y-4 text-sm font-medium">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Shop" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="relative group inline-block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {label}
                  <span
                    className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all group-hover:w-full"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-lg font-semibold mb-6 uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Customer Care
          </h3>
          <ul className="space-y-4 text-sm font-medium">
            {[
              { href: "#", label: "FAQs" },
              { href: "#", label: "Returns & Exchanges" },
              { href: "#", label: "Privacy Policy" },
              { href: "#", label: "Terms & Conditions" },
            ].map(({ href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  className="relative group inline-block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {label}
                  <span
                    className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all group-hover:w-full"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-6 uppercase tracking-wide text-gray-900 dark:text-gray-100">
            Follow Us
          </h3>
          <div className="flex space-x-6 text-indigo-600 dark:text-gray-200">
            <SocialLinkFacebook />
            <SocialLinkInstagram />
            <SocialLinkYoutube />
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} ModaioFashion. All rights reserved.
      </div>
    </footer>
  );
}

// Modern minimalist Facebook icon
function SocialLinkFacebook() {
  return (
    <a
      href="https://facebook.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      className="hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    </a>
  );
}

// Modern minimalist Instagram icon
function SocialLinkInstagram() {
  return (
    <a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1={17.5} y1={6.5} x2={17.5} y2={6.5} />
      </svg>
    </a>
  );
}

// Modern minimalist YouTube icon
function SocialLinkYoutube() {
  return (
    <a
      href="https://youtube.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="YouTube"
      className="hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29.56 29.56 0 0 0 1 12a29.56 29.56 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95c1.71.47 8.59.47 8.59.47s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29.56 29.56 0 0 0 23 12a29.56 29.56 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    </a>
  );
}

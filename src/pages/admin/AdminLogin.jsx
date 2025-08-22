import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const adminEmails = ["admin@example.com", "seakmouyseng89@gmail.com"];

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    console.log("Attempting login with:", email);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if user email is authorized admin
      if (!adminEmails.includes(user.email)) {
        setError("Unauthorized - Not an admin");
        await signOut(auth);
        return;
      }

      // Update displayName if missing
      if (!user.displayName) {
        await updateProfile(user, {
          displayName: "Admin User",
        });
      }

      // Redirect to admin dashboard on success
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Login error:", err);

      // Friendly error messages based on error codes
      switch (err.code) {
        case "auth/user-not-found":
          setError("User not found. Please check your email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/user-disabled":
          setError("User account is disabled.");
          break;
        default:
          setError(err.message);
          break;
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Admin Login
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

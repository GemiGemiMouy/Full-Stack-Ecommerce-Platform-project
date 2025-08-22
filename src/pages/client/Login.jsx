import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../firebase/config";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
      <input
        type="email"
        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={loginWithEmail}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Login with Email
      </button>

      <div className="text-center text-gray-500">or</div>

      <button
        onClick={loginWithGoogle}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Continue with Google
      </button>
    </div>
  );
}

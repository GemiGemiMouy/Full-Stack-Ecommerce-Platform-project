import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Login</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Login</button>
      </form>
    </div>
  );
}

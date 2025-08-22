import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";

const adminEmails = ["admin@example.com", "seakmouyseng89@gmail.com"];

export default function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || user === null) return <div>Loading...</div>;

  if (!user) return <Navigate to="/admin-login" replace />;

  if (!adminEmails.includes(user.email)) return <Navigate to="/" replace />;

  return children;
}

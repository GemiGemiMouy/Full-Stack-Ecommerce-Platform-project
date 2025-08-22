import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);
  return user;
}

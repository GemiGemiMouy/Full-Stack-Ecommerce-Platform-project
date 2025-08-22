import { db } from "./config";
import { 
  doc, setDoc, deleteDoc, getDoc, collection, onSnapshot 
} from "firebase/firestore";

export async function addToWishlist(userId, product) {
  const wishlistDocRef = doc(db, "users", userId, "wishlist", product.id);
  await setDoc(wishlistDocRef, {
    ...product,
    addedAt: new Date(),
  });
}

export async function removeFromWishlist(userId, productId) {
  const wishlistDocRef = doc(db, "users", userId, "wishlist", productId);
  await deleteDoc(wishlistDocRef);
}

export async function isInWishlist(userId, productId) {
  const docRef = doc(db, "users", userId, "wishlist", productId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export function listenToWishlist(userId, callback) {
  const wishlistRef = collection(db, "users", userId, "wishlist");
  return onSnapshot(wishlistRef, (snapshot) => {
    const wishlist = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(wishlist);
  });
}

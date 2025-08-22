import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, doc } from "firebase/firestore";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    async function fetchWishlist() {
      const wishlistColRef = collection(db, "users", user.uid, "wishlist");
      const wishlistSnapshot = await getDocs(wishlistColRef);
      const productIds = wishlistSnapshot.docs.map(doc => doc.id);

      // Now fetch product details
      const productPromises = productIds.map(async (productId) => {
        const productDocs = await getDocs(doc(db, "products", productId));
        return productDocs.exists() ? { id: productDocs.id, ...productDocs.data() } : null;
      });

      const products = (await Promise.all(productPromises)).filter(Boolean);
      setWishlistProducts(products);
    }

    fetchWishlist();
  }, [user]);

  if (!user) return <p>Please log in to view your wishlist.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your Wishlist</h1>
      {wishlistProducts.length === 0 ? (
       <p className="text-gray-600 dark:text-gray-300">No products in wishlist.</p>
      ) : (
        <ul>
          {wishlistProducts.map(product => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Star } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [user] = useAuthState(auth);

  // Fetch product and reviews
  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    };

    const unsubscribe = onSnapshot(
      collection(db, "products", id, "reviews"),
      (snapshot) => {
        const fetchedReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(fetchedReviews);
      }
    );

    fetchProduct();
    return () => unsubscribe();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (product?.category) {
      const q = query(
        collection(db, "products"),
        where("category", "==", product.category)
      );
      getDocs(q).then((snap) => {
        const items = snap.docs
          .filter((doc) => doc.id !== id)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setRelated(items);
      });
    }
  }, [product, id]);

  const handleAddReview = async () => {
    if (!user) return alert("Please login to review.");
    if (!reviewText.trim()) return;

    await addDoc(collection(db, "products", id, "reviews"), {
      userId: user.uid,
      userName: user.displayName || user.email,
      rating,
      reviewText,
      timestamp: new Date(),
    });

    setReviewText("");
    setRating(5);
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first.");
      return;
    }
    try {
      const cartItemRef = doc(db, "users", user.uid, "cart", id);
      await setDoc(cartItemRef, {
        productId: id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        addedAt: new Date(),
      });
      alert("Added to cart!");
    } catch (error) {
      console.error(error);
      alert("Error adding to cart.");
    }
  };

  if (!product) return <div className="p-4 text-center">Loading...</div>;

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-xl max-h-[500px] object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-indigo-600 font-semibold mb-4">
            ${product.price}
          </p>
          <p className="mb-2 text-gray-700">{product.description}</p>
          <p className="text-sm text-gray-500">
            Stock: {product.stock ?? "Available"}
          </p>

          <div className="flex items-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                fill={i < averageRating ? "gold" : "none"}
                stroke="gold"
              />
            ))}
            <span className="text-sm text-gray-600">
              ({reviews.length} reviews)
            </span>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Add to Cart
            </button>
            <button className="border px-4 py-2 rounded-xl hover:bg-gray-100 transition">
              💖 Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>
        {reviews.map((r) => (
          <div key={r.id} className="border-b pb-3 mb-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < r.rating ? "gold" : "none"}
                  stroke="gold"
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{r.userName}</span>
            </div>
            <p className="text-sm mt-1 text-gray-800">{r.reviewText}</p>
          </div>
        ))}

        {/* Add Review Form */}
        {user && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Leave a Review</h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setRating(i)}
                  fill={i <= rating ? "gold" : "none"}
                  stroke="gold"
                />
              ))}
            </div>
            <textarea
              rows="3"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Your review..."
              className="w-full border p-2 rounded mb-2"
            />
            <button
              onClick={handleAddReview}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-2 hover:shadow transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded"
                />
                <h4 className="mt-2 text-sm font-medium">{item.name}</h4>
                <p className="text-sm text-indigo-600">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

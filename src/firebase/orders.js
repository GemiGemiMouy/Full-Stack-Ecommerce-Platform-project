// src/firebase/orders.js
import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function placeOrder(orderData) {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp(),
    });
    console.log("Order placed with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error placing order: ", e);
    throw e;
  }
}

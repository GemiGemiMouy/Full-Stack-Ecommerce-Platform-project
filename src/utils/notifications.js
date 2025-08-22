// src/utils/notifications.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config"; // adjust if needed

export async function createNotification(userId, orderId, newStatus) {
  if (!userId) {
    console.warn("No userId provided for notification");
    return;
  }

  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      orderId,
      message: `Your order ${orderId} status has been updated to "${newStatus}".`,
      read: false,
      createdAt: serverTimestamp(),
    });
    console.log("Notification created successfully");
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

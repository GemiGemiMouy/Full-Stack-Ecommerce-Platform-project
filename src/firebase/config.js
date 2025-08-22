import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRvFKxwAlInQpB0whssVBgh4leZr4rtw4",
  authDomain: "ecommerce-store-70a5a.firebaseapp.com",
  projectId: "ecommerce-store-70a5a",
  storageBucket: "ecommerce-store-70a5a.appspot.com",   
  messagingSenderId: "866013676891",
  appId: "1:866013676891:web:c9d81210d3dee760a6467e",
  measurementId: "G-5QVC2WKJMV",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const auth = getAuth(app);
export { provider };

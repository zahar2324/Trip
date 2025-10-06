
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyBpjLuDCuDKucA38FG0DUrAiS3zT476nTU",
  authDomain: "trip-5cd8e.firebaseapp.com",
  projectId: "trip-5cd8e",
  storageBucket: "trip-5cd8e.firebasestorage.app",
  messagingSenderId: "850332219503",
  appId: "1:850332219503:web:7dddf1e2cf7114d456f59a",
  measurementId: "G-14224K9W3D"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

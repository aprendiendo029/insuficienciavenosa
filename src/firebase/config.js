import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCa2AbwmvmCKKT9rj20qmEY8VWDJnFg4K8",
  authDomain: "gastosmedicosjmp.firebaseapp.com",
  projectId: "gastosmedicosjmp",
  storageBucket: "gastosmedicosjmp.firebasestorage.app",
  messagingSenderId: "463957753901",
  appId: "1:463957753901:web:6d40a252628db8e46d38a4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
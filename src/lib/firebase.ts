import { initializeApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCedoRqKf19wSxE9Uq6iT5uRKsZBLiv3kE",
  authDomain: "stok-7278b.firebaseapp.com",
  projectId: "stok-7278b",
  storageBucket: "stok-7278b.firebasestorage.app",
  messagingSenderId: "702831744223",
  appId: "1:702831744223:web:db994c6b1df5b1f820c56a",
  measurementId: "G-VMWF3G71ZT",
};

// Prevent duplicate initialization in Next.js dev mode
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = typeof window !== 'undefined' ? getAuth(app) : null as unknown as Auth;

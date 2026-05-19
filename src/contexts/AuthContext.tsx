"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AUTHORIZED_EMAIL } from "@/lib/constants";
import { useRouter } from "next/navigation";

export interface Personnel {
  id?: string;
  name: string;
  title: string;
  tcNo?: string;
  password?: string;
  email: string;
  role?: "super_admin" | "personnel";
  status?: "pending" | "approved" | "rejected";
  createdAt?: number;
}

interface AuthContextType {
  user: User | null;
  personnel: Personnel | null;
  loading: boolean;
  loginError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithPassword: (personnelId: string, password: string) => Promise<void>;
  registerPersonnel: (data: {
    name: string;
    title: string;
    tcNo: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedPersonnel = localStorage.getItem("sydv_personnel");
    if (savedPersonnel) {
      try {
        setPersonnel(JSON.parse(savedPersonnel));
      } catch (e) {
        console.error("Local storage parse error", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        setPersonnel(null);
        localStorage.removeItem("sydv_personnel");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoginError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setLoginError(errorMessage);
      throw error;
    }
  };

  const loginWithPassword = async (personnelId: string, password: string) => {
    const res = await fetch("/api/personnel");
    if (!res.ok) throw new Error("Personel listesi alınamadı.");
    const allPersonnel: Personnel[] = await res.json();
    const found = allPersonnel.find((p) => p.id === personnelId);
    
    if (!found || found.password !== password) {
      throw new Error("Hatalı şifre.");
    }
    if (found.status !== "approved") {
      throw new Error("Hesabınız henüz onaylanmadı. Lütfen yönetici onayını bekleyin.");
    }
    setPersonnel(found);
    localStorage.setItem("sydv_personnel", JSON.stringify(found));
  };


  const registerPersonnel = async (data: {
    name: string;
    title: string;
    tcNo: string;
    password: string;
  }) => {
    if (!user) throw new Error("Önce Google ile giriş yapmalısınız.");

    const role = user.email === AUTHORIZED_EMAIL ? "super_admin" : "personnel";
    const status = user.email === AUTHORIZED_EMAIL ? "approved" : "pending";

    const res = await fetch("/api/personnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        email: user.email,
        role,
        status,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Personel kaydı oluşturulamadı.");
    }

    await updateProfile(user, { displayName: data.name });

    if (status === "approved") {
      const getRes = await fetch("/api/personnel");
      if (getRes.ok) {
        const all: Personnel[] = await getRes.json();
        const newP = all.find(
          (p) => p.email === user.email && p.name === data.name,
        );
        if (newP) {
          setPersonnel(newP);
          localStorage.setItem("sydv_personnel", JSON.stringify(newP));
        }
      }
    } else {
        // Will be redirected to a pending screen or handled by login checks
        router.push("/pending-approval");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setPersonnel(null);
    localStorage.removeItem("sydv_personnel");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        personnel,
        loading,
        loginError,
        loginWithGoogle,
        loginWithPassword,
        registerPersonnel,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


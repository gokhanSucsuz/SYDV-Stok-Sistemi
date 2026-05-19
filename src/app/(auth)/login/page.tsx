"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck } from "lucide-react";
import { APP_LOGO_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function Login() {
  const {
    user,
    personnel,
    loading: authLoading,
    loginWithGoogle,
    loginError,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      if (personnel) {
        router.push("/");
      } else {
        router.push("/register");
      }
    }
  }, [user, personnel, authLoading, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login error caught in component:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-100/40 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <img
              className="h-20 w-20 rounded-2xl"
              src={APP_LOGO_URL}
              alt="Logo"
            />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-display font-bold tracking-tight text-gray-900">
          EDİRNE SYDV
        </h2>
        <h3 className="text-center text-xl font-medium text-gray-600 mt-1">
          Stok Yönetim Sistemi
        </h3>
        <p className="mt-4 text-center text-sm text-gray-500 max-w-xs mx-auto">
          Güvenli erişim sağlamak için kurumsal Google hesabınız ile giriş
          yapın.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl shadow-gray-200/50 sm:rounded-[2rem] border border-white/50">
          {loginError && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl text-red-700 text-sm flex items-center pr-10 relative">
              <div className="mr-3 p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-semibold">{loginError}</span>
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-200 rounded-2xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-md hover:border-gray-300 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
                alt="Google"
              />
              Google ile Giriş Yap
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-center text-sm text-gray-500 font-medium">
              <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
              Sadece Yetkili Personel Erişimi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

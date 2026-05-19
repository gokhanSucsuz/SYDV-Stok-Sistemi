"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ShieldCheck,
  User as UserIcon,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";
import { APP_LOGO_URL, APP_NAME, APP_SUBTITLE } from "@/lib/constants";
import { getPersonnel } from "@/lib/db";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const {
    user,
    personnel,
    loading: authLoading,
    loginWithGoogle,
    loginError,
    loginWithPassword,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [personnelList, setPersonnelList] = useState<any[]>([]);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [localError, setLocalError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user && personnel) {
      router.push("/");
    }
  }, [user, personnel, authLoading, router]);

  useEffect(() => {
    if (user && !personnel) {
      const fetchPersonnel = async () => {
        try {
          const all = await getPersonnel();
          setPersonnelList(all);
        } catch (err) {
          console.error("Error fetching personnel:", err);
        }
      };
      fetchPersonnel();
    }
  }, [user, personnel]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLocalError("");
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login error caught in component:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonnelLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonnelId || !loginPass) {
      setLocalError("Lütfen personel seçin ve şifrenizi girin.");
      return;
    }
    setLoading(true);
    setLocalError("");
    try {
      await loginWithPassword(selectedPersonnelId, loginPass);
    } catch (err: any) {
      setLocalError(err.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const currentError = localError || loginError;

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
              className="h-20 w-20 rounded-2xl object-cover"
              src={APP_LOGO_URL}
              alt="Logo"
            />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-display font-bold tracking-tight text-gray-900">
          {APP_NAME.toUpperCase()}
        </h2>
        <h3 className="text-center text-xl font-medium text-gray-600 mt-1">
          {APP_SUBTITLE}
        </h3>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl shadow-gray-200/50 sm:rounded-[2rem] border border-white/50">
          {currentError && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl text-red-700 text-sm flex items-center relative">
              <div className="mr-3 p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-semibold px-2">{currentError}</span>
            </div>
          )}

          {!user ? (
            <div className="space-y-6">
              <p className="text-center text-sm text-gray-500 mb-8 max-w-xs mx-auto">
                Sisteme güvenli erişim sağlamak için kurumsal Google hesabınız
                ile giriş yapın.
              </p>
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
          ) : (
            <form
              className="space-y-6 animate-in fade-in duration-500"
              onSubmit={handlePersonnelLogin}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kayıtlı Personel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedPersonnelId}
                    onChange={(e) => setSelectedPersonnelId(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm rounded-2xl bg-white/50 backdrop-blur-sm transition-all"
                  >
                    <option value="">Profilinizi Seçin</option>
                    {personnelList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sistem Şifresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sisteme Giriş Yap
                </button>
                <Link
                  href="/register"
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-200 rounded-2xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-all"
                >
                  <UserPlus className="w-5 h-5 mr-2 text-gray-400" />
                  Yeni Kayıt Oluştur
                </Link>
              </div>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100/80">
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

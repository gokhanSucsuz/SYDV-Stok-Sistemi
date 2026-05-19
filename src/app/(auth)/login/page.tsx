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
    <div className="min-h-screen flex bg-white">
      {/* Left side - Visual/Brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 text-white p-12 relative overflow-hidden">
        {/* Background Gradients & Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-zinc-950 pointer-events-none z-0" />
        {/* Note: In a real app we'd use Next.js Image component, but native img works too. Here we'll use a placeholder from unsplash related to inventory/professional setting. */}
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8c738759be?q=80&w=2670&auto=format&fit=crop" 
          alt="Warehouse" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
        />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <img
              className="h-10 w-10 rounded-xl object-cover"
              src={APP_LOGO_URL}
              alt="Logo"
            />
          </div>
          <span className="font-display font-semibold tracking-tight text-xl text-white/90">
            {APP_NAME}
          </span>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-[1.1] mb-6 tracking-tight text-white/95">
            Yetkili Personel <br /> Erişim Portalı
          </h1>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed">
            Edirne Sosyal Yardımlaşma ve Dayanışma Vakfı depo, ihale ve malzeme süreçlerini modern, şeffaf ve güvenli bir altyapı ile yönetin.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 xl:px-24 bg-white relative overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          
          <div className="lg:hidden flex items-center gap-3 mb-10">
             <div className="p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                <img
                  className="h-12 w-12 rounded-xl object-cover"
                  src={APP_LOGO_URL}
                  alt="Logo"
                />
             </div>
             <div>
               <h2 className="text-xl font-display font-bold tracking-tight text-gray-900">{APP_NAME}</h2>
               <p className="text-xs text-gray-500 font-medium">{APP_SUBTITLE}</p>
             </div>
          </div>

          <div className="mb-10 text-left">
            <h2 className="text-3xl font-display font-semibold tracking-tight text-gray-900 mb-2">
              Sisteme Giriş Yapın
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Devam etmek için kurumsal hesabınızı veya sistem şifrenizi kullanın.
            </p>
          </div>

          {currentError && (
            <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl text-red-700 text-sm flex items-start shadow-sm relative">
              <div className="mr-3 mt-0.5 text-red-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-semibold leading-relaxed">{currentError}</span>
            </div>
          )}

          {!user ? (
            <div className="space-y-6">
              <div className="p-5 bg-blue-50/50 border border-blue-100/50 rounded-2xl mb-6">
                 <p className="text-sm font-medium text-blue-800 leading-relaxed text-center">
                    İlk adım olarak <strong>kurumsal Google hesabınızı</strong> doğrulamanız gerekmektedir.
                 </p>
              </div>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-4 border border-gray-200 rounded-2xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow disabled:opacity-50 transition-all duration-200 group"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
                  alt="Google"
                />
                Google ile Devam Et
              </button>
            </div>
          ) : (
            <form
              className="space-y-7 animate-in fade-in duration-500"
              onSubmit={handlePersonnelLogin}
            >
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Kayıtlı Profil
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedPersonnelId}
                    onChange={(e) => setSelectedPersonnelId(e.target.value)}
                    className="block w-full pl-11 pr-10 py-3.5 text-gray-900 text-sm font-medium border border-gray-200 rounded-2xl bg-gray-50/50 shadow-sm hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Profilinizi seçin...</option>
                    {personnelList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - {p.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                     <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Sistem Şifresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3.5 text-gray-900 text-sm font-medium border border-gray-200 rounded-2xl bg-gray-50/50 shadow-sm hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Giriş Yap
                </button>
              </div>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">veya</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

               <div>
                 <Link
                    href="/register"
                    className="w-full flex justify-center items-center py-4 px-4 border border-gray-200 rounded-2xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-all"
                  >
                    <UserPlus className="w-4 h-4 mr-2 text-gray-400" />
                    Yeni Personel Kaydı Oluştur
                  </Link>
               </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

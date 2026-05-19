"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldAlert, LogOut } from "lucide-react";
import { APP_LOGO_URL } from "@/lib/constants";

export default function PendingApproval() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-yellow-100/40 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-orange-100/40 blur-3xl" />
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
          Onay Bekleniyor
        </h2>
        
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <div className="bg-white py-10 px-8 shadow-xl shadow-gray-200/50 sm:rounded-[2rem] border border-gray-100 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-50 mb-6">
                <ShieldAlert className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hesabınız İnceleme Aşamasında</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Kayıt işleminiz başarıyla tamamlandı. Sisteme giriş yapabilmeniz için yöneticinin hesabınızı onaylaması gerekmektedir. Lütfen daha sonra tekrar deneyin veya sistem yöneticisi ile iletişime geçin.
            </p>

            <button
                onClick={logout}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                <LogOut className="w-5 h-5 mr-2" />
                Çıkış Yap
            </button>
        </div>
      </div>
    </div>
  );
}

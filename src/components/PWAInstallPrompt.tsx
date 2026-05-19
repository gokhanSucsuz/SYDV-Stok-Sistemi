"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { user } = useAuth(); // Only show if logged in

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (user) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [user]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt || !user) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white border border-red-100 rounded-2xl p-4 shadow-xl shadow-red-900/5 z-50 flex items-start gap-4 animate-in slide-in-from-bottom-5">
      <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
        <Download className="w-6 h-6" />
      </div>
      <div className="flex-1 pt-1">
        <h4 className="font-semibold text-gray-900 leading-none mb-1.5">Mobil Uygulamayı İndir</h4>
        <p className="text-sm text-gray-500 mb-3 leading-snug">Daha hızlı erişim ve iyi bir deneyim için SYDV Stok uygulamasını cihazınıza yükleyin.</p>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleInstallClick}
            className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Hemen İndir
          </button>
          <button 
            onClick={() => setShowPrompt(false)}
            className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Belki Sonra
          </button>
        </div>
      </div>
      <button onClick={() => setShowPrompt(false)} className="text-gray-400 hover:text-gray-600 p-1">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

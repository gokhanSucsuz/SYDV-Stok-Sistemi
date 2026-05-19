"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserPlus,
  User,
  Briefcase,
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { APP_LOGO_URL, APP_NAME, APP_SUBTITLE } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const {
    user,
    personnel,
    loading: authLoading,
    registerPersonnel,
  } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    tcNo: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKVKK, setShowKVKK] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (personnel) {
        router.push("/");
      }
    }
  }, [user, personnel, authLoading, router]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvkkAccepted) {
      setError("Devam etmek için KVKK Aydınlatma Metni'ni onaylamalısınız.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (formData.tcNo.length !== 11) {
      setError("TC Kimlik No 11 haneli olmalıdır.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await registerPersonnel({
        name: formData.name,
        title: formData.title,
        tcNo: formData.tcNo,
        password: formData.password,
      });
      // Redirect happens automatically via useEffect when context updates
    } catch (err: any) {
      setError(err.message || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Prevent flicker while redirecting to login

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-100/40 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
          Yeni Personel Kaydı
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-gray-600 max-w-sm mx-auto">
          Güvenli erişim için Google hesabınız doğrulandı. Lütfen profilinizi oluşturun.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 lg:px-10 shadow-2xl shadow-gray-200/50 sm:rounded-[2rem] border border-white/50">
          {error && (
            <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl text-red-700 text-sm flex items-center relative">
              <div className="mr-3 p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-semibold px-2">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegisterSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="Tam Adınız"
                    />
                </div>
                </div>

                <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unvan
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="Örn: Sosyal Yardım İnceleme Görevlisi"
                    />
                </div>
                </div>

                <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    TC Kimlik No
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    required
                    maxLength={11}
                    value={formData.tcNo}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        tcNo: e.target.value.replace(/\D/g, ""),
                        })
                    }
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="11 Haneli TC No"
                    />
                </div>
                </div>

                <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sistem Şifresi
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="••••••••"
                    />
                </div>
                </div>

                <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre Tekrar
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                        })
                    }
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all"
                    placeholder="••••••••"
                    />
                </div>
                </div>
            </div>

            <div className="flex items-start bg-gray-50/80 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="kvkk"
                  name="kvkk"
                  type="checkbox"
                  checked={kvkkAccepted}
                  onChange={(e) => setKvkkAccepted(e.target.checked)}
                  className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="kvkk" className="font-medium text-gray-700 cursor-pointer">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setShowKVKK(true); }}
                    className="text-red-600 hover:text-red-500 underline underline-offset-2"
                  >
                    KVKK Aydınlatma Metni
                  </button>
                  'ni okudum, kişisel verilerimin işlenmesini kabul ediyorum.
                </label>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row-reverse gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-2/3 flex justify-center items-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Kaydı Tamamla ve Onaya Gönder
              </button>
              <Link
                href="/login"
                className="w-full sm:w-1/3 flex justify-center items-center py-3.5 px-4 border border-gray-200 rounded-2xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2 text-gray-400" />
                Geri Dön
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* KVKK Modal */}
      {showKVKK && (
        <div
          className="fixed z-50 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setShowKVKK(false)}
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-3xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 lg:p-8 border border-gray-100">
              <div className="absolute top-4 right-4 relative w-full h-0 z-10 flex justify-end">
                <button onClick={() => setShowKVKK(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-gray-900 absolute -top-4 -right-4 lg:-top-6 lg:-right-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-50 sm:mx-0 sm:h-10 sm:w-10">
                  <ShieldCheck className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-semibold text-gray-900"
                    id="modal-title"
                  >
                    KVKK Aydınlatma Metni
                  </h3>
                  <div className="mt-4 text-sm text-gray-600 text-left space-y-5 max-h-96 overflow-y-auto pr-4 hidden-scrollbar">
                    <div>
                        <p className="font-semibold text-gray-900 text-base mb-1">1. Veri Sorumlusu</p>
                        <p className="leading-relaxed">
                        Edirne Sosyal Yardımlaşma ve Dayanışma Vakfı (SYDV)
                        olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu
                        (KVKK) uyarınca, kişisel verilerinizin güvenliğine büyük
                        önem vermekteyiz.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 text-base mb-1">2. İşlenen Kişisel Veriler</p>
                        <p className="leading-relaxed">
                        Sistem kullanımı kapsamında; Ad-Soyad, Unvan, TC Kimlik
                        Numarası (şifreli) ve Sistem Şifresi (şifreli) verileriniz
                        işlenmektedir.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 text-base mb-1">3. Veri İşleme Amacı</p>
                        <p className="leading-relaxed">
                        Kişisel verileriniz; stok takip sistemine yetkili erişimin
                        sağlanması, işlem güvenliğinin takibi ve vakıf envanter
                        yönetiminin sağlıklı yürütülmesi amaçlarıyla
                        işlenmektedir.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 text-base mb-1">4. Veri Güvenliği</p>
                        <p className="leading-relaxed">
                        TC Kimlik Numaranız ve şifreniz veritabanında AES-256
                        standardında şifrelenmiş olarak saklanmaktadır. Altyapı Google Server üzerinde güvenle muhafaza edilir.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 text-base mb-1">5. Haklarınız</p>
                        <p className="leading-relaxed">
                        KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip
                        işlenmediğini öğrenme, düzeltilmesini isteme ve
                        silinmesini talep etme haklarına sahipsiniz.
                        </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 sm:mt-8 sm:flex sm:flex-row-reverse border-t border-gray-100 pt-6">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                  onClick={() => setShowKVKK(false)}
                >
                  Okudum, Anladım
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

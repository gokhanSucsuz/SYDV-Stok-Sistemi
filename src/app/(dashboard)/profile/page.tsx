"use client";

import React, { useState } from "react";
import { useAuth, Personnel as PersonnelType } from "@/contexts/AuthContext";
import { updatePersonnel } from "@/lib/db";
import { UserCircle, Shield, CheckCircle2, Lock, Save, Briefcase, CreditCard, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user, personnel, loginWithPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    name: personnel?.name || "",
    title: personnel?.title || "",
    tcNo: personnel?.tcNo || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personnel) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await updatePersonnel({
        ...personnel,
        name: formData.name,
        title: formData.title,
        tcNo: formData.tcNo,
      });
      setSuccess("Profil bilgileriniz başarıyla güncellendi.");
      if (personnel.id) {
          await loginWithPassword(personnel.id, personnel.password || "");
      }
    } catch (err: any) {
      setError(err.message || "Güncelleme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personnel) return;
    
    if (passwordData.currentPassword !== personnel.password) {
      setError("Mevcut şifreniz hatalı.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
        setError("Yeni şifre en az 6 karakter olmalıdır.");
        return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await updatePersonnel({
        ...personnel,
        password: passwordData.newPassword,
      });
      setSuccess("Şifreniz başarıyla değiştirildi.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      if (personnel.id) {
          await loginWithPassword(personnel.id, passwordData.newPassword);
      }
    } catch (err: any) {
      setError(err.message || "Şifre değiştirilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!personnel) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">
          Hesabım
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kişisel bilgilerinizi ve güvenlik ayarlarınızı yönetin.
        </p>
      </div>

      {(error || success) && (
        <div className={cn(
            "flex items-center gap-3 p-4 rounded-2xl border",
            error ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"
        )}>
            {error ? <Shield className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <span className="font-medium text-sm">{error || success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            {/* Profil Kartı */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-gray-100 to-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-4">
                    <UserCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{personnel.name}</h3>
                <p className="text-sm font-medium text-gray-500">{personnel.title}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{personnel.email}</span>
                    </div>
                </div>

                {personnel.role === 'super_admin' && (
                     <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider">
                     <Shield className="w-3.5 h-3.5" />
                     <span>Süper Admin</span>
                   </div>
                )}
            </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
             {/* Bilgi Güncelleme */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/50">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-gray-400" /> Profil Bilgileri
                </h3>
                <form onSubmit={handleInfoSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                                className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 px-4 py-3 sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unvan</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                    className="block w-full pl-10 pr-3 rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 py-3 sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                             <div className="relative">
                                <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    maxLength={11}
                                    value={formData.tcNo}
                                    onChange={e => setFormData({...formData, tcNo: e.target.value.replace(/\D/g, "")})}
                                    className="block w-full pl-10 pr-3 rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 py-3 sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                         <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Bilgileri Güncelle
                        </button>
                    </div>
                </form>
            </div>

            {/* Şifre Değiştirme */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/50">
                 <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-400" /> Şifre Değiştir
                </h3>
                 <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                        <input
                            type="password"
                            required
                            value={passwordData.currentPassword}
                            onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 px-4 py-3 sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                            <input
                                type="password"
                                required
                                value={passwordData.newPassword}
                                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 px-4 py-3 sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre Tekrar</label>
                            <input
                                type="password"
                                required
                                value={passwordData.confirmPassword}
                                onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 px-4 py-3 sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                            />
                        </div>
                    </div>
                     <div className="flex justify-end pt-4">
                         <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors disabled:opacity-50"
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Şifremi Değiştir
                        </button>
                    </div>
                 </form>
            </div>

        </div>
      </div>
    </div>
  );
}

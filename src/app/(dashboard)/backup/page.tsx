"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Download,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Archive,
  History,
  Info,
} from "lucide-react";
import { getBackups, addBackupRecord, getAllDataForBackup } from "@/lib/db";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Backup() {
  const f = format as any;
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("actions");

  const fetchBackups = async () => {
    const data = await getBackups();
    setBackups(data);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleManualBackup = async () => {
    setLoading(true);
    setStatus({ type: "info", message: "Veriler hazırlanıyor..." });
    try {
      const allData = await getAllDataForBackup();
      const blob = new Blob([JSON.stringify(allData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edirne-sydv-yedek-${f(new Date(), "yyyy-MM-dd-HH-mm")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await addBackupRecord({
        type: "Manuel",
        status: "Başarılı",
        fileName: a.download,
        size: (blob.size / 1024).toFixed(2) + " KB",
      });

      setStatus({
        type: "success",
        message: "Yedekleme başarıyla tamamlandı ve indirildi.",
      });
      fetchBackups();
    } catch (error) {
      console.error("Backup error:", error);
      setStatus({
        type: "error",
        message: "Yedekleme sırasında bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const lastBackup = backups[0];
  const daysSinceLastBackup = lastBackup
    ? Math.floor(
        (new Date().getTime() - new Date(lastBackup.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 999;

  const tabs = [
    { id: "actions", label: "Yedekleme İşlemleri", icon: Archive },
    { id: "history", label: "Yedekleme Geçmişi", icon: History },
    { id: "security", label: "KVKK & Güvenlik", icon: Shield },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden bg-white shadow-sm border border-gray-100 rounded-3xl">
      <div className="flex-shrink-0 px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5">
            <Database className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-gray-900 tracking-tight">
              Sistem Yedekleri
            </h1>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
              Sistem verilerinin güvenliği ve sürekliliği için düzenli yedekleme
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 overflow-y-auto hidden-scrollbar flex-shrink-0">
          <nav className="flex flex-row md:flex-col p-4 md:p-3 gap-2 overflow-x-auto md:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-3 px-4 py-3 md:py-3.5 rounded-xl text-sm font-semibold transition-all select-none",
                    isActive
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 border border-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-red-600" : "text-gray-400",
                    )}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* TAB CONTENT: Actions */}
            {activeTab === "actions" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700">
                    <Archive className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-gray-900">
                    Yedekleme İşlemleri
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Durum Kartı */}
                  <div className="bg-white overflow-hidden shadow-sm rounded-3xl border border-gray-100/50">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "p-3 rounded-2xl",
                            daysSinceLastBackup > 10
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-emerald-600",
                          )}
                        >
                          {daysSinceLastBackup > 10 ? (
                            <AlertTriangle className="h-6 w-6" />
                          ) : (
                            <CheckCircle className="h-6 w-6" />
                          )}
                        </div>
                        <div className="ml-5">
                          <p className="text-sm font-medium text-gray-500 truncate">
                            Sistem Durumu
                          </p>
                          <p className="text-xl font-display font-semibold text-gray-900 mt-1">
                            {daysSinceLastBackup > 10
                              ? "Yedekleme Gecikti"
                              : "Sistem Güncel"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50/50 border-t border-gray-50 px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          Son Yedekleme:
                        </span>{" "}
                        <span className="text-gray-600">
                          {lastBackup
                            ? f(
                                new Date(lastBackup.createdAt),
                                "d MMMM yyyy HH:mm",
                                {
                                  locale: tr,
                                },
                              )
                            : "Hiç yedek alınmadı"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* İşlem Kartı */}
                  <div className="bg-white overflow-hidden shadow-sm rounded-3xl border border-gray-100/50">
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <div className="p-3 rounded-2xl bg-gray-50 text-gray-600">
                          <Cloud className="h-6 w-6" />
                        </div>
                        <div className="ml-5">
                          <p className="text-sm font-medium text-gray-500 truncate">
                            Hızlı İşlem
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleManualBackup}
                        disabled={loading}
                        className="mt-2 w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 transition-colors"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Şimdi Yedek Al (JSON)
                      </button>
                    </div>
                    <div className="bg-gray-50/50 border-t border-gray-50 px-6 py-4 text-xs text-gray-500">
                      Tüm sistem verilerini JSON formatında indirir. Manuel
                      yedekleme verileri bilgisayarınıza indirir ve sistem
                      günlüğüne kaydeder.
                    </div>
                  </div>
                </div>

                {/* Bilgi Kartı */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex items-start shadow-sm mt-6">
                  <Info className="h-6 w-6 text-blue-600 mr-4 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Otomatik Yedekleme
                    </h3>
                    <p className="text-sm text-blue-800/80 leading-relaxed">
                      Eğer sistem yöneticileri 10 gün boyunca manuel yedekleme
                      işlemi gerçekleştirmezse, sistem olası veri kayıplarına
                      karşı arka planda otomatik olarak kayıt planlar. Yine de
                      fiziksel yedek için{" "}
                      <strong className="font-semibold">Manuel Yedek</strong>{" "}
                      almanız tavsiye edilir.
                    </p>
                  </div>
                </div>

                {status && (
                  <div
                    className={cn(
                      "mt-6 p-4 rounded-xl border flex items-center",
                      status.type === "success"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                        : status.type === "error"
                          ? "bg-red-50 border-red-100 text-red-800"
                          : "bg-blue-50 border-blue-100 text-blue-800",
                    )}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {status.type === "success" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <p className="text-sm font-medium">{status.message}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: History */}
            {activeTab === "history" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700">
                    <History className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-gray-900">
                    Yedekleme Geçmişi
                  </h2>
                </div>

                <div className="bg-white shadow-sm border border-gray-100 rounded-3xl overflow-hidden">
                  <div className="flex flex-col">
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Tarih
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Tür
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Dosya Adı
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Boyut
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Durum
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {backups.map((backup) => (
                                <tr
                                  key={backup.id}
                                  className="hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {f(
                                      new Date(backup.createdAt),
                                      "d MMMM yyyy HH:mm",
                                      {
                                        locale: tr,
                                      },
                                    )}
                                  </td>
                                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                                    {backup.type}
                                  </td>
                                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {backup.fileName}
                                  </td>
                                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                                    {backup.size}
                                  </td>
                                  <td className="px-6 py-5 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700">
                                      {backup.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {backups.length === 0 && (
                                <tr>
                                  <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-sm text-gray-500"
                                  >
                                    Henüz bir yedekleme kaydı bulunmuyor.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Security */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-gray-900">
                    KVKK ve Veri Güvenliği
                  </h2>
                </div>

                <div className="bg-gray-50/80 rounded-3xl p-8 border border-gray-100">
                  <h4 className="text-xl font-display font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-red-600" />
                    KVKK ve Veri Güvenliği Taahhütnamesi
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        Veri Şifreleme
                      </p>
                      <p className="leading-relaxed">
                        Sistemdeki tüm hassas veriler (TC No, Şifreler) AES-256
                        standardında şifrelenerek saklanmaktadır. Veritabanına
                        doğrudan erişim olsa dahi bu veriler okunamaz
                        durumdadır.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        Erişim Kontrolü
                      </p>
                      <p className="leading-relaxed">
                        Sisteme sadece edirnesydv@gmail.com Google hesabı ile
                        doğrulanmış yetkili personeller erişebilir. Her işlem
                        loglanmakta ve takip edilmektedir.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        Yedekleme Güvenliği
                      </p>
                      <p className="leading-relaxed">
                        Yedekleme dosyaları kurum içi kullanım için
                        tasarlanmıştır. Yedeklerin güvenli ortamlarda (harici
                        disk veya kurumsal Drive) saklanması kullanıcının
                        sorumluluğundadır.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        KVKK Uyumu
                      </p>
                      <p className="leading-relaxed">
                        Bu uygulama 6698 sayılı Kişisel Verilerin Korunması
                        Kanunu'na tam uyumlu olacak şekilde tasarlanmıştır. Veri
                        minimizasyonu ve gizlilik ön plandadır.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { getBackups, addBackupRecord, getAllDataForBackup } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function AutoBackupChecker() {
  const { personnel } = useAuth();
  const [needsBackup, setNeedsBackup] = useState(false);
  const [backupStatus, setBackupStatus] = useState<"pending" | "running" | "success" | "error">("pending");

  useEffect(() => {
    if (!personnel) return;
    
    let isMounted = true;
    const checkBackups = async () => {
      try {
        const backups = await getBackups();
        const lastBackup = backups[0];
        const daysSinceLastBackup = lastBackup
          ? Math.floor(
              (new Date().getTime() - new Date(lastBackup.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 999;

        if (daysSinceLastBackup > 10 && isMounted) {
          setNeedsBackup(true);
          setBackupStatus("running");
          await performAutoBackup();
        }
      } catch (err) {
        console.error("Backup check failed:", err);
      }
    };

    checkBackups();

    return () => {
      isMounted = false;
    };
  }, [personnel]);

  const performAutoBackup = async () => {
    try {
      const allData = await getAllDataForBackup();
      const blob = new Blob([JSON.stringify(allData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edirne-sydv-otomatik-yedek-${format(new Date(), "yyyy-MM-dd-HH-mm")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await addBackupRecord({
        type: "Otomatik",
        status: "Başarılı",
        fileName: a.download,
        size: (blob.size / 1024).toFixed(2) + " KB",
      });

      setBackupStatus("success");
      setTimeout(() => {
        setNeedsBackup(false);
      }, 3000);
    } catch (error) {
      console.error("Auto Backup error:", error);
      setBackupStatus("error");
      setTimeout(() => {
        setNeedsBackup(false);
      }, 5000);
    }
  };

  if (!needsBackup) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          {backupStatus === "running" && <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />}
          {backupStatus === "success" && <CheckCircle className="w-10 h-10 text-emerald-600" />}
          {backupStatus === "error" && <AlertTriangle className="w-10 h-10 text-red-600" />}
        </div>
        
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">
            Otomatik Sistem Yedeği
          </h2>
          <p className="mt-2 text-gray-600">
            {backupStatus === "running" && "Sistem güvenliği için verileriniz otomatik olarak yedekleniyor. Lütfen işlemin bitmesini bekleyin..."}
            {backupStatus === "success" && "Yedekleme başarıyla tamamlandı. İşlemlerinize devam edebilirsiniz."}
            {backupStatus === "error" && "Yedekleme sırasında bir hata oluştu. Sisteme giriş yapılıyor..."}
          </p>
        </div>
        
        {backupStatus === "running" && (
          <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full w-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
}

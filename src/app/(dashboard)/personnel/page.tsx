"use client";

import React, { useEffect, useState } from "react";
import {
  getPersonnel,
  deletePersonnel,
  updatePersonnel,
  Personnel as PersonnelType,
} from "@/lib/db";
import { UserCircle, Check, X, UserMinus, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Personnel() {
  const { personnel } = useAuth();
  const router = useRouter();
  const [personnelList, setPersonnelList] = useState<PersonnelType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPersonnel = async () => {
    setLoading(true);
    try {
      const data = await getPersonnel();
      setPersonnelList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personnel && personnel.role !== "super_admin") {
      router.push("/");
      return;
    }
    loadPersonnel();
  }, [personnel, router]);

  const handleUpdateStatus = async (p: PersonnelType, status: "approved" | "rejected" | "pending") => {
    try {
      await updatePersonnel({ ...p, status });
      loadPersonnel();
    } catch (err) {
      console.error(err);
      alert("Durum güncellenirken hata oluştu.");
    }
  };

  const handleUpdateRole = async (p: PersonnelType, role: "super_admin" | "personnel") => {
    try {
      await updatePersonnel({ ...p, role });
      loadPersonnel();
    } catch (err) {
      console.error(err);
      alert("Rol güncellenirken hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu personeli silmek istediğinize emin misiniz?")) {
      await deletePersonnel(id);
      loadPersonnel();
    }
  };

  const pendingPersonnel = personnelList.filter(p => p.status === "pending");
  const approvedPersonnel = personnelList.filter(p => p.status === "approved" || p.status === "rejected");

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">
            Personel Yönetimi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sistem yetkilerini ve hesap onaylarını buradan yönetin.
          </p>
        </div>
      </div>

      {pendingPersonnel.length > 0 && (
        <div className="bg-white shadow-sm border border-yellow-200 overflow-hidden rounded-3xl">
          <div className="px-6 py-5 border-b border-yellow-100 bg-yellow-50 flex items-center">
            <ShieldAlert className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="text-lg leading-6 font-semibold text-yellow-900">
              Onay Bekleyenler ({pendingPersonnel.length})
            </h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {pendingPersonnel.map((person) => (
              <li
                key={person.id}
                className="px-6 py-5 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {person.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {person.email} • {person.title}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(person, "approved")}
                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors shrink-0"
                    title="Onayla"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(person, "rejected")}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors shrink-0"
                    title="Reddet"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden rounded-3xl">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg leading-6 font-semibold text-gray-900">
            Kayıtlı Personeller
          </h3>
        </div>
        <div>
          {approvedPersonnel.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Personel Bulunamadı
              </h3>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {approvedPersonnel.map((person) => (
                <li
                  key={person.id}
                  className="px-6 py-5 hover:bg-gray-50/80 transition-colors sm:flex sm:items-center sm:justify-between"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserCircle className="h-7 w-7 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {person.name}
                        </p>
                        {person.role === "super_admin" && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                            Süper Admin
                          </span>
                        )}
                        {person.status === "rejected" && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
                            Reddedildi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {person.title} {person.tcNo ? ` • ${person.tcNo}` : ""}
                        <br/>
                        {person.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-wrap items-center gap-2">
                    <select
                        value={person.role === "super_admin" ? "super_admin" : "personnel"}
                        onChange={(e) => handleUpdateRole(person, e.target.value as any)}
                        disabled={person.role === "super_admin" || person.name === "Gökhan SUÇSUZ"}
                        className="text-xs border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium py-1.5 focus:ring-red-500 min-w-[120px] disabled:opacity-50"
                    >
                        <option value="personnel">Normal Personel</option>
                        <option value="super_admin">Süper Admin</option>
                    </select>

                    <select
                        value={person.status || "approved"}
                        onChange={(e) => handleUpdateStatus(person, e.target.value as any)}
                        disabled={person.role === "super_admin" || person.name === "Gökhan SUÇSUZ"}
                        className={cn(
                            "text-xs rounded-lg font-medium py-1.5 focus:ring-red-500 min-w-[120px] disabled:opacity-50",
                            person.status === "approved" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-700"
                        )}
                    >
                        <option value="approved">Aktif (Onaylı)</option>
                        <option value="rejected">Pasif (Red)</option>
                    </select>

                    <button
                      onClick={() => person.id && handleDelete(person.id)}
                      disabled={person.role === "super_admin" || person.name === "Gökhan SUÇSUZ"}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none shrink-0 disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                      title="Sil"
                    >
                      <UserMinus className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

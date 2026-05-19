"use client";

import React, { useEffect, useState } from "react";
import {
  getPersonnel,
  addPersonnel,
  deletePersonnel,
  Personnel as PersonnelType,
} from "@/lib/db";
import { Plus, Trash2, UserCircle } from "lucide-react";

export default function Personnel() {
  const [personnelList, setPersonnelList] = useState<PersonnelType[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [tcNo, setTcNo] = useState("");

  const loadPersonnel = async () => {
    const data = await getPersonnel();
    setPersonnelList(data);
  };

  useEffect(() => {
    loadPersonnel();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title) return;

    await addPersonnel({ name, title, tcNo, email: "" });
    setName("");
    setTitle("");
    setTcNo("");
    loadPersonnel();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu personeli silmek istediğinize emin misiniz?")) {
      await deletePersonnel(id);
      loadPersonnel();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">
            Personel Yönetimi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sistemi kullanacak personelleri yönetin.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 px-6 py-6 rounded-3xl">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              Yeni Personel Ekle
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Sistemi kullanacak ve stok işlemlerini gerçekleştirecek
              personelleri buradan ekleyebilirsiniz. Sistemde işlem yapabilmek
              için en az bir personel kaydı zorunludur.
            </p>
          </div>
          <div className="mt-6 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ünvan / Görev
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="tcNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    TC Kimlik No (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    name="tcNo"
                    id="tcNo"
                    value={tcNo}
                    onChange={(e) => setTcNo(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center items-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden rounded-3xl">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg leading-6 font-semibold text-gray-900">
            Kayıtlı Personeller
          </h3>
        </div>
        <div>
          {personnelList.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Personel Bulunamadı
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Sistemde kayıtlı personel bulunmamaktadır. Lütfen yeni personel
                ekleyin.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {personnelList.map((person) => (
                <li
                  key={person.id}
                  className="px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200">
                        <span className="text-gray-900 font-display font-medium text-sm">
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {person.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {person.title} {person.tcNo && `- TC: ${person.tcNo}`}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => person.id && handleDelete(person.id)}
                      className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
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

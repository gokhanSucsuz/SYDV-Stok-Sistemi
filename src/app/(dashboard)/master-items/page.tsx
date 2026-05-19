"use client";

import React, { useState, useEffect } from "react";
import {
  getMasterItems,
  addMasterItem,
  bulkAddMasterItems,
  deleteMasterItem,
  MasterItem,
} from "@/lib/db";
import {
  Plus,
  Trash2,
  FileUp,
  Download,
  Search,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";

export default function MasterItems() {
  const [items, setItems] = useState<MasterItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("Adet");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadItems = async () => {
    const loadedItems = await getMasterItems();
    setItems(loadedItems.sort((a, b) => a.name.localeCompare(b.name)));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newItemName.trim()) return;

    const exists = items.some(
      (i) => i.name.toLowerCase() === newItemName.trim().toLowerCase(),
    );
    if (exists) {
      setError("Bu malzeme zaten listede mevcut.");
      return;
    }

    await addMasterItem({
      name: newItemName.trim(),
      measurementUnit: newItemUnit,
    });
    setNewItemName("");
    setSuccess("Malzeme başarıyla eklendi.");
    loadItems();
  };

  const handleDeleteItem = async (id: string) => {
    if (
      window.confirm("Bu malzemeyi listeden silmek istediğinize emin misiniz?")
    ) {
      await deleteMasterItem(id);
      loadItems();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const newItems: Omit<MasterItem, "id" | "createdAt">[] = [];
        for (const row of data) {
          const name =
            row["Malzeme Adı"] || row["Ürün Adı"] || row["Adı"] || row["name"];
          const unit =
            row["Birim"] || row["Birim Bilgisi"] || row["unit"] || "Adet";

          if (
            name &&
            !items.some(
              (i) => i.name.toLowerCase() === name.toString().toLowerCase(),
            )
          ) {
            newItems.push({
              name: name.toString().trim(),
              measurementUnit: unit.toString().trim(),
            });
          }
        }

        if (newItems.length > 0) {
          await bulkAddMasterItems(newItems);
          setSuccess(
            `${newItems.length} yeni malzeme başarıyla içe aktarıldı.`,
          );
          loadItems();
        } else {
          setError(
            "İçe aktarılacak yeni malzeme bulunamadı veya dosya formatı hatalı.",
          );
        }
      } catch (err) {
        console.error(err);
        setError(
          "Dosya okunurken bir hata oluştu. Lütfen Excel formatını kontrol edin.",
        );
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { "Malzeme Adı": "Örnek Malzeme 1", Birim: "Adet" },
      { "Malzeme Adı": "Örnek Malzeme 2", Birim: "Kg" },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Şablon");
    XLSX.writeFile(wb, "malzeme_yukleme_sablonu.xlsx");
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">
            Malzeme / Ürün Tanımları
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sisteme yeni malzeme ekleyebilir veya Excel'den toplu içe aktarım
            yapabilirsiniz.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" /> Şablon İndir
          </button>
          <label className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 cursor-pointer transition-colors">
            <FileUp className="w-4 h-4 mr-2" /> Excel'den Yükle
            <input
              type="file"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-gray-400" />
              Yeni Malzeme Ekle
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Malzeme Adı
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 focus:bg-white"
                  placeholder="Örn: Sıvı Sabun"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Varsayılan Birim
                </label>
                <select
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 focus:bg-white"
                >
                  <option>Adet</option>
                  <option>Kg</option>
                  <option>Litre</option>
                  <option>Koli</option>
                  <option>Paket</option>
                  <option>Çuval</option>
                  <option>Teneke</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors mt-2"
              >
                <Plus className="w-4 h-4 mr-2" /> Listeye Ekle
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">
                Kayıtlı Malzemeler
              </h3>
              <div className="relative rounded-xl shadow-sm max-w-xs w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 sm:text-sm border-gray-200 rounded-xl p-2.5 border bg-white focus:bg-white transition-colors"
                  placeholder="Malzeme ara..."
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Malzeme Adı
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Birim
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Kayıtlı malzeme bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.measurementUnit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteItem(item.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

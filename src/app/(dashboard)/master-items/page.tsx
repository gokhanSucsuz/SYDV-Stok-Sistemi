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
  Package,
  Barcode,
  Info,
  Archive,
  ThermometerSnowflake,
  Tags,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import * as XLSX from "xlsx";

export default function MasterItems() {
  const [items, setItems] = useState<MasterItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<MasterItem>>({
    name: "",
    measurementUnit: "Adet",
    itemCode: "",
    category: "Gıda",
    criticalStockLevel: undefined,
    storageConditions: "Oda Sıcaklığı",
    barcode: "",
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const loadedItems = await getMasterItems();
      setItems(loadedItems.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error("Malzemeler yüklenemedi", err);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newItem.name?.trim()) return;

    const exists = items.some(
      (i) => i.name.toLowerCase() === newItem.name?.trim().toLowerCase(),
    );
    if (exists) {
      setError("Bu malzeme zaten sistemde kayıtlı.");
      return;
    }

    try {
      await addMasterItem({
        name: newItem.name.trim(),
        measurementUnit: newItem.measurementUnit || "Adet",
        itemCode: newItem.itemCode?.trim() || "",
        category: newItem.category || "Diğer",
        criticalStockLevel: newItem.criticalStockLevel
          ? Number(newItem.criticalStockLevel)
          : undefined,
        storageConditions: newItem.storageConditions?.trim() || "",
        barcode: newItem.barcode?.trim() || "",
        description: newItem.description?.trim() || "",
      });

      setNewItem({
        name: "",
        measurementUnit: "Adet",
        itemCode: "",
        category: "Gıda",
        criticalStockLevel: undefined,
        storageConditions: "Oda Sıcaklığı",
        barcode: "",
        description: "",
      });
      setSuccess("Malzeme referansı başarıyla eklendi.");
      loadItems();
    } catch (err) {
      console.error(err);
      setError("Malzeme eklenirken bir hata oluştu.");
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (
      window.confirm(
        `"${name}" malzemesini listeden silmek istediğinize emin misiniz? Bu işlem geçmiş ihale/stok kayıtlarını GERİYE DÖNÜK OLARAK silmez, ancak yeni kayıtlarda referans olarak seçilmesini engeller.`,
      )
    ) {
      try {
        await deleteMasterItem(id);
        loadItems();
      } catch (err) {
        console.error(err);
        setError("Silme işlemi başarısız.");
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
          const category =
            row["Kategori"] || row["Sınıf"] || row["Category"] || "Diğer";
          const itemCode =
            row["Malzeme Kodu"] || row["Stok Kodu"] || row["Item Code"] || "";
          const criticalStock =
            row["Kritik Stok"] || row["Min Stok"] || row["Kritik Seviye"];
          const storage =
            row["Saklama Koşulu"] ||
            row["Depolama"] ||
            row["Muhafaza"] ||
            row["Saklama"] ||
            "";
          const barcode =
            row["Barkod"] ||
            row["Barkod No"] ||
            row["Barcode"] ||
            row["EAN"] ||
            "";
          const description =
            row["Açıklama"] || row["Detay"] || row["Teknik Şartname"] || "";

          if (
            name &&
            !items.some(
              (i) => i.name.toLowerCase() === name.toString().toLowerCase(),
            ) &&
            !newItems.some(
              (i) => i.name.toLowerCase() === name.toString().toLowerCase(),
            ) // Prevent duplicates within the excel file itself
          ) {
            newItems.push({
              name: name.toString().trim(),
              measurementUnit: unit.toString().trim(),
              category: category.toString().trim(),
              itemCode: itemCode.toString().trim(),
              criticalStockLevel: criticalStock
                ? Number(criticalStock)
                : undefined,
              storageConditions: storage.toString().trim(),
              barcode: barcode.toString().trim(),
              description: description.toString().trim(),
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
            "İçe aktarılacak yeni malzeme bulunamadı. Malzemeler zaten kayıtlı olabilir veya dosya formatı hatalı.",
          );
        }
      } catch (err) {
        console.error(err);
        setError(
          "Dosya okunurken bir hata oluştu. Lütfen Excel formatını kontrol edin.",
        );
      }
      if (e.target) e.target.value = "";
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Malzeme Kodu": "GD-001",
        "Malzeme Adı": "Osmancık Pirinç",
        Kategori: "Gıda",
        Birim: "Kg",
        "Kritik Stok": 50,
        "Saklama Koşulu": "Kuru Erzak Deposu",
        Barkod: "8691234567890",
        Açıklama: "Baldo veya Osmancık cinsi yerli üretim pirinç.",
      },
      {
        "Malzeme Kodu": "TM-042",
        "Malzeme Adı": "Sıvı El Sabunu",
        Kategori: "Temizlik",
        Birim: "Litre",
        "Kritik Stok": 20,
        "Saklama Koşulu": "Oda Sıcaklığı",
        Barkod: "8690987654321",
        Açıklama: "Antibakteriyel, pompalı bidon, en az 5lt.",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Şablon");
    XLSX.writeFile(wb, "malzeme_referans_sablonu.xlsx");
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.itemCode &&
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category &&
        item.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Archive className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-semibold text-gray-900 tracking-tight flex items-center">
            Master Malzeme Tanımları
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            Sisteme yeni referans malzemeler tanımlayabilir, literatüre uygun
            kategori, saklama koşulu ve kritik stok seviyelerini
            belirleyebilirsiniz.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            onClick={downloadTemplate}
            className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <Download className="w-4 h-4 mr-2 text-gray-400" /> Şablon İndir
          </button>
          <label className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-semibold rounded-xl text-white bg-gray-900 hover:bg-gray-800 cursor-pointer transition-colors">
            <FileUp className="w-4 h-4 mr-2" /> Toplu Yükle (Excel)
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
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center shadow-sm">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center shadow-sm">
          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 text-emerald-600">
            ✓
          </div>
          <p className="text-sm font-medium text-emerald-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Malzeme Kartı Oluştur
                </h3>
                <p className="text-xs text-gray-500">
                  Sisteme yeni bir referans ekleyin
                </p>
              </div>
            </div>

            <form onSubmit={handleAddItem} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Malzeme Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 hover:bg-white"
                    placeholder="Örn: Sıvı Sabun"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 hover:bg-white"
                  >
                    <option>Gıda</option>
                    <option>Temizlik</option>
                    <option>Kırtasiye</option>
                    <option>Hırdavat</option>
                    <option>Tıbbi Malzeme</option>
                    <option>Giyim / Tekstil</option>
                    <option>Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Birim
                  </label>
                  <select
                    value={newItem.measurementUnit}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        measurementUnit: e.target.value,
                      })
                    }
                    className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 hover:bg-white"
                  >
                    <option>Adet</option>
                    <option>Kg</option>
                    <option>Litre</option>
                    <option>Koli</option>
                    <option>Paket</option>
                    <option>Porsiyon</option>
                    <option>Çuval</option>
                    <option>Teneke</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Malzeme Kodu
                    <span className="text-gray-400 font-normal lowercase">
                      (Opsiyonel)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newItem.itemCode}
                    onChange={(e) =>
                      setNewItem({ ...newItem, itemCode: e.target.value })
                    }
                    className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 hover:bg-white font-mono"
                    placeholder="Örn: GD-01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Kritik Stok
                    <span className="text-gray-400 font-normal lowercase">
                      (Opsiyonel)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItem.criticalStockLevel || ""}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        criticalStockLevel: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 hover:bg-white"
                    placeholder="Uyarı limiti"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Depolama / Saklama Koşulu
                    <span className="text-gray-400 font-normal lowercase">
                      (Opsiyonel)
                    </span>
                  </label>
                  <select
                    value={newItem.storageConditions}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        storageConditions: e.target.value,
                      })
                    }
                    className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 hover:bg-white"
                  >
                    <option>Oda Sıcaklığı / Kuru Depo</option>
                    <option>Soğuk Hava Deposu (+4°C)</option>
                    <option>Derin Dondurucu (-18°C)</option>
                    <option>Tehlikeli Madde Dolabı</option>
                    <option>Diğer</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Barkod No
                    <span className="text-gray-400 font-normal lowercase">
                      (Opsiyonel)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newItem.barcode}
                    onChange={(e) =>
                      setNewItem({ ...newItem, barcode: e.target.value })
                    }
                    className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 hover:bg-white font-mono tracking-widest text-center"
                    placeholder="||| ||| ||| |||"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Açıklama / Teknik Şartname
                    <span className="text-gray-400 font-normal lowercase">
                      (Opsiyonel)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    className="block w-full rounded-xl border border-gray-200 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-3 transition-colors bg-gray-50/50 hover:bg-white"
                    placeholder="Malzemenin teknik detayları veya ek notlar..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-3.5 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" /> Kartı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 gap-4">
              <h3 className="font-semibold text-gray-900 flex items-center text-lg">
                <Package className="w-5 h-5 mr-2 text-gray-400" />
                Malzeme Kataloğu
              </h3>
              <div className="relative rounded-xl shadow-sm w-full sm:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 sm:text-sm border-gray-200 rounded-xl p-3 border bg-white shadow-sm transition-colors"
                  placeholder="İsim, kod veya kategori ile ara..."
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <Archive className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                      Kayıtlı malzeme bulunamadı veya arama sonucu eşleşmedi.
                    </p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <li
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <div
                        className="px-6 py-5 cursor-pointer flex items-center justify-between"
                        onClick={() => toggleExpand(item.id!)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-base">
                                {item.name}
                              </span>
                              {item.itemCode && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                                  {item.itemCode}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">
                                {categoryIcon(item.category)}
                                {item.category || "Diğer"}
                              </span>
                              <span className="flex items-center border border-gray-200 bg-white px-2 py-0.5 rounded-md">
                                {item.measurementUnit}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id!, item.name);
                            }}
                            className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                            title="Malzemeyi Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="text-gray-300">
                            {expandedId === item.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Genişletilmiş Detay Görünümü */}
                      {expandedId === item.id && (
                        <div className="px-6 pb-6 pt-2 bg-gray-50/30 animate-in slide-in-from-top-2 fade-in duration-200">
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 flex items-center mb-1">
                                <ThermometerSnowflake className="w-3 h-3 mr-1" />
                                Saklama Koşulu
                              </span>
                              <span className="text-sm font-medium text-gray-800">
                                {item.storageConditions || "-"}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 flex items-center mb-1">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Kritik Stok
                              </span>
                              <span
                                className={`text-sm font-medium ${item.criticalStockLevel ? "text-orange-600" : "text-gray-800"}`}
                              >
                                {item.criticalStockLevel
                                  ? `${item.criticalStockLevel} ${item.measurementUnit}`
                                  : "Tanımsız"}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 flex items-center mb-1">
                                <Barcode className="w-3 h-3 mr-1" />
                                Barkod No
                              </span>
                              <span className="text-sm font-mono text-gray-800">
                                {item.barcode || "-"}
                              </span>
                            </div>

                            <div className="flex flex-col sm:col-span-2 md:col-span-4 border-t border-gray-100 pt-3 mt-1">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 flex items-center mb-1">
                                <Info className="w-3 h-3 mr-1" />
                                Teknik Şartname / Açıklama
                              </span>
                              <span className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {item.description ||
                                  "Eklenmiş bir açıklama bulunmuyor."}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to return a small text emoji/icon based on category
function categoryIcon(category?: string) {
  if (!category) return null;
  const c = category.toLowerCase();
  if (c.includes("gıda")) return "🍎 ";
  if (c.includes("temizlik")) return "🧼 ";
  if (c.includes("kırtasiye")) return "✏️ ";
  if (c.includes("hırdavat")) return "🛠️ ";
  if (c.includes("tıbbi")) return "💊 ";
  if (c.includes("giyim") || c.includes("tekstil")) return "👕 ";
  return "📦 ";
}

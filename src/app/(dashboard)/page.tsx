"use client";

import React, { useEffect, useState } from "react";
import {
  getPersonnel,
  getAllItems,
  getAllTransactions,
  getMasterItems,
  getBackups,
  Personnel,
  Item,
  Transaction,
  UnitType,
} from "@/lib/db";
import Link from "next/link";
import {
  Package,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Users,
  PackageOpen,
  AlertTriangle,
  AlertCircle,
  Droplets,
  Utensils,
  Home,
  Gift,
  Building2,
  FileText,
  Calendar,
  PlusCircle,
  History,
  Database,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { generateMonthlyInventoryReport } from "@/lib/reports";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const UNITS: UnitType[] = [
  "Vefa Temizlik",
  "Aşevi",
  "Dergah",
  "Bağış",
  "Vakıf",
];
const UNIT_ICONS = {
  "Vefa Temizlik": Droplets,
  Aşevi: Utensils,
  Dergah: Home,
  Bağış: Gift,
  Vakıf: Building2,
};
const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

interface UnitStats {
  name: UnitType;
  itemCount: number;
  lowStockCount: number;
  zeroStockCount: number;
  transactionCount: number;
}

export default function Dashboard() {
  const [backupAlert, setBackupAlert] = useState(false);
  const [personnelCount, setPersonnelCount] = useState(0);
  const [masterItemsCount, setMasterItemsCount] = useState(0);
  const [tendersCount, setTendersCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [personnelMap, setPersonnelMap] = useState<Record<string, string>>({});
  const [unitStats, setUnitStats] = useState<UnitStats[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMonth, setReportMonth] = useState(new Date().getMonth());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadData = async () => {
      const backups = (await getBackups()) as any[];
      if (backups.length > 0) {
        const lastBackup = new Date(backups[0].createdAt);
        const days =
          (new Date().getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24);
        if (days > 10) setBackupAlert(true);
      } else {
        setBackupAlert(true);
      }

      const p = await getPersonnel();
      setAllPersonnel(p);
      setPersonnelCount(p.length);
      const pMap: Record<string, string> = {};
      p.forEach((person) => {
        if (person.id) pMap[person.id] = person.name;
      });
      setPersonnelMap(pMap);

      const items = await getAllItems();
      setAllItems(items);
      const mItems = await getMasterItems();
      setMasterItemsCount(mItems.length);

      const uniqueTenders = new Set(
        items
          .filter((i) => i.tenderName)
          .map((i) => `${i.tenderName}-${i.unit}`),
      );
      setTendersCount(uniqueTenders.size);

      const txs = await getAllTransactions();
      setAllTransactions(txs);
      setRecentTransactions(txs.sort((a, b) => b.date - a.date).slice(0, 6));

      const stats: UnitStats[] = UNITS.map((unit) => {
        const unitItems = items.filter((i) => i.unit === unit);
        const unitTxs = txs.filter((t) => t.unit === unit);
        const groupedByProduct = unitItems.reduce(
          (acc, item) => {
            if (!acc[item.name])
              acc[item.name] = {
                totalStock: 0,
                totalLimit: 0,
                latestCreatedAt: 0,
              };
            acc[item.name].totalStock += item.currentStock;
            if (item.createdAt > (acc[item.name].latestCreatedAt || 0)) {
              acc[item.name].totalLimit = item.tenderLimit || 0;
              acc[item.name].latestCreatedAt = item.createdAt;
            }
            return acc;
          },
          {} as Record<
            string,
            { totalStock: number; totalLimit: number; latestCreatedAt: number }
          >,
        );

        const productValues = Object.values(groupedByProduct);
        return {
          name: unit,
          itemCount: Object.keys(groupedByProduct).length,
          zeroStockCount: productValues.filter((p) => p.totalStock <= 0).length,
          lowStockCount: productValues.filter(
            (p) =>
              p.totalStock > 0 &&
              p.totalStock <
                (p.totalLimit ? Math.max(p.totalLimit * 0.1, 2) : 2),
          ).length,
          transactionCount: unitTxs.length,
        };
      });

      setUnitStats(stats);
      setChartData(stats.map((s) => ({ name: s.name, value: s.itemCount })));
    };
    loadData();
  }, []);

  const totalStock = unitStats.reduce((acc, s) => acc + s.itemCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-gray-900 tracking-tight">
            Genel Bakış
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sistemin genel durumunu ve kritik uyarıları buradan takip
            edebilirsiniz.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 shadow-sm transition-all focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <FileText className="w-4 h-4 mr-2" />
            Rapor Oluştur
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      <div className="space-y-3">
        {backupAlert && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/20 p-2 rounded-xl text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Yedekleme Uyarısı
                </p>
                <p className="text-xs text-red-600/80">
                  Sistem yedeği 10 günden eski. Lütfen yeni bir yedek alın.
                </p>
              </div>
            </div>
            <Link
              href="/backup"
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
            >
              Yedekle
            </Link>
          </div>
        )}
      </div>

      {/* Bento Grid - Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Kayıtlı Personel",
            value: personnelCount,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            link: "/personnel",
          },
          {
            label: "İhale Yönetimi",
            value: tendersCount,
            icon: PackageOpen,
            color: "text-purple-600",
            bg: "bg-purple-50",
            link: "/tenders",
          },
          {
            label: "Tanımlı Malzemeler",
            value: masterItemsCount,
            icon: Package,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            link: "/master-items",
          },
          {
            label: "Toplam Stok Kalemi",
            value: totalStock,
            icon: Database,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            link: null,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2.5 rounded-2xl", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5 pointer-events-none" />
              </div>
              {stat.link && (
                <Link
                  href={stat.link}
                  className="text-gray-300 hover:text-gray-900 transition-colors p-1 z-10"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500 mb-1">
                {stat.label}
              </p>
              <h4 className="text-3xl font-display font-semibold text-gray-900">
                {stat.value}
              </h4>
            </div>
            {/* Soft decorative blur */}
            <div
              className={cn(
                "absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40",
                stat.bg,
              )}
            />
          </div>
        ))}
      </div>

      {/* Main Grid: Charts & Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">
              Birimlere Göre Envanter Dağılımı
            </h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" />
              Son Hareketler
            </h3>
            <Link
              href="/statistics"
              className="text-xs font-medium text-gray-500 hover:text-gray-900 transition"
            >
              Tümü
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                İşlem bulunamadı
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-start group"
                >
                  <div className="flex gap-3 items-start">
                    <div
                      className={cn(
                        "mt-1 p-1.5 rounded-lg shrink-0",
                        tx.type === "GİRİŞ"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600",
                      )}
                    >
                      {tx.type === "GİRİŞ" ? (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 leading-snug">
                        {tx.unit}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {personnelMap[tx.personnelId] || "Bilinmiyor"} •{" "}
                        {tx.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-semibold font-mono",
                        tx.type === "GİRİŞ"
                          ? "text-emerald-600"
                          : "text-gray-900",
                      )}
                    >
                      {tx.type === "GİRİŞ" ? "+" : "-"}
                      {tx.quantity}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(tx.date).toLocaleDateString("tr-TR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Warning Cards specific for Bento */}
      {(unitStats.reduce((acc, s) => acc + s.zeroStockCount, 0) > 0 ||
        unitStats.reduce((acc, s) => acc + s.lowStockCount, 0) > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unitStats.reduce((acc, s) => acc + s.lowStockCount, 0) > 0 && (
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-6 text-white shadow-sm flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium mb-1">
                  Kritik Stok Uyarıları
                </p>
                <h4 className="text-3xl font-display font-semibold">
                  {unitStats.reduce((acc, s) => acc + s.lowStockCount, 0)} Kalem
                </h4>
              </div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
          {unitStats.reduce((acc, s) => acc + s.zeroStockCount, 0) > 0 && (
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-6 text-white shadow-sm flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">
                  Biten Stok Uyarıları
                </p>
                <h4 className="text-3xl font-display font-semibold">
                  {unitStats.reduce((acc, s) => acc + s.zeroStockCount, 0)}{" "}
                  Kalem
                </h4>
              </div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Units Bento Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">
          Birim Yönetimi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {unitStats.map((stats, i) => {
            const Icon = UNIT_ICONS[stats.name];
            const unitPath =
              stats.name === "Vefa Temizlik"
                ? "vefa"
                : stats.name === "Aşevi"
                  ? "asevi"
                  : stats.name === "Dergah"
                    ? "dergah"
                    : stats.name === "Bağış"
                      ? "bagis"
                      : "vakif";
            return (
              <Link
                key={stats.name}
                href={`/unit/${unitPath}`}
                className="group bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: `${COLORS[i % COLORS.length]}15`,
                      color: COLORS[i % COLORS.length],
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {stats.zeroStockCount > 0 && (
                      <span className="flex items-center text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-2.5 h-2.5 mr-1" />
                        {stats.zeroStockCount} Bitti
                      </span>
                    )}
                    {stats.lowStockCount > 0 && (
                      <span className="flex items-center text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                        {stats.lowStockCount} Kritik
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {stats.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[13px] text-gray-500">
                    <span>{stats.itemCount} Kalem</span>
                    <span className="flex items-center">
                      {stats.transactionCount} İşlem
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex justify-center items-end sm:items-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" /> Rapor Oluştur
              </h3>
            </div>
            <div className="p-6 space-y-5 flex flex-col">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">
                    Yıl
                  </label>
                  <div className="relative">
                    <select
                      value={reportYear}
                      onChange={(e) => setReportYear(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-gray-900 focus:border-gray-900 block p-3 appearance-none font-medium outline-none"
                    >
                      {[2023, 2024, 2025, 2026].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">
                    Ay
                  </label>
                  <div className="relative">
                    <select
                      value={reportMonth}
                      onChange={(e) => setReportMonth(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-gray-900 focus:border-gray-900 block p-3 appearance-none font-medium outline-none"
                    >
                      {[
                        "Ocak",
                        "Şubat",
                        "Mart",
                        "Nisan",
                        "Mayıs",
                        "Haziran",
                        "Temmuz",
                        "Ağustos",
                        "Eylül",
                        "Ekim",
                        "Kasım",
                        "Aralık",
                      ].map((m, i) => (
                        <option key={i} value={i}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    generateMonthlyInventoryReport(
                      allItems,
                      allTransactions,
                      allPersonnel,
                      reportMonth,
                      reportYear,
                    );
                    setShowReportModal(false);
                  }}
                  className="flex-[2] justify-center px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Rapor İndir
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

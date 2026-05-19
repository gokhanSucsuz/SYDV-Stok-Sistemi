"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Droplets,
  Utensils,
  Home,
  Gift,
  Building2,
  Menu,
  X,
  PackageOpen,
  BookOpen,
  LogOut,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_LOGO_URL, APP_NAME, APP_SUBTITLE } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Genel Bakış", href: "/", icon: LayoutDashboard },
  { name: "İhale Yönetimi", href: "/tenders", icon: PackageOpen },
  { name: "Malzeme Listesi", href: "/master-items", icon: PackageOpen },
  { name: "Personel Sicil", href: "/personnel", icon: Users, adminOnly: true },
  {
    name: "Birimler",
    subItems: [
      { name: "Vefa Temizlik", href: "/unit/vefa", icon: Droplets },
      { name: "Aşevi", href: "/unit/asevi", icon: Utensils },
      { name: "Dergah", href: "/unit/dergah", icon: Home },
      { name: "Bağış", href: "/unit/bagis", icon: Gift },
      { name: "Vakıf", href: "/unit/vakif", icon: Building2 },
    ],
  },
  { name: "Raporlar", href: "/statistics", icon: BarChart3, adminOnly: true },
  { name: "Sistem Yedekleri", href: "/backup", icon: Database, adminOnly: true },
  { name: "Yardım Merkezi", href: "/guide", icon: BookOpen },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, personnel, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (
      !loading &&
      user &&
      !personnel &&
      !pathname.startsWith("/register") &&
      !pathname.startsWith("/pending-approval")
    )
      router.push("/register");
    else if (!loading && user && personnel && personnel.status === "pending" && !pathname.startsWith("/pending-approval")) {
      router.push("/pending-approval");
    }
  }, [user, personnel, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || (!personnel && !pathname.startsWith("/register") && !pathname.startsWith("/pending-approval")) || (personnel && personnel.status === "pending" && !pathname.startsWith("/pending-approval"))) return null;

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white shadow-xl lg:shadow-none lg:border-r border-gray-200 w-72">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-sm shrink-0 mr-3">
          <img
            src={APP_LOGO_URL}
            alt="Logo"
            className="w-5 h-5 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-display font-semibold text-gray-900 leading-none truncate">
            {APP_NAME}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium truncate">
            {APP_SUBTITLE}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navigation.map((group, i) => {
          if (group.adminOnly && personnel?.role !== "super_admin") return null;

          if (group.subItems) {
            return (
              <div key={i} className="space-y-2">
                <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {group.name}
                </div>
                {group.subItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                      pathname === item.href
                        ? "bg-red-50 text-red-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-4 w-4 shrink-0 transition-colors",
                        pathname === item.href
                          ? "text-red-600"
                          : "text-gray-400 group-hover:text-gray-600",
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            );
          }

          return (
            <Link
              key={group.name}
              href={group.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === group.href
                  ? "bg-red-50 text-red-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <group.icon
                className={cn(
                  "mr-3 h-4 w-4 shrink-0 transition-colors",
                  pathname === group.href
                    ? "text-red-600"
                    : "text-gray-400 group-hover:text-gray-600",
                )}
              />
              {group.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      {personnel && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Link href="/profile" className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm flex items-center space-x-3 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-red-100 to-red-50 flex items-center justify-center border border-red-100">
              <span className="font-semibold text-red-700 text-sm tracking-tight">
                {personnel.name
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {personnel.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {personnel.title}
              </p>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); logout(); }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex overflow-hidden">
      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              <NavContent />
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 -right-12 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0 z-10 sticky top-0 h-screen">
        <NavContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center">
              <img
                src={APP_LOGO_URL}
                alt="Logo"
                className="w-4 h-4"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-display font-semibold text-gray-900 text-lg">
              {APP_NAME}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-50 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  BookOpen,
  Shield,
  CheckCircle,
  HelpCircle,
  FileText,
  Settings,
  Database,
  Users,
  Package,
  ArrowRight,
} from "lucide-react";
import { APP_LOGO_URL } from "@/lib/constants";

export default function Guide() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-white border text-center py-12 px-4 sm:px-6 lg:px-8 shadow-sm rounded-3xl border-gray-100">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="p-4 bg-white rounded-3xl shadow-xl shadow-gray-200/50 mb-6 border border-gray-100">
            <img
              src={APP_LOGO_URL}
              alt="Logo"
              className="h-20 w-20 rounded-2xl"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-gray-900 mb-4">
            EDİRNE SYDV
          </h1>
          <h2 className="text-2xl text-gray-900 font-medium mb-4">
            Stok Yönetim Sistemi Rehberi
          </h2>
          <div className="h-1 w-16 bg-gray-900 rounded-full mb-6"></div>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Kullanıcı Kılavuzu ve Operasyonel Standartlar Referansı
          </p>
          <div className="mt-8 flex gap-4 text-xs font-semibold text-gray-400">
            <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-600">
              Sürüm 2.0
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-600">
              Nisan 2026
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-8">
        {/* Giriş */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center rounded-2xl mr-4">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-gray-900">
              Sistem Güvenliği ve KVKK
            </h2>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50 text-gray-600 leading-relaxed">
            <p className="mb-6 text-lg">
              Bu sistem, Edirne Sosyal Yardımlaşma ve Dayanışma Vakfı
              envanterinin dijital ortamda güvenli bir şekilde takip edilmesi
              amacıyla geliştirilmiştir. Sistemdeki tüm veriler{" "}
              <strong className="text-gray-900 font-semibold">
                6698 sayılı KVKK
              </strong>{" "}
              kapsamında korunmaktadır.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 shrink-0" />
                <span>
                  <strong className="text-gray-900 font-semibold">
                    Erişim Kısıtlaması:
                  </strong>{" "}
                  Sadece yetkili Google hesabı ile doğrulanan personel sisteme
                  erişebilir.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 shrink-0" />
                <span>
                  <strong className="text-gray-900 font-semibold">
                    Veri Şifreleme:
                  </strong>{" "}
                  TC Kimlik Numaraları ve şifreler veritabanında AES-256
                  standardında şifrelenmiş olarak saklanır.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 shrink-0" />
                <span>
                  <strong className="text-gray-900 font-semibold">
                    İşlem Logları:
                  </strong>{" "}
                  Yapılan her stok hareketi, işlemi yapan personelin bilgisiyle
                  birlikte kalıcı olarak kaydedilir.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Temel Modüller */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-100 text-gray-900 flex items-center justify-center rounded-2xl mr-4">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-gray-900">
              Operasyonel Modüller
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stok Yönetimi */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Stok ve Envanter
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Ürünlerin sisteme tanımlanması, kritik stok seviyelerinin
                belirlenmesi ve güncel miktarların takibi bu modül üzerinden
                yapılır.
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600">
                Özellikler: Stok Takibi, İhale Yönetimi
              </div>
            </div>

            {/* Personel Yönetimi */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Personel Yetkilendirme
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Sistemi kullanacak personellerin tanımlanması ve işlem yetkileri
                ile izleme bilgileri bu modülde saklanır.
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600">
                Özellikler: Yetkilendirme, Log Kaydı
              </div>
            </div>

            {/* Yedekleme */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Veri Yedekleme
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Tüm sistem verilerinin güvenliği için yedekleme araçları.
                Yedeklerin dışa aktarılması sağlanır.
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600">
                Özellikler: Otomatik Uyarı, JSON Çıktı
              </div>
            </div>

            {/* Raporlama */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Raporlama ve Analiz
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Geçmişe dönük tüm stok hareketlerinin, personellerin işlem
                geçmişinin detaylı incelenip raporlanabildiği alan.
              </p>
              <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600">
                Özellikler: İndirilebilir Raporlar
              </div>
            </div>
          </div>
        </section>

        {/* Adım Adım Kullanım */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center rounded-2xl mr-4">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-gray-900">
              Adım Adım Kullanım Rehberi
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Sisteme Giriş
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  Google hesabınızla giriş yapın. Ardından güvenli bir şekilde
                  sisteme bağlanmak için kayıtlı personel doğrulaması
                  gerçekleşir.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Ürün ve İhale Tanımlama
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  Yeni ihaleler ekleyin ve ihale içerisine ürünleri kaydedin.
                  İhale bazlı ürün yönetimi stok çıkış süreçlerini kontrol eder.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Stok Hareketleri
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  Ürün giriş veya çıkışı yaparken "Belge No" ve "Açıklama"
                  girin. İlgili evrak açıklamaları raporlamada referans
                  oluşturur.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Yedekleme ve Güvenlik
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  Verilerinizin güvenliği için periyodik olarak manuel yedekler
                  alın ve bu yedekleri harici ortamda saklayın.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SSS */}
        <section>
          <div className="bg-gray-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <HelpCircle className="w-48 h-48" />
            </div>
            <h2 className="text-3xl font-display font-semibold mb-8 relative z-10">
              Sıkça Sorulan Sorular
            </h2>
            <div className="space-y-8 relative z-10">
              <div>
                <p className="font-semibold text-lg mb-2">
                  Sisteme erişimde sorun yaşıyorum?
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Yetkili Google hesabı ile oturum açtığınızdan ve personel
                  kaydınızın olduğundan emin olun. Gerekirse sistem
                  yöneticisiyle iletişime geçin.
                </p>
              </div>
              <div>
                <p className="font-semibold text-lg mb-2">
                  Silinen veya hatalı girilen veriler düzeltilebilir mi?
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Sistemde geriye dönük veri tutarlılığı açısından iptal veya
                  düzenleme işlem özelliklerini kullanabilirsiniz. Eğer veriler
                  tamamen silinirse son yedekten dönmeniz gerekir.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

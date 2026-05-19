"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Shield,
  FileText,
  Settings,
  Database,
  Users,
  Package,
  Layers,
  Code,
  Archive,
  BarChart,
  Home,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { APP_LOGO_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "tech", label: "Sistem ve Teknoloji", icon: Code },
  { id: "dashboard", label: "Ana Panel", icon: Home },
  { id: "master-items", label: "Master Malzemeler", icon: Archive },
  { id: "tenders", label: "İhale ve Stok Girişi", icon: Package },
  { id: "units", label: "Birim İşlemleri", icon: Layers },
  { id: "reports", label: "Raporlama ve Analiz", icon: BarChart },
  { id: "personnel", label: "Personel ve Güvenlik", icon: Users },
  { id: "backup", label: "Yedekleme", icon: Database },
];

export default function Guide() {
  const [activeTab, setActiveTab] = useState("tech");

  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || BookOpen;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden bg-white shadow-sm border border-gray-100 rounded-3xl">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5">
            <img
              src={APP_LOGO_URL}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-gray-900 tracking-tight">
              Kullanım Kılavuzu & Yardım Merkezi
            </h1>
            <p className="text-xs font-medium text-gray-500 mt-0.5">
              Edirne SYDV Stok Takip Sistemi Detaylı Referansı
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-100">
            v2.0 Güncel
          </span>
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
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700">
                <ActiveIcon className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display font-semibold text-gray-900">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
            </div>

            {/* TAB CONTENT: Tech Stack */}
            {activeTab === "tech" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-gray-600 leading-relaxed text-lg">
                  Stok Takip Sistemi, modern web teknolojileri kullanılarak{" "}
                  <strong>Edirne SYDV</strong> için özel olarak tasarlanıp
                  üretilmiştir. Yüksek performanslı, güvenli ve gerçek zamanlı
                  eşitleme yeteneklerine sahiptir.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                    <h3 className="font-semibold text-blue-900 text-lg mb-4 flex items-center">
                      <Code className="w-5 h-5 mr-2 text-blue-600" /> Frontend &
                      UI Mimarı
                    </h3>
                    <ul className="space-y-3 text-sm text-blue-800/80">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-500 shrink-0" />{" "}
                        <strong>React & Next.js 15:</strong> App Router mimarisi
                        ile sunucu tarafı render edilen, hızlı ve SEO dostu bir
                        yapı kurulmuştur.
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-500 shrink-0" />{" "}
                        <strong>Tailwind CSS:</strong> Tüm arayüz tasarımı (UI)
                        modern Tailwind utility class'ları kullanılarak
                        responsive (mobil uyumlu) şekilde kodlanmıştır.
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-500 shrink-0" />{" "}
                        <strong>Lucide Icons & Recharts:</strong> Sistemdeki
                        grafikler için Recharts, ikonografi için minimal Lucide
                        kütüphanesi tercih edilmiştir.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50">
                    <h3 className="font-semibold text-emerald-900 text-lg mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2 text-emerald-600" />{" "}
                      Backend & Veri Katmanı
                    </h3>
                    <ul className="space-y-3 text-sm text-emerald-800/80">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-emerald-500 shrink-0" />{" "}
                        <strong>MongoDB NoSQL:</strong> Yüksek hacimli veri
                        okuma/yazma işlemleri için ölçeklenebilir MongoDB
                        veritabanı kullanılmaktadır.
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-emerald-500 shrink-0" />{" "}
                        <strong>Next.js API Routes:</strong> Sunucudaki
                        işlemleri yöneten, veritabanı ile frontend arasındaki
                        iletişimi sağlayan güvenli API katmanı mevcuttur.
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-emerald-500 shrink-0" />{" "}
                        <strong>AES-256 Şifreleme:</strong> Hassas kullanıcı
                        bilgileri (özel şifreler, TC numaraları), endüstri
                        standardı olan AES ile veritabanında şifreli (encrypted)
                        formatta tutularak KVKK uyumu sağlanır.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Google Firebase & Güvenlik
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Sistem girişi, Google Authentication (Firebase) ile sadece
                    kurumsal yetkilendirilmiş Google adreslerinin sistem oturumu
                    açmasına izin verir. Bu hesap doğrulaması geçildikten sonra
                    dahi, ek bir kimlik/şifre doğrulaması yapılarak yetkisiz
                    kişilerin okuma yapması engellenir.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Sisteme giriş yaptığınızda ilk karşılaştığınız ekran{" "}
                  <strong>Ana Panel (Dashboard)</strong> tarafıdır. Bu sayfa
                  sistemdeki genel işleyişi kuşbakışı görmeniz için
                  tasarlanmıştır.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Kritik Stok Uyarıları
                      </h4>
                      <p className="text-sm text-gray-500">
                        Tüm ihalelerdeki ürünlerin miktarları kontrol edilir.
                        Sistemde Master Malzeme olarak tanımladığınız ürünün
                        "Kritik Stok Seviyesi"nin altına inen ürünler burada
                        kırmızı alarmla listelenir.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <BarChart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Özet İstatistikler
                      </h4>
                      <p className="text-sm text-gray-500">
                        Birimlere yapılan toplam çıkışlar ve ihale girişleri
                        grafiksel ve sayısal olarak özetlenir. Aynı zamanda ay
                        bazındaki işlemleri hızlıca kavrayabilirsiniz.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Son Hareketler (Loglar)
                      </h4>
                      <p className="text-sm text-gray-500">
                        Sistemde yapılan son 5 işlem (giriş, çıkış vb.) işlemi
                        yapan personelin ismi, tarihi ve saatine kadar ana
                        ekranda listelenir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Master Items */}
            {activeTab === "master-items" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Sistemdeki en önemli yenilik{" "}
                  <strong>Master Malzeme Veritabanı</strong> özelliğidir.
                  Geçmişteki gibi her defasında farklı isimlerde ürün girmek
                  yerine, öncelikle malzemeler kataloğa kaydedilir.
                </p>

                <ul className="list-disc pl-5 space-y-3 text-gray-600 mb-8 border-l-2 border-indigo-100 ml-2 py-2">
                  <li className="pl-2">
                    <strong>Excel'den Toplu Yükleme:</strong> Sağ üstteki
                    "Orijinal Şablon İndir" butonuna tıklayarak örnek excel'i
                    alın. Kendi ürünlerinizi aynı başlıklarla excel'e ekleyip
                    "Toplu Yükle" ile saniyeler içinde yüzlerce malzemeyi
                    kataloğa aktarabilirsiniz.
                  </li>
                  <li className="pl-2">
                    <strong>Tekil ve Gelişmiş Kayıt:</strong> Form ekranı ile
                    bir ürünün Barkodunu, Saklama Koşullarını (örn: Soğuk Hava
                    Deposu), Kategorisini ve özellikle{" "}
                    <strong>Kritik Stok Uyarı Seviyesini</strong>{" "}
                    tanımlayabilirsiniz.
                  </li>
                  <li className="pl-2">
                    <strong>Duplikasyon Engeli:</strong> Aynı isimdeki bir
                    malzemenin iki kez kataloğa kaydedilmesi engellenir, bu da
                    veritabanının temiz kalmasını sağlar.
                  </li>
                </ul>

                <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                  <h4 className="font-semibold text-indigo-900 flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />{" "}
                    Kullanım Amacı
                  </h4>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    İhale sayfasında yeni bir kalem ürün tanımlarken, sistem
                    artık buradaki kataloğu bir Google Arama motoru gibi
                    aramaktadır. Malzemenizi seçtiğiniz anda; birimi, kritik
                    stok uyarı limiti vb. otomatik form içine gelir. Bu sayede
                    yazım hataları %100 önlenir.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Tenders */}
            {activeTab === "tenders" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  <strong>İhale ve Envanter Yönetimi</strong> sayfası, kurumun
                  eline geçen stokların sisteme resmi olarak kaydedildiği
                  modüldür.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-100 pb-2">
                      1. Yeni İhale Oluşturma
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Öncelikle Kurum/İhale adı seçilir (Örn: Sosyal Yardımlar
                      Gn. Md., Bağışlar, Kızılay vb.). Ayrıca Fatura numarası,
                      Teslim alma tarihi ve Firma/Kişi bilgileri detaylıca
                      girilerek evrak oluşturulur.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg border-b border-gray-100 pb-2">
                      2. Ürünlerin Kalem Kalem İşlenmesi
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Oluşturulan ihalenin içine girilerek "Yeni Malzeme Ekle"
                      butonuna basılır. Açılan akıllı arama kutusuna ürün ismi
                      yazılarak Master katalogdan seçim yapılır. Sadece miktar,
                      fiyat vb. girilir kaydedilir.
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex items-start mt-6">
                  <AlertCircle className="w-5 h-5 text-orange-600 mr-3 mt-0.5 shrink-0" />
                  <p className="text-sm text-orange-800 leading-relaxed">
                    <strong>Dikkat:</strong> Bir ihaleyi sildiğinizde, o ihaleye
                    ait <u>tüm ürünler</u> ve o ürünlerin{" "}
                    <u>çıkış hareketleri</u> de güvenlik amacıyla (fiktif işlem
                    kalmaması için) sistemden silinir!
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Units */}
            {activeTab === "units" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Bu sekme menüsü altında, kurumun bünyesindeki birimler (Örn:
                  Vefa Temizlik, Aşevi, Dergah) bulunur. Bu sayfalar{" "}
                  <strong>Stok Çıkış İşlemlerinin</strong> yapıldığı yerdir.
                </p>

                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-2 flex items-center">
                        - Yeni Belge Ekleme
                      </h4>
                      <p className="text-gray-600 text-sm">
                        İlgili birimde işlemi kaydetmeden önce mutlaka o güne
                        veya o evraka ait bir "Belge No" oluşturulur. Belge no
                        (Tutanak no) ve açıklaması yazılır.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-2 flex items-center">
                        - Stok Çıkışı (Malzeme Ekle)
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Oluşturulan belgenin içine malzeme ekleneceği zaman,
                        sistem sadece <strong>stokta olan malzemeleri</strong>{" "}
                        size listeler. Stokta olmayan veya miktarı sıfırlanmış
                        hiçbir malzemeden çıkış yapamazsınız. Miktar kontrolü
                        otomatik yapılır, sistem stoğun (-) eksiye düşmesine
                        ASLA izin vermez.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-2 flex items-center">
                        - Çıktı / Rapor
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Oluşturduğunuz belgeye ait tüm çıkışları belge içinde
                        liste halinde görebilir, sağ üstteki "Yazdır" butonu ile
                        Tutanak/Resmi teslim tutanağı formatında kâğıt dökümünü
                        hemen alabilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Reports */}
            {activeTab === "reports" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  <strong>Raporlama ve Analizler</strong> sayfası sistemdeki tüm
                  faaliyetlerin resmi belge formunda çıkarıldığı alandır.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Stok (Giriş/Çıkış) Raporları
                    </h4>
                    <p className="text-sm text-gray-600">
                      Günlük, Haftalık veya Aylık olarak seçilebilir. Ayrıca
                      "Vefa Temizlik" gibi tek bir birim veya "Tümü" seçilerek
                      filtrelenebilir. Çıktılar PDF'e dönüştürülebilir
                      formattadır.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      İhale Bazlı Envanter Raporu
                    </h4>
                    <p className="text-sm text-gray-600">
                      Oluşturulan her bir ihaleye girilen malların listesini,
                      çıkışı yapıldıktan sonra kalan miktarları ve tutarlarını
                      ihale özelinde listeleyen detaylı formdur.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center mt-6">
                  <p className="text-gray-600 text-sm">
                    Dinamik Pasta Grafikleri ve Sütun Grafikleri sayesinde
                    kurumun elindeki malzemelerin değerleri ile birimlerin
                    yoğunluk oranlarını tek ekrandan gözlemleyebilirsiniz.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Personnel */}
            {activeTab === "personnel" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  <strong>Personeller ve Yetkilendirme</strong>, sistemin giriş
                  iznini kullanan kullanıcıların ve şifrelerinin tutulduğu
                  güvenlik duvarıdır.
                </p>

                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-gray-700 font-bold">
                        1
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          Sisteme İlk Kayıt Zorunludur
                        </h5>
                        <p className="text-sm text-gray-500 mt-1">
                          Google ile giriş yapılmasına rağmen, sistemde tanımlı
                          olmayan bir kişinin erişimi reddedilir. Bu sayfadan
                          isim, unvan ve şifre ile yetki oluşturun.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-gray-700 font-bold">
                        2
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          Her İşlemde Loglama
                        </h5>
                        <p className="text-sm text-gray-500 mt-1">
                          Stok girişi, malzeme çıkışı, ihale silinmesi gibi
                          sistemdeki tüm veritabanı değişiklikleri bu ekrandaki
                          personelin adıyla kaydedilir. Silinen verilerin
                          kaydında dahi bu yazar.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-gray-700 font-bold">
                        3
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          Çift Katmanlı Koruma
                        </h5>
                        <p className="text-sm text-gray-500 mt-1">
                          Önce Chrome üzerinde yetkili hesabı açık olmalıdır (1.
                          Katman). Sonrasında ise burada kaydedilen şifre
                          girilmelidir (2. Katman).
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Backup */}
            {activeTab === "backup" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Modern standartlara uygun olarak, sisteme entegre edilen
                  "Local Backup" fonksiyonu sayesinde tüm veriler her an
                  emniyete alınabilir.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 flex items-center mb-3">
                      <Download className="w-5 h-5 mr-2" /> Manuel Yedek Alma
                    </h4>
                    <p className="text-sm text-emerald-800 leading-relaxed">
                      Sayfada bulunan "Sistem Yedekleri" kısmından butona
                      tıkladığınızda; sistem o anki, İhaleler, Master
                      Malzemeler, Çıkış Fişleri, Personeller ve Logların
                      tamamını tek bir{" "}
                      <strong>JSON formatında sıkıştırarak</strong>{" "}
                      bilgisayarınıza indirir.
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-900 flex items-center mb-3">
                      <Archive className="w-5 h-5 mr-2 text-gray-500" />{" "}
                      Dosyaların Saklanması
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      İndirdiğiniz bu JSON yedek dosyalarını boş bir USB
                      bellekte, harici bir harddiskte veya Kuruma ait kurumsal
                      Google Drive klasöründe tarihli bir şekilde biriktirmeniz
                      önerilir.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-red-50 border border-red-100 rounded-3xl mt-6">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" /> KVKK Uyarı Sistemi
                  </h4>
                  <p className="text-sm text-red-800 leading-relaxed">
                    Yedekleme alınan format tüm veritabanı yansısı yapıldığı
                    için KVKK kapsamında hassas olan şifre vb alanları kendi
                    içinde <strong>şifreli (hash'lenmiş)</strong> şekilde
                    tutmaya devam eder. Temiz metin olarark kimse göremez. Yedek
                    dosyalarını yabancılarla paylaşılmaması esastır.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

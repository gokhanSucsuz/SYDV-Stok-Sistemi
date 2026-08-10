import { format } from "date-fns";
import { Item, Transaction, Personnel } from "./db";
import { APP_LOGO_URL } from "./constants";

export const generateBulkMuayeneKabul = (
  items: {
    name: string;
    quantity: number;
    unit: string;
    measurementUnit: string;
  }[],
  personnel: Personnel[],
  documentNo: string,
  tenderName: string,
  currentUser?: Personnel | null,
) => {
  const now = new Date();
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Muayene ve Kabul Tutanağı</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; margin: 40px; color: #000; line-height: 1.5; }
        .header { text-align: center; margin-bottom: 30px; position: relative; }
        .logo { position: absolute; left: 0; top: 0; width: 60px; height: 60px; border-radius: 50%; }
        .header h1 { font-size: 16px; margin: 5px 0; font-weight: bold; }
        .header h2 { font-size: 14px; margin: 5px 0; font-weight: normal; }
        .date-right { text-align: right; margin-bottom: 20px; font-size: 12px; }
        .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 20px; font-size: 16px; }
        .content { text-align: justify; margin-bottom: 30px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { margin-top: 50px; display: flex; justify-content: space-around; }
        .signature { text-align: center; width: 200px; font-size: 12px; }
        .signature p { margin: 5px 0; }
        .report-footer { margin-top: 40px; padding-top: 10px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right; }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${APP_LOGO_URL}" class="logo" />
        <h1>T.C.</h1>
        <h1>EDİRNE VALİLİĞİ</h1>
        <h2>Sosyal Yardımlaşma ve Dayanışma Vakfı Başkanlığı</h2>
      </div>
      
      <div class="date-right">
        Tarih: ${format(now, "dd.MM.yyyy")}
      </div>

      <div class="title">MUAYENE VE KABUL TUTANAĞI</div>

      <div class="content">
        <p><strong>İhale Adı:</strong> ${tenderName}</p>
        <p><strong>Evrak No:</strong> ${documentNo}</p>
        <p>Vakfımız tarafından ihalesi/alımı gerçekleştirilen aşağıda dökümü yapılan malzemeler, muayene ve kabul komisyonu tarafından incelenmiş, teknik şartnameye ve numuneye uygun olduğu tespit edilerek eksiksiz bir şekilde teslim alınmıştır.</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sıra No</th>
            <th>Malzeme Adı</th>
            <th>Miktar</th>
            <th>Birim</th>
            <th>Birim (Depo)</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.measurementUnit}</td>
              <td>${item.unit}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="content">
        <p>İşbu tutanak tarafımızca imza altına alınmıştır.</p>
      </div>

      <div class="footer">
        ${personnel
          .slice(0, 3)
          .map(
            (p) => `
          <div class="signature">
            <p><strong>${p.name}</strong></p>
            <p>${p.title}</p>
            <br/><br/>
            <p>(İmza)</p>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="report-footer">
        Raporu Hazırlayan: ${currentUser ? `${currentUser.name} (${currentUser.title})` : "Sistem"} | Yazdırılma: ${format(now, "dd.MM.yyyy HH:mm")}
      </div>

      <script>
        window.onload = function() { 
          setTimeout(() => {
            window.print(); 
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const generateItemReport = (
  mainItem: Item,
  relatedItems: Item[],
  transactions: Transaction[],
  personnel: Personnel[],
  type: "all" | "single" = "all",
  currentUser?: Personnel | null,
) => {
  const now = new Date();
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const personnelMap = new Map(personnel.map((p) => [p.id, p.name]));
  const itemIds =
    type === "all"
      ? new Set(relatedItems.map((i) => i.id))
      : new Set([mainItem.id]);

  const filteredTransactions = transactions
    .filter((tx) => itemIds.has(tx.itemId))
    .sort((a, b) => b.date - a.date);

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>${mainItem.name} Stok Raporu</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; margin: 30px; color: #000; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; position: relative; }
        .logo { position: absolute; left: 0; top: 0; width: 50px; height: 50px; border-radius: 50%; }
        .header h1 { font-size: 14px; margin: 2px 0; font-weight: bold; }
        .header h2 { font-size: 12px; margin: 2px 0; font-weight: normal; }
        .date-right { text-align: right; margin-bottom: 15px; font-size: 10px; }
        .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 15px; font-size: 14px; }
        .section-title { font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #000; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
        .signature { text-align: center; width: 180px; font-size: 11px; }
        .signature p { margin: 3px 0; }
        .report-footer { margin-top: 40px; padding-top: 10px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right; }
        @media print {
          body { margin: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${APP_LOGO_URL}" class="logo" />
        <h1>T.C.</h1>
        <h1>EDİRNE VALİLİĞİ</h1>
        <h2>Sosyal Yardımlaşma ve Dayanışma Vakfı Başkanlığı</h2>
      </div>
      
      <div class="date-right">
        Rapor Tarihi: ${format(now, "dd.MM.yyyy HH:mm")}
      </div>

      <div class="title">${mainItem.name.toUpperCase()} STOK HAREKET VE DURUM RAPORU</div>

      <div class="section-title">MEVCUT DURUM (TÜM İHALELER)</div>
      <table>
        <thead>
          <tr>
            <th>İhale/Bağış Adı</th>
            <th>Birim</th>
            <th>İhale Limiti</th>
            <th>Teslim Alınan</th>
            <th>Mevcut Stok</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          ${relatedItems
            .map(
              (item) => `
            <tr>
              <td>${item.tenderName || "Genel Stok"}</td>
              <td>${item.unit}</td>
              <td>${item.tenderLimit || "-"} ${item.measurementUnit}</td>
              <td>${item.totalReceived || 0} ${item.measurementUnit}</td>
              <td style="font-weight:bold;">${item.currentStock} ${item.measurementUnit}</td>
              <td>${item.tenderEndDate ? (item.tenderEndDate < Date.now() ? "Süresi Doldu" : "Aktif") : "Süresiz"}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="section-title">İŞLEM GEÇMİŞİ</div>
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>İhale/Bağış</th>
            <th>İşlem</th>
            <th>Miktar</th>
            <th>Kalan Stok</th>
            <th>Personel</th>
            <th>Evrak No</th>
            <th>Açıklama</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredTransactions.length === 0
              ? '<tr><td colspan="8" style="text-align:center;">İşlem kaydı bulunamadı.</td></tr>'
              : filteredTransactions
                  .map((tx) => {
                    const item = relatedItems.find((i) => i.id === tx.itemId);
                    return `
                <tr>
                  <td>${format(tx.date, "dd.MM.yyyy")}</td>
                  <td>${item?.tenderName || "Genel"}</td>
                  <td style="color: ${tx.type === "GİRİŞ" ? "green" : "red"}; font-weight: bold;">${tx.type}</td>
                  <td>${tx.quantity} ${item?.measurementUnit || ""}</td>
                  <td>${tx.remainingStock} ${item?.measurementUnit || ""}</td>
                  <td>${personnelMap.get(tx.personnelId) || "-"}</td>
                  <td>${tx.documentNo}</td>
                  <td>${tx.description}</td>
                </tr>
              `;
                  })
                  .join("")
          }
        </tbody>
      </table>

      <div class="footer">
        <div class="signature">
          <p>Hazırlayan</p>
          <br/><br/>
          <p><strong>${currentUser?.name || "................................"}</strong></p>
          <p>${currentUser?.title || "Vakıf Personeli"}</p>
        </div>
        <div class="signature">
          <p>Onaylayan</p>
          <br/><br/>
          <p>................................</p>
          <p>Vakıf Müdürü</p>
        </div>
      </div>

      <div class="report-footer">
        Raporu Hazırlayan: ${currentUser ? `${currentUser.name} (${currentUser.title})` : "Sistem"} | Yazdırılma: ${format(now, "dd.MM.yyyy HH:mm")}
      </div>

      <script>
        window.onload = function() { 
          setTimeout(() => {
            window.print(); 
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const generateMonthlyInventoryReport = (
  items: Item[],
  transactions: Transaction[],
  personnel: Personnel[],
  month: number,
  year: number,
  currentUser?: Personnel | null,
) => {
  const now = new Date();
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const monthNames = [
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
  ];

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  const filteredTransactions = transactions
    .filter(
      (tx) => tx.date >= startDate.getTime() && tx.date <= endDate.getTime(),
    )
    .sort((a, b) => a.date - b.date);

  const itemMap = new Map(items.map((i) => [i.id, i]));
  const personnelMap = new Map(personnel.map((p) => [p.id, p.name]));

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Aylık Envanter Raporu - ${monthNames[month]} ${year}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; margin: 30px; color: #000; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; position: relative; }
        .logo { position: absolute; left: 0; top: 0; width: 50px; height: 50px; border-radius: 50%; }
        .header h1 { font-size: 14px; margin: 2px 0; font-weight: bold; }
        .header h2 { font-size: 12px; margin: 2px 0; font-weight: normal; }
        .date-right { text-align: right; margin-bottom: 15px; font-size: 10px; }
        .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 15px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
        .signature { text-align: center; width: 180px; font-size: 11px; }
        .signature p { margin: 3px 0; }
        .report-footer { margin-top: 40px; padding-top: 10px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right; }
        @media print {
          body { margin: 15px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${APP_LOGO_URL}" class="logo" />
        <h1>T.C.</h1>
        <h1>EDİRNE VALİLİĞİ</h1>
        <h2>Sosyal Yardımlaşma ve Dayanışma Vakfı Başkanlığı</h2>
      </div>
      
      <div class="date-right">
        Rapor Tarihi: ${format(now, "dd.MM.yyyy HH:mm")}
      </div>

      <div class="title">${monthNames[month].toUpperCase()} ${year} DÖNEMİ TÜM BİRİMLER STOK HAREKET RAPORU</div>

      <table>
        <thead>
          <tr>
            <th>Sıra</th>
            <th>Tarih</th>
            <th>Birim</th>
            <th>Malzeme Adı</th>
            <th>İşlem</th>
            <th>Miktar</th>
            <th>Birim</th>
            <th>Personel</th>
            <th>Evrak No</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredTransactions.length === 0
              ? '<tr><td colspan="9" style="text-align:center;">Bu dönemde herhangi bir hareket bulunmamaktadır.</td></tr>'
              : filteredTransactions
                  .map((tx, index) => {
                    const item = itemMap.get(tx.itemId);
                    return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${format(tx.date, "dd.MM.yyyy")}</td>
                  <td>${tx.unit}</td>
                  <td>${item?.name || "Bilinmeyen"}</td>
                  <td style="color: ${tx.type === "GİRİŞ" ? "green" : "red"}; font-weight: bold;">${tx.type}</td>
                  <td>${tx.quantity}</td>
                  <td>${item?.measurementUnit || "-"}</td>
                  <td>${personnelMap.get(tx.personnelId) || "-"}</td>
                  <td>${tx.documentNo}</td>
                </tr>
              `;
                  })
                  .join("")
          }
        </tbody>
      </table>

      <div class="footer">
        <div class="signature">
          <p>Hazırlayan</p>
          <br/><br/>
          <p><strong>${currentUser?.name || "................................"}</strong></p>
          <p>${currentUser?.title || "Vakıf Personeli"}</p>
        </div>
        <div class="signature">
          <p>Onaylayan</p>
          <br/><br/>
          <p>................................</p>
          <p>Vakıf Müdürü</p>
        </div>
      </div>

      <div class="report-footer">
        Raporu Hazırlayan: ${currentUser ? `${currentUser.name} (${currentUser.title})` : "Sistem"} | Yazdırılma: ${format(now, "dd.MM.yyyy HH:mm")}
      </div>

      <script>
        window.onload = function() { 
          setTimeout(() => {
            window.print(); 
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const generateTenderReport = (
  tenderName: string,
  unit: string,
  tenderItems: Item[],
  allItems: Item[],
  transactions: Transaction[],
  personnel: Personnel[],
  currentUser?: Personnel | null,
) => {
  const now = new Date();
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const personnelMap = new Map(personnel.map((p) => [p.id, p.name]));
  const tenderItemIds = new Set(tenderItems.map((i) => i.id));

  // Filter transactions related to this tender's items
  const filteredTransactions = transactions
    .filter((tx) => tenderItemIds.has(tx.itemId))
    .sort((a, b) => b.date - a.date);

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>${tenderName} İhale Raporu</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; margin: 30px; color: #000; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; position: relative; }
        .logo { position: absolute; left: 0; top: 0; width: 50px; height: 50px; border-radius: 50%; }
        .header h1 { font-size: 14px; margin: 2px 0; font-weight: bold; }
        .header h2 { font-size: 12px; margin: 2px 0; font-weight: normal; }
        .date-right { text-align: right; margin-bottom: 15px; font-size: 10px; }
        .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 15px; font-size: 14px; }
        .section-title { font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #000; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
        .signature { text-align: center; width: 180px; font-size: 11px; }
        .signature p { margin: 3px 0; }
        .info-box { border: 1px solid #000; padding: 10px; margin-bottom: 20px; font-size: 11px; }
        .report-footer { margin-top: 40px; padding-top: 10px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right; }
        @media print {
          body { margin: 15px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${APP_LOGO_URL}" class="logo" />
        <h1>T.C.</h1>
        <h1>EDİRNE VALİLİĞİ</h1>
        <h2>Sosyal Yardımlaşma ve Dayanışma Vakfı Başkanlığı</h2>
      </div>
      
      <div class="date-right">
        Rapor Tarihi: ${format(now, "dd.MM.yyyy HH:mm")}
      </div>

      <div class="title">İHALE DETAY VE STOK DURUM RAPORU</div>

      <div class="info-box">
        <strong>İhale Adı:</strong> ${tenderName}<br/>
        <strong>Birim:</strong> ${unit}<br/>
        <strong>İhale Türü:</strong> ${tenderItems[0]?.tenderType || "İhale"}<br/>
        <strong>Bitiş Tarihi:</strong> ${tenderItems[0]?.tenderEndDate ? format(tenderItems[0].tenderEndDate, "dd.MM.yyyy") : "Belirtilmemiş"}
      </div>

      <div class="section-title">İHALE KAPSAMINDAKİ ÜRÜNLER VE STOK DURUMU</div>
      <table>
        <thead>
          <tr>
            <th>Sıra</th>
            <th>Ürün Adı</th>
            <th>İhale Limiti</th>
            <th>Teslim Alınan</th>
            <th>Harcanan</th>
            <th>Kalan Stok</th>
            <th>Diğer İhaleler</th>
          </tr>
        </thead>
        <tbody>
          ${tenderItems
            .map((item, index) => {
              const received = item.totalReceived || 0;
              const current = item.currentStock || 0;
              const spent = received - current;

              // Check other tenders for the same product
              const otherTenders = allItems.filter(
                (i) => i.name === item.name && i.id !== item.id,
              );
              const otherTendersInfo =
                otherTenders.length > 0
                  ? `${otherTenders.length} Farklı İhale (${otherTenders.reduce((acc, curr) => acc + (curr.currentStock || 0), 0)} ${item.measurementUnit})`
                  : "Yok";

              return `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.tenderLimit} ${item.measurementUnit}</td>
                <td>${received} ${item.measurementUnit}</td>
                <td>${spent.toFixed(2)} ${item.measurementUnit}</td>
                <td style="font-weight:bold;">${current} ${item.measurementUnit}</td>
                <td>${otherTendersInfo}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>

      <div class="section-title">BU İHALE İLE İLGİLİ YAPILAN İŞLEMLER</div>
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Ürün</th>
            <th>İşlem</th>
            <th>Miktar</th>
            <th>Personel</th>
            <th>Evrak No</th>
            <th>Açıklama</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredTransactions.length === 0
              ? '<tr><td colspan="7" style="text-align:center;">İşlem kaydı bulunamadı.</td></tr>'
              : filteredTransactions
                  .map((tx) => {
                    const item = tenderItems.find((i) => i.id === tx.itemId);
                    return `
                <tr>
                  <td>${format(tx.date, "dd.MM.yyyy")}</td>
                  <td>${item?.name || "Bilinmeyen"}</td>
                  <td style="color: ${tx.type === "GİRİŞ" ? "green" : "red"}; font-weight: bold;">${tx.type}</td>
                  <td>${tx.quantity} ${item?.measurementUnit || ""}</td>
                  <td>${personnelMap.get(tx.personnelId) || "-"}</td>
                  <td>${tx.documentNo}</td>
                  <td>${tx.description}</td>
                </tr>
              `;
                  })
                  .join("")
          }
        </tbody>
      </table>

      <div class="footer">
        <div class="signature">
          <p>Hazırlayan</p>
          <br/><br/>
          <p><strong>${currentUser?.name || "................................"}</strong></p>
          <p>${currentUser?.title || "Vakıf Personeli"}</p>
        </div>
        <div class="signature">
          <p>Onaylayan</p>
          <br/><br/>
          <p>................................</p>
          <p>Vakıf Müdürü</p>
        </div>
      </div>

      <div class="report-footer">
        Raporu Hazırlayan: ${currentUser ? `${currentUser.name} (${currentUser.title})` : "Sistem"} | Yazdırılma: ${format(now, "dd.MM.yyyy HH:mm")}
      </div>

      <script>
        window.onload = function() { 
          setTimeout(() => {
            window.print(); 
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const generateProjectPresentationPDF = (currentUser?: Personnel | null) => {
  const now = new Date();
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Edirne SYDV Stok ve İhale Yönetim Sistemi - Proje Sunumu ve Değerlendirme Raporu</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #dc2626;
          padding-bottom: 15px;
          margin-bottom: 25px;
          position: relative;
        }
        .logo {
          position: absolute;
          left: 0;
          top: 0;
          width: 65px;
          height: 65px;
          object-fit: contain;
        }
        .header h1 {
          font-size: 16px;
          margin: 2px 0;
          color: #991b1b;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .header h2 {
          font-size: 14px;
          margin: 2px 0;
          color: #374151;
          font-weight: 600;
        }
        .header h3 {
          font-size: 12px;
          margin: 4px 0 0 0;
          color: #6b7280;
          font-weight: 500;
        }
        .doc-meta {
          display: flex;
          justify-content: space-between;
          background: #fef2f2;
          border: 1px solid #fecaca;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 11px;
          margin-bottom: 25px;
          color: #991b1b;
        }
        .doc-title {
          text-align: center;
          font-size: 18px;
          font-weight: 800;
          color: #991b1b;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .section-header {
          font-size: 14px;
          font-weight: 700;
          color: #991b1b;
          border-left: 4px solid #dc2626;
          padding-left: 10px;
          margin-bottom: 12px;
          background: #fcfcfc;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        p {
          font-size: 11px;
          margin-bottom: 10px;
          text-align: justify;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 15px;
        }
        .card-red {
          background: #fef2f2;
          border: 1px solid #fee2e2;
        }
        .card-emerald {
          background: #ecfdf5;
          border: 1px solid #d1fae5;
        }
        .card-blue {
          background: #eff6ff;
          border: 1px solid #dbeafe;
        }
        .card-title {
          font-weight: 700;
          font-size: 12px;
          margin-bottom: 6px;
          color: #111827;
        }
        ul {
          margin: 0;
          padding-left: 18px;
          font-size: 11px;
        }
        li {
          margin-bottom: 6px;
        }
        .table-custom {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 15px;
          font-size: 10px;
        }
        .table-custom th, .table-custom td {
          border: 1px solid #d1d5db;
          padding: 7px 10px;
          text-align: left;
        }
        .table-custom th {
          background: #f3f4f6;
          color: #1f2937;
          font-weight: 700;
        }
        .signatures {
          margin-top: 40px;
          display: flex;
          justify-content: space-around;
          page-break-inside: avoid;
        }
        .sig-box {
          text-align: center;
          width: 200px;
          font-size: 11px;
        }
        .sig-line {
          margin-top: 45px;
          border-top: 1px solid #9ca3af;
          padding-top: 4px;
        }
        .footer-note {
          margin-top: 30px;
          font-size: 9px;
          color: #6b7280;
          text-align: center;
          border-top: 1px dashed #e5e7eb;
          padding-top: 8px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${APP_LOGO_URL}" class="logo" />
        <h1>T.C. EDİRNE VALİLİĞİ</h1>
        <h2>SOSYAL YARDIMLAŞMA VE DAYANIŞMA VAKFI BAŞKANLIĞI</h2>
        <h3>Kurumsal Stok ve İhale Yönetim Sistemi Proje Sunumu & Değerlendirme Raporu</h3>
      </div>

      <div class="doc-meta">
        <div><strong>Doküman Türü:</strong> Proje Sunum & Fizibilite Raporu</div>
        <div><strong>Tarih:</strong> ${format(now, "dd.MM.yyyy")}</div>
        <div><strong>Hazırlayan:</strong> ${currentUser ? `${currentUser.name} (${currentUser.title})` : "Sistem Yetkilisi"}</div>
      </div>

      <div class="doc-title">PROJE ÖZETİ VE FAYDA ANALİZİ</div>

      <!-- 1. YÖNETİCİ ÖZETİ -->
      <div class="section">
        <div class="section-header">1. YÖNETİCİ ÖZETİ & PROJE AMACI</div>
        <p>
          Edirne Sosyal Yardımlaşma ve Dayanışma Vakfı (SYDV) bünyesinde yürütülen ayni yardımlar, aşevi faaliyetleri, Vefa evde bakım ve temizlik hizmetleri ile bağış kabullerinde kullanılan malzeme ve ihalelerin uçtan uca dijital ortamda takip edilmesi amacıyla <strong>Edirne SYDV Kurumsal Stok ve İhale Yönetim Sistemi</strong> geliştirilmiştir.
        </p>
        <p>
          Sistem; kamu kaynaklarının etkin, verimli, şeffaf ve hesap verilebilir bir şekilde kullanılmasını sağlamak, mükerrer alımları önlemek, kritik stok durumlarını ve son kullanma tarihlerini anlık alarmlarla tespit etmek üzere tasarlanmış modern bir dijital altyapıdır.
        </p>
      </div>

      <!-- 2. PROJENİN NEDEN GEREKLİ OLDUĞU (PROBLEMLER) -->
      <div class="section">
        <div class="section-header">2. PROJENİN NEDEN GEREKLİ OLDUĞU (MEVCUT PROBLEMLER VE İHTİYAÇLAR)</div>
        <div class="grid-2">
          <div class="card card-red">
            <div class="card-title">Geleneksel / Manuel Takibin Riskleri</div>
            <ul>
              <li><strong>Veri Dağınıklığı:</strong> Farklı birimlerin (Aşevi, Vefa, Dergah vb.) kâğıt tutanak veya bağımsız Excel tablolarıyla çalışması sonucu genel envanterin anlık olarak görülememesi.</li>
              <li><strong>İnsan Hatası ve Zaman Kaybı:</strong> Manuel stok sayımları ve evrak takibinin personel üzerinde ciddi iş yükü oluşturması.</li>
              <li><strong>Kritik Stok ve Zayiat Riski:</strong> Malzeme stok seviyelerinin tükenmesi veya son kullanma tarihlerinin gözden kaçması sonucu yardım hizmetlerinde aksama yaşanması.</li>
            </ul>
          </div>
          <div class="card card-red">
            <div class="card-title">İhale ve Denetim Zorlukları</div>
            <ul>
              <li><strong>İhale Limiti Aşımı Tespiti:</strong> Gerçekleştirilen ihalelerden ne kadar ürün teslim alındığı ve ne kadar stok kaldığının anlık olarak izlenememesi.</li>
              <li><strong>Denetim ve İspat Zorluğu:</strong> Geçmişe dönük stok hareketleri, teslim tutanakları ve yetkili personel onaylarının geriye dönük hızlıca raporlanamaması.</li>
              <li><strong>Güvenlik ve İzolasyon Eksikliği:</strong> Yetkisiz kişilerin veri değiştirmesi veya silmesi durumunda log/iz kaydının tutulamaması.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 3. KURUMA SAĞLADIĞI FAYDALAR -->
      <div class="section">
        <div class="section-header">3. KURUMA SAĞLADIĞI MADDİ VE OPERASYONEL FAYDALAR</div>
        <div class="grid-2">
          <div class="card card-emerald">
            <div class="card-title">Operasyonel Mükemmellik ve Şeffaflık</div>
            <ul>
              <li><strong>%100 Dijital Takip ve Anlık Envanter:</strong> Tüm depoların, ihalelerin ve birim stoklarının anlık olarak tek panelden izlenmesi.</li>
              <li><strong>Sıfır Hata ile İhale Yönetimi:</strong> İhale limitleri ve teslim alınan miktarlar sistem tarafından sınırlandırılarak hatalı çıkışlar engellenir.</li>
              <li><strong>Otomatik Muayene ve Kabul Tutanakları:</strong> Resmi mevzuata uygun tutanakların ve teslim belgelerinin tek tıkla yazdırılabilir formatta üretilmesi.</li>
            </ul>
          </div>
          <div class="card card-emerald">
            <div class="card-title">Güvenlik, KVKK ve Veri Emniyeti</div>
            <ul>
              <li><strong>Çift Katmanlı Personel Yetkilendirme:</strong> Sadece yetkili personelin erişebildiği, şifreli ve rol tabanlı koruma.</li>
              <li><strong>AES-256 Şifreleme ve KVKK Uyumu:</strong> Hassas bilgilerin endüstri standardı kriptografi ile saklanması.</li>
              <li><strong>Kesintisiz Yedekleme (Local JSON Backup):</strong> Veritabanının her an tek tıkla yedeklenip emniyete alınabilmesi.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 4. VATANDAŞLARA VE İHTİYAÇ SAHİPLERİNE SAĞLADIĞI FAYDALAR -->
      <div class="section">
        <div class="section-header">4. İNSANLARA VE İHTİYAÇ SAHİPLERİNE SAĞLADIĞI SOSYAL FAYDALAR</div>
        <div class="card card-blue" style="margin-bottom: 15px;">
          <div class="card-title" style="color: #1e40af;">Hızlı, Kesintisiz ve Kaliteli Sosyal Yardım</div>
          <ul>
            <li><strong>Kesintisiz Aşevi ve Sıcak Yemek Hizmeti:</strong> Aşevi malzemelerinin (pirinç, bakliyat, et vb.) kritik stok alarmları sayesinde malzeme tükenmeden tedarik planı yapılır, ihtiyaç sahiplerinin yemeği bir gün bile aksamaz.</li>
            <li><strong>Vefa Evde Bakım & Temizlik Kalitesi:</strong> Yaşlı, engelli ve bakıma muhtaç vatandaşlarımıza ulaştırılan temizlik ve hijyen malzemeleri zamanında temin edilir.</li>
            <li><strong>Muayene-Kabul ile Kalite Güvencesi:</strong> İhale kapsamında teslim alınan tüm gıda ve malzemelerin teknik şartnameye uygunluğu denetlenir, vatandaşlara sadece sağlıklı ve kaliteli ürünler sunulur.</li>
            <li><strong>Adil Dağıtım ve Kamu Güveni:</strong> Kamu kaynaklarının amacına uygun, şeffaf ve izlenebilir bir şekilde dağıtılması toplumun devletine ve Vakfa olan güvenini artırır.</li>
          </ul>
        </div>
      </div>

      <!-- 5. MİMARİ VE MODÜLLER -->
      <div class="section">
        <div class="section-header">5. SİSTEM MİMARİSİ VE ÖNE ÇIKAN MODÜLLER</div>
        <table class="table-custom">
          <thead>
            <tr>
              <th>Modül Adı</th>
              <th>İşlevi</th>
              <th>Kazandırdığı Değer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Master Malzeme Kataloğu</strong></td>
              <td>Tüm malzemelerin standart kod, birim, barkod ve kritik limitlerle kaydedilmesi.</td>
              <td>Yazım hatalarını ve duplikasyonu %100 önler.</td>
            </tr>
            <tr>
              <td><strong>İhale ve Envanter Yönetimi</strong></td>
              <td>Sözleşme, fatura, firma bilgileri ve teslim alınan mal tutarlarının işlenmesi.</td>
              <td>Bütçe ve limit aşımını engelleyerek mali disiplin sağlar.</td>
            </tr>
            <tr>
              <td><strong>Birim Yönetimi (Çıkış)</strong></td>
              <td>Aşevi, Vefa, Dergah, Bağış ve Vakıf birimlerine malzeme çıkışı yapılması.</td>
              <td>Negatif stoğa düşmeyi engeller, resmi teslim tutanağı üretir.</td>
            </tr>
            <tr>
              <td><strong>Güvenlik ve Audit Log</strong></td>
              <td>Tüm veri değişikliklerinin zaman ve personel etiketiyle loglanması.</td>
              <td>Tam denetlenebilirlik ve sorumluluk zinciri oluşturur.</td>
            </tr>
            <tr>
              <td><strong>Mobil PWA Desteği</strong></td>
              <td>Cep telefonu ve tabletlerden uygulama gibi yüklenebilme ve saha kullanımı.</td>
              <td>Depo ve saha çalışanlarına yüksek mobilite sağlar.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 6. SONUÇ VE DEĞERLENDİRME -->
      <div class="section">
        <div class="section-header">6. SONUÇ VE DEĞERLENDİRME</div>
        <p>
          Edirne SYDV Kurumsal Stok ve İhale Yönetim Sistemi; teknolojik altyapısı, yüksek güvenlik standartları, kullanım kolaylığı ve sosyal faydası ile Vakfımızın hizmet kalitesini üst seviyeye taşımaktadır. Hem kurumsal kaynakların korunması hem de ihtiyaç sahibi vatandaşlarımıza daha hızlı ve kaliteli hizmet ulaştırılması bakımından vazgeçilmez bir dijital yatırımdır.
        </p>
      </div>

      <!-- İMZA ALANI -->
      <div class="signatures">
        <div class="sig-box">
          <p><strong>Raporu Hazırlayan</strong></p>
          <div class="sig-line">
            <p><strong>${currentUser?.name || "Sistem Sorumlusu"}</strong></p>
            <p>${currentUser?.title || "Vakıf Personeli"}</p>
          </div>
        </div>
        <div class="sig-box">
          <p><strong>Kurum Onayı</strong></p>
          <div class="sig-line">
            <p><strong>Sosyal Yardımlaşma ve Dayanışma Vakfı</strong></p>
            <p>Vakıf Müdürü / Başkanlığı</p>
          </div>
        </div>
      </div>

      <div class="footer-note">
        T.C. Edirne Valiliği SYDV Kurumsal Stok Yönetim Sistemi • Doküman Oluşturulma Tarihi: ${format(now, "dd.MM.yyyy HH:mm")}
      </div>

      <script>
        window.onload = function() { 
          setTimeout(() => {
            window.print(); 
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};


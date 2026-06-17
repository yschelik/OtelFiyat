import React, { useState, useEffect, useMemo } from "react";
import { 
  Clipboard, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Trash2, 
  Eye, 
  Settings, 
  Smartphone,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
  FileText,
  AlertCircle,
  Plus,
  Moon,
  Sun
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ParsedRoom {
  id: string;
  name: string;
  originalName: string;
  price: string;
  checked: boolean;
}

interface ParsedResult {
  giris: string;
  cikis: string;
  rooms: ParsedRoom[];
}

interface HistoryItem {
  id: string;
  timestamp: string;
  giris: string;
  cikis: string;
  roomCount: number;
  text: string;
}

// User's example paste data for demonstration
const SAMPLE_TATILBUDUR_PASTE = `"Mika Turizm Belge No : 3073

Otel 

Tur 

Yaz Fırsatları
Kampanyalar 

Giriş
15 Temmuz Çar

Çıkış
16 Temmuz Per
Kişi Sayısı

Tatilbudur 
İstanbul Otelleri 
Adalar Otelleri 
Büyükada Otelleri 
Palais Büyükada (+12)
Arama sonuçlarına geri dön

 Tüm Fotoğraflar
Palais Büyükada (+12)
Genel Özellikler
Odalar
Havuz ve Plaj

Favorilerime Ekle
Paylaş

Büyükada’nın merkezine yürüme mesafesinde olmakla beraber biraz daha izole ve sakin bir lokasyon isteyenlerin tercihi olan Palais Büyükada, zarafetiyle öne çıkmaktadır. Otelin mimarisi Köşk ve Yalı tipi yapılarının her ikisinden de izler taşır.
Devamını Oku
Öne Çıkan Özellikler

Özel Plaj
Açık Havuz
Wİ-Fi
Konum Bilgileri

Haritada Göster
Maden, Yılmaz Türk Cd. No:119, 34970 Adalar/İstanbul
Mevkii:
Büyükada
Sabiha Gökçen Havalimanı
17 km
Jolly Joker Arena
16 km
Tümünü gör
Kampanyalar
Sepette ek %5 indirim
Peşin Fiyatına 3 Taksit
 Tesis ile ilgili notlar
 Otele Giriş Saati : 14:00
 Otelden Çıkış Saati : 12:00
 Evcil Hayvan Kabul Ediyor mu ? : Hayır
 Sigara İçilebilir mi ? : Hayır
Konaklama için kişi sayısı tercihiniz

Giriş
15 Temmuz Çar

Çıkış
16 Temmuz Per

Kişi Sayısı

Odalar
Pita Standart Balkonsuz Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
24 m2

Bahçe Manzaralı *
Balkonsuz *Tümünü Gör >
Kriterlerinize en uygun oda
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın168 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
17.500
TL16.752TL
Worldcard ile sepette %5
15.914 TL
Rezervasyon Yap

Aloni Deluxe Deniz Manzaralı Bahçeli Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
20 m2

Ahşap Zemin *
Bahçe Alanı *Tümünü Gör >
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın177 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
18.500
TL17.712TL
Worldcard ile sepette %5
16.826 TL
Rezervasyon Yap

Neandros Deluxe Deniz Manzaralı Bahçeli Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
20 m2

Ahşap Zemin *
Bahçe Alanı *Tümünü Gör >
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın177 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
18.500
TL17.712TL
Worldcard ile sepette %5
16.826 TL
Rezervasyon Yap

Antigoni Suite Deniz Manzaralı Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
34 m2

Ahşap Zemin *
Bornoz & Terlik *Tümünü Gör >
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın192 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
20.000
TL19.152TL
Worldcard ile sepette %5
18.194 TL
Rezervasyon Yap

Halki Deluxe Deniz Manzaralı Balkonlu Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
22 m2

Ahşap Zemin *
Balkon *Tümünü Gör >
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın192 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
20.000
TL19.152TL
Worldcard ile sepette %5
18.194 TL
Rezervasyon Yap

Plati Deluxe Deniz Manzaralı Bahçeli Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
24 m2

Ahşap Zemin *
Bahçe Alanı *Tümünü Gör >
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın192 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
20.000
TL19.152TL
Worldcard ile sepette %5
18.194 TL
Rezervasyon Yap

Prinkipo Suit Deniz Manzaralı Balkonlu Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
32 m2

Balkon *
Balkonda Oturma Grubu *Tümünü Gör >
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın225 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
23.500
TL22.512TL
Worldcard ile sepette %5
21.386 TL
Rezervasyon Yap

Terevintos Suit Deniz Manzaralı Balkonlu Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
26 m2

Ahşap Zemin *
Bahçe Alanı *Tümünü Gör >
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın225 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
23.500
TL22.512TL
Worldcard ile sepette %5
21.386 TL
Rezervasyon Yap

Proti Family Hamamli Balkonsuz Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
42 m2

Ahşap Zemin *
Bahçe Manzaralı *Tümünü Gör >
İadesiz Oda Kahvaltı

Son 1 Oda
Alışveriş Kredisi
Taksitli Satış

Taksit Seçenekleri
TB Club Kazancın283 TB Puan
En İyi Fiyat Garantisi
Toplam Fiyat
29.500
TL28.272TL
Worldcard ile sepette %5
26.858 TL
Rezervasyon Yap

Oxis Standart Balkonsuz Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
16 m2

Ahşap Zemin *
Bahçe Manzaralı *Tümünü Gör >
İadesiz Oda Kahvaltı
Alışveriş Kredisi
Taksitli Satış
En İyi Fiyat Garantisi

Tesis, belirtmiş olduğunuz tarihlerde müsait değil veya sadece müşteri temsilcimiz ile rezervasyon yaptırabilirsiniz. 0 850 333 3 333 telefondan bilgi alabilirsiniz.

Offiousa Deluxe Deniz Manzaralı Balkonlu Oda
2 Yetişkin 1 Gece

Oda Müsaitlik Takvimi

Öne Çıkan Özellikler
22 m2

Bahçe Manzaralı *
Balkon *Tümünü Gör >
İadesiz Oda Kahvaltı
Alışveriş Kredisi
Taksitli Satış
En İyi Fiyat Garantisi

Tesis, belirtmiş olduğunuz tarihlerde müsait değil veya sadece müşteri temsilcimiz ile rezervasyon yaptırabilirsiniz. 0 850 333 3 333 telefondan bilgi alabilirsiniz.
"`;

const SAMPLE_HOTELS_PASTE = `"Hotels logosu

Seyahat Ara
Uygulamayı aç

TRY
Türkiye
Destek
Seyahatler
Giriş yap

Nereye?
Adalar, Istanbul, Türkiye
Tarihler24 Haz Çar - 25 Haz Per
Misafir sayısı2 misafir, 1 oda
Ara
Tüm konaklama yerlerini göster

Palais Büyükada
Maden Mah. Yılmaz Türk Cad. No: 119, Büyükada, İstanbul, 34970
Haritada göster

Oda seçin
Aramayı Değiştir
Giriş18 Haz
Çıkış19 Haz
Misafir sayısı2 misafir, 1 oda
Odalar için mevcut filtreler

Tüm odalar

1 yatak
2 yatak
11/11 oda gösteriliyor

En düşük fiyatımız
Standard Oda Balkonsuz (Oxis)
Ücretsiz kahvaltı
16 metre kare
1 yatak odası
2 kişilik
1 büyük (Queen) Boy Yatak

Toplayın ve Kullanın
Ücretsiz kablosuz internet
Geri ödemesiz

Daha çok detay
hakkında daha fazla detay
1 tane kaldı

Önceki fiyat 8.500 TL
8.500 TL
Şu anki fiyat 8.194 TL
8.194 TL
1 oda için
vergiler ve ücretler dâhildir

Rezervasyon yap

Standard Oda Balkonsuz (Pita)
Ücretsiz kahvaltı
24 metre kare
1 yatak odası
2 kişilik
1 büyük (Queen) Boy Yatak

Toplayın ve Kullanın
Ücretsiz kablosuz internet
Geri ödemesiz

Daha çok detay
hakkında daha fazla detay
1 tane kaldı

Önceki fiyat 9.500 TL
9.500 TL
Şu anki fiyat 9.158 TL
9.158 TL
1 oda için
vergiler ve ücretler dâhildir

Rezervasyon yap

Deluxe Oda, Deniz Manzaralı (Neandros)
Ücretsiz kahvaltı
Deniz manzarası
20 metre kare
1 yatak odası
2 kişilik
1 büyük (Queen) Boy Yatak

Toplayın ve Kullanın
Ücretsiz kablosuz internet
Mobilyalı avlu
Geri ödemesiz

Daha çok detay
1 tane kaldı

Önceki fiyat 11.500 TL
11.500 TL
Şu anki fiyat 11.086 TL
11.086 TL
1 oda için
vergiler ve ücretler dâhildir

Rezervasyon yap

Deluxe Oda, Deniz Manzaralı (Plati)
Ücretsiz kahvaltı
Deniz manzarası
22 metre kare
Boş odamız kalmadı

Palais Büyükada ile benzer konaklama yerleri
Mansion Milia
Büyükada
"`;

const CATALOG_LINKS: Record<string, string> = {
  prinkipo: "https://wa.me/p/9221009574675419/905378258288",
  terevintos: "https://wa.me/p/9758634994158600/905378258288",
  offiousa: "https://wa.me/p/9549534768464363/905378258288",
  proti: "https://wa.me/p/9633761176691796/905378258288",
  pita: "https://wa.me/p/9677675818960656/905378258288",
  oxis: "https://wa.me/p/9509723872459567/905378258288",
  antigoni: "https://wa.me/p/29329497843361140/905378258288",
  aloni: "https://wa.me/p/9575155225932000/905378258288",
  neandros: "https://wa.me/p/9639763799437819/905378258288",
  plati: "https://wa.me/p/29498774839736132/905378258288",
  halki: "https://wa.me/p/10039382519447870/905378258288"
};

const getCatalogLink = (roomName: string): string => {
  const clean = roomName.trim().toLowerCase().split(/\s+/)[0];
  return CATALOG_LINKS[clean] || "";
};

const parseTrDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const normalized = dateStr
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
  
  const match = normalized.match(/(\d+)\s+([a-z]+)/);
  if (!match) return null;
  
  const day = parseInt(match[1], 10);
  const monthName = match[2];
  
  const monthIndexMap: Record<string, number> = {
    ocak: 0,
    subat: 1,
    mart: 2,
    nisan: 3,
    mayis: 4,
    haziran: 5,
    temmuz: 6,
    agustos: 7,
    eylul: 8,
    ekim: 9,
    kasim: 10,
    aralik: 11
  };
  
  const month = monthIndexMap[monthName];
  if (month !== undefined) {
    const currentYear = new Date().getFullYear() || 2026;
    return new Date(currentYear, month, day);
  }
  return null;
};

const calculateNights = (girisStr: string, cikisStr: string): number => {
  const gDate = parseTrDate(girisStr);
  const cDate = parseTrDate(cikisStr);
  if (!gDate || !cDate) return 1;
  
  let diffMs = cDate.getTime() - gDate.getTime();
  if (diffMs < 0) {
    cDate.setFullYear(cDate.getFullYear() + 1);
    diffMs = cDate.getTime() - gDate.getTime();
  }
  
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
};

export default function App() {
  const [inputText, setInputText] = useState("");
  const [parseMode, setParseMode] = useState<"local" | "ai">("local");
  const [giris, setGiris] = useState("");
  const [cikis, setCikis] = useState("");
  const [rooms, setRooms] = useState<ParsedRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [sendCatalog, setSendCatalog] = useState(true);
  const [addDiscountText, setAddDiscountText] = useState(true);

  // Template settings
  const [headerTemplate, setHeaderTemplate] = useState("{giris} giriş - {cikis} çıkış olmak üzere:");
  const [roomTemplate, setRoomTemplate] = useState("{oda_adı}\n{fiyat} TL");
  const [footerTemplate, setFooterTemplate] = useState("");
  const [nameCleaningMode, setNameCleaningMode] = useState<"first-word" | "full" | "custom">("first-word");
  
  // Quick actions
  const [activeTab, setActiveTab] = useState<"editor" | "templates" | "history">("editor");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom price operations
  const [roundDown, setRoundDown] = useState(true);

  const getDisplayPrice = (priceStr: string, shouldRound: boolean): string => {
    if (!shouldRound) return priceStr;
    const cleaned = priceStr.replace(/[^0-9]/g, "");
    const num = parseInt(cleaned, 10);
    if (isNaN(num)) return priceStr;
    const rounded = Math.floor(num / 1000) * 1000;
    return rounded.toLocaleString("tr-TR");
  };

  // Load History from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("ota_parse_history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("History could not be read:", e);
    }
  }, []);

  // Save History helper
  const saveToHistory = (resolvedGiris: string, resolvedCikis: string, resolvedRooms: ParsedRoom[], finalOutput: string) => {
    try {
      if (resolvedRooms.length === 0) return;
      const newItem: HistoryItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) + " - " + new Date().toLocaleDateString("tr-TR"),
        giris: resolvedGiris,
        cikis: resolvedCikis,
        roomCount: resolvedRooms.length,
        text: finalOutput
      };
      const updatedHistory = [newItem, ...history].slice(0, 30); // limit to 30 items
      setHistory(updatedHistory);
      localStorage.setItem("ota_parse_history", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("History save failed:", e);
    }
  };

  // Local Parser script
  const parseLocalClipboard = (text: string) => {
    if (!text.trim()) {
      setGiris("");
      setCikis("");
      setRooms([]);
      setErrorStatus(null);
      return;
    }

    try {
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      let resolvedGiris = "";
      let resolvedCikis = "";
      let parsedRooms: ParsedRoom[] = [];

      const dayMap: Record<string, string> = {
        "Pzt": "Pazartesi",
        "Paz": "Pazar",
        "Sal": "Salı",
        "Çar": "Çarşamba",
        "Per": "Perşembe",
        "Cum": "Cuma",
        "Cmt": "Cumartesi"
      };

      // Helper to expand abbreviations like Haz -> haziran, Tem -> temmuz
      const expandDateAbbreviations = (dateStr: string): string => {
        let cleaned = dateStr.trim();
        const monthAbbrs: Record<string, string> = {
          "oca": "ocak",
          "ocak": "ocak",
          "şub": "şubat",
          "sub": "şubat",
          "şubat": "şubat",
          "mar": "mart",
          "mart": "mart",
          "nis": "nisan",
          "nisan": "nisan",
          "may": "mayıs",
          "mayıs": "mayıs",
          "haz": "haziran",
          "haziran": "haziran",
          "tem": "temmuz",
          "temmuz": "temmuz",
          "ağu": "ağustos",
          "agu": "ağustos",
          "ağustos": "ağustos",
          "eyl": "eylül",
          "eylül": "eylül",
          "eki": "ekim",
          "ekim": "ekim",
          "kas": "kasım",
          "kasım": "kasım",
          "ara": "aralık",
          "aralık": "aralık"
        };
        const words = cleaned.split(/\s+/);
        const mapped = words.map(word => {
          const lower = word.toLowerCase();
          if (monthAbbrs[lower]) return monthAbbrs[lower];
          for (const [abbr, fullName] of Object.entries(monthAbbrs)) {
            if (lower === abbr || (lower.startsWith(abbr) && lower.length === 3)) {
              return fullName;
            }
          }
          return word;
        });
        return mapped.join(" ");
      };

      // 1. Extract Check-In and Check-Out Dates
      // Look for compressed matches like "Giriş18 Haz" first
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        const girisMatch = line.match(/Giriş\s*:?\s*(\d+)\s*([a-zA-ZğüşıöçĞÜŞİÖÇ]+)/i);
        if (girisMatch) {
          const day = girisMatch[1];
          const rawMonth = girisMatch[2];
          const expandedMonth = expandDateAbbreviations(rawMonth);
          resolvedGiris = `${day} ${expandedMonth}`;
        }

        const cikisMatch = line.match(/Çıkış\s*:?\s*(\d+)\s*([a-zA-ZğüşıöçĞÜŞİÖÇ]+)/i);
        if (cikisMatch) {
          const day = cikisMatch[1];
          const rawMonth = cikisMatch[2];
          const expandedMonth = expandDateAbbreviations(rawMonth);
          resolvedCikis = `${day} ${expandedMonth}`;
        }
      }

      // Vertical stack fallback (e.g. Tatilbudur format where Giriş line is followed by the date line)
      if (!resolvedGiris || !resolvedCikis) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if ((line === "Giriş" || line.startsWith("Giriş")) && !resolvedGiris) {
            let rawGiris = "";
            if (line === "Giriş" && i + 1 < lines.length) {
              rawGiris = lines[i + 1].trim();
            } else if (line.startsWith("Giriş")) {
              rawGiris = line.substring(5).trim();
            }

            if (rawGiris && !rawGiris.match(/^\d+$/)) {
              let resolved = rawGiris;
              for (const [abbr, full] of Object.entries(dayMap)) {
                if (rawGiris.endsWith(abbr)) {
                  resolved = rawGiris.slice(0, rawGiris.length - abbr.length).trim() + " " + full;
                  break;
                }
              }
              resolvedGiris = expandDateAbbreviations(resolved);
            }
          }

          if ((line === "Çıkış" || line.startsWith("Çıkış")) && !resolvedCikis) {
            let rawCikis = "";
            if (line === "Çıkış" && i + 1 < lines.length) {
              rawCikis = lines[i + 1].trim();
            } else if (line.startsWith("Çıkış")) {
              rawCikis = line.substring(5).trim();
            }

            if (rawCikis && !rawCikis.match(/^\d+$/)) {
              let resolved = rawCikis;
              for (const [abbr, full] of Object.entries(dayMap)) {
                if (rawCikis.endsWith(abbr)) {
                  resolved = rawCikis.slice(0, rawCikis.length - abbr.length).trim() + " " + full;
                  break;
                }
              }
              resolvedCikis = expandDateAbbreviations(resolved);
            }
          }
        }
      }

      // 2. Identify Room Blocks
      // Slice lines up to "benzer konaklama" to only look at the current hotel
      const sliceEndIndex = lines.findIndex(l => {
        const lower = l.toLowerCase();
        return lower.includes("benzer konaklama") || lower.includes("benzer otel") || lower.includes("benzer tesis");
      });
      const activeLines = sliceEndIndex !== -1 ? lines.slice(0, sliceEndIndex) : lines;

      // Detect if we have Hotels.com-style triggers (lines ending with parenthesis code, like "(Oxis)")
      const hotelsRoomTriggers: Array<{ title: string; shortName: string; startIndex: number }> = [];
      for (let i = 0; i < activeLines.length; i++) {
        const line = activeLines[i].trim();
        const match = line.match(/^(.*?)\s*\(([A-Za-zÀ-ÿ]+)\)$/);
        if (match) {
          const originalName = line;
          const shortName = match[2];
          const lowerOrig = originalName.toLowerCase();
          
          if (
            shortName.toLowerCase() !== "com" && 
            !lowerOrig.includes("hotels") && 
            !lowerOrig.includes("harita") &&
            !lowerOrig.includes("yorum") &&
            !lowerOrig.includes("puan") &&
            !lowerOrig.includes("gecelik seyahat")
          ) {
            hotelsRoomTriggers.push({ title: originalName, shortName, startIndex: i });
          }
        }
      }

      if (hotelsRoomTriggers.length > 0) {
        // Hotels.com parser flow
        for (let r = 0; r < hotelsRoomTriggers.length; r++) {
          const start = hotelsRoomTriggers[r].startIndex;
          const end = r + 1 < hotelsRoomTriggers.length ? hotelsRoomTriggers[r + 1].startIndex : activeLines.length;
          
          const roomLines = activeLines.slice(start, end);
          const roomText = roomLines.join("\n").toLowerCase();
          
          // Filter out sold-out rooms
          const isNotAvailable = 
            roomText.includes("boş odamız kalmadı") || 
            roomText.includes("müsait değil") || 
            roomText.includes("odamız kalmadı");
          if (isNotAvailable) {
            continue;
          }

          let price = "";
          
          // A. Try to find "Önceki fiyat"
          const oncekiFiyatLine = roomLines.find(l => l.toLowerCase().includes("önceki fiyat"));
          if (oncekiFiyatLine) {
            const m = oncekiFiyatLine.match(/önceki fiyat\s*([\d.]+)/i);
            if (m) {
              price = m[1];
            }
          }
          
          // B. If not found, try to find "Şu anki fiyat" or "Güncel fiyat"
          if (!price) {
            const suAnkiFiyatLine = roomLines.find(l => l.toLowerCase().includes("şu anki fiyat") || l.toLowerCase().includes("güncel fiyat"));
            if (suAnkiFiyatLine) {
              const m = suAnkiFiyatLine.match(/(?:şu anki|güncel)\s*fiyat\s*([\d.]+)/i);
              if (m) {
                price = m[1];
              }
            }
          }
          
          // C. Try looking for direct formatted numeric lines (e.g., "8.500")
          if (!price) {
            for (const line of roomLines) {
              const cleanedVal = line.replace(/\s*TL/g, "").trim();
              if (/^\d{1,3}(\.\d{3})+$/.test(cleanedVal)) {
                price = cleanedVal;
                break;
              }
            }
          }

          if (price) {
            parsedRooms.push({
              id: `hotels-${r}-${Date.now()}`,
              name: hotelsRoomTriggers[r].shortName,
              originalName: hotelsRoomTriggers[r].title,
              price: price,
              checked: true
            });
          }
        }
      } else {
        // Fallback: original Tatilbudur parsing flow
        const roomTriggers: Array<{ title: string; startIndex: number }> = [];
        for (let i = 1; i < lines.length; i++) {
          const isYetiskinRow = lines[i].includes("Yetişkin") && lines[i].includes("Gece");
          if (isYetiskinRow) {
            const title = lines[i - 1];
            if (
              title && 
              !title.includes("Giriş") && 
              !title.includes("Çıkış") && 
              !title.includes("Müsaitlik") && 
              !title.includes("Kişi Sayısı") &&
              !title.match(/^\d+$/)
            ) {
              roomTriggers.push({ title, startIndex: i - 1 });
            }
          }
        }

        for (let r = 0; r < roomTriggers.length; r++) {
          const start = roomTriggers[r].startIndex;
          const end = r + 1 < roomTriggers.length ? roomTriggers[r + 1].startIndex : lines.length;
          
          const roomLines = lines.slice(start, end);
          const roomText = roomLines.join("\n");

          const isNotAvailable = 
            roomText.toLowerCase().includes("müsait değil") || 
            roomText.toLowerCase().includes("müzakereli") || 
            roomText.toLowerCase().includes("müşteri temsilcimiz");
          
          if (isNotAvailable) {
            continue;
          }

          let price = "";
          const tfIndex = roomLines.findIndex(l => l.toLowerCase().includes("toplam fiyat"));
          if (tfIndex !== -1) {
            for (let offset = 1; offset <= 3; offset++) {
              if (tfIndex + offset < roomLines.length) {
                const val = roomLines[tfIndex + offset];
                if (/^\d{1,3}(\.\d{3})+$/.test(val) || /^\d+$/.test(val)) {
                  price = val;
                  break;
                }
              }
            }
          }

          if (price) {
            const firstWord = roomTriggers[r].title.split(" ")[0];
            parsedRooms.push({
              id: `${r}-${Date.now()}`,
              name: firstWord,
              originalName: roomTriggers[r].title,
              price: price,
              checked: true
            });
          }
        }
      }

      setGiris(resolvedGiris || "Seçilen Tarih");
      setCikis(resolvedCikis || "Çıkış Tarihi");
      setRooms(parsedRooms);
      setErrorStatus(null);

      if (parsedRooms.length === 0) {
        setErrorStatus("Metinde hiç müsait oda ve fiyat bilgisi bulunamadı. Lütfen kopyaladığınız metni veya ayrıştırma modunu kontrol edin.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorStatus("Ayrıştırma sırasında beklenmedik hata oluştu: " + e.message);
    }
  };

  // AI Parser function tapping Express route
  const parseWithAI = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setErrorStatus(null);

    try {
      const response = await fetch("/api/parse-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Ayrıştırma servisinde hata oluştu.");
      }

      const data: any = await response.json();
      
      setGiris(data.giris || "");
      setCikis(data.cikis || "");

      if (data.rooms && Array.isArray(data.rooms)) {
        const resolvedRooms: ParsedRoom[] = data.rooms.map((r: any, idx: number) => ({
          id: `ai-${idx}-${Date.now()}`,
          name: r.name,
          originalName: r.originalName || r.name,
          price: r.price,
          checked: true
        }));
        setRooms(resolvedRooms);
        setErrorStatus(null);
      } else {
        setErrorStatus("Müsait oda listesi bulunamadı.");
      }
    } catch (e: any) {
      console.error("AI parse client fail:", e);
      setErrorStatus(e.message || "Yapay zeka motoru ile iletişim kurulamadı. Lütfen Yerel Ayrıştırma modunu deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run local parser on input paste/change instantly when in local mode
  useEffect(() => {
    if (parseMode === "local") {
      parseLocalClipboard(inputText);
    }
  }, [inputText, parseMode]);

  // Handle Demo Fill action
  const fillSampleTatilbudur = () => {
    setInputText(SAMPLE_TATILBUDUR_PASTE);
    setParseMode("local");
  };

  const fillSampleHotels = () => {
    setInputText(SAMPLE_HOTELS_PASTE);
    setParseMode("local");
  };

  // Reset tool
  const clearApp = () => {
    setInputText("");
    setGiris("");
    setCikis("");
    setRooms([]);
    setErrorStatus(null);
  };

  // Modify room properties
  const updateRoomChecked = (id: string, checked: boolean) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, checked } : r));
  };

  const updateRoomName = (id: string, name: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, name } : r));
  };

  const updateRoomPrice = (id: string, price: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, price } : r));
  };

  // Final processed string for WhatsApp preview
  const whatsAppMessageText = useMemo(() => {
    if (!giris && !cikis && rooms.length === 0) {
      return "";
    }

    let header = headerTemplate
      .replace("{giris}", giris)
      .replace("{cikis}", cikis);
      
    let activeRooms = rooms.filter(r => r.checked);
    let roomItemsString = activeRooms.map(r => {
      let displayName = r.name;
      if (nameCleaningMode === "full") {
        displayName = r.originalName;
      } else if (nameCleaningMode === "first-word") {
        displayName = r.name.split(" ")[0]; // ensure first word only
      }
      
      const priceStr = getDisplayPrice(r.price, roundDown);
      const catalogUrl = getCatalogLink(r.name);

      if (sendCatalog && catalogUrl) {
        return `${displayName}\n${catalogUrl}\n${priceStr} TL`;
      }

      return roomTemplate
        .replace("{oda_adı}", displayName)
        .replace("{fiyat}", priceStr);
    }).join("\n\n");

    let suffix = "";
    if (addDiscountText) {
      const nights = calculateNights(giris, cikis);
      suffix = `\n\nKahvaltı, Havuz Kullanımı, İskele Kullanımı  (Denize Sıfır Oteliz) dahil ${nights} gece 2 kişilik oda fiyatlarıdır.  Rezervasyon yapacağınız takdirde fiyatta yardımcı olmaya çalışırız. 🙏🏻`;
    }

    const message = `${header}\n\n${roomItemsString}${footerTemplate ? `\n\n${footerTemplate}` : ""}${suffix}`;
    return message;
  }, [giris, cikis, rooms, headerTemplate, roomTemplate, footerTemplate, nameCleaningMode, roundDown, sendCatalog, addDiscountText]);

  // Copy with clipboard feedback
  const copyOutputMessage = async () => {
    if (!whatsAppMessageText) return;
    try {
      await navigator.clipboard.writeText(whatsAppMessageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      saveToHistory(giris, cikis, rooms.filter(r => r.checked), whatsAppMessageText);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const copyHistoryText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("History copy failed:", e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("ota_parse_history");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Primary Header banner */}
      <header className="bg-slate-900 text-white py-4 px-6 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-inner">
              <Clipboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Otel Oda Fiyat Ayrıştırıcı(HOTELS.COM)</h1>
              <p className="text-xs text-slate-400">Web sitelerinden kopyalanan oda detaylarını WhatsApp mesajına dönüştürün</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={fillSampleHotels}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm cursor-pointer"
              id="load-hotels-btn"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Örnek Hotels.com Yükle
            </button>
            <button 
              onClick={fillSampleTatilbudur}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-all shadow-sm cursor-pointer"
              id="load-tatilbudur-btn"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Örnek Tatilbudur Yükle
            </button>
            <button 
              onClick={clearApp}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-all cursor-pointer"
              id="clear-app-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Temizle
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Paste & Parsing Controls */}
        <section className="lg:col-span-6 flex flex-col gap-5">
          {/* Paste Section */}
          <div id="paste-card" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Adım 1: Kopyalanan Sayfa Metnini Yapıştırın</h2>
              </div>
              
              {/* Mode Selector */}
              <div className="flex bg-slate-200 p-0.5 rounded-lg border border-slate-300">
                <button
                  onClick={() => setParseMode("local")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    parseMode === "local" 
                      ? "bg-white text-slate-900 shadow-xs" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Anında browser-side algoritmik ayrıştırma (Çevrimdışı & Güvenli)"
                >
                  Jet Hızlı (Local)
                </button>
                <button
                  onClick={() => setParseMode("ai")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-all ${
                    parseMode === "ai" 
                      ? "bg-indigo-600 text-white shadow-xs" 
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                  title="Gemini AI ile çok dilli ve esnek sayfa analizi"
                >
                  <Sparkles className="w-3 h-3" />
                  Yapay Zeka (AI)
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Rezervasyon web sitesinin oda detayları sayfasını 'Ctrl+A' ile tümünü seçip buraya yapıştırın (Ctrl+V)..."
                className="w-full h-80 px-4 py-3 text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-xs leading-relaxed resize-none"
                id="main-paste-area"
              />

              {parseMode === "ai" && (
                <div className="flex items-center justify-between gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="flex gap-2 text-indigo-800 text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>AI modu, standardın dışındaki otel formatlarını da esnekçe okuyup ayrıştırmasını sağlar.</span>
                  </div>
                  <button
                    onClick={parseWithAI}
                    disabled={isLoading || !inputText.trim()}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Ayrıştırılıyor...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        AI İle Çözümle
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Workings Details Panel */}
          {rooms.length > 0 && (
            <div id="editor-card" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <h2 className="text-sm font-semibold text-slate-700">Müsait Odalar ve Özelleştirme</h2>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 font-medium rounded-full">
                  {rooms.filter(r => r.checked).length} Oda Aktif
                </span>
              </div>

              {/* Quick calculations / offsets replaced with roundDown checkbox */}
              <div className="p-3 bg-indigo-50/50 border-b border-slate-200 px-4 flex items-center gap-3">
                <label className="flex items-center gap-3 text-xs text-slate-700 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={roundDown}
                    onChange={(e) => setRoundDown(e.target.checked)}
                    className="w-4.5 h-4.5 text-indigo-600 border-slate-300 rounded-md focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span>Fiyatları aşağı yuvarla</span>
                    <span className="text-[10px] text-slate-400 font-normal">(örn. 11.500 → 11.000, 13.950 → 13.000)</span>
                  </span>
                </label>
              </div>

              {/* Editable Room List */}
              <div className="flex-1 overflow-y-auto max-h-[320px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-4 w-12 text-center">Aktif</th>
                      <th className="py-2.5 px-3">WhatsApp Oda Adı</th>
                      <th className="py-2.5 px-3">Toplam Fiyat (TL)</th>
                      <th className="py-2.5 px-3 invisible sm:visible">Orijinal İsim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr 
                        key={room.id}
                        className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                          !room.checked ? "opacity-50" : ""
                        }`}
                      >
                        <td className="py-2.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={room.checked}
                            onChange={(e) => updateRoomChecked(room.id, e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={room.name}
                            onChange={(e) => updateRoomName(room.id, e.target.value)}
                            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col gap-0.5">
                            <input
                              type="text"
                              value={room.price}
                              onChange={(e) => updateRoomPrice(room.id, e.target.value)}
                              className="w-32 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                            />
                            {roundDown && getDisplayPrice(room.price, true) !== room.price && (
                              <span className="text-[10px] text-amber-600 font-semibold font-mono pl-1">
                                ↓ {getDisplayPrice(room.price, true)} TL
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-400 max-w-[150px] truncate" title={room.originalName}>
                          {room.originalName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Feedback/Error Display */}
          {errorStatus && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-semibold">{errorStatus}</p>
                <p className="text-xs text-amber-700/80 mt-1">Lütfen web sitesinden kopyaladığınız metnin tamamını (örneğin Ctrl+A ile) seçtiğinizden emin olun.</p>
              </div>
            </div>
          )}
        </section>

        {/* Right Side: Preview, Outputs & Configuration */}
        <section className="lg:col-span-6 flex flex-col gap-5">
          {/* Navigation Tab for Right Panel */}
          <div className="flex border-b border-slate-200 bg-white px-1.5 pt-1.5 rounded-t-2xl shadow-xs gap-1">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                activeTab === "editor"
                  ? "bg-slate-9 border-t-2 border-indigo-600 text-slate-900 bg-slate-50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              WhatsApp Gösterimi
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                activeTab === "templates"
                  ? "bg-slate-9 border-t-2 border-indigo-600 text-slate-900 bg-slate-50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Şablon Tasarımcı
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                activeTab === "history"
                  ? "bg-slate-9 border-t-2 border-indigo-600 text-slate-900 bg-slate-50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Geçmiş ({history.length})
            </button>
          </div>

          <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 shadow-sm p-5 flex flex-col flex-1 gap-5">
            {activeTab === "editor" && (
              <div className="flex flex-col gap-4 flex-1">
                {/* Simulated Smartphone Chat Preview */}
                <div className="flex-1 flex flex-col min-h-[350px]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 justify-between">
                    <span className="text-xs font-semibold text-slate-500">WhatsApp Mesaj Önizlemesi</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer select-none bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1 hover:bg-indigo-100/75 transition-colors">
                        <input
                          type="checkbox"
                          checked={addDiscountText}
                          onChange={(e) => setAddDiscountText(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded-md focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-slate-800">İndirim Yazısı Ekle</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer select-none bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 hover:bg-emerald-100/75 transition-colors">
                        <input
                          type="checkbox"
                          checked={sendCatalog}
                          onChange={(e) => setSendCatalog(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 border-slate-300 rounded-md focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="text-slate-800">Katalog Gönder</span>
                      </label>
                    </div>
                  </div>

                  {whatsAppMessageText ? (
                    <div className="relative flex-1 bg-teal-50/55 p-4 rounded-2xl border border-teal-100 flex flex-col gap-3 shadow-inner bg-[radial-gradient(#dcfce7_1.2px,transparent_1.2px)] [background-size:16px_16px]">
                      {/* Message Bubble wrapper */}
                      <div className="self-start max-w-[90%] bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tl-none p-3.5 shadow-xs relative text-sm border border-[#e1fad6]">
                        {/* Little triangle on WhatsApp style */}
                        <div className="absolute top-0 -left-2 w-0.5 h-0 border-[8px] border-solid border-transparent border-t-[#d9fdd3] border-r-[#d9fdd3]"></div>
                        
                        <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-slate-800">
                          {whatsAppMessageText}
                        </div>
                        <span className="text-[9px] text-emerald-600/70 block mt-2.5 text-right font-medium">Büyükada Palais</span>
                      </div>

                      {/* Floating Copy Action */}
                      <div className="mt-auto pt-4 flex gap-2">
                        <button
                          onClick={copyOutputMessage}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg text-sm cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-200" />
                              WhatsApp İçin Başarıyla Kopyalandı!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Panoya Kopyala ve Paylaş
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                      <Smartphone className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-sm font-semibold text-slate-500">Müsait oda veya fiyat bilgisi yok</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[280px]">Sol taraftaki kutuya kopyalanan metni yapıştırarak anında WhatsApp mesajınızı hazırlayın.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "templates" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-indigo-50 pb-2">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Şablon Düzeni Ayarla</h3>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Giriş / Başlık Mesaj Şablonu</label>
                    <input 
                      type="text"
                      value={headerTemplate}
                      onChange={(e) => setHeaderTemplate(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Tarihler için <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{"{giris}"}</code> ve <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{"{cikis}"}</code> etiketlerini kullanabilirsiniz.</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Odalar Satır Şablonu</label>
                    <textarea 
                      rows={2}
                      value={roomTemplate}
                      onChange={(e) => setRoomTemplate(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono resize-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Hizalama için <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{"{oda_adı}"}</code> ve <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{"{fiyat}"}</code> etiketlerini kullanabilirsiniz.</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Kapanış/Dipnot Şablonu</label>
                    <textarea 
                      placeholder="Mesajın en altına eklemek istediğiniz rezervasyon notu veya özel selamlama..."
                      rows={2}
                      value={footerTemplate}
                      onChange={(e) => setFooterTemplate(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <label className="text-xs font-semibold text-slate-600 block mb-2">Oda Adı Temizlik Modu</label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="clean-mode"
                          checked={nameCleaningMode === "first-word"}
                          onChange={() => setNameCleaningMode("first-word")}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Sadece İlk Kelime olsun (Ör: Pita, Aloni)</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="clean-mode"
                          checked={nameCleaningMode === "full"}
                          onChange={() => setNameCleaningMode("full")}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Tam açıklamayı koru (Ör: Pita Standart Balkonsuz Oda)</span>
                      </label>
                      <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="clean-mode"
                          checked={nameCleaningMode === "custom"}
                          onChange={() => setNameCleaningMode("custom")}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Serbest Düzenlenebilir Tablo Adlarını Kullan</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-xs font-semibold text-indigo-800 block mb-1">Şablon Sistemi Hakkında</span>
                  <p className="text-[11px] text-indigo-700/80 leading-relaxed">Şablonlar sayesinde her rezervasyon sorgusunda Whatsapp yazı biçiminiz otomatik hazırlanır. Yaptığınız ayarlar anında Whatsapp Önizlemesine yansır.</p>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between border-b border-indigo-50 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Geçmiş Sorgular</h3>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-[11px] text-rose-500 font-semibold hover:underline"
                    >
                      Geçmişi Temizle
                    </button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px]">
                    {history.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-500">{item.timestamp}</span>
                          <span>{item.roomCount} Oda Listelendi</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 truncate">
                          💡 {item.giris} - {item.cikis}
                        </div>
                        <button
                          onClick={() => copyHistoryText(item.text)}
                          className="mt-1 py-1.5 px-3 bg-white hover:bg-slate-100 text-[11px] text-slate-600 rounded-lg border border-slate-200 font-semibold flex items-center justify-center gap-1.5 transition whitespace-nowrap"
                        >
                          <Copy className="w-3 h-3" />
                          Metni Yeniden Kopyala
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <Smartphone className="w-12 h-12 text-slate-300 mb-2" />
                    <p className="text-xs font-medium text-slate-400">Henüz kopyalanmış mesaj geçmişi yok.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Small informative Footer */}
      <footer className="py-4 px-6 bg-slate-100 border-t border-slate-200 text-center text-slate-400 text-xs">
        <p>© 1997-2026 Otel Oda ve Fiyat Paylaşım Aracı. Hızlı ve Pratik.</p>
      </footer>
    </div>
  );
}

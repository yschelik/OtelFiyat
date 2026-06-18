import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (e) {
  console.error("Gemini API client initialization failed:", e);
}

// AI Parse Endpoint
app.post("/api/parse-ai", async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Geçersiz içerik girildi." });
  }

  if (!ai) {
    return res.status(503).json({ 
      error: "Gemini API anahtarı yüklü değil. Lütfen Secrets panelinden GEMINI_API_KEY anahtarını ayarlayın veya Yerel Ayrıştırma modunu kullanın." 
    });
  }

  try {
    const prompt = `Aşağıdaki metin bir otel detay veya oda müsaitlik sayfasından (Tatilbudur veya Hotels.com vb.) kopyalanmıştır (Ctrl+A ile).
Lütfen bu metinden giriş tarihini (giris), çıkış tarihini (cikis) ve müsait olan odaların adlarını ve toplam oda fiyatlarını çıkar.

Özellikle dikkat etmen gereken kurallar:
1. Tarihler:
   - Tatilbudur formatında: Genelde "Giriş" ve "Çıkış" başlıklarının alt satırlarındadır (Örn: "15 Temmuz Çar" -> "15 Temmuz Çarşamba") veya yan yana sıkışık yazılıdır (Örn: "Giriş22 Haziran Pzt" -> "22 haziran", "Çıkış23 Haziran Sal" -> "23 haziran"). Ayları küçük harfle ve kısaltmaları tam aylara çevirecek şekilde Türkçe yaz.
   - Hotels.com formatında: "Giriş18 Haz" ve "Çıkış19 Haz" şeklindedir. Kısaltmaları tam aylara çevir (Örn: "Giriş18 Haz" -> "18 haziran", "Çıkış19 Haz" -> "19 haziran"). Ayları küçük harfle Türkçe yaz (Haz -> haziran, Tem -> temmuz vb.).
2. Odalar ve Müsaitlik:
   - Tatilbudur formatında: Odalar "Yetişkin" ve "Gece" ibaresinden hemen öncedir.
   - Hotels.com formatında: Oda adları parantez içinde kısa adı barındırır (Örn: "Standard Oda Balkonsuz (Oxis)"). Bu durumda kısa adı (name) parantez içi ("Oxis"), tam adı (originalName) ise tüm başlık ("Standard Oda Balkonsuz (Oxis)") olmalıdır.
   - Sadece MÜSAİT olan odaları çıkar. "boş odamız kalmadı" veya "müsait değil" yazan odaları kesinlikle dahil etme! Örneğin "Deluxe Oda, Deniz Manzaralı (Plati)" odasında "Boş odamız kalmadı" veya "müsait değil veya sadece müşteri temsilcimiz" yazıyorsa onu kesinlikle alma.
3. Fiyatlar:
   - Tatilbudur formatında: "Toplam Fiyat" başlığının hemen altındaki veya yanındaki ilk fiyattır (Örn: "17.500" veya "10.500TL" -> "10.500"). TL ve benzeri ibareleri çıkartarak sadece sayısal formatı (Örn: "10.500") al.
   - Hotels.com formatında: Her odanın altında "Önceki fiyat 8.500 TL" ve "Şu anki fiyat 8.194 TL" şeklinde fiyatlar bulunabilir. Kullanıcı talebine göre oda fiyatını "Önceki fiyat" kısmından al (Örn: "Önceki fiyat 8.500 TL" -> "8.500"). Eğer o odaya ait sadece güncel fiyat varsa veya önceki fiyat yoksa güncel fiyatı al. TL vb. birimleri temizleyip sadece sayısal değeri (Örn: "8.500") formatında al.

Kopyalanan Metin:
---
${text}
---`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            giris: { type: Type.STRING, description: "Genişletilmiş giriş tarihi, örn: '15 Temmuz Çarşamba'" },
            cikis: { type: Type.STRING, description: "Sadeleştirilmiş çıkış tarihi, örn: '16 Temmuz'" },
            rooms: {
              type: Type.ARRAY,
              description: "Müsait olan oda listesi",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Odanın kısa adı (örn: Pita, Aloni)" },
                  originalName: { type: Type.STRING, description: "Odanın tam adı" },
                  price: { type: Type.STRING, description: "Oda fiyatı, para birimi olmadan sayı şeklinde (örn: 17.500)" }
                },
                required: ["name", "originalName", "price"]
              }
            }
          },
          required: ["giris", "cikis", "rooms"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Yapay zekadan boş bir yanıt döndü.");
    }

    const parsedJson = JSON.parse(resultText);
    res.json(parsedJson);

  } catch (err: any) {
    console.error("AI parse error:", err);
    res.status(500).json({ error: "Ayrıştırma sırasında bir hata oluştu: " + (err.message || err) });
  }
});

// Configure Vite or Serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

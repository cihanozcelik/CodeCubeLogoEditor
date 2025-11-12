# CodeCube Logo Editor 🎨

CodeCube Software için interaktif logo düzenleyici. Tarayıcınızdan logonuzu özelleştirebilir, yapay zeka asistanı ile doğal dille değişiklikler yapabilir ve SVG olarak indirebilirsiniz.

🔗 **Canlı Demo**: [https://cihanozcelik.github.io/CodeCubeLogoEditor/](https://cihanozcelik.github.io/CodeCubeLogoEditor/)

## ✨ Özellikler

- 🎯 **İnteraktif Düzenleme**: Slider'larla logonuzu gerçek zamanlı düzenleyin
- 🤖 **AI Asistan** (Beta): Doğal dille logo parametrelerini değiştirin
  - "Logoyu daha geniş yap"
  - "3 rakamını büyüt ve sağa kaydır"
  - "Maviye çevir"
- 📐 **Parametrik Kontrol**: Açı, kalınlık, uzunluk, spacing, renkler
- 💾 **SVG İndirme**: Yüksek kaliteli, ölçeklenebilir logo
- 🔗 **URL Paylaşımı**: Tasarımınızı URL ile paylaşın
- 🎨 **Renk Özelleştirme**: İkon ve yazı renkleri ayrı ayrı ayarlanabilir

## 🚀 Hızlı Başlangıç

### Kullanım

1. [Demo sayfasını](https://cihanozcelik.github.io/CodeCubeLogoEditor/) açın
2. Slider'ları kullanarak logoyu düzenleyin
3. "SVG Olarak İndir" ile kaydedin
4. "URL'i Kopyala" ile tasarımınızı paylaşın

### Lokal Geliştirme

⚠️ **Önemli**: AI özelliğini localhost'ta test edecekseniz, önce aşağıdaki "AI Asistan Kurulumu" bölümünü tamamlayın ve Cloudflare Worker'daki `allowedOrigins` listesine `http://localhost:8000` ekleyin. Test tamamlandıktan sonra güvenlik için localhost'u listeden kaldırın!

```bash
# Projeyi klonlayın
git clone https://github.com/cihanozcelik/CodeCubeLogoEditor.git
cd CodeCubeLogoEditor

# Basit HTTP sunucusu başlatın
python3 -m http.server 8000

# Tarayıcıda açın
open http://localhost:8000
```

## 🤖 AI Asistan Kurulumu (İsteğe Bağlı)

AI özelliği için Groq API ve Cloudflare Worker gereklidir. Adım adım:

### 1. Groq API Key Alma

1. [Groq Console](https://console.groq.com) adresine gidin
2. GitHub ile giriş yapın (ücretsiz)
3. Sol menüden **"API Keys"** tıklayın
4. **"Create API Key"** butonuna basın
5. Key'i kopyalayın (örnek: `gsk_...`)
6. ⚠️ Bu key'i güvenli saklayın, bir daha gösterilmez!

**Önemli**: Groq ücretsiz tier'ında günlük request limiti vardır. Kendi kullanımınız için yeterlidir.

### 2. Cloudflare Worker Oluşturma

1. [Cloudflare Dashboard](https://dash.cloudflare.com/sign-up) adresine gidin
2. Ücretsiz hesap oluşturun
3. Sol menüden **"Workers & Pages"** tıklayın
4. **"Create"** → **"Workers"** seçin
5. **"Start with Hello World!"** → **"Get started"** tıklayın
6. Worker'a isim verin: `codecube-ai-proxy`
7. **"Deploy"** butonuna basın

### 3. Worker Kodunu Yapıştırma

1. Deploy olduktan sonra **"Edit code"** butonuna tıklayın
2. Tüm kodu silin ve aşağıdaki kodu yapıştırın:

```javascript
export default {
  async fetch(request, env, ctx) {
    // İzin verilen origin'ler
    const allowedOrigins = [
      'https://GITHUB_KULLANICI_ADINIZ.github.io',  // Kendi GitHub Pages URL'inizi yazın
      // 'http://localhost:8000'  // Lokal test için açın, test sonrası MUTLAKA kaldırın!
    ];
    
    const origin = request.headers.get('Origin');
    
    // Origin kontrolü
    if (!allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { message, currentParams } = await request.json();

      const systemPrompt = `ÇOK ÖNEMLİ: Cevabını SADECE ve MUTLAKA geçerli JSON formatında ver!

Sen CodeCube Logo Editor için bir AI asistansın. Kullanıcılar seninle Türkçe konuşuyor.

Kullanıcı logoya şöyle değişiklikler isteyebilir:
- angle (30-80°): Açı
- width (20-80px): Kalınlık
- chevronLength (50-300px): Parantez uzunluğu
- spacing (0-100px): Boşluk
- color (hex): Renk

Cevabını şu formatta ver:
{"message": "Yaptığın değişikliği açıkla", "changes": {"parametre": deger}}

Örnek:
{"message": "Logoyu genişlettim", "changes": {"width": 60, "spacing": 45}}`;

      const groqResponse = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer GROQ_API_KEY_BURAYA',  // Groq API key'inizi buraya yazın
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            max_tokens: 600,
            temperature: 0.5,
          }),
        }
      );

      const data = await groqResponse.json();
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
```

3. **Önemli**: Kodda 2 yeri değiştirin:
   - `GITHUB_KULLANICI_ADINIZ` → Kendi GitHub kullanıcı adınız
   - `GROQ_API_KEY_BURAYA` → 1. adımda aldığınız Groq API key

4. **"Deploy"** butonuna basın

5. Worker URL'inizi kopyalayın (örnek: `https://codecube-ai-proxy.KULLANICI_ADI.workers.dev`)

### 4. Frontend'i Güncelleme

1. `app.js` dosyasında şu satırı bulun (yaklaşık 1014. satır):

```javascript
const WORKER_URL = 'https://gentle-rain-f393.cihanozcelik.workers.dev';
```

2. Kendi Worker URL'inizle değiştirin:

```javascript
const WORKER_URL = 'https://codecube-ai-proxy.KULLANICI_ADI.workers.dev';
```

3. Değişiklikleri commit edin ve GitHub'a pushlayın

```bash
git add app.js
git commit -m "Update AI worker URL"
git push origin main
```

### 5. Localhost'ta Test (İsteğe Bağlı)

**Lokal test yapmak istiyorsanız:**

1. Cloudflare Worker kodunda `allowedOrigins` satırını bulun
2. `// 'http://localhost:8000'` satırının başındaki `//` işaretlerini kaldırın:

```javascript
const allowedOrigins = [
  'https://GITHUB_KULLANICI_ADINIZ.github.io',
  'http://localhost:8000'  // Aktif hale geldi
];
```

3. **"Deploy"** butonuna basın
4. Localhost'ta test edin
5. ⚠️ **Test bittikten sonra MUTLAKA localhost satırını tekrar yorum satırı yapın veya silin!**

```javascript
const allowedOrigins = [
  'https://GITHUB_KULLANICI_ADINIZ.github.io',
  // 'http://localhost:8000'  // Güvenlik için kapatıldı
];
```

6. Tekrar **"Deploy"** butonuna basın

### 6. GitHub Pages'te Test

1. Değişiklikleri GitHub'a pushlayın (adım 4'teki gibi)
2. Birkaç dakika bekleyin (GitHub Pages güncellenmesi için)
3. Sayfanızı açın: `https://KULLANICI_ADI.github.io/CodeCubeLogoEditor/`
4. "AI Asistan" bölümüne bir mesaj yazın: "logoyu daha geniş yap"
5. AI otomatik olarak parametreleri değiştirmeli!

## 📁 Proje Yapısı

```
CodeCubeLogoEditor/
├── index.html          # Ana sayfa
├── app.js              # Logo çizim ve AI entegrasyonu
├── style.css           # Stil dosyası
├── Logo3.svg           # "3" rakamı SVG
├── CodeCubeText.svg    # "CodeCube" yazısı SVG
└── README.md           # Bu dosya
```

## 🎨 Düzenlenebilir Parametreler

| Parametre | Açıklama | Varsayılan | Aralık |
|-----------|----------|------------|--------|
| `angle` | Chevron ve slash açısı | 60° | 30-80° |
| `width` | Çizgi kalınlığı | 47px | 20-80px |
| `chevronLength` | Parantez uzunluğu | 122px | 50-300px |
| `slashDiff` | Slash ekstra uzunluk | 60px | 0-100px |
| `spacing` | Elemanlar arası boşluk | 34px | 0-100px |
| `numberDistanceBias` | "3" yatay konum | 0px | -50 ile 50px |
| `numberScaleBias` | "3" boyutu | 0% | -50% ile 50% |
| `iconScaleBias` | Tüm ikon boyutu | 4% | -50% ile 100% |
| `textDistance` | Yazı mesafesi | 28px | 0-400px |
| `textScaleBias` | Yazı boyutu | -48% | -50% ile 50% |
| `color` | İkon rengi | #e45545 | Hex renk |
| `textColor` | Yazı rengi | #000000 | Hex renk |

## 🔒 Güvenlik

- **API Key Güvenliği**: Groq API key'iniz sadece Cloudflare Worker'da bulunur, GitHub'da gözükmez
- **Origin Kontrolü**: Worker sadece belirttiğiniz domain'den gelen istekleri kabul eder
- **Rate Limiting**: Groq ücretsiz tier'ı otomatik rate limiting sağlar

## 🐛 Sorun Giderme

### AI Asistan Çalışmıyor

1. **Konsolu kontrol edin** (F12 → Console)
2. **Worker URL'i doğru mu?** `app.js` içinde kontrol edin
3. **Groq API key geçerli mi?** Cloudflare Worker'da kontrol edin
4. **Origin doğru mu?** Worker'daki `allowedOrigins` listesinde GitHub Pages URL'iniz var mı?

### "403 Forbidden" Hatası

- Worker'daki `allowedOrigins` listesine kendi GitHub Pages URL'inizi ekleyin
- URL'de `https://` olduğundan emin olun

### Logo Çizilmiyor

- Tarayıcı konsolunda (F12) hata mesajlarını kontrol edin
- SVG dosyalarının yüklendiğinden emin olun
- Cache'i temizleyin (Cmd+Shift+R / Ctrl+Shift+F5)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Cihan Özçelik** - [CodeCube Software](https://codecubesoftware.com)

## 🙏 Teşekkürler

- **Groq**: Hızlı ve ücretsiz LLM API
- **Cloudflare**: Ücretsiz serverless fonksiyonlar
- **GitHub Pages**: Ücretsiz hosting

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!


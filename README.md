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
      'https://GITHUB_KULLANICI_ADINIZ.github.io'  // Kendi GitHub Pages URL'inizi yazın
      // Lokal test için ekleyin: 'http://localhost:8000'
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
      'Access-Control-Allow-Origin': origin, // Sadece izin verilen origin
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { message, currentParams } = await request.json();

      const systemPrompt = \`ÇOK ÖNEMLİ: Cevabını SADECE ve MUTLAKA geçerli JSON formatında ver! Başka hiçbir format kullanma, ek açıklama yapma!

Sen CodeCube Logo Editor için bir AI asistansın. Sadece logo düzenleme konusunda yardım yapıyorsun. Kullanıcılar seninle Türkçe konuşuyor.

=== LOGO SİSTEMİNİN YAPISI ===

Logo 5 ana bileşenden oluşuyor:

1. **Sol Chevron**: Sol taraftaki açılı parantez şeklindeki şekil
   - Kullanıcı buna şöyle diyebilir: "sol parantez", "küçüktür işareti", "<", "sol ok"
   
2. **Slash (Çizgi)**: Ortadaki eğik çizgi
   - Kullanıcı buna şöyle diyebilir: "ortadaki çizgi", "eğik çizgi", "bölü işareti", "/", "slash"
   
3. **Sağ Chevron**: Sağ taraftaki açılı parantez şeklindeki şekil
   - Kullanıcı buna şöyle diyebilir: "sağ parantez", "büyüktür işareti", ">", "sağ ok"
   
4. **Rakam "3"**: Slash'ın içinde yer alan "3" rakamı (Logo3.svg dosyasından gelir)
   - Kullanıcı buna şöyle diyebilir: "üç", "3", "sayı", "rakam"
   
5. **CodeCube Yazısı**: Logonun altında yer alan "CodeCube" ve "SOFTWARE" yazısı
   - ÖNEMLİ: Bu yazı DEĞİŞTİRİLEMEZ! Sadece boyutunu ve konumunu ayarlayabiliyoruz.
   - Kullanıcı yazıyı değiştirmek isterse kibarca bu yazının değiştirilemediğini söyle.

=== DÜZENLENEBİLİR PARAMETRELER ===

1. **angle** (Açı Değeri)
   - Ne yapar: Tüm chevronların ve slash'ın açısını belirler
   - Değer aralığı: 30 ile 80 derece arası
   - Varsayılan: 60 derece
   - Etkisi: 
     * Değer artınca → Şekiller daha yatay/yassı görünür
     * Değer azalınca → Şekiller daha dik/keskin görünür
   - Örnek: "Logoyu daha yatık yap" → angle: 70

2. **width** (Kalınlık/Genişlik)
   - Ne yapar: Tüm çizgilerin kalınlığını belirler
   - Değer aralığı: 20 ile 80 piksel arası
   - Varsayılan: 47 piksel
   - Etkisi:
     * Değer artınca → Çizgiler kalınlaşır, logo daha dolgun görünür
     * Değer azalınca → Çizgiler incelir, logo daha zarif görünür
   - Örnek: "Çizgileri daha kalın yap" → width: 60

3. **chevronLength** (Chevron Uzunluğu)
   - Ne yapar: Sol ve sağ parantezlerin uzunluğunu belirler
   - Değer aralığı: 50 ile 300 piksel arası
   - Varsayılan: 122 piksel
   - Etkisi:
     * Değer artınca → Parantezler daha uzun görünür
     * Değer azalınca → Parantezler daha kısa görünür
   - Örnek: "Parantezleri uzat" → chevronLength: 150

4. **slashDiff** (Slash Uzunluk Farkı)
   - Ne yapar: Ortadaki eğik çizginin chevronlara göre ne kadar uzun olacağını belirler
   - Değer aralığı: 0 ile 100 piksel arası
   - Varsayılan: 60 piksel
   - Etkisi:
     * Değer artınca → Ortadaki çizgi daha uzun olur
     * Değer azalınca → Ortadaki çizgi daha kısa olur
   - Örnek: "Ortadaki çizgiyi daha uzun yap" → slashDiff: 80

5. **spacing** (Boşluk/Aralık)
   - Ne yapar: Parantezler ile ortadaki çizgi arasındaki mesafeyi belirler
   - Değer aralığı: 0 ile 100 piksel arası
   - Varsayılan: 34 piksel
   - Etkisi:
     * Değer artınca → Şekiller birbirinden uzaklaşır, logo daha geniş görünür
     * Değer azalınca → Şekiller birbirine yaklaşır, logo daha sıkışık görünür
   - Örnek: "Aralarına daha fazla boşluk koy" → spacing: 50

6. **numberDistanceBias** (3 Rakamının Yatay Konumu)
   - Ne yapar: "3" rakamını sağa veya sola kaydırır
   - Değer aralığı: -50 ile +50 piksel arası
   - Varsayılan: 0 piksel (ortada)
   - Etkisi:
     * Pozitif değer → Rakam sağa kayar
     * Negatif değer → Rakam sola kayar
   - Örnek: "3'ü biraz sağa kaydır" → numberDistanceBias: 10

7. **numberScaleBias** (3 Rakamının Boyutu)
   - Ne yapar: "3" rakamını büyütür veya küçültür
   - Değer aralığı: -50% ile +50% arası
   - Varsayılan: 0% (normal boyut)
   - Etkisi:
     * Pozitif değer → Rakam büyür
     * Negatif değer → Rakam küçülür
   - Örnek: "3'ü büyüt" → numberScaleBias: 20

8. **iconScaleBias** (Tüm İkonun Boyutu)
   - Ne yapar: Chevronlar + slash + 3 rakamını topluca büyütür/küçültür
   - Değer aralığı: -50% ile +100% arası
   - Varsayılan: 4%
   - Etkisi:
     * Pozitif değer → Tüm ikon büyür
     * Negatif değer → Tüm ikon küçülür
   - Örnek: "Logoyu büyüt" → iconScaleBias: 30

9. **textDistance** (Yazının Mesafesi)
   - Ne yapar: "CodeCube" yazısının logoya olan dikey mesafesini belirler
   - Değer aralığı: 0 ile 400 piksel arası
   - Varsayılan: 28 piksel
   - Etkisi:
     * Değer artınca → Yazı aşağı iner
     * Değer azalınca → Yazı yukarı çıkar, logoya yaklaşır
   - Örnek: "Yazıyı aşağı indir" → textDistance: 60

10. **textScaleBias** (Yazının Boyutu)
    - Ne yapar: "CodeCube" yazısını büyütür veya küçültür
    - Değer aralığı: -50% ile +50% arası
    - Varsayılan: -48% (oldukça küçük)
    - Etkisi:
      * Pozitif değer → Yazı büyür
      * Negatif değer → Yazı küçülür
    - Örnek: "Yazıyı büyüt" → textScaleBias: -20

11. **color** (İkon Rengi)
    - Ne yapar: Chevronlar, slash ve 3 rakamının rengini belirler
    - Format: Hex renk kodu (örn: #ff5733)
    - Varsayılan: #e45545 (kırmızımsı turuncu)
    - Örnek: "Logoyu mavi yap" → color: #3498db

12. **textColor** (Yazı Rengi)
    - Ne yapar: "CodeCube" yazısının rengini belirler
    - Format: Hex renk kodu (örn: #000000)
    - Varsayılan: #000000 (siyah)
    - Örnek: "Yazıyı kırmızı yap" → textColor: #ff0000

=== MEVCUT PARAMETRELER ===
\${JSON.stringify(currentParams, null, 2)}

=== KURALLAR VE KISITLAMALAR ===

1. "CodeCube" yazısının içeriği DEĞİŞTİRİLEMEZ
   - Kullanıcı "yazıyı değiştir" derse: "CodeCube yazısının içeriği değiştirilemiyor, ancak boyutunu (textScaleBias) ve konumunu (textDistance) ayarlayabilirim."

2. Sadece logo düzenleme konusunda yardım et
   - Kullanıcı başka konularda soru sorarsa: "Ben sadece CodeCube logosunu düzenleme konusunda yardımcı olabilirim. Logo ile ilgili yapmamı istediğin bir değişiklik var mı?"

3. Kullanıcı "neleri değiştirebilirim?" diye sorarsa:
   - Yukarıdaki 12 parametreyi kısa ve anlaşılır şekilde özetle

=== CEVAP FORMATI (ÇOK ÖNEMLİ!) ===

Cevabını MUTLAKA SADECE bu JSON formatında ver, başka hiçbir şey yazma:

{"message": "Kullanıcıya gösterilecek metin cevabı", "changes": {"parametre_adi": yeni_deger}}

KURALLAR:
- SADECE JSON formatında cevap ver
- JSON dışında hiçbir açıklama, yorum veya metin ekleme
- "changes" içine SADECE değiştirilmesi gereken parametreleri koy
- Kullanıcı soru soruyor ama değişiklik istemiyorsa "changes" boş obje: {}
- Parametreleri değiştirirken MİN/MAX değerleri aşma
- message kısa ve net olsun (maks 2 cümle)

DOĞRU ÖRNEKLER:

{"message": "Logoyu genişlettim. Kalınlığı ve aralarındaki boşluğu artırdım.", "changes": {"width": 60, "spacing": 45}}

{"message": "Şunları değiştirebilirsin: Şekillerin açısı, kalınlığı, uzunluğu ve aralarındaki boşluk. Ayrıca 3 rakamının konumu ve boyutu, tüm logonun boyutu, alttaki yazının konumu ve boyutu, ve tüm renkleri ayarlayabilirsin.", "changes": {}}

{"message": "3 rakamını büyüttüm ve sağa kaydırdım, logoyu mavi yaptım.", "changes": {"numberScaleBias": 25, "numberDistanceBias": 15, "color": "#3498db"}}

Şimdi kullanıcının isteğine cevap ver - SADECE JSON formatında!\`;

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
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: message
              }
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
  'http://localhost:8000'
];
```

3. **"Deploy"** butonuna basın
4. Localhost'ta test edin
5. ⚠️ **Test bittikten sonra MUTLAKA localhost satırını tekrar yorum satırı yapın veya silin!**

```javascript
const allowedOrigins = [
  'https://GITHUB_KULLANICI_ADINIZ.github.io'
  // Test bittiyse localhost satırını tamamen silin veya yorum satırı yapın
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


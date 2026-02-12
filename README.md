☕ CafeMaster - Real-Time Cafe Management System (Backend)
CafeMaster, kafeler için tasarlanmış, stok takibi, gerçek zamanlı sipariş yönetimi ve indirim motoru barındıran profesyonel bir Backend API projesidir. Proje, katmanlı mimari (Layered Architecture) ve gerçek zamanlı veri akışı prensipleriyle geliştirilmiştir.

🚀 Öne Çıkan Özellikler
Real-time Sipariş Takibi: Socket.io ile garson-mutfak-admin arasında anlık veri senkronizasyonu.

Akıllı Stok Yönetimi: Sipariş anında otomatik stok kontrolü ve stok tükenince sipariş engelleme.

Dinamik İndirim Motoru: Ürün bazlı indirim oranlarının otomatik hesaplanması.

Veri Güvenliği: Joi/Zod ile şema doğrulaması ve merkezi hata yakalama (Global Error Handling).

Profesyonel Loglama: Winston ve Daily Rotate File ile tarih bazlı detaylı kayıt tutma.

Veri Tutarlılığı: Ürün fiyatı değişse bile geçmiş satışların fiyatlarını koruyan priceAtTime mantığı.

🛠️ Teknik Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB & Mongoose

Real-time: Socket.io

Logging: Winston

Validation: Joi

📂 Klasör Yapısı
Plaintext
/src
  /configs       # Veritabanı ve logger konfigürasyonları
  /consts        # Router prefixleri ve enum değerler (OrderStatus, vb.)
  /controllers   # Request handling (Thin Controllers)
  /services      # Business Logic (Stok kontrolü, hesaplamalar)
  /models        # Mongoose şemaları
  /middlewares   # Auth, Validation ve Error handling
  /sockets       # Socket.io event yönetimi
  /validations   # Request body doğrulama şemaları
  /utils         # Yardımcı fonksiyonlar
⚙️ Kurulum
Projeyi klonlayın:

Bash
git clone https://github.com/kullaniciadi/cafemaster.git
Bağımlılıkları yükleyin:

Bash
npm install
.env dosyasını oluşturun ve veritabanı bilgilerinizi girin:

Kod snippet'i
PORT=3000
MONGO_URI=mongodb://localhost:27017/cafemaster
Projeyi başlatın:

Bash
npm run dev
📡 API Endpoints (Bazı Örnekler)
Ürünler (Products)
GET /api/products - Tüm ürünleri listeler.

POST /api/products - Yeni ürün ekler (Admin).

Satış/Sipariş (Sales)
POST /api/sales - Yeni sipariş oluşturur (Stok kontrolü & İndirim hesaplama dahil).

GET /api/sales/:tableId - Belirli bir masanın sipariş durumunu getirir.

🏗️ Mimari Yaklaşım
Bu projede "Service Layer" yapısı kullanılmıştır. Controller katmanı sadece isteği karşılar ve yanıtı döner; tüm matematiksel hesaplamalar ve veritabanı manipülasyonları servis katmanında gerçekleşir. Bu sayede kodun test edilebilirliği ve okunabilirliği artırılmıştır.

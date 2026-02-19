# 🚀 Cafe Master – Real-Time Restaurant Management Backend

Modern, gerçek zamanlı çalışan, transaction güvenli restoran yönetim sistemi backend uygulaması.

🌍 **Live Demo:**  
https://cafe-master.onrender.com

---

## 📌 Proje Hakkında

Cafe Master; restoran sipariş, stok ve ödeme süreçlerini **transaction güvenli**, **gerçek zamanlı bildirimli** ve **Redis cache destekli** bir şekilde yöneten Node.js tabanlı bir backend sistemidir.

Sistem aşağıdaki özellikleri production seviyesinde içerir:

- Sipariş oluşturma & yönetimi
- Kısmi ve tam ödeme sistemi
- Otomatik stok düşme
- Stok geçmişi kaydı
- Redis cache optimizasyonu
- Socket.io ile gerçek zamanlı bildirim
- JWT tabanlı authentication
- MongoDB transaction yönetimi

---

# 🏗️ Kullanılan Teknolojiler

- Node.js
- Express.js
- MongoDB
- Mongoose (Transaction Support)
- Redis (Upstash)
- Socket.io
- JWT Authentication
- RESTful API Architecture
- Render (Deployment)

---

# 🔥 Öne Çıkan Özellikler

## ✅ MongoDB Transaction Yönetimi

Sipariş oluşturma, güncelleme ve silme işlemleri sırasında:

- Stok düşme
- Stok geçmişi yazma
- Ödeme kaydı oluşturma

işlemleri tek transaction içinde yürütülür.

Hata durumunda:
session.abortTransaction()
ile tüm işlemler geri alınır. Bu sayede veri tutarlılığı korunur.

---

## ⚡ Redis Cache Mekanizması

Cache anahtarları:

- orders:all
- orders:{id}
- products:all
- products:{id}
- payments:order:{id}

### Çalışma Mantığı:

- Cache MISS → Veri MongoDB’den çekilir ve cache’e yazılır
- Cache HIT → Veri Redis’ten döner
- Veri değişimlerinde cache invalidation uygulanır

---

## 🔔 Gerçek Zamanlı Bildirimler (Socket.io)

Rol bazlı oda sistemi uygulanmıştır:

- admin → düşük stok uyarısı
- kitchen → yeni sipariş bildirimi
- cashier → ödeme bildirimi

Örnek eventler:

- "yeni sipariş"
- "Sipariş durumu değişti"
- "Ödeme tamamlandı"
- "Stok uyarısı"

---

## 💳 Kısmi Ödeme Sistemi

Bir siparişe birden fazla ödeme alınabilir.

Ödeme sırasında:

- Daha önce ödenen toplam aggregate ile hesaplanır
- Kalan tutar kontrol edilir
- Fazla ödeme engellenir
- Sipariş tamamen ödendiyse otomatik "Completed" olur

Aggregate pipeline kullanılmıştır.

---

# 📊 Proje Mimarisi

Katmanlı mimari kullanılmıştır:

controllers/
services/
models/
configs/
utils/
dto/
router/ 
Separation of Concerns prensibine uygun geliştirilmiştir.

---

# 📡 API Örnek Endpointler

## Auth
POST /api/user/login

## Orders
POST /api/order
GET /api/order
PUT /api/order/:id
DELETE /api/order/:id


## Payments
POST /api/payment/:orderId
GET /api/payment/:orderId


## Products
POST /api/product
GET /api/product
PUT /api/product/:id
DELETE /api/product/:id


---

# 🔐 Authentication & Security

- JWT tabanlı kimlik doğrulama
- Password hashing
- Protected routes
- Environment variable yönetimi
- Production deployment yapılandırması

---

# 🚀 Deployment

- GitHub → Render Auto Deploy
- MongoDB Atlas
- Upstash Redis
- Production environment configuration

---

# 🧠 Teknik Odak Noktaları

Bu projede özellikle aşağıdaki konulara odaklanılmıştır:

- ACID transaction yönetimi
- Cache invalidation stratejisi
- Aggregate pipeline kullanımı
- Real-time event architecture
- Production-ready backend geliştirme

---

# 👩‍💻 Geliştirici

**Dilan Deregözü**  
Backend Developer  

---

# ⭐ Projeyi Çalıştırmak

```bash
git clone https://github.com/dilanderegozu/Cafe_Master.git
cd Cafe_Master
yarn install
yarn start

📬 Geri Bildirim
Her türlü geri bildirime açığım 🙌
Projeyi yıldızlamayı unutmayın ⭐

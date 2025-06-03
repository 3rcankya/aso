# Araç Servis Otomasyon Sistemi

Bu proje, araç servislerinin günlük operasyonlarını yönetmek için geliştirilmiş kapsamlı bir otomasyon sistemidir.

## Özellikler

- Kullanıcı Yönetimi (Admin, Usta, Müşteri)
- Randevu Sistemi
- Stok Takibi
- Hizmet Yönetimi
- Araç Yönetimi
- SMS Bildirimleri
- Raporlama

## Teknolojiler

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- EdeSms SMS API

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd auto-service-management
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=auto_service_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# SMS Configuration (EdeSms)
EDESMS_USERNAME=mdsiber
EDESMS_PASSWORD=Savunma2112
EDESMS_HEADER=MD SBR SVN

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

4. Veritabanını oluşturun:
```bash
mysql -u root -p
CREATE DATABASE auto_service_db;
```

5. Migration'ları çalıştırın:
```bash
npm run migrate
```

6. Uygulamayı başlatın:
```bash
npm run dev
```

## API Endpoints

### Kimlik Doğrulama
- POST /api/auth/register - Yeni kullanıcı kaydı
- POST /api/auth/login - Kullanıcı girişi
- GET /api/auth/profile - Kullanıcı profili
- PUT /api/auth/profile - Profil güncelleme
- PUT /api/auth/change-password - Şifre değiştirme

### Randevular
- POST /api/appointments - Yeni randevu oluşturma
- GET /api/appointments - Randevuları listeleme
- GET /api/appointments/:id - Randevu detayı
- PUT /api/appointments/:id - Randevu güncelleme
- PUT /api/appointments/:id/cancel - Randevu iptali

### Araçlar
- POST /api/vehicles - Yeni araç kaydı
- GET /api/vehicles - Araçları listeleme
- GET /api/vehicles/my-vehicles - Müşterinin araçlarını listeleme
- GET /api/vehicles/:id - Araç detayı
- PUT /api/vehicles/:id - Araç güncelleme

### Hizmetler
- POST /api/services - Yeni hizmet oluşturma
- GET /api/services - Hizmetleri listeleme
- GET /api/services/categories - Hizmet kategorilerini listeleme
- GET /api/services/:id - Hizmet detayı
- PUT /api/services/:id - Hizmet güncelleme

### Stok
- POST /api/inventory - Yeni stok ürünü ekleme
- GET /api/inventory - Stok ürünlerini listeleme
- GET /api/inventory/low-stock - Düşük stoklu ürünleri listeleme
- GET /api/inventory/:id - Stok ürünü detayı
- PUT /api/inventory/:id - Stok ürünü güncelleme
- PUT /api/inventory/:id/stock - Stok miktarı güncelleme

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın. 
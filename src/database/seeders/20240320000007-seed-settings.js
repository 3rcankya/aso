'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const now = new Date();
        await queryInterface.bulkInsert('settings', [
            // İşletme Bilgileri
            {
                key: 'business_name',
                value: 'ASO',
                description: 'İşletme adı',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'business_slogan',
                value: 'Aracınız için güvenilir, hızlı ve profesyonel servis!',
                description: 'İşletme sloganı',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'business_code',
                value: 'ASO001',
                description: 'İşletme Kodu',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'business_address',
                value: 'Örnek Mahallesi, Örnek Sokak No:1, İstanbul',
                description: 'İşletme adresi',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'business_phone',
                value: '0212 123 45 67',
                description: 'İşletme telefon numarası',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'business_email',
                value: 'info@aso.com',
                description: 'İşletme e-posta adresi',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'business_tax_office',
                value: '',
                description: 'Vergi Dairesi',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'business_tax_number',
                value: '',
                description: 'Vergi Numarası',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'business_website',
                value: 'https://www.aso.com',
                description: 'İşletme web sitesi',
                category: 'business',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Çalışma Saatleri
            {
                key: 'working_hours_start',
                value: '09:00',
                description: 'Çalışma saati başlangıcı',
                category: 'working_hours',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'working_hours_end',
                value: '18:00',
                description: 'Çalışma saati bitişi',
                category: 'working_hours',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Randevu Ayarları
            {
                key: 'appointment_interval',
                value: '30',
                description: 'Randevu Aralığı (dakika)',
                category: 'appointment',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'max_daily_appointments',
                value: '20',
                description: 'Günlük Maksimum Randevu',
                category: 'appointment',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'allow_same_day_appointments',
                value: 'true',
                description: 'Aynı Gün Randevu İzni',
                category: 'appointment',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'require_appointment_confirmation',
                value: 'true',
                description: 'Randevu Onayı Gerekli',
                category: 'appointment',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Bildirim Ayarları
            {
                key: 'enable_email_notifications',
                value: 'true',
                description: 'E-posta Bildirimleri',
                category: 'notifications',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'enable_sms_notifications',
                value: 'true',
                description: 'SMS Bildirimleri',
                category: 'notifications',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'reminder_hours',
                value: '24',
                description: 'Hatırlatma Süresi (saat)',
                category: 'notifications',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // SMS Paket Bilgileri
            {
                key: 'sms_package_name',
                value: '',
                description: 'SMS Paket Adı',
                category: 'sms',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'sms_package_quota',
                value: '0',
                description: 'SMS Paket Kotası',
                category: 'sms',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'sms_package_expiry',
                value: '',
                description: 'SMS Paket Bitiş Tarihi',
                category: 'sms',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Anasayfa Ayarları
            {
                key: 'homepage_title',
                value: 'ASO - Profesyonel Araç Servisi',
                description: 'Anasayfa başlığı',
                category: 'homepage',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_description',
                value: 'Aracınız için en iyi servis hizmeti. Uzman ekibimiz ve modern ekipmanlarımızla yanınızdayız.',
                description: 'Anasayfa açıklaması',
                category: 'homepage',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_keywords',
                value: 'araç servisi, oto servis, araç bakım, araç tamir',
                description: 'Anasayfa anahtar kelimeleri',
                category: 'homepage',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_logo',
                value: '/images/logo.png',
                description: 'Site logosu',
                category: 'homepage',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_favicon',
                value: '/images/favicon.ico',
                description: 'Site favicon',
                category: 'homepage',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Anasayfa İstatistikleri
            {
                key: 'homepage_stats_customers',
                value: '1000',
                description: 'Mutlu müşteri sayısı',
                category: 'homepage_stats',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_stats_services',
                value: '5000',
                description: 'Tamamlanan servis sayısı',
                category: 'homepage_stats',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_stats_experience',
                value: '15',
                description: 'Yıllık deneyim',
                category: 'homepage_stats',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_stats_mechanics',
                value: '20',
                description: 'Uzman mekanik sayısı',
                category: 'homepage_stats',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Anasayfa Özellikleri
            {
                key: 'homepage_feature_title',
                value: 'Neden Bizi Seçmelisiniz?',
                description: 'Özellikler başlığı',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_feature_expert',
                value: 'Uzman Ekip',
                description: 'Uzman ekip başlığı',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_feature_expert_desc',
                value: 'Deneyimli ve uzman ekibimizle en iyi hizmeti sunuyoruz.',
                description: 'Uzman ekip açıklaması',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_feature_speed',
                value: 'Hızlı Servis',
                description: 'Hızlı servis başlığı',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_feature_speed_desc',
                value: 'Zamanınızı değerli kılıyor, hızlı ve etkili çözümler sunuyoruz.',
                description: 'Hızlı servis açıklaması',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_feature_quality',
                value: 'Kalite Garantisi',
                description: 'Kalite garantisi başlığı',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_feature_quality_desc',
                value: 'En yüksek kalite standartlarında hizmet garantisi veriyoruz.',
                description: 'Kalite garantisi açıklaması',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_feature_price',
                value: 'Uygun Fiyatlar',
                description: 'Uygun fiyatlar başlığı',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_feature_price_desc',
                value: 'Rekabetçi fiyatlarla kaliteli hizmet sunuyoruz.',
                description: 'Uygun fiyatlar açıklaması',
                category: 'homepage_features',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Anasayfa CTA
            {
                key: 'homepage_cta_title',
                value: 'Hemen Randevu Alın',
                description: 'CTA başlığı',
                category: 'homepage_cta',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_cta_description',
                value: 'Aracınız için profesyonel servis hizmeti almak için hemen randevu oluşturun.',
                description: 'CTA açıklaması',
                category: 'homepage_cta',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Footer Ayarları
            {
                key: 'homepage_footer_description',
                value: 'ASO olarak, araç sahiplerine en iyi servis hizmetini sunmak için çalışıyoruz. Uzman ekibimiz ve modern ekipmanlarımızla yanınızdayız.',
                description: 'Footer açıklaması',
                category: 'homepage_footer',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'homepage_footer_copyright',
                value: '© 2024 ASO. Tüm hakları saklıdır.',
                description: 'Telif hakkı metni',
                category: 'homepage_footer',
                is_active: true,
                created_at: now,
                updated_at: now
            },

            // Sosyal Medya
            {
                key: 'social_facebook',
                value: 'https://facebook.com/aso',
                description: 'Facebook sayfası',
                category: 'social',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'social_instagram',
                value: 'https://instagram.com/aso',
                description: 'Instagram sayfası',
                category: 'social',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'social_twitter',
                value: 'https://twitter.com/aso',
                description: 'Twitter sayfası',
                category: 'social',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'social_youtube',
                value: 'https://youtube.com/aso',
                description: 'YouTube kanalı',
                category: 'social',
                is_active: true,
                created_at: now,
                updated_at: now
            },
            {
                key: 'social_linkedin',
                value: 'https://linkedin.com/company/aso',
                description: 'LinkedIn sayfası',
                category: 'social',
                is_active: true,
                created_at: now,
                updated_at: now
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('settings', null, {});
    }
}; 
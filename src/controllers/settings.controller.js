const { Settings } = require('../models');
const { Op } = require('sequelize');

class SettingsController {
  // ... existing code ...

  static async getPublicSettings(req, res) {
    try {
      // Sadece public sayfalarda gösterilebilecek ayarların listesi
      const allowedSettings = [
        // İşletme Bilgileri
        'business_name',
        'business_slogan',
        'business_phone',
        'business_email',
        'business_address',
        'business_website',
        'working_hours_start',
        'working_hours_end',
        
        // Anasayfa Ayarları
        'homepage_title',
        'homepage_description',
        'homepage_keywords',
        'homepage_logo',
        'homepage_favicon',
        
        // Anasayfa İstatistikleri
        'homepage_stats_customers',
        'homepage_stats_services',
        'homepage_stats_experience',
        'homepage_stats_mechanics',
        
        // Anasayfa Özellikleri
        'homepage_feature_title',
        'homepage_feature_expert',
        'homepage_feature_expert_desc',
        'homepage_feature_speed',
        'homepage_feature_speed_desc',
        'homepage_feature_quality',
        'homepage_feature_quality_desc',
        'homepage_feature_price',
        'homepage_feature_price_desc',
        
        // Anasayfa CTA
        'homepage_cta_title',
        'homepage_cta_description',
        
        // Footer Ayarları
        'homepage_footer_description',
        'homepage_footer_copyright',

        // Sosyal Medya
        'social_facebook',
        'social_instagram',
        'social_twitter',
        'social_youtube',
        'social_linkedin'
      ];

      const settings = await Settings.findAll({
        where: {
          key: {
            [Op.in]: allowedSettings
          },
          isActive: true
        },
        attributes: ['key', 'value'] // Sadece key ve value alanlarını getir
      });

      // Convert array to object with key-value pairs
      const formattedSettings = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      res.json({
        success: true,
        data: formattedSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ayarlar getirilirken bir hata oluştu',
        error: error.message
      });
    }
  }
}

module.exports = SettingsController; 
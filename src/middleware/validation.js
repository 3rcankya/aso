const { body, validationResult } = require('express-validator');
const { Appointment, Service } = require('../models');
const { Op } = require('sequelize');

// Randevu validasyonu
const validateAppointment = [
  // Müşteri bilgileri
  body('customerName')
    .trim()
    .notEmpty().withMessage('Müşteri adı gereklidir')
    .isLength({ min: 3, max: 100 }).withMessage('Müşteri adı 3-100 karakter arasında olmalıdır'),

  body('customerPhone')
    .trim()
    .notEmpty().withMessage('Telefon numarası gereklidir.')
    .matches(/^(\+|00)?\d{1,4}[\s\-\.]?\(?\d{2,4}\)?[\s\-\.]?\d{3,4}[\s\-\.]?\d{3,4}$/)
    .withMessage('Geçerli bir telefon numarası giriniz (alan kodu dahil).'),

  body('customerEmail')
    .trim()
    .notEmpty().withMessage('E-posta adresi gereklidir')
    .isEmail().withMessage('Geçerli bir e-posta adresi giriniz')
    .normalizeEmail(),


  // Servis bilgileri
  body('serviceId')
  .optional({ checkFalsy: true }) // boşsa atla
  .isInt().withMessage('Geçerli bir servis ID giriniz')
  .bail() // önceki hata varsa diğerlerini çalıştırma
  .custom(async (value) => {
    const service = await Service.findByPk(value);
    if (!service) {
      throw new Error('Seçilen servis bulunamadı');
    }
    if (!service.isActive) {
      throw new Error('Seçilen servis şu anda aktif değil');
    }
    return true;
  }),


  // Randevu tarihi ve saati
  body('appointmentDate')
    .notEmpty().withMessage('Randevu tarihi gereklidir')
    .isISO8601().withMessage('Geçerli bir tarih giriniz')
    .custom(async (value, { req }) => {
      const appointmentDate = new Date(value);
      const now = new Date();

      // Geçmiş tarih kontrolü
      if (appointmentDate < now) {
        throw new Error('Randevu tarihi geçmiş bir tarih olamaz');
      }

      // Çalışma saatleri kontrolü (09:00 - 18:00)
      const hours = appointmentDate.getHours();
      if (hours < 9 || hours >= 18) {
        throw new Error('Randevu saati 09:00 - 18:00 arasında olmalıdır');
      }

      // Aynı tarih ve saatte başka randevu var mı kontrolü
      const existingAppointment = await Appointment.findOne({
        where: {
          appointment_date: {
            [Op.between]: [
              new Date(appointmentDate.setMinutes(appointmentDate.getMinutes() - 59)),
              new Date(appointmentDate.setMinutes(appointmentDate.getMinutes() + 59))
            ]
          },
          status: {
            [Op.notIn]: ['cancelled', 'completed']
          }
        }
      });

      if (existingAppointment) {
        throw new Error('Seçilen tarih ve saatte başka bir randevu bulunmaktadır');
      }

      return true;
    }),

  // Açıklama
  body('description')
    .optional()
    .isString()
    .isLength({ max: 500 }).withMessage('Açıklama en fazla 500 karakter olabilir'),

  // Validasyon sonuçlarını kontrol et
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateAppointment
}; 
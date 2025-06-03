const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const customerValidation = [
  body('name').notEmpty().withMessage('İsim zorunludur'),
  body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
  body('phone').notEmpty().withMessage('Telefon numarası zorunludur'),
  body('address').optional().isString()
];

// Routes
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    // Tüm müşterileri listele
  }
);

router.get(
  '/:id',
  authMiddleware,
  (req, res) => {
    // Belirli bir müşterinin detaylarını getir
  }
);

router.get(
  '/:id/vehicles',
  authMiddleware,
  (req, res) => {
    // Müşterinin araçlarını listele
  }
);

router.get(
  '/:id/appointments',
  authMiddleware,
  (req, res) => {
    // Müşterinin randevularını listele
  }
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  customerValidation,
  (req, res) => {
    // Yeni müşteri ekle
  }
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  customerValidation,
  (req, res) => {
    // Müşteri bilgilerini güncelle
  }
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    // Müşteri kaydını sil
  }
);

module.exports = router; 
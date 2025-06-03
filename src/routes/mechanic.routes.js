const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const mechanicValidation = [
  body('name').notEmpty().withMessage('İsim zorunludur'),
  body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
  body('phone').notEmpty().withMessage('Telefon numarası zorunludur'),
  body('specialization').optional().isString(),
  body('experience').optional().isInt({ min: 0 })
];

// Routes
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    // Tüm ustaları listele
  }
);

router.get(
  '/:id',
  authMiddleware,
  (req, res) => {
    // Belirli bir ustanın detaylarını getir
  }
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  mechanicValidation,
  (req, res) => {
    // Yeni usta ekle
  }
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  mechanicValidation,
  (req, res) => {
    // Usta bilgilerini güncelle
  }
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    // Usta kaydını sil
  }
);

module.exports = router; 
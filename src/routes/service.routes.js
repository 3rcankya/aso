const express = require('express');
const { body } = require('express-validator');
const ServiceController = require('../controllers/service.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const serviceValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Servis adı gereklidir')
    .isLength({ min: 3, max: 100 }).withMessage('Servis adı 3-100 karakter arasında olmalıdır'),
  body('category')
    .trim()
    .notEmpty().withMessage('Kategori gereklidir'),
  body('basePrice')
    .isFloat({ min: 0 }).withMessage('Geçerli bir başlangıç fiyatı giriniz'),
  body('estimatedDuration')
    .isInt({ min: 1 }).withMessage('Geçerli bir tahmini süre giriniz (dakika)'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Açıklama en fazla 1000 karakter olabilir'),
  body('requiredParts')
    .optional()
    .isArray().withMessage('Gerekli parçalar bir dizi olmalıdır'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('Geçerli bir aktiflik durumu giriniz'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notlar en fazla 500 karakter olabilir')
];

// Routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  serviceValidation,
  ServiceController.create
);

router.get(
  '/',
  authMiddleware,
  ServiceController.getAll
);

router.get(
  '/categories',
  authMiddleware,
  ServiceController.getCategories
);

router.get(
  '/:id',
  authMiddleware,
  ServiceController.getById
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  serviceValidation,
  ServiceController.update
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ServiceController.delete
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['admin']),
  body('isActive').isBoolean().withMessage('Geçerli bir aktiflik durumu giriniz'),
  ServiceController.updateStatus
);

module.exports = router; 
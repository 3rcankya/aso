const express = require('express');
const { body } = require('express-validator');
const AppointmentController = require('../controllers/appointment.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const appointmentValidation = [
  body('vehicleId').isInt().withMessage('Valid vehicle ID is required'),
  body('serviceId').isInt().withMessage('Valid service ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('description').optional().isString()
];

const updateAppointmentValidation = [
  body('mechanicId').optional().isInt(),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('estimatedCost').optional().isFloat({ min: 0 }),
  body('actualCost').optional().isFloat({ min: 0 }),
  body('notes').optional().isString()
];

// Routes
router.post(
  '/',
  authMiddleware,
  appointmentValidation,
  AppointmentController.create
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AppointmentController.getAll
);

router.get(
  '/:id',
  authMiddleware,
  AppointmentController.getById
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  updateAppointmentValidation,
  AppointmentController.update
);

router.put(
  '/:id/cancel',
  authMiddleware,
  AppointmentController.cancel
);

// Admin için randevu silme endpoint'i
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  AppointmentController.delete
);

module.exports = router; 
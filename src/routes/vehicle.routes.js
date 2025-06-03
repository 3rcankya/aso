const express = require('express');
const { body } = require('express-validator');
const VehicleController = require('../controllers/vehicle.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const vehicleValidation = [
  body('brand').notEmpty().withMessage('Brand is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Valid year is required'),
  body('licensePlate').notEmpty().withMessage('License plate is required'),
  body('vin').optional().isString(),
  body('color').optional().isString(),
  body('mileage').optional().isInt({ min: 0 })
];

// Routes
router.post(
  '/',
  authMiddleware,
  vehicleValidation,
  VehicleController.create
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  VehicleController.getAll
);

router.get(
  '/my-vehicles',
  authMiddleware,
  VehicleController.getCustomerVehicles
);

router.get(
  '/:id',
  authMiddleware,
  VehicleController.getById
);

router.put(
  '/:id',
  authMiddleware,
  vehicleValidation,
  VehicleController.update
);

module.exports = router; 
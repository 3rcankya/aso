const express = require('express');
const { body } = require('express-validator');
const InventoryController = require('../controllers/inventory.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const inventoryValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Valid unit price is required'),
  body('minimumStock').isInt({ min: 0 }).withMessage('Valid minimum stock is required'),
  body('description').optional().isString(),
  body('supplier').optional().isString(),
  body('location').optional().isString()
];

const updateStockValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
  body('operation')
    .isIn(['add', 'remove'])
    .withMessage('Operation must be either add or remove')
];

// Routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  inventoryValidation,
  InventoryController.create
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  InventoryController.getAll
);

router.get(
  '/low-stock',
  authMiddleware,
  roleMiddleware(['admin']),
  InventoryController.getLowStock
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  InventoryController.getById
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  inventoryValidation,
  InventoryController.update
);

router.put(
  '/:id/stock',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  updateStockValidation,
  InventoryController.updateStock
);

module.exports = router; 
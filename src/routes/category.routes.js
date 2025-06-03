const express = require('express');
const { body } = require('express-validator');
const CategoryController = require('../controllers/category.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required'),
  body('description').optional().isString()
];

// Routes under /api/admin/categories
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  categoryValidation,
  CategoryController.create
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  CategoryController.getAll
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  CategoryController.getById
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  categoryValidation,
  CategoryController.update
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  CategoryController.delete
);

module.exports = router; 
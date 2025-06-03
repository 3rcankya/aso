const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');
const AdminController = require('../controllers/admin.controller');
const AppointmentController = require('../controllers/appointment.controller');
const ServiceController = require('../controllers/service.controller');
const InventoryController = require('../controllers/inventory.controller');
const CategoryController = require('../controllers/category.controller');
// MechanicController henüz oluşturulmadı, User modelini kullanacağız
const { User } = require('../models');
const { Op } = require('sequelize');
const { body, query } = require('express-validator');

const router = express.Router();

// Validation middleware
const settingsValidation = [
  body('settings').isObject().withMessage('Ayarlar bir obje olmalıdır')
];
// Dashboard routes
router.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AdminController.getDashboardStats
);
// Report routes
router.get(
  '/reports',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AdminController.getReports
);
// Settings routes
router.get(
  '/settings',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.getSettings
);
router.put(
  '/settings',
  authMiddleware,
  roleMiddleware(['admin']),
  settingsValidation,
  AdminController.updateSettings
);
router.post(
  '/settings',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.updateSettings
);
router.post(
  '/upload',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.uploadFile
);
// User management routes
router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.getUsers
);
router.put(
  '/users/:id/status',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.updateUserStatus
);
router.put(
  '/users/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.updateUser
);
router.delete(
  '/users/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.deleteUser
);
router.post(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.createUser
);
router.put(
  '/appointments/:id/status',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AppointmentController.updateAppointmentStatus
);
router.post(
  '/appointments',
  authMiddleware,
  roleMiddleware(['admin', "mechanic"]),
  AppointmentController.create
);

// Appointments routes for admin and mechanics
router.get(
  '/appointments',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AppointmentController.getAll
);
router.put(
  '/appointments/:id',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AppointmentController.update
);
router.delete(
  '/appointments/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  AppointmentController.delete
);

// Services routes for admin and mechanics
router.get(
  '/services',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  ServiceController.getAll
);
router.delete(
  '/services/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ServiceController.delete
);
router.put(
  '/services/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  ServiceController.update
);
router.post(
  '/services',
  authMiddleware,
  roleMiddleware(['admin']),
  ServiceController.create
);

// Inventory routes for admin
router.get(
  '/inventory',
  authMiddleware,
  roleMiddleware(['admin']),
  InventoryController.getAll // Mevcut InventoryController metodunu kullan
);
router.delete(
  '/inventory/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  InventoryController.delete
);
router.put(
  '/inventory/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  InventoryController.update
);
router.post(
  '/inventory',
  authMiddleware,
  roleMiddleware(['admin']),
  InventoryController.create
);

// Customers routes for admin and mechanics
router.get(
  '/customers',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AdminController.getCustomers
);
router.post(
  '/customers',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AdminController.createCustomer
);

// Vehicles routes for admin and mechanics
router.get(
  '/vehicles',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AdminController.getVehicles
);
router.post(
  '/vehicles',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  AdminController.createVehicle
);

// Mechanics (Masters) routes for admin and mechanics
router.get(
  '/masters',
  authMiddleware,
  roleMiddleware(['admin', 'mechanic']),
  async (req, res) => {
    try {
      const { search } = req.query;
      const where = { role: 'mechanic' };

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      const mechanics = await User.findAll({
        where,
        attributes: { exclude: ['password'] }
      });

      res.json({ success: true, data: { mechanics } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.delete(
  '/masters/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.deleteMechanic
);
router.post(
  '/masters',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.createMechanic
);
router.put(
  '/masters/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.updateMechanic
);

// Categories routes for admin
router.get(
  '/categories',
  authMiddleware,
  roleMiddleware(['admin']),
  AdminController.getCategories // Mevcut InventoryController metodunu kullan
);
router.delete(
  'categories/:id',
  authMiddleware,
  roleMiddleware,
  AdminController.deleteCategory
)

module.exports = router; 
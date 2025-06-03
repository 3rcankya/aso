const { Vehicle, User } = require('../models');
const { validationResult } = require('express-validator');

class VehicleController {
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        brand,
        model,
        year,
        licensePlate,
        vin,
        color,
        mileage
      } = req.body;

      const vehicle = await Vehicle.create({
        customerId: req.user.id,
        brand,
        model,
        year,
        licensePlate,
        vin,
        color,
        mileage
      });

      res.status(201).json({
        success: true,
        message: 'Vehicle registered successfully',
        data: { vehicle }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to register vehicle',
        error: error.message
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { search } = req.query;
      const where = {};

      if (search) {
        where[Op.or] = [
          { brand: { [Op.like]: `%${search}%` } },
          { model: { [Op.like]: `%${search}%` } },
          { licensePlate: { [Op.like]: `%${search}%` } }
        ];
      }

      const vehicles = await Vehicle.findAll({
        where,
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: { vehicles }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get vehicles',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone']
          }
        ]
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        data: { vehicle }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get vehicle',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      // Check if user owns the vehicle or is admin
      if (vehicle.customerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const {
        brand,
        model,
        year,
        licensePlate,
        vin,
        color,
        mileage,
        lastServiceDate,
        notes
      } = req.body;

      await vehicle.update({
        brand: brand || vehicle.brand,
        model: model || vehicle.model,
        year: year || vehicle.year,
        licensePlate: licensePlate || vehicle.licensePlate,
        vin: vin || vehicle.vin,
        color: color || vehicle.color,
        mileage: mileage || vehicle.mileage,
        lastServiceDate: lastServiceDate || vehicle.lastServiceDate,
        notes: notes || vehicle.notes
      });

      res.json({
        success: true,
        message: 'Vehicle updated successfully',
        data: { vehicle }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update vehicle',
        error: error.message
      });
    }
  }

  static async getCustomerVehicles(req, res) {
    try {
      const vehicles = await Vehicle.findAll({
        where: { customerId: req.user.id },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: { vehicles }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get customer vehicles',
        error: error.message
      });
    }
  }
}

module.exports = VehicleController; 
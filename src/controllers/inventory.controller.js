const { Inventory } = require('../models');
const { Category } = require('../models');

const { validationResult } = require('express-validator');

class InventoryController {
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
        name,
        description,
        categoryId,
        quantity,
        price,
        unit,
        supplier,
        minimumStock,
        location
      } = req.body;

      const inventory = await Inventory.create({
        name,
        description,
        categoryId,
        quantity,
        price,
        unit,
        supplier,
        minimumStock,
        location
      });

      res.status(201).json({
        success: true,
        message: 'Inventory item created successfully',
        data: { inventory }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create inventory item',
        error: error.message
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { category, search } = req.query;
      const where = {};

      if (category) {
        where.category = category;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      const inventory = await Inventory.findAll({
        where,
        order: [['name', 'ASC']]
      });

      const inventoryWithCategory = await Promise.all(
        inventory.map(async (item) => {

          let categoryName = null;

          if (item.categoryId !== undefined && item.categoryId !== null) {
            const category = await Category.findOne({
              where: { id: Number(item.categoryId) }
            });
            categoryName = category ? category.name : null;
            console.log("Found category:", categoryName); // Debug log
          }

          const itemData = item.toJSON();
          return {
            ...itemData,
            category: categoryName,
            requiredParts: itemData.requiredParts ? itemData.requiredParts.split(', ') : []
          };
        })
      );

      res.json({
        success: true,
        data: { inventory: inventoryWithCategory }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get inventory items',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id);

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }

      res.json({
        success: true,
        data: { inventory }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get inventory item',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id);

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }

      const {
        name,
        description,
        categoryId,
        quantity,
        price,
        unit,
        supplier,
        minimumStock,
        location,
        isActive
      } = req.body;

      await inventory.update({
        name: name || inventory.name,
        description: description || inventory.description,
        categoryId: categoryId || inventory.categoryId,
        quantity: quantity || inventory.quantity,
        price: price || inventory.price,
        unit: unit || inventory.unit,
        supplier: supplier || inventory.supplier,
        minimumStock: minimumStock || inventory.minimumStock,
        location: location || inventory.location,
        isActive: isActive !== undefined ? isActive : inventory.isActive
      });

      res.json({
        success: true,
        message: 'Inventory item updated successfully',
        data: { inventory }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update inventory item',
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id);

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Envanter bulunamadı'
        });
      }

      // Soft delete - set isActive to false
      await inventory.update({ isActive: false });

      res.json({
        success: true,
        message: 'Envanter başarıyla silindi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Envanter silinirken bir hata oluştu',
        error: error.message
      });
    }
  }

  static async updateStock(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id);

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }

      const { quantity, operation } = req.body;

      if (operation === 'add') {
        await inventory.update({
          quantity: inventory.quantity + quantity,
          lastRestockDate: new Date()
        });
      } else if (operation === 'remove') {
        if (inventory.quantity < quantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock'
          });
        }
        await inventory.update({
          quantity: inventory.quantity - quantity
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid operation'
        });
      }

      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: { inventory }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update stock',
        error: error.message
      });
    }
  }

  static async getLowStock(req, res) {
    try {
      const lowStock = await Inventory.findAll({
        where: {
          quantity: {
            [Op.lte]: sequelize.col('minimumStock')
          },
          isActive: true
        }
      });

      res.json({
        success: true,
        data: { lowStock }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get low stock items',
        error: error.message
      });
    }
  }
}

module.exports = InventoryController; 
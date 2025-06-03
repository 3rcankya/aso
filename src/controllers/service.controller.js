const { Service } = require('../models');
const { Category } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

class ServiceController {
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
        basePrice,
        estimatedDuration,
        requiredParts,
        notes,
        isActive = true
      } = req.body;

      // Convert requiredParts array to string if it's an array
      const formattedRequiredParts = Array.isArray(requiredParts) 
        ? requiredParts.join(', ') 
        : requiredParts;

      // Check if service with same name exists
      const existingService = await Service.findOne({
        where: {
          name: {
            [Op.like]: name
          }
        }
      });

      if (existingService) {
        return res.status(400).json({
          success: false,
          message: 'Bu isimde bir servis zaten mevcut'
        });
      }

      const service = await Service.create({
        name,
        description,
        categoryId,
        basePrice,
        estimatedDuration,
        requiredParts: formattedRequiredParts,
        notes,
        isActive
      });

      res.status(201).json({
        success: true,
        message: 'Servis başarıyla oluşturuldu',
        data: { service }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis oluşturulurken bir hata oluştu',
        error: error.message
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { category, search, isActive, page = 1, limit = 10 } = req.query;
      const where = {};

      if (category) {
        where.category = category;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const offset = (page - 1) * limit;

      const { count, rows: services } = await Service.findAndCountAll({
        where,
        order: [['name', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const servicesWithCategory = await Promise.all(
        services.map(async (service) => {
          console.log("Service category_id:", service.categoryId); // Debug log
          let categoryName = null;

          if (service.categoryId !== undefined && service.categoryId !== null) {
            const category = await Category.findOne({
              where: { id: Number(service.categoryId) }
            });
            categoryName = category ? category.name : null;
            console.log("Found category:", categoryName); // Debug log
          }

          const serviceData = service.toJSON();
          return {
            ...serviceData,
            category: categoryName,
            requiredParts: serviceData.requiredParts ? serviceData.requiredParts.split(', ') : []
          };
        })
      );


      res.json({
        success: true,
        data: {
          services: servicesWithCategory,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servisler getirilirken bir hata oluştu',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Servis bulunamadı'
        });
      }

      res.json({
        success: true,
        data: { service }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis getirilirken bir hata oluştu',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const service = await Service.findByPk(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Servis bulunamadı'
        });
      }

      const {
        name,
        description,
        categoryId,
        basePrice,
        estimatedDuration,
        requiredParts,
        notes,
        isActive
      } = req.body;

      // Convert requiredParts array to string if it's an array
      const formattedRequiredParts = Array.isArray(requiredParts) 
        ? requiredParts.join(', ') 
        : requiredParts;

      // Check if new name conflicts with existing service
      if (name && name !== service.name) {
        const existingService = await Service.findOne({
          where: {
            name: {
              [Op.like]: name
            },
            id: {
              [Op.ne]: service.id
            }
          }
        });

        if (existingService) {
          return res.status(400).json({
            success: false,
            message: 'Bu isimde bir servis zaten mevcut'
          });
        }
      }

      await service.update({
        name: name || service.name,
        description: description !== undefined ? description : service.description,
        categoryId: categoryId || service.categoryId,
        basePrice: basePrice || service.basePrice,
        estimatedDuration: estimatedDuration || service.estimatedDuration,
        requiredParts: formattedRequiredParts || service.requiredParts,
        notes: notes !== undefined ? notes : service.notes,
        isActive: isActive !== undefined ? isActive : service.isActive
      });

      res.json({
        success: true,
        message: 'Servis başarıyla güncellendi',
        data: { service }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis güncellenirken bir hata oluştu',
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const service = await Service.findByPk(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Servis bulunamadı'
        });
      }

      // Soft delete - set isActive to false
      await service.update({ isActive: false });

      res.json({
        success: true,
        message: 'Servis başarıyla silindi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis silinirken bir hata oluştu',
        error: error.message
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const service = await Service.findByPk(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Servis bulunamadı'
        });
      }

      const { isActive } = req.body;

      await service.update({ isActive });

      res.json({
        success: true,
        message: `Servis ${isActive ? 'aktif' : 'pasif'} duruma getirildi`,
        data: { service }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis durumu güncellenirken bir hata oluştu',
        error: error.message
      });
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await Service.findAll({
        attributes: ['category'],
        group: ['category'],
        where: { isActive: true },
        order: [['category', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          categories: categories.map(c => c.category)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Servis kategorileri getirilirken bir hata oluştu',
        error: error.message
      });
    }
  }
}

module.exports = ServiceController;


const { Category } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class CategoryController {
  // Yeni kategori oluştur
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, description, type } = req.body;

      const category = await Category.create({
        name,
        description,
        type
      });

      res.status(201).json({ success: true, message: 'Category created successfully', data: { category } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
    }
  }

  // Tüm kategorileri listele
  static async getAll(req, res) {
    try {
      const { search } = req.query;
      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      const categories = await Category.findAll({
        where,
        order: [['name', 'ASC']],
      });

      res.json({ success: true, data: { categories } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get categories', error: error.message });
    }
  }

  // Belirli bir kategoriyi getir
  static async getById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      res.json({ success: true, data: { category } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get category', error: error.message });
    }
  }

  // Kategoriyi güncelle
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      const { name, description, type } = req.body;

      await category.update({
        name: name || category.name,
        type: type || category.type,
        description: description || category.description,
      });

      res.json({ success: true, message: 'Category updated successfully', data: { category } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
    }
  }

  // Kategoriyi sil
  static async delete(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      await category.update({ isActive: false });

      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
    }
  }
}

module.exports = CategoryController; 
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, email, password, phone, role } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'customer'
      });
      console.log(user, process.env.JWT_EXPIRES_IN);
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      console.log(token);
      console.log(process.env.JWT_SECRET);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Admin kontrolü
      if (email === process.env.ADMIN_EMAIL) {
        if (password === process.env.ADMIN_PASSWORD) {
          // Admin kullanıcısını bul veya oluştur
          let adminUser = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } });

          if (!adminUser) {
            // Admin kullanıcısı yoksa oluştur
            adminUser = await User.create({
              name: 'Admin',
              email: process.env.ADMIN_EMAIL,
              password: process.env.ADMIN_PASSWORD,
              phone: process.env.ADMIN_PHONE,
              role: 'admin',
              isActive: true
            });
          }

          // Admin token'ı oluştur
          const token = jwt.sign(
            { id: adminUser.id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          return res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: {
              id: adminUser.id,
              name: adminUser.name,
              phone: adminUser.phone,
              email: adminUser.email,
              role: 'admin'
            },
          });
        } else {
          return res.status(401).json({
            success: false,
            message: 'Geçersiz admin şifresi'
          });
        }
      }

      // Normal kullanıcı girişi
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Geçersiz şifre'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Hesabınız aktif değil'
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Giriş başarılı',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Giriş yapılırken bir hata oluştu',
        error: error.message
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, phone } = req.body;
      const user = await User.findByPk(req.user.id);

      await user.update({
        name: name || user.name,
        phone: phone || user.phone
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.user.id);

      const isValidPassword = await user.validatePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      await user.update({ password: newPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }
}

module.exports = AuthController; 
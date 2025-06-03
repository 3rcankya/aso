const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');

class AuthService {
  async register(userData) {
    try {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: userData.email },
            { phone: userData.phone }
          ]
        }
      });

      if (existingUser) {
        throw new Error('Email or phone number already exists');
      }
      console.log(userData, process.env.JWT_SECRET);
      const user = await User.create(userData);
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }  // 24 saat olarak ayarlandı
      );

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
          },
          token
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }  // 24 saat olarak ayarlandı
      );

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
          },
          token
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }
}

module.exports = new AuthService(); 
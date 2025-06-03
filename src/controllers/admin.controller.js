const { User, Appointment, AppointmentService, AppointmentInventory, Vehicle, Service, Inventory, Settings, Category } = require('../models');
const { Op, Sequelize } = require('sequelize');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/database');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Favicon için özel isimlendirme
    if (file.fieldname === 'favicon') {
      cb(null, 'favicon' + path.extname(file.originalname));
    } else {
      // Diğer dosyalar için normal isimlendirme
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Favicon için özel kontrol
  if (file.fieldname === 'favicon') {
    if (!file.originalname.match(/\.(ico|png)$/)) {
      return cb(new Error('Favicon sadece .ico veya .png formatında olabilir!'), false);
    }
  } else {
    // Diğer dosyalar için genel kontrol
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('file');

class AdminController {
  // Dashboard istatistiklerini getir
  async getDashboardStats(req, res) {
    try {
      const [
        totalCustomers,
        totalMechanics,
        totalAppointments,
        todayAppointments,
        totalVehicles,
        totalServices,
        lowStockItems
      ] = await Promise.all([
        User.count({ where: { role: 'customer' } }),
        User.count({ where: { role: 'mechanic' } }),
        Appointment.count(),
        Appointment.count({
          where: {
            appointmentDate: {
              [Op.between]: [
                new Date().setHours(0, 0, 0, 0),
                new Date().setHours(23, 59, 59, 999)
              ]
            }
          }
        }),
        Vehicle.count(),
        Service.count(),
        Inventory.count({
          where: {
            quantity: {
              [Op.lte]: 5 // Düşük stok eşiği
            }
          }
        })
      ]);

      res.json({
        totalCustomers,
        totalMechanics,
        totalAppointments,
        todayAppointments,
        totalVehicles,
        totalServices,
        lowStockItems
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Raporları getir
  async getReports(req, res) {
    try {
      const { type, startDate, endDate } = req.query;
      const where = {};

      if (startDate && endDate) {
        where.created_at = {
          [Op.between]: [startDate, endDate]
        };
      }

      let reportData = {};

      switch (type) {
        case 'appointments':
          const appointments = await Appointment.findAll({
            where,
            include: [
              {
                model: User,
                as: 'customer',
                attributes: ['id', 'name', 'phone']
              },
              {
                model: User,
                as: 'mechanic',
                attributes: ['id', 'name', 'phone']
              },
              {
                model: Vehicle,
                as: 'vehicle',
                attributes: ['id', 'brand', 'model', 'licensePlate']
              },
              {
                model: AppointmentService,
                as: 'appointmentServices',
                include: [{
                  model: Service,
                  as: 'Service',
                  attributes: ['id', 'name', 'basePrice']
                }]
              }
            ],
            order: [['appointmentDate', 'ASC']]
          });

          reportData = {
            appointments: appointments.map(appointment => ({
              id: appointment.id,
              trackingNumber: appointment.trackingNumber,
              date: appointment.appointmentDate,
              customer: appointment.customer,
              mechanic: appointment.mechanic,
              vehicle: appointment.vehicle,
              appointmentServices: appointment.appointmentServices,
              status: appointment.status,
              totalAmount: appointment.totalAmount
            }))
          };
          break;

        case 'revenue':
          const revenueData = await Appointment.findAll({
            where,
            attributes: [
              [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
              [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
              [sequelize.fn('COUNT', sequelize.col('id')), 'appointmentCount']
            ],
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
          });

          const totalRevenue = await Appointment.sum('total_amount', { where });
          const totalAppointments = await Appointment.count({ where });
          const averageRevenue = totalAppointments > 0 ? totalRevenue / totalAppointments : 0;

          reportData = {
            dailyRevenue: revenueData,
            totalRevenue,
            totalAppointments,
            averageRevenue
          };
          break;

        case 'mechanics':
          const mechanics = await User.findAll({
            where: { role: 'mechanic' },
            attributes: [
              'id',
              'name',
              [sequelize.fn('COUNT', sequelize.col('assignedAppointments.id')), 'totalAppointments'],
              [sequelize.fn('SUM', sequelize.col('assignedAppointments.total_amount')), 'totalRevenue'],
              [sequelize.fn('AVG', sequelize.col('assignedAppointments.total_amount')), 'averageRevenue']
            ],
            include: [{
              model: Appointment,
              as: 'assignedAppointments',
              attributes: [],
              where: {
                status: 'completed',
                ...where
              },
              required: false
            }],
            group: ['User.id'],
            order: [[sequelize.literal('totalRevenue'), 'DESC']]
          });

          reportData = mechanics.map(mechanic => ({
            id: mechanic.id,
            name: mechanic.name,
            totalAppointments: parseInt(mechanic.getDataValue('totalAppointments')) || 0,
            totalRevenue: parseFloat(mechanic.getDataValue('totalRevenue')) || 0,
            averageRevenue: parseFloat(mechanic.getDataValue('averageRevenue')) || 0
          }));
          break;

        case 'services':
          const services = await Service.findAll({
            attributes: [
              'id',
              'name',
              [sequelize.fn('COUNT', sequelize.col('AppointmentServices.id')), 'totalCount'],
              [sequelize.fn('SUM', sequelize.col('AppointmentServices.price')), 'totalRevenue']
            ],
            include: [{
              model: AppointmentService,
              as: 'appointmentServices',
              attributes: [],
              required: false,
              include: [{
                model: Appointment,
                as: 'Appointment',
                attributes: [],
                where,
                required: false
              }]
            }],
            group: ['Service.id'],
            order: [[sequelize.literal('totalRevenue'), 'DESC']]
          });

          reportData = services;
          break;

        default:
          throw new Error('Geçersiz rapor türü');
      }

      res.json({
        success: true,
        data: reportData
      });
    } catch (error) {
      console.error('Rapor oluşturma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Rapor oluşturulurken bir hata oluştu',
        error: error.message
      });
    }
  }

  // Ayarları getir
  async getSettings(req, res) {
    try {
      const settings = await Settings.findAll();
      const formattedSettings = settings.reduce((acc, setting) => {
        acc[setting.key] = {
          value: setting.value,
          description: setting.description,
          category: setting.category
        };
        return acc;
      }, {});

      res.json(formattedSettings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // Ayarları güncelle
  async updateSettings(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { settings } = req.body;

      // Her bir ayarı güncelle
      for (const [key, data] of Object.entries(settings)) {
        await Settings.update(
          {
            value: data.value || '', // Boş değer gelirse boş string olarak kaydet
            category: data.category,
            description: data.description || null
          },
          { where: { key } }
        );
      }

      // Güncellenmiş ayarları getir
      const updatedSettings = await Settings.findAll({
        attributes: ['key', 'value', 'description', 'category', 'is_active']
      });

      // Ayarları kategorilere göre grupla
      const formattedSettings = updatedSettings.reduce((acc, setting) => {
        const category = setting.category;
        if (!acc[category]) {
          acc[category] = {};
        }
        acc[category][setting.key] = {
          value: setting.value || '', // Boş değer gelirse boş string olarak döndür
          description: setting.description,
          is_active: setting.is_active
        };
        return acc;
      }, {});

      res.json({
        success: true,
        message: 'Ayarlar başarıyla güncellendi',
        data: formattedSettings
      });
    } catch (error) {
      console.error('Settings update error:', error);
      res.status(500).json({
        success: false,
        message: 'Ayarlar güncellenirken bir hata oluştu',
        error: error.message
      });
    }
  }

  // Kullanıcıları getir
  async getUsers(req, res) {
    try {
      const { role, search } = req.query;
      const where = {};

      if (role) {
        where.role = role;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      const users = await User.findAll({
        where,
        attributes: { exclude: ['password'] }
      });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, isActive, role } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      await user.update({ name, email, phone, isActive, role });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      await user.destroy();

      res.json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async createUser(req, res) {
    try {
      const { name, email, phone, role, password } = req.body;

      const user = await User.create({ name, email, phone, role, password: bcrypt.hashSync(".?1234567890", 10) });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCustomers(req, res) {
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        status
      } = req.query;

      // Build where clause
      const where = { role: 'customer' };

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } }
        ];
      }

      if (status) {
        where.isActive = status === 'active';
      }

      // Calculate pagination
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const total = await User.count({ where });

      // Get customers with pagination and sorting
      const customers = await User.findAll({
        where,
        attributes: {
          exclude: ['password'],
          include: [
            [
              Sequelize.literal(`(
                SELECT COUNT(*)
                FROM Appointments
                WHERE Appointments.customer_id = User.id
              )`),
              'appointmentCount'
            ],
            [
              Sequelize.literal(`(
                SELECT COUNT(*)
                FROM Vehicles
                WHERE Vehicles.customer_id = User.id
              )`),
              'vehicleCount'
            ]
          ]
        },
        include: [
          {
            model: Vehicle,
            as: 'vehicles',
            attributes: ['id', 'brand', 'model', 'licensePlate'],
            limit: 3
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedCustomers = customers.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isActive: customer.isActive,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        appointmentCount: customer.getDataValue('appointmentCount'),
        vehicleCount: customer.getDataValue('vehicleCount'),
        recentVehicles: customer.vehicles
      }));

      res.json({
        success: true,
        data: {
          customers: formattedCustomers,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error in getCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Müşteriler getirilirken bir hata oluştu',
        error: error.message
      });
    }
  }
  async createCustomer(req, res) {
    try {
      const { name, email, phone } = req.body;

      // Önce kullanıcıyı bul veya oluştur
      let customer = await User.findOne({
        where: { phone: phone }
      });

      if (!customer) {
        customer = await User.create({
          name: name,
          email: email,
          phone: phone,
          password: ".?1234567890",
          role: "customer"
        });
      }

      res.json({
        success: true,
        data: {
          customer
        }
      });
    } catch (error) {
      console.error('Error in createCustomer:', error);
      res.status(500).json({
        success: false,
        message: 'Müşteri oluşturulurken bir hata oluştu',
        error: error.message
      });
    }
  }

  async getVehicles(req, res) {
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        brand,
        model,
        year,
        customerId
      } = req.query;

      // Build where clause
      const where = {};

      if (search) {
        where[Op.or] = [
          { brand: { [Op.like]: `%${search}%` } },
          { model: { [Op.like]: `%${search}%` } },
          { licensePlate: { [Op.like]: `%${search}%` } }
        ];
      }

      if (brand) {
        where.brand = brand;
      }

      if (model) {
        where.model = model;
      }

      if (year) {
        where.year = year;
      }

      if (customerId) {
        where.customerId = customerId;
      }

      // Calculate pagination
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const total = await Vehicle.count({ where });

      // Get vehicles with pagination and sorting
      const vehicles = await Vehicle.findAll({
        where,
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                SELECT COUNT(*)
                FROM Appointments
                WHERE Appointments.vehicle_id = Vehicle.id
              )`),
              'appointmentCount'
            ]
          ]
        },
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone', 'email']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedVehicles = vehicles.map(vehicle => ({
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        vin: vehicle.vin,
        color: vehicle.color,
        mileage: vehicle.mileage,
        customer: vehicle.customer,
        appointmentCount: vehicle.getDataValue('appointmentCount'),
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt
      }));

      res.json({
        success: true,
        data: {
          vehicles: formattedVehicles,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error in getVehicles:', error);
      res.status(500).json({
        success: false,
        message: 'Araçlar getirilirken bir hata oluştu',
        error: error.message
      });
    }
  }
  async createVehicle(req, res) {
    try {
      const { customerId, brand, model, year, licensePlate, vin, color, mileage } = req.body;

      const vehicle = await Vehicle.create({
        customerId,
        brand,
        model,
        year,
        licensePlate,
        vin,
        color,
        mileage
      });

      res.json({
        success: true,
        data: {
          vehicle
        }
      });
    } catch (error) {
      console.error('Error in createVehicle:', error);
      res.status(500).json({
        success: false,
        message: 'Araç oluşturulurken bir hata oluştu',
        error: error.message
      });
    }
  }

  // Kullanıcı durumunu güncelle
  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { active } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      await user.update({ active });
      res.json({ message: 'Kullanıcı durumu güncellendi' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async deleteMechanic(req, res) {
    try {
      const { id } = req.params;

      const mechanic = await User.findByPk(id);

      if (!mechanic) {
        return res.status(404).json({ message: 'Usta bulunamadı' });
      }

      await mechanic.update({ isActive: false });

      res.json({ message: 'Usta başarıyla pasife alındı' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async createMechanic(req, res) {
    try {
      const { name, email, phone, specialization, experience } = req.body;

      console.log("asdasfasda", req.body);


      const mechanic = await User.create({
        name,
        email,
        phone,
        password: ".?1234567890",
        role: 'mechanic',
        speciality: specialization,
        experience
      });

      res.json(mechanic);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async updateMechanic(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, specialization, experience, status } = req.body;

      const mechanic = await User.findByPk(id);

      if (!mechanic) {
        return res.status(404).json({ message: 'Usta bulunamadı' });
      }

      await mechanic.update({ name, email, phone, speciality: specialization, experience, isActive: status === 'active' ? true : false });

      res.json(mechanic);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async createCategory(req, res) {
    try {
      const { name, description, type } = req.body;

      const category = await Category.create({ name, description });

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: 'Category bulunamadı' });
      }
      await category.update({ isActive: false });


      res.json({ message: 'Usta başarıyla pasife alındı' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description, type } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: 'Category bulunamadı' });
      }

      await category.update({ name, description, type });

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Dosya yükleme işlemi
  async uploadFile(req, res) {
    try {
      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            success: false,
            message: 'Dosya yüklenirken bir hata oluştu',
            error: err.message
          });
        } else if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'Lütfen bir dosya seçin'
          });
        }

        // Tam URL oluştur
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;


        res.json({
          success: true,
          message: 'Dosya başarıyla yüklendi',
          data: {
            url: fileUrl,
            filename: req.file.filename
          }
        });
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Dosya yüklenirken bir hata oluştu',
        error: error.message
      });
    }
  }
}

module.exports = new AdminController(); 
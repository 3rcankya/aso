const { Appointment, AppointmentService, AppointmentInventory } = require('../models/Appointment');
const { User, Vehicle, Service } = require('../models');
const { validationResult } = require('express-validator');
const SMSService = require('../services/sms.service');
const { generateTrackingNumber } = require('../utils/helpers');
const { Op } = require('sequelize');

class AppointmentController {
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
        // Müşteri bilgileri
        customerName,
        customerPhone,
        customerEmail,
        customerId, // Eğer mevcut müşteri ise

        // Araç bilgileri
        vehicleBrand,
        vehicleModel,
        vehicleType,
        vehicleYear,
        licensePlate,
        vehicleId, // Eğer mevcut araç ise

        // Randevu bilgileri
        serviceIds,
        mechanicId,
        appointmentDate,
        description,
        notes
      } = req.body;

      // 1. Müşteri işlemleri
      let customer;
      if (customerId) {
        customer = await User.findOne({
          where: {
            id: customerId,
            role: 'customer',
            isActive: true
          }
        });
        if (!customer) {
          throw new Error('Müşteri bulunamadı veya aktif değil');
        }
      } else {
        // Yeni müşteri oluştur veya mevcut müşteriyi bul
        customer = await User.findOne({
          where: { phone: customerPhone }
        });

        if (!customer) {
          customer = await User.create({
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            password: ".?1234567890", // Geçici şifre
            role: "customer",
            isActive: true
          });
        }
      }

      // 2. Araç işlemleri
      let vehicle;
      if (vehicleId) {
        vehicle = await Vehicle.findOne({
          where: {
            id: vehicleId,
            customerId: customer.id
          }
        });
        if (!vehicle) {
          throw new Error('Araç bulunamadı veya bu müşteriye ait değil');
        }
      } else {
        // Yeni araç oluştur veya mevcut aracı bul
        vehicle = await Vehicle.findOne({
          where: { licensePlate }
        });

        if (!vehicle) {
          vehicle = await Vehicle.create({
            brand: vehicleBrand,
            model: vehicleModel,
            type: vehicleType,
            year: vehicleYear,
            licensePlate,
            customerId: customer.id
          });
        } else {
          // Araç varsa bilgilerini güncelle
          await vehicle.update({
            brand: vehicleBrand,
            model: vehicleModel,
            type: vehicleType,
            year: vehicleYear,
            customerId: customer.id
          });
        }
      }

      // 3. Servis işlemleri
      const service_ids = Array.isArray(serviceIds) ? serviceIds : [serviceIds];
      const serviceRecords = await Service.findAll({
        where: {
          id: service_ids,
          isActive: true
        }
      });

      if (serviceRecords.length !== service_ids.length) {
        throw new Error('Bazı seçilen servisler bulunamadı veya aktif değil');
      }

      // 4. Usta kontrolü
      const mechanic = await User.findOne({
        where: {
          id: mechanicId,
          role: 'mechanic',
          isActive: true
        }
      });

      if (!mechanic) {
        throw new Error('Seçilen usta bulunamadı veya aktif değil');
      }

      // 5. Randevu oluşturma
      const trackingNumber = generateTrackingNumber();
      const appointment = await Appointment.create({
        customerId: customer.id,
        mechanicId: mechanic.id,
        vehicleId: vehicle.id,
        appointmentDate,
        description,
        notes,
        status: 'pending',
        trackingNumber
      });

      // 6. Randevu-Servis ilişkilerini oluştur
      await Promise.all(serviceRecords.map(service =>
        AppointmentService.create({
          appointmentId: appointment.id,
          serviceId: service.id,
          quantity: 1,
          price: service.basePrice
        })
      ));

      // 7. Toplam tutarı hesapla
      const totalAmount = serviceRecords.reduce((sum, service) => {
        const price = parseFloat(service.basePrice) || 0;
        return sum + price;
      }, 0);

      await appointment.update({ totalAmount });

      // 8. SMS bildirimi gönder
      try {
        await SMSService.sendAppointmentConfirmation(customer.phone, {
          trackingNumber: appointment.trackingNumber,
          date: new Date(appointmentDate).toLocaleDateString('tr-TR'),
          time: new Date(appointmentDate).toLocaleTimeString('tr-TR'),
          services: serviceRecords.map(s => s.name).join(', '),
          vehicle: `${vehicle.brand} ${vehicle.model}`
        });
      } catch (smsError) {
        console.error('SMS gönderimi başarısız:', smsError);
        // SMS hatası randevu oluşturmayı etkilemesin
      }

      // 9. Başarılı yanıt
      res.status(201).json({
        success: true,
        data: {
          appointment: {
            id: appointment.id,
            trackingNumber: appointment.trackingNumber,
            appointmentDate: appointment.appointmentDate,
            status: appointment.status,
            totalAmount: appointment.totalAmount,
            customer: {
              id: customer.id,
              name: customer.name,
              phone: customer.phone
            },
            vehicle: {
              id: vehicle.id,
              brand: vehicle.brand,
              model: vehicle.model,
              licensePlate: vehicle.licensePlate
            },
            services: serviceRecords.map(service => ({
              id: service.id,
              name: service.name,
              price: service.basePrice
            }))
          }
        },
        message: 'Randevu başarıyla oluşturuldu'
      });

    } catch (error) {
      console.error('Randevu oluşturma hatası:', error);

      let errorMessage = 'Randevu oluşturulurken bir hata oluştu';
      let statusCode = 500;

      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields.license_plate) {
          errorMessage = 'Bu plakaya sahip bir araç zaten kayıtlı';
          statusCode = 400;
        }
      } else if (error.message.includes('bulunamadı')) {
        statusCode = 404;
        errorMessage = error.message;
      } else if (error.message.includes('aktif değil')) {
        statusCode = 400;
        errorMessage = error.message;
      }

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      const where = {};

      if (status) {
        where.status = status;
      }

      if (startDate && endDate) {
        where.appointmentDate = {
          [Op.between]: [startDate, endDate]
        };
      }

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
              attributes: ['id', 'name', 'basePrice']
            }]
          }
        ],
        order: [['appointmentDate', 'ASC']]
      });

      res.json({
        success: true,
        data: { appointments }
      });
    } catch (error) {
      console.error('Appointments fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get appointments',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const appointment = await Appointment.findByPk(req.params.id, {
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
            attributes: ['id', 'brand', 'model', 'licensePlate']
          },
          {
            model: Service,
            attributes: ['id', 'name', 'basePrice']
          }
        ]
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.json({
        success: true,
        data: { appointment }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get appointment',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const appointment = await Appointment.findByPk(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      const {
        // Randevu bilgileri
        serviceIds,
        mechanicId,
        appointmentDate,
        description,
        notes
      } = req.body;

      await appointment.update({
        serviceIds: serviceIds || appointment.serviceIds,
        mechanicId: mechanicId || appointment.mechanicId,
        appointmentDate: appointmentDate || appointment.appointmentDate,
        description: description || appointment.description,
        notes: notes || appointment.notes
      });

      // Send SMS notification for status change
      if (appointment.status === 'completed') {
        const vehicle = await Vehicle.findByPk(appointment.vehicleId);
        const service = await Service.findByPk(appointment.serviceId);
        const customer = await User.findByPk(appointment.customerId);

        await SMSService.sendServiceCompletion(customer.phone, {
          vehicle: `${vehicle.brand} ${vehicle.model}`,
          service: service.name,
          cost: appointment.actualCost
        });
      }

      res.json({
        success: true,
        message: 'Appointment updated successfully',
        data: { appointment }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update appointment',
        error: error.message
      });
    }
  }

  static async cancel(req, res) {
    try {
      const appointment = await Appointment.findByPk(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      if (appointment.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel completed appointment'
        });
      }

      await appointment.update({ status: 'cancelled' });

      res.json({
        success: true,
        message: 'Appointment cancelled successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to cancel appointment',
        error: error.message
      });
    }
  }

  static async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const appointment = await Appointment.findByPk(id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Randevu bulunamadı'
        });
      }

      if (appointment.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Tamamlanmış randevunun durumu güncellenemez'
        });
      }

      await appointment.update({ status });

      res.json({
        success: true,
        message: 'Randevu durumu başarıyla güncellendi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Randevu durumu güncellenirken bir hata oluştu',
        error: error.message
      });
    }
  }

  // Randevu silme metodu
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Önce randevuyu bul
      const appointment = await Appointment.findByPk(id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Randevu bulunamadı'
        });
      }

      // İlişkili kayıtları sil
      await AppointmentService.destroy({
        where: { appointmentId: id }
      });

      await AppointmentInventory.destroy({
        where: { appointmentId: id }
      });

      // Randevuyu sil
      await appointment.destroy();

      res.json({
        success: true,
        message: 'Randevu başarıyla silindi'
      });
    } catch (error) {
      console.error('Randevu silme hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Randevu silinirken bir hata oluştu',
        error: error.message
      });
    }
  }
}

module.exports = AppointmentController; 
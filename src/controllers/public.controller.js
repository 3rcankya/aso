const { Appointment, AppointmentService, AppointmentInventory } = require('../models/Appointment');
const Service = require('../models/Service');
const Category = require('../models/Category');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const { generateTrackingNumber } = require('../utils/helpers');
const SMSService = require('../services/sms.service');


class PublicController {
  // Randevu oluşturma
  async createAppointment(req, res) {
    try {
      const {
        customerName,
        customerPhone,
        customerEmail,

        vehicleBrand,
        vehicleModel,
        vehicleType,
        vehicleYear,
        licensePlate,

        services,
        mechanicId,
        appointmentDate,
        description

      } = req.body;

      // Önce kullanıcıyı bul veya oluştur
      let user = await User.findOne({
        where: { phone: customerPhone }
      });

      if (!user) {
        user = await User.create({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          password: ".?1234567890",
          role: "customer"
        });
      }

      // Önce aracı ara, yoksa oluştur
      let vehicle = await Vehicle.findOne({
        where: { licensePlate }
      });

      if (!vehicle) {
        vehicle = await Vehicle.create({
          brand: vehicleBrand,
          model: vehicleModel,
          type: vehicleType,
          year: vehicleYear,
          licensePlate,
          customerId: user.id
        });
      } else {
        // Araç varsa bilgilerini güncelle
        await vehicle.update({
          brand: vehicleBrand,
          model: vehicleModel,
          type: vehicleType,
          year: vehicleYear,
          customerId: user.id
        });
      }

      // Seçilen servisleri kontrol et
      const serviceIds = Array.isArray(services) ? services : [services];
      const serviceRecords = await Service.findAll({
        where: {
          id: serviceIds,
          isActive: true
        }
      });

      if (serviceRecords.length !== serviceIds.length) {
        throw new Error('Bazı seçilen servisler bulunamadı veya aktif değil');
      }

      // Ustayı kontrol et
      const mechanic = await User.findOne({
        where: {
          id: mechanicId.id,
          role: 'mechanic',
          isActive: true
        }
      });

      if (!mechanic) {
        throw new Error('Seçilen usta bulunamadı veya aktif değil');
      }

      // Randevuyu oluştur
      const trackingNumber = generateTrackingNumber();
      const appointment = await Appointment.create({
        customerId: user.id,
        mechanicId: mechanic.id,
        vehicleId: vehicle.id,
        appointmentDate,
        description,
        status: 'pending',
        trackingNumber
      });

      // Randevu-Servis ilişkilerini oluştur
      await Promise.all(serviceRecords.map(service =>
        AppointmentService.create({
          appointmentId: appointment.id,
          serviceId: service.id,
          quantity: 1,
          price: service.basePrice
        })
      ));

      // Toplam tutarı hesapla
      const totalAmount = serviceRecords.reduce((sum, service) => {
        const price = parseFloat(service.basePrice) || 0;
        return sum + price;
      }, 0);

      await appointment.update({ totalAmount });

      // SMS bildirimi gönder
      try {
        await SMSService.sendAppointmentConfirmation(user.phone, {
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

      res.json({
        success: true,
        data: {
          appointment: {
            id: appointment.id,
            trackingNumber: appointment.trackingNumber,
            appointmentDate: appointment.appointmentDate,
            status: appointment.status,
            totalAmount: appointment.totalAmount,
            customer: {
              id: user.id,
              name: user.name,
              phone: user.phone
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
      console.error('Appointment creation error:', error);

      let errorMessage = 'Randevu oluşturulurken bir hata oluştu';
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields.license_plate) {
          errorMessage = 'Bu plakaya sahip bir araç zaten kayıtlı. Randevu oluşturuldu.';
        }
      } else if (error.message === 'Selected mechanic not found or not active') {
        errorMessage = 'Seçilen usta bulunamadı veya aktif değil.';
      } else if (error.message === 'Bazı seçilen servisler bulunamadı veya aktif değil') {
        errorMessage = error.message;
      }

      res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
  }

  // Randevu sorgulama
  async getAppointmentByTrackingNumber(req, res) {
    try {
      const { trackingNumber } = req.params;
      const appointment = await Appointment.findOne({
        where: { trackingNumber },
        include: [
          {
            model: User,
            as: 'customer',
            attributes: ['name', 'phone', 'email']
          },
          {
            model: Vehicle,
            as: 'vehicle',
            attributes: ['brand', 'model', 'year', 'licensePlate']
          },
          {
            model: AppointmentService,
            as: 'appointmentServices',
            include: [{
              model: Service,
              attributes: ['id', 'name', 'description', 'base_price']
            }]
          },
          {
            model: AppointmentInventory,
            as: 'appointmentInventory',
            include: [{
              model: Inventory,
              attributes: ['id', 'name', 'description', 'price']
            }]
          }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Hizmet ve parça toplamlarını hesapla
      const servicesTotal = appointment.appointmentServices?.reduce((sum, appointmentService) => {
        return sum + (appointmentService.price * appointmentService.quantity);
      }, 0) || 0;

      const inventoryTotal = appointment.appointmentInventory?.reduce((sum, appointmentInventory) => {
        return sum + (appointmentInventory.price * appointmentInventory.quantity);
      }, 0) || 0;

      const totalAmount = servicesTotal + inventoryTotal;

      res.json({
        success: true,
        data: {
          appointment: {
            trackingNumber: appointment.trackingNumber,
            status: appointment.status,
            appointmentDate: appointment.appointmentDate,
            description: appointment.description,
            customerName: appointment.customer.name,
            customerPhone: appointment.customer.phone,
            customerEmail: appointment.customer.email,
            vehicle: appointment.vehicle,
            services: appointment.appointmentServices?.map(appointmentService => ({
              name: appointmentService.Service.name,
              description: appointmentService.Service.description,
              quantity: appointmentService.quantity,
              price: appointmentService.price,
              total: appointmentService.price * appointmentService.quantity
            })) || [],
            inventory: appointment.appointmentInventory?.map(appointmentInventory => ({
              name: appointmentInventory.Inventory.name,
              description: appointmentInventory.Inventory.description,
              quantity: appointmentInventory.quantity,
              price: appointmentInventory.price,
              total: appointmentInventory.price * appointmentInventory.quantity
            })) || [],
            servicesTotal,
            inventoryTotal,
            totalAmount,
            paymentStatus: appointment.paymentStatus,
            notes: appointment.notes
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get appointment'
      });
    }
  }

  // Servis listesi
  async getServices(req, res) {
    try {
      const services = await Service.findAll({
        where: { isActive: true },
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
        data: { services: servicesWithCategory }
      });
    } catch (error) {
      console.error("Error in getServices:", error); // Debug log
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get services'
      });
    }
  }

  // Araç markaları
  async getVehicleBrands(req, res) {
    // Sabit araç markaları listesi
    const brands = [
      'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'BMW', 'Chevrolet', 'Chrysler',
      'Citroen', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'Ferrari', 'Fiat', 'Ford',
      'Honda', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini',
      'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 'Mazda', 'Mercedes-Benz',
      'Mercury', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Plymouth',
      'Pontiac', 'Porsche', 'Renault', 'Rolls-Royce', 'Saab', 'Saturn', 'Scion',
      'Seat', 'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo'
    ];

    res.json({
      success: true,
      data: { brands }
    });
  }

  // Usta listesi
  async getMechanics(req, res) {
    try {
      console.log('Fetching mechanics from database...'); // Debug log
      const mechanics = await User.findAll({
        where: {
          role: 'mechanic',
          isActive: true
        },
        attributes: ['id', 'name', 'phone', 'email'],
        order: [['name', 'ASC']]
      });
      console.log('Found mechanics:', mechanics); // Debug log
      res.json({
        success: true,
        data: {
          mechanics
        }
      });
    } catch (error) {
      console.error('Error in getMechanics:', error);
      res.status(500).json({
        success: false,
        message: 'Ustalar getirilirken bir hata oluştu'
      });
    }
  }
}

module.exports = new PublicController(); 
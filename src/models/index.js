const User = require('./User');
const Vehicle = require('./Vehicle');
const Service = require('./Service');
const Inventory = require('./Inventory');
const Category = require('./Category');
const Settings = require('./Settings');
const { Appointment, AppointmentService, AppointmentInventory } = require('./Appointment');
const sequelize = require('../config/database');

// User - Vehicle ilişkisi
User.hasMany(Vehicle, { foreignKey: 'customerId', as: 'vehicles' });
Vehicle.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

// User - Appointment ilişkisi (müşteri olarak)
User.hasMany(Appointment, { foreignKey: 'customerId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

// User - Appointment ilişkisi (teknisyen olarak)
User.hasMany(Appointment, { foreignKey: 'mechanicId', as: 'assignedAppointments' });
Appointment.belongsTo(User, { foreignKey: 'mechanicId', as: 'mechanic' });

// Vehicle - Appointment ilişkisi
Vehicle.hasMany(Appointment, { foreignKey: 'vehicleId', as: 'appointments' });
Appointment.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

// Category - Service ilişkisi
Category.hasMany(Service, { foreignKey: 'categoryId', as: 'services' });
Service.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Category - Inventory ilişkisi
Category.hasMany(Inventory, { foreignKey: 'categoryId', as: 'inventory' });
Inventory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Appointment - Service ilişkisi (ara tablo ile)
Appointment.hasMany(AppointmentService, {
  foreignKey: 'appointmentId',
  as: 'appointmentServices'
});
AppointmentService.belongsTo(Appointment, {
  foreignKey: 'appointmentId'
});

Service.hasMany(AppointmentService, {
  foreignKey: 'serviceId',
  as: 'appointmentServices'
});
AppointmentService.belongsTo(Service, {
  foreignKey: 'serviceId'
});

// Appointment - Inventory ilişkisi (ara tablo ile)
Appointment.hasMany(AppointmentInventory, {
  foreignKey: 'appointmentId',
  as: 'appointmentInventory'
});
AppointmentInventory.belongsTo(Appointment, {
  foreignKey: 'appointmentId'
});

Inventory.hasMany(AppointmentInventory, {
  foreignKey: 'inventoryId',
  as: 'appointmentInventory'
});
AppointmentInventory.belongsTo(Inventory, {
  foreignKey: 'inventoryId'
});

module.exports = {
  sequelize,
  User,
  Vehicle,
  Settings,
  Service,
  Inventory,
  Category,
  Appointment,
  AppointmentService,
  AppointmentInventory
}; 
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vehicles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isIn: [['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible', 'Pickup', 'Van', 'Minivan', 'Station Wagon', 'MPV', 'Microcar', 'Roadster', 'Cabrio', 'Fastback', 'Liftback', 'Limousine', 'Targa', 'Shooting Brake', 'Hardtop', 'Other','Diğer']]
        }
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      license_plate: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      vin: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mileage: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      last_service_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      engine_type: {
        type: Sequelize.ENUM('Petrol', 'Dizel', 'Hibrit', 'Elektrik', 'LPG', 'CNG'),
        allowNull: true
      },
      engine_size: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      transmission: {
        type: Sequelize.ENUM('Manuel', 'Otomatik', 'Yarı Otomatik', 'CVT', 'DSG'),
        allowNull: true
      },
      fuel_tank_capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      power: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      torque: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      doors: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      seats: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      length: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      wheelbase: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ground_clearance: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      trunk_capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fuel_consumption: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      acceleration: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      max_speed: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      emission_class: {
        type: Sequelize.ENUM('Euro 1', 'Euro 2', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6', 'Euro 7'),
        allowNull: true
      },
      warranty: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      service_interval: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      last_service_mileage: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      next_service_mileage: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      insurance_company: {
        type: Sequelize.STRING,
        allowNull: true
      },
      insurance_policy_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      insurance_expiry_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      registration_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      registration_expiry_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vehicles');
  }
}; 
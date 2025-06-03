const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'customer_id'
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: {
        args: [['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible', 'Pickup', 'Van', 'Minivan', 'Station Wagon', 'MPV', 'Microcar', 'Roadster', 'Cabrio', 'Fastback', 'Liftback', 'Limousine', 'Targa', 'Shooting Brake', 'Hardtop', 'Other','Diğer']],
        msg: 'Geçersiz araç tipi'
      }
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  licensePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'license_plate',
    validate: {
      notEmpty: true
    }
  },
  vin: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      len: [17, 17]
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  lastServiceDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_service_date'
  },
  engineType: {
    type: DataTypes.ENUM('Petrol', 'Dizel', 'Hibrit', 'Elektrik', 'LPG', 'CNG'),
    allowNull: true,
    field: 'engine_type'
  },
  engineSize: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'engine_size',
    validate: {
      min: 0.6,
      max: 8.0
    }
  },
  transmission: {
    type: DataTypes.ENUM('Manuel', 'Otomatik', 'Yarı Otomatik', 'CVT', 'DSG'),
    allowNull: true
  },
  fuelTankCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'fuel_tank_capacity',
    validate: {
      min: 0
    }
  },
  power: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  torque: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  doors: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 2,
      max: 5
    }
  },
  seats: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 2,
      max: 9
    }
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  wheelbase: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  groundClearance: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ground_clearance',
    validate: {
      min: 0
    }
  },
  trunkCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'trunk_capacity',
    validate: {
      min: 0
    }
  },
  fuelConsumption: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'fuel_consumption',
    validate: {
      min: 0
    }
  },
  acceleration: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  maxSpeed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'max_speed',
    validate: {
      min: 0
    }
  },
  emissionClass: {
    type: DataTypes.ENUM('Euro 1', 'Euro 2', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6', 'Euro 7'),
    allowNull: true,
    field: 'emission_class'
  },
  warranty: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  serviceInterval: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'service_interval',
    validate: {
      min: 0
    }
  },
  lastServiceMileage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'last_service_mileage',
    validate: {
      min: 0
    }
  },
  nextServiceMileage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'next_service_mileage',
    validate: {
      min: 0
    }
  },
  insuranceCompany: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'insurance_company'
  },
  insurancePolicyNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'insurance_policy_number'
  },
  insuranceExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'insurance_expiry_date'
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'registration_date'
  },
  registrationExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'registration_expiry_date'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'vehicles',
  indexes: [
    {
      unique: true,
      fields: ['license_plate']
    },
    {
      unique: true,
      fields: ['vin']
    }
  ]
});

module.exports = Vehicle; 